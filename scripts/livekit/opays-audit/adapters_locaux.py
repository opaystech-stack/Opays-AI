"""
Adaptateurs STT/TTS 100% locaux pour l'agent d'audit Opays.

- STT : faster-whisper (modèle `base`, multilingue, FR) — via STT._recognize_impl
- TTS : piper-tts (voix française) — via TTS.synthesize + ChunkedStream._run(output_emitter)

API conforme au framework livekit-agents (v1.x) :
  - STT._recognize_impl(buffer, *, language, conn_options) -> SpeechEvent
  - TTS.synthesize(text, *, conn_options) -> ChunkedStream
  - ChunkedStream._run(output_emitter: AudioEmitter) — output_emitter.push(bytes)
"""

from __future__ import annotations

import asyncio
import logging
import os

import numpy as np

from livekit import rtc
from livekit.agents import stt, tts, utils
from livekit.agents.types import (
    DEFAULT_API_CONNECT_OPTIONS,
    NOT_GIVEN,
    APIConnectOptions,
    NotGivenOr,
)

logger = logging.getLogger("opays-locaux")


# ─────────────────────────────────────────────────────────────────────────
# STT — faster-whisper (local, int8 CPU)
# ─────────────────────────────────────────────────────────────────────────

class FasterWhisperSTT(stt.STT):
    def __init__(self, *, model_size: str = "base", language: str = "fr") -> None:
        super().__init__(
            capabilities=stt.STTCapabilities(
                streaming=False,
                interim_results=False,
                diarization=False,
            )
        )
        self._model_size = model_size
        self._language = language
        self._model = None

    def _ensure_model(self):
        if self._model is None:
            from faster_whisper import WhisperModel

            self._model = WhisperModel(self._model_size, device="cpu", compute_type="int8")
        return self._model

    async def _recognize_impl(
        self,
        buffer: utils.AudioBuffer,
        *,
        language: NotGivenOr[str] = NOT_GIVEN,
        conn_options: APIConnectOptions = DEFAULT_API_CONNECT_OPTIONS,
    ) -> stt.SpeechEvent:
        frames = buffer if isinstance(buffer, list) else [buffer]
        merged = rtc.combine_audio_frames(frames)
        samples = np.frombuffer(merged.data, dtype=np.int16).astype("float32") / 32768.0

        if samples.size == 0:
            return stt.SpeechEvent(type=stt.SpeechEventType.END_OF_SPEECH)

        model = self._ensure_model()
        lang = language if language is not NOT_GIVEN else self._language

        segments, _ = await asyncio.to_thread(
            model.transcribe,
            samples,
            language=lang,
            beam_size=5,
            vad_filter=True,
        )
        text = "".join(seg.text for seg in segments).strip()
        if not text:
            return stt.SpeechEvent(type=stt.SpeechEventType.END_OF_SPEECH)

        return stt.SpeechEvent(
            type=stt.SpeechEventType.FINAL_TRANSCRIPT,
            alternatives=[stt.SpeechData(text=text, language=lang)],
        )

    @property
    def model(self) -> str:
        return self._model_size

    @property
    def provider(self) -> str:
        return "faster-whisper-local"


# ─────────────────────────────────────────────────────────────────────────
# TTS — piper-tts (local, voix française)
# ─────────────────────────────────────────────────────────────────────────

class PiperTTS(tts.TTS):
    def __init__(
        self,
        *,
        voice: str = "fr_FR-siwis-medium",
        sample_rate: int = 22050,
    ) -> None:
        super().__init__(
            capabilities=tts.TTSCapabilities(streaming=False, aligned_transcript=False),
            sample_rate=sample_rate,
            num_channels=1,
        )
        self._voice = voice
        self._synthesizer = None

    def _ensure_synthesizer(self):
        if self._synthesizer is None:
            from piper import PiperVoice

            voice_dir = os.getenv("PIPER_VOICE_DIR", "/voices")
            model_path = os.path.join(voice_dir, self._voice + ".onnx")
            config_path = os.path.join(voice_dir, self._voice + ".onnx.json")
            self._synthesizer = PiperVoice.load(model_path, config_path=config_path)
        return self._synthesizer

    def synthesize(
        self,
        text: str,
        *,
        conn_options: APIConnectOptions = DEFAULT_API_CONNECT_OPTIONS,
    ) -> "tts.ChunkedStream":
        return PiperChunkedStream(tts=self, input_text=text, conn_options=conn_options)


class PiperChunkedStream(tts.ChunkedStream):
    async def _run(self, output_emitter: tts.AudioEmitter) -> None:
        try:
            voice = self._tts._ensure_synthesizer()
            # Synthèse synchrone vers un buffer
            samples = await asyncio.to_thread(self._synthesize_all, voice)
        except Exception as e:  # pragma: no cover
            logger.warning("Piper TTS failed: %s", e)
            return

        if samples.size == 0:
            return

        pcm = (samples * 32768.0).astype(np.int16).tobytes()

        output_emitter.initialize(
            request_id="piper",
            sample_rate=self._tts.sample_rate,
            num_channels=self._tts.num_channels,
            mime_type="audio/pcm",
            frame_size_ms=20,
            stream=False,
        )
        frame_bytes = self._tts.sample_rate * 2 // 50  # 20ms
        for i in range(0, len(pcm), frame_bytes):
            output_emitter.push(pcm[i : i + frame_bytes])
        output_emitter.end_input()

    def _synthesize_all(self, voice) -> np.ndarray:
        import io

        buf = io.BytesIO()
        for chunk in voice.synthesize(self._input_text):
            buf.write(chunk.audio_int16_bytes)
        return np.frombuffer(buf.getvalue(), dtype=np.int16).astype("float32") / 32768.0
