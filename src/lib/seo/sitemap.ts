/**
 * Générateur pur du sitemap XML, du robots.txt et de la directive `noindex`
 * des prototypes internes (Gestionnaire_Indexation).
 *
 * Ce module réutilise la source unique `PUBLIC_ROUTES` (`./meta`) pour lister
 * exactement les pages publiques en URL canoniques absolues. Il garantit :
 * - l'inclusion de chaque page publique dans le sitemap (Requirement 12.8) ;
 * - l'exclusion des prototypes internes du sitemap et leur marquage non
 *   indexable (Requirements 12.5, 12.6) ;
 * - l'exclusion des URL des chantiers externes du sitemap (Requirement 13.5) ;
 * - la conservation du sitemap dans son état valide antérieur si l'ajout d'une
 *   page échoue, en signalant l'URL non ajoutée (Requirement 12.9).
 *
 * Mutualisé avec le spec `site-hardening-amelioration` : logique pure, sans I/O,
 * directement testable et consommable par la couche de build/route. Pour ce
 * spec, ce module garantit également :
 * - `buildRobotsTxt` référence l'URL absolue du Sitemap_Xml (Requirement 7.2) ;
 * - `buildSitemapXml` liste uniquement les routes publiques en URL absolues
 *   (Requirement 7.3) ;
 * - les prototypes internes (`PROTOTYPE_ROUTES`) sont exclus du sitemap et
 *   interdits dans le robots.txt (Requirements 7.4, 10.3).
 *
 * Couvre : Requirements 12.5, 12.6, 12.8, 12.9, 13.5 (refonte) et 7.2, 7.3,
 * 7.4, 10.3 (durcissement).
 */

import { PUBLIC_ROUTES, SITE_ORIGIN, toCanonicalUrl, type MetaTag, type PublicRoute } from "./meta";

/**
 * Chemins des prototypes internes (Pages_Prototype) : hors navigation publique,
 * hors sitemap et non indexables (Requirements 7.4, 10.3). Source unique alignée
 * sur les routes `src/routes/tenant-0.tsx` et `src/routes/bridges-os.tsx`.
 *
 * Nom canonique retenu par la conception (`design.md`, §7) du spec
 * `site-hardening-amelioration`.
 */
export const PROTOTYPE_ROUTES: readonly string[] = ["/tenant-0", "/bridges-os"];

/**
 * Alias rétrocompatible de `PROTOTYPE_ROUTES` (nommage historique du spec
 * `refonte-site-vitrine`). Conservé pour ne pas casser les consommateurs
 * existants ; préférer `PROTOTYPE_ROUTES` dans tout nouveau code.
 */
export const PROTOTYPE_PATHS: readonly string[] = PROTOTYPE_ROUTES;

/** Directive robots appliquée aux prototypes internes. */
export const NOINDEX_DIRECTIVE = "noindex, nofollow";

/** Vrai si le chemin correspond à un prototype interne. */
export function isPrototypePath(path: string): boolean {
  const normalized = normalizePath(path);
  return PROTOTYPE_ROUTES.some((proto) => normalizePath(proto) === normalized);
}

/**
 * Balise meta `robots` marquant une page comme non indexable. À appliquer dans
 * le `<head>` des routes prototypes (Requirement 12.5).
 */
export function buildNoindexMeta(): MetaTag[] {
  return [{ name: "robots", content: NOINDEX_DIRECTIVE }];
}

/** Une entrée `<url>` du sitemap. */
export interface SitemapEntry {
  /** URL canonique absolue de la page. */
  loc: string;
  changefreq?: PublicRoute["changefreq"];
  priority?: number;
}

/**
 * Résultat d'une tentative d'ajout d'une page au sitemap.
 * En cas d'échec, `xml` reflète l'état valide antérieur (Requirement 12.9).
 */
export type SitemapAddResult =
  | { ok: true; xml: string; urls: string[] }
  | { ok: false; xml: string; urls: string[]; rejectedUrl: string; error: string };

/** Échappe les caractères XML réservés dans une URL. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Normalise un chemin pour comparaison (sans barre oblique finale superflue). */
function normalizePath(path: string): string {
  if (path === "/" || path === "") return "/";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.replace(/\/+$/, "");
}

/**
 * Vrai si une route est éligible au sitemap public : page publique, non
 * prototype. Les chantiers externes ne figurent jamais dans `PUBLIC_ROUTES`,
 * donc sont exclus par construction (Requirement 13.5).
 */
function isPublicSitemapRoute(route: Pick<PublicRoute, "path">): boolean {
  return !isPrototypePath(route.path);
}

/** Convertit une route publique en entrée de sitemap (URL absolue). */
function toSitemapEntry(route: PublicRoute, origin: string): SitemapEntry {
  return {
    loc: toCanonicalUrl(route.path, origin),
    changefreq: route.changefreq,
    priority: route.priority,
  };
}

/** Sérialise une liste d'entrées en document sitemap XML. */
function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
      if (entry.changefreq) {
        parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (typeof entry.priority === "number") {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
}

/**
 * Construit le sitemap XML listant toutes les pages publiques (et seulement
 * elles) en URL canoniques absolues. Les prototypes internes et les chantiers
 * externes sont exclus (Requirements 12.6, 12.8, 13.5).
 */
export function buildSitemapXml(
  routes: PublicRoute[] = PUBLIC_ROUTES,
  origin: string = SITE_ORIGIN,
): string {
  const entries = routes.filter(isPublicSitemapRoute).map((route) => toSitemapEntry(route, origin));
  return renderSitemap(entries);
}

/**
 * Tente d'ajouter une page publique au sitemap. En cas de succès, renvoie le
 * sitemap incluant la nouvelle URL canonique (Requirement 12.8). En cas d'échec
 * (chemin de prototype, URL de chantier externe, ou doublon), conserve l'état
 * valide antérieur et signale l'URL non ajoutée (Requirement 12.9).
 */
export function addPublicRouteToSitemap(
  currentRoutes: PublicRoute[],
  candidate: PublicRoute,
  origin: string = SITE_ORIGIN,
): SitemapAddResult {
  const previousRoutes = currentRoutes.filter(isPublicSitemapRoute);
  const previousXml = buildSitemapXml(previousRoutes, origin);
  const previousUrls = previousRoutes.map((route) => toCanonicalUrl(route.path, origin));
  const candidateUrl = toCanonicalUrl(candidate.path, origin);

  const fail = (error: string): SitemapAddResult => ({
    ok: false,
    xml: previousXml,
    urls: previousUrls,
    rejectedUrl: candidateUrl,
    error: `[seo/sitemap] ${error} URL non ajoutée : ${candidateUrl}.`,
  });

  // Un prototype interne ne doit jamais entrer dans le sitemap.
  if (isPrototypePath(candidate.path)) {
    return fail("La page est un prototype interne (non indexable).");
  }

  // Pas de doublon d'URL canonique.
  if (previousUrls.includes(candidateUrl)) {
    return fail("Une page avec la même URL canonique figure déjà au sitemap.");
  }

  const nextRoutes = [...previousRoutes, candidate];
  return {
    ok: true,
    xml: buildSitemapXml(nextRoutes, origin),
    urls: nextRoutes.map((route) => toCanonicalUrl(route.path, origin)),
  };
}

/**
 * Construit le contenu du fichier robots.txt : autorise l'indexation des pages
 * publiques, interdit explicitement les prototypes internes (Requirements 7.4,
 * 10.3) et référence le sitemap par son URL absolue (Requirement 7.2).
 */
export function buildRobotsTxt(origin: string = SITE_ORIGIN): string {
  const trimmedOrigin = origin.replace(/\/+$/, "");
  const disallow = PROTOTYPE_ROUTES.map((path) => `Disallow: ${normalizePath(path)}`);

  return (
    ["User-agent: *", "Allow: /", ...disallow, "", `Sitemap: ${trimmedOrigin}/sitemap.xml`].join(
      "\n",
    ) + "\n"
  );
}
