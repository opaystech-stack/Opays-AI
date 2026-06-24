import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Target, Users } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/marketing/Sections";
import { TerminalAnimation } from "@/components/TerminalAnimation";

/**
 * Page_À_Propos — présentation d'Opays Tech.
 *
 * Affiche l'équipe fondatrice, la vision et les engagements fondamentaux.
 * Le layout `_public` fournit Navbar et Footer.
 */
export const Route = createFileRoute("/_public/a-propos")({
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Target,
    title: "Supprimer une ligne de coût",
    text: "On ne vend pas de la technologie. On vend du temps gagné, des erreurs évitées et de la marge récupérée.",
  },
  {
    icon: ShieldCheck,
    title: "Souveraineté par défaut",
    text: "Vos données, vos modèles et vos savoirs restent sous votre contrôle. Jamais confiés à un tiers non maîtrisé.",
  },
  {
    icon: MapPin,
    title: "Ancrage RDC et terrain",
    text: "On part de la réalité opérationnelle en RDC, avec une équipe locale qui parle le langage du dirigeant.",
  },
  {
    icon: Users,
    title: "Transfert de compétence",
    text: "Chaque solution s'accompagne d'une montée en capacité réelle de vos équipes, pas d'une dépendance opaque.",
  },
];

function AboutPage() {
  return (
    <>
      <Hero />
      <Mission />
      <Pillars />
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
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
            À propos
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-5xl lg:text-6xl">
            Opays Tech, cabinet d'ingénierie de l'efficience.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-testid="about-hero-lead">
            Nous rendons le travail des organisations opérationnelles en RDC plus fluide, plus fiable
            et moins fatigant, en mettant l'IA au service d'opérations mesurables — sous leur contrôle.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

function Mission() {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionTitle
              eyebrow="Notre mission"
              title="L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas."
            />
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Nous croyons qu'une entreprise n'achète pas une technologie ; elle achète la suppression
              d'une ligne de coût. C'est pourquoi chaque projet Opays démarre par un diagnostic, se
              construit autour d'un résultat mesurable et se termine par une autonomie réelle.
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <TerminalAnimation />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Pillars() {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle
          eyebrow="Nos engagements"
          title="Ce qui guide notre travail"
          lead="Quatre principes non négociables, du premier diagnostic à la mise en production."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl glass p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </motion.div>
            );
          })}
        </div>
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
            Rencontrons-nous
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Échangeons autour de vos opérations, de vos frictions et de vos premiers gains possibles.
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
