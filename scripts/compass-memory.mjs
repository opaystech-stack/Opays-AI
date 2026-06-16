import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Sources de vérité — ordonnées par priorité (les docs les plus structurants
// sont interrogés en premier pour guider la réponse).
// ---------------------------------------------------------------------------

const CORE_FILES = [
  "05_decisions/decision_log.md",
  "06_ops/plan_execution_refonte_90_jours.md",
  "06_ops/tenant0_execution_plan.md",
  "06_ops/cahier_des_charges_refonte_plateforme_opays.md",
  "06_ops/architecture_technique_gouvernance_opays.md",
  "06_ops/strategie_ui_ux_plateforme_opays.md",
  "OPAYS_HQ.md",
  "CLAUDE.md",
  "00_hq/OPAYS_HQ_GOVERNANCE.md",
  "00_hq/OPAYS_METHOD.md",
];

const BRAIN_DIR = "brain/Opays Cerveau/wiki";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function exists(relPath) {
  try {
    await fs.access(path.join(ROOT, relPath));
    return true;
  } catch {
    return false;
  }
}

async function read(relPath) {
  return fs.readFile(path.join(ROOT, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// Découverte dynamique du brain/wiki
// ---------------------------------------------------------------------------

async function discoverBrainFiles() {
  const fullPath = path.join(ROOT, BRAIN_DIR);
  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => path.join(BRAIN_DIR, e.name).replace(/\\/g, "/"));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Chargement de la mémoire
// ---------------------------------------------------------------------------

async function loadMemory() {
  const files = new Set([...CORE_FILES, ...(await discoverBrainFiles())]);
  const entries = [];

  for (const file of files) {
    if (!(await exists(file))) continue;
    const content = await read(file);
    entries.push({ file, content });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Extraction structurée
// ---------------------------------------------------------------------------

function extractHeadings(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, "").trim());
}

function extractSections(content) {
  const sections = [];
  const lines = content.split(/\r?\n/);
  let currentHeading = "";
  let currentBody = [];

  for (const line of lines) {
    if (/^#{2,4}\s+/.test(line)) {
      if (currentHeading) {
        sections.push({ heading: currentHeading, body: currentBody.join("\n") });
      }
      currentHeading = line.replace(/^#{2,4}\s+/, "").trim();
      currentBody = [];
    } else if (currentHeading) {
      currentBody.push(line);
    }
  }
  if (currentHeading) {
    sections.push({ heading: currentHeading, body: currentBody.join("\n") });
  }
  return sections;
}

function extractDecisionBlocks(content) {
  const blocks = [];
  const lines = content.split(/\r?\n/);
  let current = null;
  for (const line of lines) {
    const match = line.match(/^###\s+Décision\s+#?(\d+)\s+-\s+(.+)$/i);
    if (match) {
      if (current) blocks.push(current);
      current = { id: match[1], title: match[2], body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) blocks.push(current);
  return blocks;
}

// ---------------------------------------------------------------------------
// Scoring — les termes du titre pèsent plus lourd que ceux du corps
// ---------------------------------------------------------------------------

function scoreBlock(title, body, query) {
  const titleHay = normalize(title);
  const bodyHay = normalize(body);
  const terms = normalize(query).split(" ").filter(Boolean);
  if (!terms.length) return 0;

  let score = 0;
  for (const term of terms) {
    if (titleHay.includes(term)) score += 4;
    else if (bodyHay.includes(term)) score += 1;
  }
  return score;
}

// ---------------------------------------------------------------------------
// Construction de la réponse structurée (contrat Compass)
// ---------------------------------------------------------------------------

function buildStructuredAnswer(query, matches) {
  if (!matches.length) {
    return [
      `Question: ${query}`,
      "",
      "Statut: information insuffisante dans la mémoire actuelle.",
      "Écart: aucune source ne couvre directement cette question.",
      "Risque: décision prise sans référence documentaire.",
      "Prochaine action: inscrire une note ou une décision dans 05_decisions/decision_log.md.",
      "Document à créer: une entrée dédiée dans 05_decisions/ ou 06_ops/.",
    ].join("\n");
  }

  const top = matches[0];
  const lines = [];
  lines.push(`Question: ${query}`);
  lines.push(`Source principale: ${top.source}`);
  lines.push(`Section: ${top.title}`);

  // Extrait les décisions et statuts actifs du snippet
  const decisionMatch = top.snippet.match(/(?:Décision|décision|Statut|statut)[:\s]+([^.\n]+)/);
  if (decisionMatch) {
    lines.push(`Décision/Statut: ${decisionMatch[1].trim()}`);
  }

  lines.push("");
  lines.push("Sources retrouvées:");

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const marker = i === 0 ? "→" : " ";
    lines.push(`${marker} ${m.title} [${m.source}]`);
    if (m.snippet) {
      const clean = m.snippet.replace(/\s+/g, " ").trim().slice(0, 280);
      lines.push(`   ${clean}`);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Moteur de recherche principal
// ---------------------------------------------------------------------------

export async function searchCompass(query) {
  const memory = await loadMemory();
  const blocks = [];

  for (const entry of memory) {
    // Fichier de décisions → extraction par bloc de décision
    if (entry.file.endsWith("decision_log.md")) {
      const decisions = extractDecisionBlocks(entry.content);
      for (const decision of decisions) {
        const body = decision.body.join("\n");
        const score = scoreBlock(decision.title, body, query);
        if (score > 0) {
          blocks.push({
            score,
            source: entry.file,
            title: `Décision #${decision.id} — ${decision.title}`,
            snippet: decision.body.slice(0, 14).join(" ").replace(/\s+/g, " ").trim(),
          });
        }
      }
      continue;
    }

    // Autres fichiers → extraction par section (## heading)
    const sections = extractSections(entry.content);
    if (sections.length) {
      for (const section of sections) {
        const score = scoreBlock(section.heading, section.body, query);
        if (score > 0) {
          const firstLine =
            section.body
              .split(/\r?\n/)
              .find((line) => line.trim() && !/^#/.test(line) && !/^[-*]/.test(line))
              ?.trim() || section.body.slice(0, 200).trim();
          blocks.push({
            score,
            source: entry.file,
            title: section.heading,
            snippet: firstLine.replace(/\s+/g, " "),
          });
        }
      }
    } else {
      // Fallback: pas de sections → bloc unique avec les headings comme titre
      const headings = extractHeadings(entry.content);
      const title = headings[0] || path.basename(entry.file, ".md");
      const score = scoreBlock(title, entry.content, query);
      if (score > 0) {
        blocks.push({
          score,
          source: entry.file,
          title,
          snippet: entry.content
            .split(/\r?\n/)
            .find((line) => line.trim() && !/^#/.test(line))
            ?.trim()
            ?.slice(0, 280) || "",
        });
      }
    }
  }

  blocks.sort((a, b) => b.score - a.score);
  const matches = blocks.slice(0, 5);

  return {
    query,
    answer: buildStructuredAnswer(query, matches),
    matches,
  };
}

export async function getCompassStatus() {
  const mem = await loadMemory();
  const result = await searchCompass("gouvernance plan decisions");
  return [`Memoire chargee: ${mem.length} fichiers`, "", result.answer].join("\n");
}

export async function getCompassMetrics() {
  const mem = await loadMemory();
  const decisionResult = await searchCompass("decision");
  const latestDecision = decisionResult.matches[0] || null;

  return {
    files: mem.length,
    sources: [...new Set(mem.map((e) => e.file))].sort(),
    latestDecision: latestDecision
      ? { title: latestDecision.title, source: latestDecision.source, snippet: (latestDecision.snippet || "").slice(0, 200) }
      : null,
  };
}