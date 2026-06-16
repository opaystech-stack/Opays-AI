/**
 * Tests par propriétés du filtre de jargon éditorial (jargon.ts).
 *
 * Couvre :
 * - Property 23 « Absence de jargon interdit » (Requirement 11.5)
 *
 * Harnais : Vitest 3 + fast-check, numRuns = 100.
 *
 * Deux directions complémentaires :
 *  - sur un texte propre (vocabulaire sans terme banni), l'intersection avec la
 *    liste interdite est vide et `isJargonFree` est vrai ;
 *  - tout terme interdit injecté est détecté, quelles que soient la casse et la
 *    présence/absence d'accents (insensibilité de la normalisation).
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import {
  FORBIDDEN_TERMS,
  findForbiddenTerms,
  isJargonFree,
  normalize,
} from "./jargon";

const NUM_RUNS = 100;

/** Mots réels ne contenant aucun terme interdit (ni en sous-chaîne). */
const CLEAN_WORDS = [
  "clarte",
  "utilite",
  "credibilite",
  "terrain",
  "methode",
  "preuve",
  "equipe",
  "livrable",
  "mesure",
  "resultat",
  "efficience",
  "diagnostic",
] as const;

const cleanWordArb: fc.Arbitrary<string> = fc.constantFrom(...CLEAN_WORDS);

/** Bloc de texte propre : 0..30 mots issus du vocabulaire neutre. */
const cleanTextArb: fc.Arbitrary<string> = fc
  .array(cleanWordArb, { maxLength: 30 })
  .map((words) => words.join(" "));

const forbiddenTermArb: fc.Arbitrary<string> = fc.constantFrom(
  ...FORBIDDEN_TERMS,
);

/** Retire les diacritiques combinants (comme le fait normalize). */
function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Produit une variante d'un terme avec casse aléatoire par caractère et,
 * optionnellement, suppression des accents.
 */
function variantArb(term: string): fc.Arbitrary<string> {
  return fc
    .tuple(
      fc.array(fc.boolean(), { minLength: term.length, maxLength: term.length }),
      fc.boolean(),
    )
    .map(([uppercaseFlags, stripAccents]) => {
      const cased = [...term]
        .map((ch, i) => (uppercaseFlags[i] ? ch.toUpperCase() : ch.toLowerCase()))
        .join("");
      return stripAccents ? stripDiacritics(cased) : cased;
    });
}

describe("findForbiddenTerms / isJargonFree", () => {
  // Property 23: Absence de jargon interdit — Validates: Requirements 11.5
  it("Property 23: un texte propre n'intersecte jamais la liste interdite", () => {
    fc.assert(
      fc.property(cleanTextArb, (text) => {
        expect(findForbiddenTerms(text)).toEqual([]);
        expect(isJargonFree(text)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 23: tout terme interdit injecté est détecté, insensible à la casse et aux accents", () => {
    fc.assert(
      fc.property(
        cleanTextArb,
        cleanTextArb,
        forbiddenTermArb.chain((term) =>
          variantArb(term).map((variant) => [term, variant] as const),
        ),
        (prefix, suffix, [term, variant]) => {
          // On entoure d'espaces pour respecter les frontières de mot des
          // termes d'un seul mot, sans coller le jargon à un mot voisin.
          const content = `${prefix} ${variant} ${suffix}`;
          const found = findForbiddenTerms(content);

          expect(found).toContain(normalize(term));
          expect(isJargonFree(content)).toBe(false);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("Property 23: findForbiddenTerms renvoie des termes normalisés sans doublon", () => {
    fc.assert(
      fc.property(forbiddenTermArb, (term) => {
        // Le même terme répété ne doit apparaître qu'une fois.
        const variant = term.toUpperCase();
        const content = `${variant} et encore ${term} ${stripDiacritics(term)}`;
        const found = findForbiddenTerms(content);
        const occurrences = found.filter((t) => t === normalize(term));
        expect(occurrences).toHaveLength(1);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
