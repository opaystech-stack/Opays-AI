/**
 * Prerender statique — génère des fichiers HTML pour chaque route publique
 * avec les métadonnées SEO complètes (title, meta description, OG tags,
 * canonical, JSON-LD) directement dans le HTML initial.
 *
 * Les crawlers qui n'exécutent pas JS verront ces balises. Les vrais titres
 * SEO sont ensuite injectés dynamiquement par TanStack Router côté client.
 *
 * Exécuté après le build (postbuild) via `npm run prerender`.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PUBLIC_ROUTES,
  SITE_ORIGIN,
  toCanonicalUrl,
  buildOrganizationJsonLd,
  type PublicRoute,
} from "../src/lib/seo/meta";
import { SECONDARY_PAGES } from "../src/content/navigation";

const here = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(here, "..", "dist");

// Lire le template index.html généré par Vite
const indexHtml = readFileSync(resolve(distDir, "index.html"), "utf8");

// Extraire les balises <script> et <link> du template (on les réinjecte)
const scripts = indexHtml.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/g) || [];
const stylesheets = indexHtml.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
const preloads = indexHtml.match(/<link[^>]*rel="modulepreload"[^>]*>/g) || [];

// Toutes les routes à prerender
const ALL_ROUTES: PublicRoute[] = [
  ...PUBLIC_ROUTES,
  // Les pages secondaires ont déjà leurs métadonnées dans PUBLIC_ROUTES
  // (on les a ajoutées plus tôt)
];

function buildMetaTags(route: PublicRoute): string {
  const canonical = toCanonicalUrl(route.path);
  const ogImage = `${SITE_ORIGIN}/opays-og.png`;
  const jsonLd = JSON.stringify(buildOrganizationJsonLd());

  return `
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="${canonical}" />
    <script type="application/ld+json">${jsonLd}</script>`.trim();
}

function prerenderRoute(route: PublicRoute): void {
  const metaTags = buildMetaTags(route);

  // Construire le HTML complet
  const html = `<!doctype html>
<html lang="fr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${metaTags}
    ${preloads.join("\n    ")}
    ${stylesheets.join("\n    ")}
  </head>
  <body>
    <div id="root"></div>
    ${scripts.join("\n    ")}
  </body>
</html>
`;

  // Déterminer le chemin de sortie
  const outPath = route.path === "/"
    ? resolve(distDir, "index.html")
    : resolve(distDir, route.path.slice(1), "index.html");

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  console.log(`[prerender] ${route.path} → ${outPath.replace(distDir, "dist")} (${html.length} octets)`);
}

// Prerender chaque route
for (const route of ALL_ROUTES) {
  prerenderRoute(route);
}

console.log(`\n[prerender] ✅ ${ALL_ROUTES.length} pages prerendues`);
