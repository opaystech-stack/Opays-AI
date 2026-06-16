/**
 * Noyau de logique pure — sélection des métriques du Bloc_Preuves.
 *
 * Source de vérité des règles « afficher / masquer » appliquées aux métriques
 * de preuve avant rendu. Aucune I/O, fonctions déterministes et testables par
 * propriétés.
 *
 * Règles appliquées :
 * - Une métrique n'est éligible que si elle est sourcée (source non vide) ET si
 *   sa valeur reste dans les bornes de plausibilité de sa catégorie (Exigences
 *   6.4, 6.5).
 * - La sélection rendue compte entre 3 et 6 métriques et couvre au moins les
 *   trois catégories obligatoires : temps gagné, erreurs évitées et retour sur
 *   investissement (Exigences 6.1, 6.2).
 * - Si aucune sélection valide n'est possible, la fonction renvoie une liste
 *   vide (le Bloc_Preuves n'est alors pas rendu) plutôt que d'afficher des
 *   valeurs incomplètes (Exigence 6.5).
 *
 * Couvre : Requirements 6.1, 6.2, 6.3, 6.4, 6.5.
 */

import type { MetricCategory, ProofMetric } from "../proof";

/** Nombre minimal de métriques requis pour rendre le Bloc_Preuves. */
export const METRICS_MIN = 3;
/** Nombre maximal de métriques affichées dans le Bloc_Preuves. */
export const METRICS_MAX = 6;

/**
 * Catégories de métriques obligatoirement couvertes par le Bloc_Preuves
 * (Exigence 6.2).
 */
export const REQUIRED_METRIC_CATEGORIES: readonly MetricCategory[] = [
  "temps-gagne",
  "erreurs-evitees",
  "roi",
] as const;

/**
 * Bornes de plausibilité par catégorie (Exigence 6.4). Une valeur est jugée
 * plausible si elle est strictement comprise entre `min` et `max` (bornes
 * exclues), conformément à l'exemple du requirement : « un gain de temps
 * strictement compris entre 1 % et 100 % ».
 */
export const METRIC_BOUNDS: Record<MetricCategory, { min: number; max: number }> = {
  "temps-gagne": { min: 1, max: 100 },
  "erreurs-evitees": { min: 1, max: 100 },
  roi: { min: 1, max: 100 },
};

/**
 * Vrai ssi la métrique dispose d'une source de validation interne non vide et
 * d'une valeur chiffrée strictement comprise dans les bornes de sa catégorie.
 */
function isMetricEligible(metric: ProofMetric): boolean {
  if (metric.source === null || metric.source.trim().length === 0) {
    return false;
  }

  const bounds = METRIC_BOUNDS[metric.category];
  if (!bounds) {
    return false;
  }

  if (!Number.isFinite(metric.value)) {
    return false;
  }

  return metric.value > bounds.min && metric.value < bounds.max;
}

/**
 * Conserve les métriques sourcées ET dans les bornes, plafonne le résultat à 6
 * et garantit la présence d'au moins 3 métriques couvrant les 3 catégories
 * obligatoires.
 *
 * @returns une liste de 3 à 6 métriques (dans l'ordre d'entrée) lorsqu'une
 * sélection valide existe, sinon une liste vide.
 */
export function selectRenderableMetrics(metrics: ProofMetric[]): ProofMetric[] {
  const eligible = metrics.filter(isMetricEligible);

  const coveredCategories = new Set(eligible.map((metric) => metric.category));
  const coversAllCategories = REQUIRED_METRIC_CATEGORIES.every((category) =>
    coveredCategories.has(category),
  );

  // Aucune sélection valide possible : on masque le bloc plutôt que d'afficher
  // une preuve incomplète (Exigence 6.5).
  if (!coversAllCategories || eligible.length < METRICS_MIN) {
    return [];
  }

  if (eligible.length <= METRICS_MAX) {
    return eligible;
  }

  // Au-delà de 6 métriques éligibles, on plafonne à 6 tout en préservant la
  // couverture des 3 catégories obligatoires.
  const kept = new Set<ProofMetric>();

  for (const category of REQUIRED_METRIC_CATEGORIES) {
    const firstOfCategory = eligible.find((metric) => metric.category === category);
    if (firstOfCategory) {
      kept.add(firstOfCategory);
    }
  }

  for (const metric of eligible) {
    if (kept.size >= METRICS_MAX) {
      break;
    }
    kept.add(metric);
  }

  // Restitue les métriques retenues dans leur ordre d'entrée d'origine.
  return eligible.filter((metric) => kept.has(metric)).slice(0, METRICS_MAX);
}
