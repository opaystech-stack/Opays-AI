/**
 * Source unique de vérité des Chantier_Externe (liens sortants préparés).
 *
 * Les chantiers hors périmètre (outil d'audit IA conversationnel, plateforme
 * Opays Commons) sont enregistrés ici avec une URL optionnelle. Tant que l'URL
 * vaut null, aucun lien n'est rendu. Le registre est conçu pour accueillir une
 * URL ultérieure sans modifier la Navigation_Principale.
 *
 * Couvre : Requirements 13.1.
 */

export type ExternalProjectId = "audit-ia" | "opays-commons";

export interface ExternalProject {
  id: ExternalProjectId;
  label: string;
  /** URL absolue du chantier ; null tant qu'il n'est pas mis à disposition. */
  url: string | null;
}

/**
 * Chantiers externes hors périmètre fonctionnel actuel. Aucun lien n'est rendu
 * tant que l'URL n'est pas renseignée (Requirement 13.4).
 */
export const EXTERNAL_PROJECTS: ExternalProject[] = [
  {
    id: "audit-ia",
    label: "Outil d'audit IA conversationnel",
    url: null,
  },
  {
    id: "opays-commons",
    label: "Plateforme Opays Commons",
    url: null,
  },
];
