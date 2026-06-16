import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buildPageMeta } from "@/lib/seo/meta";
import { Container, Section, SectionTitle } from "@/components/marketing/Sections";
import { SERVICE_CATALOG } from "@/content/services/catalog";

export const Route = createFileRoute("/_public/services")({
  component: ServicesPage,
  head: () =>
    buildPageMeta({
      path: "/services",
      title: "Nos services — Opays Tech",
      description:
        "Web, chatbot, automatisation, agents IA, intégration IA et consultation : des solutions concrètes pour gagner en efficience. Diagnostic gratuit.",
    }),
});

type NavTo = Parameters<typeof Link>[0]["to"];

function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)]" aria-hidden="true" />
        <Container>
          <SectionTitle
            eyebrow="Nos services"
            title="Des solutions concrètes, au service de votre efficience"
            lead="Chaque service répond à un besoin précis. On part du terrain, on automatise l'utile, et vos données restent sous votre contrôle."
            align="left"
          />
        </Container>
      </section>

      <Section className="pt-4">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CATALOG.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link
                    to={s.path as NavTo}
                    className="group flex h-full flex-col rounded-2xl glass p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold">{s.label}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Découvrir
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
