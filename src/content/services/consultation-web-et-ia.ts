import { Compass, FileSearch, Map, ShieldAlert, Target, Wallet } from "lucide-react";
import type { ServiceContent } from "@/components/marketing/ServicePage";
import { MOMENT_NOW } from "./_shared";

/**
 * Page « Consultation Web et IA » — reformulée d'après la page de référence
 * (smarttechgenius.com/consultation-web-et-ia), adaptée au positionnement Opays
 * Tech (efficience, IA, souveraineté et exécution locale). Contenu rephrasé
 * pour conformité avec les restrictions de licence ; données nominatives
 * anonymisées.
 */
export const CONSULTATION_WEB_IA: ServiceContent = {
  hero: {
    badge: "Service premium",
    title: "Avant d'engager un budget significatif,",
    highlight: "parlez-en une heure avec quelqu'un qui sait.",
    lead: "la pire décision en transformation digitale reste celle qu'on prend seul.",
    paragraphs: [
      "Un concurrent a lancé un site qui marche. On vous parle d'IA partout. Vous lisez des articles contradictoires. Des prestataires proposent des solutions à 30 000, 50 000, un budget significatif. Comment savoir ce qui est juste pour vous ?",
      "Sans une vision claire, chaque euro investi devient un pari. Une heure de cadrage lucide vaut souvent mieux que des mois d'hésitation.",
    ],
    ctaLabel: "Diagnostic gratuit",
  },
  stats: {
    eyebrow: "Le constat",
    title: "Pourquoi tant de projets digitaux échouent",
    lead: "Quelques repères de marché que la plupart des dirigeants découvrent une fois le projet engagé.",
    stats: [
      {
        value: "67 %",
        label:
          "des projets digitaux échouent par manque de stratégie en amont, et non pour un problème technique.",
      },
      {
        value: "78 %",
        label:
          "des entreprises qui investissent dans l'IA sans audit préalable n'obtiennent aucun retour mesurable.",
      },
      {
        value: "× 3",
        label:
          "le surcoût moyen d'un projet web ou IA mal cadré face à un projet bien planifié dès le départ.",
      },
      {
        value: "18 mois",
        label:
          "de retard typique pour une entreprise qui investit dans la mauvaise solution avant de pivoter.",
      },
    ],
    consequencesTitle: "Concrètement, pour vous",
    consequences: [
      "Un budget engagé sur la mauvaise priorité.",
      "Des risques découverts trop tard, en cours de projet.",
      "Des mois perdus à hésiter entre des propositions.",
      "Un retour sur investissement qui n'arrive jamais.",
    ],
    costTitle: "Le coût de la mauvaise décision",
    costText:
      "Investir un budget significatif dans la mauvaise solution finit par en coûter près de un budget significatif : la mise initiale, le coût de remplacement et le manque à gagner pendant 12 à 18 mois. Une consultation à un budget significatif aurait suffi à éviter ce scénario.",
  },
  pillars: {
    eyebrow: "Notre approche",
    title: "De la clarté avant le moindre euro engagé",
    lead: "Nous vous apportons une vision indépendante, fondée sur l'expérience, pour décider juste et investir au bon endroit.",
    pillars: [
      {
        icon: Compass,
        title: "Vision stratégique",
        text: "Une lecture claire de votre situation et de vos options, fondée sur la donnée et l'expérience plutôt que sur l'intuition.",
      },
      {
        icon: Map,
        title: "Roadmap phasée",
        text: "Une feuille de route hiérarchisée qui sépare l'urgent de l'important et séquence le projet par jalons réalistes.",
      },
      {
        icon: Wallet,
        title: "Budget cadré",
        text: "Un chiffrage précis avec scénarios, pour piloter la dépense au lieu de l'estimer au doigt mouillé.",
      },
      {
        icon: ShieldAlert,
        title: "Risques anticipés",
        text: "Les pièges techniques et organisationnels identifiés en amont, plutôt que découverts une fois le budget engagé.",
      },
      {
        icon: Target,
        title: "Choix d'outils objectif",
        text: "Une recommandation fondée sur vos besoins réels, et non sur la publicité ou les avis du moment.",
      },
      {
        icon: FileSearch,
        title: "Indépendance assumée",
        text: "Nous pouvons vous conseiller de ne pas lancer un projet : c'est ce qui garantit l'honnêteté de notre regard.",
      },
    ],
  },
  comparison: {
    eyebrow: "La différence",
    title: "Décider seul vs avec la consultation Opays Tech",
    lead: "La même décision, deux niveaux de maîtrise.",
    badLabel: "Décider seul",
    goodLabel: "Avec la consultation Opays Tech",
    rows: [
      {
        criterion: "Vision stratégique",
        bad: "floue, basée sur l'intuition",
        good: "claire, fondée sur la donnée et l'expérience",
      },
      {
        criterion: "Choix d'outils",
        bad: "selon publicités et avis",
        good: "selon une analyse experte de vos besoins",
      },
      {
        criterion: "Budget alloué",
        bad: "estimation au doigt mouillé",
        good: "cadrage précis avec scénarios",
      },
      {
        criterion: "Priorités",
        bad: "tout urgent, tout important",
        good: "roadmap claire et phasée",
      },
      {
        criterion: "Détection des risques",
        bad: "découverts en cours de projet",
        good: "identifiés et anticipés en amont",
      },
      {
        criterion: "Compétences mobilisées",
        bad: "vos seules ressources internes",
        good: "plus de dix ans d'expérience cumulée",
      },
      {
        criterion: "Délai de décision",
        bad: "plusieurs mois d'hésitation",
        good: "décision éclairée en une semaine",
      },
      {
        criterion: "Coût total du projet",
        bad: "jusqu'à +200 % du budget initial",
        good: "respect du budget cadré",
      },
    ],
  },
  method: {
    eyebrow: "Notre méthode",
    title: "Cinq étapes. Aucune surprise. Que des résultats.",
    lead: "Pas de jargon, pas de dépassement, pas de retard caché. Chaque étape a un livrable clair.",
    steps: [
      {
        title: "Appel découverte",
        duration: "30 min, gratuit",
        text: "Un premier échange pour comprendre votre contexte, vos enjeux et vos objectifs, et décider ensemble si une consultation approfondie a du sens.",
      },
      {
        title: "Audit préparatoire",
        duration: "3 à 5 jours",
        text: "Analyse de votre existant, de votre marché et des options envisagées, pour arriver à la session avec une vue complète.",
      },
      {
        title: "Session stratégique",
        duration: "2 à 4 heures",
        text: "Un travail dense en commun : priorités, scénarios, choix d'outils et premières décisions actionnables.",
      },
      {
        title: "Livrable détaillé",
        duration: "1 semaine",
        text: "Une feuille de route écrite avec recommandations, budget cadré, risques anticipés et plan d'action phasé.",
      },
      {
        title: "Suivi",
        duration: "30 jours",
        text: "Un accompagnement post-consultation pour répondre à vos questions et sécuriser le démarrage de l'exécution.",
      },
    ],
  },
  timeline: {
    eyebrow: "Vos gains",
    title: "Ce que vous y gagnez, concrètement",
    lead: "Pas de promesses vagues. Voici ce que constatent les entreprises, étape après étape.",
    phases: [
      {
        period: "Pendant la consultation",
        title: "Clarté immédiate",
        text: "Dès la session, vous voyez clair : plus de doutes ni d'hésitations, mais une feuille de route concrète.",
        benefits: [
          "Vision stratégique limpide.",
          "Priorités identifiées et hiérarchisées.",
          "Budget cadré avec scénarios.",
          "Premières décisions actionnables prises.",
        ],
      },
      {
        period: "0 à 6 mois",
        title: "Exécution maîtrisée",
        text: "Le projet avance sur des bases solides, sans gaspillage ni dépense mal orientée.",
        benefits: [
          "30 à 50 % d'économies sur le budget projet.",
          "Délais de mise en œuvre divisés par deux.",
          "Retour sur investissement plus rapide et démontrable.",
          "Aucun investissement inutile.",
        ],
      },
      {
        period: "6 à 24 mois",
        title: "Avantage compétitif",
        text: "Pendant que vos concurrents tâtonnent et perdent de l'argent, vous avancez avec méthode. L'écart se creuse.",
        benefits: [
          "Maturité digitale en avance sur le marché.",
          "Capacité à pivoter rapidement validée.",
          "Confiance interne dans la stratégie.",
          "Retour cumulé dépassant 10 fois la mise initiale.",
        ],
      },
    ],
    roiNote:
      "Une consultation de 1 500 à un budget significatif évite typiquement 30 000 à un budget significatif de dépenses mal orientées. C'est l'investissement au meilleur ratio coût/impact que vous ferez cette année.",
  },
  caseStudy: {
    eyebrow: "Étude de cas",
    title: "Services professionnels, 25 collaborateurs",
    profileTitle: "Profil client",
    profile:
      "Entreprise de services B2B de 25 collaborateurs en RDC, en pleine évaluation d'un projet de refonte digitale. Trois prestataires en lice, avec des propositions entre 45 000 et un budget significatif.",
    actionsTitle: "Ce que nous avons fait",
    actions:
      "Consultation stratégique de deux jours : audit complet, analyse des trois propositions, mise au jour des risques cachés et recommandation d'une approche phasée différente, avec une roadmap sur 18 mois au budget optimisé.",
    metrics: [
      { label: "Erreurs évitées", value: "un budget significatif" },
      { label: "Budget final", value: "−58 %" },
      { label: "ROI de la consultation", value: "× 23" },
      { label: "Délai de retour", value: "−12 mois" },
    ],
    quote:
      "On allait signer une proposition à un budget significatif qui ne répondait pas vraiment à nos besoins. La consultation nous a fait comprendre qu'on prenait le problème à l'envers. On a refait toute la stratégie, économisé un budget énorme et obtenu de meilleurs résultats.",
    author: "Dirigeant, services professionnels en RDC",
  },
  faq: {
    eyebrow: "Vos questions",
    title: "« Oui, mais… » — nos réponses",
    items: [
      {
        q: "Pourquoi payer une consultation quand des prestataires offrent des audits gratuits ?",
        a: "Un audit « gratuit » a un objectif : vous vendre une solution. C'est légitime, mais ce n'est pas neutre. Notre consultation est payante précisément pour garantir notre indépendance : nous pouvons vous recommander de ne pas lancer un projet, ou de travailler avec un autre prestataire.",
      },
      {
        q: "Combien coûte une consultation ?",
        a: "Selon l'ampleur, elle se situe généralement entre 1 500 et un budget significatif. C'est sans commune mesure avec les dizaines de milliers d'euros qu'une décision mal orientée peut coûter.",
      },
      {
        q: "Allez-vous forcément essayer de me vendre vos services ?",
        a: "Non. La consultation est un livrable en soi : une stratégie claire que vous restez libre d'exécuter avec qui vous voulez. Notre indépendance est précisément ce qui fait sa valeur.",
      },
      {
        q: "Combien de temps prend la consultation complète ?",
        a: "Comptez environ deux semaines entre l'appel découverte et le livrable détaillé, dont une session stratégique de deux à quatre heures et un audit préparatoire de quelques jours.",
      },
      {
        q: "À qui s'adresse cette consultation ?",
        a: "Aux dirigeants et équipes qui s'apprêtent à investir dans un projet web ou IA et veulent sécuriser leur décision avant d'engager un budget significatif.",
      },
      {
        q: "Que contient exactement le livrable final ?",
        a: "Une feuille de route écrite : recommandations priorisées, budget cadré avec scénarios, risques anticipés et plan d'action phasé, prêt à exécuter par vos soins ou par un prestataire de votre choix.",
      },
    ],
  },
  finalCta: MOMENT_NOW,
};
