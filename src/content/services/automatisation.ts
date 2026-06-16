import { Clock, FileText, RefreshCcw, Workflow, Zap, ShieldCheck } from "lucide-react";
import type { ServiceContent } from "@/components/marketing/ServicePage";
import { MOMENT_NOW } from "./_shared";

/**
 * Page « Automatisation » — reformulée d'après la page de référence
 * (smarttechgenius.com/automatisation), adaptée au positionnement Opays Tech
 * (efficience, souveraineté, exécution locale). Contenu rephrasé pour
 * conformité avec les restrictions de licence.
 */
export const AUTOMATISATION: ServiceContent = {
  hero: {
    badge: "Service premium",
    title: "Arrêtez de faire à la main",
    highlight: "ce qu'une machine fait mieux.",
    lead: "Pendant que vous lisez ces lignes, vos équipes font le travail d'un robot — payé au prix d'un humain.",
    paragraphs: [
      "Recopier des données d'un logiciel à l'autre, envoyer les relances une par une, ressaisir dans le CRM, produire les rapports à la main : autant d'heures volées à ce qui compte vraiment, votre opération.",
      "Chaque heure passée sur ces tâches est une heure qui ne sert ni vos clients, ni votre marge, ni vos équipes.",
    ],
    ctaLabel: "Réserver mon diagnostic gratuit",
  },
  stats: {
    eyebrow: "Le constat",
    title: "Ce qui se passe vraiment dans votre entreprise",
    lead: "Quelques repères de terrain que la plupart des dirigeants découvrent en regardant leurs opérations de près.",
    stats: [
      {
        value: "≈ 40 %",
        label: "du temps de travail part dans des tâches répétitives, automatisables.",
      },
      {
        value: "26 000 $",
        label: "perdus en moyenne par employé et par an à cause de tâches manuelles évitables.",
      },
      {
        value: "70 %",
        label: "des erreurs en entreprise proviennent de la saisie manuelle de données.",
      },
      {
        value: "× 10",
        label:
          "plus rapide qu'un humain sur les tâches automatisées : factures, e-mails, rapports.",
      },
    ],
    consequencesTitle: "Concrètement, pour vous",
    consequences: [
      "Des délais de traitement qui s'allongent sans raison.",
      "Des erreurs de saisie qui coûtent cher à corriger.",
      "Des équipes lassées par des tâches sans valeur.",
      "Une capacité de prise en charge bloquée par le manque de temps.",
    ],
    costTitle: "La fuite invisible",
    costText:
      "Pour une équipe de 10 personnes payées 500 $ par mois, 40 % de temps perdu équivaut à environ 24 000 $ de productivité évaporée chaque année. C'est une capacité réelle qui ne sert ni vos clients ni votre marge.",
  },
  pillars: {
    eyebrow: "Notre approche",
    title: "Une automatisation au service de l'efficience",
    lead: "Nous automatisons ce qui doit l'être, sous votre contrôle, sans vous enfermer dans des outils que vous ne maîtrisez pas.",
    pillars: [
      {
        icon: Workflow,
        title: "Cartographie d'abord",
        text: "Nous partons de vos processus réels avant d'automatiser quoi que ce soit. Pas d'automatisation à l'aveugle.",
      },
      {
        icon: Zap,
        title: "Gains rapides",
        text: "Nous priorisons les automatisations à fort retour, pour des résultats visibles dès les premières semaines.",
      },
      {
        icon: RefreshCcw,
        title: "Intégrée à l'existant",
        text: "Nous nous branchons sur vos outils actuels (CRM, comptabilité, e-mail) sans tout réinventer.",
      },
      {
        icon: FileText,
        title: "Reporting automatique",
        text: "Vos rapports se génèrent seuls, en temps réel, à partir d'une source unique de vérité.",
      },
      {
        icon: ShieldCheck,
        title: "Sous votre contrôle",
        text: "Vos données et vos automatisations restent maîtrisées, exécutables localement si nécessaire.",
      },
      {
        icon: Clock,
        title: "Durable",
        text: "Nous suivons et ajustons les automatisations pour qu'elles restent fiables dans le temps.",
      },
    ],
  },
  comparison: {
    eyebrow: "La différence",
    title: "Sans automatisation vs avec Opays Tech",
    lead: "La même entreprise, deux régimes de fonctionnement.",
    badLabel: "Sans automatisation",
    goodLabel: "Avec Opays Tech",
    rows: [
      {
        criterion: "Traitement d'une commande",
        bad: "15 à 30 minutes, à la main",
        good: "≈ 30 secondes, automatisé",
      },
      { criterion: "Erreurs de saisie", bad: "5 à 15 % des dossiers", good: "moins de 0,1 %" },
      {
        criterion: "Disponibilité des processus",
        bad: "heures de bureau",
        good: "24/7, sans interruption",
      },
      { criterion: "Coût par tâche traitée", bad: "20 à 50 $", good: "moins de 1 $" },
      {
        criterion: "Montée en charge",
        bad: "embaucher = délai + coût",
        good: "instantanée et illimitée",
      },
      {
        criterion: "Reporting",
        bad: "manuel, mensuel, en retard",
        good: "temps réel, automatique",
      },
      {
        criterion: "Cohérence des données",
        bad: "variable selon les outils",
        good: "source unique de vérité",
      },
      {
        criterion: "Satisfaction des équipes",
        bad: "frustration, démotivation",
        good: "travail à valeur ajoutée",
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
        text: "Cartographie de vos processus actuels, identification des tâches automatisables, estimation du gain de temps et du retour pour chacune.",
      },
      {
        title: "Priorisation",
        duration: "3 jours",
        text: "Nous classons les automatisations par impact et par effort, et nous décidons ensemble par où commencer.",
      },
      {
        title: "Conception",
        duration: "1 à 2 semaines",
        text: "Nous concevons les automatisations et leurs connexions à vos outils existants, validées avant déploiement.",
      },
      {
        title: "Mise en place",
        duration: "2 à 4 semaines",
        text: "Déploiement progressif, tests sur cas réels, ajustements et formation de vos équipes.",
      },
      {
        title: "Optimisation",
        duration: "en continu",
        text: "Nous suivons les performances, corrigeons les points de friction et étendons le périmètre automatisé.",
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
        title: "Premières victoires",
        text: "Les premières automatisations sont en place, l'équipe commence à respirer, les tâches les plus pénibles disparaissent.",
        benefits: [
          "Environ 30 % de temps en moins sur les tâches administratives.",
          "Élimination des erreurs de saisie les plus courantes.",
          "Premiers rapports générés automatiquement.",
          "Relances clients automatiques activées.",
        ],
      },
      {
        period: "1 à 3 mois",
        title: "Transformation",
        text: "L'automatisation devient un réflexe. Les processus complexes se fluidifient et les équipes se réinvestissent sur la valeur ajoutée.",
        benefits: [
          "60 à 80 % des tâches répétitives automatisées.",
          "Délai de traitement divisé par 5 à 10.",
          "15 à 20 heures récupérées par semaine et par personne.",
          "Erreurs réduites d'environ 95 %.",
        ],
      },
      {
        period: "3 à 12 mois",
        title: "Avantage compétitif",
        text: "Votre entreprise tourne comme une machine bien huilée. Vous absorbez plus de volume sans embaucher en proportion, et vos marges progressent.",
        benefits: [
          "Capacité d'absorber plus de volume sans recruter à due proportion.",
          "Insights opérationnels exploitables en continu.",
          "Marges opérationnelles en hausse.",
          "Avantage difficile à copier pour la concurrence.",
        ],
      },
    ],
    roiNote:
      "Pour une équipe de 10 personnes, l'automatisation libère typiquement 1 500 à 3 000 heures par an. À un coût moyen horaire local, l'impact se mesure vite en capacité retrouvée, avec un investissement souvent amorti en 3 à 6 mois.",
  },
  caseStudy: {
    eyebrow: "Étude de cas",
    title: "Cabinet comptable, 18 collaborateurs",
    profileTitle: "Profil client",
    profile:
      "Cabinet comptable de 18 collaborateurs, environ 350 clients. Processus manuels chronophages : saisie des factures, déclarations, relances clients, reporting interne.",
    actionsTitle: "Ce que nous avons fait",
    actions:
      "Automatisation complète : lecture automatique des factures, synchronisation comptable, relances automatiques, génération mensuelle des rapports clients, intégration aux outils existants.",
    metrics: [
      { label: "Heures économisées / an", value: "1 800 h" },
      { label: "Erreurs de saisie", value: "−95 %" },
      { label: "Capacité clients", value: "+40 %" },
      { label: "Vitesse de traitement", value: "× 6" },
    ],
    quote:
      "On devait embaucher pour absorber plus de volume. À la place, on a automatisé. On traite 40 % de clients en plus avec la même équipe, et tout le monde est moins sous pression.",
    author: "Associé directeur, cabinet comptable",
  },
  faq: {
    eyebrow: "Vos questions",
    title: "« Oui, mais… » — nos réponses",
    items: [
      {
        q: "L'automatisation va-t-elle remplacer mes employés ?",
        a: "Non, elle les libère. Vos équipes détestent les tâches répétitives autant que vous. L'automatisation leur rend du temps pour le conseil, la relation client et la stratégie. Résultat : moins de turnover, plus de motivation.",
      },
      {
        q: "Quels processus peut-on automatiser ?",
        a: "La plupart des tâches répétitives et règlementées : facturation, relances, reporting, saisies, notifications, synchronisations entre outils, formulaires intelligents. Nous identifions les meilleurs candidats lors de l'audit.",
      },
      {
        q: "Combien coûte l'automatisation ?",
        a: "Cela dépend du périmètre. Nous commençons par un audit qui chiffre le gain attendu et le retour sur investissement avant tout engagement. La plupart des projets s'amortissent en quelques mois.",
      },
      {
        q: "Mes outils actuels peuvent-ils être intégrés ?",
        a: "Oui, dans la grande majorité des cas. Nous travaillons avec votre stack existant via ses interfaces, sans imposer un changement d'outil à vos équipes.",
      },
      {
        q: "Que se passe-t-il en cas de panne d'une automatisation ?",
        a: "Nous prévoyons des garde-fous, des alertes et des procédures de repli. Une automatisation surveillée échoue proprement et vous prévient, plutôt que de provoquer une erreur silencieuse.",
      },
    ],
  },
  finalCta: MOMENT_NOW,
};
