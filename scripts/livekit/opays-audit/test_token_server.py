"""Integration tests for the public LiveKit token issuance boundary."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import socket
import subprocess
import sys
import time
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import jwt

ROOT = Path(__file__).resolve().parent
TRUSTED_ORIGIN = "https://opays.io"
TEST_TURN_AUTH_SECRET = hashlib.sha256(b"token-server-turn-fixture").hexdigest()
TEST_LIVEKIT_SECRET = hashlib.sha256(b"token-server-livekit-fixture").hexdigest()


def available_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


class TokenServerProcess:
    def __init__(self, **environment: str) -> None:
        self.port = available_port()
        env = os.environ.copy()
        env.update(
            {
                "LIVEKIT_API_KEY": "unit-test-livekit-key",
                "LIVEKIT_API_SECRET": TEST_LIVEKIT_SECRET,
                "TURN_SECRET": TEST_TURN_AUTH_SECRET,
                "ALLOWED_ORIGINS": TRUSTED_ORIGIN,
                "PORT": str(self.port),
                **environment,
            }
        )
        self.process = subprocess.Popen(
            [sys.executable, "-u", str(ROOT / "token_server.py")],
            cwd=ROOT,
            env=env,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
        )
        self._wait_until_ready()

    def _wait_until_ready(self) -> None:
        deadline = time.monotonic() + 5
        while time.monotonic() < deadline:
            if self.process.poll() is not None:
                stderr = self.process.stderr.read() if self.process.stderr else ""
                raise RuntimeError(f"token server stopped during startup: {stderr}")
            try:
                with urlopen(f"http://127.0.0.1:{self.port}/health", timeout=0.2) as response:
                    if response.status == 200:
                        return
            except OSError:
                time.sleep(0.05)
        raise TimeoutError("token server did not become ready")

    def request_token(
        self,
        *,
        origin: str | None = TRUSTED_ORIGIN,
        forwarded_for: str | None = None,
        body: bytes = b"{}",
    ) -> tuple[int, dict[str, str], dict[str, object] | None]:
        headers = {"Content-Type": "application/json"}
        if origin is not None:
            headers["Origin"] = origin
        if forwarded_for is not None:
            headers["X-Forwarded-For"] = forwarded_for
        request = Request(
            f"http://127.0.0.1:{self.port}/api/voice/token",
            data=body,
            headers=headers,
            method="POST",
        )
        try:
            with urlopen(request, timeout=2) as response:
                payload = json.loads(response.read())
                return response.status, dict(response.headers), payload
        except HTTPError as error:
            error.read()
            return error.code, dict(error.headers), None

    def close(self) -> None:
        self.process.terminate()
        try:
            self.process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            self.process.kill()
            self.process.wait(timeout=3)
        if self.process.stderr:
            self.process.stderr.close()


class TokenServerSecurityTests(unittest.TestCase):
    def setUp(self) -> None:
        self.server = TokenServerProcess()

    def tearDown(self) -> None:
        self.server.close()

    def test_missing_origin_is_rejected(self) -> None:
        status, _, payload = self.server.request_token(origin=None)

        self.assertEqual(status, 403)
        self.assertIsNone(payload)

    def test_per_client_rate_limit_returns_429(self) -> None:
        self.server.close()
        self.server = TokenServerProcess(
            RATE_LIMIT_REQUESTS="2",
            GLOBAL_RATE_LIMIT_REQUESTS="100",
            RATE_LIMIT_WINDOW_SECONDS="60",
        )

        first_status, _, _ = self.server.request_token(forwarded_for="198.51.100.10")
        second_status, _, _ = self.server.request_token(forwarded_for="198.51.100.10")
        limited_status, headers, payload = self.server.request_token(
            forwarded_for="198.51.100.10"
        )

        self.assertEqual((first_status, second_status), (200, 200))
        self.assertEqual(limited_status, 429)
        self.assertEqual(headers.get("Retry-After"), "60")
        self.assertIsNone(payload)

    def test_forwarded_client_uses_the_rightmost_proxy_appended_address(self) -> None:
        self.server.close()
        self.server = TokenServerProcess(
            RATE_LIMIT_REQUESTS="1",
            GLOBAL_RATE_LIMIT_REQUESTS="100",
            RATE_LIMIT_WINDOW_SECONDS="60",
        )

        first_status, _, _ = self.server.request_token(
            forwarded_for="198.51.100.10, 203.0.113.42"
        )
        limited_status, _, _ = self.server.request_token(
            forwarded_for="198.51.100.99, 203.0.113.42"
        )

        self.assertEqual(first_status, 200)
        self.assertEqual(limited_status, 429)

    def test_global_rate_limit_cannot_be_bypassed_with_forwarded_addresses(self) -> None:
        self.server.close()
        self.server = TokenServerProcess(
            RATE_LIMIT_REQUESTS="100",
            GLOBAL_RATE_LIMIT_REQUESTS="3",
            RATE_LIMIT_WINDOW_SECONDS="60",
        )

        statuses = [
            self.server.request_token(forwarded_for=f"203.0.113.{index}")[0]
            for index in range(1, 5)
        ]

        self.assertEqual(statuses, [200, 200, 200, 429])

    def test_disallowed_origin_and_oversized_body_are_rejected(self) -> None:
        denied_status, _, denied_payload = self.server.request_token(
            origin="https://attacker.invalid"
        )
        oversized_status, _, oversized_payload = self.server.request_token(body=b"x" * 4_097)

        self.assertEqual(denied_status, 403)
        self.assertIsNone(denied_payload)
        self.assertEqual(oversized_status, 413)
        self.assertIsNone(oversized_payload)

    def test_turn_credentials_are_ephemeral_hmac_values(self) -> None:
        status, _, payload = self.server.request_token()

        self.assertEqual(status, 200)
        self.assertIsNotNone(payload)
        ice_server = payload["ice_servers"][0]
        username = str(ice_server["username"])
        credential = str(ice_server["credential"])
        self.assertRegex(username, r"^\d+:[a-f0-9]{32}$")
        expiration_text, identity = username.split(":", 1)
        expiration = int(expiration_text)
        expected = base64.b64encode(
            hmac.new(
                TEST_TURN_AUTH_SECRET.encode(),
                username.encode(),
                hashlib.sha1,
            ).digest()
        ).decode()

        self.assertRegex(identity, r"^[a-f0-9]{32}$")
        self.assertGreaterEqual(expiration - int(time.time()), 540)
        self.assertLessEqual(expiration - int(time.time()), 600)
        self.assertEqual(credential, expected)
        self.assertNotEqual(credential, TEST_TURN_AUTH_SECRET)

    def test_turn_port_is_runtime_configurable(self) -> None:
        self.server.close()
        self.server = TokenServerProcess(TURN_PORT="3479")

        status, _, payload = self.server.request_token()

        self.assertEqual(status, 200)
        self.assertIsNotNone(payload)
        urls = payload["ice_servers"][0]["urls"]
        self.assertEqual(
            urls,
            [
                "turn:76.13.58.5:3479?transport=tcp",
                "turn:76.13.58.5:3479?transport=udp",
            ],
        )

    def test_token_is_random_server_scoped_and_minimally_privileged(self) -> None:
        status, headers, payload = self.server.request_token(
            body=b'{"identity":"attacker","room":"known-room"}'
        )

        self.assertEqual(status, 200)
        self.assertIsNotNone(payload)
        self.assertEqual(headers.get("Access-Control-Allow-Origin"), TRUSTED_ORIGIN)
        self.assertEqual(headers.get("Cache-Control"), "no-store")
        claims = jwt.decode(
            payload["token"],
            TEST_LIVEKIT_SECRET,
            algorithms=["HS256"],
        )
        self.assertRegex(claims["sub"], r"^visiteur-[A-Za-z0-9_-]+$")
        self.assertRegex(payload["room"], r"^audit-[A-Za-z0-9_-]+$")
        self.assertNotEqual(claims["sub"], "attacker")
        self.assertNotEqual(payload["room"], "known-room")
        self.assertEqual(claims["exp"] - claims["iat"], 900)
        self.assertEqual(claims["video"]["room"], payload["room"])
        self.assertEqual(claims["video"]["roomJoin"], True)
        self.assertEqual(claims["video"]["canPublish"], True)
        self.assertEqual(claims["video"]["canPublishSources"], ["microphone"])
        self.assertEqual(claims["video"]["canPublishData"], False)
        self.assertEqual(claims["video"]["canSubscribe"], True)
        self.assertNotIn("roomCreate", claims["video"])

        second_status, _, second_payload = self.server.request_token()
        self.assertEqual(second_status, 200)
        self.assertNotEqual(second_payload["room"], payload["room"])
        second_claims = jwt.decode(
            second_payload["token"],
            TEST_LIVEKIT_SECRET,
            algorithms=["HS256"],
        )
        self.assertNotEqual(second_claims["sub"], claims["sub"])


if __name__ == "__main__":
    unittest.main()
