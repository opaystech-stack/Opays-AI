import { createFileRoute } from "@tanstack/react-router";
import { buildPageMeta } from "@/lib/seo/meta";
import { ServicePage } from "@/components/marketing/ServicePage";
import { AUTOMATISATION } from "@/content/services/automatisation";

export const Route = createFileRoute("/_public/automatisation")({
  component: () => <ServicePage content={AUTOMATISATION} />,
  head: () =>
    buildPageMeta({
      path: "/automatisation",
      title: "Automatisation des processus — Opays Tech",
      description:
        "Automatisez les tâches répétitives de votre PME : moins d'erreurs, plus de temps, des processus 24/7 sous votre contrôle. Diagnostic gratuit.",
    }),
});
