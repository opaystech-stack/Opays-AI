/**
 * Noyau de logique pure de la méthode Opays (Page_Methode).
 *
 * Applique les règles « afficher / omettre » sur les Phase_Methode :
 * - `selectRenderablePhases` ne conserve que les phases disposant d'au moins un
 *   Livrable au libellé non vide ET d'une durée indicative explicite, triées par
 *   ordre chronologique de déroulement (Requirements 5.2, 5.3, 5.5, 5.6).
 * - `coversRequiredCategories` vérifie la couverture des quatre catégories
 *   obligatoires de la méthode (Requirements 5.1, 5.4).
 *
 * Fonctions pures, sans I/O, donc testables par propriétés.
 */

import type { MethodCategory, MethodPhase } from "../method";

/**
 * Les quatre catégories obligatoires que la méthode doit couvrir
 * (Requirement 5.4) : lecture du terrain, cartographie des frictions,
 * construction et mise en service.
 */
export const REQUIRED_CATEGORIES: readonly MethodCategory[] = [
  "terrain",
  "frictions",
  "construction",
  "mise-en-service",
] as const;

/** Vrai si la phase porte au moins un livrable au libellé non vide (après trim). */
function hasNonEmptyDeliverable(phase: MethodPhase): boolean {
  return phase.deliverables.some(
    (deliverable) => deliverable.trim().length > 0,
  );
}

/** Vrai si la phase dispose d'une durée indicative explicite. */
function hasDuration(phase: MethodPhase): boolean {
  return phase.duration !== null;
}

/**
 * Ne conserve que les phases disposant d'au moins un livrable non vide ET
 * d'une durée indicative, puis les trie par ordre chronologique croissant.
 *
 * Une Phase_Methode incomplète (sans livrable nommé ou sans durée) est omise
 * plutôt que présentée avec un champ vide (Requirement 5.6).
 *
 * Validates: Requirements 5.2, 5.3, 5.5, 5.6.
 */
export function selectRenderablePhases(phases: MethodPhase[]): MethodPhase[] {
  return phases
    .filter((phase) => hasNonEmptyDeliverable(phase) && hasDuration(phase))
    .slice()
    .sort((a, b) => a.order - b.order);
}

/**
 * Vrai si et seulement si les quatre catégories obligatoires de la méthode
 * sont toutes couvertes par au moins une phase de la liste fournie.
 *
 * Validates: Requirements 5.1, 5.4.
 */
export function coversRequiredCategories(phases: MethodPhase[]): boolean {
  const present = new Set(phases.map((phase) => phase.category));
  return REQUIRED_CATEGORIES.every((category) => present.has(category));
}
