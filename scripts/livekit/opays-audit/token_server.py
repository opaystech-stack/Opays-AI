#!/usr/bin/env python3
"""
Serveur de jetons LiveKit pour le site vitrine opays.io.

Expose `POST /api/voice/token` qui génère un jeton JWT signé permettant au
navigateur de rejoindre une session vocale d'audit.

Utilisation : python token_server.py (port 8090 par défaut)
"""

import json
import os
import secrets
import time

import jwt
from http.server import BaseHTTPRequestHandler, HTTPServer

LIVEKIT_API_KEY = os.environ["LIVEKIT_API_KEY"]
LIVEKIT_API_SECRET = os.environ["LIVEKIT_API_SECRET"]
TURN_HOST = os.getenv("TURN_HOST", "76.13.58.5")
TURN_USER = os.getenv("TURN_USER", "opays")
TURN_SECRET = os.environ["TURN_SECRET"]
ROOM_TTL_SECONDS = 15 * 60
MAX_REQUEST_BYTES = 4_096
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://opays.io,https://www.opays.io",
    ).split(",")
    if origin.strip()
}


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
            "canSubscribe": True,
            "roomAdmin": False,
            "roomList": False,
            "roomCreate": True,
        },
    }
    return jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")


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
        if origin and origin not in ALLOWED_ORIGINS:
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

    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/voice/token":
            self.send_empty(404)
            return
        if self.reject_disallowed_origin():
            return

        length = int(self.headers.get("Content-Length", 0))
        if length > MAX_REQUEST_BYTES:
            self.send_empty(413, close=True)
            return
        if length:
            self.rfile.read(length)

        # Ne jamais laisser le navigateur choisir une identité ou une salle :
        # une salle prévisible permettrait à un tiers de demander un jeton pour
        # rejoindre une conversation existante.
        identity = f"visiteur-{secrets.token_urlsafe(12)}"
        room = f"audit-{secrets.token_urlsafe(18)}"

        token = create_token(identity, room)
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
                            f"turn:{TURN_HOST}:3478?transport=tcp",
                            f"turn:{TURN_HOST}:3478?transport=udp",
                        ],
                        "username": TURN_USER,
                        "credential": TURN_SECRET,
                    }
                ],
            }
        ).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
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
    HTTPServer(("0.0.0.0", port), Handler).serve_forever()
