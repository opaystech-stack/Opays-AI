/**
 * Source unique de vérité de la méthode Opays (Page_Methode).
 *
 * Au minimum quatre Phase_Methode successives couvrant les quatre catégories
 * obligatoires : lecture du terrain, cartographie des frictions, construction
 * et mise en service. Chaque phase porte au moins un Livrable nommé et une
 * durée indicative explicite.
 *
 * Couvre : Requirements 5.1, 5.4.
 */

export type TimeUnit = "jours" | "semaines";

export type MethodCategory =
  | "terrain"
  | "frictions"
  | "construction"
  | "mise-en-service";

export interface MethodPhase {
  id: string;
  /** Ordre chronologique de déroulement. */
  order: number;
  name: string;
  /** Au moins un libellé non vide pour que la phase soit rendue. */
  deliverables: string[];
  /** Durée indicative ; requise pour que la phase soit rendue. */
  duration: { value: number; unit: TimeUnit } | null;
  category: MethodCategory;
}

/**
 * Les phases de la méthode, dans l'ordre chronologique, couvrant les quatre
 * catégories obligatoires (Requirement 5.4).
 */
export const METHOD_PHASES: MethodPhase[] = [
  {
    id: "lecture-terrain",
    order: 1,
    name: "Lecture du terrain",
    deliverables: [
      "Compte rendu des entretiens de terrain",
      "Inventaire des outils et des flux existants",
    ],
    duration: { value: 1, unit: "semaines" },
    category: "terrain",
  },
  {
    id: "cartographie-frictions",
    order: 2,
    name: "Cartographie des frictions",
    deliverables: [
      "Cartographie des frictions opérationnelles",
      "Chiffrage des coûts cachés et des temps perdus",
      "Recommandations priorisées par retour sur investissement",
    ],
    duration: { value: 1, unit: "semaines" },
    category: "frictions",
  },
  {
    id: "construction",
    order: 3,
    name: "Construction",
    deliverables: [
      "Cadrage technique des intégrations et des données",
      "Système d'automatisation développé et testé",
    ],
    duration: { value: 2, unit: "semaines" },
    category: "construction",
  },
  {
    id: "mise-en-service",
    order: 4,
    name: "Mise en service",
    deliverables: [
      "Mise en production accompagnée",
      "Transfert de compétence aux équipes",
      "Plan de suivi et d'ajustement continu",
    ],
    duration: { value: 2, unit: "semaines" },
    category: "mise-en-service",
  },
];
