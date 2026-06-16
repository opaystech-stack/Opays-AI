import { createFileRoute } from "@tanstack/react-router";
import { buildPageMeta } from "@/lib/seo/meta";
import { ServicePage } from "@/components/marketing/ServicePage";
import { CHATBOT_INTELLIGENT } from "@/content/services/chatbot-intelligent";

export const Route = createFileRoute("/_public/chatbot-intelligent")({
  component: () => <ServicePage content={CHATBOT_INTELLIGENT} />,
  head: () =>
    buildPageMeta({
      path: "/chatbot-intelligent",
      title: "Chatbot intelligent 24/7 — Opays Tech",
      description:
        "Un assistant conversationnel disponible jour et nuit qui répond, qualifie vos prospects et prend des rendez-vous. Diagnostic gratuit Opays Tech.",
    }),
});
