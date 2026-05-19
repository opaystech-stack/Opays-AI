# Protocole d'Intégration Recherche : OPAYS SOVEREIGN

## 1. Objet
Ce protocole définit la méthode de collaboration entre l'équipe OPAYS TECH (les "Orchestrateurs") et les épidémiologistes associés (les "Experts Terrain") pour les projets de recherche épidémiologique (ex: Ebola).

## 2. Le Modèle de Collaboration (Orchestration)
La collaboration repose sur une séparation claire des responsabilités :

- **Épidémiologistes Associés :** Définissent les priorités sanitaires, fournissent l'accès aux données de terrain et valident la rigueur scientifique des résultats.
- **Équipe OPAYS TECH :** Identifie les outils IA, automatise le traitement des données et fournit l'infrastructure (Starlink, Calcul, Dashboard).

## 3. Workflow Opérationnel

### Phase 1 : Le Diagnostic (Semaine 1)
- Réunion de "Point Zéro" avec les épidémiologistes.
- Question clé : "Quel processus répétitif ou analyse de données vous empêche de dormir ?"
- Résultat : Un cahier des charges technique simplifié.

### Phase 2 : Le Montage du Pipeline (Semaine 2)
- Configuration des outils IA (Nextclade, RAG, Python).
- Test sur des données publiques pour valider la logique.
- Mise en place du partage de fichiers sécurisé.

### Phase 3 : L'Analyse "Commando" (Phase Active)
- Ingestion des données réelles.
- Analyse flash par l'IA (en quelques heures).
- Session de "Review" avec les experts pour éliminer les faux positifs.

### Phase 4 : Livraison de l'Intelligence
- Présentation d'un rapport visuel simplifié ou d'un dashboard interactif.
- Prise de décision opérationnelle (ex: alerte variant, changement de protocole de diagnostic).

## 4. Gestion des Coûts et Ressources
- **Internet :** Utilisation systématique de la connexion Starlink d'OPAYS pour les transferts lourds (séquences génomiques).
- **Calcul :** Utilisation des ressources Cloud (Colab/Hugging Face) pour éviter l'achat de serveurs coûteux.
- **Temps Humain :** Focalisation sur des sessions de travail courtes et intenses (méthode "Commando").

## 5. Confidentialité et Mémoire
- Ce protocole et les résultats de recherche sont **strictement internes** à OPAYS TECH.
- Les publications scientifiques ou communications publiques se font sous l'égide des épidémiologistes partenaires, OPAYS restant le "bras technologique" discret.
