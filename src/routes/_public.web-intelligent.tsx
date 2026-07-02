import { createFileRoute } from "@tanstack/react-router";
import { buildPageMeta } from "@/lib/seo/meta";
import { ServicePage } from "@/components/marketing/ServicePage";
import { WEB_INTELLIGENT } from "@/content/services/web-intelligent";

export const Route = createFileRoute("/_public/web-intelligent")({
  component: () => <ServicePage content={WEB_INTELLIGENT} />,
  head: () =>
    buildPageMeta({
      path: "/web-intelligent",
      title: "Web Intelligent — Opays Tech",
      description:
        "Un site rapide, visible sur Google et pensé pour convertir. Audit, design, développement et référencement : votre site devient votre meilleur commercial.",
    }),
});
