/**
 * Tests par propriétés du noyau des produits SaaS (saas.ts).
 *
 * Couvre :
 * - Property 17 « Validité et cardinalité des produits SaaS » (Requirements 8.1, 8.2)
 * - Property 18 « Résolution de l'action d'un produit » (Requirements 8.4, 8.6)
 *
 * Harnais : Vitest 3 + fast-check, numRuns = 100.
 * Les oracles de référence répliquent les règles de longueur (trim) et de
 * validité d'URL absolue (http/https) appliquées par l'implémentation, afin
 * d'exprimer les propriétés sans dépendre du DOM ni du réseau.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import type { SaasProduct } from "../saas";
import { selectRenderableProducts, resolveProductAction, PRODUCTS_MAX } from "./saas";

const NUM_RUNS = 100;

// --- Oracles de référence (mêmes règles que l'implémentation) ----------------

/** Longueur après normalisation (trim). */
const trimmedLength = (s: string): number => s.trim().length;

/** Nom valide ssi 1..60 caractères après trim. */
const isValidName = (name: string): boolean =>
  trimmedLength(name) >= 1 && trimmedLength(name) <= 60;

/** Description valide ssi 40..300 caractères après trim. */
const isValidDescription = (description: string): boolean =>
  trimmedLength(description) >= 40 && trimmedLength(description) <= 300;

/** Produit valide ssi nom ET description sont dans les bornes. */
const isValidProduct = (p: SaasProduct): boolean =>
  isValidName(p.name) && isValidDescription(p.description);

/** URL d'accès valide ssi renseignée et absolue http(s) (après trim). */
function isValidAccessUrl(accessUrl: string | null): accessUrl is string {
  if (accessUrl === null) return false;
  const trimmed = accessUrl.trim();
  if (trimmed.length === 0) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// --- Arbitraires -------------------------------------------------------------

/** Caractères non blancs : la longueur brute égale la longueur après trim. */
const nonBlankChar = fc.constantFrom(
  ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.,;:!?()éèàùçÉÀ".split(""),
);

/** Chaîne dont la longueur après trim est comprise dans [min, max] inclus. */
function textOfTrimmedLength(min: number, max: number): fc.Arbitrary<string> {
  return fc.array(nonBlankChar, { minLength: min, maxLength: max }).map((chars) => chars.join(""));
}

/** Suite uniquement blanche (vide après trim). */
const blankArb = fc.constantFrom("", " ", "   ", "\t", "\n  ", "  \t \n ");

/** Nom valide (1..60 après trim). */
const validNameArb = textOfTrimmedLength(1, 60);
/** Nom invalide : vide après trim, ou trop long (> 60). */
const invalidNameArb = fc.oneof(blankArb, textOfTrimmedLength(61, 80));

/** Description valide (40..300 après trim). */
const validDescriptionArb = textOfTrimmedLength(40, 300);
/** Description invalide : trop courte (< 40), vide, ou trop longue (> 300). */
const invalidDescriptionArb = fc.oneof(
  blankArb,
  textOfTrimmedLength(1, 39),
  textOfTrimmedLength(301, 340),
);

/** URL d'accès couvrant les cas valides et invalides (l'oracle tranche). */
const accessUrlArb: fc.Arbitrary<string | null> = fc.oneof(
  fc.constant(null),
  fc.webUrl(),
  fc.webUrl().map((u) => `  ${u}  `),
  fc.string(),
  fc.constantFrom(
    "",
    "   ",
    "example.com",
    "/chemin/relatif",
    "ftp://fichier.example.com",
    "mailto:contact@opays.tech",
    "javascript:alert(1)",
  ),
);

/** Produit dont la validité de nom/description est paramétrée. */
function productArb(
  nameArb: fc.Arbitrary<string>,
  descriptionArb: fc.Arbitrary<string>,
): fc.Arbitrary<SaasProduct> {
  return fc.record({
    name: nameArb,
    description: descriptionArb,
    accessUrl: accessUrlArb,
  });
}

/** Produit valide, invalide, ou mixte (un seul champ fautif). */
const anyProductArb: fc.Arbitrary<SaasProduct> = fc.oneof(
  productArb(validNameArb, validDescriptionArb),
  productArb(invalidNameArb, validDescriptionArb),
  productArb(validNameArb, invalidDescriptionArb),
  productArb(invalidNameArb, invalidDescriptionArb),
);

// --- Property 17 -------------------------------------------------------------

describe("selectRenderableProducts", () => {
  // Property 17: Validité et cardinalité des produits SaaS
  // Validates: Requirements 8.1, 8.2
  it("Property 17: ne conserve que les produits valides (nom 1..60, description 40..300) et plafonne à 12", () => {
    fc.assert(
      fc.property(fc.array(anyProductArb, { maxLength: 20 }), (products) => {
        const result = selectRenderableProducts(products);

        // Plafond de cardinalité (8.1) : au plus 12 produits.
        expect(result.length).toBeLessThanOrEqual(PRODUCTS_MAX);

        // Chaque produit conservé respecte les bornes de longueur (8.2).
        for (const product of result) {
          expect(isValidProduct(product)).toBe(true);
        }

        // Sélection exacte : les produits valides dans l'ordre d'entrée,
        // tronqués à 12, sans altération (mêmes références).
        const expected = products.filter(isValidProduct).slice(0, PRODUCTS_MAX);
        expect(result).toEqual(expected);

        // Aucun produit invalide ne survit à la sélection.
        for (const product of result) {
          expect(products).toContain(product);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 18: Résolution de l'action d'un produit
  // Validates: Requirements 8.4, 8.6
  it("Property 18: renvoie un lien d'accès si et seulement si l'URL est valide, sinon le CTA_Diagnostic", () => {
    fc.assert(
      fc.property(productArb(validNameArb, validDescriptionArb), (product) => {
        const action = resolveProductAction(product);

        // Au moins une action est toujours disponible (8.4).
        expect(["access", "cta"]).toContain(action.kind);

        if (isValidAccessUrl(product.accessUrl)) {
          // URL valide => lien d'accès portant l'URL normalisée (8.4).
          expect(action).toEqual({
            kind: "access",
            url: product.accessUrl.trim(),
          });
        } else {
          // URL absente ou invalide => repli sur le CTA_Diagnostic (8.6).
          expect(action).toEqual({ kind: "cta" });
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
