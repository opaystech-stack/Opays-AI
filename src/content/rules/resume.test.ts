/**
 * Tests de propriété du noyau de logique pure des résumés d'offre.
 *
 * Couvre deux propriétés de correction du design :
 *  - Property 7 : Validation du Resume_Offre (Requirements 4.1, 4.2, 4.3, 4.4, 4.5)
 *  - Property 8 : Ordre obligatoire des lignes du résumé (Requirement 4.6)
 *
 * Framework : Vitest 3 (globals) + fast-check (numRuns: 100).
 */

import fc from "fast-check";
import type { ResumeOffre } from "../offers";
import {
  RESUME_LINE_MAX,
  orderedResumeLines,
  validateResumeOffre,
} from "./resume";

const NUM_RUNS = 100;

/**
 * Ordre obligatoire attendu, fixé indépendamment de l'implémentation pour
 * éviter tout raisonnement circulaire (Requirement 4.6 / OPAYS_HQ §9).
 */
const EXPECTED_ORDER = [
  "problemeTraite",
  "solutionProposee",
  "beneficeOperationnel",
  "niveauAccompagnement",
  "prochaineAction",
] as const;

type LineKey = (typeof EXPECTED_ORDER)[number];

// --- Arbitraires --------------------------------------------------------------

/** Un caractère qui n'est pas un espace (subsiste après normalisation). */
const nonSpaceChar = fc.char().filter((c) => c.trim().length === 1);

/** Une suite d'espacements variés, susceptible d'être entièrement supprimée par trim. */
const whitespace = fc.stringOf(
  fc.constantFrom(" ", "\t", "\n", "\r", "\f", "\u00a0"),
  { maxLength: 4 },
);

/** Un cœur de texte sans espacement, de longueur contrôlée. */
function coreOfLength(min: number, max: number): fc.Arbitrary<string> {
  return fc
    .array(nonSpaceChar, { minLength: min, maxLength: max })
    .map((chars) => chars.join(""));
}

/**
 * Ligne dont la longueur normalisée (après trim) est nulle : vide ou
 * uniquement composée d'espacements => INVALIDE (empty-line).
 */
const emptyLine: fc.Arbitrary<string> = fc.oneof(
  fc.constant(""),
  whitespace,
);

/**
 * Ligne dont la longueur normalisée est dans [1, 280] => VALIDE.
 * Optionnellement entourée d'espacements pour exercer la normalisation :
 * le trim doit ramener la mesure à la longueur du cœur.
 */
const validLine: fc.Arbitrary<string> = fc
  .tuple(whitespace, coreOfLength(1, RESUME_LINE_MAX), whitespace)
  .map(([pre, core, post]) => pre + core + post);

/**
 * Ligne dont la longueur normalisée dépasse 280 => INVALIDE (too-long).
 */
const tooLongLine: fc.Arbitrary<string> = fc
  .tuple(whitespace, coreOfLength(RESUME_LINE_MAX + 1, RESUME_LINE_MAX + 60), whitespace)
  .map(([pre, core, post]) => pre + core + post);

/** Une ligne couvrant les trois classes d'équivalence (vide / valide / trop longue). */
const mixedLine: fc.Arbitrary<string> = fc.oneof(
  { weight: 1, arbitrary: emptyLine },
  { weight: 3, arbitrary: validLine },
  { weight: 1, arbitrary: tooLongLine },
);

function resumeFrom(line: fc.Arbitrary<string>): fc.Arbitrary<ResumeOffre> {
  return fc.record({
    problemeTraite: line,
    solutionProposee: line,
    beneficeOperationnel: line,
    niveauAccompagnement: line,
    prochaineAction: line,
  });
}

/** Résumé mêlant lignes valides et invalides (pour Property 7). */
const mixedResume = resumeFrom(mixedLine);

/** Résumé à contenu libre quelconque (pour Property 8, indépendant de la validité). */
const anyResume = resumeFrom(fc.string());

/** Prédicat de référence : une ligne est valide ssi 1 <= longueur normalisée <= 280. */
function lineIsValid(value: string): boolean {
  const normalized = value.trim();
  return normalized.length >= 1 && normalized.length <= RESUME_LINE_MAX;
}

// --- Property 7 : Validation du Resume_Offre ---------------------------------

describe("Property 7: Validation du Resume_Offre", () => {
  // **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
  it("réussit si et seulement si les 5 lignes sont non vides (après trim) et de longueur 1..280", () => {
    fc.assert(
      fc.property(mixedResume, (resume) => {
        const expectedOk = EXPECTED_ORDER.every((key) => lineIsValid(resume[key]));
        expect(validateResumeOffre(resume).ok).toBe(expectedOk);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Tests d'exemple : bornes et cas limites de la validation.
  function baseResume(overrides: Partial<ResumeOffre> = {}): ResumeOffre {
    return {
      problemeTraite: "Problème opérationnel clairement identifié.",
      solutionProposee: "Solution proposée et cadrée.",
      beneficeOperationnel: "Bénéfice opérationnel mesurable.",
      niveauAccompagnement: "Accompagnement continu et structuré.",
      prochaineAction: "Réservez un Diagnostic gratuit.",
      ...overrides,
    };
  }

  it("accepte un résumé complet et conforme", () => {
    expect(validateResumeOffre(baseResume())).toEqual({ ok: true });
  });

  it("accepte une ligne d'exactement 280 caractères", () => {
    const exactly280 = "a".repeat(RESUME_LINE_MAX);
    expect(validateResumeOffre(baseResume({ solutionProposee: exactly280 })).ok).toBe(true);
  });

  it("rejette une ligne de 281 caractères (too-long) sur la première ligne fautive", () => {
    const tooLong = "a".repeat(RESUME_LINE_MAX + 1);
    expect(validateResumeOffre(baseResume({ beneficeOperationnel: tooLong }))).toEqual({
      ok: false,
      reason: "too-long",
      line: "beneficeOperationnel",
    });
  });

  it("rejette une ligne vide (empty-line)", () => {
    expect(validateResumeOffre(baseResume({ problemeTraite: "" }))).toEqual({
      ok: false,
      reason: "empty-line",
      line: "problemeTraite",
    });
  });

  it("traite une ligne uniquement composée d'espaces comme vide", () => {
    expect(validateResumeOffre(baseResume({ prochaineAction: "    \t\n" }))).toEqual({
      ok: false,
      reason: "empty-line",
      line: "prochaineAction",
    });
  });
});

// --- Property 8 : Ordre obligatoire des lignes du résumé ---------------------

describe("Property 8: Ordre obligatoire des lignes du résumé", () => {
  // **Validates: Requirements 4.6**
  it("restitue exactement les 5 lignes dans l'ordre obligatoire avec leur texte d'origine", () => {
    fc.assert(
      fc.property(anyResume, (resume) => {
        const lines = orderedResumeLines(resume);

        // Exactement cinq lignes.
        expect(lines).toHaveLength(EXPECTED_ORDER.length);

        // Ordre des clés strictement conforme à l'ordre obligatoire.
        expect(lines.map((l) => l.key)).toEqual([...EXPECTED_ORDER]);

        // Chaque texte correspond à la valeur d'origine du résumé.
        lines.forEach(({ key, text }) => {
          expect(text).toBe(resume[key as LineKey]);
        });
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("préserve l'ordre sur un exemple concret", () => {
    const resume: ResumeOffre = {
      problemeTraite: "L1",
      solutionProposee: "L2",
      beneficeOperationnel: "L3",
      niveauAccompagnement: "L4",
      prochaineAction: "L5",
    };
    expect(orderedResumeLines(resume)).toEqual([
      { key: "problemeTraite", text: "L1" },
      { key: "solutionProposee", text: "L2" },
      { key: "beneficeOperationnel", text: "L3" },
      { key: "niveauAccompagnement", text: "L4" },
      { key: "prochaineAction", text: "L5" },
    ]);
  });
});
