#!/bin/bash
# Déploiement infrastructure voix Opays — LiveKit self-hosted + Redis.
# VPS partagé : réseau DÉDIÉ opays-voice-net, isolation stricte.
set -euo pipefail

LIVEKIT_ENV_FILE=${LIVEKIT_ENV_FILE:-/opt/opays-voice/livekit.env}
LIVEKIT_CONFIG_FILE=${LIVEKIT_CONFIG_FILE:-/opt/opays-voice/livekit.yaml}
LIVEKIT_CANDIDATE_CONFIG_FILE=${LIVEKIT_CANDIDATE_CONFIG_FILE:-/opt/opays-voice/livekit-candidate.yaml}
LIVEKIT_IMAGE=${LIVEKIT_IMAGE:-livekit/livekit-server@sha256:3497163e15c48fef6e7830c78716f9e9d5edc28abf7aa90b61c86e93bbc306b1}
REDIS_IMAGE=${REDIS_IMAGE:-redis@sha256:6ab0b6e7381779332f97b8ca76193e45b0756f38d4c0dcda72dbb3c32061ab99}
: "${RELEASE_SHA:?RELEASE_SHA doit être le SHA Git exact associé au déploiement}"
if [[ ! "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "RELEASE_SHA doit être un SHA Git complet de 40 caractères" >&2
  exit 1
fi
if [ ! -f "$LIVEKIT_ENV_FILE" ]; then
  echo "Fichier d'environnement manquant: $LIVEKIT_ENV_FILE" >&2
  exit 1
fi
if [ "$(stat -c '%a' "$LIVEKIT_ENV_FILE")" != "600" ]; then
  echo "Permissions invalides pour $LIVEKIT_ENV_FILE (600 requis)" >&2
  exit 1
fi
set -a
. "$LIVEKIT_ENV_FILE"
set +a
: "${LIVEKIT_API_KEY:?LIVEKIT_API_KEY doit être injectée avant le déploiement}"
: "${LIVEKIT_API_SECRET:?LIVEKIT_API_SECRET doit être injectée avant le déploiement}"
LIVEKIT_PREVIOUS_API_KEY=${LIVEKIT_PREVIOUS_API_KEY:-}
LIVEKIT_PREVIOUS_API_SECRET=${LIVEKIT_PREVIOUS_API_SECRET:-}
if { [ -n "$LIVEKIT_PREVIOUS_API_KEY" ] && [ -z "$LIVEKIT_PREVIOUS_API_SECRET" ]; } || \
  { [ -z "$LIVEKIT_PREVIOUS_API_KEY" ] && [ -n "$LIVEKIT_PREVIOUS_API_SECRET" ]; }; then
  echo "La paire LiveKit précédente doit être fournie intégralement" >&2
  exit 1
fi
if [ -n "$LIVEKIT_PREVIOUS_API_KEY" ] && [ "$LIVEKIT_PREVIOUS_API_KEY" = "$LIVEKIT_API_KEY" ]; then
  echo "Les clés LiveKit actuelle et précédente doivent être distinctes" >&2
  exit 1
fi

OLD_LIVEKIT_IMAGE=""
OLD_REDIS_IMAGE=""
OLD_CONFIG_FILE=$(mktemp /tmp/opays-livekit-config.XXXXXX)
chmod 600 "$OLD_CONFIG_FILE"
OLD_CONFIG_AVAILABLE=0
PROMOTION_STARTED=0
DEPLOYMENT_VERIFIED=0

create_config() {
  local destination=$1 redis_ip=$2
  DESTINATION="$destination" REDIS_IP="$redis_ip" python3 - <<'PY'
import json
import os
from pathlib import Path

key_lines = [
    f'  {json.dumps(os.environ["LIVEKIT_API_KEY"])}: {json.dumps(os.environ["LIVEKIT_API_SECRET"])}'
]
previous_key = os.getenv("LIVEKIT_PREVIOUS_API_KEY", "")
if previous_key:
    key_lines.append(
        f'  {json.dumps(previous_key)}: {json.dumps(os.environ["LIVEKIT_PREVIOUS_API_SECRET"])}'
    )

config = f'''port: 7880
bind_addresses:
  - ""
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 50100
  use_external_ip: true
redis:
  address: {json.dumps(os.environ["REDIS_IP"] + ":6379")}
  password: ""
keys:
{chr(10).join(key_lines)}
logging:
  level: info
  json: false
'''
Path(os.environ["DESTINATION"]).write_text(config, encoding="utf-8")
PY
  chmod 600 "$destination"
}

replace_redis_address() {
  local config_file=$1 redis_ip=$2
  CONFIG_FILE="$config_file" REDIS_IP="$redis_ip" python3 - <<'PY'
import os
import re
from pathlib import Path

path = Path(os.environ["CONFIG_FILE"])
content = path.read_text(encoding="utf-8")
content, count = re.subn(
    r'(?m)^  address:.*$',
    f'  address: "{os.environ["REDIS_IP"]}:6379"',
    content,
)
if count != 1:
    raise RuntimeError("Redis address not found exactly once in LiveKit config")
path.write_text(content, encoding="utf-8")
PY
  chmod 600 "$config_file"
}

run_redis() {
  local name=$1 image=$2 restart_policy=$3
  docker run -d --name "$name" --restart "$restart_policy" \
    --network opays-voice-net \
    --label 'opays.isolated=true' \
    --label 'opays.project=voice' \
    --label "opays.release=$RELEASE_SHA" \
    "$image"
}

run_livekit() {
  local name=$1 image=$2 config_file=$3 restart_policy=$4 expose=$5
  local -a args=(
    docker run -d --name "$name" --restart "$restart_policy"
    --network opays-voice-net
    -v "$config_file:/etc/livekit.yaml:ro"
    --label 'opays.isolated=true'
    --label 'opays.project=voice'
    --label "opays.release=$RELEASE_SHA"
  )
  if [ "$expose" = "true" ]; then
    args+=(
      -p 7880:7880
      -p 7881:7881
      -p 50000-50100:50000-50100/udp
      --label 'traefik.enable=true'
      --label 'traefik.http.routers.opays-rtc.rule=Host(`opays.io`) && PathPrefix(`/rtc`)'
      --label 'traefik.http.routers.opays-rtc.entrypoints=websecure'
      --label 'traefik.http.routers.opays-rtc.tls.certresolver=letsencrypt'
      --label 'traefik.http.routers.opays-rtc.service=opays-rtc'
      --label 'traefik.http.routers.opays-rtc.priority=80'
      --label 'traefik.http.services.opays-rtc.loadbalancer.server.port=7880'
    )
  else
    args+=(--label 'traefik.enable=false')
  fi
  "${args[@]}" "$image" --config /etc/livekit.yaml
}

wait_for_redis() {
  local container=$1
  for _ in $(seq 1 20); do
    if [ "$(docker inspect "$container" --format '{{.State.Running}}' 2>/dev/null || true)" = "true" ] && \
      [ "$(docker exec "$container" redis-cli ping 2>/dev/null || true)" = "PONG" ]; then
      return 0
    fi
    sleep 1
  done
  echo "Redis $container n'est pas sain" >&2
  return 1
}

wait_for_livekit() {
  local container=$1
  for _ in $(seq 1 30); do
    if [ "$(docker inspect "$container" --format '{{.State.Running}}' 2>/dev/null || true)" != "true" ]; then
      echo "LiveKit $container s'est arrêté" >&2
      docker logs --tail 20 "$container" >&2 || true
      return 1
    fi
    local ip code
    ip=$(docker inspect "$container" --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
    code=$(curl -sS -o /dev/null -w '%{http_code}' -m 2 "http://$ip:7880/" || true)
    if [ "$code" = "200" ]; then
      return 0
    fi
    sleep 1
  done
  echo "LiveKit $container ne répond pas HTTP 200" >&2
  docker logs --tail 20 "$container" >&2 || true
  return 1
}

cleanup_candidates() {
  docker rm -f opays-livekit-candidate opays-redis-candidate 2>/dev/null || true
  rm -f "$LIVEKIT_CANDIDATE_CONFIG_FILE"
}

rollback() {
  local status=$?
  trap - ERR INT TERM
  cleanup_candidates
  if [ "$PROMOTION_STARTED" = "1" ] && [ "$DEPLOYMENT_VERIFIED" != "1" ]; then
    echo "Échec de promotion LiveKit — restauration de l'infrastructure précédente" >&2
    docker rm -f opays-livekit opays-redis 2>/dev/null || true
    if [ -n "$OLD_REDIS_IMAGE" ] && [ -n "$OLD_LIVEKIT_IMAGE" ] && [ "$OLD_CONFIG_AVAILABLE" = "1" ]; then
      run_redis opays-redis "$OLD_REDIS_IMAGE" unless-stopped >/dev/null || true
      wait_for_redis opays-redis || true
      local restored_redis_ip
      restored_redis_ip=$(docker inspect opays-redis --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 2>/dev/null || true)
      if [ -n "$restored_redis_ip" ]; then
        cp "$OLD_CONFIG_FILE" "$LIVEKIT_CONFIG_FILE"
        replace_redis_address "$LIVEKIT_CONFIG_FILE" "$restored_redis_ip" || true
        run_livekit opays-livekit "$OLD_LIVEKIT_IMAGE" "$LIVEKIT_CONFIG_FILE" unless-stopped true >/dev/null || true
        docker network connect opays-voice-net dokploy-traefik 2>/dev/null || true
        wait_for_livekit opays-livekit || true
      fi
    fi
  fi
  rm -f "$OLD_CONFIG_FILE"
  exit "$status"
}
trap rollback ERR INT TERM

echo "=== [1/8] Réseau dédié voix Opays ==="
docker network inspect opays-voice-net >/dev/null 2>&1 || \
  docker network create --driver bridge --label 'opays.isolated=true' opays-voice-net

echo "=== [2/8] Candidats Redis et LiveKit ==="
cleanup_candidates
run_redis opays-redis-candidate "$REDIS_IMAGE" no >/dev/null
wait_for_redis opays-redis-candidate
CANDIDATE_REDIS_IP=$(docker inspect opays-redis-candidate --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
create_config "$LIVEKIT_CANDIDATE_CONFIG_FILE" "$CANDIDATE_REDIS_IP"
run_livekit opays-livekit-candidate "$LIVEKIT_IMAGE" "$LIVEKIT_CANDIDATE_CONFIG_FILE" no false >/dev/null
wait_for_livekit opays-livekit-candidate
if [ "${VALIDATE_ONLY:-0}" = "1" ]; then
  cleanup_candidates
  trap - ERR INT TERM
  rm -f "$OLD_CONFIG_FILE"
  echo "VALIDATED_ONLY release=$RELEASE_SHA"
  exit 0
fi

echo "=== [3/8] Préparation du rollback ==="
OLD_REDIS_IMAGE=$(docker inspect opays-redis --format '{{.Image}}' 2>/dev/null || true)
OLD_LIVEKIT_IMAGE=$(docker inspect opays-livekit --format '{{.Image}}' 2>/dev/null || true)
if [ -f "$LIVEKIT_CONFIG_FILE" ]; then
  cp "$LIVEKIT_CONFIG_FILE" "$OLD_CONFIG_FILE"
  chmod 600 "$OLD_CONFIG_FILE"
  OLD_CONFIG_AVAILABLE=1
fi
cleanup_candidates
PROMOTION_STARTED=1

echo "=== [4/8] Promotion Redis ==="
docker rm -f opays-livekit opays-redis 2>/dev/null || true
run_redis opays-redis "$REDIS_IMAGE" unless-stopped >/dev/null
wait_for_redis opays-redis
REDIS_IP=$(docker inspect opays-redis --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')

echo "=== [5/8] Promotion LiveKit ==="
create_config "$LIVEKIT_CONFIG_FILE" "$REDIS_IP"
run_livekit opays-livekit "$LIVEKIT_IMAGE" "$LIVEKIT_CONFIG_FILE" unless-stopped true >/dev/null
docker network connect opays-voice-net dokploy-traefik 2>/dev/null || true
wait_for_livekit opays-livekit
test "$(docker inspect opays-livekit --format '{{.RestartCount}}')" = "0"
test "$(stat -c '%a' "$LIVEKIT_CONFIG_FILE")" = "600"

echo "=== [6/8] Ouverture des ports WebRTC ==="
ufw allow 7880/tcp 2>&1 | tail -1
ufw allow 7881/tcp 2>&1 | tail -1
ufw allow 50000:50100/udp 2>&1 | tail -1

echo "=== [7/8] Vérification HTTP finale ==="
LIVEKIT_HTTP_CODE=$(curl -sS -o /dev/null -w '%{http_code}' -m 5 http://127.0.0.1:7880/)
test "$LIVEKIT_HTTP_CODE" = "200"
test "$(docker inspect opays-livekit --format '{{index .Config.Labels "traefik.http.routers.opays-rtc.priority"}}')" = "80"

echo "=== [8/8] Finalisation ==="
DEPLOYMENT_VERIFIED=1
trap - ERR INT TERM
rm -f "$OLD_CONFIG_FILE" "$LIVEKIT_CANDIDATE_CONFIG_FILE"
docker ps --filter name=opays- --format '{{.Names}} | {{.Status}}'
echo "DONE release=$RELEASE_SHA"