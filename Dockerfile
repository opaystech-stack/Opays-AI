# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile Opays Tech — site vitrine statique pour Dokploy
# Multi-stage : build Node.js → serveur Nginx léger
# ─────────────────────────────────────────────────────────────────────────────

# Étape 1 — Build
FROM node:22-alpine AS builder

WORKDIR /app

# Dépendances
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Sources
COPY . .

# Variables d'environnement requises pour le build SEO
ARG VITE_SITE_ORIGIN=https://www.opays.io
ENV VITE_SITE_ORIGIN=${VITE_SITE_ORIGIN}

# Génération des assets SEO et build Vite
RUN npm run generate:seo
RUN npm run build

# Étape 2 — Serveur
FROM nginx:alpine

# Configuration Nginx et assets statiques
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sécurité : exécuter en non-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
