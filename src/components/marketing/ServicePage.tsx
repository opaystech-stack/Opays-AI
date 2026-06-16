import {
  ServiceHero,
  BrutalStats,
  Pillars,
  Method,
  CaseStudy,
  Faq,
  FinalCta,
  type ServiceHeroData,
  type BrutalStatsData,
  type PillarsData,
  type ComparisonData,
  type MethodData,
  type TimelineData,
  type CaseStudyData,
  type FaqData,
  type FinalCtaData,
} from "./Sections";

/**
 * Contenu complet d'une page de service. Chaque bloc alimente une section du
 * gabarit. Les blocs optionnels (`pillars`, `comparison`, `caseStudy`) ne sont
 * rendus que s'ils sont fournis, ce qui permet d'adapter la page à chaque
 * service tout en conservant un design et des marges homogènes.
 */
export interface ServiceContent {
  hero: ServiceHeroData;
  stats: BrutalStatsData;
  pillars?: PillarsData;
  comparison?: ComparisonData;
  method: MethodData;
  timeline: TimelineData;
  caseStudy?: CaseStudyData;
  faq: FaqData;
  finalCta: FinalCtaData;
}

/**
 * Gabarit de page service : compose les sections marketing dans l'ordre
 * narratif éprouvé (hero douleur → constat → solution → comparatif → méthode →
 * gains → preuve → objections → urgence).
 */
export function ServicePage({ content }: { content: ServiceContent }) {
  return (
    <>
      <ServiceHero data={content.hero} />
      <BrutalStats data={content.stats} />
      {content.pillars && <Pillars data={content.pillars} />}
      <Method data={content.method} />
      {content.caseStudy && <CaseStudy data={content.caseStudy} />}
      <Faq data={content.faq} />
      <FinalCta data={content.finalCta} />
    </>
  );
}
