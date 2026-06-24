import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { Container, Section, SectionTitle } from "@/components/marketing/Sections";

/**
 * Page_FAQ — Questions fréquentes sur Opays Tech.
 *
 * Réutilise le composant FAQ existant (accordéon par catégories). Le layout
 * `_public` fournit Navbar et Footer.
 */
export const Route = createFileRoute("/_public/faq")({
  component: FAQPage,
});

function FAQPage() {
  return (
    <>
      <Hero />
      <FAQ />
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
            FAQ
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-5xl lg:text-6xl">
            Questions fréquentes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-testid="faq-hero-lead">
            Ce que l'on nous demande le plus sur l'efficience, l'IA locale, la souveraineté des
            données et la façon dont Opays Tech accompagne les organisations en RDC.
          </p>
        </motion.div>
      </Container>
    </section>
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
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Écrivez-nous directement. Nous reprenons chaque message en personne, sans formulaire
            interminable.
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
