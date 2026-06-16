/**
 * Tests par propriétés du générateur de métadonnées SEO (meta.ts).
 *
 * Couvre :
 * - Property 24 « Conformité et unicité des balises title »   (Requirement 12.1)
 * - Property 25 « Conformité des balises description »         (Requirement 12.2)
 * - Property 26 « Canonical absolu et cohérent »               (Requirement 12.4)
 *
 * Harnais : Vitest 3 (globals) + fast-check, numRuns = 100.
 *
 * Stratégie : on exerce `buildPageMeta` sur des titres/descriptions de
 * longueurs variées (valides et invalides) afin de vérifier que la fonction
 * applique mécaniquement les bornes de conformité (production de balises
 * conformes pour des entrées valides, échec de construction sinon). On vérifie
 * aussi l'unicité réelle des titres et la cohérence des URLs canoniques sur
 * l'ensemble des pages publiques (`PUBLIC_ROUTES`).
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import {
  buildPageMeta,
  PUBLIC_ROUTES,
  SITE_ORIGIN,
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  type MetaTag,
} from "./meta";

const NUM_RUNS = 100;

/** Caractères « non blancs » : `trim()` est l'identité sur ces chaînes, donc
 *  la longueur brute égale la longueur normalisée. */
const WORD_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const wordChar = fc.constantFrom(...WORD_CHARS);

/** Chaîne sans espace de bord dont la longueur (= longueur après trim) est
 *  comprise entre `min` et `max` inclus. */
function trimStableStringArb(min: number, max: number): fc.Arbitrary<string> {
  return fc.array(wordChar, { minLength: min, maxLength: max }).map((a) => a.join(""));
}

// --- Arbitraires de titres ---------------------------------------------------

/** Titre conforme : longueur après trim dans [1, 60]. */
const validTitleArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: TITLE_MAX })
  .map((s) => (s.trim().length === 0 ? "x" : s));

/** Titre non conforme : vide après trim, ou trop long (> 60 après trim). */
const invalidTitleArb: fc.Arbitrary<string> = fc.oneof(
  fc.constantFrom("", " ", "   ", "\t", "\n  ", "  \t \n "),
  fc.integer({ min: TITLE_MAX + 1, max: 200 }).map((n) => "a".repeat(n)),
);

// --- Arbitraires de descriptions --------------------------------------------

/** Description conforme : longueur après trim dans [50, 160]. */
const validDescriptionArb: fc.Arbitrary<string> = trimStableStringArb(
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
);

/** Description non conforme : trop courte (< 50) ou trop longue (> 160) après trim. */
const invalidDescriptionArb: fc.Arbitrary<string> = fc.oneof(
  fc.constantFrom("", " ", "   "),
  trimStableStringArb(1, DESCRIPTION_MIN - 1),
  fc.integer({ min: DESCRIPTION_MAX + 1, max: 320 }).map((n) => "a".repeat(n)),
);

// --- Arbitraire de chemin de page -------------------------------------------

/** Segment d'URL non vide composé de caractères de mot. */
const segmentArb = trimStableStringArb(1, 12);

/** Chemin de page public plausible : racine, ou « / » suivi de 1..3 segments,
 *  avec barre oblique finale optionnelle. */
const pathArb: fc.Arbitrary<string> = fc.oneof(
  fc.constant("/"),
  fc
    .tuple(fc.array(segmentArb, { minLength: 1, maxLength: 3 }), fc.boolean())
    .map(([segments, trailing]) => `/${segments.join("/")}${trailing ? "/" : ""}`),
);

// --- Constantes valides réutilisées comme « partenaire conforme » -----------

const VALID_TITLE = "Titre conforme pour la page de test";
const VALID_DESCRIPTION =
  "Description conforme servant de partenaire valide afin d'isoler le champ sous test dans buildPageMeta.";

/** Extrait le contenu de la balise `<title>` émise. */
function titleContent(meta: MetaTag[]): string {
  const tag = meta.find((m): m is { title: string } => "title" in m);
  expect(tag).toBeDefined();
  return tag!.title;
}

/** Extrait le contenu de la meta `description` émise. */
function descriptionContent(meta: MetaTag[]): string | undefined {
  const tag = meta.find(
    (m): m is { name: string; content: string } => "name" in m && m.name === "description",
  );
  return tag?.content;
}

describe("buildPageMeta — Property 24: Conformité et unicité des balises title", () => {
  // Validates: Requirements 12.1
  it("produit un <title> non vide de 1 à 60 caractères pour tout titre conforme", () => {
    fc.assert(
      fc.property(validTitleArb, pathArb, (title, path) => {
        const { meta } = buildPageMeta({
          path,
          title,
          description: VALID_DESCRIPTION,
        });
        const content = titleContent(meta);
        expect(content.length).toBeGreaterThanOrEqual(TITLE_MIN);
        expect(content.length).toBeLessThanOrEqual(TITLE_MAX);
        expect(content).toBe(title.trim());
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Validates: Requirements 12.1
  it("lève une erreur (échec de construction) pour tout titre non conforme", () => {
    fc.assert(
      fc.property(invalidTitleArb, pathArb, (title, path) => {
        expect(() => buildPageMeta({ path, title, description: VALID_DESCRIPTION })).toThrow();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Validates: Requirements 12.1
  it("les titres des pages publiques sont conformes et sans doublon", () => {
    const titles = PUBLIC_ROUTES.map((route) =>
      titleContent(
        buildPageMeta({
          path: route.path,
          title: route.title,
          description: route.description,
        }).meta,
      ),
    );

    for (const title of titles) {
      expect(title.length).toBeGreaterThanOrEqual(TITLE_MIN);
      expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
    }
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe("buildPageMeta — Property 25: Conformité des balises description", () => {
  // Validates: Requirements 12.2
  it("produit une meta description non vide de 50 à 160 caractères pour toute description conforme", () => {
    fc.assert(
      fc.property(validDescriptionArb, pathArb, (description, path) => {
        const { meta } = buildPageMeta({
          path,
          title: VALID_TITLE,
          description,
        });
        const content = descriptionContent(meta);
        expect(content).toBeDefined();
        expect(content!.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(content!.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
        expect(content).toBe(description.trim());
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Validates: Requirements 12.2
  it("lève une erreur (échec de construction) pour toute description non conforme", () => {
    fc.assert(
      fc.property(invalidDescriptionArb, pathArb, (description, path) => {
        expect(() => buildPageMeta({ path, title: VALID_TITLE, description })).toThrow();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Validates: Requirements 12.2
  it("les descriptions des pages publiques sont conformes", () => {
    for (const route of PUBLIC_ROUTES) {
      const { meta } = buildPageMeta({
        path: route.path,
        title: route.title,
        description: route.description,
      });
      const content = descriptionContent(meta);
      expect(content).toBeDefined();
      expect(content!.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(content!.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });
});

describe("buildPageMeta — Property 26: Canonical absolu et cohérent", () => {
  // Validates: Requirements 12.4
  it('produit un <link rel="canonical"> absolu, issu de SITE_ORIGIN et cohérent avec le chemin', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const { links } = buildPageMeta({
          path,
          title: VALID_TITLE,
          description: VALID_DESCRIPTION,
        });

        const canonical = links.find((l) => l.rel === "canonical");
        expect(canonical).toBeDefined();
        const href = canonical!.href;

        // Absolu (URL complète https).
        expect(/^https:\/\//.test(href)).toBe(true);

        // Issu de l'origine canonique unique du site.
        const url = new URL(href);
        expect(url.origin).toBe(SITE_ORIGIN);
        expect(href.startsWith(SITE_ORIGIN)).toBe(true);

        // Cohérent avec le chemin : pathname = chemin normalisé (barres finales
        // supprimées, racine conservée à « / »).
        const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
        const expectedPathname =
          withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/+$/, "");
        expect(url.pathname).toBe(expectedPathname);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Validates: Requirements 12.4
  it("les canoniques des pages publiques sont absolus, issus de SITE_ORIGIN et tous distincts", () => {
    const canonicals = PUBLIC_ROUTES.map((route) => {
      const { links } = buildPageMeta({
        path: route.path,
        title: route.title,
        description: route.description,
      });
      const canonical = links.find((l) => l.rel === "canonical");
      expect(canonical).toBeDefined();
      return canonical!.href;
    });

    for (const href of canonicals) {
      expect(href.startsWith(SITE_ORIGIN)).toBe(true);
      expect(new URL(href).origin).toBe(SITE_ORIGIN);
    }
    expect(new Set(canonicals).size).toBe(canonicals.length);
  });
});
