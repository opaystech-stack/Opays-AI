# ⚡ OPAYS HQ — Cahier des Charges & Prompt "Asana Style"

Ce document contient la spécification complète et le prompt de mise à jour pour l'interface utilisateur inspirée d'Asana de la plateforme **OPAYS HQ - Workspace OS**. Il sépare proprement la partie business (Opays Tech) et la partie communautaire (Opays Commons).

---

## 🎨 Spécifications de l'Interface (Asana Dark Mode)

```
+--------------------------------------------------------------------------------+
|  [⚡ OPAYS HQ]   [Rechercher...]      [+ Créer]      | [⚡ TECH] [🍃 COMMONS] |
+-----------------------------------+--------------------------------------------+
|                                   |                                            |
|  [🏠 Tableau de Bord]             |  Projets Actifs (Vue Liste Asana)          |
|  [✓ Mes Tâches]                   |                                            |
|                                   |  [ ] Tâche 1  | Haute | Fénelon | En cours |
|  OPAYS TECH                       |  [ ] Tâche 2  | Moy.  | Prince  | À faire  |
|  [👥 Clients & Pipeline]          |                                            |
|  [💰 Dépenses & CA]               |  ----------------------------------------  |
|                                   |  Visualisation Financière / Marges         |
|  OPAYS COMMONS                    |                                            |
|  [🎓 Partenariats Académiques]    |                                            |
|  [🌱 Budgets & Activités]         |                                            |
|                                   |                                            |
|  OUTILS                           |                                            |
|  [📁 Google Drive Files]          |                                            |
|                                   |                                            |
+-----------------------------------+--------------------------------------------+
```

---

## 📝 Le Prompt Maître "Asana Style" à copier dans Google AI Studio

```text
Rôle : Tu es un Architecte Cloud Senior, Développeur Expert Google Workspace (Google Apps Script, APIs Google) et Spécialiste de l'Intégration de Gemini.

Ta Mission : Générer le code complet, l'architecture de la base de données Sheets et le guide de déploiement pour "OPAYS HQ - Workspace OS", une plateforme d'exploitation 100% Google Workspace inspirée de l'ergonomie et du design d'Asana, mais adaptée à la double identité d'Opays (Opays Tech et Opays Commons).

### DIRECTION ARTISTIQUE ET UI (Inspirée d'Asana / Dark Mode) :
- Esthétique : Premium, minimaliste, Dark Mode moderne (#0A0A0A), accents bleu électrique et cyan (#00FFE0), légers effets de transparence (glassmorphism).
- Disposition (Layout Asana) :
  1. Sidebar Gauche Collapsible : Navigation claire [Tableau de bord] | [Mes Tâches] | [Clients & Pipeline (Tech)] | [Programmes Universités (Commons)] | [Finances & Budgets] | [Drive Documents].
  2. Topbar : Moteur de recherche minimaliste, bouton d'action rapide vert/cyan "[+ Créer]" (pour ajouter une tâche, un client ou une dépense) et un sélecteur d'entité haut de gamme sous forme de bouton à bascule : [⚡ OPAYS TECH] | [🍃 OPAYS COMMONS].
  3. Zone Centrale de Travail : Affichage des données sous forme de listes interactives ultra-propres (style tableau Asana avec statuts colorés, priorités et assignations).
  4. Tiroir Latéral Droit (Right Drawer) : Volet coulissant dédié à l'Assistant Gemini (s'ouvre comme le panneau de détail d'une tâche dans Asana).

### ARCHITECTURE DUAL-ENTITY (Opays Tech vs. Opays Commons) :
Le sélecteur d'entité dans la Topbar doit filtrer instantanément toutes les vues :
- En mode "Opays Tech" : Affiche le pipeline commercial Forge (Audit, Sprint, Retainer), les dépenses d'affaires et le dossier Drive des livrables clients.
- En mode "Opays Commons" : Affiche les partenariats universitaires, les budgets et animateurs des sessions académiques, et le dossier Drive pédagogique/open source.

### GESTION DES RÔLES DE L'ÉQUIPE (Gmail OAuth) :
- Fénelon Lamsasiri (CEO / R&D) : Accès complet Admin.
- Prince Bagheni (Sales) : Accès aux modules commerciaux d'Opays Tech.
- Patricia Zamwana (COO / Finance) : Accès aux finances et dépenses des deux entités.
- Zaina Bwale Godlove (Com & Brand) : Accès aux modules documentaires et partenariats Commons.

### LIVRABLES ATTENDUS :

1. STRUCTURE DE BASE DE DONNÉES (Google Sheets) :
   - Schéma détaillé du classeur unique avec colonnes ('Entity', 'Assignee', 'Status', 'Budget', etc.).

2. CODE BACKEND (Code.gs) :
   - Fonctions d'API complètes pour lire/écrire dans Sheets.
   - Synchronisation Calendar & Meet (créer une tâche critique crée un événement avec lien Google Meet).
   - Appel API Gemini (UrlFetchApp) passant en contexte la feuille active, le rôle de l'utilisateur connecté et l'entité sélectionnée.

3. CODE FRONTEND (Index.html) :
   - Code HTML unique avec CSS (Tailwind via CDN) et Javascript.
   - Intégration complète de la mise en page Asana Dark Mode.
   - Gestion dynamique du sélecteur d'entité et chargement asynchrone des listes de données sans recharger la page.
   - Panel de chat de l'assistant Gemini coulissant depuis la droite.

4. GUIDE D'INSTALLATION DÉTAILLÉ EN FRANÇAIS.
```
