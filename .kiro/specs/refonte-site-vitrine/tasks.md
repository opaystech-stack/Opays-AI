# Implementation Plan: Refonte Site Vitrine

## Overview

Cette refonte transforme le one-pager actuel en six pages publiques distinctes en réutilisant l'outillage existant (TanStack Router, React 19, Tailwind 4, Vite 7, Zod) sans nouvelle dépendance majeure. L'approche suit le principe de conception central : séparer le **contenu structuré** (`src/content/`) et un **noyau de logique pure** (`src/content/rules/`) du **rendu React** (`src/routes/`, `src/components/`).

L'implémentation progresse de l'intérieur vers l'extérieur : d'abord les types et données de contenu, puis le noyau de règles pures (testable par propriétés avec `fast-check`), puis les helpers SEO/éditoriaux, puis les composants partagés, et enfin le câblage des routes dans un layout public unique. Chaque étape s'appuie sur la précédente et se termine par une intégration concrète, sans code orphelin.

Langage d'implémentation : **TypeScript** (déterminé par la stack du design). Tests : **Vitest** + **fast-check** (PBT) + **Testing Library**.

## Tasks

- [x] 1. Établir le contenu structuré typé (source unique de vérité)
  - [x] 1.1 Définir les types et modules de données de contenu
    - Créer `src/content/offers.ts`, `method.ts`, `proof.ts`, `saas.ts`, `team.ts`, `navigation.ts`, `externalProjects.ts`
    - Définir les interfaces `Offer`, `ResumeOffre`, `MethodPhase`, `ProofMetric`, `SaasProduct`, `TeamMember`, `NavPage`, `CtaDiagnostic`, `ExternalProject`
    - Renseigner `CTA_DIAGNOSTIC` (libellé unique « Diagnostic gratuit », cible `/contact`) et `PUBLIC_PAGES` (6 pages)
    - Renseigner les données réelles : 3 paliers ordonnés, ≥ 4 phases couvrant les 4 catégories, métriques sourcées, ≥ 2 produits SaaS (dont Opays Nexus et Brand Content OS), 4 fondateurs nommés avec rôles
    - _Requirements: 1.1, 2.2, 3.1, 5.1, 5.4, 6.1, 6.2, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.3, 10.1, 13.1_

- [x] 2. Implémenter le noyau de règles — résumés d'offre
  - [x] 2.1 Implémenter `src/content/rules/resume.ts`
    - `validateResumeOffre` : 5 lignes non vides après trim, longueur 1..280
    - `orderedResumeLines` : restitue les 5 lignes dans l'ordre obligatoire
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x]* 2.2 Écrire le test de propriété pour la validation du résumé
    - **Property 7: Validation du Resume_Offre**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

  - [x]* 2.3 Écrire le test de propriété pour l'ordre des lignes
    - **Property 8: Ordre obligatoire des lignes du résumé**
    - **Validates: Requirements 4.6**

- [x] 3. Implémenter le noyau de règles — sélection des offres
  - [x] 3.1 Implémenter `src/content/rules/offers.ts`
    - `selectRenderableOffers` : filtre les paliers au résumé invalide (via `validateResumeOffre`), trie par ordre croissant d'engagement, expose les paliers omis avec leur motif
    - _Requirements: 3.1, 4.7_

  - [x]* 3.2 Écrire le test de propriété pour les paliers ordonnés et complets
    - **Property 3: Paliers ordonnés et complets**
    - **Validates: Requirements 3.1**

  - [x]* 3.3 Écrire le test de propriété pour l'omission des paliers incomplets
    - **Property 9: Omission des paliers incomplets**
    - **Validates: Requirements 4.7**

- [x] 4. Implémenter le noyau de règles — méthode
  - [x] 4.1 Implémenter `src/content/rules/method.ts`
    - `selectRenderablePhases` : ne conserve que les phases avec ≥ 1 livrable non vide ET une durée, triées par ordre chronologique
    - `coversRequiredCategories` : vrai ssi les 4 catégories obligatoires sont couvertes
    - _Requirements: 5.2, 5.3, 5.5, 5.6, 5.1, 5.4_

  - [x]* 4.2 Écrire le test de propriété pour l'omission des phases incomplètes
    - **Property 10: Omission des phases incomplètes**
    - **Validates: Requirements 5.2, 5.3, 5.6**

  - [x]* 4.3 Écrire le test de propriété pour l'ordre chronologique des phases
    - **Property 11: Ordre chronologique des phases**
    - **Validates: Requirements 5.5**

  - [x]* 4.4 Écrire le test de propriété pour la couverture des catégories
    - **Property 12: Couverture des catégories de méthode**
    - **Validates: Requirements 5.1, 5.4**

- [x] 5. Implémenter le noyau de règles — preuves
  - [x] 5.1 Implémenter `src/content/rules/proof.ts`
    - Définir `METRIC_BOUNDS` par catégorie
    - `selectRenderableMetrics` : conserve les métriques sourcées ET dans les bornes, plafonne à 6, requiert ≥ 3 métriques couvrant les 3 catégories
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x]* 5.2 Écrire le test de propriété pour la cardinalité et complétude des métriques
    - **Property 13: Cardinalité et complétude des métriques de preuve**
    - **Validates: Requirements 6.1, 6.2**

  - [x]* 5.3 Écrire le test de propriété pour l'exclusion des métriques non sourcées ou hors bornes
    - **Property 14: Exclusion des métriques non sourcées ou hors bornes**
    - **Validates: Requirements 6.4, 6.5**

  - [x]* 5.4 Écrire le test de propriété pour l'anonymat des preuves
    - **Property 15: Anonymat des preuves**
    - **Validates: Requirements 6.3**

- [x] 6. Implémenter le noyau de règles — équipe, SaaS, CTA, liens externes
  - [x] 6.1 Implémenter `src/content/rules/team.ts`
    - `selectRenderableMembers` : omet toute fiche sans nom OU sans rôle non vide
    - _Requirements: 7.1, 7.6_

  - [x]* 6.2 Écrire le test de propriété pour les fiches d'équipe complètes
    - **Property 16: Fiches d'équipe complètes**
    - **Validates: Requirements 7.1, 7.6**

  - [x] 6.3 Implémenter `src/content/rules/saas.ts`
    - `selectRenderableProducts` : longueurs nom 1..60 et description 40..300, plafonne à 12
    - `resolveProductAction` : lien d'accès si URL valide, sinon CTA_Diagnostic
    - _Requirements: 8.1, 8.2, 8.4, 8.6_

  - [x]* 6.4 Écrire le test de propriété pour la validité et cardinalité des produits
    - **Property 17: Validité et cardinalité des produits SaaS**
    - **Validates: Requirements 8.1, 8.2**

  - [x]* 6.5 Écrire le test de propriété pour la résolution de l'action d'un produit
    - **Property 18: Résolution de l'action d'un produit**
    - **Validates: Requirements 8.4, 8.6**

  - [x] 6.6 Implémenter `src/content/rules/cta.ts` et `src/content/rules/externalLinks.ts`
    - `resolveCta` : renvoie toujours le CTA unique (libellé + cible) depuis `CTA_DIAGNOSTIC`
    - `resolveExternalLink` : ne renvoie un lien que si l'URL est renseignée et absolue valide
    - _Requirements: 10.1, 10.3, 13.3, 13.4_

  - [x]* 6.7 Écrire le test de propriété pour l'absence de lien des chantiers non disponibles
    - **Property 32: Absence de lien pour chantier non disponible**
    - **Validates: Requirements 13.4**

- [x] 7. Checkpoint — Valider le noyau de règles
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implémenter les helpers SEO et éditoriaux (réutilisés/mutualisés avec le durcissement)
  - [x] 8.1 Implémenter ou réutiliser `src/lib/seo/meta.ts`
    - `buildPageMeta` : produit `<title>` (1..60, unique), meta `description` (50..160), `<link rel="canonical">` absolu ; échec de build si non conforme
    - Définir `PUBLIC_ROUTES` comme source unique propageant titre/description/canonical
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x]* 8.2 Écrire le test de propriété pour la conformité et l'unicité des titres
    - **Property 24: Conformité et unicité des balises title**
    - **Validates: Requirements 12.1**

  - [x]* 8.3 Écrire le test de propriété pour la conformité des descriptions
    - **Property 25: Conformité des balises description**
    - **Validates: Requirements 12.2**

  - [x]* 8.4 Écrire le test de propriété pour le canonical absolu et cohérent
    - **Property 26: Canonical absolu et cohérent**
    - **Validates: Requirements 12.4**

  - [x] 8.5 Implémenter ou réutiliser `src/lib/seo/sitemap.ts`
    - `buildSitemapXml` : liste toutes les pages publiques (et seulement elles) en URL absolues ; exclut prototypes et chantiers externes ; conserve l'état antérieur en cas d'échec d'ajout
    - `buildRobotsTxt` et directive `noindex` pour les prototypes internes
    - _Requirements: 12.5, 12.6, 12.8, 12.9, 13.5_

  - [x]* 8.6 Écrire le test de propriété pour les prototypes hors navigation et non indexables
    - **Property 27: Prototypes hors navigation et non indexables**
    - **Validates: Requirements 12.5**

  - [x]* 8.7 Écrire le test de propriété pour l'exclusion du sitemap des prototypes et chantiers externes
    - **Property 28: Exclusion du sitemap des prototypes et chantiers externes**
    - **Validates: Requirements 12.6, 13.5**

  - [x]* 8.8 Écrire le test de propriété pour la couverture exacte du sitemap
    - **Property 29: Couverture exacte du sitemap**
    - **Validates: Requirements 12.8**

  - [x] 8.9 Implémenter les helpers éditoriaux et de contraste
    - `src/lib/editorial/concision.ts` : longueur moyenne des phrases d'un bloc
    - `src/lib/editorial/jargon.ts` : filtre de la liste de mots interdits
    - `src/lib/theme/contrast.ts` : calcul du ratio de contraste
    - _Requirements: 11.3, 11.4, 11.5_

  - [x]* 8.10 Écrire le test de propriété pour le contraste lisible du texte principal
    - **Property 21: Contraste lisible du texte principal**
    - **Validates: Requirements 11.3**

  - [x]* 8.11 Écrire le test de propriété pour la concision éditoriale
    - **Property 22: Concision éditoriale**
    - **Validates: Requirements 11.4**

  - [x]* 8.12 Écrire le test de propriété pour l'absence de jargon interdit
    - **Property 23: Absence de jargon interdit**
    - **Validates: Requirements 11.5**

- [x] 9. Checkpoint — Valider les helpers SEO et éditoriaux
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implémenter les composants partagés
  - [x] 10.1 Implémenter `src/components/CtaDiagnostic.tsx`
    - Bouton CTA unique lisant `resolveCta()` ; gestion d'erreur si la cible est indisponible (message, contexte préservé)
    - _Requirements: 10.1, 10.2, 10.4, 10.5_

  - [x]* 10.2 Écrire le test de propriété pour l'invariant du CTA_Diagnostic
    - **Property 19: Invariant du CTA_Diagnostic**
    - **Validates: Requirements 10.1, 10.3, 9.6**

  - [x] 10.3 Mettre à jour `src/components/Navbar.tsx` (Navigation_Principale)
    - Lit `PUBLIC_PAGES` pour ses liens ; état actif distinct via `useMatchRoute`/`useRouterState` ; retire le lien prototype « Tenant 0 » ; CTA et liens externes conditionnels
    - _Requirements: 1.2, 1.6, 10.2, 12.5, 13.2_

  - [x]* 10.4 Écrire le test de propriété pour la couverture des liens de navigation
    - **Property 1: Couverture des liens de navigation**
    - **Validates: Requirements 1.2**

  - [x]* 10.5 Écrire le test de propriété pour l'unicité de l'état actif de navigation
    - **Property 2: Unicité de l'état actif de navigation**
    - **Validates: Requirements 1.6**

  - [x]* 10.6 Écrire le test de propriété pour l'invariance de la navigation face au registre externe
    - **Property 30: Invariance de la navigation face au registre externe**
    - **Validates: Requirements 13.2**

  - [x] 10.7 Mettre à jour `src/components/Footer.tsx` et implémenter `src/components/ExternalLink.tsx`
    - Footer : liens fonctionnels vers mentions légales et politique de confidentialité ; année dynamique
    - ExternalLink : nouvel onglet, `rel="noopener noreferrer"`, signalement visuel de lien externe
    - _Requirements: 12.7, 13.3_

  - [x]* 10.8 Écrire le test de propriété pour le rendu sécurisé des liens externes
    - **Property 31: Rendu sécurisé des liens externes**
    - **Validates: Requirements 13.3**

  - [x] 10.9 Implémenter `src/components/ProofBlock.tsx` et `src/components/TeamSection.tsx`
    - ProofBlock consomme `selectRenderableMetrics` ; TeamSection consomme `selectRenderableMembers`
    - Appliquer l'identité visuelle (glass, néon, framer-motion) avec lisibilité prioritaire
    - _Requirements: 6.1, 7.1, 11.1, 11.2, 11.3_

- [x] 11. Implémenter le layout public et les routes
  - [x] 11.1 Implémenter le layout public `src/routes/_public.tsx`
    - Monte `PublicLayout` (Navbar + `<Outlet/>` + Footer) ; garantit Navbar, footer légal et ≥ 1 CTA_Diagnostic sur toutes les pages publiques
    - Câbler les métadonnées de route via `head()` alimenté par `buildPageMeta`
    - _Requirements: 1.7, 10.2, 12.1, 12.2, 12.4, 12.7_

  - [x] 11.2 Implémenter `src/routes/index.tsx` (Page_Accueil)
    - Above-the-fold : désignation PME en croissance, message-pivot exact, trois axes différenciants ; portes d'entrée ; Bloc_Preuves ; Section_Equipe
    - Public cible unique (pas de liste sectorielle)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 7.1, 10.2, 11.1, 11.2_

  - [x] 11.3 Implémenter `src/routes/offres.tsx` (Page_Offres)
    - Consomme `selectRenderableOffers` ; rend les 3 paliers ordonnés, résumés ordonnés (`orderedResumeLines`), badge « Recommandé » sur le seul Palier_Systeme, mention porte d'entrée sur le seul Palier_Diagnostic, CTA par palier ; sans aucun montant ; message d'erreur si CTA indisponible
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.6, 10.2, 11.1_

  - [x]* 11.4 Écrire les tests de propriété de la page Offres
    - **Property 4: Absence de montant tarifaire** — **Validates: Requirements 3.2**
    - **Property 5: Unicité et placement des marqueurs de palier** — **Validates: Requirements 3.3, 3.4**
    - **Property 6: CTA présent dans chaque palier** — **Validates: Requirements 3.5**

  - [x] 11.5 Implémenter `src/routes/methode.tsx` (Page_Methode)
    - Consomme `selectRenderablePhases` ; affiche nom, livrables, durée par phase, ordre chronologique
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 10.2, 11.1_

  - [x] 11.6 Implémenter `src/routes/saas.tsx` (Page_SaaS)
    - Consomme `selectRenderableProducts` et `resolveProductAction` ; message « aucun produit » + CTA global si liste vide
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 10.2, 11.1_

  - [x] 11.7 Implémenter `src/routes/souverainete-rd.tsx` (Page_Souverainete_RD)
    - Section IA locale + principe « sans dépendre d'infrastructures que vous ne contrôlez pas » ; patrimoine cognitif et RBAC comme éléments du Palier_Transformation ; message-pivot exact ou lien accueil ; Fénelon Lamsasiri Lead R&D ; CTA vers contact
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 10.2, 11.1_

  - [x] 11.8 Implémenter `src/routes/contact.tsx` (Page_Contact)
    - Réutilise le composant `Contact` durci ; formulaire de Diagnostic gratuit ; cible du CTA unique
    - _Requirements: 10.2, 10.3, 11.1, 12.1, 12.2, 12.4_

  - [x]* 11.9 Écrire le test de propriété pour l'action principale unique et présente
    - **Property 20: Action principale unique et présente**
    - **Validates: Requirements 10.2, 10.5**

- [x] 12. Câblage final et nettoyage du one-pager
  - [x] 12.1 Remplacer la navigation par ancres par les routes réelles
    - Régénérer/mettre à jour `src/routeTree.gen.ts` ; retirer l'agrégation one-pager au profit des routes dédiées ; conserver `notFoundComponent` dans `__root.tsx` (page 404 + retour accueil)
    - Vérifier que les routes prototypes `tenant-0` et `bridges-os` restent hors navigation, hors sitemap et `noindex`
    - _Requirements: 1.1, 1.4, 1.5, 1.7, 12.5, 12.6_

  - [x]* 12.2 Écrire les tests d'exemple et de cas limites
    - Pages distinctes et URL directes (1.1, 1.4), page 404 (1.5), above-the-fold accueil (2.1, 2.2, 2.4, 2.5), public cible unique (2.3), fondateurs nommés (7.2–7.5), produits nommés (8.3), page souveraineté (9.1–9.5), footer légal (12.7), périmètre chantiers externes (13.1), cas d'erreur (3.6, 8.5, 10.4, 12.3, 12.9)
    - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 7.2, 7.3, 7.4, 7.5, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5, 12.7, 13.1_

  - [x]* 12.3 Écrire les tests d'intégration et smoke
    - Timing de navigation < 2 s (1.3, 10.3), navigation client sans rechargement (1.7), message clé visible en 1280×720 avant effets (11.2), build et lint sans erreur, génération du sitemap et des métadonnées
    - _Requirements: 1.3, 1.7, 10.3, 11.2_

- [x] 13. Checkpoint final — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Les tâches marquées `*` sont optionnelles (tests) et peuvent être ignorées pour un MVP plus rapide.
- Chaque tâche référence des sous-exigences précises pour la traçabilité.
- Chaque propriété de la section Correctness Properties du design est implémentée par un seul test de propriété (`fast-check`, `numRuns: 100`), placé au plus près de l'implémentation pour détecter les erreurs tôt.
- Les helpers SEO/sitemap (tâche 8) sont mutualisés avec le spec `site-hardening-amelioration` : les réutiliser s'ils existent déjà, sinon les créer.
- Aucune nouvelle dépendance majeure : réutilisation de TanStack Router, React 19, Tailwind 4, Vite 7, Zod.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "8.1", "8.9"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.1", "4.1", "5.1", "6.1", "6.3", "6.6", "8.2", "8.3", "8.4", "8.10", "8.11", "8.12"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.2", "4.3", "4.4", "5.2", "5.3", "5.4", "6.2", "6.4", "6.5", "6.7", "8.5"] },
    { "id": 4, "tasks": ["8.6", "8.7", "8.8", "10.1", "10.3", "10.7", "10.9"] },
    { "id": 5, "tasks": ["10.2", "10.4", "10.5", "10.6", "10.8", "11.1"] },
    { "id": 6, "tasks": ["11.2", "11.3", "11.5", "11.6", "11.7", "11.8"] },
    { "id": 7, "tasks": ["11.4", "11.9", "12.1"] },
    { "id": 8, "tasks": ["12.2", "12.3"] }
  ]
}
```
