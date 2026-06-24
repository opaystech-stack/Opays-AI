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

# Supprime la configuration par défaut et prépare les dossiers pour l'utilisateur non-root
RUN rm -f /etc/nginx/conf.d/default.conf \
  && rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh \
  && mkdir -p /var/log/nginx /tmp /usr/share/nginx/html \
  && chown -R nginx:nginx /var/log/nginx /tmp /usr/share/nginx/html /etc/nginx/conf.d

# Configuration Nginx écoutant sur 8080 et PID dans /tmp
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Droits
RUN chown -R nginx:nginx /usr/share/nginx/html

# Utilisateur non-root
USER nginx

EXPOSE 8080

# Validation avant démarrage
RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]
