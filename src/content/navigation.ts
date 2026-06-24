/**
 * Source unique de vérité de la Navigation_Principale et du CTA_Diagnostic.
 *
 * Les six pages publiques du Site_Vitrine et l'appel à l'action unique
 * (libellé défini une seule fois, cible /contact) vivent ici. Toute occurrence
 * du CTA dans le site lit cette constante pour garantir l'unicité du libellé
 * et l'identité stricte (texte et casse) sur toutes les pages.
 *
 * Couvre : Requirements 1.1, 10.1.
 */

export interface NavPage {
  /** URL dédiée et unique de la page. */
  path: string;
  /** Libellé de navigation. */
  label: string;
}

export interface CtaDiagnostic {
  /** Libellé unique, choisi une seule fois. */
  label: string;
  /** Cible : la Page_Contact. */
  target: "/contact";
}

/** Les pages publiques, dans l'ordre de navigation. */
export const PUBLIC_PAGES: NavPage[] = [
  { path: "/", label: "Accueil" },
  { path: "/a-propos", label: "À propos" },
  { path: "/methode", label: "Méthode" },
  { path: "/offres", label: "Offres" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/saas", label: "SaaS" },
  { path: "/souverainete-rd", label: "R&D" },
  { path: "/contact", label: "Contact" },
];

/** Pages publiques secondaires, accessibles depuis le footer mais pas dans la navigation principale. */
export const SECONDARY_PAGES: NavPage[] = [{ path: "/faq", label: "FAQ" }];

/**
 * L'appel à l'action unique du Site_Vitrine, défini une seule fois.
 * Libellé strictement identique sur toutes les pages publiques.
 */
export const CTA_DIAGNOSTIC: CtaDiagnostic = {
  label: "Diagnostic gratuit",
  target: "/contact",
};

/**
 * Les pages de services (gabarit marketing inspiré de la référence), présentées
 * dans un menu déroulant « Services » de la Navigation_Principale. Liste
 * distincte de `PUBLIC_PAGES` pour ne pas affecter la cohérence
 * navigation ↔ métadonnées des six pages principales.
 */
export const SERVICE_PAGES: NavPage[] = [
  { path: "/web-intelligent", label: "Web Intelligent" },
  { path: "/chatbot-intelligent", label: "Chatbot Intelligent" },
  { path: "/automatisation", label: "Automatisation" },
  { path: "/agents-ia", label: "Agents IA" },
  { path: "/integration-ia", label: "Intégration IA" },
  { path: "/consultation-web-et-ia", label: "Consultation Web & IA" },
];
