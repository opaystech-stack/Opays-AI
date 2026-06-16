# Codex Supplement for Opays Tech

This project already has a root `AGENTS.md`. Follow it first.

## Intent

- Keep Codex aligned with the Opays operating model.
- Prefer project-local knowledge over generic assumptions.
- Use the existing `00_hq/` knowledge base before inventing new structure.

## Suggested agent roles

- `explorer`: read-only discovery and context gathering
- `reviewer`: correctness, security, missing-test, and regression review
- `docs-researcher`: documentation checks and source alignment

## Notes for this repository

- Treat `OPAYS_HQ.md` as the strategic source of truth.
- Use `CLAUDE.md` and `WORKSPACE_MAP.md` as working references.
- Keep changes scoped to the current task unless a wider refactor is explicitly requested.
- For OpenAI/Codex/API questions, prefer the `openaiDeveloperDocs` MCP server before relying on memory.
- For UI/brand work, use the installed `frontend-skill` alongside `00_hq/skills/frontend_design.md`, `premium_ui_design.md`, and `theme_factory.md`.
- For code changes, reviews, refactors, and debugging, prefer the installed `andrej-karpathy-skill` so Codex stays surgical and verifies outcomes explicitly.
- For document work, use the installed Anthropic document skills: `docx`, `pdf`, `pptx`, `xlsx`.
- For brand and design work, prefer the installed Anthropic skills: `frontend-design`, `theme-factory`, and `brand-guidelines`.
