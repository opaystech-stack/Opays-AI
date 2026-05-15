# AGENTS.md - LLM Wiki Schema for OPAYS TECH

This document defines how the AI Agent (Antigravity) maintains the `brain/` knowledge base.

## Core Rules
- **Role**: The Agent is the maintainer/programmer of the wiki. The User is the curator.
- **Data Integrity**: Never delete raw sources in `sources/`.
- **Linking**: Use `[[Wikilinks]]` aggressively to connect concepts, people, and technical modules.
- **Distillation**: Wiki pages should be dense, insightful summaries, not raw transcripts.

## Directory Structure
- `sources/`: Immutable raw input files (PDFs, transcripts, code dumps).
- `wiki/`: AI-generated synthesis pages.
- `assets/`: Images, diagrams, or data files.

## Special Files
- `index.md`: Catalog of all wiki pages, grouped by category (Vision, Tech, Ops).
- `log.md`: Append-only chronological log of all wiki updates.

## Workflow: Ingesting a Source
1. **Read**: Analyze the source content.
2. **Log**: Add entry to `log.md` (e.g., `## [YYYY-MM-DD] ingest | Source Name`).
3. **Synthesize**: 
    - Create a new summary page in `wiki/`.
    - Update existing entity/concept pages if the new source adds relevant info.
    - Check for contradictions with previous notes.
4. **Index**: Update `index.md` if a new page was created.

## Page Templates

### Concept/Entity Page
```markdown
# [Title]
## Summary
Brief overview of the concept/entity.

## Key Information
- Fact 1
- Fact 2

## Links & References
- [[Link1]]
- [[Link2]]
- Source: [[SourceFilename]]
```

## Maintenance (Linting)
Periodically check for:
- Dead links.
- Stale info (e.g., old roadmap replaced by new one).
- Orphaned pages.
