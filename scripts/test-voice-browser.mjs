import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { analyzeConversationTimeline } from "./voice-conversation-oracle.mjs";

const url = process.env.VOICE_URL ?? "https://opays.io/contact/?voice-e2e=playwright";
const executablePath =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
function createToneWave(directory) {
  const sampleRate = 48_000;
  const sampleCount = sampleRate * 60;
  const pcmBytes = sampleCount * 2;
  const wave = Buffer.alloc(44 + pcmBytes);
  wave.write("RIFF", 0);
  wave.writeUInt32LE(36 + pcmBytes, 4);
  wave.write("WAVEfmt ", 8);
  wave.writeUInt32LE(16, 16);
  wave.writeUInt16LE(1, 20);
  wave.writeUInt16LE(1, 22);
  wave.writeUInt32LE(sampleRate, 24);
  wave.writeUInt32LE(sampleRate * 2, 28);
  wave.writeUInt16LE(2, 32);
  wave.writeUInt16LE(16, 34);
  wave.write("data", 36);
  wave.writeUInt32LE(pcmBytes, 40);
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const withinSecond = sampleIndex % sampleRate;
    const sample =
      withinSecond < sampleRate * 0.8
        ? Math.round(9_000 * Math.sin((2 * Math.PI * 440 * sampleIndex) / sampleRate))
        : 0;
    wave.writeInt16LE(sample, 44 + sampleIndex * 2);
  }
  const file = join(directory, "voice-audit-fake-mic.wav");
  writeFileSync(file, wave);
  return file;
}

function loadAttestedFixture(audioFile, metadataFile) {
  if (!metadataFile) {
    throw new Error("FULL_CONVERSATION requires FAKE_AUDIO_METADATA from Piper/STT validation");
  }
  const metadata = JSON.parse(readFileSync(metadataFile, "utf8"));
  const audioSha256 = createHash("sha256").update(readFileSync(audioFile)).digest("hex");
  if (
    metadata.schemaVersion !== 1 ||
    metadata.generator !== "piper" ||
    metadata.validator !== "faster-whisper" ||
    metadata.validated !== true ||
    metadata.validatedExpectedResponse !== "validation conversationnelle réussie" ||
    metadata.audioSha256 !== audioSha256
  ) {
    throw new Error("FULL_CONVERSATION requires a Piper fixture attested by faster-whisper");
  }
  const speechStartMs = Number(metadata.speechStartMs);
  const speechEndMs = Number(metadata.speechEndMs);
  if (
    !Number.isFinite(speechStartMs) ||
    !Number.isFinite(speechEndMs) ||
    speechEndMs <= speechStartMs
  ) {
    throw new Error("Attested fixture has invalid speech bounds");
  }
  return { speechStartMs, speechEndMs };
}

function sanitize(message) {
  return message
    .replace(/access_token=[^&\s]+/gi, "access_token=<redacted>")
    .replace(/join_request=[^&\s]+/gi, "join_request=<redacted>")
    .replace(/\bBearer\s+[^\s,;]+/gi, "Bearer <redacted>")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "<jwt-redacted>");
}

let generatedAudioDirectory = null;
let browser;
let context;
let page;
const warnings = [];
const errors = [];

try {
  const fullConversation = process.env.FULL_CONVERSATION === "1";
  if (fullConversation && !process.env.FAKE_AUDIO_FILE) {
    throw new Error("FULL_CONVERSATION requires FAKE_AUDIO_FILE with intelligible speech");
  }
  let speechStartMs = Number.NaN;
  let speechEndMs = Number.NaN;
  const conversationResponseTimeoutMs = Number(
    process.env.CONVERSATION_RESPONSE_TIMEOUT_MS ?? 30_000,
  );
  if (
    fullConversation &&
    (!Number.isFinite(conversationResponseTimeoutMs) || conversationResponseTimeoutMs <= 0)
  ) {
    throw new Error("FULL_CONVERSATION requires a positive response timeout");
  }
  const audioFile =
    process.env.FAKE_AUDIO_FILE ??
    (() => {
      generatedAudioDirectory = mkdtempSync(join(tmpdir(), "opays-voice-e2e-"));
      return createToneWave(generatedAudioDirectory);
    })();
  if (fullConversation) {
    ({ speechStartMs, speechEndMs } = loadAttestedFixture(
      audioFile,
      process.env.FAKE_AUDIO_METADATA,
    ));
  }
  const browserArgs = [
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    `--use-file-for-fake-audio-capture=${audioFile}`,
  ];
  if (process.env.PERMISSIVE_AUTOPLAY === "1") {
    browserArgs.push("--autoplay-policy=no-user-gesture-required");
  }

  browser = await chromium.launch({
    executablePath,
    headless: true,
    args: browserArgs,
  });

  const origin = new URL(url).origin;
  context = await browser.newContext();
  if (process.env.GRANT_MIC_PERMISSION !== "0") {
    await context.grantPermissions(["microphone"], { origin });
  }
  const blockAudioPlay = process.env.BLOCK_AUDIO_PLAY === "1";
  const forceTurnRelay = process.env.FORCE_TURN_RELAY === "1";
  const unmountDuringMic = process.env.UNMOUNT_DURING_MIC === "1";
  const expectMicTimeout = process.env.EXPECT_MIC_TIMEOUT === "1";
  if (blockAudioPlay) {
    await context.addInitScript(() => {
      const originalPlay = HTMLMediaElement.prototype.play;
      let audioUnlocked = false;
      document.addEventListener(
        "click",
        (event) => {
          const target = event.target;
          if (
            target instanceof Element &&
            target.closest("button")?.textContent?.includes("Activer le son")
          ) {
            audioUnlocked = true;
          }
        },
        true,
      );
      HTMLMediaElement.prototype.play = function play() {
        if (!audioUnlocked) {
          return Promise.reject(
            new DOMException("Playback requires a user gesture", "NotAllowedError"),
          );
        }
        return originalPlay.call(this);
      };
    });
  }
  if (forceTurnRelay) {
    await context.addInitScript(() => {
      const OriginalPeerConnection = window.RTCPeerConnection;
      class RelayOnlyPeerConnection extends OriginalPeerConnection {
        constructor(configuration = {}) {
          super({ ...configuration, iceTransportPolicy: "relay" });
        }
      }
      window.RTCPeerConnection = RelayOnlyPeerConnection;
      if (window.webkitRTCPeerConnection) {
        window.webkitRTCPeerConnection = RelayOnlyPeerConnection;
      }
    });
  }
  const microphoneDelayMs = Number(
    process.env.MIC_PERMISSION_DELAY_MS ??
      (expectMicTimeout ? 21_500 : unmountDuringMic ? 1500 : 0),
  );
  await context.addInitScript((delayMs) => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => {
      window.__voiceAuditMicRequested = true;
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      const stream = await original(...args);
      window.__voiceAuditCapturedTracks = stream.getTracks();
      window.__voiceAuditMicResolved = true;
      window.__voiceAuditMicStartedAt = performance.now();
      return stream;
    };
  }, microphoneDelayMs);
  page = await context.newPage();
  await page.addInitScript(() => {
    window.addEventListener("voice-audit:user-input-final", () => {
      window.__voiceAuditAssistantTurnAt ??= performance.now();
    });
  });
  const tokenEndpoint = process.env.TOKEN_ENDPOINT;
  if (tokenEndpoint) {
    const tokenRequestOrigin = process.env.TOKEN_REQUEST_ORIGIN ?? new URL(tokenEndpoint).origin;
    await page.route("**/api/voice/token", async (route) => {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: tokenRequestOrigin,
        },
        body: "{}",
        signal: AbortSignal.timeout(10_000),
      });
      await route.fulfill({
        status: response.status,
        contentType: response.headers.get("content-type") ?? "application/json",
        body: await response.text(),
      });
    });
  }

  page.on("console", (message) => {
    if (message.type() === "warning") warnings.push(sanitize(message.text()));
    if (message.type() === "error") errors.push(sanitize(message.text()));
  });
  page.on("pageerror", (error) => errors.push(sanitize(error.message)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  const documentTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.getByRole("button", { name: "Lancer l'audit vocal" }).click();

  if (expectMicTimeout) {
    await page.getByRole("button", { name: "Réessayer l'audit vocal" }).waitFor({
      state: "visible",
      timeout: 45_000,
    });
    await page.waitForFunction(() => window.__voiceAuditMicResolved === true, undefined, {
      timeout: microphoneDelayMs + 15_000,
    });
    await page.waitForFunction(
      () => {
        const tracks = window.__voiceAuditCapturedTracks ?? [];
        return tracks.length > 0 && tracks.every((track) => track.readyState === "ended");
      },
      undefined,
      { timeout: 5_000 },
    );
    const trackStates = await page.evaluate(() =>
      (window.__voiceAuditCapturedTracks ?? []).map((track) => track.readyState),
    );
    console.log(JSON.stringify({ status: "PASS", scenario: "microphone-timeout", trackStates }));
  } else if (unmountDuringMic) {
    await page.waitForFunction(() => window.__voiceAuditMicRequested === true, undefined, {
      timeout: 30_000,
    });
    await page.getByRole("navigation").getByRole("link", { name: "Accueil", exact: true }).click();
    await page.waitForURL((currentUrl) => currentUrl.pathname === "/", { timeout: 15_000 });
    await page.waitForFunction(() => window.__voiceAuditMicResolved === true, undefined, {
      timeout: microphoneDelayMs + 15_000,
    });
    const unmountResult = await page.evaluate((initialTimeOrigin) => {
      const tracks = window.__voiceAuditCapturedTracks ?? [];
      return {
        sameDocument: performance.timeOrigin === initialTimeOrigin,
        requested: window.__voiceAuditMicRequested === true,
        resolved: window.__voiceAuditMicResolved === true,
        trackStates: tracks.map((track) => track.readyState),
      };
    }, documentTimeOrigin);
    if (
      !unmountResult.sameDocument ||
      !unmountResult.requested ||
      !unmountResult.resolved ||
      unmountResult.trackStates.length === 0 ||
      unmountResult.trackStates.some((readyState) => readyState !== "ended")
    ) {
      throw new Error(`Microphone encore actif après démontage: ${JSON.stringify(unmountResult)}`);
    }
    console.log(
      JSON.stringify({ status: "PASS", scenario: "unmount-during-microphone", unmountResult }),
    );
  } else {
    const sessionActive = page.getByText("Session active — parlez librement");
    await sessionActive.waitFor({ state: "visible", timeout: 30_000 });

    await page.waitForFunction(
      () => document.querySelectorAll("audio[data-voice-audit-audio]").length > 0,
      undefined,
      { timeout: 45_000 },
    );
    if (blockAudioPlay) {
      const unlockAudio = page.getByRole("button", { name: "Activer le son" });
      await unlockAudio.waitFor({ state: "visible", timeout: 15_000 });
      await unlockAudio.click();
    }
    await page.waitForFunction(
      () => {
        const audio = document.querySelector("audio[data-voice-audit-audio]");
        const stream = audio?.srcObject instanceof MediaStream ? audio.srcObject : null;
        const hasLiveTrack = stream?.getAudioTracks().some((track) => track.readyState === "live");
        return Boolean(audio && audio.currentTime > 0.1 && !audio.paused && hasLiveTrack);
      },
      undefined,
      { timeout: 20_000 },
    );

    const audioState = await page.evaluate(() => {
      const audio = document.querySelector("audio[data-voice-audit-audio]");
      if (!audio) return null;
      const stream = audio.srcObject instanceof MediaStream ? audio.srcObject : null;
      return {
        autoplay: audio.autoplay,
        paused: audio.paused,
        currentTime: audio.currentTime,
        readyState: audio.readyState,
        muted: audio.muted,
        volume: audio.volume,
        tracks:
          stream?.getAudioTracks().map((track) => ({
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState,
          })) ?? [],
      };
    });

    const requireGreetingAfterActive = process.env.REQUIRE_GREETING_AFTER_ACTIVE === "1";
    const greetingSignal =
      requireGreetingAfterActive && !fullConversation
        ? await page.evaluate(async () => {
            const audio = document.querySelector("audio[data-voice-audit-audio]");
            if (!audio || !(audio.srcObject instanceof MediaStream)) {
              throw new Error("Remote audio MediaStream is unavailable");
            }
            const context = new AudioContext();
            const source = context.createMediaStreamSource(audio.srcObject);
            const analyser = context.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);
            await context.resume();
            const data = new Float32Array(analyser.fftSize);
            let maxRms = 0;
            let activeSamples = 0;
            for (let index = 0; index < 80; index += 1) {
              analyser.getFloatTimeDomainData(data);
              let sumSquares = 0;
              for (const sample of data) sumSquares += sample * sample;
              const rms = Math.sqrt(sumSquares / data.length);
              maxRms = Math.max(maxRms, rms);
              if (rms > 0.003) activeSamples += 1;
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            await context.close();
            return { maxRms, activeSamples };
          })
        : null;

    if (
      requireGreetingAfterActive &&
      !fullConversation &&
      (!greetingSignal || greetingSignal.activeSamples < 3)
    ) {
      throw new Error("No audible greeting after microphone activation");
    }

    const rawConversationSignal = fullConversation
      ? await page.evaluate(
          async ({ speechEndMs, responseTimeoutMs }) => {
            const audio = document.querySelector("audio[data-voice-audit-audio]");
            if (!audio || !(audio.srcObject instanceof MediaStream)) {
              throw new Error("Remote audio MediaStream is unavailable");
            }
            const microphoneStartedAt = window.__voiceAuditMicStartedAt;
            if (!Number.isFinite(microphoneStartedAt)) {
              throw new Error("Microphone timeline origin is unavailable");
            }
            const context = new AudioContext();
            const source = context.createMediaStreamSource(audio.srcObject);
            const analyser = context.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);
            await context.resume();
            const data = new Float32Array(analyser.fftSize);
            const rmsSamples = [];
            let assistantTurnStartMs = null;
            const stopAtMs = speechEndMs + responseTimeoutMs;
            while (performance.now() - microphoneStartedAt <= stopAtMs) {
              if (
                assistantTurnStartMs === null &&
                Number.isFinite(window.__voiceAuditAssistantTurnAt)
              ) {
                assistantTurnStartMs = window.__voiceAuditAssistantTurnAt - microphoneStartedAt;
              }
              analyser.getFloatTimeDomainData(data);
              let sumSquares = 0;
              for (const sample of data) sumSquares += sample * sample;
              const rms = Math.sqrt(sumSquares / data.length);
              rmsSamples.push({
                timestampMs: performance.now() - microphoneStartedAt,
                rms,
              });
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            await context.close();
            return { rmsSamples, assistantTurnStartMs };
          },
          {
            speechEndMs,
            responseTimeoutMs: conversationResponseTimeoutMs,
          },
        )
      : null;

    const signal = rawConversationSignal
      ? analyzeConversationTimeline(rawConversationSignal.rmsSamples, {
          speechStartMs,
          speechEndMs,
          assistantTurnStartMs: rawConversationSignal.assistantTurnStartMs,
        })
      : null;
    if (fullConversation && (!signal?.hasGreeting || !signal.hasPostInputResponse)) {
      throw new Error(
        `Expected greeting before input and response after input; greeting=${Boolean(
          signal?.hasGreeting,
        )}, response=${Boolean(signal?.hasPostInputResponse)}`,
      );
    }

    console.log(
      JSON.stringify(
        {
          status: "PASS",
          sessionActive: true,
          forceTurnRelay,
          audioState,
          greetingSignal,
          signal,
          warnings,
          errors,
        },
        null,
        2,
      ),
    );
  }
} catch (error) {
  const bodyText = page
    ? await page
        .locator("body")
        .innerText()
        .catch(() => "")
    : "";
  const audioState = page
    ? await page
        .evaluate(() => {
          const audio = document.querySelector("audio[data-voice-audit-audio]");
          return audio
            ? {
                paused: audio.paused,
                currentTime: audio.currentTime,
                readyState: audio.readyState,
              }
            : null;
        })
        .catch(() => null)
    : null;
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        error: sanitize(error instanceof Error ? error.message : String(error)),
        audioState,
        voiceUi: bodyText
          .split("\n")
          .filter((line) => /audit vocal|session active|microphone|auditrice/i.test(line)),
        warnings,
        errors,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  await context?.close().catch(() => undefined);
  await browser?.close().catch(() => undefined);
  if (generatedAudioDirectory) {
    rmSync(generatedAudioDirectory, { recursive: true, force: true });
  }
}
