# Skill: Sovereign Research Intelligence (SRI)

## 1. Vision
Ce skill permet à OPAYS TECH d'agir comme une **Unité d'Appui Technologique** pour la recherche stratégique (Souveraineté). L'objectif n'est pas de remplacer le chercheur, mais d'utiliser l'IA pour supprimer les goulots d'étranglement de l'analyse de données complexes (Génomique, Protéomique, Épidémiologie).

## 2. Stack Technologique (Open Source & Local)
Pour garantir la souveraineté et l'efficacité en zone à ressources limitées (avec Starlink) :

- **Analyse de Séquences (Virus/Bactéries) :** `Nextclade` (CLI & Web) pour l'alignement et la détection de variants.
- **Structure des Protéines :** `ColabFold` (version cloud de AlphaFold) ou `ESMFold` pour prédire l'impact des mutations.
- **Analyse de Littérature (RAG) :** Utilisation de LLM (GPT-4o/Claude) couplés à des outils comme `Elicit` ou `Perplexity` pour extraire des protocoles de recherche.
- **Visualisation :** `Nextstrain` pour la cartographie de la propagation en temps réel.
- **Développement Agile :** `Streamlit` pour créer des interfaces "Dashboard" rapides pour les épidémiologistes.

## 3. Méthode : Le Cycle de Diagnostic SRI
Le skill s'exécute en 4 étapes :

1.  **Ingestion de la Question Scientifique :** (ex: "Pourquoi ce cluster d'Ebola ne répond pas au traitement X ?")
2.  **Audit de Données :** Identifier les sources (NCBI, GISAID, fichiers FASTA locaux).
3.  **Pipeline d'Analyse Automatisé :** Lancer les outils IA pour filtrer le "bruit" et identifier les "signaux" (mutations clés).
4.  **Synthèse de Décision :** Traduire les résultats techniques en recommandations opérationnelles pour les épidémiologistes.

## 4. Garde-fous (Pessimisme Pragmatique)
- **Vérification Humaine :** Ne jamais valider un résultat IA sans la relecture des deux épidémiologistes associés.
- **Souveraineté des Données :** Aucune donnée patient brute ne doit quitter le réseau local ou le cloud sécurisé d'OPAYS.
- **Humilité Technique :** Se concentrer sur le *logiciel* et l' *intelligence* ; déléguer la *biologie* et le *laboratoire* aux institutions partenaires.
