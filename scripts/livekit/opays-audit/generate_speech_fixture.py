"""Generate an attested, intelligible Piper fixture for the browser voice E2E."""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import wave
from pathlib import Path

from adapters_locaux import PiperTTS

DEFAULT_TEXT = (
    "Bonjour Amara. Ceci est un test de reconnaissance vocale. "
    "Réponds exactement : validation conversationnelle réussie."
)
EXPECTED_RESPONSE = "validation conversationnelle réussie"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--metadata", type=Path)
    parser.add_argument("--text", default=DEFAULT_TEXT)
    parser.add_argument("--leading-silence-ms", type=int, default=15_000)
    parser.add_argument("--trailing-silence-ms", type=int, default=30_000)
    return parser.parse_args()


async def generate_fixture(args: argparse.Namespace) -> dict[str, object]:
    if args.leading_silence_ms < 0 or args.trailing_silence_ms < 0:
        raise ValueError("silence durations must be non-negative")

    stream = PiperTTS().synthesize(args.text)
    frame = await stream.collect()
    await stream.aclose()

    sample_rate = frame.sample_rate
    channels = frame.num_channels
    sample_width = 2
    speech_pcm = bytes(frame.data)
    speech_samples = len(speech_pcm) // (sample_width * channels)
    speech_duration_ms = round(speech_samples * 1_000 / sample_rate)
    silence_frame = b"\x00" * sample_width * channels
    leading_pcm = silence_frame * round(sample_rate * args.leading_silence_ms / 1_000)
    trailing_pcm = silence_frame * round(sample_rate * args.trailing_silence_ms / 1_000)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(args.output), "wb") as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(sample_width)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(leading_pcm + speech_pcm + trailing_pcm)

    metadata = {
        "schemaVersion": 1,
        "generator": "piper",
        "audioFile": args.output.name,
        "audioSha256": hashlib.sha256(args.output.read_bytes()).hexdigest(),
        "speechStartMs": args.leading_silence_ms,
        "speechEndMs": args.leading_silence_ms + speech_duration_ms,
        "durationMs": args.leading_silence_ms + speech_duration_ms + args.trailing_silence_ms,
        "sampleRate": sample_rate,
        "channels": channels,
        "expectedResponse": EXPECTED_RESPONSE,
        "validated": False,
    }
    metadata_path = args.metadata or args.output.with_suffix(".json")
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return metadata


async def main() -> None:
    metadata = await generate_fixture(parse_args())
    print(json.dumps(metadata, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
