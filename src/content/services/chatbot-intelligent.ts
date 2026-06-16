import {
  Clock,
  Globe,
  Infinity as InfinityIcon,
  MessagesSquare,
  Sparkles,
  Target,
} from "lucide-react";
import type { ServiceContent } from "@/components/marketing/ServicePage";
import { MOMENT_NOW } from "./_shared";

/**
 * Page « Chatbot intelligent » — reformulée d'après la page de référence
 * (smarttechgenius.com/chatbot-intelligent), adaptée au positionnement Opays
 * Tech (efficience, IA, souveraineté et exécution locale). Contenu rephrasé
 * pour conformité avec les restrictions de licence ; données nominatives
 * anonymisées.
 */
export const CHATBOT_INTELLIGENT: ServiceContent = {
  hero: {
    badge: "Service premium",
    title: "Votre meilleur vendeur",
    highlight: "ne dort jamais, et parle 50 langues.",
    lead: "Pendant que vous lisez ces lignes, la plupart des clients qui posent une question hors heures d'ouverture ne reviennent jamais.",
    paragraphs: [
      "Pendant que vous dormez, vos concurrents répondent. Pendant votre pause, vos prospects s'en vont. Chaque minute sans réponse, c'est une vente potentielle qui s'évapore.",
      "Embaucher du personnel disponible jour et nuit n'est ni rentable ni réaliste. Un chatbot intelligent, lui, répond toujours, instantanément.",
    ],
    ctaLabel: "Réserver mon diagnostic gratuit",
  },
  stats: {
    eyebrow: "Le constat",
    title: "Ce qui se passe vraiment hors de vos horaires",
    lead: "Quelques repères de marché que la plupart des dirigeants découvrent en regardant leurs statistiques de près.",
    stats: [
      { value: "78 %", label: "des clients attendent une réponse en moins de dix minutes." },
      {
        value: "67 %",
        label:
          "des conversations clients pourraient être traitées par un chatbot, libérant vos équipes pour les cas complexes.",
      },
      {
        value: "55 %",
        label:
          "des leads se perdent simplement parce que personne n'est disponible pour répondre tout de suite.",
      },
      {
        value: "× 5",
        label:
          "de leads qualifiés en plus sur les sites équipés d'un chatbot intelligent face à un site classique.",
      },
    ],
    consequencesTitle: "Concrètement, pour vous",
    consequences: [
      "Des prospects qui partent faute de réponse immédiate.",
      "Une équipe submergée par les questions répétitives.",
      "Des ventes perdues en dehors des heures de bureau.",
      "Une expérience client inégale selon le moment.",
    ],
    costTitle: "La réalité brutale",
    costText:
      "Avec 100 demandes par mois hors horaires et 60 % qui ne reviennent jamais, ce sont environ 720 prospects perdus chaque année. À un taux de conversion de 10 %, cela représente 72 clients qui n'arriveront jamais. Combien valent-ils pour vous ?",
  },
  pillars: {
    eyebrow: "Notre approche",
    title: "Un chatbot qui vend, qualifie et soulage vos équipes",
    lead: "Nous concevons un assistant disponible en permanence, intégré à vos outils et maîtrisé de bout en bout.",
    pillars: [
      {
        icon: Clock,
        title: "Disponible 24/7",
        text: "Réponses en moins de deux secondes, jour et nuit, toute l'année, sans jamais laisser un message sans suite.",
      },
      {
        icon: Globe,
        title: "Plus de 50 langues",
        text: "Votre audience est servie dans sa langue, ouvrant une expansion multilingue sans nouveaux recrutements.",
      },
      {
        icon: Target,
        title: "Qualification automatique",
        text: "Le bot score les prospects, prend des rendez-vous et transmet à vos commerciaux des leads déjà préparés.",
      },
      {
        icon: MessagesSquare,
        title: "Branché à vos canaux",
        text: "Site, messageries et applications métier : un même assistant connecté à votre CRM, votre catalogue et votre agenda.",
      },
      {
        icon: Sparkles,
        title: "Qualité constante",
        text: "Une réponse fiable et homogène à chaque échange, sans variation d'humeur ni baisse de régime.",
      },
      {
        icon: InfinityIcon,
        title: "Capacité illimitée",
        text: "Des milliers de conversations simultanées, là où un agent humain n'en mène qu'une seule à la fois.",
      },
    ],
  },
  comparison: {
    eyebrow: "La différence",
    title: "Service client traditionnel vs chatbot intelligent",
    lead: "La vraie différence, exprimée en chiffres.",
    badLabel: "Service client traditionnel",
    goodLabel: "Chatbot intelligent Opays Tech",
    rows: [
      {
        criterion: "Disponibilité",
        bad: "heures de bureau seulement",
        good: "24h/24, 7j/7, toute l'année",
      },
      {
        criterion: "Temps de réponse",
        bad: "de plusieurs heures à plusieurs jours",
        good: "moins de deux secondes",
      },
      {
        criterion: "Coût mensuel",
        bad: "3 000 à 5 000 $ pour un employé",
        good: "forfait à partir de 200 $/mois",
      },
      { criterion: "Capacité simultanée", bad: "une conversation par personne", good: "illimitée" },
      { criterion: "Langues prises en charge", bad: "1 à 2 langues", good: "plus de 50 langues" },
      {
        criterion: "Qualité de service",
        bad: "variable selon l'humeur",
        good: "constante, en permanence",
      },
      { criterion: "Qualification des leads", bad: "manuelle", good: "automatique, avec scoring" },
      {
        criterion: "Évolution",
        bad: "formation continue à prévoir",
        good: "apprentissage permanent",
      },
    ],
  },
  method: {
    eyebrow: "Notre méthode",
    title: "Cinq étapes. Aucune surprise. Que des résultats.",
    lead: "Pas de jargon, pas de dépassement, pas de retard caché. Chaque étape a un livrable clair.",
    steps: [
      {
        title: "Audit des besoins",
        duration: "3 à 5 jours",
        text: "Analyse de vos cas d'usage, de vos questions fréquentes et de vos objectifs commerciaux, puis définition du périmètre et des intégrations.",
      },
      {
        title: "Conception",
        duration: "1 semaine",
        text: "Conception des parcours de conversation, du ton et des scénarios clés, validés avec vous avant tout entraînement.",
      },
      {
        title: "Entraînement IA",
        duration: "1 à 2 semaines",
        text: "Le bot apprend de vos contenus et de vos données métier pour répondre avec précision et dans votre voix de marque.",
      },
      {
        title: "Intégrations",
        duration: "1 semaine",
        text: "Connexion à votre CRM, votre catalogue, votre agenda et vos canaux de discussion, avec tests sur cas réels.",
      },
      {
        title: "Lancement",
        duration: "en continu",
        text: "Mise en ligne, supervision des conversations et ajustements réguliers pour gagner en précision et en naturel.",
      },
    ],
  },
  timeline: {
    eyebrow: "Vos gains",
    title: "Ce que vous y gagnez, concrètement",
    lead: "Pas de promesses vagues. Voici ce que constatent les entreprises, mois après mois.",
    phases: [
      {
        period: "0 à 1 mois",
        title: "Impact immédiat",
        text: "Dès la mise en ligne, votre service client change de dimension : plus aucun message ne reste sans réponse.",
        benefits: [
          "100 % des questions reçoivent une réponse instantanée.",
          "Capture des leads hors heures de bureau.",
          "Charge de l'équipe allégée d'environ 60 %.",
          "Premiers rendez-vous pris automatiquement par le bot.",
        ],
      },
      {
        period: "1 à 3 mois",
        title: "Optimisation",
        text: "Le bot s'affine, apprend de vos données et devient de plus en plus précis et naturel dans ses échanges.",
        benefits: [
          "Précision IA portée au-delà de 95 %.",
          "Leads qualifiés multipliés par 3 à 5.",
          "Coût d'acquisition client réduit d'environ 40 %.",
          "Détection des points de friction sur votre offre.",
        ],
      },
      {
        period: "3 à 12 mois",
        title: "Avantage stratégique",
        text: "Votre chatbot devient un actif central de l'activité, source de données comme de revenus.",
        benefits: [
          "Première source de leads pour vos commerciaux.",
          "Insights stratégiques sur les besoins clients.",
          "Expansion multilingue sans nouveaux recrutements.",
          "Satisfaction client notée au plus haut.",
        ],
      },
    ],
    roiNote:
      "Un assistant conversationnel bien déployé génère typiquement plusieurs fois son coût dès la première année. Ce n'est pas une dépense de support, mais un canal commercial qui travaille en continu et s'amortit souvent en quelques mois.",
  },
  caseStudy: {
    eyebrow: "Étude de cas",
    title: "E-commerce mode, 8 collaborateurs",
    profileTitle: "Profil client",
    profile:
      "Boutique en ligne de mode, 8 collaborateurs, environ 2 500 visites par jour. Service client débordé et ventes perdues en dehors des heures d'ouverture.",
    actionsTitle: "Ce que nous avons fait",
    actions:
      "Chatbot multilingue (FR/EN) sur le site et la messagerie, connecté à la boutique, à l'agenda de showroom et au CRM. Capable de conseiller, suivre les commandes, gérer les retours et prendre des rendez-vous.",
    metrics: [
      { label: "Conversions", value: "+247 %" },
      { label: "Économies / an", value: "84 000 $" },
      { label: "Précision IA", value: "92 %" },
      { label: "Temps de réponse", value: "< 2 s" },
    ],
    quote:
      "On pensait que les chatbots faisaient amateur. Celui-ci est si naturel que la moitié de nos clients ne réalisent pas qu'ils parlent à une IA. Le retour sur investissement a été visible dès le premier mois.",
    author: "Cofondateur, e-commerce mode",
  },
  faq: {
    eyebrow: "Vos questions",
    title: "« Oui, mais… » — nos réponses",
    items: [
      {
        q: "Le chatbot va-t-il remplacer mes employés ?",
        a: "Non, il les libère. Le bot absorbe 60 à 80 % des demandes répétitives ; vos équipes se concentrent sur les cas complexes à forte valeur. Résultat : satisfaction client en hausse et charge mentale en baisse.",
      },
      {
        q: "Le chatbot comprend-il vraiment les questions complexes ?",
        a: "Oui. Il raisonne sur le contexte, garde le fil de la conversation et s'appuie sur vos contenus et vos données. Pour les cas vraiment spécifiques, il transmet proprement à un humain avec l'historique complet.",
      },
      {
        q: "Que se passe-t-il s'il ne sait pas répondre ?",
        a: "Plutôt que d'inventer, il le reconnaît, propose une alternative et bascule vers votre équipe ou un formulaire de contact. Chaque échec devient une donnée d'apprentissage pour la suite.",
      },
      {
        q: "Combien de temps pour mettre en place un chatbot ?",
        a: "Comptez généralement de trois à cinq semaines entre l'audit des besoins et la mise en ligne, selon le nombre de cas d'usage et d'intégrations à connecter.",
      },
      {
        q: "Sur quels canaux peut-il être déployé ?",
        a: "Votre site, vos messageries et la plupart des applications de discussion. Un même assistant peut couvrir plusieurs canaux avec une expérience cohérente.",
      },
      {
        q: "Mes données et celles de mes clients sont-elles protégées ?",
        a: "Oui. Nous privilégions des architectures cloisonnées et conformes, exécutables localement si la souveraineté l'exige. Vos données ne servent pas à entraîner des modèles tiers.",
      },
    ],
  },
  finalCta: MOMENT_NOW,
};
