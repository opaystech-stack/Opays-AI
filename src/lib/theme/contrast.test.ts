/**
 * Tests par propriétés du calcul de contraste WCAG (contrast.ts).
 *
 * Couvre :
 * - Property 21 « Contraste lisible du texte principal » (Requirement 11.3)
 *
 * Harnais : Vitest 3 + fast-check, numRuns = 100.
 *
 * La propriété 21 du design garantit qu'une paire (texte, arrière-plan) du
 * thème reste lisible (ratio >= 4,5:1). On vérifie ici les invariants
 * fondamentaux du noyau de calcul dont dépend cette garantie :
 *  - le ratio est symétrique (l'ordre texte/fond n'a pas d'incidence) ;
 *  - le ratio est borné dans l'intervalle WCAG [1:1 .. 21:1] ;
 *  - `meetsContrast` est exactement « ratio défini et >= seuil » ;
 *  - les paires de référence (noir/blanc = 21, identiques = 1) sont exactes.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import {
  contrastRatio,
  meetsContrast,
  WCAG_AA_NORMAL,
  type Rgb,
} from "./contrast";

const NUM_RUNS = 100;
const EPS = 1e-9;

/** Composante 0..255. */
const channelArb: fc.Arbitrary<number> = fc.integer({ min: 0, max: 255 });

/** Couleur RGB arbitraire dans l'espace sRGB 8 bits. */
const rgbArb: fc.Arbitrary<Rgb> = fc.record({
  r: channelArb,
  g: channelArb,
  b: channelArb,
});

describe("contrastRatio / meetsContrast", () => {
  // Property 21: Contraste lisible du texte principal — Validates: Requirements 11.3
  it("Property 21: le ratio de contraste est symétrique et borné dans [1 .. 21]", () => {
    fc.assert(
      fc.property(rgbArb, rgbArb, (fg, bg) => {
        const ratio = contrastRatio(fg, bg);
        const reversed = contrastRatio(bg, fg);

        // Deux couleurs valides produisent toujours un ratio défini.
        expect(ratio).not.toBeNull();
        expect(reversed).not.toBeNull();

        // Symétrie : intervertir texte et fond ne change pas le ratio.
        expect(ratio!).toBeCloseTo(reversed!, 10);

        // Bornes WCAG : 1:1 (couleurs de même luminance) .. 21:1 (noir/blanc).
        expect(ratio!).toBeGreaterThanOrEqual(1 - EPS);
        expect(ratio!).toBeLessThanOrEqual(21 + EPS);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 21: meetsContrast équivaut exactement à « ratio défini et >= seuil »", () => {
    fc.assert(
      fc.property(
        rgbArb,
        rgbArb,
        fc.double({ min: 1, max: 21, noNaN: true }),
        (fg, bg, threshold) => {
          const ratio = contrastRatio(fg, bg);
          const expected = ratio !== null && ratio >= threshold;
          expect(meetsContrast(fg, bg, threshold)).toBe(expected);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 21: deux couleurs identiques ont un ratio de 1:1 (jamais conforme)", () => {
    fc.assert(
      fc.property(rgbArb, (color) => {
        const ratio = contrastRatio(color, color);
        expect(ratio).not.toBeNull();
        expect(ratio!).toBeCloseTo(1, 10);
        expect(meetsContrast(color, color, WCAG_AA_NORMAL)).toBe(false);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 21: paires de référence — noir/blanc = 21:1, conforme AA", () => {
    const black: Rgb = { r: 0, g: 0, b: 0 };
    const white: Rgb = { r: 255, g: 255, b: 255 };

    expect(contrastRatio(black, white)!).toBeCloseTo(21, 5);
    expect(contrastRatio(white, black)!).toBeCloseTo(21, 5);
    // Forme chaîne hexadécimale : même résultat.
    expect(contrastRatio("#000000", "#ffffff")!).toBeCloseTo(21, 5);
    expect(contrastRatio("#000", "#fff")!).toBeCloseTo(21, 5);

    expect(meetsContrast(black, white)).toBe(true);
    expect(meetsContrast(black, white, WCAG_AA_NORMAL)).toBe(true);
  });

  it("Property 21: une couleur invalide rend le ratio indéfini et le contraste non garanti", () => {
    expect(contrastRatio("pas-une-couleur", "#fff")).toBeNull();
    expect(contrastRatio("#fff", "rgb(300, 0, 0)")).toBeNull();
    expect(meetsContrast("pas-une-couleur", "#fff")).toBe(false);
  });
});
