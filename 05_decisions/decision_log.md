# Decision Log

## Modele d'entree

- Date:
- Sujet:
- Decision:
- Raison:
- Impact:
- Statut:

## Regle

Toute decision qui change la direction du projet doit etre tracee ici.

---

## Log des Décisions

### Décision #005 - Restructuration Commando & Feuille de Route Lancement
- **Date :** 19 Mai 2026
- **Sujet :** Départ du CTO (Evans Selemani) & Validation de la stratégie de pré-lancement.
- **Décision :**
  1. Constat de la vacance du poste de CTO. Intérim de la direction de la R&D et de la supervision produit assuré par le DG (Fenelon Lamsasiri). Lancement immédiat de la recherche d'un remplaçant.
  2. Validation de la formule marketing "double dépliant" (dépliant de vulgarisation externe + guide tarifaire de fourchettes interne).
  3. Validation du calendrier administratif : enregistrement de la société par Prince dans le Grand Nord et finalisation des statuts par Fenelon.
- **Raison :** Maintenir la cadence opérationnelle et protéger les intérêts de l'entreprise tout en préparant la signature Bridgesats pour le lundi 25 mai.
- **Impact :** Suppression des comptes d'Evans, adaptation d'Opays HQ, et réassignation des tâches critiques de préparation marketing à Fenelon (dépliant/communiqué de presse) et de diffusion à Prince.
- **Statut :** Approuvé à l'unanimité des associés présents le 19 mai 2026.

### Décision #006 - Refonte plateforme, Compass et priorité UX
- **Date :** 24 Mai 2026
- **Sujet :** Refonte totale de la plateforme interne, mise en place d'un assistant de gouvernance, et priorité à l'expérience utilisateur avant la refonte profonde de l'existant.
- **Décision :**
  1. Valider la refonte comme une plateforme d'exploitation d'entreprise en `7 plans` logiques, avec `tenant 0`, `Knowledge Vault`, `Integration Plane`, `Security Plane` et `Operations Plane`.
  2. Créer un assistant interne de gouvernance et de mémoire de projet nommé `Compass`, chargé de suivre le plan, les décisions, les checklists et la cohérence documentaire.
  3. Figer d'abord la coque UI/UX de la plateforme avant d'engager la refonte profonde de l'infrastructure existante.
  4. Construire la nouvelle expérience sur le socle frontend existant du projet, en s'inspirant des meilleures applications de gestion d'entreprise, sans copier de façon aveugle.
- **Raison :** Garantir la continuité du savoir, la lisibilité du produit, et éviter de reconstruire l'infrastructure avant d'avoir stabilisé l'expérience de travail et le cadre de pilotage.
- **Impact :** Ajout de la stratégie UI/UX, création du skill Compass, priorité au design system et au shell applicatif, et maintien d'une logique de migration prudente de l'existant.
- **Statut :** Actif et intégré au plan de refonte.

### Décision #007 - Lancement du tenant 0 comme cobaye opérationnel
- **Date :** 24 Mai 2026
- **Sujet :** Démarrage de l'environnement interne de référence, avec Compass comme mémoire de gouvernance et un premier shell UI basé sur la stack existante.
- **Décision :**
  1. Lancer le tenant 0 comme environnement interne de cobaye avant toute refonte profonde de l'infrastructure.
  2. Isoler le control plane du runtime opérationnel et documenter les règles d'isolation, de sauvegarde et de restauration.
  3. Exposer Compass comme mémoire vivante à partir des sources `00_hq`, `brain`, `06_ops` et `05_decisions`.
  4. Ajouter un point d'entrée UI dédié au tenant 0, en conservant la stack frontend existante comme base unique.
- **Raison :** Valider la nouvelle architecture sur notre propre entreprise, sans mélanger la gouvernance, l'UX et la profondeur infra.
- **Impact :** Création du plan d'exécution du tenant 0, lancement du shell interne, préparation du control plane minimal et amorce des tests de conformité.
- **Statut :** Approuvé et prioritaire.

### Décision #008 - Coexistence avec le repo legacy Opays-HQ
- **Date :** 24 Mai 2026
- **Sujet :** Harmonisation entre le dépôt GitHub `Opays-HQ` (Next.js/Supabase) et le nouveau tenant 0 (Vite/TanStack/shadcn).
- **Décision :**
  1. Considérer `Opays-HQ` comme le socle métier legacy à préserver, auditer et exposer via contrat d'API.
  2. Considérer le tenant 0 comme la couche de pilotage moderne, la mémoire Compass et le shell UX d'évolution.
  3. Ne pas réécrire les politiques RLS/RBAC existantes si elles couvrent déjà le périmètre; les auditer, les durcir et les documenter.
  4. Éviter toute duplication de vérité entre Supabase, les docs et le tenant 0: chaque source doit avoir un rôle unique.
- **Raison :** Le dépôt distant montre qu'il existe déjà une base Supabase/RLS et un modèle RBAC métier. Le bon travail est d'orchestrer l'existant et la nouvelle couche, pas de refaire un socle déjà présent.
- **Impact :** Priorité à l'audit de sécurité, à l'inventaire des surfaces d'API et à la définition des contrats entre l'ancien back-office et le nouveau shell tenant 0.
- **Statut :** Actif et contraignant pour la suite.

### Décision #009 — Branchement effectif de Compass au registre documentaire
- **Date :** 24 Mai 2026
- **Sujet :** Le moteur de Compass lit désormais l'ensemble des fichiers structurants du projet et répond dans le format de gouvernance défini.
- **Décision :**
  1. Remplacer la liste statique de 9 fichiers par une découverte dynamique couvrant l'intégralité de `brain/Opays Cerveau/wiki/` (31 fichiers) + les documents `06_ops/`, `05_decisions/`, `00_hq/` et les fichiers racine (`OPAYS_HQ.md`, `CLAUDE.md`).
  2. Indexer le contenu par sections (headings ##) pour améliorer la précision des réponses, avec un scoring qui valorise les titres (×4) par rapport au corps (×1).
  3. Éliminer la duplication de code entre `scripts/opays-cli.mjs` et `scripts/compass-memory.mjs` : le CLI importe désormais le moteur partagé.
  4. Adopter le format de réponse structuré défini dans `00_hq/skills/opays_compass.md` : question, source, décision/statut, écarts, risque, prochaine action.
- **Raison :** La priorité #2 du plan était de connecter Compass aux vraies sources. Sans lecture réelle des fichiers, Compass était une coquille vide incapable de suivre la gouvernance.
- **Impact :** 41 fichiers indexés, build vert, CLI `opays compass ask` répond en français sur le plan 90 jours, les décisions, le tenant 0, la stratégie UX et les principes du projet.
- **Statut :** Actif. Marque la complétion de l'étape 2 du plan d'exécution tenant 0.

### Décision #010 — Readiness opératoire et standardisation des agents
- **Date :** 28 Mai 2026
- **Sujet :** Formalisation de l'état de préparation du système Opays pour l'exécution, la vente et la livraison répétable.
- **Décision :**
  1. Définir une couche de readiness opératoire regroupant stratégie, gouvernance, agents, skills, CLI et surfaces d'exécution.
  2. Ajouter un rapport de readiness accessible via le CLI `opays readiness`.
  3. Documenter un état cible clair dans `06_ops/opays_readiness.md`.
  4. Considérer les skills installés comme des moyens d'exécution standardisés plutôt que comme des ajouts isolés.
- **Raison :** Il ne suffit pas d'avoir des agents et des skills ; il faut un cadre lisible, vérifiable et opérable pour que l'entreprise puisse réellement les exploiter.
- **Impact :** Amélioration de la lisibilité du système, meilleur onboarding des agents, réduction de l'improvisation et point de contrôle simple pour juger si le projet est prêt à avancer.
- **Statut :** Approuvé et actif.

### Décision #011 — Modèle économique investisseur et dossier financier
- **Date :** 28 Mai 2026
- **Sujet :** Construction d'un classeur financier et stratégique pour présenter Opays Tech devant des investisseurs, partenaires ou décideurs locaux.
- **Décision :**
  1. Formaliser un classeur Excel unique couvrant le positionnement, les offres, le funnel, les comptes prévisionnels, le cashflow, les risques et les réponses aux questions investisseurs.
  2. Utiliser le rand sud-africain (ZAR) comme devise de référence et garder la TVA en pass-through séparé.
  3. Modéliser le cœur de l'entreprise comme un système hybride: Forge = cash engine, Sovereign = autonomy / R&D engine.
  4. Utiliser des hypothèses prudentes pour les marges, la fiscalité et les coûts fixes afin d'éviter toute exagération.
- **Raison :** Le lancement commercial a déjà commencé; il faut maintenant un modèle crédible, lisible et défendable pour les futures discussions financières.
- **Impact :** Création du fichier `06_ops/opays_investor_model.xlsx`, d'un résumé lisible et d'une base de discussion prête pour investisseurs, partenaires et comité interne.
- **Statut :** Approuvé et actif.

### Décision #012 — Raffinements finaux: équipe, pipeline, plan 90 jours et pitch investisseur
- **Date :** 28 Mai 2026
- **Sujet :** Finalisation de la couche investisseur avec alignement à l'équipe réelle, au pipeline réel, au plan d'exécution 90 jours et à un deck de présentation.
- **Décision :**
  1. Ajouter au classeur financier quatre feuilles opérationnelles supplémentaires : `Team`, `Pipeline`, `90_Day_Plan` et `Pitch_Outline`.
  2. Lier le dossier aux contraintes réelles de capacité, de conversion commerciale et de cadence de livraison.
  3. Produire une présentation investisseur dédiée `06_ops/opays_investor_pitch.pptx` et son outline.
  4. Garder le discours prudent, sans survente, pour rester crédible devant des partenaires ou investisseurs.
- **Raison :** Un bon modèle n'est pas suffisant si l'équipe, le pipeline et le narratif de présentation ne sont pas alignés sur la réalité opérationnelle.
- **Impact :** Le dossier devient exploitable comme système complet: finance, opérations, commercial, narration et questions-réponses investisseur.
- **Statut :** Approuvé et actif.

### Décision #013 — Audit des anciennes idées et convergence stratégique
- **Date :** 28 Mai 2026
- **Sujet :** Relecture des manuscrits, des documents historiques et des visions précédentes pour éviter les doublons et consolider une direction unique.
- **Décision :**
  1. Conserver la thèse centrale d’Opays Tech comme cabinet d’ingénierie de l’efficience.
  2. Garder la structure Forge / Sovereign comme architecture principale.
  3. Intégrer explicitement Patricia Zamwana et Zaina Bwale Godlove dans la lecture de l’équipe au même titre que Fénelon Lamsasiri et Prince Bagheni.
  4. Reformuler l’angle universités / recherche comme wedge prioritaire de démonstration, sans détourner le cash engine.
  5. Éviter de lancer plusieurs produits ou modèles IA en parallèle sans preuve de traction.
- **Raison :** Les anciennes notes contiennent de bonnes intuitions, mais elles doivent être regroupées et hiérarchisées pour éviter la duplication et l’éparpillement.
- **Impact :** Clarification de la feuille de route, meilleure cohérence entre gouvernance, équipe, produits et narration investisseur.
- **Statut :** Approuvé et actif.

### Décision #014 — Wedge académique comme première verticale de démonstration
- **Date :** 28 Mai 2026
- **Sujet :** Priorisation d’un premier cas d’usage pour l’enseignement supérieur, la recherche et le workflow documentaire.
- **Décision :**
  1. Utiliser le secteur académique comme première verticale de démonstration de la méthode Opays.
  2. Positionner l’offre autour de l’assistant de recherche, du workflow documentaire et de la base de connaissances.
  3. Garder Forge comme moteur de cash et Sovereign comme moteur d’autonomie / R&D.
  4. Ne pas lancer cette verticale comme un produit isolé : elle doit s’aligner sur la promesse centrale et sur l’architecture existante.
- **Raison :** Le secteur académique offre un terrain clair, répétitif et crédible pour prouver la valeur sans disperser l’équipe.
- **Impact :** Nouvelle verticale de traction, meilleure cohérence du pitch, et meilleure base pour un premier MVP démonstratif.
- **Statut :** Approuvé et actif.

### Décision #015 — Création d’Opays Commons comme sous-branche communautaire séparée
- **Date :** 28 Mai 2026
- **Sujet :** Formalisation d’un projet public, éducatif et non lucratif distinct de la branche business, sous une logique de plateforme communautaire open source et IA.
- **Décision :**
  1. Créer une sous-branche séparée, provisoirement nommée `Opays Commons`, pour la vulgarisation, les ressources open source, les agents IA et les événements publics.
  2. Séparer clairement ce projet de la branche business afin d’éviter toute confusion de financement, de gouvernance ou de positionnement.
  3. Structurer la plateforme par domaines thématiques et non comme une simple liste d’outils.
  4. Prévoir un parcours de financement basé sur subventions, sponsoring, partenariats et mécénat.
  5. Positionner Kiveclair comme partenaire stratégique potentiel pour la distribution, l’animation et la crédibilité communautaire.
- **Raison :** Le projet doit pouvoir être présenté comme une initiative d’impact et d’éducation, avec sa propre logique et ses propres critères de réussite.
- **Impact :** Création d’un nouveau volet stratégique qui peut accroître la visibilité d’Opays, ouvrir des portes institutionnelles et renforcer la crédibilité publique de la marque.
- **Statut :** Approuvé et actif.

### Décision #016 — Modèle contributif communautaire avec revue Opays
- **Date :** 28 Mai 2026
- **Sujet :** Ouverture de la plateforme communautaire aux contributions externes, avec revue, test et publication par l’équipe Opays.
- **Décision :**
  1. Autoriser les membres de la communauté à proposer des outils, skills, agents, guides ou ressources.
  2. Faire passer chaque contribution par une revue Opays avant publication.
  3. Favoriser une culture de recherche open source dans plusieurs domaines sans centraliser toute la production chez l’équipe fondatrice.
  4. Utiliser ce modèle pour multiplier les découvertes, valoriser les experts métiers et renforcer la communauté.
- **Raison :** La plateforme doit être un espace vivant de contribution et pas seulement un catalogue produit par Opays.
- **Impact :** Meilleure dynamique communautaire, plus de diversité de contenu, plus de crédibilité et un pipeline naturel de découvertes à valider.
- **Statut :** Approuvé et actif.

### Décision #017 — Dossier externe, plan d’opération et roadmap propres pour Opays Commons
- **Date :** 28 Mai 2026
- **Sujet :** Formalisation d’un pack de présentation externe, d’un plan d’opération et d’une roadmap propre au projet communautaire.
- **Décision :**
  1. Produire un dossier externe envoyable à Kiveclair et futurs partenaires.
  2. Distinguer clairement la présentation externe, le plan d’opération et la roadmap pour faciliter la lecture.
  3. Maintenir la séparation conceptuelle entre Opays Commons et la branche business.
  4. Préserver le modèle contributif et la culture de validation communautaire.
- **Raison :** Le projet doit être présentable proprement et rapidement, sans ambiguïté sur son rôle, sa gouvernance et son mode d’action.
- **Impact :** Ensemble documentaire prêt à partager avec des partenaires, financeurs ou institutionnels.
- **Statut :** Approuvé et actif.

### Décision #018 — Pathy comme cockpit privé central, connecté à Hermes
- **Date :** 28 Mai 2026
- **Sujet :** Développement d’un dépôt privé personnel nommé `Pathy`, utilisé comme cockpit de pilotage central, avec Hermes comme moteur agentique.
- **Décision :**
  1. Créer un dépôt privé distinct du dépôt Opays pour centraliser la vue d’ensemble personnelle.
  2. Utiliser Hermes comme runtime d’agents pour l’orchestration, la mémoire, les synthèses et le suivi.
  3. Séparer clairement les contextes Pathy, Opays Business et Opays Commons.
  4. Commencer avec un noyau réduit d’agents spécialisés, puis étendre après stabilisation.
- **Raison :** La charge de pilotage doit être absorbée par un système central au lieu de reposer uniquement sur la mémoire humaine.
- **Impact :** Base de travail pour construire un cockpit personnel privé, capable de suivre plusieurs affaires sans les mélanger.
- **Statut :** Approuvé et actif.
