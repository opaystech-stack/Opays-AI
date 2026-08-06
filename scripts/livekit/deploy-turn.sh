#!/bin/bash
# Déploiement TURN (coturn) pour WebRTC — contourne le blocage UDP du pare-feu cloud Hostinger.
# Le média navigateur ↔ LiveKit passe par TURN over TCP 3478 (traverse les pare-feux).
set -e

TURN_SECRET="${TURN_SECRET:-OpaysTurn2026!Xy7Qz9Wm4Kp2Lv8R}"

echo "=== [1/4] Conteneur coturn ==="
docker rm -f opays-turn 2>/dev/null || true
docker run -d --name opays-turn --restart unless-stopped \
  --network opays-voice-net \
  -p 3478:3478/tcp \
  -p 3478:3478/udp \
  --label 'opays.isolated=true' \
  --label 'opays.project=voice' \
  coturn/coturn \
  -n --lt-cred-mech \
  --user "opays:${TURN_SECRET}" \
  --realm opays.io \
  --listening-port 3478 \
  --no-cli --no-tls --no-dtls --no-tcp-relay=0 \
  --fingerprint --max-allocate-lifetime 3600 --stale-nonce 600

echo "=== [2/4] Maj config LiveKit (ice_servers TURN) ==="
cat > /opt/opays-voice/livekit.yaml <<EOF
port: 7880
bind_addresses:
  - ""
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 50100
  use_external_ip: true
  ice_servers:
    - urls:
        - "turn:76.13.58.5:3478?transport=tcp"
      username: "opays"
      credential: "${TURN_SECRET}"
redis:
  address: 172.16.6.2:6379
  password: ""
keys:
  APIopaysAudit2026: SecretOpaysAudit2026!Xy7Qz9Wm4Kp2Lv8R
logging:
  level: info
  json: false
EOF
echo "config écrite"

echo "=== [3/4] Restart LiveKit (prend la config TURN) ==="
docker restart opays-livekit
sleep 6

echo "=== [4/4] UFW + vérification ==="
ufw allow 3478/tcp 2>&1 | tail -1
ufw allow 3478/udp 2>&1 | tail -1
docker ps --filter name=opays-turn --format '{{.Names}} | {{.Status}}'
docker ps --filter name=opays-livekit --format '{{.Names}} | {{.Status}}'
echo "--- test TCP 3478 depuis l'extérieur (STUN-like) ---"
echo "--- test local coturn ---"
curl -s -o /dev/null -w 'coturn local → HTTP %{http_code} (attendu 000, port non-HTTP)\n' -m 4 http://localhost:3478/ 2>&1 || true
docker logs --tail 4 opays-turn 2>&1 | tail -3
echo "DONE"
