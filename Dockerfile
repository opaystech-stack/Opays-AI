# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile Opays Tech — site vitrine statique pour Dokploy
# Multi-stage : build Node.js → serveur Nginx léger (non-root)
# ─────────────────────────────────────────────────────────────────────────────

# ── Étape 1 : build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Sources
COPY . .

# Build avec les variables d'environnement publiques si elles sont fournies.
ARG VITE_SITE_ORIGIN=https://www.opays.io
ENV VITE_SITE_ORIGIN=${VITE_SITE_ORIGIN}

RUN npm run generate:seo
RUN npm run build

# ── Étape 2 : serveur statique Nginx (non-root) ──────────────────────────────
FROM nginx:stable-alpine

# Supprime la configuration par défaut, configure Nginx (PID dans /tmp, port 8080)
RUN rm -f /etc/nginx/conf.d/default.conf \
  && rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh \
  && mkdir -p /var/log/nginx /tmp /usr/share/nginx/html /var/cache/nginx/client_temp \
  && sed -i 's|^pid.*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
  && sed -i '/^user /d' /etc/nginx/nginx.conf

# Configuration Nginx écoutant sur 8080
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Validation avant démarrage
RUN nginx -t

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
