import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Sparkles, Loader2, Volume2 } from "lucide-react";
import { ConnectionState, createLocalAudioTrack, Room, RoomEvent } from "livekit-client";
import type { LocalAudioTrack } from "livekit-client";

/**
 * Widget d'Audit Vocal Opays — « Diagnostic gratuit » conversationnel.
 *
 * Flux :
 *  1. POST /api/voice/token (token server Opays) → { token, url, room }
 *  2. Connexion WebRTC via livekit-client à wss://opays.io
 *  3. Session vocale avec l'agent d'audit (Amara) — STT/TTS locaux, LLM via OpenRouter
 *
 * Fallback : si la session vocale échoue, le formulaire classique reste accessible.
 */

type VoiceState = "idle" | "connecting" | "connected" | "error";

interface TokenResponse {
  token: string;
  url: string;
  room: string;
  ice_servers?: { urls: string[]; username: string; credential: string }[];
}

function normalizeLiveKitUrl(url: string): string {
  const parsed = new URL(url);
  if (parsed.pathname === "/rtc" || parsed.pathname === "/rtc/") {
    parsed.pathname = "/";
  }
  return parsed.toString().replace(/\/$/, "");
}

const TOKEN_TIMEOUT_MS = 10_000;
const CONNECTION_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(label)), timeoutMs);
    promise.then(resolve, reject).finally(() => window.clearTimeout(timeout));
  });
}

function getVoiceErrorMessage(error: unknown): string {
  const name =
    error instanceof DOMException ? error.name : error instanceof Error ? error.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Autorisez l'accès au microphone dans votre navigateur, puis relancez l'audit vocal.";
    case "NotFoundError":
      return "Aucun microphone n'est détecté sur cet appareil. Utilisez le formulaire écrit ou branchez un microphone.";
    case "NotReadableError":
      return "Le microphone est déjà utilisé par une autre application. Fermez-la, puis relancez l'audit.";
    case "AbortError":
      return "La demande d'accès au microphone a été interrompue. Relancez l'audit vocal.";
    default:
      return "La session vocale n'a pas pu démarrer. Vérifiez votre connexion et l'autorisation du microphone, puis réessayez.";
  }
}

export function VoiceAuditWidget({ onFallback }: { onFallback?: () => void }) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const roomRef = useRef<Room | null>(null);
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const audioElementsRef = useRef<HTMLMediaElement[]>([]);
  const tokenAbortControllerRef = useRef<AbortController | null>(null);
  const startAttemptRef = useRef(0);
  const mountedRef = useRef(true);

  const removeAudioElements = useCallback(() => {
    for (const element of audioElementsRef.current) {
      element.pause();
      element.remove();
    }
    audioElementsRef.current = [];
  }, []);

  const stopLocalAudioTrack = useCallback((track = localAudioTrackRef.current) => {
    if (!track) return;
    if (localAudioTrackRef.current === track) {
      localAudioTrackRef.current = null;
    }
    track.stop();
  }, []);

  const disconnectRoom = useCallback(async (room: Room) => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await room.disconnect();
      } catch (disconnectError) {
        lastError = disconnectError;
      }
      if (room.state === ConnectionState.Disconnected) break;
    }

    for (const publication of room.localParticipant.trackPublications.values()) {
      publication.track?.stop();
    }
    const disconnected = room.state === ConnectionState.Disconnected;
    if (!disconnected) {
      console.warn("[VoiceAudit] déconnexion LiveKit incomplète :", lastError);
    }
    return disconnected;
  }, []);

  const cleanupRoom = useCallback(async () => {
    tokenAbortControllerRef.current?.abort();
    tokenAbortControllerRef.current = null;
    stopLocalAudioTrack();
    const room = roomRef.current;
    if (room) {
      const disconnected = await disconnectRoom(room);
      if (disconnected && roomRef.current === room) {
        roomRef.current = null;
      }
    }
    removeAudioElements();
  }, [disconnectRoom, removeAudioElements, stopLocalAudioTrack]);

  const stop = useCallback(async () => {
    startAttemptRef.current += 1;
    await cleanupRoom();
    if (mountedRef.current) {
      setState("idle");
      setError(null);
      setAudioBlocked(false);
    }
  }, [cleanupRoom]);

  const enableAudio = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      await room.startAudio();
      if (mountedRef.current && roomRef.current === room) {
        setAudioBlocked(!room.canPlaybackAudio);
      }
    } catch (playbackError) {
      console.warn("[VoiceAudit] lecture audio toujours bloquée :", playbackError);
      if (mountedRef.current && roomRef.current === room) {
        setAudioBlocked(true);
      }
    }
  }, []);

  const start = useCallback(async () => {
    await cleanupRoom();
    if (!mountedRef.current) return;
    if (roomRef.current) {
      setState("error");
      setError(
        "La session précédente n'a pas pu être fermée correctement. Rechargez la page avant de réessayer.",
      );
      return;
    }
    const attempt = startAttemptRef.current + 1;
    startAttemptRef.current = attempt;
    const isCurrentAttempt = () => mountedRef.current && startAttemptRef.current === attempt;
    const tokenAbortController = new AbortController();
    tokenAbortControllerRef.current?.abort();
    tokenAbortControllerRef.current = tokenAbortController;
    setState("connecting");
    setError(null);
    setAudioBlocked(false);
    let room: Room | null = null;
    let localAudioTrack: LocalAudioTrack | null = null;
    let connectionEstablished = false;
    try {
      // 1. Jeton auprès du token server Opays
      const data = await withTimeout(
        (async () => {
          const res = await fetch("/api/voice/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            signal: tokenAbortController.signal,
          });
          if (!res.ok) throw new Error("Impossible d'obtenir une session vocale.");
          return (await res.json()) as TokenResponse;
        })(),
        TOKEN_TIMEOUT_MS,
        "token-timeout",
      );
      if (tokenAbortControllerRef.current === tokenAbortController) {
        tokenAbortControllerRef.current = null;
      }
      if (!isCurrentAttempt()) return;

      // 2. Connexion WebRTC (ICE servers TURN fournis par le token server)
      room = new Room();
      roomRef.current = room;

      room
        .on(RoomEvent.Disconnected, () => {
          if (roomRef.current !== room) return;
          if (!connectionEstablished) return;
          roomRef.current = null;
          stopLocalAudioTrack(localAudioTrack);
          startAttemptRef.current += 1;
          removeAudioElements();
          if (mountedRef.current) {
            setState((current) => (current === "error" ? current : "idle"));
          }
        })
        .on(RoomEvent.MediaDevicesError, (deviceError) => {
          console.warn("[VoiceAudit] erreur de périphérique média :", deviceError.name);
        })
        .on(RoomEvent.AudioPlaybackStatusChanged, (canPlay) => {
          if (isCurrentAttempt()) setAudioBlocked(!canPlay);
        })
        .on(RoomEvent.DataReceived, (payload) => {
          if (!isCurrentAttempt()) return;
          const marker = new TextDecoder().decode(payload);
          if (marker === "voice-audit:user-input-final") {
            window.dispatchEvent(new CustomEvent("voice-audit:user-input-final"));
          }
        })
        .on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind !== "audio" || !isCurrentAttempt()) return;
          const element = track.attach();
          element.autoplay = true;
          element.dataset.voiceAuditAudio = "true";
          element.setAttribute("playsinline", "true");
          element.setAttribute("aria-hidden", "true");
          element.style.display = "none";
          document.body.appendChild(element);
          audioElementsRef.current.push(element);
          void element.play().catch((playbackError) => {
            console.warn("[VoiceAudit] lecture audio bloquée :", playbackError);
            if (isCurrentAttempt()) setAudioBlocked(true);
          });
        })
        .on(RoomEvent.TrackUnsubscribed, (track) => {
          for (const element of track.detach()) {
            audioElementsRef.current = audioElementsRef.current.filter(
              (current) => current !== element,
            );
            element.remove();
          }
        });

      await withTimeout(
        room.connect(normalizeLiveKitUrl(data.url), data.token, {
          rtcConfig: { iceServers: data.ice_servers ?? [] },
        }),
        CONNECTION_TIMEOUT_MS,
        "connection-timeout",
      );
      connectionEstablished = true;
      if (!isCurrentAttempt()) {
        await disconnectRoom(room);
        return;
      }
      try {
        await withTimeout(room.startAudio(), CONNECTION_TIMEOUT_MS, "audio-start-timeout");
      } catch (playbackError) {
        console.warn("[VoiceAudit] lecture audio à débloquer :", playbackError);
        if (isCurrentAttempt()) setAudioBlocked(true);
      }
      if (!isCurrentAttempt()) {
        await disconnectRoom(room);
        return;
      }
      const trackPromise = createLocalAudioTrack();
      void trackPromise
        .then((track) => {
          if (!isCurrentAttempt()) track.stop();
        })
        .catch(() => undefined);
      localAudioTrack = await withTimeout(
        trackPromise,
        CONNECTION_TIMEOUT_MS,
        "microphone-timeout",
      );
      if (!isCurrentAttempt()) {
        localAudioTrack.stop();
        await disconnectRoom(room);
        return;
      }
      localAudioTrackRef.current = localAudioTrack;
      await withTimeout(
        room.localParticipant.publishTrack(localAudioTrack),
        CONNECTION_TIMEOUT_MS,
        "microphone-publish-timeout",
      );
      if (!isCurrentAttempt()) {
        stopLocalAudioTrack(localAudioTrack);
        await disconnectRoom(room);
        return;
      }
      setState("connected");
    } catch (e) {
      if (!isCurrentAttempt()) {
        stopLocalAudioTrack(localAudioTrack);
        if (roomRef.current === room) {
          await cleanupRoom();
        } else if (room) {
          await disconnectRoom(room);
        }
        return;
      }
      console.warn("[VoiceAudit] échec de connexion :", e);
      startAttemptRef.current += 1;
      stopLocalAudioTrack(localAudioTrack);
      if (roomRef.current === room) {
        await cleanupRoom();
      }
      if (!mountedRef.current) return;
      setState("error");
      setError(getVoiceErrorMessage(e));
    }
  }, [cleanupRoom, disconnectRoom, removeAudioElements, stopLocalAudioTrack]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      startAttemptRef.current += 1;
      tokenAbortControllerRef.current?.abort();
      void cleanupRoom();
    };
  }, [cleanupRoom]);

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
          <Sparkles size={22} className="text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold">Audit vocal gratuit</h3>
          <p className="text-sm text-muted-foreground">
            Parlez avec notre auditrice IA (5 minutes), recevez vos recommandations.
          </p>
        </div>
      </div>

      {state === "idle" && (
        <button
          type="button"
          onClick={start}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
        >
          <Mic size={16} />
          Lancer l'audit vocal
        </button>
      )}

      {state === "connecting" && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-muted px-6 py-3 text-sm font-medium"
        >
          <Loader2 size={16} className="animate-spin" />
          Connexion à votre auditrice…
        </div>
      )}

      {state === "connected" && (
        <div className="mt-5">
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center gap-2 rounded-full bg-success/15 px-6 py-3 text-sm font-medium text-success"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            Session active — parlez librement
          </div>
          {audioBlocked && (
            <button
              type="button"
              onClick={enableAudio}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01]"
            >
              <Volume2 size={16} />
              Activer le son
            </button>
          )}
          <button
            type="button"
            onClick={stop}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <PhoneOff size={15} />
            Terminer l'appel
          </button>
        </div>
      )}

      {state === "error" && (
        <div className="mt-5">
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <MicOff size={15} />
            {error}
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01]"
          >
            <Mic size={15} />
            Réessayer l'audit vocal
          </button>
          {onFallback && (
            <button
              type="button"
              onClick={onFallback}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
            >
              Utiliser le formulaire écrit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
