import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Briefcase, FileText, Globe, MessageSquare, ShieldCheck } from "lucide-react";
import { ProofBlock } from "@/components/ProofBlock";
import { Container, Section, SectionTitle } from "@/components/marketing/Sections";
import type { IconType } from "@/components/marketing/Sections";

/**
 * Page_Portfolio — réalisations et études de cas d'Opays Tech.
 *
 * Présente les chantiers typés, les preuves opérationnelles et un témoignage
 * anonymisé. Le layout `_public` fournit Navbar et Footer.
 */
export const Route = createFileRoute("/_public/portfolio")({
  component: PortfolioPage,
});

interface CaseStudy {
  icon: IconType;
  title: string;
  sector: string;
  problem: string;
  action: string;
  result: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    icon: Globe,
    title: "Web Intelligent",
    sector: "Organisation opérationnelle",
    problem: "Site statique, formulaires non reliés aux opérations et contenu difficile à maintenir.",
    action: "Conception d'un site modulaire avec formulaires connectés à l'API de contact et contenu structuré.",
    result: "Mises à jour internes possibles, délai de traitement des demandes divisé par deux.",
  },
  {
    icon: MessageSquare,
    title: "Chatbot Intelligent",
    sector: "Service client",
    problem: "Réponses répétitives saturant l'équipe et délais de réponse trop longs.",
    action: "Déploiement d'un assistant conversationnel sur la base de connaissance propriétaire.",
    result: "80% des demandes récurrentes traitées automatiquement, équipe recentrée sur les cas complexes.",
  },
  {
    icon: Bot,
    title: "Automatisation",
    sector: "Back-office",
    problem: "Ressaisies manuelles entre systèmes, erreurs de saisie et pertes de temps.",
    action: "Création de flux automatisés entre les outils existants, avec points de contrôle qualité.",
    result: "80% d'erreurs évitées et 10 heures récupérées par semaine pour l'équipe.",
  },
  {
    icon: ShieldCheck,
    title: "Agents IA",
    sector: "Pilotage opérationnel",
    problem: "Données dispersées, décisions retardées par la collecte d'informations.",
    action: "Mise en place d'agents coordonnés sur données locales avec contrôle d'accès RBAC.",
    result: "Situational awareness amélioré, cycles de décision raccourcis sans exposure externe.",
  },
  {
    icon: Briefcase,
    title: "Intégration IA",
    sector: "SI interne",
    problem: "Nouveaux outils IA en silo, sans lien avec les applications métier existantes.",
    action: "Intégration contrôlée d'API et modèles dans le circuit interne du client.",
    result: "IA opérationnelle sans rupture de workflow, données conservées en circuit maîtrisé.",
  },
  {
    icon: FileText,
    title: "Consultation Web & IA",
    sector: "Direction générale",
    problem: "Besoin de clarifier l'opportunité IA sans engagement lourd ni dépendance extérieure.",
    action: "Diagnostic d'efficience, cartographie des frictions et roadmap chiffrée en ROI.",
    result: "Priorisation des projets à fort impact, première solution opérationnelle en 6 semaines.",
  },
];

const TESTIMONIAL = {
  quote:
    "Opays Tech nous a aidés à identifier les fuites de temps qui nous coûtaient le plus. En six semaines, nous avions un système fonctionnel et une équipe plus autonome.",
  author: "Direction opérationnelle, organisation en RDC",
  role: "Client accompagné — mission FORGE",
};

function PortfolioPage() {
  return (
    <>
      <Hero />
      <CaseStudies />
      <ProofBlock />
      <Testimonial />
      <Closing />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)]"
        aria-hidden="true"
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Portfolio
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-5xl lg:text-6xl">
            Des opérations plus fluides, des résultats mesurables.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-testid="portfolio-hero-lead">
            Retrouvez ici les chantiers types menés par Opays Tech : automatisation, chatbots, agents
            IA et systèmes souverains pour les organisations opérationnelles en RDC.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

function CaseStudies() {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle
          eyebrow="Réalisations types"
          title="Ce que nous construisons concrètement"
          lead="Chaque cas illustre un levier d'efficience. Les noms de clients, secteurs et chiffres sont anonymisés."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((study, i) => {
            const Icon = study.icon;
            return (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex h-full flex-col rounded-2xl glass p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Icon size={22} className="text-primary" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {study.sector}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{study.title}</h3>
                <dl className="mt-4 flex-1 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground">Friction</dt>
                    <dd className="mt-1 leading-relaxed">{study.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Action</dt>
                    <dd className="mt-1 leading-relaxed">{study.action}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[color:var(--neon-cyan)]">Résultat</dt>
                    <dd className="mt-1 leading-relaxed">{study.result}</dd>
                  </div>
                </dl>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function Testimonial() {
  return (
    <Section className="border-t border-border/50">
      <Container size="narrow">
        <figure className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12">
          <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
            «&nbsp;{TESTIMONIAL.quote}&nbsp;»
          </blockquote>
          <figcaption className="mt-6 text-sm font-medium text-muted-foreground">
            — {TESTIMONIAL.author}
            <br />
            <span className="text-xs text-muted-foreground/70">{TESTIMONIAL.role}</span>
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}

function Closing() {
  return (
    <Section className="relative overflow-hidden border-t border-border/50">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-60"
        aria-hidden="true"
      />
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Un projet similaire en tête ?
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Parlons de vos frictions opérationnelles. Le diagnostic est gratuit et sans engagement.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            Diagnostic gratuit
            <ArrowRight size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
