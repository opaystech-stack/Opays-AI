#!/bin/bash
# Déploiement infrastructure voix Opays — LiveKit self-hosted + Redis + Ollama
# VPS partagé : réseau DÉDIÉ opays-voice-net, isolation stricte.
set -e

echo "=== [1/8] Réseau dédié voix Opays ==="
docker network inspect opays-voice-net >/dev/null 2>&1 || docker network create --driver bridge --label 'opays.isolated=true' opays-voice-net
echo "réseau prêt"

echo "=== [2/8] Redis ==="
docker rm -f opays-redis 2>/dev/null || true
docker run -d --name opays-redis --restart unless-stopped --network opays-voice-net --label 'opays.isolated=true' --label 'opays.project=voice' redis:7-alpine
sleep 2
docker exec opays-redis redis-cli ping 2>/dev/null || echo "ATTENTION: redis pas encore prêt"

echo "=== [3/8] Fichier config LiveKit ==="
mkdir -p /opt/opays-voice
cat > /opt/opays-voice/livekit.yaml <<'EOF'
port: 7880
bind_addresses:
  - ""
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 50100
  use_external_ip: true
redis:
  address: redis:6379
  password: ""
keys:
  APIopaysAudit2026: SecretOpaysAudit2026!
logging:
  level: info
  json: false
EOF
echo "config écrite"

echo "=== [4/8] LiveKit server ==="
docker rm -f opays-livekit 2>/dev/null || true
docker run -d --name opays-livekit --restart unless-stopped \
  --network opays-voice-net \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 50000-50100:50000-50100/udp \
  -v /opt/opays-voice/livekit.yaml:/etc/livekit.yaml \
  --label 'opays.isolated=true' \
  --label 'opays.project=voice' \
  livekit/livekit-server:v1.13.5 --config /etc/livekit.yaml

echo "=== [5/8] Attente démarrage ==="
sleep 6
docker ps --filter name=opays-livekit --format '{{.Names}} | {{.Status}}'
docker logs --tail 10 opays-livekit 2>&1 | tail -6

echo "=== [6/8] Test santé LiveKit ==="
curl -s -o /dev/null -w 'livekit http → HTTP %{http_code}\n' -m 5 http://localhost:7880/ || echo "HTTP local pas dispo (normal si bind interne)"

echo "=== [7/8] Ouverture ports UFW (WebRTC media UDP + signal TCP) ==="
ufw allow 7880/tcp 2>&1 | tail -1
ufw allow 7881/tcp 2>&1 | tail -1
ufw allow 50000:50100/udp 2>&1 | tail -1
echo "ufw ouvert"

echo "=== [8/8] Vérification ==="
docker ps --filter name=opays- --format '{{.Names}} | {{.Status}}'
echo "DONE"
