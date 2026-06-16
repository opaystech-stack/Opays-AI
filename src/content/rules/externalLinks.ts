/**
 * Noyau de logique pure — liens vers les Chantier_Externe.
 *
 * Fonction sans I/O résolvant l'affichage d'un lien sortant pour un
 * Chantier_Externe. Un lien n'est rendu que si l'URL du chantier est renseignée
 * et constitue une URL absolue valide (protocole http ou https). Tant que
 * l'URL vaut null, est vide ou n'est pas analysable, aucun lien n'est exposé,
 * ce qui exclut tout lien inactif ou pointant vers une cible indisponible.
 *
 * Les liens visibles sont marqués `external` afin que la couche de rendu les
 * ouvre dans un nouvel onglet avec signalement visuel.
 *
 * Couvre : Requirements 13.3, 13.4.
 */

import type { ExternalProject } from "../externalProjects";

/** Lien externe résolu : visible (URL valide) ou masqué. */
export type ResolvedExternalLink =
  | { visible: true; url: string; label: string; external: true }
  | { visible: false };

/**
 * Vrai ssi l'URL est renseignée et constitue une URL absolue valide
 * (protocole http ou https). Une URL absente, vide ou non analysable est
 * considérée comme invalide.
 */
function isValidAbsoluteUrl(url: string | null): url is string {
  if (url === null) {
    return false;
  }
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Ne renvoie un lien que si l'URL du chantier est renseignée et absolue valide ;
 * sinon, renvoie un résultat masqué et aucun lien n'est affiché (13.4). Les
 * liens visibles sont marqués `external` pour ouverture en nouvel onglet avec
 * signalement (13.3).
 */
export function resolveExternalLink(project: ExternalProject): ResolvedExternalLink {
  if (isValidAbsoluteUrl(project.url)) {
    return {
      visible: true,
      url: project.url.trim(),
      label: project.label,
      external: true,
    };
  }
  return { visible: false };
}
