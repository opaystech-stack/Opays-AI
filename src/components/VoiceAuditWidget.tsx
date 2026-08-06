import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Sparkles, Loader2 } from "lucide-react";
import { Room, RoomEvent } from "livekit-client";

/**
 * Widget d'Audit Vocal Opays — « Diagnostic gratuit » conversationnel.
 *
 * Flux :
 *  1. POST /api/voice/token (token server Opays) → { token, url, room }
 *  2. Connexion WebRTC via livekit-client à wss://opays.io/rtc
 *  3. Session vocale avec l'agent d'audit (Amara) — STT/TTS/LLM 100% locaux
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

export function VoiceAuditWidget({ onFallback }: { onFallback?: () => void }) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<Room | null>(null);

  const stop = useCallback(async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    setState("idle");
    setError(null);
  }, []);

  const start = useCallback(async () => {
    setState("connecting");
    setError(null);
    try {
      // 1. Jeton auprès du token server Opays
      const res = await fetch("/api/voice/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Impossible d'obtenir une session vocale.");
      const data: TokenResponse = await res.json();

      // 2. Connexion WebRTC (ICE servers TURN fournis par le token server)
      const room = new Room({
        iceServers: data.ice_servers ?? [],
      });
      roomRef.current = room;

      room
        .on(RoomEvent.Disconnected, () => {
          setState("idle");
          roomRef.current = null;
        })
        .on(RoomEvent.ConnectionStateChanged, (cs) => {
          if (cs === "connected") setState("connected");
        });

      await room.connect(data.url, data.token);
      // L'agent rejoint la salle et ouvre la conversation
    } catch (e) {
      console.warn("[VoiceAudit] échec de connexion :", e);
      setState("error");
      setError(
        "La session vocale est momentanément indisponible. Utilisez le formulaire — votre demande sera traitée en personne.",
      );
    }
  }, []);

  useEffect(() => () => {
    void stop();
  }, [stop]);

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
          onClick={start}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
        >
          <Mic size={16} />
          Lancer l'audit vocal
        </button>
      )}

      {state === "connecting" && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-muted px-6 py-3 text-sm font-medium">
          <Loader2 size={16} className="animate-spin" />
          Connexion à votre auditrice…
        </div>
      )}

      {state === "connected" && (
        <div className="mt-5">
          <div className="flex items-center justify-center gap-2 rounded-full bg-success/15 px-6 py-3 text-sm font-medium text-success">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            Session active — parlez librement
          </div>
          <button
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
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <MicOff size={15} />
            {error}
          </div>
          {onFallback && (
            <button
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
