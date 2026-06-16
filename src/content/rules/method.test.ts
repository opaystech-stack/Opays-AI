/**
 * Tests de propriété du noyau de règles de la méthode (Page_Methode).
 *
 * Couvre les propriétés de correction du design :
 * - Property 10 : Omission des phases incomplètes (Requirements 5.2, 5.3, 5.6)
 * - Property 11 : Ordre chronologique des phases (Requirement 5.5)
 * - Property 12 : Couverture des catégories de méthode (Requirements 5.1, 5.4)
 *
 * Harnais : Vitest (globals) + fast-check, numRuns: 100.
 */

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { REQUIRED_CATEGORIES, coversRequiredCategories, selectRenderablePhases } from "./method";
import type { MethodCategory, MethodPhase, TimeUnit } from "../method";

const NUM_RUNS = 100;

const categoryArb: fc.Arbitrary<MethodCategory> = fc.constantFrom(
  "terrain",
  "frictions",
  "construction",
  "mise-en-service",
);

const timeUnitArb: fc.Arbitrary<TimeUnit> = fc.constantFrom("jours", "semaines");

/** Durée : soit absente (null), soit explicite. */
const durationArb = fc.option(
  fc.record({ value: fc.integer({ min: 1, max: 52 }), unit: timeUnitArb }),
  { nil: null },
);

/**
 * Livrable : mélange volontaire de libellés vides / blancs (à omettre) et de
 * libellés non vides, pour exercer la règle de complétude.
 */
const deliverableArb: fc.Arbitrary<string> = fc.oneof(
  fc.constantFrom("", "   ", "\t", "\n", "  \t  "),
  fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
);

/** Générateur d'une Phase_Methode arbitraire, complète ou incomplète. */
const phaseArb: fc.Arbitrary<MethodPhase> = fc.record({
  id: fc.string(),
  order: fc.integer({ min: -1000, max: 1000 }),
  name: fc.string(),
  deliverables: fc.array(deliverableArb, { maxLength: 5 }),
  duration: durationArb,
  category: categoryArb,
});

const phasesArb = fc.array(phaseArb, { maxLength: 12 });

/** Réplique locale du critère de complétude attendu par la spécification. */
function isComplete(phase: MethodPhase): boolean {
  const hasDeliverable = phase.deliverables.some((d) => d.trim().length > 0);
  return hasDeliverable && phase.duration !== null;
}

describe("selectRenderablePhases / coversRequiredCategories", () => {
  // Property 10: Omission des phases incomplètes
  // **Validates: Requirements 5.2, 5.3, 5.6**
  it("Property 10: ne conserve que les phases avec livrable non vide ET durée", () => {
    fc.assert(
      fc.property(phasesArb, (phases) => {
        const result = selectRenderablePhases(phases);

        // Toute phase conservée est complète (≥ 1 livrable non vide + durée).
        expect(result.every(isComplete)).toBe(true);

        // Toutes les phases complètes de l'entrée sont conservées, et seulement
        // elles : le compte des phases rendues égale le compte des complètes.
        const expectedCount = phases.filter(isComplete).length;
        expect(result.length).toBe(expectedCount);

        // Les phases conservées sont exactement les phases complètes de l'entrée.
        const completeInput = phases.filter(isComplete);
        expect(result.every((p) => completeInput.includes(p))).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 11: Ordre chronologique des phases
  // **Validates: Requirements 5.5**
  it("Property 11: la sortie est triée par ordre chronologique croissant", () => {
    fc.assert(
      fc.property(phasesArb, (phases) => {
        const result = selectRenderablePhases(phases);
        for (let i = 1; i < result.length; i += 1) {
          expect(result[i - 1].order <= result[i].order).toBe(true);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 12: Couverture des catégories de méthode
  // **Validates: Requirements 5.1, 5.4**
  it("Property 12: coversRequiredCategories vrai ssi les 4 catégories sont couvertes", () => {
    fc.assert(
      fc.property(phasesArb, (phases) => {
        const present = new Set(phases.map((p) => p.category));
        const expected = REQUIRED_CATEGORIES.every((c) => present.has(c));
        expect(coversRequiredCategories(phases)).toBe(expected);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 12 (cas couvrant) : lorsque les 4 catégories obligatoires sont
  // présentes, la couverture est vraie et au moins 4 phases distinctes existent.
  it("Property 12: une méthode couvrant les 4 catégories est validée", () => {
    const coveringPhasesArb = fc
      .tuple(phaseArb, phaseArb, phaseArb, phaseArb)
      .map(([a, b, c, d]) => [
        { ...a, category: "terrain" as const },
        { ...b, category: "frictions" as const },
        { ...c, category: "construction" as const },
        { ...d, category: "mise-en-service" as const },
      ]);

    fc.assert(
      fc.property(coveringPhasesArb, (phases) => {
        expect(coversRequiredCategories(phases)).toBe(true);
        expect(new Set(phases.map((p) => p.category)).size).toBeGreaterThanOrEqual(4);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
