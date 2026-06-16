import { Bot, BrainCircuit, Gauge, Layers, ShieldCheck, TrendingUp } from "lucide-react";
import type { ServiceContent } from "@/components/marketing/ServicePage";
import { MOMENT_NOW } from "./_shared";

/**
 * Page « Agents IA » — reformulée d'après la page de référence
 * (smarttechgenius.com/agents-ia), adaptée au positionnement Opays Tech
 * (efficience, IA, souveraineté et exécution locale). Contenu rephrasé pour
 * conformité avec les restrictions de licence ; données nominatives anonymisées.
 */
export const AGENTS_IA: ServiceContent = {
  hero: {
    badge: "Service premium",
    title: "Des collaborateurs numériques",
    highlight: "qui ne s'arrêtent jamais.",
    lead: "Pendant que vous lisez ces lignes, vos concurrents commencent à déployer des agents qui travaillent sans pause, sans congé et sans démission.",
    paragraphs: [
      "Les agents IA ne relèvent plus de la fiction. Ils existent, ils produisent, et ils transforment des organisations entières dans le plus grand silence. La plupart des organisations opérationnelles en RDC pensent encore que l'IA, « c'est pour plus tard ».",
      "Le retard accumulé aujourd'hui deviendra très difficile à combler d'ici deux ans. Plus tard, c'est souvent trop tard.",
    ],
    ctaLabel: "Réserver mon diagnostic gratuit",
  },
  stats: {
    eyebrow: "Le constat",
    title: "Ce qui se joue vraiment dans votre marché",
    lead: "Quelques repères que beaucoup de dirigeants découvrent une fois leurs indicateurs analysés de près.",
    stats: [
      {
        value: "73 %",
        label:
          "des entreprises qui adoptent l'IA agentique obtiennent un avantage compétitif décisif en moins de 12 mois.",
      },
      {
        value: "× 40",
        label:
          "de productivité possible sur des tâches cognitives confiées à un agent IA bien conçu.",
      },
      {
        value: "82 %",
        label:
          "des entreprises sans stratégie IA d'ici 2027 perdraient des parts de marché significatives (Gartner).",
      },
      {
        value: "5 ans",
        label:
          "d'avance estimée pour qui adopte l'IA agentique maintenant, face à ceux qui attendent.",
      },
    ],
    consequencesTitle: "Concrètement, pour vous",
    consequences: [
      "Des prospects qui finissent par aller voir ailleurs.",
      "Des tâches cognitives qui mobilisent vos meilleurs profils.",
      "Un coût de production qui reste élevé, faute d'automatisation.",
      "Un écart de vélocité qui se creuse avec les early adopters.",
    ],
    costTitle: "L'urgence stratégique",
    costText:
      "Les entreprises qui n'auront intégré aucun agent IA d'ici 2027 ne seront pas seulement en retard : elles deviendront structurellement non compétitives. Coût de production divisé par dix, vélocité multipliée par cinq — un écart de ce type ne se rattrape pas facilement.",
  },
  pillars: {
    eyebrow: "Notre approche",
    title: "Des agents utiles, fiables et sous contrôle",
    lead: "Nous déployons des agents IA qui exécutent un travail réel, intégrés à vos outils et maîtrisables de bout en bout.",
    pillars: [
      {
        icon: Bot,
        title: "Agents qui agissent",
        text: "Au-delà de la conversation, nos agents exécutent des tâches concrètes : recherche, analyse, rédaction, mise à jour de vos systèmes.",
      },
      {
        icon: BrainCircuit,
        title: "Mémoire et raisonnement",
        text: "Mémoire long terme persistante et planification multi-étapes, pour traiter des cas métier complexes plutôt que de simples FAQ.",
      },
      {
        icon: Layers,
        title: "Branchés à votre stack",
        text: "Connexion à vos API, bases de données, CRM et sources externes, sans réinventer votre socle existant.",
      },
      {
        icon: ShieldCheck,
        title: "Garde-fous intégrés",
        text: "Contrôles, validations et limites claires encadrent chaque action de l'agent, exécutable localement si nécessaire.",
      },
      {
        icon: Gauge,
        title: "Amélioration continue",
        text: "Les agents apprennent de l'usage et gagnent en précision, sous votre supervision, au fil des semaines.",
      },
      {
        icon: TrendingUp,
        title: "Valeur mesurable",
        text: "Nous priorisons les cas d'usage à fort retour, pour transformer l'activité plutôt que faire de simples économies.",
      },
    ],
  },
  comparison: {
    eyebrow: "La différence",
    title: "Chatbot classique vs agent IA Opays Tech",
    lead: "La vraie différence, exprimée en capacités concrètes.",
    badLabel: "Chatbot classique",
    goodLabel: "Agent IA Opays Tech",
    rows: [
      {
        criterion: "Type d'interaction",
        bad: "réponses scriptées",
        good: "conversation complète et contextuelle",
      },
      {
        criterion: "Capacité à agir",
        bad: "se limite à répondre",
        good: "exécute des tâches concrètes",
      },
      { criterion: "Mémoire", bad: "limitée à la session", good: "long terme, persistante" },
      { criterion: "Outils mobilisés", bad: "aucun", good: "API, bases de données, CRM, web" },
      { criterion: "Raisonnement", bad: "statique", good: "planification multi-étapes" },
      { criterion: "Apprentissage", bad: "figé", good: "amélioration continue" },
      { criterion: "Cas d'usage", bad: "FAQ basique", good: "processus métier complexes" },
      {
        criterion: "Valeur générée",
        bad: "économies modestes",
        good: "transformation de l'activité",
      },
    ],
  },
  method: {
    eyebrow: "Notre méthode",
    title: "Cinq étapes. Aucune surprise. Que des résultats.",
    lead: "Pas de jargon, pas de dépassement, pas de retard caché. Chaque étape a un livrable clair.",
    steps: [
      {
        title: "Cas d'usage",
        duration: "1 semaine",
        text: "Identification des processus à fort potentiel d'automatisation par agent, étude de faisabilité technique et estimation de l'impact business.",
      },
      {
        title: "Architecture",
        duration: "1 à 2 semaines",
        text: "Conception de l'agent, de ses connexions à vos outils et de ses garde-fous, validée avant tout développement.",
      },
      {
        title: "Développement",
        duration: "3 à 8 semaines",
        text: "Construction de l'agent, intégration à votre stack et aux sources de données, itérations sur cas réels.",
      },
      {
        title: "Tests et garde-fous",
        duration: "2 semaines",
        text: "Mise à l'épreuve sur scénarios sensibles, contrôles de sécurité, limites d'action et procédures de repli.",
      },
      {
        title: "Déploiement",
        duration: "en continu",
        text: "Mise en production progressive, supervision des performances et extension graduelle du périmètre couvert.",
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
        title: "Premiers résultats",
        text: "L'agent est en place sur un cas d'usage précis. Les premiers gains sont déjà nets et visibles.",
        benefits: [
          "Tâches cognitives réduites de 70 à 90 %.",
          "Délai de traitement divisé par 10 à 50.",
          "Disponibilité 24/7 sur le périmètre couvert.",
          "Données et insights immédiatement exploitables.",
        ],
      },
      {
        period: "2 à 6 mois",
        title: "Montée en puissance",
        text: "L'agent s'affine, gère davantage de cas et prend plus de responsabilités. D'autres agents sont déployés.",
        benefits: [
          "Couverture étendue à plusieurs processus.",
          "Précision des décisions au-delà de 95 %.",
          "Retour sur investissement clairement démontrable.",
          "Équipes recentrées sur la stratégie.",
        ],
      },
      {
        period: "6 mois et au-delà",
        title: "Transformation",
        text: "Votre organisation atteint un niveau d'efficacité que vos concurrents n'envisagent même pas.",
        benefits: [
          "Capacité à grandir sans recruter en proportion.",
          "Marges opérationnelles au plus haut.",
          "Avantage compétitif difficile à copier.",
          "Position de référence IA dans votre secteur.",
        ],
      },
    ],
    roiNote:
      "Un agent IA bien déployé génère typiquement 10 à 50 fois son coût sur 12 mois. Ce n'est pas une dépense mais l'un des investissements les plus rentables de la décennie pour qui s'y met dès maintenant.",
  },
  caseStudy: {
    eyebrow: "Étude de cas",
    title: "Cabinet de conseil B2B, 35 consultants",
    profileTitle: "Profil client",
    profile:
      "Cabinet de conseil B2B de 35 consultants et 150 clients actifs. Processus de recherche et d'analyse extrêmement chronophages, recrutements difficiles dans un marché tendu.",
    actionsTitle: "Ce que nous avons fait",
    actions:
      "Déploiement de trois agents : veille de marché, rédaction de rapports et analyse de données client. Intégration profonde au CRM, à la base documentaire et aux sources externes.",
    metrics: [
      { label: "Capacité débloquée", value: "12 ETP" },
      { label: "Vitesse des rapports", value: "× 8" },
      { label: "Précision IA", value: "92 %" },
      { label: "Marge brute", value: "+47 %" },
    ],
    quote:
      "On avait peur du gadget. En réalité, ces agents font le travail qu'on aurait dû confier à une douzaine de personnes. La qualité est constante, la vitesse incomparable, et nos consultants se concentrent enfin sur ce qui exige une vraie intelligence humaine.",
    author: "Associé dirigeant, cabinet de conseil B2B",
  },
  faq: {
    eyebrow: "Vos questions",
    title: "« Oui, mais… » — nos réponses",
    items: [
      {
        q: "Quelle est la différence entre un agent IA et un chatbot ?",
        a: "Un chatbot répond à des questions selon des scénarios figés. Un agent IA raisonne, garde une mémoire, mobilise vos outils et exécute des tâches complètes de bout en bout. L'un informe, l'autre agit à votre place sur des processus réels.",
      },
      {
        q: "Combien coûte un agent IA ?",
        a: "Selon la complexité, la conception se situe généralement entre 10 000 et 100 000 $ et plus. Les coûts d'exploitation varient de quelques centaines à quelques milliers de dollars par mois selon le volume. Le retour se mesure souvent en 3 à 9 mois sur les bons cas d'usage.",
      },
      {
        q: "Les agents IA peuvent-ils commettre des erreurs graves ?",
        a: "Nous encadrons chaque agent par des garde-fous, des validations et des limites d'action claires. Sur les décisions sensibles, l'humain reste dans la boucle et l'agent échoue proprement plutôt que d'agir à l'aveugle.",
      },
      {
        q: "Mes données servent-elles à entraîner l'IA ?",
        a: "Non. Vos données restent les vôtres et ne sont pas utilisées pour entraîner des modèles tiers. Nous privilégions des architectures cloisonnées, exécutables localement lorsque la souveraineté l'exige.",
      },
      {
        q: "Par quel cas d'usage commencer ?",
        a: "Les meilleurs points de départ sont les processus à la fois répétitifs, coûteux en temps cognitif et bien documentés : veille, analyse, rédaction, qualification. Nous les identifions ensemble lors du cadrage initial.",
      },
      {
        q: "Et si la technologie évolue ? Mon agent deviendra-t-il obsolète ?",
        a: "Nous concevons des agents modulaires, dont les modèles et les briques se remplacent sans tout reconstruire. Votre agent suit l'évolution de l'IA plutôt que de la subir.",
      },
    ],
  },
  finalCta: MOMENT_NOW,
};
