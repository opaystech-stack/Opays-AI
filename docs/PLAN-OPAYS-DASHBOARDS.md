# PLAN OPAYS DASHBOARDS
## Stratégie commerciale et feuille de route de développement

### Opays Tech — Ingénierie de l'efficacité pour PME et organisations
### Version 2.0 — Juillet 2026
### Devise : USD ($)

---

## SYNTHÈSE EXÉCUTIVE

**50 dashboards** répartis sur **7 catégories métier**, issus du scraping du site Axxe Digital. Chaque dashboard devient un **projet produit autonome** avec son propre cycle de vie, ses métriques et son positionnement commercial.

**Vision** : Transformer chaque dashboard en un environnement agentique où l'utilisateur dialogue avec son entreprise au lieu de naviguer une interface. L'utilisateur ne clique plus — il exprime une intention en langage naturel, le système comprend, planifie, exécute et confirme.

**Marché cible** : PME et organisations en RDC et Afrique francophone.

**Modèle** : SaaS mensuel par dashboard, packs par catégorie, enterprise sur devis.

**Devise** : Tous les prix sont en USD ($). Opays Tech opère en RDC où le dollar américain est la monnaie de référence. Les paiements se font en USD ou en équivalent CDF au taux du jour.

---

## 1. ARCHITECTURE COMMERCIALE

### 1.1 Matrice des catégories

| # | Catégorie | Dashboards | Marché cible | Priorité |
|---|-----------|------------|--------------|----------|
| 1 | ONG & Projets de développement | 8 | ONG, bailleurs, associations | 🔴 Haute |
| 2 | Audit & Conformité | 9 | Cabinets d'audit, QHSE, ISO | 🟡 Moyenne |
| 3 | Finance & Comptabilité | 7 | PME, cabinets comptables | 🔴 Haute |
| 4 | Ressources Humaines | 3 | PME, cabinets RH | 🔴 Haute |
| 5 | Commerce & Stock | 8 | Commerces, boutiques, CRM | 🔴 Haute |
| 6 | Services & Activités | 10 | Écoles, fitness, transport, events | 🔴 Haute |
| 7 | Production & Logistique | 5 | BTP, garages, agriculture | 🟡 Moyenne |

> **Note** : Les catégories RH, Commerce et Services ont été remontées en priorité haute car elles représentent le plus fort potentiel de volume de vente en RDC.

### 1.2 Stratégie de tarification (USD)

| Niveau | Prix mensuel | Contenu | Cible |
|--------|-------------|---------|-------|
| **Starter** | $15 - $25 | 1 dashboard simple, 1 utilisateur | TPE, commerçants |
| **Business** | $35 - $60 | 1 dashboard + agent agentique, 5 utilisateurs | PME |
| **Enterprise** | $100 - $300 | Multi-dashboards, API, MCP, agent illimité | ONG, grandes structures |
| **Pack catégorie** | $80 - $150 | Pack complet par catégorie (ex: Pack ONG) | Organisations |

### 1.3 Modèle de revenus

- **SaaS mensuel** par dashboard : $15 - $45/mois
- **Packs par catégorie** : $50 - $150/mois
- **Enterprise** : $100 - $300/mois (multi-dashboards, API, agent dédié)
- **Setup/onboarding** : $50 - $200 (ponctuel)

---

## 2. CATALOGUE COMPLET — 50 DASHBOARDS

### Catégorie 1 : ONG & Projets de développement (8 dashboards)

#### Produit 01 — Pack ONG & Projets de Développement
- **Slug** : `pack-ong-projets-de-dveloppement`
- **Type** : Pack complet (contient les 7 autres dashboards ONG)
- **Prix** : $80 - $150/mois
- **Marché RDC** : ONG internationales (USAID, PNUD, UE), bailleurs de fonds, associations locales
- **Priorité** : 🔴 P1 — Phase 1
- **Valeur** : ⭐⭐⭐⭐⭐
- **Description** : Suite complète pour piloter l'ensemble des projets : budget, bailleurs, bénéficiaires, M&E, PTA, risques et multi-projets.

#### Produit 02 — TDB Portefeuille Bailleurs (ONG)
- **Slug** : `tdb-portefeuille-bailleurs-ong`
- **Prix** : $25/mois
- **Marché** : ONG avec plusieurs bailleurs
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Gestion des bailleurs, financements, échéances et rapports par bailleur.

#### Produit 03 — TDB Suivi des Bénéficiaires
- **Slug** : `tdb-suivi-des-bnficiaires`
- **Prix** : $25/mois
- **Marché** : ONG, programmes sociaux
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐ — Obligatoire pour le reporting bailleur
- **Description** : Suivi des bénéficiaires, répartition, évolution et impact.

#### Produit 04 — TDB Monitoring & Évaluation (M&E)
- **Slug** : `tdb-monitoring-valuation-me`
- **Prix** : $30/mois
- **Marché** : ONG, institutions de développement
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐⭐ — Cœur du reporting M&E
- **Description** : Cadre logique, indicateurs, résultats, impacts.

#### Produit 05 — TDB Plan de Travail Annuel (PTA)
- **Slug** : `tdb-plan-de-travail-annuel-pta`
- **Prix** : $20/mois
- **Marché** : ONG, associations
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Plan d'activités, calendrier, responsable, budget par activité, suivi d'exécution.

#### Produit 06 — TDB Suivi Budgétaire Bailleur (ONG)
- **Slug** : `tdb-suivi-budgtaire-bailleur-cas-des-ong`
- **Prix** : $25/mois
- **Marché** : ONG avec subventions
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Dépenses par bailleur, par ligne budgétaire, taux d'exécution, alertes.

#### Produit 07 — TDB Multi-Projets
- **Slug** : `tdb-multi-projets`
- **Prix** : $25/mois
- **Marché** : ONG, bureaux d'études
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Vue consolidée des projets, statut, budget, risques.

#### Produit 08 — TDB Risques Projet
- **Slug** : `tdb-risques-projet`
- **Prix** : $20/mois
- **Marché** : ONG, PME avec projets
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Matrice des risques, probabilité, impact, plan de mitigation.

---

### Catégorie 2 : Audit & Conformité (9 dashboards)

#### Produit 09 — Pack Complet Audit QHSE
- **Slug** : `pack-complet-audit-qhse`
- **Type** : Pack complet (ISO 9001, 14001, 45001, 22000)
- **Prix** : $100 - $200/mois
- **Marché** : Cabinets d'audit, entreprises certifiées QHSE
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐⭐⭐
- **Description** : Suite complète d'audit QHSE couvrant toutes les normes ISO.

#### Produit 10 — TDB ISO/IEC 17025
- **Slug** : `tdb-iso-iec-17025`
- **Prix** : $35/mois
- **Marché** : Laboratoires d'analyse, métrologie
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐ — Marché de niche
- **Description** : Audit ISO/IEC 17025 pour laboratoires.

#### Produit 11 — TDB Audit ISO 22000
- **Slug** : `tdb-audit-iso22000`
- **Prix** : $30/mois
- **Marché** : Agroalimentaire, restauration collective
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Sécurité des denrées alimentaires : HACCP, points critiques, traçabilité.

#### Produit 12 — TDB ISO 9001
- **Slug** : `tdb-audit-iso-9001`
- **Prix** : $30/mois
- **Marché** : Toute entreprise cherchant la certification qualité
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐⭐ — Norme la plus demandée
- **Description** : Management de la qualité : processus, écarts, actions correctives.

#### Produit 13 — TDB ISO 45001
- **Slug** : `tdb-audit-iso-45001`
- **Prix** : $30/mois
- **Marché** : Entreprises industrielles, BTP
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Santé et sécurité au travail : risques, incidents, formations, KPIs.

#### Produit 14 — TDB ISO 14001
- **Slug** : `tdb-audit-iso-14001`
- **Prix** : $30/mois
- **Marché** : Entreprises industrielles, extractives
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Management environnemental : impacts, aspects, conformité réglementaire.

#### Produit 15 — Audit Interne & Contrôle de Gestion
- **Slug** : `tableau-de-bord-audit-interne-contrle-de-gestion`
- **Prix** : $35/mois
- **Marché** : Cabinets d'audit, directions financières
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Audit interne, contrôle budgétaire, anomalies, recommandations, suivi.

#### Produit 16 — Audit Financier & Comptable général
- **Slug** : `tableau-de-bord-audit-financier-comptable-gnral`
- **Prix** : $40/mois
- **Marché** : Cabinets d'audit, experts-comptables
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐⭐⭐
- **Description** : Audit financier complet : bilan, compte de résultat, ratios, anomalies.

#### Produit 17 — TDB Audit Système de Management
- **Slug** : `tdb-audit-systme-de-management`
- **Prix** : $30/mois
- **Marché** : Entreprises certifiées ISO
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Audit transverse du système de management.

---

### Catégorie 3 : Finance & Comptabilité (7 dashboards)

#### Produit 18 — Pack Complet Gestion Comptabilité PME
- **Slug** : `pack-complet-gestion-comptabilit-pme`
- **Type** : Pack complet
- **Prix** : $80 - $120/mois
- **Marché** : PME, cabinets comptables
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐⭐
- **Description** : Suite comptable complète : trésorerie, créances, paie, immobilisations, OHADA.

#### Produit 19 — TDB Trésorerie & Cash Flow
- **Slug** : `tdb-trsorerie-cash-flow-pilotez-votre-liquidit-en-`
- **Prix** : $25/mois
- **Marché** : Toutes PME — besoin universel
- **Priorité** : 🔴 P1 — Phase 1
- **Valeur** : ⭐⭐⭐⭐⭐
- **Description** : Liquidité en temps réel, prévisions, encaissements, décaissements, alertes.

#### Produit 20 — TDB Créances & Recouvrement
- **Slug** : `tdb-crances-recouvrement-relances-balance-ge-scori`
- **Prix** : $30/mois
- **Marché** : PME avec créances clients — besoin fort en Afrique
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Relances automatisées, balance âgée, scoring, pénalités automatiques.

#### Produit 21 — TDB Paie & Charges Sociales OHADA
- **Slug** : `tdb-paie-charges-sociales-ohada-bulletins-cnps-ir-`
- **Prix** : $35/mois
- **Marché** : Toutes PME — obligatoire mensuellement
- **Priorité** : 🔴 P1 — Phase 1
- **Valeur** : ⭐⭐⭐⭐⭐ — Récurrent garanti
- **Description** : Bulletins de paie, CNPS, IR, virements automatiques, conformité OHADA.

#### Produit 22 — TDB Immobilisations OHADA
- **Slug** : `tdb-immobilisations-ohada-amortissements-vnc-autom`
- **Prix** : $30/mois
- **Marché** : PME avec actifs, cabinets comptables
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Amortissements SYSCOHADA 2017, VNC automatique.

#### Produit 23 — TDB Budget Personnel
- **Slug** : `tdb-budget-personnel`
- **Prix** : $10/mois
- **Marché** : Particuliers
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐ — Grande diffusion, faible valeur unitaire
- **Description** : Budget personnel, revenus, dépenses, épargne, objectifs.

#### Produit 24 — TDB Tontine
- **Slug** : `tdb-tontine`
- **Prix** : $15/mois
- **Marché** : Tontines, mutuelles communautaires — très spécifique Afrique
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Gestion des tontines, cotisations, tours, échéances, participants.

---

### Catégorie 4 : Ressources Humaines (3 dashboards)

#### Produit 25 — Pack Complet Gestion RH
- **Slug** : `pack-complet-gestion-rh`
- **Type** : Pack complet
- **Prix** : $50 - $80/mois
- **Marché** : PME, cabinets RH
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Suite RH complète : congés, absences, performance, lien avec la paie.

#### Produit 26 — TDB Congés & Absences
- **Slug** : `tdb-congs-absences`
- **Prix** : $20/mois
- **Marché** : Toutes PME — besoin universel RH
- **Priorité** : 🔴 P1 — Phase 1 (Vague B)
- **Valeur** : ⭐⭐⭐⭐ — Simple à vendre, récurrent
- **Description** : Solde de congés, demandes, validations, calendrier, substitutions.

#### Produit 27 — TDB Performance Équipe
- **Slug** : `tdb-performance-quipe`
- **Prix** : $25/mois
- **Marché** : PME, directions RH
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Objectifs, évaluations, KPIs par employé, équipe, hiérarchie.

---

### Catégorie 5 : Commerce & Stock (8 dashboards)

#### Produit 28 — TDB CRM Commercial
- **Slug** : `tdb-crm-commercial-pipeline-clients-commissions-pe`
- **Prix** : $35/mois
- **Marché** : PME commerciales, agences
- **Priorité** : 🔴 P1 — Phase 1
- **Valeur** : ⭐⭐⭐⭐⭐ — Pipeline commercial fondamental
- **Description** : Pipeline, clients, commissions, performance commerciale, prévisions.

#### Produit 29 — TDB Épicerie
- **Slug** : `tdb-picerie`
- **Prix** : $20/mois
- **Marché** : Épiceries, supérettes — très grand volume en RDC
- **Priorité** : 🔴 P1 — Phase 1 (Vague B)
- **Valeur** : ⭐⭐⭐⭐ — Marché de masse
- **Description** : Stock, ventes, marges, péremptions, réapprovisionnement.

#### Produit 30 — TDB Poissonnerie
- **Slug** : `tdb-poissonnerie`
- **Prix** : $20/mois
- **Marché** : Poissonneries
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐
- **Description** : Stock par espèce, pertes, ventes, marges, traçabilité.

#### Produit 31 — TDB Librairie / Papeterie
- **Slug** : `tdb-librairie-papeterie`
- **Prix** : $20/mois
- **Marché** : Librairies, papeteries
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐
- **Description** : Catalogue, stock, ventes, commandes, fournisseurs.

#### Produit 32 — TDB Boulangerie
- **Slug** : `tdb-de-gestion-de-boulangerie`
- **Prix** : $20/mois
- **Marché** : Boulangeries — nombreux en RDC
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Production, ventes, stock matières premières, péremptions.

#### Produit 33 — TDB Boutique Électronique
- **Slug** : `tdb-de-gestion-de-boutique-lectronique`
- **Prix** : $20/mois
- **Marché** : Boutiques électroniques, réparateurs
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Catalogue, réparations, stock, ventes, garanties.

#### Produit 34 — TDB Auto-École
- **Slug** : `tdb-auto-cole-lves-code-leons-conduite-examens-mon`
- **Prix** : $25/mois
- **Marché** : Auto-écoles
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Élèves, code, leçons, examens, moniteurs, finances automatiques.

#### Produit 35 — TDB Agence Marketing Digitale
- **Slug** : `tdb-agence-marketing-digitale`
- **Prix** : $30/mois
- **Marché** : Agences marketing digital
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Clients, campagnes, budgets, performance, reporting client.

---

### Catégorie 6 : Services & Activités (10 dashboards)

#### Produit 36 — TDB École Privée
- **Slug** : `tdb-cole-prive-lves-frais-scolaires-notes-prsences`
- **Prix** : $30/mois
- **Marché** : Écoles privées — boom en RDC
- **Priorité** : 🔴 P1 — Phase 1 (Vague B)
- **Valeur** : ⭐⭐⭐⭐⭐ — Marché énorme et récurrent
- **Description** : Élèves, frais scolaires, notes, présences, personnel, finances automatiques.

#### Produit 37 — TDB Université École
- **Slug** : `tdb-universit-cole`
- **Prix** : $35/mois
- **Marché** : Universités, instituts supérieurs
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐
- **Description** : Étudiants, cursus, notes, inscriptions, finances, personnel.

#### Produit 38 — TDB Centre de Formation Linguistique
- **Slug** : `tdb-centre-de-formation-linguistique`
- **Prix** : $25/mois
- **Marché** : Centres de formation linguistique
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Étudiants, cours, formations, paiements, certifications.

#### Produit 39 — TDB Crèche
- **Slug** : `tdb-crche`
- **Prix** : $20/mois
- **Marché** : Crèches, garderies
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐
- **Description** : Enfants, présences, repas, planning, parents, facturation.

#### Produit 40 — TDB Fitness / Salle de Sport
- **Slug** : `tdb-fitness-salle-de-sport`
- **Prix** : $25/mois
- **Marché** : Salles de sport, coachs — forte croissance urbaine
- **Priorité** : 🔴 P1 — Phase 1 (Vague B)
- **Valeur** : ⭐⭐⭐⭐ — Abonnements récurrents
- **Description** : Membres, abonnements, présences, entraînements, paiements.

#### Produit 41 — TDB Service Traiteur
- **Slug** : `tdb-service-traiteur-menus-vnements-devis-stock-pe`
- **Prix** : $25/mois
- **Marché** : Restaurants, traiteurs, cantines — énorme marché urbain RDC
- **Priorité** : 🔴 P1 — Phase 1 (Vague B)
- **Valeur** : ⭐⭐⭐⭐⭐ — Marché de masse
- **Description** : Menus, événements, devis, stock, personnel, finances automatiques.

#### Produit 42 — TDB Taxi / VTC
- **Slug** : `tdb-taxi-vtc`
- **Prix** : $20/mois
- **Marché** : Chauffeurs VTC, flottes taxi
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Courses, chauffeurs, revenus, satisfaction, maintenance.

#### Produit 43 — TDB Agence Événementielle
- **Slug** : `tdb-agence-vnementielle-vnements-devis-budget-pres`
- **Prix** : $30/mois
- **Marché** : Agences événementielles
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Événements, devis, budget, prestataires, suivi.

#### Produit 44 — TDB Location de Voitures
- **Slug** : `tdb-location-de-voitures-flotte-contrats-entretien`
- **Prix** : $25/mois
- **Marché** : Sociétés de location automobile
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Flotte, contrats, entretien, clients, finances automatiques.

#### Produit 45 — TDB Parking Véhicules & Motos
- **Slug** : `tdb-parking-vhicules-motos`
- **Prix** : $15/mois
- **Marché** : Parkings publics, privés
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐
- **Description** : Entrées/sorties, tarifs, revenus, capacité, historique.

---

### Catégorie 7 : Production & Logistique (5 dashboards)

#### Produit 46 — Pack Complet Gestion BTP
- **Slug** : `pack-complet-de-gestion-btp`
- **Type** : Pack complet
- **Prix** : $80 - $120/mois
- **Marché** : Entreprises BTP, contractors — très actif en RDC
- **Priorité** : 🔴 P1 — Phase 1
- **Valeur** : ⭐⭐⭐⭐⭐
- **Description** : Chantiers, devis, matériaux, ouvriers, planning, finances BTP.

#### Produit 47 — TDB Garage Auto
- **Slug** : `tdb-garage-auto`
- **Prix** : $25/mois
- **Marché** : Garages automobiles
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐
- **Description** : Réparations, véhicules, pièces, mécaniciens, facturation.

#### Produit 48 — TDB Pièces Auto
- **Slug** : `tdb-pices-auto-catalogue-stock-ventes-devis-garage`
- **Prix** : $25/mois
- **Marché** : Commerces pièces auto, garages
- **Priorité** : Phase 2
- **Valeur** : ⭐⭐⭐⭐ — Marché actif
- **Description** : Catalogue, stock, ventes, devis, garages, finances.

#### Produit 49 — TDB Aviculture
- **Slug** : `tdb-aviculture`
- **Prix** : $20/mois
- **Marché** : Élevages avicoles
- **Priorité** : Phase 4
- **Valeur** : ⭐⭐⭐
- **Description** : Lots, aliment, mortalité, ponte, ventes, finances.

#### Produit 50 — TDB Gantt Planning
- **Slug** : `tdb-gantt-planning`
- **Prix** : $25/mois
- **Marché** : Tout projet multi-tâches (BTP, ONG, événementiel)
- **Priorité** : Phase 3
- **Valeur** : ⭐⭐⭐⭐ — Transverse
- **Description** : Diagramme de Gantt interactif, tâches, jalons, dépendances, ressources.

---

## 3. FEUILLE DE ROUTE DE DÉVELOPPEMENT

### Phase 1 — Fondamentaux + Volume (Mois 1-3)
**Objectif** : Sortir les 10 dashboards prioritaires — haute valeur + volume rapide

> **Stratégie** : 5 dashboards à haute valeur (ONG, Finance, BTP) ciblant des clients à fort panier, + 5 dashboards à fort volume (RH, Commerce, Services) ciblant des marchés de masse avec des cycles de vente courts.

#### Vague A — Haute valeur (produits phares)

| # | Dashboard | Pourquoi | Délai |
|---|-----------|----------|-------|
| 1 | **Pack ONG complet** | Produit phare. Marché bailleurs (USAID, UE, PNUD). Panier élevé ($80-150/mois). Clients à long terme. | 4 sem |
| 2 | **Trésorerie & Cash Flow** | Besoin universel PME. Tout client en a besoin. Se vend en crossover avec tous les autres dashboards. | 3 sem |
| 3 | **CRM Commercial** | Pipeline commercial fondamental. Tout commerce en a besoin. | 3 sem |
| 4 | **Paie & Charges OHADA** | Obligatoire mensuellement. Récurrent garanti. Conformité légale = motivation d'achat forte. | 4 sem |
| 5 | **Pack BTP complet** | Marché BTP très actif en RDC (chantiers partout). Panier élevé ($80-120/mois). | 4 sem |

#### Vague B — Volume rapide (marchés de masse)

| # | Dashboard | Pourquoi | Délai |
|---|-----------|----------|-------|
| 6 | **Service Traiteur** | Restaurants, traiteurs, cantines — énorme marché urbain RDC. Cycle de vente court. | 2 sem |
| 7 | **Congés & Absences** | Besoin universel RH. Tout employeur en a besoin. Simple à comprendre, simple à vendre. | 2 sem |
| 8 | **Épicerie** | Commerces de quartier — très grand volume. Vente en masse possible (démarchage porte-à-porte). | 2 sem |
| 9 | **École Privée** | RDC = boom des écoles privées. Marché énorme et récurrent (frais scolaires mensuels). | 3 sem |
| 10 | **Fitness / Salle de Sport** | Salles de sport en forte croissance urbaine. Abonnements récurrents = MRR prévisible. | 2 sem |

> **Raisonnement Vague B** : Ces 5 dashboards ciblent des marchés de masse avec des besoins opérationnels simples et immédiats. Un traiteur, une épicerie ou une salle de sport peut souscrire en 5 minutes — pas de cycle de vente long comme les ONG. Le ticket est plus petit ($20-25/mois) mais le volume potentiel est énorme.

### Phase 2 — Expansion (Mois 3-5)
**Objectif** : Couvrir les besoins prioritaires des catégories hautes et compléter les packs

| # | Dashboard | Pourquoi | Délai |
|---|-----------|----------|-------|
| 11 | **M&E (ONG)** | Cœur du reporting bailleur. Complète le pack ONG. | 3 sem |
| 12 | **Suivi Bénéficiaires** | Complète le pack ONG. Obligatoire pour le reporting. | 2 sem |
| 13 | **Créances & Recouvrement** | Besoin fort en Afrique. Recouvrement = argent direct. | 3 sem |
| 14 | **Immobilisations OHADA** | Conformité fiscale. Complète le pack comptabilité. | 2 sem |
| 15 | **Pack Comptabilité PME** | Finalise la catégorie finance. | 2 sem |
| 16 | **Pack RH complet** | Finalise la catégorie RH. | 2 sem |
| 17 | **Pièces Auto** | Marché actif. Complète la catégorie commerce. | 2 sem |
| 18 | **Université École** | Complète l'offre éducation. | 3 sem |

### Phase 3 — Diversification (Mois 5-7)
**Objectif** : Couvrir les catégories Audit et Production, finaliser les transverses

| # | Dashboard | Pourquoi | Délai |
|---|-----------|----------|-------|
| 19 | **Audit Interne** | Contrôle de gestion transverse | 3 sem |
| 20 | **ISO 9001** | Norme la plus demandée | 2 sem |
| 21 | **Pack QHSE complet** | Finalise la catégorie audit | 3 sem |
| 22 | **Gantt Planning** | Transverse, utile pour tous les projets | 2 sem |
| 23 | **Performance Équipe** | Complète le pack RH | 2 sem |
| 24 | **Boulangerie** | Marché spécifique mais nombreux | 2 sem |
| 25 | **Location de Voitures** | Marché urbain | 2 sem |
| 26 | **Taxi / VTC** | Marché urbain | 2 sem |
| 27 | **Garage Auto** | Marché spécifique | 2 sem |

### Phase 4 — Longue traîne (Mois 7-9)
**Objectif** : Finaliser les 50 dashboards

| Dashboards restants | Délai |
|---------------------|-------|
| 23 dashboards restants | 8-10 sem |

---

## 4. ARCHITECTURE TECHNIQUE PAR DASHBOARD

### Stack commune
```
Frontend    → React + TypeScript + Tailwind + TanStack Router
Backend     → API REST (Bun + Elysia) ou GraphQL
Agent       → LLM + tool-use (MCP protocol)
UI Fallback → Page Agent (Alibaba) — cloné dans tools/page-agent
Mémoire     → Base vectorielle + stock persistant
Hosting     → VPS Hostinger + Dokploy
```

### Intégration agentique
Chaque dashboard intègre le **skill `dashboard-agentique`** :
1. L'utilisateur exprime une intention en langage naturel
2. L'agent comprend, planifie, exécute
3. L'agent utilise les outils métier (API, DB, ou page-agent en fallback)
4. L'agent confirme et répond

### Pipeline de traitement
```
Entrée utilisateur (texte ou voix)
  → Compréhension de l'intention
  → Extraction des entités métier
  → Normalisation des données
  → Déduction du contexte métier
  → Planification des actions
  → Sélection des outils (API / DB / UI)
  → Exécution des actions
  → Vérification des résultats
  → Confirmation utilisateur (si nécessaire)
  → Réponse finale (texte ou voix)
```

### Priorité des actions
1. API directe (MCP / backend)
2. Base de données directe
3. Services internes
4. Interface utilisateur (Page Agent) — dernier recours

### Structure de projet type (chaque dashboard = projet séparé)
```
dashboards/01-pack-ong/
  ├── apps/
  │   ├── web/          # Frontend React
  │   ├── api/          # Backend API
  │   └── agent/        # Agent LLM + MCP
  ├── packages/
  │   ├── shared/       # Types communs
  │   └── tools/        # Outils métier (create_sale, update_stock, etc.)
  ├── docs/             # Documentation produit
  └── README.md         # Pitch commercial + technique
```

---

## 5. STRATÉGIE COMMERCIALE

### 5.1 Canaux de vente

1. **Site vitrine** : Pages produit individuelles avec démo interactive
2. **Prospection directe** : ONG, cabinets d'audit, écoles privées, BTP
3. **Démarchage de masse** : Épiceries, restaurants, salles de sport (Vague B)
4. **Partenariats** : Cabinets comptables, consultants QHSE
5. **Réseaux** : Chambres de commerce, fédérations professionnelles, associations ONG

### 5.2 Arguments de vente par catégorie

| Catégorie | Argument clé |
|-----------|-------------|
| **ONG** | "Reportings bailleurs en un clic. Conformité aux exigences USAID/UE/PNUD." |
| **Audit** | "Préparez vos certifications ISO sans cabinet externe." |
| **Finance** | "Conformité OHADA automatique. Paie sans erreur. Trésorerie en temps réel." |
| **RH** | "Gérez vos équipes sans tableur. Congés et performance en temps réel." |
| **Commerce** | "Pilotez votre stock et vos ventes depuis votre téléphone." |
| **Services** | "Un dashboard métier pour votre activité spécifique." |
| **Production** | "Planifiez, exécutez et facturez vos chantiers en toute fluidité." |

### 5.3 Arguments de vente Vague B (volume)

| Dashboard | Argument de vente rapide |
|-----------|--------------------------|
| **Service Traiteur** | "Vos menus, événements et devis sur un seul écran. Plus de papier." |
| **Congés & Absences** | "Vos employés demandent leurs congés sur WhatsApp. Vous validez en un clic." |
| **Épicerie** | "Sachez exactement ce que vous avez en stock. Plus de ruptures." |
| **École Privée** | "Frais scolaires, notes et présences dans un seul dashboard. Les parents voient tout." |
| **Fitness** | "Vos abonnés, leurs présences et leurs paiements automatiques." |

### 5.4 Cycles de vente

| Type de client | Cycle | Dashboard | Prix |
|----------------|-------|-----------|------|
| ONG / institution | Long (2-3 mois) | Pack ONG, M&E | $80-150/mois |
| PME établie | Moyen (2-4 sem) | Trésorerie, Paie, CRM | $25-35/mois |
| TPE / commerce | Court (1-3 jours) | Épicerie, Traiteur, Fitness | $20-25/mois |
| École privée | Court-Moyen (1-2 sem) | École Privée | $30/mois |
| Entreprise BTP | Moyen (3-6 sem) | Pack BTP | $80-120/mois |

### 5.5 Packs prioritaires

| Pack | Dashboards inclus | Prix pack (USD) | Économie vs unitaire |
|------|-------------------|-----------------|---------------------|
| Pack ONG | 8 dashboards | $80 - $150 | 30% |
| Pack Audit QHSE | 5 dashboards ISO | $100 - $200 | 35% |
| Pack Comptabilité PME | 7 dashboards finance | $80 - $120 | 35% |
| Pack RH | 3 dashboards | $50 - $80 | 25% |
| Pack BTP | 5 dashboards | $80 - $120 | 30% |

---

## 6. PROJECTION DE REVENUS (6 MOIS)

| Mois | Dashboards actifs | Clients estimés | MRR estimé (USD) |
|------|--------------------|-----------------|-------------------|
| M1 | 5 (Vague A) | 10 | $250 |
| M2 | 5 | 20 | $500 |
| M3 | 10 (Vague A+B) | 40 | $1 000 |
| M4 | 10 | 60 | $1 500 |
| M5 | 18 | 85 | $2 125 |
| M6 | 18 | 120 | $3 000 |

*Hypothèse : panier moyen de $25/client/mois*

> **Note RDC** : Le marché local utilise le USD comme monnaie de référence. Les paiements se font en USD ou en équivalent CDF au taux du jour. Les ONG paient en USD directement.

### Projection étendue (12 mois)

| Mois | Dashboards actifs | Clients | MRR (USD) | ARR (USD) |
|------|--------------------|---------|-----------|------------|
| M6 | 18 | 120 | $3 000 | $36 000 |
| M9 | 27 | 200 | $5 000 | $60 000 |
| M12 | 50 | 350 | $8 750 | $105 000 |

*Objectif : 350 clients actifs sur 50 dashboards à 12 mois, avec un panier moyen de $25/mois.*

---

## 7. MÉTRIQUES DE SUCCÈS PAR DASHBOARD

Chaque dashboard suit ces KPIs :

| KPI | Description |
|-----|-------------|
| **MRR** | Revenu mensuel récurrent généré par ce dashboard |
| **Churn rate** | Taux de désabonnement mensuel |
| **Activation rate** | % de clients actifs vs inscrits |
| **Time-to-value** | Temps entre inscription et première valeur obtenue |
| **NPS** | Net Promoter Score |
| **Agent usage** | % d'interactions via l'agent vs UI manuelle |
| **Tickets support** | Nombre de tickets support par mois |

---

## 8. MARCHÉ RDC — ANALYSE SPÉCIFIQUE

### 8.1 Contexte

- **Population** : ~100 millions d'habitants
- **Devise** : USD (monnaie de référence) + CDF (Franc Congolais)
- **Économie** : Fort secteur informel, ONG nombreuses, croissance PME urbaines
- **Villes cibles** : Kinshasa, Lubumbashi, Goma, Bukavu, Matadi, Kisangani

### 8.2 Segments prioritaires en RDC

| Segment | Taille estimée | Dashboards pertinents | Potentiel |
|---------|---------------|----------------------|-----------|
| ONG internationales | 200+ | Pack ONG | 🔴 Très fort |
| ONG locales | 500+ | Pack ONG | 🔴 Très fort |
| Écoles privées | 5 000+ | École Privée, Université | 🔴 Très fort |
| Épiceries / supérettes | 50 000+ | Épicerie | 🔴 Très fort |
| Restaurants / traiteurs | 10 000+ | Service Traiteur | 🔴 Très fort |
| Salles de sport | 500+ | Fitness | 🟡 Moyen |
| Entreprises BTP | 1 000+ | Pack BTP, Gantt | 🔴 Très fort |
| Garages / pièces auto | 5 000+ | Garage Auto, Pièces Auto | 🟡 Moyen |
| PME avec employés | 10 000+ | Paie OHADA, Congés, CRM | 🔴 Très fort |
| Cabinets comptables | 200+ | Pack Comptabilité, Audit | 🟡 Moyen |

### 8.3 Avantages concurrentiels Opays

1. **Agentique** : Seul dashboard sur le marché RDC avec un agent IA intégré — l'utilisateur dialogue avec son entreprise
2. **Conformité OHADA** : Respect des normes comptables locales
3. **Marché de niche** : Dashboards sectoriels vs solutions génériques
4. **Prix accessible** : $15-45/mois vs $100-500/mois pour les solutions internationales
5. **Support local** : Équipe basée en RDC, compréhension du terrain

---

## 9. PROCHAINES ÉTAPES

- [ ] Valider le plan commercial pour les 10 produits prioritaires
- [ ] Créer les projets Git pour chaque dashboard (10 repos séparés)
- [ ] Définir le backlog détaillé du premier produit (Pack ONG)
- [ ] Designer les maquettes des dashboards Vague A
- [ ] Configurer les dépôts Dokploy pour le déploiement continu
- [ ] Préparer les démos pour la prospection commerciale
- [ ] Lancer la prospection ONG (Vague A) et le démarchage TPE (Vague B) en parallèle

---

## 10. GOUVERNANCE DU PLAN

- **Révision mensuelle** : Ajuster les priorités selon le feedback marché
- **Métriques de pilotage** : MRR, churn, activation par dashboard
- **Décisions de pivot** : Si un dashboard n'atteint pas 10 clients en 2 mois, revoir le positionnement
- **Décisions de scale** : Si un dashboard dépasse 50 clients, lui allouer une équipe dédiée

---

*Document vivant — Opays Tech — Version 2.0 — Juillet 2026*
*Devise : USD ($)*
*Mise à jour : mensuelle selon feedback marché et avancement développement*

---

## 11. ANALYSE CONCURRENTIELLE — U-COMPTA (UBS Congo)

### 11.1 Présentation

**U-COMPTA** est une application web comptable développée par **UBS Congo** (RDC), conforme aux normes **OHADA** et **SYCEBNL**. Elle cible exactement le même marché qu'Opays Tech : micro-entreprises, PME, ONG et associations locales.

- **Site** : https://compta.ubscongo.com/
- **Éditeur** : UBS Congo
- **Contact** : ucompta@ubscongo.com · +243 974 000 566
- **Modèle** : SaaS annuel (pas mensuel)

### 11.2 Fonctionnalités U-COMPTA

| Fonctionnalité | Description |
|----------------|-------------|
| Journal comptable | Enregistrement des opérations diverses |
| Journal de Caisse & Banque | Mouvements de trésorerie |
| Balance de Comptes | Soldes Débit/Crédit, vérification |
| Plan de Comptes OHADA | Comptes classés (Actif, Passif, Produits, Charges) |
| Grand-Livre | Registre complet par compte et par date |
| Bilan comptable automatisé | Patrimoines et ressources |
| Compte de Résultats | Simplifié et détaillé |
| Flux de Trésoreries | CAF, solvabilité, flux d'investissement/financement |
| Suivi des Amortissements | Calcul automatique des immobilisations |
| Suivi Budgétaire | Exécution du budget en temps réel |
| Gestion de Stock | Entrées/sorties en quantité et valeur |
| Facturation Numérisée | UJUZI FACTURE — reçus, factures, bons, envoi par mail |
| Gestion multi-utilisateurs | Rôles : administrateur, comptable, caissier |
| Exportation | PDF, Excel, CSV |
| Sécurité | Cryptage bout-en-bout |

### 11.3 Tarifs U-COMPTA (annuels)

| Plan | Prix/an (USD) | Prix/mois équiv. | Limites |
|------|---------------|-----------------|---------|
| **Démo** | Gratuit | $0 | 10 écritures, 5 comptes, 2 budgets |
| **Start** | $99.90 | ~$8.33 | Illimité écritures, 150 comptes, 2 utilisateurs |
| **Smart** | $299.90 | ~$25 | 250 comptes, 3 utilisateurs, bilan, grand-livre |
| **Smart Plus** | $599.90 | ~$50 | 500 comptes, 5 utilisateurs, suivi budgétaire, 10 projets |
| **Full Package** | $799.90 | ~$66.66 | Tout illimité, 5 utilisateurs |

### 11.4 Comparaison Opays Tech vs U-COMPTA

| Critère | U-COMPTA (UBS Congo) | Opays Tech |
|---------|---------------------|------------|
| **Modèle** | SaaS annuel | SaaS mensuel (plus flexible) |
| **Prix entry** | $99.90/an (~$8/mois) | $15-25/mois |
| **Prix premium** | $799.90/an (~$67/mois) | $80-150/mois (pack) |
| **Conformité** | OHADA + SYCEBNL | OHADA |
| **Couverture** | Comptabilité uniquement | 7 catégories métier (50 dashboards) |
| **Agent IA** | ❌ Non | ✅ Agent agentique intégré |
| **UI Fallback** | ❌ Non | ✅ Page Agent (Alibaba) |
| **Mémoire métier** | ❌ Non | ✅ Apprentissage continu |
| **Multi-dashboard** | ❌ Non (1 seule app) | ✅ 50 dashboards sectoriels |
| **Marché cible** | RDC (confirmed) | RDC + Afrique francophone |
| **Facturation** | UJUZI FACTURE | À intégrer |
| **Gestion stock** | Basique | Dashboards Commerce dédiés |

### 11.5 Leçons stratégiques pour Opays Tech

1. **U-COMPTA valide le marché** : il existe une demande réelle pour des outils comptables OHADA en RDC. Le marché est confirmé.

2. **Prix annuel vs mensuel** : U-COMPTA facture à l'année ($100-800/an). Opays facture au mois ($15-150/mois = $180-1800/an). Opays est plus cher mais plus flexible. Justifier le premium par l'agent IA.

3. **Couverture U-COMPTA** : uniquement la comptabilité. Opays couvre 7 catégories. C'est un avantage différenciant majeur — mais U-COMPTA a une longueur d'avance sur la fonctionnalité comptable pure.

4. **Fonctionnalités à reprendre** :
   - **Facturation numérisée** (UJUZI FACTURE) → ajouter un module de facturation dans nos dashboards Finance
   - **Conformité SYCEBNL** → au-delà d'OHADA, ajouter le SYCEBNL (système comptable des établissements bancaires non-bancaires)
   - **Export Excel/CSV** → checker que tous nos dashboards l'offrent
   - **Essai gratuit** → U-COMPTA propose un compte démo gratuit, Opays doit faire pareil

5. **Positionnement** : U-COMPTA est un **outil**. Opays est une **plateforme agentique**. L'argument de vente : *"U-COMPTA vous aide à saisir votre comptabilité. Opays dialogue avec votre entreprise et agit pour vous."*

6. **Cibles communes** : U-COMPTA vise explicitement "Commerçants, PME, ONG, Écoles". Ce sont exactement les segments Vague A+B d'Opays. Il faut se positionner face à ce concurrent sur ces segments.

### 11.6 Recommandations actionnables

- [ ] Ajouter la **facturation numérisée** dans le Pack Comptabilité PME (Produit 18)
- [ ] Ajouter le **suivi budgétaire** dans Trésorerie & Cash Flow (Produit 19)
- [ ] Intégrer la conformité **SYCEBNL** dans Paie & Charges OHADA (Produit 21)
- [ ] Offrir un **essai gratuit** (compte démo) sur tous les dashboards
- [ ] Inclure **export Excel/CSV** dans tous les dashboards
- [ ] Préparer un **argumentaire concurrentiel** : Opays vs U-COMPTA pour les commerciaux
- [ ] Surveiller U-COMPTA régulièrement (roadmap, nouvelles fonctionnalités, prix)

---

*Fin du document*
