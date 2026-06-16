import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, DoorOpen, Sparkles, AlertTriangle } from "lucide-react";
import { OFFERS, type Offer } from "@/content/offers";
import { selectRenderableOffers } from "@/content/rules/offers";
import { orderedResumeLines, type ResumeLineKey } from "@/content/rules/resume";
import { SectionHeader } from "@/components/Approche";
import { CtaDiagnostic } from "@/components/CtaDiagnostic";

/**
 * Page_Offres — présentation publique des trois Paliers productisés.
 *
 * La page consomme exclusivement la sortie validée du noyau de logique pure :
 * `selectRenderableOffers` filtre les Paliers au Resume_Offre incomplet
 * (Requirement 4.7) et renvoie les Paliers conservés triés par ordre croissant
 * d'engagement (Requirement 3.1). Le rendu n'invente aucun contenu : titres,
 * descriptions, livrables et résumés proviennent de `OFFERS`.
 *
 * Garanties portées par ce composant :
 * - les cinq lignes de chaque Resume_Offre sont rendues dans l'ordre obligatoire
 *   via `orderedResumeLines` (Requirement 4.6) ;
 * - le badge « Recommandé » n'apparaît que sur le Palier_Systeme
 *   (`offer.recommended`, Requirement 3.3) ;
 * - la mention « porte d'entrée » n'apparaît que sur le Palier_Diagnostic
 *   (`offer.isEntryPoint`, Requirement 3.4) ;
 * - chaque Palier expose une occurrence activable du CTA_Diagnostic
 *   (Requirement 3.5), dont le composant gère l'indisponibilité de la cible en
 *   affichant un message d'erreur sans perte d'information (Requirement 3.6) ;
 * - aucun montant, fourchette ou unité monétaire n'est affiché (Requirement 3.2) ;
 * - l'identité visuelle (glass, néon, framer-motion) est appliquée avec
 *   lisibilité prioritaire (Requirement 11.1).
 *
 * Les métadonnées (`<title>`, `description`, `<link rel="canonical">`) sont
 * fournies par le layout `_public` à partir de `PUBLIC_ROUTES` (« /offres »),
 * la page n'a donc pas à les redéclarer.
 *
 * Couvre : Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.6, 10.2, 11.1.
 */

export const Route = createFileRoute("/_public/offres")({
  component: PageOffres,
});

/** Libellés affichés des cinq lignes obligatoires du Resume_Offre. */
const RESUME_LINE_LABELS: Record<ResumeLineKey, string> = {
  problemeTraite: "Problème traité",
  solutionProposee: "Solution proposée",
  beneficeOperationnel: "Bénéfice opérationnel",
  niveauAccompagnement: "Niveau d'accompagnement",
  prochaineAction: "Prochaine action",
};

function PageOffres() {
  // Sélection validée et ordonnée : source unique du rendu.
  const { renderable, omitted } = selectRenderableOffers(OFFERS);

  return (
    <section id="offres" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Nos offres"
          title="Trois paliers d'efficience, sans prix avant la compréhension de votre besoin."
          subtitle="Du diagnostic à la transformation souveraine : choisissez la porte d'entrée adaptée à votre réalité, dans l'ordre croissant d'engagement."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-start">
          {renderable.map((offer, index) => (
            <OfferCard key={offer.tier} offer={offer} index={index} />
          ))}
        </div>

        {omitted.length > 0 && (
          <p
            role="status"
            className="mt-10 inline-flex items-start gap-2 text-sm text-muted-foreground"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[color:var(--neon-cyan)]" />
            <span>
              Certaines offres sont temporairement masquées : leur résumé est incomplet et sera
              publié une fois finalisé.
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

/** Carte d'un Palier : titre, description, livrables, résumé ordonné, CTA. */
function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const resumeLines = orderedResumeLines(offer.resume);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`group relative flex h-full flex-col rounded-2xl glass p-8 transition-all hover:-translate-y-1 ${
        offer.recommended ? "border-primary/50 ring-1 ring-primary/30" : "hover:border-primary/40"
      }`}
    >
      {/* Halo néon : décoratif, sous le contenu, sans nuire à la lisibilité. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col">
        {/* Marqueurs de palier : uniques par construction (Req. 3.3 / 3.4). */}
        <div className="mb-4 flex min-h-6 flex-wrap items-center gap-2">
          {offer.recommended && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-gradient-to-r from-primary/20 to-accent/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]">
              <Sparkles size={12} />
              Recommandé
            </span>
          )}
          {offer.isEntryPoint && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <DoorOpen size={12} />
              Porte d'entrée
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold leading-tight">{offer.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{offer.description}</p>

        {offer.isEntryPoint && (
          <p className="mt-3 text-sm font-medium text-[color:var(--neon-cyan)]">
            Première étape recommandée du parcours : commencez ici pour situer vos priorités avant
            tout engagement.
          </p>
        )}

        {/* Livrables (Req. 3.1). */}
        <div className="mt-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Livrables
          </div>
          <ul className="space-y-2">
            {offer.deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-2 text-sm">
                <Check size={16} className="mt-0.5 shrink-0 text-[color:var(--neon-cyan)]" />
                <span className="text-foreground/90">{deliverable}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resume_Offre : cinq lignes dans l'ordre obligatoire (Req. 4.6). */}
        <dl className="mt-6 space-y-3 border-t border-border/60 pt-6">
          {resumeLines.map(({ key, text }) => (
            <div key={key}>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {RESUME_LINE_LABELS[key]}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{text}</dd>
            </div>
          ))}
        </dl>

        {/* CTA_Diagnostic propre au Palier (Req. 3.5) ; le composant gère
            l'indisponibilité de la cible (Req. 3.6). */}
        <div className="mt-8 pt-2">
          <CtaDiagnostic
            variant={offer.recommended ? "primary" : "secondary"}
            size="md"
            fullWidth
          />
        </div>
      </div>
    </motion.article>
  );
}
