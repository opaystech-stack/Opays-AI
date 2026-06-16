/**
 * Tests par propriétés du générateur de sitemap / robots / noindex (sitemap.ts).
 *
 * Couvre :
 * - Property 27 « Prototypes hors navigation et non indexables » (Requirement 12.5)
 * - Property 28 « Exclusion du sitemap des prototypes et chantiers externes »
 *   (Requirements 12.6, 13.5)
 * - Property 29 « Couverture exacte du sitemap » (Requirement 12.8), incluant la
 *   conservation de l'état antérieur en cas d'échec d'ajout (Requirement 12.9).
 *
 * Harnais : Vitest 3 (globals) + fast-check, numRuns = 100.
 * La source de vérité des URL canoniques reste `toCanonicalUrl` (meta.ts),
 * réutilisée ici pour exprimer les propriétés sans dupliquer la normalisation.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import { PUBLIC_ROUTES, SITE_ORIGIN, toCanonicalUrl, type PublicRoute } from "./meta";
import {
  PROTOTYPE_PATHS,
  NOINDEX_DIRECTIVE,
  isPrototypePath,
  buildNoindexMeta,
  buildSitemapXml,
  addPublicRouteToSitemap,
} from "./sitemap";
import { PUBLIC_PAGES } from "@/content/navigation";
import { EXTERNAL_PROJECTS } from "@/content/externalProjects";

const NUM_RUNS = 100;

const SAFE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

/** Segment de chemin sûr (alphanumérique, sans caractère XML réservé). */
const segmentArb: fc.Arbitrary<string> = fc
  .array(fc.constantFrom(...SAFE_CHARS), { minLength: 1, maxLength: 12 })
  .map((chars) => chars.join(""));

/**
 * Chemin de page publique : commence par « / », n'a que des segments
 * alphanumériques (donc jamais égal à un prototype, qui contient un tiret).
 */
const publicPathArb: fc.Arbitrary<string> = fc
  .array(segmentArb, { minLength: 1, maxLength: 3 })
  .map((segments) => `/${segments.join("/")}`);

/** Texte court non vide (titre/description ; non contraint par le sitemap). */
const shortTextArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 40 })
  .map((s) => (s.trim().length === 0 ? "x" : s));

/** Route publique arbitraire (chemin non prototype). */
const publicRouteArb: fc.Arbitrary<PublicRoute> = fc.record({
  path: publicPathArb,
  title: shortTextArb,
  description: shortTextArb,
});

/** Liste de routes publiques aux chemins canoniques uniques. */
const uniquePublicRoutesArb: fc.Arbitrary<PublicRoute[]> = fc.uniqueArray(publicRouteArb, {
  selector: (route) => toCanonicalUrl(route.path),
  maxLength: 10,
});

/** Chemin de prototype interne, avec barre oblique finale ou non. */
const prototypePathArb: fc.Arbitrary<string> = fc
  .tuple(fc.constantFrom(...PROTOTYPE_PATHS), fc.constantFrom("", "/", "//"))
  .map(([path, trailing]) => `${path}${trailing}`);

/** Origine absolue arbitraire (avec barres obliques finales variables). */
const originArb: fc.Arbitrary<string> = fc
  .tuple(fc.constantFrom("https://", "http://"), fc.domain(), fc.constantFrom("", "/", "//"))
  .map(([scheme, domain, trailing]) => `${scheme}${domain}${trailing}`);

/** Extrait toutes les valeurs `<loc>…</loc>` d'un document sitemap. */
function extractLocs(xml: string): string[] {
  const matches = xml.matchAll(/<loc>([^<]*)<\/loc>/g);
  return [...matches].map((m) => m[1]);
}

describe("isPrototypePath / buildNoindexMeta", () => {
  // Property 27: Prototypes hors navigation et non indexables — Validates: Requirements 12.5
  it("Property 27: tout prototype est détecté comme non indexable et aucune page de navigation ne le cible", () => {
    fc.assert(
      fc.property(prototypePathArb, (prototypePath) => {
        // Le prototype est bien reconnu, quelle que soit la barre oblique finale.
        expect(isPrototypePath(prototypePath)).toBe(true);

        // Le générateur de métadonnées produit une directive noindex.
        const meta = buildNoindexMeta();
        expect(meta).toContainEqual({ name: "robots", content: NOINDEX_DIRECTIVE });
        expect(NOINDEX_DIRECTIVE).toContain("noindex");
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 27: aucune page publique générée n'est classée comme prototype", () => {
    fc.assert(
      fc.property(publicPathArb, (path) => {
        expect(isPrototypePath(path)).toBe(false);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 27: aucun lien de la Navigation_Principale ne cible un prototype", () => {
    for (const page of PUBLIC_PAGES) {
      expect(isPrototypePath(page.path)).toBe(false);
    }
  });
});

describe("buildSitemapXml — exclusions", () => {
  // Property 28: Exclusion du sitemap des prototypes et chantiers externes
  // — Validates: Requirements 12.6, 13.5
  it("Property 28: le sitemap ne contient jamais d'URL de prototype ni de chantier externe", () => {
    fc.assert(
      fc.property(
        uniquePublicRoutesArb,
        fc.array(prototypePathArb, { minLength: 1, maxLength: 4 }),
        originArb,
        fc.array(fc.webUrl(), { maxLength: 4 }),
        (publicRoutes, prototypePaths, origin, externalUrls) => {
          // On injecte des routes prototypes parmi les routes publiques.
          const prototypeRoutes: PublicRoute[] = prototypePaths.map((path, i) => ({
            path,
            title: `proto-${i}`,
            description: `proto-desc-${i}`,
          }));
          const mixed = [...publicRoutes, ...prototypeRoutes];

          const xml = buildSitemapXml(mixed, origin);
          const locs = extractLocs(xml);

          // Aucune URL canonique de prototype ne figure dans le sitemap.
          for (const protoPath of prototypePaths) {
            expect(locs).not.toContain(toCanonicalUrl(protoPath, origin));
          }

          // Aucune URL de chantier externe (registre réel ou simulée) n'y figure.
          const externalCandidates = [
            ...EXTERNAL_PROJECTS.map((p) => p.url).filter((url): url is string => url !== null),
            ...externalUrls,
          ];
          for (const externalUrl of externalCandidates) {
            expect(locs).not.toContain(externalUrl);
          }

          // Le nombre d'entrées correspond aux seules routes publiques.
          expect(locs).toHaveLength(publicRoutes.length);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});

describe("buildSitemapXml / addPublicRouteToSitemap — couverture", () => {
  // Property 29: Couverture exacte du sitemap — Validates: Requirements 12.8
  it("Property 29: le sitemap liste en URL absolues exactement les pages publiques fournies", () => {
    fc.assert(
      fc.property(uniquePublicRoutesArb, originArb, (routes, origin) => {
        const locs = extractLocs(buildSitemapXml(routes, origin));
        const expected = routes.map((route) => toCanonicalUrl(route.path, origin));

        // Toutes les pages publiques, et seulement elles (égalité d'ensembles).
        expect(new Set(locs)).toEqual(new Set(expected));
        expect(locs).toHaveLength(expected.length);

        // Chaque entrée est une URL absolue (commence par l'origine normalisée).
        const normalizedOrigin = origin.replace(/\/+$/, "");
        for (const loc of locs) {
          expect(loc.startsWith(`${normalizedOrigin}/`)).toBe(true);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 29: avec le registre réel, le sitemap couvre exactement PUBLIC_ROUTES", () => {
    fc.assert(
      fc.property(originArb, (origin) => {
        const locs = extractLocs(buildSitemapXml(PUBLIC_ROUTES, origin));
        const expected = PUBLIC_ROUTES.map((route) => toCanonicalUrl(route.path, origin));
        expect(new Set(locs)).toEqual(new Set(expected));
        expect(locs).toHaveLength(expected.length);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Requirement 12.9 : conservation de l'état antérieur en cas d'échec d'ajout.
  it("Property 29: l'ajout d'un prototype échoue et préserve le sitemap antérieur", () => {
    fc.assert(
      fc.property(
        uniquePublicRoutesArb,
        prototypePathArb,
        originArb,
        (currentRoutes, prototypePath, origin) => {
          const previousXml = buildSitemapXml(currentRoutes, origin);
          const previousUrls = currentRoutes.map((route) => toCanonicalUrl(route.path, origin));
          const candidate: PublicRoute = {
            path: prototypePath,
            title: "Prototype",
            description: "Prototype interne",
          };

          const result = addPublicRouteToSitemap(currentRoutes, candidate, origin);

          expect(result.ok).toBe(false);
          // L'état valide antérieur est conservé à l'identique.
          expect(result.xml).toBe(previousXml);
          expect(result.urls).toEqual(previousUrls);
          if (!result.ok) {
            expect(result.rejectedUrl).toBe(toCanonicalUrl(prototypePath, origin));
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 29: l'ajout d'un doublon d'URL canonique échoue et préserve le sitemap", () => {
    fc.assert(
      fc.property(
        uniquePublicRoutesArb.filter((routes) => routes.length >= 1),
        fc.nat(),
        originArb,
        (currentRoutes, index, origin) => {
          const existing = currentRoutes[index % currentRoutes.length];
          const previousXml = buildSitemapXml(currentRoutes, origin);
          const candidate: PublicRoute = {
            path: existing.path,
            title: "Doublon",
            description: "Même URL canonique",
          };

          const result = addPublicRouteToSitemap(currentRoutes, candidate, origin);

          expect(result.ok).toBe(false);
          expect(result.xml).toBe(previousXml);
          if (!result.ok) {
            expect(result.rejectedUrl).toBe(toCanonicalUrl(existing.path, origin));
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 29: l'ajout d'une page publique inédite inclut sa nouvelle URL canonique", () => {
    fc.assert(
      fc.property(
        uniquePublicRoutesArb,
        publicPathArb,
        originArb,
        (currentRoutes, newPath, origin) => {
          const newCanonical = toCanonicalUrl(newPath, origin);
          // On garantit que la nouvelle URL n'existe pas déjà.
          fc.pre(
            !currentRoutes.some((route) => toCanonicalUrl(route.path, origin) === newCanonical),
          );
          const candidate: PublicRoute = {
            path: newPath,
            title: "Nouvelle page",
            description: "Page publique inédite",
          };

          const result = addPublicRouteToSitemap(currentRoutes, candidate, origin);

          expect(result.ok).toBe(true);
          expect(result.urls).toContain(newCanonical);
          expect(extractLocs(result.xml)).toContain(newCanonical);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
