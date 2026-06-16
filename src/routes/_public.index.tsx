import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, MapPin, ShieldCheck } from "lucide-react";
import { ProofBlock } from "@/components/ProofBlock";
import { Container, Section, SectionTitle } from "@/components/marketing/Sections";
import { SERVICE_CATALOG } from "@/content/services/catalog";

/**
 * Page_Accueil — hub d'entrée du site. Présente la promesse, les services et la
 * preuve, sans bloc équipe. Le layout `_public` fournit Navbar et Footer.
 */
export const Route = createFileRoute("/_public/")({
  component: Index,
});

type NavTo = Parameters<typeof Link>[0]["to"];

const AXES = [
  {
    icon: ShieldCheck,
    title: "Souveraineté",
    text: "Vos données et vos modèles restent sous votre contrôle.",
  },
  {
    icon: Cpu,
    title: "IA locale",
    text: "L'IA opérée au plus près de vos opérations, en circuit maîtrisé.",
  },
  {
    icon: MapPin,
    title: "Ancrage RDC et terrain",
    text: "On part de votre réalité opérationnelle en RDC, pas d'une théorie importée.",
  },
];

function Index() {
  return (
    <>
      <Hero />
      <Services />
      <ProofBlock />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50"
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
            Pour les organisations opérationnelles en RDC
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-6xl">
            Structurez vos opérations, <span className="text-gradient">gagnez en efficience.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas. Des
            solutions concrètes, mesurables, et maîtrisées de bout en bout.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
            >
              Diagnostic gratuit
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Voir nos services
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {AXES.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="rounded-2xl glass p-5">
                  <Icon size={20} className="text-[color:var(--neon-cyan)]" />
                  <h2 className="mt-3 text-base font-semibold">{a.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Services() {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle
          eyebrow="Nos services"
          title="Ce que nous faisons pour vous"
          lead="Six leviers d'efficience, du site web aux agents IA. On prend le plus utile, pas tout."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATALOG.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={s.path as NavTo}
                  className="group flex h-full flex-col rounded-2xl glass p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.label}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Découvrir
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function ClosingCta() {
  return (
    <Section className="relative overflow-hidden border-t border-border/50">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-60"
        aria-hidden="true"
      />
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Parlons de vos enjeux, sans engagement
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Un premier échange suffit pour identifier vos gains les plus rapides. Le diagnostic est
            gratuit.
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
