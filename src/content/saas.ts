/**
 * Source unique de vérité des produits SaaS développés par Opays (Page_SaaS).
 *
 * Entre 2 et 12 produits. Chaque produit porte un nom (1 à 60 caractères) et
 * un descriptif de valeur opérationnelle (40 à 300 caractères). La liste
 * inclut au minimum « Opays Fox » et « Opays Biz ».
 *
 * Couvre : Requirements 8.1, 8.3.
 */

export interface SaasProduct {
  /** Nom du produit (1 à 60 caractères). */
  name: string;
  /** Descriptif de la valeur opérationnelle (40 à 300 caractères). */
  description: string;
  /** Lien d'accès au produit ; null => action repliée sur le CTA_Diagnostic. */
  accessUrl: string | null;
}

export const SAAS_PRODUCTS: SaasProduct[] = [
  {
    name: "Opays Fox",
    description:
      "Solution de trading et d'arbitrage crypto automatisée : bots IA, analyse de marché en temps réel, gestion de portefeuille multi-exchange. Pilotez vos stratégies depuis un tableau de bord unifié.",
    accessUrl: "https://fox.opays.io",
  },
  {
    name: "Opays Biz",
    description:
      "Suite de gestion d'entreprise tout-en-un : facturation, CRM, RH, trésorerie, projets, marketing et agents IA. Le système d'exploitation de votre PME.",
    accessUrl: "https://hq.opays.io",
  },
];
