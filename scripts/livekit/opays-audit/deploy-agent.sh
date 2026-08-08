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
  if [ "$(stat -c '%a' "$env_file")" != "600" ]; then
    echo "Permissions invalides pour $env_file (600 requis)" >&2
    exit 1
  fi
  set -a
  . "$env_file"
  set +a
done
: "${OPENROUTER_API_KEY:?OPENROUTER_API_KEY doit être injectée avant le déploiement}"
: "${LIVEKIT_API_KEY:?LIVEKIT_API_KEY doit être injectée avant le déploiement}"
: "${LIVEKIT_API_SECRET:?LIVEKIT_API_SECRET doit être injectée avant le déploiement}"
: "${TURN_SECRET:?TURN_SECRET doit être injecté avant le déploiement}"
: "${RELEASE_SHA:?RELEASE_SHA doit être le SHA Git exact à déployer}"
if [[ ! "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "RELEASE_SHA doit être un SHA Git complet de 40 caractères" >&2
  exit 1
fi
if [ "${#TURN_SECRET}" -lt 32 ]; then
  echo "TURN_SECRET doit contenir au moins 32 caractères" >&2
  exit 1
fi

VALIDATE_ONLY=${VALIDATE_ONLY:-0}
SRC=${SRC:-}
if [ -n "$SRC" ]; then
  if [ "${ALLOW_UNVERIFIED_SOURCE_TEST:-0}" != "1" ] || [ "$VALIDATE_ONLY" != "1" ]; then
    echo "SRC est interdit en déploiement ; utiliser le checkout Git exact intégré au script" >&2
    exit 1
  fi
  # Chemin explicite réservé exclusivement aux tests reproductibles du script.
  SOURCE_SHA_FILE="$SRC/.release-sha"
  if [ ! -f "$SOURCE_SHA_FILE" ] || [ "$(tr -d '\r\n' < "$SOURCE_SHA_FILE")" != "$RELEASE_SHA" ]; then
    echo "Les sources de $SRC ne correspondent pas à RELEASE_SHA=$RELEASE_SHA" >&2
    exit 1
  fi
else
  BASE_DIR=/opt/opays-voice/source
  REPO_DIR="$BASE_DIR/repository"
  RELEASE_DIR="$BASE_DIR/releases/$RELEASE_SHA"
  mkdir -p "$BASE_DIR/releases"
  if [ ! -d "$REPO_DIR/.git" ]; then
    git clone https://github.com/opaystech-stack/Opays-AI.git "$REPO_DIR"
  fi
  test "$(git -C "$REPO_DIR" remote get-url origin)" = "https://github.com/opaystech-stack/Opays-AI.git"
  git -C "$REPO_DIR" fetch --prune origin main
  git -C "$REPO_DIR" cat-file -e "$RELEASE_SHA^{commit}"
  git -C "$REPO_DIR" merge-base --is-ancestor "$RELEASE_SHA" origin/main
  if [ -d "$RELEASE_DIR" ]; then
    git -C "$REPO_DIR" worktree remove --force "$RELEASE_DIR"
  fi
  git -C "$REPO_DIR" worktree prune
  git -C "$REPO_DIR" worktree add --detach "$RELEASE_DIR" "$RELEASE_SHA"
  test "$(git -C "$RELEASE_DIR" rev-parse HEAD)" = "$RELEASE_SHA"
  SRC="$RELEASE_DIR/scripts/livekit/opays-audit"
  test -f "$SRC/Dockerfile"
  test -f "$SRC/token-server.Dockerfile"
fi
AGENT_IMAGE="opays-audit-agent:$RELEASE_SHA"
TOKEN_IMAGE="opays-token-server:$RELEASE_SHA"
TOKEN_RESPONSE_FILE=$(mktemp /tmp/opays-token-response.XXXXXX)
chmod 600 "$TOKEN_RESPONSE_FILE"
FIXTURE_DIR=$(mktemp -d /tmp/opays-speech-fixture.XXXXXX)
# La fixture n'est pas sensible ; le conteneur non-root (UID 10001) doit pouvoir
# y écrire, tandis que le nom aléatoire empêche toute collision prédictible.
chmod 733 "$FIXTURE_DIR"
E2E_FIXTURE_DIR=${E2E_FIXTURE_DIR:-/opt/opays-voice/e2e-fixtures/$RELEASE_SHA}
REQUIRE_VOICE_E2E=${REQUIRE_VOICE_E2E:-1}
if [ "$REQUIRE_VOICE_E2E" != "1" ] && { [ "${ALLOW_UNVERIFIED_SOURCE_TEST:-0}" != "1" ] || [ "$VALIDATE_ONLY" != "1" ]; }; then
  echo "REQUIRE_VOICE_E2E ne peut être désactivé qu'en VALIDATE_ONLY test explicite" >&2
  exit 1
fi
OLD_AGENT_IMAGE=""
OLD_TOKEN_IMAGE=""
OLD_AGENT_RELEASE=""
OLD_TOKEN_RELEASE=""
PROMOTION_STARTED=0
DEPLOYMENT_VERIFIED=0

# IPs des conteneurs (DNS Docker interne défaillant sur ce VPS — utiliser IP directes)
LIVEKIT_IP=$(docker inspect opays-livekit --format '{{range $k,$v := .NetworkSettings.Networks}}{{$v.IPAddress}}{{end}}')
echo "LiveKit IP: $LIVEKIT_IP"

assert_voice_network() {
  test "$(docker network inspect opays-voice-net --format '{{.Driver}}')" = "bridge"
  test "$(docker network inspect opays-voice-net --format '{{index .Labels \"opays.isolated\"}}')" = "true"
  while IFS= read -r endpoint; do
    case "$endpoint" in
      opays-redis|opays-livekit|opays-audit-agent|opays-token-server|opays-turn|opays-turn-candidate|opays-audit-agent-candidate|opays-token-server-candidate|dokploy-traefik) ;;
      "") ;;
      *) echo "Endpoint étranger dans opays-voice-net: $endpoint" >&2; return 1 ;;
    esac
  done < <(docker network inspect opays-voice-net --format '{{range $id, $container := .Containers}}{{$container.Name}}{{"\n"}}{{end}}')
}
assert_voice_network

run_agent() {
  local name=$1 image=$2 restart_policy=$3 release_label=${4:-$RELEASE_SHA}
  docker run -d --name "$name" --restart "$restart_policy" \
    --network opays-voice-net \
    --env-file "$LIVEKIT_ENV_FILE" \
    --env-file "$OPENROUTER_ENV_FILE" \
    -e LIVEKIT_URL="ws://$LIVEKIT_IP:7880" \
    -e OPENROUTER_BASE_URL=https://openrouter.ai/api/v1 \
    -e OPENROUTER_MODEL=openai/gpt-4o-mini \
    -e PIPER_VOICE_DIR=/voices \
    --label 'opays.isolated=true' \
    --label 'opays.project=voice' \
    --label "opays.release=$release_label" \
    "$image"
}

run_token_server() {
  local name=$1 image=$2 restart_policy=$3 expose_to_traefik=$4 release_label=${5:-$RELEASE_SHA}
  local -a args=(
    docker run -d --name "$name" --restart "$restart_policy"
    --network opays-voice-net
    --env-file "$LIVEKIT_ENV_FILE"
    -e LIVEKIT_WS_URL=wss://opays.io
    -e ALLOWED_ORIGINS=https://opays.io,https://www.opays.io
    --label 'opays.isolated=true'
    --label 'opays.project=voice'
    --label "opays.release=$release_label" \
  )
  if [ "$expose_to_traefik" = "true" ]; then
    args+=(
      --label 'traefik.enable=true'
      --label 'traefik.http.routers.opays-token.rule=(Host(`opays.io`) || Host(`www.opays.io`)) && PathPrefix(`/api/voice`)'
      --label 'traefik.http.routers.opays-token.entrypoints=websecure'
      --label 'traefik.http.routers.opays-token.tls.certresolver=letsencrypt'
      --label 'traefik.http.routers.opays-token.service=opays-token'
      --label 'traefik.http.routers.opays-token.priority=70'
      --label 'traefik.http.routers.opays-token.middlewares=opays-token-ratelimit@docker'
      --label 'traefik.http.middlewares.opays-token-ratelimit.ratelimit.average=5'
      --label 'traefik.http.middlewares.opays-token-ratelimit.ratelimit.burst=10'
      --label 'traefik.http.middlewares.opays-token-ratelimit.ratelimit.period=1m'
      --label 'traefik.http.services.opays-token.loadbalancer.server.port=8090'
    )
  else
    if [ "$name" = "opays-token-server-candidate" ]; then
      args+=(--publish "127.0.0.1:${CANDIDATE_TOKEN_PORT:-18090}:8090")
    fi
    args+=(--label 'traefik.enable=false')
  fi
  "${args[@]}" "$image"
}

cleanup_candidates() {
  docker rm -f opays-audit-agent-candidate opays-token-server-candidate 2>/dev/null || true
}

validate_agent_image() {
  docker run --rm --entrypoint python \
    -v "$FIXTURE_DIR:/fixtures" \
    "$AGENT_IMAGE" \
    generate_speech_fixture.py --output /fixtures/conversation.wav --metadata /fixtures/conversation.json
  docker run --rm --entrypoint python \
    -v "$FIXTURE_DIR:/fixtures" \
    "$AGENT_IMAGE" \
    validate_speech_fixture.py /fixtures/conversation.wav --metadata /fixtures/conversation.json
  if [ "$REQUIRE_VOICE_E2E" = "1" ]; then
    install -d -m 755 "$E2E_FIXTURE_DIR"
    install -m 644 "$FIXTURE_DIR/conversation.wav" "$E2E_FIXTURE_DIR/conversation.wav"
    install -m 644 "$FIXTURE_DIR/conversation.json" "$E2E_FIXTURE_DIR/conversation.json"
  fi
}

wait_for_agent_registration() {
  local container=$1
  for _ in $(seq 1 20); do
    test "$(docker inspect "$container" --format '{{.State.Running}}')" = "true"
    if docker logs "$container" 2>&1 | grep -q 'worker registered'; then
      return 0
    fi
    sleep 2
  done
  echo "L'agent candidat ne s'est pas enregistré auprès de LiveKit" >&2
  return 1
}

verify_token_container() {
  local container=$1
  docker exec -i "$container" python - <<'PY'
import json
import base64
import hashlib
import hmac
import os
import time
from urllib.request import Request, urlopen

with urlopen("http://127.0.0.1:8090/health", timeout=3) as response:
    assert response.status == 200
request = Request(
    "http://127.0.0.1:8090/api/voice/token",
    data=b"{}",
    headers={"Content-Type": "application/json", "Origin": "https://opays.io"},
    method="POST",
)
with urlopen(request, timeout=3) as response:
    assert response.status == 200
    payload = json.load(response)
assert payload["url"] == "wss://opays.io"
assert payload["token"] and payload["room"] and payload["ice_servers"]
ice_server = payload["ice_servers"][0]
turn_username = ice_server["username"]
expiration_text, identity = turn_username.split(":", 1)
expiration = int(expiration_text)
assert identity.startswith("visiteur-")
assert int(time.time()) < expiration <= int(time.time()) + 600
expected_credential = base64.b64encode(
    hmac.new(
        os.environ["TURN_SECRET"].encode(),
        turn_username.encode(),
        hashlib.sha1,
    ).digest()
).decode()
assert hmac.compare_digest(ice_server["credential"], expected_credential)
PY
}

run_voice_e2e() {
  if [ "$REQUIRE_VOICE_E2E" != "1" ]; then
    return 0
  fi
  : "${VOICE_E2E_COMMAND:?VOICE_E2E_COMMAND doit exécuter le Playwright RTC/TURN avec la fixture attestée}"
  TOKEN_ENDPOINT="http://127.0.0.1:${CANDIDATE_TOKEN_PORT:-18090}/api/voice/token" \
    TOKEN_REQUEST_ORIGIN=https://opays.io bash -lc "$VOICE_E2E_COMMAND"
}

rollback() {
  local status=$?
  trap - ERR INT TERM
  cleanup_candidates
  if [ "$PROMOTION_STARTED" = "1" ] && [ "$DEPLOYMENT_VERIFIED" != "1" ]; then
    echo "Échec de promotion — restauration des images précédentes" >&2
    docker rm -f opays-audit-agent opays-token-server 2>/dev/null || true
    local restore_status=0
    if ! run_agent opays-audit-agent "$OLD_AGENT_IMAGE" unless-stopped "$OLD_AGENT_RELEASE" >/dev/null; then
      restore_status=1
    fi
    if ! run_token_server opays-token-server "$OLD_TOKEN_IMAGE" unless-stopped true "$OLD_TOKEN_RELEASE" >/dev/null; then
      restore_status=1
    fi
    if [ "$restore_status" != "0" ]; then
      echo "ROLLBACK INCOMPLET : restauration des deux services échouée" >&2
      exit 1
    fi
  fi
  rm -f "$TOKEN_RESPONSE_FILE"
  rm -rf "$FIXTURE_DIR"
  exit "$status"
}
trap rollback ERR INT TERM

echo "=== [1/7] Build des images immuables ($RELEASE_SHA) ==="
cd "$SRC"
docker build -t "$AGENT_IMAGE" . 2>&1 | tail -4
docker build -f token-server.Dockerfile -t "$TOKEN_IMAGE" . 2>&1 | tail -3
validate_agent_image

echo "=== [2/7] Validation des conteneurs candidats ==="
cleanup_candidates
run_agent opays-audit-agent-candidate "$AGENT_IMAGE" no >/dev/null
run_token_server opays-token-server-candidate "$TOKEN_IMAGE" no false >/dev/null
wait_for_agent_registration opays-audit-agent-candidate
verify_token_container opays-token-server-candidate
run_voice_e2e
if [ "${VALIDATE_ONLY:-0}" = "1" ]; then
  cleanup_candidates
  trap - ERR INT TERM
  rm -f "$TOKEN_RESPONSE_FILE"
  rm -rf "$FIXTURE_DIR"
  echo "VALIDATED_ONLY release=$RELEASE_SHA"
  exit 0
fi

echo "=== [3/7] Préparation du rollback ==="
OLD_AGENT_IMAGE=$(docker inspect opays-audit-agent --format '{{.Image}}' 2>/dev/null || true)
OLD_TOKEN_IMAGE=$(docker inspect opays-token-server --format '{{.Image}}' 2>/dev/null || true)
OLD_AGENT_RELEASE=$(docker inspect opays-audit-agent --format '{{index .Config.Labels "opays.release"}}' 2>/dev/null || true)
OLD_TOKEN_RELEASE=$(docker inspect opays-token-server --format '{{index .Config.Labels "opays.release"}}' 2>/dev/null || true)
if [ -z "$OLD_AGENT_IMAGE" ] || [ -z "$OLD_TOKEN_IMAGE" ]; then
  echo "Promotion refusée : les deux images actives sont requises pour un rollback atomique" >&2
  exit 1
fi
cleanup_candidates
PROMOTION_STARTED=1

echo "=== [4/7] Promotion des conteneurs validés ==="
docker rm -f opays-audit-agent opays-token-server 2>/dev/null || true
run_agent opays-audit-agent "$AGENT_IMAGE" unless-stopped >/dev/null
run_token_server opays-token-server "$TOKEN_IMAGE" unless-stopped true >/dev/null
if ! docker network inspect opays-voice-net --format '{{range $id, $container := .Containers}}{{$container.Name}}{{"\n"}}{{end}}' | grep -qx 'dokploy-traefik'; then
  docker network connect opays-voice-net dokploy-traefik
fi
assert_voice_network

echo "=== [5/7] Vérification interne ==="
wait_for_agent_registration opays-audit-agent
verify_token_container opays-token-server
test "$(docker inspect opays-audit-agent --format '{{.RestartCount}}')" = "0"
test "$(docker inspect opays-token-server --format '{{.RestartCount}}')" = "0"

echo "=== [6/7] Vérification publique stricte ==="
TOKEN_HTTP_CODE=$(curl -sS -o "$TOKEN_RESPONSE_FILE" -w '%{http_code}' -m 15 \
  -X POST https://opays.io/api/voice/token \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://opays.io' \
  -d '{}')
test "$TOKEN_HTTP_CODE" = "200"
TOKEN_RESPONSE_FILE="$TOKEN_RESPONSE_FILE" python3 - <<'PY'
import json
import base64
import hashlib
import hmac
import os
import time
from pathlib import Path

payload = json.loads(Path(os.environ["TOKEN_RESPONSE_FILE"]).read_text(encoding="utf-8"))
assert payload["url"] == "wss://opays.io"
assert payload["token"] and payload["room"] and payload["ice_servers"]
ice_server = payload["ice_servers"][0]
turn_username = ice_server["username"]
expiration_text, identity = turn_username.split(":", 1)
expiration = int(expiration_text)
assert identity.startswith("visiteur-")
assert int(time.time()) < expiration <= int(time.time()) + 600
expected_credential = base64.b64encode(
    hmac.new(
        os.environ["TURN_SECRET"].encode(),
        turn_username.encode(),
        hashlib.sha1,
    ).digest()
).decode()
assert hmac.compare_digest(ice_server["credential"], expected_credential)
PY

echo "=== [7/7] Finalisation ==="
DEPLOYMENT_VERIFIED=1
trap - ERR INT TERM
docker tag "$AGENT_IMAGE" opays-audit-agent:latest
docker tag "$TOKEN_IMAGE" opays-token-server:latest
rm -f "$TOKEN_RESPONSE_FILE"
rm -rf "$FIXTURE_DIR"
docker ps --filter name=opays- --format '{{.Names}} | {{.Status}}'
echo "DONE release=$RELEASE_SHA"
