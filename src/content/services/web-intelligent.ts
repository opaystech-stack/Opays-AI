import { Gauge, Languages, Search, Smartphone, ShieldCheck, TrendingUp } from "lucide-react";
import type { ServiceContent } from "@/components/marketing/ServicePage";
import { MOMENT_NOW } from "./_shared";

/**
 * Page « Web intelligent » (création de site web) — reformulée d'après la page
 * de référence (smarttechgenius.com/web-intelligent), adaptée au positionnement
 * Opays Tech (efficience, IA, souveraineté et exécution locale). Contenu
 * rephrasé pour conformité avec les restrictions de licence ; données
 * nominatives anonymisées.
 */
export const WEB_INTELLIGENT: ServiceContent = {
  hero: {
    badge: "Service premium",
    title: "Votre site n'est plus une vitrine.",
    highlight: "C'est votre meilleur commercial.",
    lead: "Pendant que vous lisez ces lignes, vous perdez des clients — et ce n'est ni votre produit ni votre prix qui sont en cause.",
    paragraphs: [
      "C'est votre site qui ne fait pas son travail. Il charge trop lentement, n'apparaît pas sur Google et ne convertit pas. Il ressemble à un site d'il y a dix ans pendant que vos concurrents ont pris une longueur d'avance.",
      "Un site lent, invisible et daté coûte cher, chaque jour, sans que vous le voyiez sur une seule ligne de votre comptabilité.",
    ],
    ctaLabel: "Réserver mon diagnostic gratuit",
  },
  stats: {
    eyebrow: "Le constat",
    title: "Ce que votre site vous coûte vraiment",
    lead: "Quelques repères de marché que la plupart des dirigeants découvrent en regardant leurs analytics de près.",
    stats: [
      {
        value: "53 %",
        label: "des visiteurs quittent un site qui met plus de trois secondes à charger.",
      },
      { value: "75 %", label: "jugent votre crédibilité d'après le design de votre site." },
      { value: "68 %", label: "des expériences en ligne commencent sur un moteur de recherche." },
      { value: "61 %", label: "de conversions perdues sur les sites mal optimisés pour mobile." },
    ],
    consequencesTitle: "Concrètement, pour vous",
    consequences: [
      "Un visiteur sur deux perdu avant même de voir votre offre.",
      "Un site daté qui entame la confiance instantanément.",
      "Sans référencement, vous n'existez pas pour 7 prospects sur 10.",
      "Vos visiteurs sur smartphone qui partent ailleurs.",
    ],
    costTitle: "Le calcul rapide",
    costText:
      "Si votre activité génère 100 000 $ par an et que votre site convertit 30 % moins bien qu'il ne le devrait, vous laissez environ 30 000 $ sur la table — chaque année, sans rien faire de plus que d'attendre.",
  },
  pillars: {
    eyebrow: "Notre approche",
    title: "Un site rapide, visible et taillé pour convertir",
    lead: "Nous construisons un actif web performant, maîtrisable par vos équipes et pérenne dans le temps.",
    pillars: [
      {
        icon: Gauge,
        title: "Vitesse extrême",
        text: "Un chargement sous 1,5 seconde, parce que chaque seconde gagnée retient des visiteurs et améliore vos conversions.",
      },
      {
        icon: Search,
        title: "Visible sur Google",
        text: "Architecture et contenus optimisés pour viser le top 10 sur vos mots-clés stratégiques, plutôt que de rester invisible.",
      },
      {
        icon: TrendingUp,
        title: "Pensé pour convertir",
        text: "Parcours et appels à l'action conçus pour transformer le trafic en demandes, avec des taux visés de 3 à 8 % et plus.",
      },
      {
        icon: Smartphone,
        title: "Mobile natif",
        text: "Une expérience fluide sur smartphone, là où la majorité de votre audience vous découvre désormais.",
      },
      {
        icon: ShieldCheck,
        title: "Sécurisé et maîtrisé",
        text: "Protection avancée, surveillance continue et interface simple pour mettre à jour le site en toute autonomie.",
      },
      {
        icon: Languages,
        title: "Bilingue et pérenne",
        text: "Site bilingue FR/EN et architecture modulaire, prête à évoluer sans refonte tous les deux ou trois ans.",
      },
    ],
  },
  comparison: {
    eyebrow: "La différence",
    title: "Site classique vs Web intelligent",
    lead: "Le même budget, deux résultats incomparables.",
    badLabel: "Site classique",
    goodLabel: "Web intelligent Opays Tech",
    rows: [
      { criterion: "Vitesse de chargement", bad: "5 à 8 secondes", good: "moins de 1,5 seconde" },
      {
        criterion: "Position sur Google",
        bad: "page 5 ou inexistante",
        good: "top 10 visé sur vos mots-clés",
      },
      { criterion: "Taux de conversion", bad: "0,5 à 1,5 %", good: "3 à 8 % et au-delà" },
      { criterion: "Expérience mobile", bad: "approximative", good: "native et fluide" },
      {
        criterion: "Mises à jour",
        bad: "cauchemar technique",
        good: "interface simple, autonomie totale",
      },
      {
        criterion: "Sécurité",
        bad: "failles régulières",
        good: "protection avancée et surveillance 24/7",
      },
      { criterion: "Multilingue FR/EN", bad: "souvent absent", good: "intégré nativement" },
      {
        criterion: "Évolutivité",
        bad: "refonte tous les 2 à 3 ans",
        good: "architecture pérenne et modulaire",
      },
    ],
  },
  method: {
    eyebrow: "Notre méthode",
    title: "Cinq étapes. Aucune surprise. Que des résultats.",
    lead: "Pas de jargon, pas de dépassement, pas de retard caché. Chaque étape a un livrable clair.",
    steps: [
      {
        title: "Audit",
        duration: "1 semaine",
        text: "Analyse de votre marché, de vos concurrents et de votre cible, puis document de stratégie avec arborescence, mots-clés et plan d'action.",
      },
      {
        title: "Design",
        duration: "2 semaines",
        text: "Conception des maquettes et de l'identité visuelle, centrées sur la clarté, la confiance et la conversion, validées avant développement.",
      },
      {
        title: "Développement",
        duration: "3 à 6 semaines",
        text: "Construction d'un site rapide, sécurisé et modulaire, avec intégration de vos contenus et de vos outils.",
      },
      {
        title: "Tests et référencement",
        duration: "1 semaine",
        text: "Optimisation technique, tests sur appareils réels et préparation SEO pour un lancement propre et visible.",
      },
      {
        title: "Lancement",
        duration: "+ 90 jours de suivi",
        text: "Mise en ligne accompagnée, mesure des performances et ajustements pendant les trois premiers mois.",
      },
    ],
  },
  timeline: {
    eyebrow: "Vos gains",
    title: "Ce que vous y gagnez, concrètement",
    lead: "Pas de promesses vagues. Voici ce que constatent les entreprises, mois après mois.",
    phases: [
      {
        period: "0 à 3 mois",
        title: "Gains immédiats",
        text: "Le site est en ligne, performant, et les premières demandes commencent à arriver.",
        benefits: [
          "Temps moyen sur le site en hausse de 30 à 50 %.",
          "Récupération d'environ 60 % du trafic mobile perdu.",
          "Premières conversions dès le premier mois.",
          "Analytics enfin lisibles et exploitables.",
        ],
      },
      {
        period: "3 à 6 mois",
        title: "Croissance organique",
        text: "Le référencement commence à porter ses fruits et le pipeline commercial se remplit de lui-même.",
        benefits: [
          "Trafic organique en hausse de 150 à 400 %.",
          "Première page Google sur les mots-clés ciblés.",
          "Coût d'acquisition fortement réduit.",
          "Cycle de vente raccourci.",
        ],
      },
      {
        period: "6 à 12 mois",
        title: "Actif stratégique",
        text: "Votre site n'est plus une dépense : c'est un actif qui prend de la valeur chaque jour.",
        benefits: [
          "Autorité reconnue dans votre secteur.",
          "Retour sur investissement clairement établi.",
          "Indépendance vis-à-vis des plateformes payantes.",
          "Capacité d'évolution illimitée.",
        ],
      },
    ],
    roiNote:
      "Sur 12 mois, nos clients constatent un retour sur investissement compris entre 3 et 8 fois le coût initial. Le site devient rentable en moyenne entre le quatrième et le septième mois.",
  },
  caseStudy: {
    eyebrow: "Étude de cas",
    title: "Cabinet de services professionnels, 12 collaborateurs",
    profileTitle: "Profil client",
    profile:
      "Cabinet de services professionnels de 12 collaborateurs, site obsolète depuis plusieurs années et quasi aucune visibilité sur Google.",
    actionsTitle: "Ce que nous avons fait",
    actions:
      "Refonte complète sur une stack moderne, stratégie de référencement sur 25 mots-clés à fort potentiel local, blog avec calendrier éditorial, prise de rendez-vous en ligne et tableau de bord analytics sur mesure.",
    metrics: [
      { label: "Temps de chargement", value: "−87 %" },
      { label: "Trafic mensuel", value: "+660 %" },
      { label: "Leads par mois", value: "+292 %" },
      { label: "Taux de conversion", value: "× 4,2" },
    ],
    quote:
      "On savait notre site dépassé, mais pas qu'il nous coûtait autant. En moins d'un an, le retour sur investissement est devenu évident. C'est devenu notre meilleur commercial, celui qui ne dort jamais.",
    author: "Directrice générale, cabinet de services professionnels",
  },
  faq: {
    eyebrow: "Vos questions",
    title: "« Oui, mais… » — nos réponses",
    items: [
      {
        q: "Combien coûte un site web professionnel ?",
        a: "C'est un investissement, pas une dépense. La majorité de nos clients l'amortissent entre le quatrième et le septième mois ; au-delà, c'est du chiffre d'affaires supplémentaire chaque mois. Des paiements échelonnés sont possibles.",
      },
      {
        q: "On a déjà un site, faut-il vraiment tout refaire ?",
        a: "Pas systématiquement. Nous commençons par un audit : si une optimisation ciblée suffit, nous le disons. Mais quand la performance, le référencement et la sécurité plafonnent, une refonte coûte moins cher que l'inaction.",
      },
      {
        q: "Combien de temps prend la création d'un site ?",
        a: "En général de six à dix semaines entre l'audit et la mise en ligne, selon l'ampleur du contenu, les fonctionnalités et le nombre de pages à produire.",
      },
      {
        q: "Et après le lancement, sommes-nous livrés à nous-mêmes ?",
        a: "Non. Nous assurons un suivi de 90 jours après la mise en ligne, et l'interface est pensée pour que vous mettiez le site à jour en toute autonomie, sans dépendre de nous au quotidien.",
      },
      {
        q: "Proposez-vous des sites bilingues FR/EN ?",
        a: "Oui, le bilinguisme FR/EN est intégré nativement à l'architecture, avec un référencement pensé pour chaque langue plutôt qu'une traduction posée par-dessus.",
      },
      {
        q: "Quelles technologies utilisez-vous ?",
        a: "Des technologies web modernes, rapides et pérennes, choisies pour la performance, la sécurité et la maîtrise dans le temps — y compris en exécution locale lorsque la souveraineté l'exige.",
      },
    ],
  },
  finalCta: MOMENT_NOW,
};
