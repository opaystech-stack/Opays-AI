import type { FinalCtaData } from "@/components/marketing/Sections";

/**
 * Bloc « Le moment est maintenant » — récurrent sur chaque page de service,
 * reformulé pour Opays Tech. Réutilisé pour garantir une clôture cohérente sur
 * toutes les pages. Le libellé du CTA est le même que sur le reste du site.
 */
export const MOMENT_NOW: FinalCtaData = {
  eyebrow: "Le moment est maintenant",
  title: "Chaque mois d'attente a un coût",
  ifNothingTitle: "Si vous ne faites rien",
  ifNothing: [
    "Des opportunités qui filent chez vos concurrents.",
    "Du temps perdu sur des tâches que l'on pourrait automatiser.",
    "Une efficience opérationnelle qui s'érode mois après mois.",
    "Du chiffre d'affaires laissé sur la table, sans même le voir.",
  ],
  ifStartTitle: "Si vous démarrez maintenant",
  ifStart: [
    "Un déploiement rapide et entièrement maîtrisé.",
    "Des résultats mesurables dès les premières semaines.",
    "Un avantage compétitif qui se creuse dans la durée.",
    "Une équipe qui vous accompagne jusqu'au résultat.",
  ],
  scarcity:
    "Nous limitons volontairement le nombre de nouveaux projets engagés chaque mois pour garantir la qualité de l'accompagnement.",
  ctaLabel: "Diagnostic gratuit",
};
