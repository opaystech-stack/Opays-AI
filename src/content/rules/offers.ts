/**
 * Noyau de logique pure : sélection et ordonnancement des Paliers à rendre.
 *
 * Filtre les Paliers dont le Resume_Offre est incomplet (Requirement 4.7),
 * trie les Paliers conservés par ordre croissant d'engagement (Requirement 3.1)
 * et expose les Paliers omis avec leur motif de rejet. Fonction pure, sans I/O,
 * donc testable par propriétés.
 *
 * Réutilise `validateResumeOffre` (src/content/rules/resume.ts) comme unique
 * source de vérité des règles éditoriales des cinq lignes obligatoires.
 *
 * Couvre : Requirements 3.1, 4.7.
 */

import type { Offer, OfferTier } from "../offers";
import { validateResumeOffre, type ResumeValidation } from "./resume";

/** Description d'un Palier omis et de la raison de son omission. */
export interface OmittedOffer {
  /** Palier concerné. */
  tier: OfferTier;
  /** Motif d'omission, issu de la validation du Resume_Offre. */
  reason: ResumeValidation;
}

/** Résultat de la sélection des Paliers à rendre. */
export interface SelectRenderableOffersResult {
  /** Paliers au Resume_Offre valide, triés par ordre croissant d'engagement. */
  renderable: Offer[];
  /** Paliers omis car au Resume_Offre incomplet, avec leur motif. */
  omitted: OmittedOffer[];
}

/**
 * Sélectionne les Paliers affichables.
 *
 * Conserve exactement les Paliers dont le Resume_Offre est valide (via
 * `validateResumeOffre`) et omet ceux dont le résumé est incomplet
 * (Requirement 4.7). Les Paliers conservés sont triés par ordre croissant
 * d'engagement, c'est-à-dire par `order` ascendant (Requirement 3.1). Les
 * objets `Offer` conservés ne sont pas altérés.
 *
 * @param offers Liste des Paliers candidats (typiquement `OFFERS`).
 * @returns Les Paliers à rendre, triés, et la liste des Paliers omis avec motif.
 */
export function selectRenderableOffers(
  offers: Offer[],
): SelectRenderableOffersResult {
  const renderable: Offer[] = [];
  const omitted: OmittedOffer[] = [];

  for (const offer of offers) {
    const validation = validateResumeOffre(offer.resume);

    if (validation.ok) {
      renderable.push(offer);
    } else {
      omitted.push({ tier: offer.tier, reason: validation });
    }
  }

  renderable.sort((a, b) => a.order - b.order);

  return { renderable, omitted };
}
