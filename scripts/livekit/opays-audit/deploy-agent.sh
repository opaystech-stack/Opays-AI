#!/bin/bash
# Déploiement de l'agent d'audit vocal Opays (conteneur agent + token server)
# Réseau dédié opays-voice-net — isolation stricte.
set -euo pipefail

OPENROUTER_ENV_FILE=${OPENROUTER_ENV_FILE:-/opt/opays-voice/openrouter.env}
LIVEKIT_ENV_FILE=${LIVEKIT_ENV_FILE:-/opt/opays-voice/livekit.env}
for env_file in "$OPENROUTER_ENV_FILE" "$LIVEKIT_ENV_FILE"; do
  if [ ! -f "$env_file" ]; then
    echo "Fichier d'environnement manquant: $env_file" >&2
    exit 1
  fi
  set -a
  . "$env_file"
  set +a
done
: "${OPENROUTER_API_KEY:?OPENROUTER_API_KEY doit être injectée avant le déploiement}"
: "${LIVEKIT_API_KEY:?LIVEKIT_API_KEY doit être injectée avant le déploiement}"
: "${LIVEKIT_API_SECRET:?LIVEKIT_API_SECRET doit être injectée avant le déploiement}"

SRC=/opt/opays-voice/agent-src

# IPs des conteneurs (DNS Docker interne défaillant sur ce VPS — utiliser IP directes)
LIVEKIT_IP=$(docker inspect opays-livekit --format '{{range $k,$v := .NetworkSettings.Networks}}{{$v.IPAddress}}{{end}}')
echo "LiveKit IP: $LIVEKIT_IP"

echo "=== [1/6] Build image agent d'audit ==="
cd "$SRC"
docker build -t opays-audit-agent:latest . 2>&1 | tail -4

echo "=== [2/6] Build image token server ==="
docker build -f token-server.Dockerfile -t opays-token-server:latest . 2>&1 | tail -3

echo "=== [3/6] Conteneur agent d'audit ==="
docker rm -f opays-audit-agent 2>/dev/null || true
docker run -d --name opays-audit-agent --restart unless-stopped \
  --network opays-voice-net \
  --env-file "$LIVEKIT_ENV_FILE" \
  --env-file "$OPENROUTER_ENV_FILE" \
  -e LIVEKIT_URL="ws://$LIVEKIT_IP:7880" \
  -e OPENROUTER_BASE_URL=https://openrouter.ai/api/v1 \
  -e OPENROUTER_MODEL=openai/gpt-4o-mini \
  -e PIPER_VOICE_DIR=/voices \
  --label 'opays.isolated=true' \
  --label 'opays.project=voice' \
  opays-audit-agent:latest

echo "=== [4/6] Token server (API jetons pour le navigateur) ==="
docker rm -f opays-token-server 2>/dev/null || true
docker run -d --name opays-token-server --restart unless-stopped \
  --network opays-voice-net \
  --env-file "$LIVEKIT_ENV_FILE" \
  -e LIVEKIT_WS_URL=wss://opays.io \
  --label 'opays.isolated=true' \
  --label 'opays.project=voice' \
  --label 'traefik.enable=true' \
  --label 'traefik.http.routers.opays-token.rule=Host(`opays.io`) && PathPrefix(`/api/voice`)' \
  --label 'traefik.http.routers.opays-token.entrypoints=websecure' \
  --label 'traefik.http.routers.opays-token.tls.certresolver=letsencrypt' \
  --label 'traefik.http.routers.opays-token.service=opays-token' \
  --label 'traefik.http.routers.opays-token.priority=70' \
  --label 'traefik.http.services.opays-token.loadbalancer.server.port=8090' \
  opays-token-server:latest

echo "=== [5/6] Pont Traefik vers le réseau voix (seul pont autorisé) ==="
docker network connect opays-voice-net dokploy-traefik 2>/dev/null || true

echo "=== [6/6] Vérification ==="
sleep 8
docker ps --filter name=opays- --format '{{.Names}} | {{.Status}}'
echo "--- logs agent (8 dernières) ---"
docker logs --tail 8 opays-audit-agent 2>&1 | tail -6
echo "--- route token via Traefik (POST attendu; GET → 405/404 mais route présente) ---"
curl -s -o /dev/null -w 'route token → HTTP %{http_code}\n' -m 10 https://opays.io/api/voice/token
echo "DONE"
