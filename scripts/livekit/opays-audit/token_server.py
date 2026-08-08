#!/usr/bin/env python3
"""
Serveur de jetons LiveKit pour le site vitrine opays.io.

Expose `POST /api/voice/token` qui génère un jeton JWT signé permettant au
navigateur de rejoindre une session vocale d'audit.

Utilisation : python token_server.py (port 8090 par défaut)
"""

import base64
import hashlib
import hmac
import json
import os
import secrets
import threading
import time
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import jwt


def positive_int_env(name: str, default: int) -> int:
    value = int(os.getenv(name, str(default)))
    if value <= 0:
        raise ValueError(f"{name} must be greater than zero")
    return value

LIVEKIT_API_KEY = os.environ["LIVEKIT_API_KEY"]
LIVEKIT_API_SECRET = os.environ["LIVEKIT_API_SECRET"]
TURN_HOST = os.getenv("TURN_HOST", "76.13.58.5")
TURN_PORT = positive_int_env("TURN_PORT", 3478)
TURN_SECRET = os.environ["TURN_SECRET"]
TURN_CREDENTIAL_TTL_SECONDS = positive_int_env("TURN_CREDENTIAL_TTL_SECONDS", 600)
ROOM_TTL_SECONDS = 15 * 60
MAX_REQUEST_BYTES = 4_096
RATE_LIMIT_REQUESTS = positive_int_env("RATE_LIMIT_REQUESTS", 5)
GLOBAL_RATE_LIMIT_REQUESTS = positive_int_env("GLOBAL_RATE_LIMIT_REQUESTS", 20)
RATE_LIMIT_WINDOW_SECONDS = positive_int_env("RATE_LIMIT_WINDOW_SECONDS", 60)
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://opays.io,https://www.opays.io",
    ).split(",")
    if origin.strip()
}


class SlidingWindowRateLimiter:
    def __init__(self, per_client: int, global_limit: int, window_seconds: int) -> None:
        self.per_client = per_client
        self.global_limit = global_limit
        self.window_seconds = window_seconds
        self._requests_by_client: defaultdict[str, deque[float]] = defaultdict(deque)
        self._global_requests: deque[float] = deque()
        self._lock = threading.Lock()

    def allow(self, client: str) -> bool:
        now = time.monotonic()
        cutoff = now - self.window_seconds
        with self._lock:
            while self._global_requests and self._global_requests[0] <= cutoff:
                self._global_requests.popleft()
            for known_client, requests in list(self._requests_by_client.items()):
                while requests and requests[0] <= cutoff:
                    requests.popleft()
                if not requests:
                    del self._requests_by_client[known_client]
            if len(self._global_requests) >= self.global_limit:
                return False
            client_requests = self._requests_by_client[client]
            if len(client_requests) >= self.per_client:
                return False
            client_requests.append(now)
            self._global_requests.append(now)
            return True


TOKEN_RATE_LIMITER = SlidingWindowRateLimiter(
    RATE_LIMIT_REQUESTS,
    GLOBAL_RATE_LIMIT_REQUESTS,
    RATE_LIMIT_WINDOW_SECONDS,
)


def create_token(identity: str, room: str) -> str:
    now = int(time.time())
    payload = {
        "iss": LIVEKIT_API_KEY,
        "sub": identity,
        "nbf": now - 10,
        "iat": now,
        "exp": now + ROOM_TTL_SECONDS,
        "jti": f"{identity}-{now}",
        "video": {
            "room": room,
            "roomJoin": True,
            "canPublish": True,
            "canPublishSources": ["microphone"],
            "canPublishData": False,
            "canSubscribe": True,
            "roomAdmin": False,
            "roomList": False,
        },
    }
    return jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")


def create_turn_credentials(identity: str) -> tuple[str, str]:
    expires_at = int(time.time()) + TURN_CREDENTIAL_TTL_SECONDS
    username = f"{expires_at}:{identity}"
    credential = base64.b64encode(
        hmac.new(
            TURN_SECRET.encode(),
            username.encode(),
            hashlib.sha1,
        ).digest()
    ).decode()
    return username, credential


class Handler(BaseHTTPRequestHandler):
    def send_empty(self, status: int, *, close: bool = False) -> None:
        self.send_response(status)
        self.send_header("Content-Length", "0")
        if close:
            self.send_header("Connection", "close")
            self.close_connection = True
        self.end_headers()

    def allowed_origin(self) -> str | None:
        origin = self.headers.get("Origin")
        if origin and origin in ALLOWED_ORIGINS:
            return origin
        return None

    def reject_disallowed_origin(self) -> bool:
        origin = self.headers.get("Origin")
        if origin not in ALLOWED_ORIGINS:
            self.send_empty(403)
            return True
        return False

    def send_cors_headers(self) -> None:
        origin = self.allowed_origin()
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def client_key(self) -> str:
        # Ne jamais utiliser X-Forwarded-For ici : un client peut le forger.
        # Traefik fournit son propre quota IP en bordure ; ce quota local reste
        # volontairement conservateur derrière le proxy partagé.
        return self.client_address[0]

    def send_rate_limited(self) -> None:
        self.send_response(429)
        self.send_header("Content-Length", "0")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Retry-After", str(RATE_LIMIT_WINDOW_SECONDS))
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            payload = b'{"status":"ok"}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
            return
        self.send_empty(404)

    def do_POST(self):
        if self.path != "/api/voice/token":
            self.send_empty(404)
            return
        if self.reject_disallowed_origin():
            return
        if self.headers.get("Transfer-Encoding"):
            self.send_empty(400, close=True)
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            self.send_empty(400, close=True)
            return
        if length < 0:
            self.send_empty(400, close=True)
            return
        if length > MAX_REQUEST_BYTES:
            self.send_empty(413, close=True)
            return
        if not TOKEN_RATE_LIMITER.allow(self.client_key()):
            self.send_rate_limited()
            return
        if length:
            self.rfile.read(length)

        # Ne jamais laisser le navigateur choisir une identité ou une salle :
        # une salle prévisible permettrait à un tiers de demander un jeton pour
        # rejoindre une conversation existante.
        identity = f"visiteur-{secrets.token_urlsafe(12)}"
        room = f"audit-{secrets.token_urlsafe(18)}"

        token = create_token(identity, room)
        turn_identity = hashlib.sha256(self.client_key().encode()).hexdigest()[:32]
        turn_username, turn_credential = create_turn_credentials(turn_identity)
        payload = json.dumps(
            {
                "token": token,
                # livekit-client ajoute lui-même /rtc/v1 (ou /rtc en fallback).
                # Ne pas inclure /rtc ici, sinon le chemin devient /rtc/rtc/v1.
                "url": os.getenv("LIVEKIT_WS_URL", "wss://opays.io"),
                "room": room,
                "ice_servers": [
                    {
                        "urls": [
                            f"turn:{TURN_HOST}:{TURN_PORT}?transport=tcp",
                            f"turn:{TURN_HOST}:{TURN_PORT}?transport=udp",
                        ],
                        "username": turn_username,
                        "credential": turn_credential,
                    }
                ],
            }
        ).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        if self.reject_disallowed_origin():
            return
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8090"))
    print(f"Token server on :{port}")
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
