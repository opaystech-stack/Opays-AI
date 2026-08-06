#!/bin/bash
# Déploiement site vitrine officiel Opays-AI sur opays.io / www.opays.io
# VPS partagé multi-sociétés : réseau DÉDIÉ opays-vitrine-net, isolation stricte.
set -e

echo "=== [1/7] Clone/mise à jour du repo officiel ==="
mkdir -p /opt/opays-ai
cd /opt/opays-ai
if [ -d "code/.git" ]; then
  cd code && git pull origin main 2>&1 | tail -2
else
  git clone https://github.com/opaystech-stack/Opays-AI.git code 2>&1 | tail -2
  cd code
fi
git rev-parse HEAD

echo "=== [2/7] Build image Docker (Dockerfile officiel, nginx:8080) ==="
docker build -t opays-ai:latest . 2>&1 | tail -5

echo "=== [3/7] Réseau dédié opays-vitrine-net ==="
docker network inspect opays-vitrine-net >/dev/null 2>&1 || docker network create --driver bridge --label 'opays.isolated=true' opays-vitrine-net
echo "réseau prêt"

echo "=== [4/7] Remplacement du conteneur opays-ai ==="
docker rm -f opays-ai 2>/dev/null || true
docker run -d \
  --name opays-ai \
  --restart unless-stopped \
  --network opays-vitrine-net \
  --label 'traefik.enable=true' \
  --label 'traefik.http.routers.opays-ai.rule=Host(`opays.io`) || Host(`www.opays.io`)' \
  --label 'traefik.http.routers.opays-ai.entrypoints=websecure' \
  --label 'traefik.http.routers.opays-ai.tls.certresolver=letsencrypt' \
  --label 'traefik.http.routers.opays-ai.service=opays-ai' \
  --label 'traefik.http.routers.opays-ai.priority=60' \
  --label 'traefik.http.services.opays-ai.loadbalancer.server.port=8080' \
  --label 'opays.isolated=true' \
  --label 'opays.project=vitrine-officielle' \
  opays-ai:latest

echo "=== [5/7] Connexion Traefik au réseau dédié (seul pont autorisé) ==="
docker network connect opays-vitrine-net dokploy-traefik 2>/dev/null || true

echo "=== [6/7] Attente démarrage + santé ==="
sleep 8
docker ps --filter name=opays-ai --format '{{.Names}} | {{.Status}}'

echo "=== [7/7] Vérifications ==="
echo "--- isolation conteneur (doit être UNIQUEMENT opays-vitrine-net) ---"
docker inspect opays-ai --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
echo "--- routes Traefik opays ---"
docker exec dokploy-traefik wget -qO- http://localhost:8080/api/http/routers 2>/dev/null | grep -o '"name":"opays-ai@docker"[^}]*' | head -3 || echo "route en cours de propagation"
echo "--- HTTP local conteneur ---"
docker exec opays-ai wget -qO- --spider http://localhost:8080/ 2>&1 && echo "nginx OK (8080)" || echo "ATTENTION: nginx injoignable"
echo "DONE"
