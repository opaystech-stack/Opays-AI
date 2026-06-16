# Pathy — Plan de développement global

Date: 2026-05-28  
Statut: plan de développement personnel et multi-projets  
Références: Opays Business, Opays Commons, Hermes (moteur agentique), contexte personnel

## 1) Objectif réel

Pathy est le système personnel privé de pilotage du fondateur.
Son but n’est pas de “faire un autre projet”.
Son but est de :

- centraliser la vue d’ensemble de la vie personnelle et des affaires,
- réduire la charge mentale,
- suivre les décisions, projets, priorités et relations,
- déléguer le travail répétitif à des agents,
- garder la cohérence entre plusieurs branches d’activité,
- éviter les doublons et les oublis.

Hermes est le moteur agentique.
Pathy est le cockpit.

---

## 2) Périmètre de Pathy

Pathy couvre :

### A. Vie personnelle
- agenda,
- tâches personnelles,
- finances personnelles si souhaité,
- relations importantes,
- rappels,
- priorités de vie.

### B. Pilotage d’Opays
- vue d’ensemble de la branche business,
- synthèse des décisions,
- suivi des partenaires,
- suivi des livrables,
- priorités de direction.

### C. Pilotage d’Opays Commons
- suivi du projet communautaire,
- calendrier d’événements,
- contributions externes,
- partenaires,
- financement / subventions.

### D. Coordination des autres projets
- tout autre projet personnel ou professionnel qui demande un suivi régulier.

---

## 3) Ce que Pathy n’est pas

- pas un dépôt business public,
- pas un simple dossier de notes,
- pas un outil de communication externe,
- pas un clone de l’entreprise,
- pas un agent qui prend les décisions à ta place.

---

## 4) Architecture cible

### 4.1 Les 4 couches

#### Couche 1 — Mémoire
Ce qui existe déjà :
- décisions,
- projets,
- personnes,
- échéances,
- documents,
- historique utile.

#### Couche 2 — Orchestration
Le moteur d’agents (Hermes) :
- trie,
- résume,
- alerte,
- prépare,
- distribue les tâches.

#### Couche 3 — Exécution
Les agents spécialisés :
- stratégie,
- opérations,
- communication,
- recherche,
- partenariats,
- suivi personnel.

#### Couche 4 — Contrôle
- validation humaine,
- règles d’accès,
- séparation des contextes,
- audit,
- journal des décisions.

---

## 5) Dépôts recommandés

### A. Dépôt privé Pathy
Contient :
- la mémoire personnelle,
- les projets personnels,
- les synthèses,
- les décisions,
- les règles,
- les syncs Opays / Commons.

### B. Dépôt Opays Business
Contient :
- la branche commerciale,
- les offres,
- l’exécution business,
- les livrables,
- la gouvernance d’entreprise.

### C. Dépôt Opays Commons
Contient :
- la branche communautaire,
- les ressources open source,
- les ateliers,
- la contribution ouverte,
- la roadmap d’impact.

### D. Hermes
Le moteur agentique peut être :
- utilisé dans Pathy,
- connecté aux autres dépôts,
- ou déployé comme runtime séparé.

---

## 6) Agents nécessaires

On ne commence pas avec 15 agents.
On commence avec une base propre.

### Agent 1 — Orchestrateur
Fonction :
- vue globale,
- résumés,
- priorités,
- alertes,
- coordination.

### Agent 2 — Stratégie
Fonction :
- analyse des options,
- arbitrages,
- comparaison,
- recommandations.

### Agent 3 — Opérations
Fonction :
- checklists,
- tâches,
- plans d’action,
- suivi de l’exécution.

### Agent 4 — Recherche
Fonction :
- veille,
- recherche documentaire,
- synthèses,
- benchmarks.

### Agent 5 — Communication
Fonction :
- messages,
- brouillons,
- pitchs,
- notes partenaires.

### Agent 6 — Partenariats
Fonction :
- suivi des personnes,
- relances,
- engagement,
- historique.

### Agent 7 — Personal Care
Fonction :
- tâches perso,
- charge mentale,
- routine,
- priorités privées.

---

## 7) Règles de pilotage

### Règle 1
Tu valides les décisions importantes.

### Règle 2
Les agents préparent, synthétisent et exécutent le répétitif.

### Règle 3
Un seul système de mémoire centrale.

### Règle 4
Les contextes sont séparés :
- personnel,
- business,
- Commons,
- partenaires.

### Règle 5
Chaque projet a une revue régulière.

---

## 8) Flux quotidien

### Matin
Un agent te donne :
- urgences,
- priorités du jour,
- décisions en attente,
- points de blocage.

### Pendant la journée
Tu ne fais que :
- valider,
- demander une synthèse,
- déléguer,
- répondre aux points critiques.

### Soir
Un agent met à jour :
- ce qui a avancé,
- ce qui est bloqué,
- ce qui doit être repris.

---

## 9) Flux hebdomadaire

Une revue hebdomadaire courte :
- projets actifs,
- relations actives,
- tâches non terminées,
- décisions à prendre,
- priorités de la semaine suivante.

Sorties :
- synthèse,
- tableau de bord,
- liste de relances,
- liste des actions déléguées.

---

## 10) Flux mensuel

Une revue mensuelle plus structurée :
- état de chaque projet,
- avancée Opays Business,
- avancée Opays Commons,
- charge personnelle,
- relation avec partenaires,
- besoin de réallocation de temps.

Sorties :
- rapport mensuel,
- arbitrages,
- arrêt / maintien / accélération,
- prochaines décisions.

---

## 11) Séquence de développement recommandée

### Phase 1 — Fondation
1. Créer le dépôt privé Pathy.
2. Y définir les règles de séparation.
3. Y créer la mémoire de base.
4. Y brancher les projets existants.

### Phase 2 — Hermes comme runtime
1. Déployer Hermes comme moteur d’agents.
2. Définir les rôles.
3. Configurer les permissions.
4. Brancher les flux de résumé et de tri.

### Phase 3 — Synchronisation Opays
1. Connecter Pathy à Opays Business.
2. Ajouter le suivi des décisions et priorités.
3. Synchroniser les comptes-rendus utiles.
4. Garder les contextes séparés.

### Phase 4 — Synchronisation Commons
1. Ajouter le suivi du projet communautaire.
2. Ajouter la logique de contribution ouverte.
3. Ajouter les événements et partenaires.
4. Suivre les métriques d’impact.

### Phase 5 — Stabilisation
1. Réduire le bruit.
2. Renforcer la qualité des résumés.
3. Améliorer les automatismes.
4. Garder uniquement ce qui apporte une vraie valeur.

---

## 12) Priorités de construction

### Priorité 1
Vue d’ensemble fiable.

### Priorité 2
Mémoire centrale propre.

### Priorité 3
Agents utiles, pas trop nombreux.

### Priorité 4
Séparation stricte des contextes.

### Priorité 5
Cadence de pilotage simple et soutenable.

---

## 13) Risques à éviter

- tout centraliser sans séparation ;
- laisser Hermes écrire partout sans contrôle ;
- mélanger perso et business ;
- multiplier les agents sans besoin ;
- oublier de relier les décisions à leur contexte ;
- ajouter des projets sans revue.

---

## 14) Résultat attendu

Quand Pathy sera bien mis en place, tu devrais pouvoir :
- voir tout ce qui compte en un coup d’œil,
- déléguer le répétitif,
- garder la trace des décisions,
- gérer Opays sans t’y noyer,
- suivre Commons sans le confondre avec le business,
- garder ta vie personnelle sous contrôle,
- et décider plus vite avec moins de fatigue mentale.

---

## 15) Règle finale

Pathy doit rester simple à utiliser, mais puissant à l’intérieur.
Le système est réussi s’il te donne plus de clarté qu’il ne t’ajoute de charge.

