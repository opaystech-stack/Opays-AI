#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { searchCompass, getCompassStatus } from "./compass-memory.mjs";

const ROOT = process.cwd();

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

async function existsAny(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const PHASE_CHECKLISTS = {
  "phase-0": [
    "Cartographier l'existant utile dans 00_hq, brain et 06_ops.",
    "Classer les fichiers en actif, refonte, archive, brouillon ou obsolete.",
    "Valider les documents de reference et figer les contradictions majeures.",
    "Instancier Compass comme guide de gouvernance interne.",
    "Verifier que le vocabulaire de décision est stable.",
  ],
  "phase-1": [
    "Figurer la direction UX et le shell visuel.",
    "Valider la structure de navigation et les composants communs.",
    "Mettre en place le tenant 0 comme laboratoire interne.",
    "Brancher le Knowledge Vault interne sur la mémoire existante.",
    "Verifier les backups, le monitoring et le suivi des couts.",
  ],
  "phase-2": [
    "Stabiliser le template client.",
    "Formaliser les connecteurs et la couche d'interoperabilité.",
    "Versionner les modules et les agents.",
    "Tester le rollback et les scénarios de reprise.",
    "Préparer le staging client.",
  ],
};

async function agentGuide() {
  const files = [
    "AGENTS.md",
    ".codex/AGENTS.md",
    ".codex/config.toml",
    "OPAYS_HQ.md",
    "CLAUDE.md",
    "WORKSPACE_MAP.md",
  ];
  const lines = [];
  lines.push("Opays Agent Surface");
  lines.push("");
  lines.push("Reference files:");
  for (const file of files) {
    lines.push(`- ${file}`);
  }
  lines.push("");
  lines.push("Suggested flow:");
  lines.push("1. Read OPAYS_HQ.md and CLAUDE.md.");
  lines.push("2. Use 00_hq/skills for the current task.");
  lines.push("3. Keep changes small, traceable, and reversible.");
  lines.push("4. Consult openaiDeveloperDocs for Codex/OpenAI/API questions.");
  return lines.join("\n");
}

async function agentStatus() {
  const checks = [
    ["AGENTS.md", await exists("AGENTS.md")],
    [".codex/AGENTS.md", await exists(".codex/AGENTS.md")],
    [".codex/config.toml", await exists(".codex/config.toml")],
    ["WORKSPACE_MAP.md", await exists("WORKSPACE_MAP.md")],
  ];
  const lines = [];
  lines.push("Agent integration status");
  for (const [label, ok] of checks) {
    lines.push(`${ok ? "OK" : "MISSING"} - ${label}`);
  }
  return lines.join("\n");
}

async function readinessReport() {
  const sections = [
    {
      title: "Strategie et gouvernance",
      items: [
        ["OPAYS_HQ.md", await exists("OPAYS_HQ.md")],
        ["CLAUDE.md", await exists("CLAUDE.md")],
        ["WORKSPACE_MAP.md", await exists("WORKSPACE_MAP.md")],
        ["decision_log.md", await exists("05_decisions/decision_log.md")],
      ],
    },
    {
      title: "Agents et skills",
      items: [
        ["AGENTS.md", await exists("AGENTS.md")],
        [".codex/AGENTS.md", await exists(".codex/AGENTS.md")],
        [".codex/config.toml", await exists(".codex/config.toml")],
        ["frontend-skill", await existsAny(path.join(process.env.HOME || process.env.USERPROFILE || "", ".codex", "skills", "frontend-skill", "SKILL.md"))],
        ["andrej-karpathy-skill", await existsAny(path.join(process.env.HOME || process.env.USERPROFILE || "", ".codex", "skills", "andrej-karpathy-skill", "SKILL.md"))],
        ["docx/pdf/pptx/xlsx", await existsAny(path.join(process.env.HOME || process.env.USERPROFILE || "", ".codex", "skills", "docx", "SKILL.md")) && await existsAny(path.join(process.env.HOME || process.env.USERPROFILE || "", ".codex", "skills", "pdf", "SKILL.md")) && await existsAny(path.join(process.env.HOME || process.env.USERPROFILE || "", ".codex", "skills", "pptx", "SKILL.md")) && await existsAny(path.join(process.env.HOME || process.env.USERPROFILE || "", ".codex", "skills", "xlsx", "SKILL.md"))],
      ],
    },
    {
      title: "Execution",
      items: [
        ["Compass CLI", await exists("scripts/compass-memory.mjs")],
        ["Opays CLI", await exists("scripts/opays-cli.mjs")],
        ["check-compliance", await exists("00_hq/skills/check_compliance.md")],
        ["plan-progress", await exists("00_hq/skills/plan_progress.md")],
        ["generate-checklist", await exists("00_hq/skills/generate_checklist.md")],
      ],
    },
    {
      title: "Build surface",
      items: [
        ["src", await exists("src")],
        ["opays-hq", await exists("opays-hq")],
        ["vite.config.ts", await exists("vite.config.ts")],
        ["opays_investor_model.xlsx", await exists("06_ops/opays_investor_model.xlsx")],
        ["opays_investor_model_summary.md", await exists("06_ops/opays_investor_model_summary.md")],
      ],
    },
  ];

  const lines = [];
  let total = 0;
  let ok = 0;
  for (const section of sections) {
    lines.push(section.title);
    for (const [label, state] of section.items) {
      total += 1;
      if (state) ok += 1;
      lines.push(`- ${state ? "OK" : "MISSING"} ${label}`);
    }
    lines.push("");
  }

  const pct = Math.round((ok / total) * 100);
  const status = pct >= 90 ? "READY" : pct >= 75 ? "NEARLY READY" : pct >= 50 ? "PARTIAL" : "NOT READY";
  lines.unshift(`Readiness: ${status} (${pct}% | ${ok}/${total})`);
  if (ok === total) {
    lines.push("Next step: use the environment as launch-ready and keep the report as the baseline.");
  } else {
    lines.push("Next step: close the missing items above before treating the environment as launch-ready.");
  }
  return lines.join("\n");
}


async function checkCompliance() {
  const checks = [];
  checks.push({
    label: "Compass présent",
    ok: await exists("00_hq/skills/opays_compass.md"),
  });
  checks.push({
    label: "Check Compliance présent",
    ok: await exists("00_hq/skills/check_compliance.md"),
  });
  checks.push({
    label: "Plan Progress présent",
    ok: await exists("00_hq/skills/plan_progress.md"),
  });
  checks.push({
    label: "Generate Checklist présent",
    ok: await exists("00_hq/skills/generate_checklist.md"),
  });
  checks.push({
    label: "Cahier des charges refonte",
    ok: await exists("06_ops/cahier_des_charges_refonte_plateforme_opays.md"),
  });
  checks.push({
    label: "Plan 90 jours",
    ok: await exists("06_ops/plan_execution_refonte_90_jours.md"),
  });
  checks.push({
    label: "Plan tenant 0",
    ok: await exists("06_ops/tenant0_execution_plan.md"),
  });
  checks.push({
    label: "Stratégie UI/UX",
    ok: await exists("06_ops/strategie_ui_ux_plateforme_opays.md"),
  });

  const total = checks.length;
  const okCount = checks.filter((c) => c.ok).length;
  const status = okCount === total ? "🟢" : okCount >= total - 1 ? "🟠" : "🔴";
  const lines = [];
  lines.push(`Etat: ${status} (${okCount}/${total})`);
  for (const check of checks) {
    lines.push(`${check.ok ? "OK" : "KO"} - ${check.label}`);
  }
  lines.push("Note: ce controle vérifie la présence et l'alignement documentaire, pas l'état d'un tenant déployé.");
  return lines.join("\n");
}

async function planProgress() {
  const required = [
    "06_ops/architecture_technique_gouvernance_opays.md",
    "06_ops/cahier_des_charges_refonte_plateforme_opays.md",
    "06_ops/plan_execution_refonte_90_jours.md",
    "06_ops/tenant0_execution_plan.md",
    "06_ops/strategie_ui_ux_plateforme_opays.md",
    "00_hq/skills/opays_compass.md",
    "00_hq/skills/check_compliance.md",
    "00_hq/skills/plan_progress.md",
    "00_hq/skills/generate_checklist.md",
  ];
  const present = [];
  const missing = [];
  for (const file of required) {
    if (await exists(file)) present.push(file);
    else missing.push(file);
  }

  const docsScore = Math.round((present.length / required.length) * 100);
  const phase0 = await exists("brain/Opays Cerveau/wiki/Opays Compass.md") && await exists("05_decisions/decision_log.md");
  const phase1 = await exists("06_ops/strategie_ui_ux_plateforme_opays.md");
  const phase2 = await exists("00_hq/skills/check_compliance.md") && await exists("00_hq/skills/plan_progress.md");
  const lines = [];
  lines.push(`Avancement mémoire/gouvernance: ${docsScore}%`);
  lines.push(`Phase 0 - Nettoyage et cartographie: ${phase0 ? "en place" : "à compléter"}`);
  lines.push(`Phase 1 - Architecture cible figée: ${phase1 ? "en place" : "à compléter"}`);
  lines.push(`Phase 2 - Skills opérationnels: ${phase2 ? "en place" : "à compléter"}`);
  lines.push("");
  lines.push("Présents:");
  for (const file of present) lines.push(`- ${file}`);
  if (missing.length) {
    lines.push("");
    lines.push("Manquants:");
    for (const file of missing) lines.push(`- ${file}`);
  }
  return lines.join("\n");
}

async function generateChecklist(phaseArg) {
  const key = normalize(phaseArg || "");
  let checklist = PHASE_CHECKLISTS[key];
  if (!checklist) {
    if (key.includes("phase 0") || key.includes("tenant 0") || key.includes("cadrage")) checklist = PHASE_CHECKLISTS["phase-0"];
    if (key.includes("phase 1") || key.includes("architecture cible") || key.includes("ux")) checklist = PHASE_CHECKLISTS["phase-1"];
    if (key.includes("phase 2") || key.includes("template") || key.includes("interop")) checklist = PHASE_CHECKLISTS["phase-2"];
  }
  if (!checklist) {
    return [
      `Phase inconnue: ${phaseArg}`,
      "Phases disponibles: phase-0, phase-1, phase-2",
    ].join("\n");
  }
  const lines = [];
  lines.push(`Checklist: ${phaseArg}`);
  checklist.forEach((item, index) => {
    lines.push(`${index + 1}. ${item}`);
  });
  lines.push("");
  lines.push("Règle: exécuter dans l'ordre, puis consigner les écarts dans decision_log.md.");
  return lines.join("\n");
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  try {
    if (command === "agents") {
      const [sub] = args;
      if (sub === "guide") {
        console.log(await agentGuide());
        return;
      }
      if (sub === "status" || !sub) {
        console.log(await agentStatus());
        return;
      }
      throw new Error("Usage: opays agents [status|guide]");
    }

    if (command === "compass") {
      const [sub, ...rest] = args;
      if (sub === "ask") {
        const query = rest.join(" ").trim();
        if (!query) throw new Error("Usage: opays compass ask <question>");
        const result = await searchCompass(query);
        console.log(result.answer);
        return;
      }
      if (sub === "status") {
        console.log(await getCompassStatus());
        return;
      }
      throw new Error("Usage: opays compass ask <question> | opays compass status");
    }

    if (command === "check-compliance") {
      console.log(await checkCompliance());
      return;
    }

    if (command === "plan-progress") {
      console.log(await planProgress());
      return;
    }

    if (command === "readiness") {
      console.log(await readinessReport());
      return;
    }

    if (command === "generate-checklist") {
      const phase = args.join(" ").trim();
      if (!phase) throw new Error("Usage: opays generate-checklist <phase>");
      console.log(await generateChecklist(phase));
      return;
    }

    if (command === "help" || !command) {
      console.log([
        "Opays CLI",
        "Commands:",
        "  opays agents [status|guide]",
        "  opays compass ask <question>",
        "  opays compass status",
        "  opays check-compliance",
        "  opays plan-progress",
        "  opays readiness",
        "  opays generate-checklist <phase>",
      ].join("\n"));
      return;
    }

    throw new Error(`Unknown command: ${command}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

await main();
