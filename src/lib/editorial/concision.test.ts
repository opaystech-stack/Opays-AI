/**
 * Tests par propriétés de la concision éditoriale (concision.ts).
 *
 * Couvre :
 * - Property 22 « Concision éditoriale » (Requirement 11.4)
 *
 * Harnais : Vitest 3 + fast-check, numRuns = 100.
 *
 * Pour exprimer la propriété sans dupliquer la logique de découpage, on
 * construit des blocs à structure connue (N phrases, chacune de k mots réels
 * séparés par des espaces et reliées par « . »). La longueur moyenne attendue
 * est alors total_mots / nb_phrases, ce qui permet de vérifier à la fois
 * `averageSentenceLength` et l'équivalence `isConcise <=> moyenne <= seuil`.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import { averageSentenceLength, isConcise, MAX_AVERAGE_SENTENCE_LENGTH } from "./concision";

const NUM_RUNS = 100;

/** Vocabulaire de mots réels (chacun compté comme un mot par countWords). */
const WORDS = [
  "clair",
  "direct",
  "simple",
  "utile",
  "terrain",
  "methode",
  "preuve",
  "resultat",
  "mesure",
  "systeme",
] as const;

const wordArb: fc.Arbitrary<string> = fc.constantFrom(...WORDS);

/** Une phrase = 1..40 mots séparés par des espaces. Renvoie [texte, nbMots]. */
const sentenceArb: fc.Arbitrary<[string, number]> = fc
  .array(wordArb, { minLength: 1, maxLength: 40 })
  .map((words) => [words.join(" "), words.length] as [string, number]);

/** Un bloc = 1..8 phrases reliées par « . ». Renvoie [bloc, moyenneAttendue]. */
const blockArb: fc.Arbitrary<[string, number]> = fc
  .array(sentenceArb, { minLength: 1, maxLength: 8 })
  .map((sentences) => {
    const block = sentences.map(([text]) => text).join(". ") + ".";
    const totalWords = sentences.reduce((sum, [, n]) => sum + n, 0);
    const expectedAverage = totalWords / sentences.length;
    return [block, expectedAverage] as [string, number];
  });

describe("averageSentenceLength / isConcise", () => {
  // Property 22: Concision éditoriale — Validates: Requirements 11.4
  it("Property 22: la moyenne calculée correspond à total_mots / nb_phrases", () => {
    fc.assert(
      fc.property(blockArb, ([block, expectedAverage]) => {
        expect(averageSentenceLength(block)).toBeCloseTo(expectedAverage, 10);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 22: isConcise est vrai si et seulement si la moyenne est <= au seuil", () => {
    fc.assert(
      fc.property(blockArb, fc.integer({ min: 1, max: 60 }), ([block], threshold) => {
        const average = averageSentenceLength(block);
        expect(isConcise(block, threshold)).toBe(average <= threshold);
        // Cohérence avec le seuil par défaut (25 mots).
        expect(isConcise(block)).toBe(average <= MAX_AVERAGE_SENTENCE_LENGTH);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 22: des phrases d'au plus 25 mots produisent toujours un bloc concis", () => {
    const shortSentenceArb = fc
      .array(wordArb, { minLength: 1, maxLength: MAX_AVERAGE_SENTENCE_LENGTH })
      .map((words) => words.join(" "));

    fc.assert(
      fc.property(fc.array(shortSentenceArb, { minLength: 1, maxLength: 8 }), (sentences) => {
        const block = sentences.join(". ") + ".";
        expect(isConcise(block)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 22: un bloc vide ou sans phrase a une moyenne de 0 et reste concis", () => {
    for (const empty of ["", "   ", "\n\n", "...", "!?…"]) {
      expect(averageSentenceLength(empty)).toBe(0);
      expect(isConcise(empty)).toBe(true);
    }
  });
});
