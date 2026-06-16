import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cpu, KeyRound, Brain, Beaker, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/Approche";
import { CtaDiagnostic } from "@/components/CtaDiagnostic";
import { FOUNDERS } from "@/content/team";

/**
 * Page_Souverainete_RD — angle différenciant d'Opays Tech.
 *
 * Cette page porte la souveraineté technologique et la branche recherche :
 * - une section dédiée à l'IA locale énonçant explicitement le principe
 *   « sans dépendre d'infrastructures que vous ne contrôlez pas » et l'ancrage
 *   français et terrain (Requirement 9.1) ;
 * - le patrimoine cognitif propriétaire présenté comme élément du
 *   Palier_Transformation, son rôle décrit en une phrase (Requirement 9.2) ;
 * - le texte exact du Message_Pivot du Glossaire (Requirement 9.3) ;
 * - le contrôle d'accès par rôles (RBAC) présenté comme élément du
 *   Palier_Transformation, son rôle décrit en une phrase (Requirement 9.4) ;
 * - la branche recherche nommant Fénelon Lamsasiri avec le rôle Lead R&D
 *   (Requirement 9.5) ;
 * - le CTA_Diagnostic unique dirigeant vers la Page_Contact (Requirements 9.6,
 *   10.2).
 *
 * Identité visuelle conservée (effets glass, néon, animations framer-motion)
 * avec lisibilité prioritaire (Requirement 11.1).
 *
 * Le chemin « /souverainete-rd » est connu du typage généré
 * (`routeTree.gen.ts`). Le contenu (sections) est rendu dans l'`<Outlet/>` du
 * layout public `_public.tsx`, qui fournit Navbar, footer légal et CTA.
 *
 * Couvre : Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 10.2, 11.1.
 */

export const Route = createFileRoute("/_public/souverainete-rd")({
  component: SouveraineteRD,
});

/** Texte exact du Message_Pivot (Glossaire des requirements). */
const MESSAGE_PIVOT =
  "L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas.";

/** Membre fondateur portant le rôle Lead R&D, lu depuis la source unique. */
const LEAD_RD = FOUNDERS.find((member) => member.roles.includes("Lead R&D"));

function SouveraineteRD() {
  return (
    <>
      <SovereigntyHero />
      <LocalAiSection />
      <TransformationElements />
      <ResearchSection />
      <ClosingCta />
    </>
  );
}

/**
 * En-tête de page : message clé lisible et Message_Pivot exact (Requirement
 * 9.3), au-dessus de tout effet décoratif (Requirement 11.2).
 */
function SovereigntyHero() {
  return (
    <section className="relative overflow-hidden py-28">
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
            Souveraineté &amp; R&amp;D
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            L'IA chez vous, sous votre contrôle.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Vous voulez tirer parti de l'IA sans confier vos données ni vos
            savoirs à des plateformes que vous ne maîtrisez pas. Nous concevons
            une efficience souveraine, ancrée sur votre terrain.
          </p>

          {/* Message_Pivot reproduit à l'exact (Requirement 9.3). */}
          <blockquote className="mt-8 rounded-2xl glass border-l-2 border-l-[color:var(--neon-cyan)] p-6">
            <p className="text-xl font-semibold leading-snug text-foreground">
              «&nbsp;{MESSAGE_PIVOT}&nbsp;»
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Ce principe guide chacun de nos choix.{" "}
              <Link
                to="/"
                className="font-semibold text-[color:var(--neon-cyan)] hover:underline"
              >
                Revenir à l'accueil
              </Link>{" "}
              pour en comprendre la promesse.
            </p>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Section IA locale : souveraineté technologique et ancrage français et
 * terrain, principe « sans dépendre d'infrastructures que vous ne contrôlez
 * pas » énoncé explicitement (Requirement 9.1).
 */
function LocalAiSection() {
  return (
    <section className="relative bg-secondary/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="IA locale"
              title="Une IA qui s'exécute chez vous."
            />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Nous déployons vos modèles en circuit fermé, sur vos propres
              serveurs. Votre IA reste opérée « sans dépendre d'infrastructures
              que vous ne contrôlez pas ». Vos données ne quittent jamais votre
              périmètre.
            </p>

            <div className="mt-10 space-y-8">
              <Feature
                icon={Cpu}
                title="Déploiement privé en circuit fermé"
                text="Vos modèles tournent sur votre infrastructure, sans dépendance à un fournisseur externe. Latence maîtrisée, confidentialité préservée."
              />
              <Feature
                icon={MapPin}
                title="Ancrage français et terrain"
                text="Nous partons de votre réalité opérationnelle, en français, au plus près de vos équipes. La souveraineté se vit aussi dans la proximité."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-white/10 glass p-8">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: [0, 0.1, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 1.3,
                      ease: "easeOut",
                    }}
                    className="absolute h-40 w-40 rounded-full border border-primary/40"
                  />
                ))}
              </div>
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Cpu
                    size={80}
                    className="mx-auto mb-4 text-primary drop-shadow-[0_0_15px_rgba(0,186,255,0.5)]"
                  />
                </motion.div>
                <div className="mb-2 text-2xl font-bold tracking-tight text-white">
                  Circuit fermé
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Données sous contrôle
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Éléments du Palier_Transformation : patrimoine cognitif propriétaire
 * (Requirement 9.2) et contrôle d'accès par rôles / RBAC (Requirement 9.4),
 * chacun avec son rôle décrit en une phrase.
 */
function TransformationElements() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Palier Transformation Souveraine"
          title="Vos savoirs et vos accès, maîtrisés."
          subtitle="Deux piliers de la Transformation Souveraine, pensés pour garder le contrôle."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <TransformationCard
            icon={Brain}
            tag="Patrimoine cognitif propriétaire"
            title="Vos savoirs deviennent un actif."
            text="Le patrimoine cognitif propriétaire capitalise les savoirs de votre organisation sous contrôle conjoint d'Opays et du client, comme élément du Palier Transformation Souveraine."
            index={0}
          />
          <TransformationCard
            icon={KeyRound}
            tag="Contrôle d'accès par rôles (RBAC)"
            title="Le bon accès, à la bonne personne."
            text="Le contrôle d'accès par rôles (RBAC) restreint les accès aux données et aux modèles selon les rôles, comme élément du Palier Transformation Souveraine."
            index={1}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Branche recherche : présente le pôle R&D et nomme Fénelon Lamsasiri avec le
 * rôle Lead R&D (Requirement 9.5).
 */
function ResearchSection() {
  return (
    <section className="relative bg-secondary/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="Branche recherche"
              title="Un laboratoire, pas seulement un intégrateur."
            />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Notre pôle recherche adapte les modèles open source à votre métier,
              optimise leur exécution locale et durcit leur gouvernance. La
              recherche nourrit directement vos systèmes.
            </p>

            <div className="mt-10 rounded-2xl glass p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-mono text-base font-semibold text-[color:var(--neon-cyan)]">
                  FL
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {LEAD_RD?.fullName ?? "Fénelon Lamsasiri"}
                  </p>
                  <p className="text-sm text-muted-foreground">Lead R&amp;D</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Fénelon Lamsasiri dirige la recherche d'Opays Tech comme Lead
                R&amp;D : il oriente nos travaux sur l'IA locale, la souveraineté
                et l'alignement des modèles sur votre contexte.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-white/10 glass p-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute h-[150%] w-[150%] opacity-20"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, var(--neon-cyan), transparent 30%)",
                }}
              />
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Beaker
                    size={80}
                    className="mx-auto mb-4 text-primary drop-shadow-[0_0_15px_rgba(0,186,255,0.5)]"
                  />
                </motion.div>
                <div className="mb-2 text-2xl font-bold tracking-tight text-white">
                  R&amp;D Lab
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Recherche souveraine
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Clôture de page : CTA_Diagnostic unique dirigeant vers la Page_Contact
 * (Requirements 9.6, 10.2).
 */
function ClosingCta() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Prêt à reprendre le contrôle de votre IA ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Évaluons ensemble votre besoin de souveraineté et le périmètre d'une
            transformation adaptée à votre terrain.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaDiagnostic size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Bloc de mise en avant réutilisé : icône néon + titre + texte. */
function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Cpu;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <h4 className="mb-1 font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

/** Carte d'un élément du Palier_Transformation (glass + halo néon au survol). */
function TransformationCard({
  icon: Icon,
  tag,
  title,
  text,
  index,
}: {
  icon: typeof Cpu;
  tag: string;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col rounded-2xl glass p-7 transition-all hover:-translate-y-1 hover:border-primary/40"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
        <Icon size={22} className="text-primary" />
      </div>
      <div className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--neon-cyan)]">
        {tag}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: "var(--shadow-neon)" }}
      />
    </motion.div>
  );
}
