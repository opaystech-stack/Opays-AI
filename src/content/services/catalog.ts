import { Bot, Cable, Compass, Globe, MessageSquare, Workflow } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Catalogue des pages de services : source unique alimentant la page Services,
 * la grille de l'accueil et le pied de page. Chaque entrée reste concise
 * (libellé + accroche courte) pour éviter la surcharge de texte.
 */
export interface ServiceCatalogItem {
  path: string;
  label: string;
  tagline: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    path: "/web-intelligent",
    label: "Web Intelligent",
    tagline: "Un site rapide, visible et pensé pour convertir.",
    icon: Globe,
  },
  {
    path: "/chatbot-intelligent",
    label: "Chatbot Intelligent",
    tagline: "Un assistant qui répond et qualifie, jour et nuit.",
    icon: MessageSquare,
  },
  {
    path: "/automatisation",
    label: "Automatisation",
    tagline: "Moins de tâches répétitives, plus de temps utile.",
    icon: Workflow,
  },
  {
    path: "/agents-ia",
    label: "Agents IA",
    tagline: "Des agents qui exécutent vos tâches métier.",
    icon: Bot,
  },
  {
    path: "/integration-ia",
    label: "Intégration IA",
    tagline: "De l'IA dans vos outils, sans tout changer.",
    icon: Cable,
  },
  {
    path: "/consultation-web-et-ia",
    label: "Consultation Web & IA",
    tagline: "Cadrer votre stratégie avant d'investir.",
    icon: Compass,
  },
];
