import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { SectionHeader } from "@/components/Approche";
import { CtaDiagnostic } from "@/components/CtaDiagnostic";
import { METHOD_PHASES, type MethodPhase } from "@/content/method";
import { selectRenderablePhases } from "@/content/rules/method";

/**
 * Page_Methode (`/methode`) — présente la méthode Opays sous forme de phases
 * successives, chacune portant son nom, ses livrables nommés et sa durée
 * indicative, dans l'ordre chronologique de déroulement.
 *
 * Le contenu provient de la source unique `METHOD_PHASES`, filtrée et triée par
 * le noyau de logique pure `selectRenderablePhases` : seules les phases
 * disposant d'au moins un livrable non vide ET d'une durée indicative sont
 * affichées, et toujours dans l'ordre chronologique (Requirements 5.2, 5.3,
 * 5.5, 5.6). La page ne réinvente aucun contenu : elle consomme la sortie déjà
 * validée du noyau.
 *
 * Le layout public (`_public.tsx`) fournit la Navbar, le pied de page légal,
 * l'occurrence de CTA_Diagnostic visible sans défilement et les métadonnées
 * SEO (titre/description/canonical) via `PUBLIC_ROUTES`. Cette page ajoute son
 * propre CTA_Diagnostic en clôture du parcours (Requirement 10.2).
 *
 * Couvre : Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 10.2, 11.1.
 */

export const Route = createFileRoute("/_public/methode")({
  component: MethodePage,
});

/** Met au singulier l'unité de temps lorsque la valeur vaut 1 (« 1 semaine »). */
function formatDuration(duration: NonNullable<MethodPhase["duration"]>): string {
  const { value, unit } = duration;
  const label = value === 1 ? unit.replace(/s$/, "") : unit;
  return `${value} ${label}`;
}

function MethodePage() {
  // Phases prêtes au rendu : complètes (livrable + durée) et triées
  // chronologiquement par le noyau de règles pures.
  const phases = selectRenderablePhases(METHOD_PHASES);

  return (
    <section className="relative py-28">
      {/* Halo décoratif néon, atténué pour préserver la lisibilité du message. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-40"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Notre méthode"
          title="Des phases concrètes, des livrables, des délais."
          subtitle="Vous savez ce que vous obtenez et à quel rythme. Chaque phase produit un résultat tangible, de la lecture du terrain à la mise en service."
        />

        <ol className="mt-16 space-y-6">
          {phases.map((phase, index) => (
            <motion.li
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass p-8 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{ boxShadow: "var(--shadow-neon)" }}
              />

              <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-start">
                {/* Numéro d'ordre chronologique. */}
                <div className="font-mono text-2xl font-bold text-[color:var(--neon-cyan)]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Nom de la phase et ses livrables. */}
                <div>
                  <h3 className="text-xl font-semibold md:text-2xl">{phase.name}</h3>

                  <ul className="mt-4 space-y-2">
                    {phase.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-[color:var(--neon-cyan)]"
                        />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Durée indicative explicite (jours / semaines). */}
                {phase.duration && (
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground">
                    <Clock size={15} className="text-[color:var(--neon-cyan)]" />
                    <span>{formatDuration(phase.duration)}</span>
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ol>

        {/* CTA_Diagnostic unique en clôture du parcours méthode. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="max-w-2xl text-lg text-muted-foreground">
            Envie de voir cette méthode appliquée à vos opérations ? Commencez par la première
            étape.
          </p>
          <CtaDiagnostic size="lg" />
        </motion.div>
      </div>
    </section>
  );
}
