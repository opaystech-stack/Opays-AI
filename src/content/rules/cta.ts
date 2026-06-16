/**
 * Noyau de logique pure — CTA_Diagnostic unique.
 *
 * Fonction sans I/O renvoyant toujours l'appel à l'action unique du
 * Site_Vitrine (libellé + cible) depuis la constante `CTA_DIAGNOSTIC`, définie
 * une seule fois dans `navigation.ts`. Toute occurrence du CTA dans le site lit
 * cette résolution, ce qui garantit mécaniquement l'unicité du libellé,
 * l'identité stricte (texte et casse) sur toutes les pages publiques et la
 * cible constante vers la Page_Contact.
 *
 * Couvre : Requirements 10.1, 10.3, 9.6.
 */

import { CTA_DIAGNOSTIC } from "../navigation";

/** CTA résolu : libellé unique et cible (la Page_Contact). */
export interface ResolvedCta {
  /** Libellé strictement identique sur toutes les pages publiques. */
  label: string;
  /** Cible du CTA : la Page_Contact. */
  target: string;
}

/**
 * Renvoie toujours le CTA unique (libellé + cible) depuis `CTA_DIAGNOSTIC`.
 * Le résultat est identique à chaque appel, ce qui assure l'unicité du libellé
 * (10.1) et la direction constante vers `/contact` (10.3, 9.6).
 */
export function resolveCta(): ResolvedCta {
  return {
    label: CTA_DIAGNOSTIC.label,
    target: CTA_DIAGNOSTIC.target,
  };
}
