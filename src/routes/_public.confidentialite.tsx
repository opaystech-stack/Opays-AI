import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { buildPageMeta } from "@/lib/seo/meta";

/**
 * Page_Confidentialite (`/confidentialite`) — politique de confidentialité
 * décrivant les traitements de données personnelles (RGPD).
 *
 * Cette page satisfait l'obligation de publier une politique de confidentialité
 * accessible via une URL dédiée, rédigée en français (Requirements 8.2, 8.6).
 * Elle décrit précisément le seul traitement réalisé via le site : le
 * formulaire de contact (`/api/send`). Les données collectées correspondent aux
 * champs effectifs du formulaire — nom de l'entreprise (`company`), rôle
 * (`role`), description du besoin/projet (`process`) et coordonnée de contact
 * (`contact`, e-mail ou téléphone) — leur finalité, leur base légale, leur durée
 * de conservation, les destinataires, ainsi que les droits RGPD et les
 * modalités d'exercice.
 *
 * Les informations factuelles non encore arrêtées (durées exactes, identité du
 * responsable de traitement, coordonnées du DPO le cas échéant, autorité de
 * contrôle compétente précise) sont laissées en placeholders «&nbsp;[à
 * compléter]&nbsp;» : aucune donnée nominative ni adresse n'est inventée.
 *
 * Les métadonnées sont déclarées localement via `buildPageMeta` (ce chemin
 * n'appartient pas à `PUBLIC_ROUTES`, qui ne couvre que les six pages
 * principales). Le layout public `_public.tsx` fournit Navbar et pied de page ;
 * le contenu est rendu dans son `<Outlet/>`.
 *
 * Couvre : Requirements 8.2, 8.6.
 */

export const Route = createFileRoute("/_public/confidentialite")({
  component: ConfidentialitePage,
  head: () =>
    buildPageMeta({
      path: "/confidentialite",
      title: "Politique de confidentialité — Opays Tech",
      description:
        "Politique de confidentialité d'Opays Tech : données du formulaire de contact, finalité, base légale, conservation et droits RGPD.",
    }),
});

/** Date de dernière mise à jour affichée à titre indicatif. */
const DERNIERE_MISE_A_JOUR = "[à compléter]";

function ConfidentialitePage() {
  return (
    <>
      <PrivacyHero />
      <PrivacyBody />
    </>
  );
}

/** En-tête de page : titre lisible au-dessus de tout effet décoratif. */
function PrivacyHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "var(--gradient-hero)", opacity: 0.18 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
            Protection des données
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Politique de confidentialité
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Cette politique explique quelles données personnelles Opays Tech collecte via ce site,
            pourquoi, pendant combien de temps, et comment exercer vos droits, conformément au
            Règlement général sur la protection des données (RGPD).
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Dernière mise à jour : {DERNIERE_MISE_A_JOUR}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/** Corps de la politique de confidentialité, structuré en sections lisibles. */
function PrivacyBody() {
  return (
    <section className="relative pb-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="space-y-12">
          <PrivacySection title="Responsable du traitement">
            <p>
              Le responsable du traitement des données personnelles collectées via ce site est Opays
              Tech. Pour toute question relative à cette politique ou au traitement de vos données,
              vous pouvez nous contacter aux coordonnées indiquées dans nos{" "}
              <Link
                to="/mentions-legales"
                className="font-semibold text-[color:var(--neon-cyan)] hover:underline"
              >
                mentions légales
              </Link>
              .
            </p>
            <ul className="mt-4 space-y-2">
              <DataLine label="Responsable de traitement" value="Opays Tech" />
              <DataLine label="Contact" value="[à compléter]" />
              <DataLine
                label="Délégué à la protection des données (DPO)"
                value="[à compléter, le cas échéant]"
              />
            </ul>
          </PrivacySection>

          <PrivacySection title="Données collectées via le formulaire de contact">
            <p>
              Le seul traitement de données personnelles réalisé sur ce site intervient lorsque vous
              remplissez et envoyez le formulaire de contact. Les données suivantes sont alors
              collectées&nbsp;:
            </p>
            <ul className="mt-4 space-y-2">
              <DataLine label="Nom de l'entreprise" value="champ « entreprise »" />
              <DataLine label="Votre rôle" value="champ « rôle » (fonction occupée)" />
              <DataLine
                label="Votre besoin ou projet"
                value="champ « besoin » (description libre que vous saisissez)"
              />
              <DataLine
                label="Coordonnée de contact"
                value="champ « contact » (adresse e-mail ou numéro de téléphone)"
              />
            </ul>
            <p className="mt-4">
              Nous vous invitons à ne saisir, dans le champ de description libre, que les
              informations strictement nécessaires à la compréhension de votre demande, et à éviter
              d'y mentionner des données sensibles.
            </p>
          </PrivacySection>

          <PrivacySection title="Finalité du traitement">
            <p>
              Les données saisies dans le formulaire de contact sont utilisées dans le seul but de
              traiter votre demande&nbsp;: vous recontacter, répondre à votre sollicitation, et le
              cas échéant préparer un diagnostic ou une proposition d'accompagnement. Elles ne font
              l'objet d'aucune prospection commerciale non sollicitée ni d'aucune cession à des
              tiers à des fins marketing.
            </p>
          </PrivacySection>

          <PrivacySection title="Base légale">
            <p>
              Le traitement repose sur votre consentement et sur l'intérêt légitime d'Opays Tech à
              répondre aux demandes qui lui sont adressées, ainsi que, le cas échéant, sur les
              mesures précontractuelles prises à votre demande (article 6 du RGPD). Vous fournissez
              ces données volontairement&nbsp;; elles sont nécessaires au traitement de votre
              demande de contact.
            </p>
          </PrivacySection>

          <PrivacySection title="Destinataires des données">
            <p>
              Les données sont destinées aux équipes internes d'Opays Tech en charge du suivi des
              demandes. La transmission technique de votre message s'appuie sur un prestataire
              d'envoi d'e-mails agissant en qualité de sous-traitant&nbsp;; il traite les données
              pour le seul compte d'Opays Tech et selon ses instructions.
            </p>
            <ul className="mt-4 space-y-2">
              <DataLine label="Sous-traitant d'envoi d'e-mails" value="[à compléter]" />
              <DataLine label="Hébergeur" value="[à compléter]" />
            </ul>
          </PrivacySection>

          <PrivacySection title="Durée de conservation">
            <p>
              Les données collectées via le formulaire sont conservées le temps nécessaire au
              traitement de votre demande et à la relation qui pourrait en découler, puis archivées
              ou supprimées dans les délais applicables.
            </p>
            <ul className="mt-4 space-y-2">
              <DataLine
                label="Demandes sans suite"
                value="[à compléter] (par défaut, conservation limitée puis suppression)"
              />
              <DataLine
                label="Relations contractuelles"
                value="[à compléter] (durée de la relation puis archivage légal)"
              />
            </ul>
          </PrivacySection>

          <PrivacySection title="Transfert hors Union européenne">
            <p>
              Opays Tech privilégie un hébergement et des traitements localisés au sein de l'Union
              européenne. Si un transfert de données hors UE devait intervenir via un sous-traitant,
              il serait encadré par des garanties appropriées conformément au RGPD&nbsp;: [à
              compléter].
            </p>
          </PrivacySection>

          <PrivacySection title="Vos droits">
            <p>
              Conformément au RGPD, vous disposez des droits suivants sur vos données
              personnelles&nbsp;:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>droit d'accès à vos données&nbsp;;</li>
              <li>droit de rectification des données inexactes ou incomplètes&nbsp;;</li>
              <li>droit à l'effacement («&nbsp;droit à l'oubli&nbsp;»)&nbsp;;</li>
              <li>droit à la limitation du traitement&nbsp;;</li>
              <li>droit d'opposition au traitement&nbsp;;</li>
              <li>droit à la portabilité de vos données&nbsp;;</li>
              <li>droit de retirer votre consentement à tout moment&nbsp;;</li>
              <li>droit de définir des directives sur le sort de vos données après votre décès.</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à l'adresse indiquée dans nos{" "}
              <Link
                to="/mentions-legales"
                className="font-semibold text-[color:var(--neon-cyan)] hover:underline"
              >
                mentions légales
              </Link>
              . Une preuve d'identité pourra vous être demandée. Si vous estimez, après nous avoir
              contactés, que vos droits ne sont pas respectés, vous pouvez introduire une
              réclamation auprès de l'autorité de contrôle compétente (en France, la CNIL —
              www.cnil.fr).
            </p>
          </PrivacySection>

          <PrivacySection title="Cookies et mesure d'audience">
            <p>
              Ce site ne dépose pas de cookies publicitaires ni de traceurs destinés au profilage.
              Seuls des éléments strictement nécessaires au fonctionnement du site peuvent être
              utilisés. Toute évolution sur ce point sera reflétée dans la présente politique&nbsp;:
              [à compléter].
            </p>
          </PrivacySection>

          <PrivacySection title="Modification de la politique">
            <p>
              Opays Tech peut faire évoluer cette politique de confidentialité afin de l'adapter aux
              évolutions légales, techniques ou organisationnelles. La date de dernière mise à jour
              figure en tête de cette page.
            </p>
          </PrivacySection>
        </div>
      </div>
    </section>
  );
}

/** Section de contenu : titre + corps de texte lisible. */
function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-1 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </motion.div>
  );
}

/** Ligne « libellé : valeur » d'un bloc d'informations. */
function DataLine({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span className="font-medium text-foreground">{label}&nbsp;:</span>
      <span>{value}</span>
    </li>
  );
}
