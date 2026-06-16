import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { buildPageMeta } from "@/lib/seo/meta";

/**
 * Page_Mentions_Legales (`/mentions-legales`) — informations légales
 * obligatoires (FR/UE).
 *
 * Cette page satisfait l'obligation de publier des mentions légales accessibles
 * via une URL dédiée (Requirement 8.1). Elle est rédigée en français, dans un
 * ton sobre et sérieux, propre à Opays Tech. Les informations factuelles non
 * encore arrêtées (raison sociale exacte, forme juridique, capital, SIREN/RCS,
 * TVA, adresse du siège, directeur de la publication, coordonnées de
 * l'hébergeur) sont laissées en placeholders explicites « [à compléter] » :
 * aucune donnée nominative ni adresse n'est inventée.
 *
 * Les métadonnées (`<title>`, meta `description`, Open Graph, canonical, JSON-LD
 * Organization) sont déclarées localement via `buildPageMeta` (et non via
 * `PUBLIC_ROUTES`, qui ne couvre que les six pages principales) : ce chemin
 * n'appartient pas à la Navigation_Principale. Le layout public `_public.tsx`
 * fournit la Navbar, le pied de page légal et le conteneur de notifications ;
 * le contenu ci-dessous est rendu dans son `<Outlet/>`.
 *
 * Couvre : Requirements 8.1, 8.6.
 */

export const Route = createFileRoute("/_public/mentions-legales")({
  component: MentionsLegalesPage,
  head: () =>
    buildPageMeta({
      path: "/mentions-legales",
      title: "Mentions légales — Opays Tech",
      description:
        "Mentions légales d'Opays Tech : éditeur du site, hébergement, propriété intellectuelle, responsabilité et coordonnées de contact.",
    }),
});

/** Date de dernière mise à jour affichée à titre indicatif. */
const DERNIERE_MISE_A_JOUR = "[à compléter]";

function MentionsLegalesPage() {
  return (
    <>
      <LegalHero />
      <LegalBody />
    </>
  );
}

/** En-tête de page : titre lisible au-dessus de tout effet décoratif. */
function LegalHero() {
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
            Informations légales
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">Mentions légales</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Informations relatives à l'éditeur du site, à son hébergement et aux conditions
            d'utilisation, conformément aux obligations légales en vigueur.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Dernière mise à jour : {DERNIERE_MISE_A_JOUR}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/** Corps des mentions légales, structuré en sections lisibles. */
function LegalBody() {
  return (
    <section className="relative pb-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="space-y-12">
          <LegalSection title="Éditeur du site">
            <p>
              Le présent site est édité par Opays Tech (ci-après «&nbsp;Opays Tech&nbsp;» ou
              «&nbsp;l'éditeur&nbsp;»).
            </p>
            <ul className="mt-4 space-y-2">
              <DataLine label="Raison sociale" value="Opays Tech" />
              <DataLine label="Forme juridique" value="[à compléter]" />
              <DataLine label="Capital social" value="[à compléter]" />
              <DataLine label="Siège social" value="[à compléter]" />
              <DataLine label="Immatriculation (RCS / SIREN)" value="[à compléter]" />
              <DataLine label="Numéro de TVA intracommunautaire" value="[à compléter]" />
              <DataLine label="Directeur de la publication" value="[à compléter]" />
            </ul>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              Pour toute question relative au site ou à son contenu, vous pouvez nous écrire à
              l'adresse de contact indiquée ci-dessous, ou utiliser le formulaire dédié.
            </p>
            <ul className="mt-4 space-y-2">
              <DataLine label="Adresse e-mail" value="[à compléter]" />
              <DataLine label="Téléphone" value="[à compléter]" />
            </ul>
            <p className="mt-4">
              Vous pouvez également nous joindre via la{" "}
              <Link
                to="/contact"
                className="font-semibold text-[color:var(--neon-cyan)] hover:underline"
              >
                page Contact
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="Hébergement">
            <p>Le site est hébergé par le prestataire suivant&nbsp;:</p>
            <ul className="mt-4 space-y-2">
              <DataLine label="Hébergeur" value="[à compléter]" />
              <DataLine label="Adresse" value="[à compléter]" />
              <DataLine label="Contact" value="[à compléter]" />
            </ul>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle">
            <p>
              L'ensemble des éléments composant ce site (textes, visuels, logo, charte graphique,
              code et structure) est protégé par le droit de la propriété intellectuelle. Sauf
              mention contraire, ces éléments sont la propriété exclusive d'Opays Tech.
            </p>
            <p className="mt-4">
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle,
              sans autorisation écrite préalable d'Opays Tech est interdite et susceptible de
              constituer une contrefaçon.
            </p>
          </LegalSection>

          <LegalSection title="Responsabilité">
            <p>
              Opays Tech s'efforce d'assurer l'exactitude et la mise à jour des informations
              diffusées sur ce site, sans pouvoir en garantir l'exhaustivité ni l'absence d'erreur.
              Les informations sont fournies à titre indicatif et peuvent évoluer sans préavis.
            </p>
            <p className="mt-4">
              Opays Tech ne saurait être tenue responsable des dommages directs ou indirects
              résultant de l'accès au site, de son utilisation ou de l'impossibilité d'y accéder.
            </p>
          </LegalSection>

          <LegalSection title="Liens externes">
            <p>
              Le site peut contenir des liens vers des sites tiers. Opays Tech n'exerce aucun
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou à
              l'usage qui pourrait en être fait.
            </p>
          </LegalSection>

          <LegalSection title="Données personnelles et cookies">
            <p>
              Le traitement des données personnelles collectées via ce site, notamment au travers du
              formulaire de contact, est détaillé dans notre{" "}
              <Link
                to="/confidentialite"
                className="font-semibold text-[color:var(--neon-cyan)] hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="Droit applicable">
            <p>
              Les présentes mentions légales sont régies par le droit français. Tout litige relatif
              à l'utilisation du site relève de la compétence des juridictions françaises, sous
              réserve des dispositions légales impératives applicables.
            </p>
          </LegalSection>
        </div>
      </div>
    </section>
  );
}

/** Section de contenu légal : titre + corps de texte lisible. */
function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
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

/** Ligne « libellé : valeur » d'un bloc d'informations factuelles. */
function DataLine({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span className="font-medium text-foreground">{label}&nbsp;:</span>
      <span>{value}</span>
    </li>
  );
}
