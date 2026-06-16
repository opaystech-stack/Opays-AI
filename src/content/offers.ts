/**
 * Source unique de vérité des offres productisées d'Opays Tech (Page_Offres).
 *
 * Trois Paliers présentés publiquement sans aucun montant, dans l'ordre
 * croissant d'engagement. Chaque Palier porte un Resume_Offre conforme aux
 * cinq lignes obligatoires d'OPAYS_HQ §9 (problème, solution, bénéfice,
 * accompagnement, prochaine action).
 *
 * Couvre : Requirements 3.1, 4.x, 10.1.
 */

export type OfferTier = "diagnostic" | "systeme" | "transformation";

export type OfferBranch = "FORGE" | "SOVEREIGN";

/**
 * Résumé d'offre structuré selon les cinq lignes obligatoires d'OPAYS_HQ §9.
 * Chaque ligne doit être non vide après normalisation et d'au plus 280 caractères.
 */
export interface ResumeOffre {
  /** Ligne 1 : problème traité. */
  problemeTraite: string;
  /** Ligne 2 : solution proposée. */
  solutionProposee: string;
  /** Ligne 3 : bénéfice opérationnel. */
  beneficeOperationnel: string;
  /** Ligne 4 : niveau d'accompagnement. */
  niveauAccompagnement: string;
  /** Ligne 5 : prochaine action. */
  prochaineAction: string;
}

export interface Offer {
  tier: OfferTier;
  /** Ordre croissant d'engagement : 1, 2, 3. */
  order: number;
  /** Titre public du Palier. */
  title: string;
  /** Description courte affichée sous le titre. */
  description: string;
  /** Branche Opays associée (le cas échéant). */
  branch?: OfferBranch;
  /** Vrai uniquement pour le Palier_Systeme. */
  recommended: boolean;
  /** Vrai uniquement pour le Palier_Diagnostic (porte d'entrée). */
  isEntryPoint: boolean;
  /** Livrables affichés. */
  deliverables: string[];
  /** Résumé en cinq lignes obligatoires. */
  resume: ResumeOffre;
}

/**
 * Les trois Paliers, déjà dans l'ordre croissant d'engagement.
 * Aucun montant tarifaire n'apparaît ici (Requirement 3.2).
 */
export const OFFERS: Offer[] = [
  {
    tier: "diagnostic",
    order: 1,
    title: "Diagnostic d'Efficience",
    description:
      "La porte d'entrée : un audit du terrain et des recommandations chiffrées pour situer vos gisements d'efficience.",
    recommended: false,
    isEntryPoint: true,
    deliverables: [
      "Cartographie des frictions opérationnelles",
      "Chiffrage des coûts cachés et des temps perdus",
      "Recommandations priorisées par retour sur investissement",
      "Feuille de route d'efficience à 90 jours",
    ],
    resume: {
      problemeTraite:
        "Vos processus se sont empilés au fil de la croissance. Vous sentez des pertes de temps et des erreurs, sans pouvoir les chiffrer ni décider où agir en premier.",
      solutionProposee:
        "Nous lisons votre terrain, cartographions vos frictions et chiffrons précisément les coûts cachés, puis nous priorisons les actions par retour sur investissement.",
      beneficeOperationnel:
        "Vous obtenez une vision claire de vos gisements d'efficience et une feuille de route concrète, sans engager de chantier technique prématuré.",
      niveauAccompagnement:
        "Un accompagnement court et cadré : entretiens de terrain, analyse et restitution argumentée avec nos recommandations chiffrées.",
      prochaineAction:
        "Réservez un Diagnostic gratuit pour situer vos priorités et décider de la suite en connaissance de cause.",
    },
  },
  {
    tier: "systeme",
    order: 2,
    title: "Système d'Efficience",
    branch: "FORGE",
    description:
      "Le palier recommandé : conception, déploiement et suivi mensuel des systèmes qui suppriment vos frictions.",
    recommended: true,
    isEntryPoint: false,
    deliverables: [
      "Conception des automatisations métier prioritaires",
      "Déploiement intégré à vos outils existants",
      "Transfert de compétence aux équipes",
      "Suivi mensuel et ajustements continus",
    ],
    resume: {
      problemeTraite:
        "Vous savez où l'argent fuit, mais vos équipes restent absorbées par des tâches répétitives qui freinent votre croissance et fatiguent vos opérations.",
      solutionProposee:
        "Nous concevons et déployons les systèmes d'automatisation qui suppriment ces tâches, intégrés à vos outils, puis nous assurons un suivi mensuel.",
      beneficeOperationnel:
        "Vos équipes regagnent du temps utile, vos flux critiques s'exécutent sans erreur et vos coûts récurrents baissent durablement.",
      niveauAccompagnement:
        "Un accompagnement continu : cadrage, construction, mise en service, transfert de compétence et suivi mensuel des résultats.",
      prochaineAction:
        "Réservez un Diagnostic gratuit pour cadrer le périmètre du système adapté à vos priorités.",
    },
  },
  {
    tier: "transformation",
    order: 3,
    title: "Transformation Souveraine",
    branch: "SOVEREIGN",
    description:
      "Le palier d'indépendance : IA locale, contrôle d'accès par rôles et patrimoine cognitif propriétaire sous votre contrôle.",
    recommended: false,
    isEntryPoint: false,
    deliverables: [
      "Instance d'IA locale opérée en circuit fermé",
      "Contrôle d'accès aux données et aux modèles par rôles (RBAC)",
      "Patrimoine cognitif propriétaire sous contrôle conjoint",
      "Gouvernance et résilience technologique documentées",
    ],
    resume: {
      problemeTraite:
        "Vous voulez tirer parti de l'IA sans confier vos données ni vos savoirs à des infrastructures étrangères que vous ne contrôlez pas.",
      solutionProposee:
        "Nous déployons une IA locale en circuit fermé, restreignons les accès par rôles et capitalisons vos savoirs dans un patrimoine cognitif propriétaire.",
      beneficeOperationnel:
        "Vous gagnez en efficience tout en gardant la maîtrise de vos données, de vos modèles et de votre patrimoine de connaissances.",
      niveauAccompagnement:
        "Un accompagnement approfondi de notre pôle recherche : conception souveraine, déploiement sécurisé et gouvernance des accès.",
      prochaineAction:
        "Réservez un Diagnostic gratuit pour évaluer votre besoin de souveraineté et le périmètre de la transformation.",
    },
  },
];
