/**
 * Source unique de vérité des produits SaaS développés par Opays (Page_SaaS).
 *
 * Entre 2 et 12 produits. Chaque produit porte un nom (1 à 60 caractères) et
 * un descriptif de valeur opérationnelle (40 à 300 caractères). La liste
 * inclut au minimum « Opays Nexus » et « Brand Content OS ».
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
    name: "Opays Nexus",
    description:
      "Le système d'exploitation de votre entreprise : un noyau unique qui réunit projets, opérations, base de connaissance et pilotage pour appliquer la même méthode sans erreur.",
    accessUrl: null,
  },
  {
    name: "Brand Content OS",
    description:
      "Une plateforme de contenu de marque pilotée par IA : créez, adaptez par réseau, validez et publiez vos contenus depuis un espace unique, avec ou sans supervision humaine.",
    accessUrl: null,
  },
];
