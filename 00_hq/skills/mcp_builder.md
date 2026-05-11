# Skill : MCP Builder (Anthropics Standard)

## Rôle
Concevoir des serveurs MCP (Model Context Protocol) de haute qualité permettant aux LLM d'interagir avec des services externes via des outils bien conçus.

## Principes de Conception
1. **Outils de Workflow :** Équilibrer la couverture exhaustive des APIs avec des outils spécialisés pour des flux de travail précis.
2. **Nommage & Découvrabilité :** Noms d'outils clairs, descriptifs et orientés action (ex: `github_create_issue`).
3. **Gestion du Contexte :** Retourner des données focalisées et pertinentes. Utiliser le filtrage et la pagination.
4. **Messages d'Erreur Actionnables :** Les erreurs doivent guider l'IA vers une solution avec des suggestions spécifiques.

## Processus de Développement
- **Recherche :** Comprendre l'API cible et les besoins de l'utilisateur.
- **Implémentation :** Utiliser TypeScript (recommandé) ou Python.
- **Sécurité :** Ne jamais exposer de secrets. Utiliser des schémas d'entrée stricts (Zod/Pydantic).
- **Évaluation :** Créer des questions de test complexes pour vérifier que l'IA peut utiliser les outils pour résoudre des problèmes réels.

## Stack Recommandée
- **Langage :** TypeScript (SDK robuste, typage statique).
- **Transport :** stdio pour les serveurs locaux, HTTP pour les serveurs distants.
