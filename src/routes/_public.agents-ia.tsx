import { createFileRoute } from "@tanstack/react-router";
import { buildPageMeta } from "@/lib/seo/meta";
import { ServicePage } from "@/components/marketing/ServicePage";
import { AGENTS_IA } from "@/content/services/agents-ia";

export const Route = createFileRoute("/_public/agents-ia")({
  component: () => <ServicePage content={AGENTS_IA} />,
  head: () =>
    buildPageMeta({
      path: "/agents-ia",
      title: "Agents IA pour entreprises — Opays Tech",
      description:
        "Déployez des agents IA autonomes qui exécutent vos tâches métier complexes, avec garde-fous et données maîtrisées. Diagnostic gratuit Opays Tech.",
    }),
});
