import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const PptxGenJS = require("C:\\Users\\lamsa\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\pptxgenjs\\dist\\pptxgen.cjs.js");

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(__dirname, "..");
  const outDir = path.join(root, "06_ops");
  const outPptx = path.join(outDir, "opays_investor_pitch.pptx");
  const outMd = path.join(outDir, "opays_investor_pitch_outline.md");
  const summaryPath = path.join(outDir, "opays_investor_model_summary.md");

  const summary = fs.readFileSync(summaryPath, "utf8");

  function getLine(pattern, fallback) {
    const re = new RegExp(pattern, "m");
    const m = summary.match(re);
    return m ? m[1].trim() : fallback;
  }

  const year1Revenue = getLine(/- Year 1 revenue: (.+)/, "ZAR 1,793,550");
  const year1GrossMargin = getLine(/- Year 1 gross margin: (.+)/, "69.5%");
  const year1Ebitda = getLine(/- Year 1 EBITDA: (.+)/, "ZAR 309,855");
  const breakEvenMonth = getLine(/- Break-even month: (.+)/, "4");
  const seedTarget = getLine(/- Recommended seed target: (.+)/, "ZAR 1,200,000");

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Opays Tech";
  pptx.company = "Opays Tech";
  pptx.subject = "Investor pitch deck";
  pptx.title = "Opays Tech — Investor Deck";
  pptx.lang = "fr-FR";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "fr-FR",
  };

  const COLORS = {
  navy: "0F172A",
  slate: "334155",
  accent: "F59E0B",
  blue: "2563EB",
  green: "16A34A",
  light: "F8FAFC",
  line: "CBD5E1",
  text: "111827",
  };

  function addBg(slide) {
    slide.background = { color: COLORS.light };
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.42,
      line: { color: COLORS.navy, transparency: 100 },
      fill: { color: COLORS.navy },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0.42,
      w: 13.333,
      h: 0.08,
      line: { color: COLORS.accent, transparency: 100 },
      fill: { color: COLORS.accent },
    });
  }

  function addHeader(slide, title, subtitle) {
    addBg(slide);
    slide.addText(title, {
      x: 0.6,
      y: 0.65,
      w: 9.2,
      h: 0.45,
      fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: COLORS.navy,
  });
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.62,
        y: 1.08,
        w: 11.8,
        h: 0.28,
        fontFace: "Aptos",
      fontSize: 10.5,
      color: COLORS.slate,
    });
    }
  }

  function addBullets(slide, items, opts = {}) {
    const left = opts.left ?? 0.75;
    const top = opts.top ?? 1.55;
    const w = opts.w ?? 7.2;
    const h = opts.h ?? 4.9;
    slide.addText(
      items.map((item) => ({ text: item, options: { bullet: { indent: 14 }, hanging: 3 } })),
      {
        x: left,
        y: top,
        w,
        h,
      fontFace: "Aptos",
      fontSize: opts.fontSize ?? 17,
      color: COLORS.text,
      breakLine: false,
      margin: 0.03,
        paraSpaceAfterPt: 10,
        valign: "top",
      }
    );
  }

  function addSidebar(slide, title, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.35,
      y: 1.55,
      w: 4.2,
      h: 4.95,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: COLORS.line, pt: 1 },
    shadow: { type: "outer", color: "94A3B8", blur: 1, angle: 45, distance: 1, opacity: 0.12 },
    });
    slide.addText(title, {
      x: 8.6,
      y: 1.78,
      w: 3.7,
      h: 0.25,
    fontFace: "Aptos Display",
    fontSize: 15,
    bold: true,
    color: COLORS.navy,
  });
    slide.addText(
      items.map((item) => ({ text: item, options: { bullet: { indent: 12 }, hanging: 3 } })),
      {
        x: 8.58,
        y: 2.12,
        w: 3.75,
        h: 4.0,
      fontFace: "Aptos",
      fontSize: 11.5,
      color: COLORS.text,
      margin: 0.02,
        paraSpaceAfterPt: 7,
      }
    );
  }

  function addFooter(slide, text) {
    slide.addText(text, {
      x: 0.6,
      y: 7.0,
      w: 12.1,
      h: 0.2,
    fontFace: "Aptos",
    fontSize: 8.5,
    color: COLORS.slate,
    italic: true,
    align: "right",
    });
  }

  // Slide 1 — cover
  {
    const slide = pptx.addSlide();
  slide.background = { color: COLORS.navy };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    line: { color: COLORS.navy, transparency: 100 },
    fill: { color: COLORS.navy },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 6.95,
    w: 13.333,
    h: 0.55,
    line: { color: COLORS.accent, transparency: 100 },
    fill: { color: COLORS.accent },
  });
  slide.addText("Opays Tech", {
    x: 0.85,
    y: 1.05,
    w: 8,
    h: 0.6,
    fontFace: "Aptos Display",
    fontSize: 28,
    bold: true,
    color: "FFFFFF",
  });
  slide.addText("Investor deck — version prudente et opérationnelle", {
    x: 0.86,
    y: 1.82,
    w: 8.5,
    h: 0.35,
    fontFace: "Aptos",
    fontSize: 16,
    color: "E2E8F0",
  });
  slide.addText([
    { text: "Cabinet d’ingénierie de l’efficience", options: { breakLine: true } },
    { text: "Modèle hybride : Forge (cash engine) + Sovereign (autonomy engine)", options: { breakLine: true } },
    { text: "Devise de travail : ZAR | TVA en pass-through | approche conservatrice", options: { breakLine: true } },
  ], {
    x: 0.9,
    y: 2.55,
    w: 10.8,
    h: 1.3,
    fontFace: "Aptos",
    fontSize: 15,
    color: "FFFFFF",
    margin: 0.05,
    paraSpaceAfterPt: 7,
  });
  slide.addText("Opays Tech | dossier préparé pour partenaires, comités et investisseurs", {
    x: 0.9,
    y: 6.45,
    w: 12,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 9,
    color: "E2E8F0",
  });
  }

  // Slide 2
  {
    const slide = pptx.addSlide();
  addHeader(slide, "1. Le problème", "Les PME et structures locales paient souvent la complexité en temps, en marges perdues et en exécution irrégulière.");
  addBullets(slide, [
    "Les équipes manquent de méthode claire pour transformer une intention en livrable.",
    "Les prestations sont souvent vendues comme des heures, pas comme des résultats.",
    "Les outils IA existent, mais restent mal encadrés, donc peu monétisables.",
    "Le client veut de la vitesse, de la fiabilité et des preuves, pas une promesse floue.",
  ]);
  addSidebar(slide, "Ce que cela coûte", [
    "Retards de livraison",
    "Rework et surcharge",
    "Décisions mal documentées",
    "Faible confiance commerciale",
  ]);
  addFooter(slide, "Opays Tech — analyse prudente, sans hypothèses de croissance agressives.");
  }

  // Slide 3
  {
    const slide = pptx.addSlide();
  addHeader(slide, "2. La solution", "Opays Tech structure la livraison, réduit le bruit et convertit les agents IA en système exploitable.");
  addBullets(slide, [
    "Forge : diagnostics, sprints, implementation et retainer pour générer du cash.",
    "Sovereign : travaux stratégiques, recherche premium et autonomie de long terme.",
    "Les skills et agents sont intégrés à une gouvernance lisible, pas utilisés comme gadget.",
    "Chaque mission suit une séquence : cadrage → audit → plan → exécution → vérification.",
  ]);
  addSidebar(slide, "Pourquoi c’est différent", [
    "Cabinet d’ingénierie, pas agence généraliste",
    "Cadence et SOPs",
    "Décisions traçables",
    "Approche compatible investisseurs",
  ]);
  addFooter(slide, "Forge finance la machine. Sovereign la rend durable.");
  }

  // Slide 4
  {
    const slide = pptx.addSlide();
  addHeader(slide, "3. Offres et marge", "Les offres sont productisées pour protéger les marges et éviter la dérive de scope.");
  addBullets(slide, [
    "Audit stratégique / opérationnel : point d’entrée rapide et lisible.",
    "Sprint d’implémentation : livrable à délai court, valeur claire.",
    "Retainer mensuel : continuité, pilotage, amélioration et support.",
    "Sovereign premium : dossiers de fond, recherche et accompagnement à forte valeur.",
  ]);
  addSidebar(slide, "Modèle de marge", [
    `Year 1 revenue: ${year1Revenue}`,
    `Year 1 gross margin: ${year1GrossMargin}`,
    `Year 1 EBITDA: ${year1Ebitda}`,
    `Break-even month: ${breakEvenMonth}`,
  ]);
  addFooter(slide, "Le modèle privilégie la discipline commerciale plutôt que le volume non maîtrisé.");
  }

  // Slide 5
  {
    const slide = pptx.addSlide();
  addHeader(slide, "4. Go-to-market", "Le lancement existe déjà : l’enjeu est maintenant d’ordonner le flux, de le mesurer et de le convertir.");
  addBullets(slide, [
    "LinkedIn company page : contenu, crédibilité, appels à l’action et rendez-vous qualifiés.",
    "Premier wedge académique : recherche, workflow et mémoire documentaire comme preuve de valeur.",
    "Médias locaux : visibilité de marque et confiance de proximité.",
    "Recommandations / partenaires : canal le plus sain pour la marge et la vitesse.",
    "Prospection directe : ciblage de comptes avec besoins explicites.",
  ]);
  addSidebar(slide, "Pipeline à sécuriser", [
    "Traçage des leads par canal",
    "Suivi discovery → audit → proposition → close",
    "Aucune dépendance à une seule source",
    "Mesure du temps de conversion",
  ]);
  addFooter(slide, "Le site et les comptes sociaux sont des actifs de conversion, pas seulement de communication.");
  }

  // Slide 6
  {
    const slide = pptx.addSlide();
  addHeader(slide, "5. Opérations", "La différence entre une idée et une entreprise, c’est la répétabilité.");
  addBullets(slide, [
    "Le modèle intègre le rôle réel de l’équipe : Fénelon sur la vision et la R&D, Prince sur le commercial, Patricia sur la gestion comptable, Zaina sur la communication.",
    "La capacité est dimensionnée pour éviter la surpromesse et le surmenage.",
    "La livraison suit un playbook du lead au retainer.",
    "Les SOPs et la cadence hebdomadaire rendent l’exécution visible.",
    "Le wedge académique sert de terrain de démonstration avant l’extension à d’autres secteurs.",
  ]);
  addSidebar(slide, "Ce que l’investisseur veut voir", [
    "Qui fait quoi",
    "Quel poste reste à pourvoir",
    "Combien de temps par semaine",
    "Comment les priorités se décident",
    "Comment la qualité est contrôlée",
  ]);
  addFooter(slide, "L’opérationnel est le vrai moat.");
  }

  // Slide 7
  {
    const slide = pptx.addSlide();
  addHeader(slide, "6. Équipe, pipeline et plan 90 jours", "Les raffinements demandés sont déjà intégrés au dossier de travail.");
  addBullets(slide, [
    "Team : Fénelon Lamsasiri pilote la vision ; Prince Bagheni pilote le commercial ; Patricia Zamwana porte la gestion comptable ; Zaina Bwale Godlove porte la communication.",
    "Pipeline : LinkedIn, médias locaux, referrals et prospection directe avec conversion attendue et valeur mensuelle.",
    "Wedge : universités et recherche comme premier cas d’usage démonstratif.",
    "90_Day_Plan : 12 semaines de priorités, actions, KPI et livrables.",
    "Pitch_Outline : narratif investisseur aligné sur le modèle financier.",
  ]);
  addSidebar(slide, "Lecture pratique", [
    "Aligner le modèle à l’équipe réelle",
    "Aligner le modèle au pipeline réel",
    "Séparer gouvernance et delivery",
    "Transformer le workbook en présentation",
    "Rester prudent sur les chiffres",
  ]);
  addFooter(slide, "Le but n’est pas de prévoir parfaitement — c’est de piloter sans se mentir.");
  }

  // Slide 8
  {
    const slide = pptx.addSlide();
  addHeader(slide, "7. Modèle financier", "Le dossier reste prudent, lisible et défendable devant des investisseurs.");
  addBullets(slide, [
    `Year 1 revenue: ${year1Revenue}`,
    `Year 1 gross margin: ${year1GrossMargin}`,
    `Year 1 EBITDA: ${year1Ebitda}`,
    `Month 36 ending cash: ZAR 4,131,725`,
  ]);
  addSidebar(slide, "Hypothèses clés", [
    "ZAR comme devise de référence",
    "TVA en pass-through",
    "CIT modélisé à 27%",
    `Seed target recommandé: ${seedTarget}`,
  ]);
  addFooter(slide, "On vise la crédibilité, pas l’embellissement.");
  }

  // Slide 9
  {
    const slide = pptx.addSlide();
  addHeader(slide, "8. Risques et réponses", "Le dossier anticipe les zones d’ombre pour éviter les questions faciles à démonter.");
  addBullets(slide, [
    "Risque de dépendance au fondateur → documentation, rôles et SOPs.",
    "Risque de concentration client → diversification par canal et par offre.",
    "Risque de dérive de scope → offres productisées et garde-fous de livraison.",
    "Risque de trésorerie → modèle conservateur et suivi du cashflow.",
  ]);
  addSidebar(slide, "Réponses attendues", [
    "Pourquoi maintenant ?",
    "Pourquoi vous ?",
    "Pourquoi cette marge ?",
    "Que se passe-t-il si la croissance ralentit ?",
  ]);
  addFooter(slide, "Les investisseurs sérieux apprécient les modèles qui répondent avant d’être interrogés.");
  }

  // Slide 10
  {
    const slide = pptx.addSlide();
  addHeader(slide, "9. Use of funds et prochain pas", "Le financement sert à stabiliser la machine, pas à masquer un manque de clarté.");
  addBullets(slide, [
    "Renforcer la capacité commerciale et la structuration du pipeline.",
    "Sécuriser la production, la qualité et la gouvernance interne.",
    "Transformer les agents / skills en avantage opérationnel concret.",
    "Faire passer le système de “bon dossier” à “machine répétable”.",
  ]);
  addSidebar(slide, "Proposition de séquence", [
    "Valider le pitch deck",
    "Aligner l’équipe sur les rôles",
    "Suivre le pipeline sur 90 jours",
    "Présenter le dossier à partenaires et investisseurs",
  ]);
  addFooter(slide, "Opays Tech — prêt pour la discussion sérieuse.");
  }

  fs.mkdirSync(outDir, { recursive: true });
  await pptx.writeFile({ fileName: outPptx });

  const outline = `# Opays Tech Investor Pitch Outline\n\n` +
  `Generated from the investor model summary.\n\n` +
  `## Slides\n\n` +
  `1. Cover — Opays Tech, cabinet d’ingénierie de l’efficience\n` +
  `2. Problem — inefficiency, irregular delivery, low trust\n` +
  `3. Solution — Forge + Sovereign, governed AI agents, repeatable delivery\n` +
  `4. Offers & margin — audit, sprint, retainer, premium research\n` +
  `5. Go-to-market — LinkedIn, local media, referrals, direct outreach, academic wedge\n` +
  `6. Operations — team, capacity, delivery, cadence, SOPs\n` +
  `7. Team, pipeline & 90-day plan — the three refinements + academic wedge\n` +
  `8. Financial model — conservative ZAR assumptions\n` +
    `9. Risks & responses — founder dependency, scope creep, cash discipline\n` +
    `10. Use of funds & next step — stabilize, sell, deliver, scale carefully\n`;

  fs.writeFileSync(outMd, outline, "utf8");

  console.log(`Saved presentation to ${outPptx}`);
  console.log(`Saved outline to ${outMd}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
