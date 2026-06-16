/**
 * Noyau de règles pures pour la Section_Equipe.
 *
 * Logique sans I/O : filtre les fiches fondateurs incomplètes avant rendu.
 * Une fiche n'est rendue que si elle dispose d'un nom non vide ET d'au moins
 * un rôle non vide. Aucune fiche n'est altérée ; les fiches incomplètes sont
 * simplement omises (pas de champ vide affiché).
 *
 * Couvre : Requirements 7.1, 7.6.
 */

import type { TeamMember } from "../team";

/**
 * Vrai ssi la chaîne contient au moins un caractère non blanc.
 */
function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Conserve exactement les fiches disposant d'un nom non vide et d'au moins un
 * rôle non vide ; omet toute fiche incomplète sans modifier les fiches retenues.
 *
 * @param members Liste brute des membres fondateurs (source : `FOUNDERS`).
 * @returns Les fiches rendables, dans leur ordre d'origine.
 */
export function selectRenderableMembers(members: TeamMember[]): TeamMember[] {
  return members.filter((member) => isNonEmpty(member.fullName) && member.roles.some(isNonEmpty));
}
