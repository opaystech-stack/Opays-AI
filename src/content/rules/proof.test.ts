/**
 * Tests par propriétés du noyau de sélection des métriques du Bloc_Preuves
 * (proof.ts).
 *
 * Couvre :
 * - Property 13 « Cardinalité et complétude des métriques de preuve »
 *   (Requirements 6.1, 6.2)
 * - Property 14 « Exclusion des métriques non sourcées ou hors bornes »
 *   (Requirements 6.4, 6.5)
 * - Property 15 « Anonymat des preuves » (Requirement 6.3)
 *
 * Harnais : Vitest 3 (globals) + fast-check, numRuns = 100.
 * Les bornes de plausibilité (`METRIC_BOUNDS`) appliquent une comparaison
 * stricte : une valeur est éligible ssi `min < value < max` (bornes exclues).
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import type { MetricCategory, ProofMetric } from "../proof";
import { PROOF_METRICS } from "../proof";
import {
  METRICS_MIN,
  METRICS_MAX,
  METRIC_BOUNDS,
  REQUIRED_METRIC_CATEGORIES,
  selectRenderableMetrics,
} from "./proof";

const NUM_RUNS = 100;

const CATEGORIES: MetricCategory[] = ["temps-gagne", "erreurs-evitees", "roi"];

/**
 * Pool de libellés génériques, sans aucun nom de client, marque ni raison
 * sociale. Reflète la contrainte d'anonymat de la source de contenu.
 */
const ANONYMOUS_LABELS = [
  "de temps gagné sur les tâches répétitives après mise en service",
  "récupérées chaque semaine par équipe sur les flux automatisés",
  "d'erreurs de saisie évitées sur les traitements à fort volume",
  "de retour sur investissement constaté sur la première année",
  "de gain de productivité mesuré sur le périmètre concerné",
];

/**
 * Jetons identifiants qui ne doivent JAMAIS apparaître dans une métrique
 * rendue (noms de clients, raisons sociales, marques de référence).
 */
const CLIENT_IDENTIFIERS = [
  "Carrefour",
  "BNP",
  "Acme",
  "SNCF",
  "Client X",
  "SARL Dupont",
  "Société Générale",
];

/** Libellé anonyme : tiré du pool générique, jamais un identifiant client. */
const anonymousLabelArb: fc.Arbitrary<string> = fc.constantFrom(
  ...ANONYMOUS_LABELS,
);

/** Unité non vide (%, h, x…). */
const unitArb: fc.Arbitrary<string> = fc.constantFrom("%", "h", "x", "j", "pts");

/** Source de validation interne non vide (après normalisation). */
const sourceArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 80 })
  .map((s) => (s.trim().length === 0 ? "Mesures internes Opays" : s));

/** Source invalide : null ou vide après trim. */
const invalidSourceArb: fc.Arbitrary<string | null> = fc.oneof(
  fc.constant(null),
  fc.constantFrom("", " ", "   ", "\t", "\n "),
);

/** Valeur strictement comprise dans les bornes (1 < v < 100). */
const inBoundsValueArb: fc.Arbitrary<number> = fc.oneof(
  fc.integer({ min: 2, max: 99 }),
  fc.double({ min: 1.0001, max: 99.9999, noNaN: true }),
);

/**
 * Valeur hors bornes : <= min (1) ou >= max (100), bornes incluses car la
 * comparaison est stricte. Inclut les valeurs non finies.
 */
const outOfBoundsValueArb: fc.Arbitrary<number> = fc.oneof(
  fc.constantFrom(1, 100, 0, -5, 100.5, 1000),
  fc.double({ min: -50, max: 1, noNaN: true }),
  fc.double({ min: 100, max: 500, noNaN: true }),
  fc.constantFrom(Number.NaN, Number.POSITIVE_INFINITY),
);

/** Métrique éligible : sourcée ET valeur strictement dans les bornes. */
function eligibleMetricArb(
  category: MetricCategory,
): fc.Arbitrary<ProofMetric> {
  return fc.record({
    category: fc.constant(category),
    value: inBoundsValueArb,
    unit: unitArb,
    label: anonymousLabelArb,
    source: sourceArb,
  });
}

/** Métrique non éligible : source manquante OU valeur hors bornes. */
const ineligibleMetricArb: fc.Arbitrary<ProofMetric> = fc.oneof(
  // Source absente, valeur quelconque.
  fc.record({
    category: fc.constantFrom(...CATEGORIES),
    value: fc.oneof(inBoundsValueArb, outOfBoundsValueArb),
    unit: unitArb,
    label: anonymousLabelArb,
    source: invalidSourceArb,
  }),
  // Source présente mais valeur hors bornes.
  fc.record({
    category: fc.constantFrom(...CATEGORIES),
    value: outOfBoundsValueArb,
    unit: unitArb,
    label: anonymousLabelArb,
    source: sourceArb,
  }),
);

/** Métrique quelconque (éligible ou non), libellé toujours anonyme. */
const anyMetricArb: fc.Arbitrary<ProofMetric> = fc.oneof(
  fc.constantFrom(...CATEGORIES).chain((c) => eligibleMetricArb(c)),
  ineligibleMetricArb,
);

/**
 * Entrée admettant une sélection valide : au moins une métrique éligible par
 * catégorie obligatoire, complétée de métriques quelconques, puis mélangée.
 */
const coverableMetricsArb: fc.Arbitrary<ProofMetric[]> = fc
  .tuple(
    eligibleMetricArb("temps-gagne"),
    eligibleMetricArb("erreurs-evitees"),
    eligibleMetricArb("roi"),
    fc.array(anyMetricArb, { maxLength: 8 }),
  )
  .chain(([m1, m2, m3, rest]) =>
    fc
      .shuffledSubarray([m1, m2, m3, ...rest], {
        minLength: 3 + rest.length,
        maxLength: 3 + rest.length,
      })
      .map((shuffled) => shuffled),
  );

/** Réplique indépendante de la règle d'éligibilité (basée sur la spec). */
function isEligible(metric: ProofMetric): boolean {
  if (metric.source === null || metric.source.trim().length === 0) {
    return false;
  }
  const bounds = METRIC_BOUNDS[metric.category];
  if (!bounds || !Number.isFinite(metric.value)) {
    return false;
  }
  return metric.value > bounds.min && metric.value < bounds.max;
}

/** Vrai si `text` contient un identifiant client interdit. */
function containsClientIdentifier(text: string): boolean {
  const lower = text.toLowerCase();
  return CLIENT_IDENTIFIERS.some((id) => lower.includes(id.toLowerCase()));
}

describe("selectRenderableMetrics", () => {
  // Property 13 — Validates: Requirements 6.1, 6.2
  it("Property 13: renvoie soit une liste vide, soit 3 à 6 métriques chiffrées avec unité couvrant les 3 catégories obligatoires", () => {
    fc.assert(
      fc.property(
        // On mêle entrées quelconques et entrées garantissant une couverture,
        // pour exercer à la fois la branche vide et la branche non vide.
        fc.oneof(
          fc.array(anyMetricArb, { maxLength: 12 }),
          coverableMetricsArb,
        ),
        (metrics) => {
          const result = selectRenderableMetrics(metrics);

          if (result.length === 0) {
            // Branche « masquée » : acceptable, rien d'autre à vérifier.
            return;
          }

          // Cardinalité : entre 3 et 6 inclus.
          expect(result.length).toBeGreaterThanOrEqual(METRICS_MIN);
          expect(result.length).toBeLessThanOrEqual(METRICS_MAX);

          // Chaque métrique a une valeur chiffrée finie et une unité non vide.
          for (const metric of result) {
            expect(Number.isFinite(metric.value)).toBe(true);
            expect(typeof metric.unit).toBe("string");
            expect(metric.unit.length).toBeGreaterThan(0);
          }

          // Couverture des 3 catégories obligatoires.
          const covered = new Set(result.map((m) => m.category));
          for (const category of REQUIRED_METRIC_CATEGORIES) {
            expect(covered.has(category)).toBe(true);
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 14 — Validates: Requirements 6.4, 6.5
  it("Property 14: exclut toute métrique non sourcée ou hors bornes (comparaison stricte)", () => {
    fc.assert(
      fc.property(fc.array(anyMetricArb, { maxLength: 14 }), (metrics) => {
        const result = selectRenderableMetrics(metrics);

        // Toute métrique rendue est éligible : sourcée ET strictement bornée.
        for (const metric of result) {
          expect(isEligible(metric)).toBe(true);
        }

        // Aucune métrique non éligible n'apparaît dans la sortie.
        for (const metric of metrics) {
          if (!isEligible(metric)) {
            expect(result).not.toContain(metric);
          }
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 15 — Validates: Requirement 6.3
  it("Property 15: la sortie ne contient aucun nom de client et ne fabrique aucun contenu (sous-ensemble par référence de l'entrée)", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.array(anyMetricArb, { maxLength: 12 }),
          coverableMetricsArb,
        ),
        (metrics) => {
          const result = selectRenderableMetrics(metrics);

          for (const metric of result) {
            // Non-fabrication : chaque métrique rendue provient de l'entrée
            // (même référence), donc la fonction ne peut introduire un
            // identifiant client absent de la source.
            expect(metrics).toContain(metric);

            // Anonymat : ni le libellé ni l'unité ne révèlent un client.
            expect(containsClientIdentifier(metric.label)).toBe(false);
            expect(containsClientIdentifier(metric.unit)).toBe(false);
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  // Vérification sur la source réelle : les métriques publiées sont anonymes.
  it("Property 15 (contenu réel): aucune métrique de PROOF_METRICS ne révèle d'identifiant client", () => {
    const rendered = selectRenderableMetrics(PROOF_METRICS);
    for (const metric of rendered) {
      expect(containsClientIdentifier(metric.label)).toBe(false);
      expect(containsClientIdentifier(metric.unit)).toBe(false);
    }
  });
});
