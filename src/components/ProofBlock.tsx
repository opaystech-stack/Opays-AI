import { motion } from "framer-motion";
import { Clock, ShieldCheck, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import { SectionHeader } from "./Approche";
import type { MetricCategory, ProofMetric } from "../content/proof";
import { PROOF_METRICS } from "../content/proof";
import { selectRenderableMetrics } from "../content/rules/proof";

/**
 * Bloc_Preuves — métriques de résultat opérationnel.
 *
 * Consomme la sélection pure `selectRenderableMetrics(PROOF_METRICS)` : seules
 * les métriques sourcées, dans les bornes plausibles et couvrant les trois
 * catégories obligatoires sont rendues. Si aucune sélection valide n'existe,
 * le bloc n'est pas affiché (pas de valeur vide).
 *
 * Identité visuelle : glass, néon, animations framer-motion. La lisibilité du
 * message clé (valeur chiffrée) reste prioritaire sur les effets décoratifs.
 *
 * Couvre : Requirements 6.1, 6.2, 6.3, 11.1, 11.2, 11.3.
 */

/** Icône associée à chaque catégorie de métrique (signal de lecture rapide). */
const CATEGORY_ICON: Record<
  MetricCategory,
  ComponentType<{ size?: number; className?: string }>
> = {
  "temps-gagne": Clock,
  "erreurs-evitees": ShieldCheck,
  roi: TrendingUp,
};

export function ProofBlock() {
  const metrics = selectRenderableMetrics(PROOF_METRICS);

  // Aucune métrique valide : on masque le bloc plutôt que d'afficher une preuve
  // incomplète (Exigence 6.5).
  if (metrics.length === 0) {
    return null;
  }

  return (
    <section id="preuves" className="py-28 relative bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Preuves opérationnelles"
          title="Des résultats concrets, mesurés sur le terrain."
          subtitle="Des gains constatés sur nos missions, exprimés en résultats vérifiables."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, i) => (
            <MetricCard key={`${metric.category}-${i}`} metric={metric} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric, index }: { metric: ProofMetric; index: number }) {
  const Icon = CATEGORY_ICON[metric.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl glass p-8 hover:border-primary/40 hover:-translate-y-1 transition-all"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
        <Icon size={22} className="text-primary" />
      </div>

      {/* Message clé lisible en premier : valeur chiffrée + unité. */}
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground md:text-5xl">{metric.value}</span>
        <span className="text-2xl font-semibold text-[color:var(--neon-cyan)]">{metric.unit}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{metric.label}</p>

      {metric.source && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
          {metric.source}
        </p>
      )}

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: "var(--shadow-neon)" }}
      />
    </motion.div>
  );
}
