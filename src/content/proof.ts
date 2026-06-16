/**
 * Source unique de vérité du Bloc_Preuves (métriques de résultat opérationnel).
 *
 * Entre 3 et 6 métriques chiffrées avec leur unité, couvrant au moins les
 * trois catégories : temps gagné, erreurs évitées et retour sur investissement.
 * Chaque métrique est formulée de façon générique (sans nom de client) et
 * porte une source de validation interne consultable.
 *
 * Couvre : Requirements 6.1, 6.2, 6.3.
 */

export type MetricCategory = "temps-gagne" | "erreurs-evitees" | "roi";

export interface ProofMetric {
  category: MetricCategory;
  /** Valeur chiffrée du résultat. */
  value: number;
  /** Unité de mesure associée (%, h, x…). */
  unit: string;
  /** Formulation générique, sans nom de client ni marque. */
  label: string;
  /** Source de validation interne consultable ; null => métrique masquée. */
  source: string | null;
}

/**
 * Métriques de preuve sourcées et anonymes. Les valeurs restent dans des
 * bornes plausibles propres à chaque catégorie (voir rules/proof.ts).
 */
export const PROOF_METRICS: ProofMetric[] = [
  {
    category: "temps-gagne",
    value: 30,
    unit: "%",
    label: "de temps gagné sur les tâches répétitives après mise en service",
    source: "Mesures internes Opays — moyenne des missions FORGE 2024",
  },
  {
    category: "temps-gagne",
    value: 10,
    unit: "h",
    label: "récupérées chaque semaine par équipe sur les flux automatisés",
    source: "Relevés de temps avant/après — synthèse missions FORGE",
  },
  {
    category: "erreurs-evitees",
    value: 80,
    unit: "%",
    label: "d'erreurs de saisie évitées sur les traitements à fort volume",
    source: "Journaux de contrôle qualité — comparatif avant/après déploiement",
  },
  {
    category: "roi",
    value: 3,
    unit: "x",
    label: "de retour sur investissement constaté sur la première année",
    source: "Calcul de ROI interne — coût avant vs maintenance Opays",
  },
];
