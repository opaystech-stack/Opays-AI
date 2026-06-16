/**
 * Tests par propriétés du noyau de sélection des Paliers (offers.ts).
 *
 * Couvre :
 * - Property 3 « Paliers ordonnés et complets » (Requirement 3.1)
 * - Property 9 « Omission des paliers incomplets » (Requirement 4.7)
 *
 * Harnais : Vitest 3 (globals) + fast-check, numRuns = 100.
 * La source de vérité de la validité d'un Resume_Offre reste
 * `validateResumeOffre` (resume.ts), réutilisée ici pour exprimer les
 * propriétés sans dupliquer les règles éditoriales.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import type { Offer, OfferTier, ResumeOffre } from "../offers";
import { validateResumeOffre } from "./resume";
import { selectRenderableOffers } from "./offers";

const NUM_RUNS = 100;

const TIERS: OfferTier[] = ["diagnostic", "systeme", "transformation"];
const RESUME_KEYS = [
  "problemeTraite",
  "solutionProposee",
  "beneficeOperationnel",
  "niveauAccompagnement",
  "prochaineAction",
] as const;

/** Chaîne dont la longueur après trim est comprise entre 1 et 280 inclus. */
const validLineArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 280 })
  .map((s) => (s.trim().length === 0 ? "x" : s));

/** Ligne invalide : vide après normalisation, ou trop longue (> 280 après trim). */
const invalidLineArb: fc.Arbitrary<string> = fc.oneof(
  fc.constantFrom("", " ", "   ", "\t", "\n  ", "  \t \n "),
  fc.integer({ min: 281, max: 400 }).map((n) => "a".repeat(n)),
);

/** Resume_Offre dont les cinq lignes sont valides. */
const validResumeArb: fc.Arbitrary<ResumeOffre> = fc.record({
  problemeTraite: validLineArb,
  solutionProposee: validLineArb,
  beneficeOperationnel: validLineArb,
  niveauAccompagnement: validLineArb,
  prochaineAction: validLineArb,
});

/** Resume_Offre dont au moins une ligne est invalide. */
const invalidResumeArb: fc.Arbitrary<ResumeOffre> = validResumeArb.chain((base) =>
  fc
    .uniqueArray(fc.constantFrom(...RESUME_KEYS), {
      minLength: 1,
      maxLength: RESUME_KEYS.length,
    })
    .chain((keysToCorrupt) =>
      fc.tuple(...keysToCorrupt.map(() => invalidLineArb)).map((badValues) => {
        const corrupted: ResumeOffre = { ...base };
        keysToCorrupt.forEach((key, i) => {
          corrupted[key] = badValues[i];
        });
        return corrupted;
      }),
    ),
);

/** Génère une offre, paramétrée par l'arbitraire de son Resume_Offre. */
function offerArb(resumeArb: fc.Arbitrary<ResumeOffre>): fc.Arbitrary<Offer> {
  return fc.record({
    tier: fc.constantFrom(...TIERS),
    order: fc.integer({ min: -50, max: 50 }),
    title: fc
      .string({ minLength: 1, maxLength: 60 })
      .map((s) => (s.trim().length === 0 ? "Palier" : s)),
    description: fc
      .string({ minLength: 1, maxLength: 120 })
      .map((s) => (s.trim().length === 0 ? "Description" : s)),
    recommended: fc.boolean(),
    isEntryPoint: fc.boolean(),
    deliverables: fc.array(
      fc
        .string({ minLength: 1, maxLength: 80 })
        .map((s) => (s.trim().length === 0 ? "Livrable" : s)),
      { minLength: 1, maxLength: 6 },
    ),
    resume: resumeArb,
  });
}

/** Tri stable des offres par ordre croissant d'engagement. */
function sortedByOrder(offers: Offer[]): Offer[] {
  return offers
    .map((o, i) => [o, i] as const)
    .sort((a, b) => a[0].order - b[0].order || a[1] - b[1])
    .map(([o]) => o);
}

/** Compte les occurrences de chaque tier. */
function tierCounts(tiers: OfferTier[]): Record<string, number> {
  return tiers.reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
}

describe("selectRenderableOffers", () => {
  // Property 3: Paliers ordonnés et complets — Validates: Requirements 3.1
  it("Property 3: renvoie tous les paliers à résumé valide, triés par engagement croissant, chacun avec titre, description et livrables non vides", () => {
    fc.assert(
      fc.property(fc.array(offerArb(validResumeArb), { maxLength: 10 }), (offers) => {
        const { renderable, omitted } = selectRenderableOffers(offers);

        // Tous les paliers sont valides : aucun n'est omis.
        expect(omitted).toEqual([]);
        expect(renderable).toHaveLength(offers.length);

        // Triés par ordre croissant d'engagement.
        for (let i = 1; i < renderable.length; i++) {
          expect(renderable[i - 1].order).toBeLessThanOrEqual(renderable[i].order);
        }

        // Chaque palier rendu expose titre, description et livrables non vides.
        for (const offer of renderable) {
          expect(typeof offer.title).toBe("string");
          expect(offer.title.length).toBeGreaterThan(0);
          expect(typeof offer.description).toBe("string");
          expect(offer.description.length).toBeGreaterThan(0);
          expect(Array.isArray(offer.deliverables)).toBe(true);
          expect(offer.deliverables.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 9: Omission des paliers incomplets — Validates: Requirements 4.7
  it("Property 9: conserve exactement les offres au résumé valide et omet exactement celles au résumé incomplet, sans altérer les offres conservées", () => {
    fc.assert(
      fc.property(
        fc.array(fc.oneof(offerArb(validResumeArb), offerArb(invalidResumeArb)), { maxLength: 12 }),
        (offers) => {
          const { renderable, omitted } = selectRenderableOffers(offers);

          const expectedRenderable = offers.filter((o) => validateResumeOffre(o.resume).ok);
          const expectedOmitted = offers.filter((o) => !validateResumeOffre(o.resume).ok);

          // Partition exacte : autant conservés que d'offres valides.
          expect(renderable).toHaveLength(expectedRenderable.length);
          expect(omitted).toHaveLength(expectedOmitted.length);

          // Les offres conservées sont exactement les offres valides (même
          // référence, donc non altérées), triées par engagement croissant.
          expect(renderable).toEqual(sortedByOrder(expectedRenderable));
          for (const kept of renderable) {
            expect(offers).toContain(kept);
            expect(validateResumeOffre(kept.resume).ok).toBe(true);
          }

          // Les offres omises correspondent exactement aux offres invalides
          // (même multiset de tiers) et chaque motif signale un échec.
          expect(tierCounts(omitted.map((o) => o.tier))).toEqual(
            tierCounts(expectedOmitted.map((o) => o.tier)),
          );
          for (const entry of omitted) {
            expect(entry.reason.ok).toBe(false);
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
