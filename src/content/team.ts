/**
 * Source unique de vérité de la Section_Equipe (fondateurs nommés et rôles).
 *
 * Quatre membres fondateurs, chacun avec son nom complet et au moins un rôle.
 *
 * Couvre : Requirements 7.1, 7.2, 7.3, 7.4, 7.5.
 */

export interface TeamMember {
  /** Nom complet ; non vide pour que la fiche soit rendue. */
  fullName: string;
  /** Au moins un rôle non vide pour que la fiche soit rendue. */
  roles: string[];
}

export const FOUNDERS: TeamMember[] = [
  {
    fullName: "Fénelon Lamsasiri",
    roles: ["Directeur Général", "Lead R&D"],
  },
  {
    fullName: "Prince Bagheni",
    roles: ["Directeur Commercial (CSO)"],
  },
  {
    fullName: "Patricia Zamwana",
    roles: ["Ventes", "Comptabilité", "Trésorerie"],
  },
  {
    fullName: "Zaina Bwale Godlove",
    roles: ["Ventes", "Communication"],
  },
];
