import { createFileRoute } from "@tanstack/react-router";
import { buildPageMeta } from "@/lib/seo/meta";
import { ServicePage } from "@/components/marketing/ServicePage";
import { INTEGRATION_IA } from "@/content/services/integration-ia";

export const Route = createFileRoute("/_public/integration-ia")({
  component: () => <ServicePage content={INTEGRATION_IA} />,
  head: () =>
    buildPageMeta({
      path: "/integration-ia",
      title: "Intégration IA dans vos outils — Opays Tech",
      description:
        "Ajoutez de l'IA à vos outils existants (CRM, e-mail, reporting) sans tout changer : prédiction, scoring, automatisation. Diagnostic gratuit.",
    }),
});
