"""Regression test for the local PiperTTS adapter.

Run inside the agent image, where livekit-agents and the Piper voice model
are installed:

    python test_piper_runtime.py
"""

from __future__ import annotations

import asyncio
import unittest

try:
    from adapters_locaux import PiperTTS
except ModuleNotFoundError as error:
    if error.name != "livekit":
        raise
    raise unittest.SkipTest("test_piper_runtime doit être exécuté dans l'image agent") from error


async def test_piper_emits_pcm() -> None:
    tts = PiperTTS()
    stream = tts.synthesize("Bonjour, je suis Amara.")
    frame = await stream.collect()
    await stream.aclose()

    assert frame.sample_rate == 22050
    assert frame.num_channels == 1
    assert frame.samples_per_channel > 0
    assert len(frame.data) > 0

    print(
        "piper_regression=PASS",
        f"sample_rate={frame.sample_rate}",
        f"channels={frame.num_channels}",
        f"pcm_bytes={len(frame.data)}",
    )


if __name__ == "__main__":
    asyncio.run(test_piper_emits_pcm())
