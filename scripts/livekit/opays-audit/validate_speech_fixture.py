"""Validate and attest that an E2E WAV is recognizable by the runtime STT."""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import re
import unicodedata
import wave
from pathlib import Path

from faster_whisper import WhisperModel

DEFAULT_EXPECTED_TEXT = "validation conversationnelle réussie"


def normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text.lower())
    without_accents = "".join(character for character in decomposed if not unicodedata.combining(character))
    return " ".join(re.findall(r"[a-z0-9]+", without_accents))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("fixture", type=Path)
    parser.add_argument("--metadata", type=Path)
    parser.add_argument("--expected", default=DEFAULT_EXPECTED_TEXT)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.fixture.is_file():
        raise FileNotFoundError(args.fixture)

    metadata_path = args.metadata or args.fixture.with_suffix(".json")
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    if metadata.get("schemaVersion") != 1 or metadata.get("generator") != "piper":
        raise AssertionError("fixture metadata was not produced by Piper")
    audio_sha256 = hashlib.sha256(args.fixture.read_bytes()).hexdigest()
    if not hmac.compare_digest(str(metadata.get("audioSha256", "")), audio_sha256):
        raise AssertionError("fixture hash does not match its metadata")
    if metadata.get("expectedResponse") != args.expected:
        raise AssertionError("fixture expected response does not match validator policy")

    with wave.open(str(args.fixture), "rb") as wav_file:
        sample_rate = wav_file.getframerate()
        channels = wav_file.getnchannels()
        duration_ms = round(wav_file.getnframes() * 1_000 / sample_rate)
    if sample_rate != metadata.get("sampleRate") or channels != metadata.get("channels"):
        raise AssertionError("fixture audio format does not match its metadata")
    if abs(duration_ms - int(metadata.get("durationMs", -1))) > 1:
        raise AssertionError("fixture duration does not match its metadata")

    model = WhisperModel(
        os.getenv("WHISPER_MODEL", "base"),
        device="cpu",
        compute_type="int8",
    )
    segments, info = model.transcribe(
        str(args.fixture),
        language="fr",
        beam_size=5,
        vad_filter=True,
    )
    transcript = " ".join(segment.text.strip() for segment in segments).strip()
    normalized_transcript = normalize(transcript)
    missing_words = [
        word for word in normalize(args.expected).split() if word not in normalized_transcript.split()
    ]
    if missing_words:
        raise AssertionError(f"fixture is not recognizable; missing words: {', '.join(missing_words)}")

    metadata.update(
        {
            "validated": True,
            "validator": "faster-whisper",
            "validationLanguage": info.language,
            "validationTranscript": transcript,
            "validatedExpectedResponse": args.expected,
        }
    )
    metadata_path.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "status": "PASS",
                "language": info.language,
                "transcript": transcript,
                "expected": args.expected,
                "audioSha256": audio_sha256,
                "metadata": str(metadata_path),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
