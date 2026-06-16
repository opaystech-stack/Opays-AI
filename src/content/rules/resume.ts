/**
 * Noyau de logique pure : validation et ordonnancement du Resume_Offre.
 *
 * Source de vérité des règles éditoriales d'OPAYS_HQ §9 appliquées aux
 * cinq lignes obligatoires d'un Resume_Offre. Fonctions pures, sans I/O,
 * donc testables par propriétés.
 *
 * Couvre : Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6.
 */

import type { ResumeOffre } from "../offers";

/** Longueur maximale autorisée pour chaque ligne d'un Resume_Offre. */
export const RESUME_LINE_MAX = 280;

/** Longueur minimale (après normalisation) pour chaque ligne d'un Resume_Offre. */
export const RESUME_LINE_MIN = 1;

/**
 * Ordre obligatoire des cinq lignes d'un Resume_Offre (OPAYS_HQ §9) :
 * problème traité, solution proposée, bénéfice opérationnel,
 * niveau d'accompagnement, prochaine action.
 */
export const RESUME_LINE_ORDER = [
  "problemeTraite",
  "solutionProposee",
  "beneficeOperationnel",
  "niveauAccompagnement",
  "prochaineAction",
] as const;

/** Clé d'une ligne du Resume_Offre. */
export type ResumeLineKey = (typeof RESUME_LINE_ORDER)[number];

/**
 * Résultat de validation d'un Resume_Offre.
 * En cas d'échec, indique la première ligne fautive et la raison.
 */
export type ResumeValidation =
  | { ok: true }
  | { ok: false; reason: "empty-line" | "too-long"; line: ResumeLineKey };

/**
 * Valide un Resume_Offre.
 *
 * Réussit si et seulement si ses cinq lignes sont chacune non vides après
 * normalisation (trim) et d'une longueur comprise entre 1 et 280 caractères
 * inclus. En cas d'échec, renvoie la première ligne fautive dans l'ordre
 * obligatoire et la raison de l'échec.
 *
 * La longueur évaluée est celle de la valeur normalisée (après trim), de
 * sorte qu'une ligne composée uniquement d'espaces est traitée comme vide.
 */
export function validateResumeOffre(resume: ResumeOffre): ResumeValidation {
  for (const line of RESUME_LINE_ORDER) {
    const normalized = resume[line].trim();

    if (normalized.length < RESUME_LINE_MIN) {
      return { ok: false, reason: "empty-line", line };
    }

    if (normalized.length > RESUME_LINE_MAX) {
      return { ok: false, reason: "too-long", line };
    }
  }

  return { ok: true };
}

/**
 * Restitue les cinq lignes d'un Resume_Offre dans l'ordre obligatoire
 * (Requirement 4.6) : problème traité, solution proposée, bénéfice
 * opérationnel, niveau d'accompagnement, prochaine action.
 *
 * Le texte renvoyé est la valeur brute de chaque ligne (non normalisée),
 * afin de préserver le contenu éditorial tel que défini dans la source.
 */
export function orderedResumeLines(
  resume: ResumeOffre,
): { key: ResumeLineKey; text: string }[] {
  return RESUME_LINE_ORDER.map((key) => ({ key, text: resume[key] }));
}
