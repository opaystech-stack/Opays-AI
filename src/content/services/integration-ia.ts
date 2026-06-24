import { BarChart3, Brain, Cable, Database, Globe, Target } from "lucide-react";
import type { ServiceContent } from "@/components/marketing/ServicePage";
import { MOMENT_NOW } from "./_shared";

/**
 * Page « Intégration IA » — reformulée d'après la page de référence
 * (smarttechgenius.com/integration-ia), adaptée au positionnement Opays Tech
 * (efficience, IA, souveraineté et exécution locale). Contenu rephrasé pour
 * conformité avec les restrictions de licence ; données nominatives anonymisées.
 */
export const INTEGRATION_IA: ServiceContent = {
  hero: {
    badge: "Service premium",
    title: "Vos outils actuels,",
    highlight: "dotés enfin d'un cerveau.",
    lead: "vous payez des dizaines de milliers d'euros de logiciels qui n'exploitent qu'une infime part de l'IA disponible.",
    paragraphs: [
      "Votre CRM regorge de données qu'aucun humain n'a le temps d'exploiter. Vos e-mails contiennent des signaux que personne ne capte. Votre site pourrait personnaliser chaque interaction.",
      "Rien de tout cela n'arrive, parce que vos outils ne « pensent » pas. L'IA, c'est précisément le cerveau qui leur manque — sans changer votre stack.",
    ],
    ctaLabel: "Diagnostic gratuit",
  },
  stats: {
    eyebrow: "Le constat",
    title: "Ce qui dort vraiment dans vos outils",
    lead: "Quelques repères de marché que la plupart des dirigeants découvrent en examinant leurs données de près.",
    stats: [
      {
        value: "92 %",
        label:
          "des données d'entreprise ne sont jamais analysées : elles dorment dans vos outils, inutilisées.",
      },
      {
        value: "60 %",
        label:
          "des prévisions de vente réalisées sans IA s'avèrent fausses ; avec l'IA, on descend sous 15 %.",
      },
      {
        value: "3 à 5 h",
        label:
          "par jour passées par un commercial sur des tâches que l'IA traiterait en quelques secondes.",
      },
      {
        value: "× 4",
        label:
          "de retour sur investissement moyen d'une intégration IA réussie sur les 12 premiers mois (McKinsey).",
      },
    ],
    consequencesTitle: "Concrètement, pour vous",
    consequences: [
      "Des données précieuses jamais exploitées dans vos décisions.",
      "Des prévisions imprécises qui faussent vos arbitrages.",
      "Des heures de vente perdues sur des tâches automatisables.",
      "Un site et des outils qui restent passifs face aux signaux.",
    ],
    costTitle: "Le paradoxe digital",
    costText:
      "Vous avez investi dans la digitalisation et vous disposez d'outils performants. Mais sans IA, vous les utilisez comme des classeurs sophistiqués. L'IA ne remplace pas vos outils : elle décuple leur valeur en exploitant ce qui dort déjà à l'intérieur.",
  },
  pillars: {
    eyebrow: "Notre approche",
    title: "L'intelligence ajoutée à ce que vous avez déjà",
    lead: "Nous injectons de l'IA au cœur de vos outils existants, sans migration forcée ni rupture pour vos équipes.",
    pillars: [
      {
        icon: Cable,
        title: "Sans changer d'outil",
        text: "Nous branchons l'IA sur votre stack actuel via ses interfaces : vos équipes gardent leurs repères, les outils deviennent intelligents.",
      },
      {
        icon: Database,
        title: "Données enfin exploitées",
        text: "Analyse continue de 100 % de vos données plutôt que de quelques échantillons sur tableur, pour des décisions fondées sur le réel.",
      },
      {
        icon: Brain,
        title: "CRM proactif",
        text: "Votre base passive devient un véritable copilote commercial : scoring des leads, next best action, détection des risques de churn.",
      },
      {
        icon: BarChart3,
        title: "Prévisions fiables",
        text: "Des modèles statistiques précis remplacent l'intuition et l'historique, avec une fiabilité visée au-delà de 90 %.",
      },
      {
        icon: Globe,
        title: "Multilingue natif",
        text: "Traduction instantanée et expérience personnalisée par visiteur, sans dépendre de traductions humaines lentes.",
      },
      {
        icon: Target,
        title: "Priorisée par le ROI",
        text: "Nous commençons par les intégrations à plus fort impact, avec un retour chiffré avant tout déploiement à grande échelle.",
      },
    ],
  },
  comparison: {
    eyebrow: "La différence",
    title: "Outils sans IA vs outils augmentés par l'IA",
    lead: "Le même environnement de travail, deux niveaux d'intelligence.",
    badLabel: "Outils sans IA",
    goodLabel: "Outils augmentés par l'IA",
    rows: [
      { criterion: "CRM", bad: "base de données passive", good: "copilote commercial proactif" },
      {
        criterion: "Boîte e-mail",
        bad: "tri manuel chronophage",
        good: "boîte priorisée automatiquement",
      },
      {
        criterion: "Site web",
        bad: "même contenu pour tous",
        good: "expérience personnalisée par visiteur",
      },
      {
        criterion: "Reporting",
        bad: "tableaux statiques mensuels",
        good: "insights en temps réel",
      },
      {
        criterion: "Service client",
        bad: "tickets traités à la main",
        good: "catégorisation et résolution assistées",
      },
      {
        criterion: "Analyse de données",
        bad: "tableur sur quelques échantillons",
        good: "analyse continue de 100 % des données",
      },
      {
        criterion: "Prévisions",
        bad: "intuition et historique",
        good: "modèles précis au-delà de 90 %",
      },
      {
        criterion: "Multilingue",
        bad: "traductions humaines lentes",
        good: "traduction instantanée native",
      },
    ],
  },
  method: {
    eyebrow: "Notre méthode",
    title: "Cinq étapes. Aucune surprise. Que des résultats.",
    lead: "Pas de jargon, pas de dépassement, pas de retard caché. Chaque étape a un livrable clair.",
    steps: [
      {
        title: "Audit IA",
        duration: "1 semaine",
        text: "Cartographie de votre stack technologique, repérage des intégrations IA à fort impact et calcul du retour prévisionnel pour chacune.",
      },
      {
        title: "Priorisation",
        duration: "3 jours",
        text: "Nous classons les intégrations par impact et par effort, puis décidons ensemble du premier cas d'usage à lancer.",
      },
      {
        title: "Preuve de concept",
        duration: "2 à 3 semaines",
        text: "Un POC déployé sur le cas prioritaire, pour valider la valeur de l'IA dans votre contexte avant tout engagement large.",
      },
      {
        title: "Déploiement",
        duration: "2 à 6 semaines",
        text: "Intégration de l'IA dans vos outils principaux, mise en main des équipes et enrichissement progressif des données métier.",
      },
      {
        title: "Optimisation",
        duration: "en continu",
        text: "Suivi des performances, ajustement des modèles et identification de nouveaux cas d'usage à mesure que la maturité progresse.",
      },
    ],
  },
  timeline: {
    eyebrow: "Vos gains",
    title: "Ce que vous y gagnez, concrètement",
    lead: "Pas de promesses vagues. Voici ce que constatent les entreprises, mois après mois.",
    phases: [
      {
        period: "0 à 2 mois",
        title: "Validation rapide",
        text: "Le POC est déployé et délivre les premiers signaux concrets de la valeur de l'IA dans votre contexte.",
        benefits: [
          "Retour sur investissement validé sur le cas prioritaire.",
          "Premiers gains de productivité visibles.",
          "Adhésion des équipes confirmée.",
          "Plan de déploiement à grande échelle prêt.",
        ],
      },
      {
        period: "2 à 6 mois",
        title: "Déploiement",
        text: "L'IA est intégrée à vos outils principaux, utilisée au quotidien, et vos données métier s'enrichissent.",
        benefits: [
          "Productivité commerciale en hausse de 30 à 50 %.",
          "Précision des prévisions multipliée par quatre.",
          "Temps de traitement client divisé par trois.",
          "Nouveaux cas d'usage identifiés en continu.",
        ],
      },
      {
        period: "6 à 18 mois",
        title: "Maturité IA",
        text: "Votre organisation devient pilotée par la donnée et augmentée par l'IA. Vous décidez mieux et plus vite que vos concurrents.",
        benefits: [
          "Toute l'organisation augmentée par l'IA.",
          "Prise de décision 5 à 10 fois plus rapide.",
          "Avantage compétitif structurel acquis.",
          "Capacité d'innovation décuplée.",
        ],
      },
    ],
    roiNote:
      "Selon McKinsey, une intégration IA réussie génère un retour moyen de 4 fois la mise sur 12 mois. Sur 24 mois, ce chiffre atteint 10 à 15 fois pour les early adopters dans la plupart des secteurs.",
  },
  caseStudy: {
    eyebrow: "Étude de cas",
    title: "Distributeur B2B, 80 collaborateurs",
    profileTitle: "Profil client",
    profile:
      "Distributeur B2B de matériel industriel, 80 collaborateurs, CRM déjà en place mais sous-exploité. Équipe commerciale de 18 personnes, prévisions de ventes très imprécises.",
    actionsTitle: "Ce que nous avons fait",
    actions:
      "Intégration de l'IA dans le CRM existant : scoring automatique des leads, prédiction de closing, suggestions de next best action, résumés d'appels et détection des risques de churn. Aucun changement d'outil pour les utilisateurs.",
    metrics: [
      { label: "Taux de conversion", value: "+47 %" },
      { label: "Précision des prévisions", value: "+62 %" },
      { label: "Temps admin commercial", value: "−35 %" },
      { label: "ROI sur 12 mois", value: "× 6" },
    ],
    quote:
      "On utilisait notre CRM à 30 % de son potentiel depuis cinq ans. En y injectant de l'IA, on a révélé toute la valeur dormante, sans changer d'outil pour les équipes, mais avec des résultats incomparables.",
    author: "Directeur commercial, distributeur B2B",
  },
  faq: {
    eyebrow: "Vos questions",
    title: "« Oui, mais… » — nos réponses",
    items: [
      {
        q: "Dois-je changer mes outils actuels pour intégrer de l'IA ?",
        a: "Non, c'est tout l'intérêt de l'approche. Nous travaillons avec votre stack existant : la plupart des solutions du marché exposent des interfaces qui permettent l'intégration IA. Vos équipes gardent leurs outils, qui deviennent simplement intelligents.",
      },
      {
        q: "Quelles données de l'entreprise sont nécessaires ?",
        a: "Essentiellement celles que vous produisez déjà : historique CRM, e-mails, documents, transactions. Nous partons de l'existant et n'ajoutons de la collecte que si un cas d'usage prioritaire le justifie.",
      },
      {
        q: "Combien de temps prend une intégration IA ?",
        a: "Un premier POC est généralement opérationnel en 2 à 3 semaines, puis le déploiement dans vos outils principaux s'étale sur 2 à 6 semaines selon le périmètre et le nombre d'intégrations.",
      },
      {
        q: "Par quoi commencer pour une intégration IA ?",
        a: "Les meilleurs candidats combinent fort volume de données et impact business direct : scoring de leads, prévisions de vente, priorisation des e-mails, résumés automatiques. Nous les hiérarchisons lors de l'audit.",
      },
      {
        q: "Mon équipe devra-t-elle apprendre à utiliser l'IA ?",
        a: "Le moins possible. L'IA s'intègre dans les outils que vos équipes connaissent déjà ; l'intelligence opère en arrière-plan. La prise en main se limite le plus souvent à quelques nouvelles habitudes.",
      },
      {
        q: "Comment mesurer le retour de l'intégration IA ?",
        a: "Nous fixons des indicateurs chiffrés dès le cadrage — conversion, précision des prévisions, temps gagné — et nous les suivons après déploiement pour démontrer le retour de façon objective.",
      },
    ],
  },
  finalCta: MOMENT_NOW,
};
