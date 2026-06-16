import { createFileRoute } from "@tanstack/react-router";
import { buildPageMeta } from "@/lib/seo/meta";
import { ServicePage } from "@/components/marketing/ServicePage";
import { CONSULTATION_WEB_IA } from "@/content/services/consultation-web-et-ia";

export const Route = createFileRoute("/_public/consultation-web-et-ia")({
  component: () => <ServicePage content={CONSULTATION_WEB_IA} />,
  head: () =>
    buildPageMeta({
      path: "/consultation-web-et-ia",
      title: "Consultation web et IA — Opays Tech",
      description:
        "Avant d'investir, cadrez votre stratégie web et IA avec un regard expert et indépendant : audit, priorités, feuille de route. Diagnostic gratuit.",
    }),
});
