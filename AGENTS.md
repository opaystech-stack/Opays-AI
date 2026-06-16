# Opays Tech - Agent Guide

Ce fichier est la porte d'entree principale pour Codex et les autres agents dans ce workspace.

## Priorite de lecture

1. Lire `OPAYS_HQ.md` avant toute strategie, offre, message ou evolution de marque.
2. Lire `CLAUDE.md` pour les regles de travail deja valides dans ce repository.
3. Lire `WORKSPACE_MAP.md` pour comprendre l'architecture des dossiers.
4. Utiliser `00_hq/skills/` comme bibliotheque locale de competences.
5. Preserver la coherence du projet avant d'introduire de nouveaux outils ou conventions.

## Cadre Opays

- Opays Tech est un cabinet d'ingenierie de l'efficience, pas une agence generaliste.
- La clarte, l'utilite et la credibilite passent avant l'effet visuel.
- La solution doit toujours partir du terrain, puis de la methode, puis de l'implementation.
- Toute proposition doit soutenir la vente, la confiance et la maintenabilite.

## Regles de travail

- Repondre en francais par defaut.
- Garder un ton humain, precis et premium.
- Ne pas produire de refonte massive sans besoin clair.
- Ne pas effacer des choix deja valides sans comprendre leur origine.
- Utiliser `apply_patch` pour les modifications manuelles.
- Preferrer des changements petits, lisibles et reversibles.

## Quand utiliser les skills locaux

- Strategie, positionnement, offres, priorisation: `00_hq/skills/strategic_planning.md`, `00_hq/skills/opays_compass.md`, `00_hq/skills/lead_research.md`
- Efficience, systemes, automatisation: `00_hq/skills/efficiency_engineering.md`, `00_hq/skills/ai_operational_intelligence.md`, `00_hq/skills/mcp_builder.md`
- Design et interface: `00_hq/skills/frontend_design.md`, `00_hq/skills/premium_ui_design.md`, `00_hq/skills/theme_factory.md`, `00_hq/skills/open_design_studio.md`
- Tests, verification, checklist: `00_hq/skills/webapp_testing.md`, `00_hq/skills/generate_checklist.md`, `00_hq/skills/plan_progress.md`
- Documentation et livraison: `00_hq/skills/document_suite.md`, `00_hq/skills/web_artifacts_builder.md`
- Creation ou amelioration de competences: `00_hq/skills/skill_creator.md`
- Skill design Codex utilise pour le rendu UI/brand: `frontend-skill` (deja installe dans Codex).
- Code, review, refactor, debugging: `andrej-karpathy-skill` pour renforcer la prudence, les changements chirurgicaux et la verification explicite.
- Skills Anthropic installes pour documents: `docx`, `pdf`, `pptx`, `xlsx`.
- Skills Anthropic installes pour design/brand: `frontend-design`, `theme-factory`, `brand-guidelines`.

## Quand consulter la doc OpenAI

- Pour toute question sur Codex, les API OpenAI, le SDK, le mode agent ou la configuration, utiliser d'abord le MCP `openaiDeveloperDocs` si disponible, puis citer des sources officielles.

## Regle de decision

Quand une idee touche la marque, le site ou les offres, verifier d'abord:

1. Est-ce que cela sert la promesse centrale ?
2. Est-ce que cela simplifie vraiment quelque chose ?
3. Est-ce que cela peut etre execute proprement ?
4. Est-ce que cela renforce la confiance ?

Si la reponse est non a deux questions ou plus, reformuler ou mettre en attente.
