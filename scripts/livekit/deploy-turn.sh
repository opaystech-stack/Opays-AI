#!/bin/bash
# Déploiement TURN (coturn) pour WebRTC — contourne le blocage UDP du pare-feu cloud Hostinger.
# Le média navigateur ↔ LiveKit passe par TURN over TCP 3478 (traverse les pare-feux).
set -euo pipefail

LIVEKIT_ENV_FILE=${LIVEKIT_ENV_FILE:-/opt/opays-voice/livekit.env}
COTURN_IMAGE=${COTURN_IMAGE:-coturn/coturn@sha256:7df59bcd84800c3978da2dd0d7fb17a8179e77a8bf667f678813120a9f18b094}
TURN_CONTAINER_NAME=${TURN_CONTAINER_NAME:-opays-turn}
TURN_CONFIG_FILE=${TURN_CONFIG_FILE:-/opt/opays-voice/${TURN_CONTAINER_NAME}.conf}
TURN_CANDIDATE_NAME="${TURN_CONTAINER_NAME}-candidate"

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
: "${TURN_SECRET:?TURN_SECRET doit être injecté avant le déploiement}"
TURN_PUBLIC_IP=${TURN_HOST:-76.13.58.5}
TURN_PORT=${TURN_PORT:-3478}
TURN_MIN_PORT=${TURN_MIN_PORT:-49160}
TURN_MAX_PORT=${TURN_MAX_PORT:-49200}
if [[ ! "$TURN_CONTAINER_NAME" =~ ^[a-zA-Z0-9_.-]+$ ]]; then
  echo "TURN_CONTAINER_NAME invalide" >&2
  exit 1
fi
for port_value in "$TURN_PORT" "$TURN_MIN_PORT" "$TURN_MAX_PORT"; do
  if [[ ! "$port_value" =~ ^[0-9]+$ ]] || [ "$port_value" -lt 1024 ] || [ "$port_value" -gt 65535 ]; then
    echo "Port TURN invalide: $port_value" >&2
    exit 1
  fi
done
if [ "$TURN_MIN_PORT" -gt "$TURN_MAX_PORT" ]; then
  echo "TURN_MIN_PORT doit être inférieur ou égal à TURN_MAX_PORT" >&2
  exit 1
fi
if [ "${#TURN_SECRET}" -lt 32 ]; then
  echo "TURN_SECRET doit contenir au moins 32 caractères" >&2
  exit 1
fi

OLD_IMAGE=$(docker inspect "$TURN_CONTAINER_NAME" --format '{{.Image}}' 2>/dev/null || true)
OLD_CONFIG_FILE=$(mktemp /tmp/opays-turn-config.XXXXXX)
chmod 600 "$OLD_CONFIG_FILE"
OLD_CONFIG_AVAILABLE=0
if [ -f "$TURN_CONFIG_FILE" ]; then
  cp "$TURN_CONFIG_FILE" "$OLD_CONFIG_FILE"
  chmod 600 "$OLD_CONFIG_FILE"
  OLD_CONFIG_AVAILABLE=1
fi
PROMOTION_STARTED=0
DEPLOYMENT_VERIFIED=0

cleanup_candidate() {
  docker rm -f "$TURN_CANDIDATE_NAME" 2>/dev/null || true
}

run_turn() {
  local name=$1 image=$2 restart_policy=$3 publish_ports=$4
  local -a args=(
    docker run -d --name "$name" --restart "$restart_policy"
    --network opays-voice-net
    -v "$TURN_CONFIG_FILE:/etc/coturn/turnserver.conf:ro"
    --label 'opays.isolated=true'
    --label 'opays.project=voice'
    --label "opays.release=${RELEASE_SHA:-unknown}"
  )
  if [ "$publish_ports" = "true" ]; then
    args+=(
      -p "$TURN_PORT:$TURN_PORT/tcp"
      -p "$TURN_PORT:$TURN_PORT/udp"
      -p "$TURN_MIN_PORT-$TURN_MAX_PORT:$TURN_MIN_PORT-$TURN_MAX_PORT/tcp"
      -p "$TURN_MIN_PORT-$TURN_MAX_PORT:$TURN_MIN_PORT-$TURN_MAX_PORT/udp"
    )
  fi
  "${args[@]}" "$image" -n -c /etc/coturn/turnserver.conf
}

rollback() {
  local status=$?
  trap - ERR INT TERM
  cleanup_candidate
  if [ "$OLD_CONFIG_AVAILABLE" = "1" ]; then
    cp "$OLD_CONFIG_FILE" "$TURN_CONFIG_FILE"
    chmod 600 "$TURN_CONFIG_FILE"
  fi
  if [ "$PROMOTION_STARTED" = "1" ] && [ "$DEPLOYMENT_VERIFIED" != "1" ] && [ -n "$OLD_IMAGE" ]; then
    echo "Échec de promotion TURN — restauration du relais précédent" >&2
    docker rm -f "$TURN_CONTAINER_NAME" 2>/dev/null || true
    run_turn "$TURN_CONTAINER_NAME" "$OLD_IMAGE" unless-stopped true >/dev/null || true
  fi
  rm -f "$OLD_CONFIG_FILE"
  exit "$status"
}
trap rollback ERR INT TERM

install -d -m 700 "$(dirname "$TURN_CONFIG_FILE")"
umask 077
cat > "$TURN_CONFIG_FILE" <<EOF
realm=opays.io
listening-port=$TURN_PORT
external-ip=$TURN_PUBLIC_IP
min-port=$TURN_MIN_PORT
max-port=$TURN_MAX_PORT
use-auth-secret
static-auth-secret=$TURN_SECRET
no-cli
no-tls
no-dtls
no-loopback-peers
no-multicast-peers
fingerprint
user-quota=4
total-quota=100
max-bps=200000
bps-capacity=400000
max-allocate-lifetime=600
stale-nonce=600
denied-peer-ip=0.0.0.0-0.255.255.255
denied-peer-ip=10.0.0.0-10.255.255.255
denied-peer-ip=100.64.0.0-100.127.255.255
denied-peer-ip=127.0.0.0-127.255.255.255
denied-peer-ip=169.254.0.0-169.254.255.255
denied-peer-ip=172.16.0.0-172.31.255.255
denied-peer-ip=192.0.0.0-192.0.0.255
denied-peer-ip=192.168.0.0-192.168.255.255
denied-peer-ip=198.18.0.0-198.19.255.255
denied-peer-ip=224.0.0.0-255.255.255.255
EOF
chmod 600 "$TURN_CONFIG_FILE"

echo "=== [1/3] Validation d'un conteneur candidat ==="
docker network inspect opays-voice-net >/dev/null
cleanup_candidate
run_turn "$TURN_CANDIDATE_NAME" "$COTURN_IMAGE" no false >/dev/null
sleep 3
test "$(docker inspect "$TURN_CANDIDATE_NAME" --format '{{.State.Running}}')" = "true"
cleanup_candidate
if [ "${VALIDATE_ONLY:-0}" = "1" ]; then
  if [ "$OLD_CONFIG_AVAILABLE" = "1" ]; then
    cp "$OLD_CONFIG_FILE" "$TURN_CONFIG_FILE"
    chmod 600 "$TURN_CONFIG_FILE"
  fi
  trap - ERR INT TERM
  rm -f "$OLD_CONFIG_FILE"
  echo "VALIDATED_ONLY container=$TURN_CONTAINER_NAME"
  exit 0
fi

echo "=== [2/3] Remplacement du conteneur coturn ==="
PROMOTION_STARTED=1
docker rm -f "$TURN_CONTAINER_NAME" 2>/dev/null || true
run_turn "$TURN_CONTAINER_NAME" "$COTURN_IMAGE" unless-stopped true >/dev/null

echo "=== [3/3] Pare-feu et vérification ==="
ufw allow "$TURN_PORT/tcp" 2>&1 | tail -1
ufw allow "$TURN_PORT/udp" 2>&1 | tail -1
ufw allow "$TURN_MIN_PORT:$TURN_MAX_PORT/tcp" 2>&1 | tail -1
ufw allow "$TURN_MIN_PORT:$TURN_MAX_PORT/udp" 2>&1 | tail -1
sleep 3
test "$(docker inspect "$TURN_CONTAINER_NAME" --format '{{.State.Running}}')" = "true"
test "$(docker inspect "$TURN_CONTAINER_NAME" --format '{{.RestartCount}}')" = "0"
test "$(stat -c '%a' "$TURN_CONFIG_FILE")" = "600"
docker ps --filter "name=$TURN_CONTAINER_NAME" --format '{{.Names}} | {{.Status}}'
docker logs --tail 4 "$TURN_CONTAINER_NAME" 2>&1 | tail -3
DEPLOYMENT_VERIFIED=1
trap - ERR INT TERM
rm -f "$OLD_CONFIG_FILE"
echo "DONE"
