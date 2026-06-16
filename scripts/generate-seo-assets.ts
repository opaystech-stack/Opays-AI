/**
 * Génère les ressources d'indexation statiques `robots.txt` et `sitemap.xml`
 * dans le dossier `public/`, à partir des helpers purs de `src/lib/seo`.
 *
 * Exécuté avant chaque build (`prebuild`) et disponible en standalone
 * (`npm run generate:seo`). Réutilise la source unique `PUBLIC_ROUTES` via
 * `buildRobotsTxt`/`buildSitemapXml`, garantissant que les fichiers servis à la
 * racine restent synchronisés avec la définition des pages publiques.
 *
 * Servi à la racine : Vite copie le contenu de `public/` vers la racine du
 * bundle (`dist/`), donc `GET /robots.txt` et `GET /sitemap.xml` répondent 200
 * avec les bons `Content-Type` (`text/plain`, `application/xml`) déterminés par
 * l'extension de fichier côté hébergeur statique.
 *
 * Couvre : Requirement 7.1 (spec site-hardening-amelioration).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_ORIGIN } from "@/lib/seo/meta";
import { buildRobotsTxt, buildSitemapXml } from "@/lib/seo/sitemap";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "..", "public");

function emit(fileName: string, content: string): void {
  const target = resolve(publicDir, fileName);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
  console.log(`[seo] généré : public/${fileName} (${content.length} octets)`);
}

emit("robots.txt", buildRobotsTxt(SITE_ORIGIN));
emit("sitemap.xml", buildSitemapXml(undefined, SITE_ORIGIN));
