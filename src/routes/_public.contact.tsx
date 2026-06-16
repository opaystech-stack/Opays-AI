import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Contact } from "@/components/Contact";
import { resolveCta } from "@/content/rules/cta";

/**
 * Page_Contact (`/contact`) — cible unique du CTA_Diagnostic.
 *
 * Cette page est la destination de l'appel à l'action unique du Site_Vitrine
 * (`resolveCta().target === "/contact"`). Elle présente la demande de
 * « Diagnostic gratuit » en réutilisant le composant `Contact` durci, sans le
 * dupliquer ni réinventer son formulaire : le formulaire reste la source unique
 * de la prise de contact (envoi vers `/api/send`, retours utilisateur via
 * `toast`).
 *
 * Le layout public (`_public.tsx`) fournit la Navbar (qui porte une occurrence
 * du CTA_Diagnostic visible sans défilement, Requirement 10.2), le pied de page
 * légal, et les métadonnées SEO (`<title>`, meta `description`,
 * `<link rel="canonical">`) à partir de la source unique `PUBLIC_ROUTES`
 * (entrée « /contact »), garantissant des balises conformes et uniques
 * (Requirements 12.1, 12.2, 12.4). La page n'a donc pas à redéclarer ses
 * métadonnées.
 *
 * Comme cette page EST la cible du CTA, elle n'affiche pas de bouton
 * CtaDiagnostic supplémentaire (cela créerait une boucle vers elle-même) :
 * l'action principale ici est le formulaire de Diagnostic lui-même. Cela
 * préserve l'invariant d'action principale unique par page (Requirement 10.5)
 * tout en restant cohérent avec le libellé unique du CTA (Requirement 10.1),
 * dont le texte est repris en intitulé de page.
 *
 * Identité visuelle conservée (effets glass, néon, animations framer-motion)
 * avec lisibilité prioritaire du message clé (Requirement 11.1).
 *
 * Le chemin « /_public/contact » est connu du typage généré
 * (`routeTree.gen.ts`).
 *
 * Couvre : Requirements 10.2, 10.3, 11.1, 12.1, 12.2, 12.4.
 */

export const Route = createFileRoute("/_public/contact")({
  component: ContactPage,
});

/** Libellé unique du CTA, réutilisé en intitulé de page (Requirement 10.1). */
const CTA_LABEL = resolveCta().label;

/** Réassurances affichées sous le titre du Diagnostic gratuit. */
const REASSURANCES: { icon: typeof CheckCircle2; text: string }[] = [
  { icon: CheckCircle2, text: "Audit de vos processus et recommandations chiffrées" },
  { icon: Clock, text: "Réponse sous 24h, sans engagement" },
  { icon: ShieldCheck, text: "Vos informations restent confidentielles" },
];

function ContactPage() {
  return (
    <>
      <ContactHero />
      {/* Formulaire de Diagnostic gratuit : composant durci réutilisé tel quel. */}
      <Contact />
    </>
  );
}

/**
 * En-tête de la Page_Contact : message clé lisible au-dessus de tout effet
 * décoratif (Requirement 11.2), reprenant le libellé exact du CTA unique
 * « Diagnostic gratuit » (Requirement 10.1).
 */
function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8">
      {/* Décor néon, derrière le contenu, sans nuire à la lisibilité. */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "var(--gradient-hero)", opacity: 0.18 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
            {CTA_LABEL}
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Réservez votre Diagnostic gratuit.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Décrivez-nous votre réalité en quelques lignes. Nous revenons vers
            vous avec une première lecture de vos enjeux et les prochaines étapes
            concrètes, sans engagement.
          </p>

          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            {REASSURANCES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon size={16} className="shrink-0 text-[color:var(--neon-cyan)]" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
