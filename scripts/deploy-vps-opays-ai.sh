#!/bin/bash
# Déploiement site vitrine officiel Opays-AI sur opays.io / www.opays.io
# VPS partagé multi-sociétés : réseau DÉDIÉ opays-vitrine-net, isolation stricte.
set -euo pipefail

: "${RELEASE_SHA:?RELEASE_SHA doit être le SHA Git exact à déployer}"
if [[ ! "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "RELEASE_SHA doit être un SHA Git complet de 40 caractères" >&2
  exit 1
fi

BASE_DIR=/opt/opays-ai
REPO_DIR="$BASE_DIR/code"
RELEASE_DIR="$BASE_DIR/releases/$RELEASE_SHA"
IMAGE="opays-ai:$RELEASE_SHA"
OLD_IMAGE=""
OLD_RELEASE=""
PROMOTION_STARTED=0
DEPLOYMENT_VERIFIED=0
CONTACT_RESPONSE_FILE=$(mktemp /tmp/opays-contact-response.XXXXXX)
WWW_RESPONSE_FILE=$(mktemp /tmp/opays-www-contact-response.XXXXXX)

run_site() {
  local name=$1 image=$2 restart_policy=$3 expose_to_traefik=$4 release_label=$5
  local -a args=(
    docker run -d --name "$name" --restart "$restart_policy"
    --network opays-vitrine-net
    --label 'opays.isolated=true'
    --label 'opays.project=vitrine-officielle'
    --label "opays.release=$release_label"
  )
  if [ "$expose_to_traefik" = "true" ]; then
    args+=(
      --label 'traefik.enable=true'
      --label 'traefik.http.routers.opays-ai.rule=Host(`opays.io`) || Host(`www.opays.io`)'
      --label 'traefik.http.routers.opays-ai.entrypoints=websecure'
      --label 'traefik.http.routers.opays-ai.tls.certresolver=letsencrypt'
      --label 'traefik.http.routers.opays-ai.service=opays-ai'
      --label 'traefik.http.routers.opays-ai.priority=60'
      --label 'traefik.http.services.opays-ai.loadbalancer.server.port=8080'
    )
  else
    args+=(--label 'traefik.enable=false')
  fi
  "${args[@]}" "$image"
}

cleanup_candidate() {
  docker rm -f opays-ai-candidate 2>/dev/null || true
}

rollback() {
  local status=$?
  trap - ERR INT TERM
  cleanup_candidate
  if [ "$PROMOTION_STARTED" = "1" ] && [ "$DEPLOYMENT_VERIFIED" != "1" ]; then
    echo "Échec de promotion vitrine — restauration de l'image précédente" >&2
    docker rm -f opays-ai 2>/dev/null || true
    if [ -n "$OLD_IMAGE" ]; then
      run_site opays-ai "$OLD_IMAGE" unless-stopped true "$OLD_RELEASE" >/dev/null
    fi
  fi
  rm -f "$CONTACT_RESPONSE_FILE" "$WWW_RESPONSE_FILE"
  exit "$status"
}
trap rollback ERR INT TERM

echo "=== [1/7] Résolution du SHA exact ==="
mkdir -p "$BASE_DIR/releases"
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone https://github.com/opaystech-stack/Opays-AI.git "$REPO_DIR"
fi
git -C "$REPO_DIR" fetch --prune origin main
git -C "$REPO_DIR" cat-file -e "$RELEASE_SHA^{commit}"
git -C "$REPO_DIR" merge-base --is-ancestor "$RELEASE_SHA" origin/main
if [ -d "$RELEASE_DIR" ]; then
  git -C "$REPO_DIR" worktree remove --force "$RELEASE_DIR"
fi
git -C "$REPO_DIR" worktree prune
git -C "$REPO_DIR" worktree add --detach "$RELEASE_DIR" "$RELEASE_SHA"
test "$(git -C "$RELEASE_DIR" rev-parse HEAD)" = "$RELEASE_SHA"

echo "=== [2/7] Build de l'image immuable ==="
docker build -t "$IMAGE" "$RELEASE_DIR" 2>&1 | tail -5

echo "=== [3/7] Validation du candidat hors trafic ==="
docker network inspect opays-vitrine-net >/dev/null 2>&1 || \
  docker network create --driver bridge --label 'opays.isolated=true' opays-vitrine-net
cleanup_candidate
run_site opays-ai-candidate "$IMAGE" no false "$RELEASE_SHA" >/dev/null
sleep 3
test "$(docker inspect opays-ai-candidate --format '{{.State.Running}}')" = "true"
docker exec opays-ai-candidate wget -qO- --spider http://127.0.0.1:8080/contact/
docker exec opays-ai-candidate wget -qO- http://127.0.0.1:8080/contact/ | \
  grep -Fq '<title>Contact — réservez votre Diagnostic gratuit</title>'
if [ "${VALIDATE_ONLY:-0}" = "1" ]; then
  cleanup_candidate
  trap - ERR INT TERM
  rm -f "$CONTACT_RESPONSE_FILE" "$WWW_RESPONSE_FILE"
  echo "VALIDATED_ONLY release=$RELEASE_SHA"
  exit 0
fi

echo "=== [4/7] Promotion avec rollback ==="
OLD_IMAGE=$(docker inspect opays-ai --format '{{.Image}}' 2>/dev/null || true)
OLD_RELEASE=$(docker inspect opays-ai --format '{{index .Config.Labels "opays.release"}}' 2>/dev/null || true)
cleanup_candidate
PROMOTION_STARTED=1
docker rm -f opays-ai 2>/dev/null || true
run_site opays-ai "$IMAGE" unless-stopped true "$RELEASE_SHA" >/dev/null
docker network connect opays-vitrine-net dokploy-traefik 2>/dev/null || true

echo "=== [5/7] Vérification interne ==="
sleep 5
test "$(docker inspect opays-ai --format '{{.State.Running}}')" = "true"
test "$(docker inspect opays-ai --format '{{.RestartCount}}')" = "0"
test "$(docker inspect opays-ai --format '{{index .Config.Labels "opays.release"}}')" = "$RELEASE_SHA"
test "$(docker inspect opays-ai --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}')" = "opays-vitrine-net"
docker exec opays-ai wget -qO- --spider http://127.0.0.1:8080/contact/
docker exec opays-ai wget -qO- http://127.0.0.1:8080/contact/ | \
  grep -Fq '<title>Contact — réservez votre Diagnostic gratuit</title>'

echo "=== [6/7] Vérification HTTPS publique ==="
CONTACT_HTTP_CODE=$(curl -sS -o "$CONTACT_RESPONSE_FILE" -w '%{http_code}' -m 20 https://opays.io/contact/)
WWW_HTTP_CODE=$(curl -sS -o "$WWW_RESPONSE_FILE" -w '%{http_code}' -m 20 https://www.opays.io/contact/)
test "$CONTACT_HTTP_CODE" = "200"
test "$WWW_HTTP_CODE" = "200"
grep -Fq '<title>Contact — réservez votre Diagnostic gratuit</title>' "$CONTACT_RESPONSE_FILE"
grep -Fq '<title>Contact — réservez votre Diagnostic gratuit</title>' "$WWW_RESPONSE_FILE"

echo "=== [7/7] Finalisation ==="
DEPLOYMENT_VERIFIED=1
trap - ERR INT TERM
docker tag "$IMAGE" opays-ai:latest
rm -f "$CONTACT_RESPONSE_FILE" "$WWW_RESPONSE_FILE"
docker ps --filter name=opays-ai --format '{{.Names}} | {{.Status}}'
echo "DONE release=$RELEASE_SHA"
