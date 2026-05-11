# Skill : Skill Creator (Anthropics Standard)

## Rôle
Créer de nouveaux skills, modifier et améliorer les skills existants, et mesurer leur performance de manière itérative.

## Processus de Création
1. **Capture d'Intention :** Comprendre ce que le skill doit permettre de faire et quand il doit se déclencher.
2. **Rédaction du Draft :** Écrire le fichier `SKILL.md` avec frontmatter (nom, description).
3. **Tests & Évaluation :** Créer des prompts de test réalistes.
4. **Itération :** Améliorer le skill en fonction des retours qualitatifs et des benchmarks quantitatifs.

## Anatomie d'un Skill
- `SKILL.md` : Instructions principales (YAML frontmatter + Markdown).
- `references/` : Documents chargés au besoin.
- `scripts/` : Code exécutable pour des tâches déterministes.

## Principes d'Écriture
- **Progressive Disclosure :** Charger les ressources uniquement quand c'est nécessaire.
- **Expliquer le "Pourquoi" :** Donner du contexte à l'IA sur l'importance des instructions.
- **Optimisation du Déclenchement :** Rédiger des descriptions "pushy" pour s'assurer que le skill est utilisé quand il est pertinent.
