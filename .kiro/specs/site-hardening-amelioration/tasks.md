# Implementation Plan: Durcissement et amélioration du Site Public

## Overview

Le plan traduit la conception en une série de tâches de codage incrémentales en TypeScript, exécutées avec l'outillage déjà présent (Vite, Vitest, `fast-check`, Zod, TanStack, Cloudflare). Chaque tâche s'appuie sur les précédentes et se termine par un câblage concret, sans code orphelin. L'ordre suit les quatre familles de travail du design : durcissement de l'API de contact, référencement/indexation, conformité/confidentialité, puis qualité front et performance.

Les tâches marquées `*` sont des tâches de test optionnelles (tests de propriété, tests unitaires, tests d'intégration). Les tests de propriété utilisent `fast-check` avec `numRuns: 100` minimum et référencent chaque propriété de conception via le commentaire `Feature: site-hardening-amelioration, Property {n}: {texte}`.

## Tasks

- [x] 1. Mettre en place l'outillage de test et les types partagés du périmètre contact
  - Installer/configurer Vitest et `fast-check` dans le projet (scripts `test` et `test:run`)
  - Créer le dossier `src/server/contact/` et `src/lib/seo/`
  - Définir les types partagés `ContactFields`, `ValidationResult`, `EmailConfig`, `RateLimitConfig`, `RateLimitStore` dans un module de types
  - _Requirements: 1.4, 4.1_

- [x] 2. Implémenter la validation serveur des soumissions de contact
  - [x] 2.1 Implémenter le schéma Zod et `validateContactRequest`
    - Écrire `src/server/contact/validation.ts` : schéma Zod (chaînes obligatoires 0..2000, `contact` au format e-mail si fourni comme e-mail, honeypot `website` optionnel)
    - Encoder les règles de transport : méthode ≠ POST → 405, `Content-Type` ≠ `application/json` → 415, JSON invalide → 400, champ absent/non-chaîne → 400 avec message descriptif, longueur > 2000 → 400, chaîne vide acceptée
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 2.2 Écrire le test de propriété : rejet des méthodes non-POST
    - **Property 1: Rejet des méthodes non-POST**
    - **Validates: Requirements 1.1**

  - [ ]* 2.3 Écrire le test de propriété : rejet des Content-Type non JSON
    - **Property 2: Rejet des Content-Type non JSON**
    - **Validates: Requirements 1.2**

  - [ ]* 2.4 Écrire le test de propriété : rejet du JSON invalide
    - **Property 3: Rejet du JSON invalide**
    - **Validates: Requirements 1.3**

  - [ ]* 2.5 Écrire le test de propriété : champs obligatoires de type chaîne
    - **Property 4: Champs obligatoires de type chaîne**
    - **Validates: Requirements 1.4, 1.5**

  - [ ]* 2.6 Écrire le test de propriété : frontière de longueur des champs
    - **Property 5: Frontière de longueur des champs**
    - **Validates: Requirements 1.6, 1.7**

  - [ ]* 2.7 Écrire le test de propriété : validation du format e-mail du champ contact
    - **Property 6: Validation du format e-mail du champ contact**
    - **Validates: Requirements 1.8**

- [x] 3. Implémenter l'échappement HTML et le gabarit d'e-mail
  - [x] 3.1 Implémenter `escapeHtml` et `buildEmailHtml`
    - Écrire `src/server/contact/escape.ts` : échappement de `&`, `<`, `>`, `"`, `'` sans double-échappement destructeur
    - Construire le Modele_Email en échappant chaque valeur insérée
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 3.2 Écrire le test de propriété : neutralisation de l'injection HTML
    - **Property 8: Neutralisation de l'injection HTML**
    - **Validates: Requirements 2.1, 2.3**

  - [ ]* 3.3 Écrire le test de propriété : round-trip de lisibilité après échappement
    - **Property 9: Round-trip de lisibilité après échappement**
    - **Validates: Requirements 2.2**

- [x] 4. Implémenter l'anti-spam (honeypot + limitation de débit)
  - [x] 4.1 Implémenter `isHoneypotTriggered` et `checkRateLimit`
    - Écrire `src/server/contact/antispam.ts` : détection du honeypot, limitation de débit par IP sur fenêtre glissante via `RateLimitStore`, désactivable par configuration, réponse 429 au dépassement
    - Fournir une implémentation de `RateLimitStore` en mémoire pour les tests et une implémentation compatible edge (KV/cache TTL)
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ]* 4.2 Écrire le test de propriété : honeypot rempli ignoré silencieusement
    - **Property 10: Honeypot rempli ignoré silencieusement**
    - **Validates: Requirements 3.2**

  - [ ]* 4.3 Écrire le test de propriété : limitation de débit par fenêtre
    - **Property 11: Limitation de débit par fenêtre**
    - **Validates: Requirements 3.3, 3.4**

- [x] 5. Implémenter la résolution de configuration d'envoi
  - [x] 5.1 Implémenter `resolveEmailConfig`
    - Écrire `src/server/contact/config.ts` : lecture de `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` depuis l'environnement
    - Échec propre 500 si une variable est absente, avec message de log sans secret (ni adresse, ni clé)
    - _Requirements: 4.1, 4.2_

  - [ ]* 5.2 Écrire le test de propriété : échec de configuration sans fuite de secret
    - **Property 12: Échec de configuration sans fuite de secret**
    - **Validates: Requirements 4.1, 4.2**

- [x] 6. Câbler le handler edge de l'API de contact
  - [x] 6.1 Réécrire `api/send.ts` comme couche de transport mince
    - Orchestrer : `validateContactRequest` → `isHoneypotTriggered` (200 silencieux) → `resolveEmailConfig` (500) → `checkRateLimit` (429) → `buildEmailHtml` + envoi Resend
    - Répondre 200 même en cas de défaillance aval du Service_Email ; journaliser l'échec (IP tronquée, sans secret)
    - Utiliser l'adresse expéditrice rattachée au domaine vérifié ; retirer toute valeur en dur du source
    - _Requirements: 1.9, 1.10, 4.3, 4.4_

  - [ ]* 6.2 Écrire le test de propriété : soumission valide acceptée indépendamment de l'aval
    - **Property 7: Soumission valide acceptée indépendamment de l'aval**
    - **Validates: Requirements 1.9, 1.10**

  - [ ]* 6.3 Écrire les tests d'intégration du handler
    - Harnais de requêtes HTTP brutes avec mock Resend (succès/échec) ; vérifier codes 200/400/405/415/429/500
    - Smoke : absence de secret dans le source, domaine expéditeur vérifié
    - _Requirements: 4.3, 4.4_

- [x] 7. Checkpoint - Valider la couche API de contact
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implémenter le générateur de métadonnées SEO
  - [x] 8.1 Implémenter `buildPageMeta` et `buildOrganizationJsonLd`
    - Écrire `src/lib/seo/meta.ts` : `SITE_ORIGIN`, génération de `<title>`, meta `description`, `<link rel="canonical">`, Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`), JSON-LD `Organization`/`LocalBusiness`
    - URLs canonique et `og:image` absolues, cohérentes avec l'origine ; directive `noindex` si demandée
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.2_

  - [ ]* 8.2 Écrire le test de propriété : complétude des balises de tête par page
    - **Property 13: Complétude des balises de tête par page**
    - **Validates: Requirements 6.1, 6.3**

  - [ ]* 8.3 Écrire le test de propriété : URLs canonique et og:image absolues
    - **Property 14: URLs canonique et og:image absolues**
    - **Validates: Requirements 6.2, 6.5**

  - [ ]* 8.4 Écrire le test de propriété : JSON-LD Organization valide
    - **Property 15: JSON-LD Organization valide**
    - **Validates: Requirements 6.4**

  - [ ]* 8.5 Écrire le test de propriété : marquage noindex des prototypes
    - **Property 19: Marquage noindex des prototypes**
    - **Validates: Requirements 10.2**

- [x] 9. Implémenter le générateur robots.txt / sitemap.xml
  - [x] 9.1 Implémenter `PUBLIC_ROUTES`, `PROTOTYPE_ROUTES`, `buildRobotsTxt`, `buildSitemapXml`
    - Écrire `src/lib/seo/sitemap.ts` : source unique des routes publiques ; `buildRobotsTxt` référence l'URL absolue du sitemap et exclut les prototypes ; `buildSitemapXml` liste uniquement les routes publiques en URL absolues
    - _Requirements: 7.2, 7.3, 7.4, 10.3_

  - [ ]* 9.2 Écrire le test de propriété : référence absolue du sitemap dans robots.txt
    - **Property 16: Référence absolue du sitemap dans robots.txt**
    - **Validates: Requirements 7.2**

  - [ ]* 9.3 Écrire le test de propriété : couverture exacte du sitemap
    - **Property 17: Couverture exacte du sitemap**
    - **Validates: Requirements 7.3**

  - [ ]* 9.4 Écrire le test de propriété : exclusion des prototypes de l'indexation
    - **Property 18: Exclusion des prototypes de l'indexation**
    - **Validates: Requirements 7.4, 10.3**

- [x] 10. Servir les ressources d'indexation et activer le rendu indexable
  - [x] 10.1 Émettre robots.txt et sitemap.xml en statique
    - Générer les fichiers dans `public/` (ou route edge) à partir de `buildRobotsTxt`/`buildSitemapXml` ; garantir l'accès à la racine
    - _Requirements: 7.1_

  - [x] 10.2 Activer le pré-rendu / SSR via TanStack Start
    - Configurer le pré-rendu des pages publiques (HTML peuplé `<head>` + contenu principal avant JS), préserver la navigation client après hydratation
    - Déclarer `head()` par route via `buildPageMeta`
    - _Requirements: 5.1, 5.2, 5.3, 6.1_

  - [ ]* 10.3 Écrire les tests d'intégration/smoke SEO
    - `GET /robots.txt` et `GET /sitemap.xml` → 200 ; requêtes HTML brutes par page publique vérifiant contenu principal et `<head>` ; navigation après hydratation
    - _Requirements: 5.1, 5.2, 5.3, 7.1_

- [x] 11. Checkpoint - Valider l'indexation et les métadonnées
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Créer les pages légales et mettre à jour le Footer
  - [x] 12.1 Créer les routes Mentions Légales et Confidentialité
    - Écrire `src/routes/mentions-legales.tsx` et `src/routes/confidentialite.tsx` (rédigée en français, décrivant les traitements de données)
    - Déclarer leurs métadonnées via `buildPageMeta`
    - _Requirements: 8.1, 8.2, 8.6_

  - [x] 12.2 Mettre à jour `Footer.tsx`
    - Année de copyright dynamique (année courante), mention des droits réservés en français, liens fonctionnels vers `/mentions-legales` et `/confidentialite` (corriger le lien « Privacy » `#`)
    - Conserver le Footer affiché même si un lien est rompu
    - _Requirements: 8.3, 8.4, 8.5, 12.1, 12.2_

  - [ ]* 12.3 Écrire le test de propriété : année de copyright courante
    - **Property 22: Année de copyright courante**
    - **Validates: Requirements 12.1**

  - [ ]* 12.4 Écrire les tests d'exemple du Footer et des pages légales
    - Rendu des routes `/mentions-legales` et `/confidentialite` ; liens du Footer fonctionnels ; mention FR présente
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 12.2_

- [x] 13. Mettre à jour le formulaire de contact (icône, honeypot, RGPD)
  - [x] 13.1 Corriger l'icône, ajouter le honeypot et l'information RGPD dans `Contact.tsx`
    - Remplacer le glyphe brut par une icône Lucide effectivement chargée (aucun texte de repli)
    - Ajouter le Champ_Honeypot masqué (`aria-hidden`, `tabIndex=-1`, hors flux visuel)
    - Afficher la mention de finalité, le lien vers `/confidentialite` près du bouton, et la logique de consentement (soumission autorisée seulement si consentement donné, message d'information sinon)
    - Supprimer le composant `Bullet` inutilisé
    - _Requirements: 3.1, 9.1, 9.2, 9.3, 9.4, 11.1, 11.2, 11.3, 14.1_

  - [ ]* 13.2 Écrire le test de propriété : équivalence soumission / consentement
    - **Property 21: Équivalence soumission / consentement**
    - **Validates: Requirements 9.3, 9.4**

  - [ ]* 13.3 Écrire les tests d'exemple du formulaire
    - Honeypot masqué et `tabIndex=-1` ; icône Lucide présente sans glyphe brut ; mention RGPD et lien confidentialité présents près du bouton
    - _Requirements: 3.1, 9.1, 9.2, 11.1, 11.3_

- [x] 14. Mettre les prototypes au privé (navigation, garde, anonymisation)
  - [x] 14.1 Retirer les liens prototypes de la Navbar
    - Modifier `Navbar.tsx` pour supprimer le lien « Tenant 0 » et tout lien vers une route prototype
    - _Requirements: 10.1_

  - [x] 14.2 Protéger et anonymiser les routes prototypes
    - Appliquer `noindex` via `buildPageMeta`, garde d'accès (refus/redirection vers une page publique) avec protection complémentaire de repli, anonymisation des données fictives nominatives dans `tenant-0.tsx` et `bridges-os.tsx`
    - _Requirements: 10.2, 10.4, 10.5, 10.6_

  - [ ]* 14.3 Écrire le test de propriété : Navbar sans lien vers les prototypes
    - **Property 20: Navbar sans lien vers les prototypes**
    - **Validates: Requirements 10.1**

  - [ ]* 14.4 Écrire les tests d'intégration de la garde des prototypes
    - Accès non autorisé refusé/redirigé ; repli appliqué en cas d'échec du contrôle principal ; revue d'anonymisation
    - _Requirements: 10.4, 10.5, 10.6_

- [x] 15. Stabilité des images et allègement du bundle
  - [x] 15.1 Définir les dimensions explicites des images publiques
    - Ajouter les attributs `width` et `height` sur chaque image des pages publiques pour réserver l'espace avant chargement ; servir des images en format optimisé et résolution adaptée
    - _Requirements: 13.1, 13.2, 15.3_

  - [x] 15.2 Code splitting des prototypes hors bundle public
    - Configurer le chargement différé (code splitting) des routes prototypes pour les exclure du bundle initial des pages publiques
    - _Requirements: 15.1, 15.2_

  - [ ]* 15.3 Écrire le test de propriété : dimensions explicites des images publiques
    - **Property 23: Dimensions explicites des images publiques**
    - **Validates: Requirements 13.1, 13.2**

  - [ ]* 15.4 Vérifier le packaging (analyse de bundle)
    - Analyse du bundle : prototypes en chunks séparés, hors bundle initial ; format/résolution des images conformes
    - _Requirements: 15.1, 15.2, 15.3_

- [x] 16. Checkpoint final - Build, lint et tests
  - Vérifier `npm run build` et `npm run lint` sans erreur (après suppression du code mort)
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 14.2_

## Notes

- Les tâches marquées `*` sont optionnelles (tests de propriété, tests unitaires, tests d'intégration) et peuvent être ignorées pour un MVP plus rapide.
- Chaque tâche référence des exigences précises pour la traçabilité.
- Les checkpoints assurent une validation incrémentale.
- Les tests de propriété valident les propriétés universelles de la section Correctness Properties (1 propriété = 1 test, `numRuns: 100`+, commentaire `Feature: site-hardening-amelioration, Property {n}`).
- Les tests unitaires et d'intégration valident les exemples, cas limites, le SSR, le packaging et la configuration externe.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1", "5.1", "8.1", "9.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "3.2", "3.3", "4.2", "4.3", "5.2", "8.2", "8.3", "8.4", "8.5", "9.2", "9.3", "9.4", "10.1", "10.2", "12.1", "14.1", "15.1", "15.2"] },
    { "id": 3, "tasks": ["6.1", "10.3", "12.2", "13.1", "14.2", "15.3", "15.4"] },
    { "id": 4, "tasks": ["6.2", "6.3", "12.3", "12.4", "13.2", "13.3", "14.3", "14.4"] }
  ]
}
```
