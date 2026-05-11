# Audit Stress Test OPAYS TECH - OS HQ + Méthode Opérationnelle

Date: 2026-05-11  
Auditeur: Efficiency Engineering, Cloud Architecture, Business IA Strategy

## Verdict Exécutif

OPAYS a une bonne intuition stratégique: vendre de l'efficience mesurable plutôt que de la technologie. Mais la version auditée mélange encore trois choses qui doivent être séparées pour scaler: méthode commerciale, gouvernance interne et application opérationnelle.

Score de maturité avant corrections: 5.8/10  
Score de maturité après corrections techniques: 7.1/10  
Risque principal restant: absence de workflow opérationnel mesuré de bout en bout.

## 1. Audit Opérationnel & Théorique

### Studio & Labs

Constat: le découpage Studio/Labs est pertinent, mais il est dangereux sans garde-fous de capacité.

Risque: le Studio promet du volume et du cash-flow, les Labs consomment les meilleurs ingénieurs sur de l'incertain. Sans allocation explicite, les Labs cannibalisent la livraison Studio dès que les fondateurs sont sous pression.

Correction recommandée:

- Studio = 70% capacité mensuelle, offres standardisées, délai court, marge brute pilotée.
- Labs = 20% capacité mensuelle, uniquement avec sponsor business, hypothèse technique, critère de sortie.
- Buffer = 10% support, dette technique, urgences client.

Décision dure: aucun projet Labs ne doit entrer si son livrable ne peut pas devenir un actif réutilisable, un brevet/process, un dataset, une skill ou une offre premium.

### Lourdeurs Administratives

Constat: HQ OS centralise bien l'information, mais risque de devenir une couche de reporting si les actions restent déclaratives.

Friction identifiée:

- Lead saisi, mais pas de SLA de qualification.
- Projet créé, mais pas de checklists contractuelles obligatoires.
- Tâches visibles, mais peu liées à la marge, au risque ou au blocage client.
- Admin et documents présents, mais uploads/invitations encore maquette.

Correction recommandée:

- Un lead doit passer de `NEW` à `CONTACTED` en moins de 24h.
- Un audit doit avoir un propriétaire, une date de restitution, un montant de fuite et un niveau de confiance.
- Un projet ne démarre pas sans contrat, acompte, owner, échéance, définition de fini.
- Une tâche doit avoir un impact: livraison, cash, risque, apprentissage ou support.

### Méthode ROI Cost Replacement

Constat: l'angle "suppression de ligne de coût" est commercialement fort, mais dangereux s'il est vendu comme remplacement total.

Risque: si OPAYS promet une suppression de coût sans intégrer maintenance, exceptions, formation, dette d'intégration et support, la marge brute se fait manger après la vente.

Correction appliquée dans le calculateur:

- Charges employeur.
- Heures productives mensuelles.
- Erreurs et rework.
- Coût OPAYS mensuel.
- Setup initial.
- Décote de confiance.
- Gain net annuel.
- Payback en mois.
- Multiple ROI après décote.

Règle de vente: ne jamais présenter la fuite brute comme économie certaine. Présenter une fourchette conservatrice, puis vendre la réduction de risque.

### Vesting & Equity

Constat: 4 ans + cliff 1 an + distribution mensuelle est sain pour protéger les fondateurs.

Faiblesse: le modèle est insuffisant pour retenir des engineers très forts si l'equity est seulement calendaire.

Correction recommandée:

- Vesting mensuel après cliff, mais conditionné à une contribution active.
- Accélération partielle possible sur jalons majeurs: produit livré, IP créée, client stratégique signé.
- Bad leaver / good leaver écrit explicitement.
- Les dotations doivent lier equity, rôle, performance et risque pris.

## 2. Audit Technique HQ

### Architecture & Scalabilité

Constat initial: stack Next.js + Supabase adaptée pour 100+ projets, mais le schéma manquait d'index et de politiques RLS.

Corrections appliquées:

- Migration de `next@14.2.3` vers `next@16.2.6`.
- Migration React vers `react@19.2.4`.
- Passage de `middleware.ts` à `proxy.ts`.
- Adaptation `cookies()` async pour Next 16.
- Configuration `turbopack.root`.
- Ajout d'index sur leads, projets, tâches, trésorerie, RH, equity, commentaires, knowledge.
- Ajout `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.

Risque restant: le modèle ne sépare pas encore les colonnes sensibles des lignes opérationnelles. Exemple: `projects.contract_url` et `billing_status` cohabitent avec les informations projet. RLS protège par ligne, pas par colonne. Pour un vrai RBAC grand compte, il faudra extraire les documents, contrats et facturation dans des tables dédiées.

### Sécurité & RBAC

Constat initial critique: aucune RLS n'était définie dans le schéma. Si les tables sont exposées via l'API Supabase, c'est une faille majeure.

Corrections appliquées:

- Activation RLS sur toutes les tables publiques.
- Fonctions privées `app_private.current_profile_role`, `current_profile_type`, `is_admin`.
- Politiques par périmètre: profils, RH, leads, projets, tâches, trésorerie, partenariats, knowledge, equity, audits IA, commentaires, idées, documents, invitations.
- Trésorerie limitée aux rôles CEO/COO/ADMIN.
- Gates serveur ajoutés pour Equity/RH/Trésorerie.

Risque restant: les politiques SQL doivent être testées contre une base Supabase réelle avec utilisateurs de test CEO, Associate, Employee, Sales et Engineer.

### Calculateur ROI Studio

Constat initial: l'ancien calcul `salaire / 160 + deals perdus` était trop léger pour convaincre un DAF.

Corrections appliquées:

- Calcul de salaire chargé.
- Ajustement par heures productives.
- Ajout coûts d'erreur/rework.
- Ajout maintenance OPAYS.
- Ajout coût setup initial.
- Ajout niveau de confiance.
- Sortie: fuite brute, fuite décotée, gain net annuel, payback, multiple ROI.

Risque restant: il manque une génération de rapport PDF propre avec hypothèses, preuves terrain et fourchettes basse/médiane/haute.

### UX Premium Dark

Constat: l'interface est crédible et cohérente, mais la densité visuelle peut ralentir les actions de routine.

Friction:

- Trop de surfaces sombres similaires.
- Peu de hiérarchie entre action urgente et information de contexte.
- Les boutons existent parfois sans action réelle.
- Les pages client-side chargent parfois toute la donnée sans pagination.

Correction recommandée:

- Ajouter états vides/actionnables.
- Ajouter filtres et pagination sur leads, tâches, projets.
- Réduire les cartes décoratives sur les routes opérationnelles.
- Garder le style premium pour la gouvernance, simplifier les écrans de production.

## 3. Corrections Techniques Appliquées

- Remplacé `@supabase/auth-helpers-nextjs` non déclaré par le client local `@/lib/supabase`.
- Corrigé un JSX invalide dans `TaskItem`.
- Ajouté RLS et index au schéma Supabase.
- Durci les accès Treasury, HR, Equity côté serveur.
- Migré vers Next 16 + React 19.
- Corrigé la compatibilité `cookies()` async.
- Ajouté l'override PostCSS patché.
- Validé `npm run build`.
- Validé `npm audit`: 0 vulnérabilité.

## 4. Backlog Prioritaire

P0:

- Tester les politiques RLS sur une vraie instance Supabase avec comptes de test.
- Séparer contrats, documents RH et facturation dans des tables dédiées avec policies propres.
- Rendre invitations et uploads réellement fonctionnels.

P1:

- Ajouter pagination/filtres sur tâches, leads, projets.
- Ajouter SLA et checklists obligatoires pour le passage lead -> audit -> projet.
- Ajouter statut de marge brute projetée/réelle par projet.

P2:

- Générer un PDF ROI propre avec hypothèses et décote.
- Créer dashboards Studio vs Labs avec capacité consommée.
- Ajouter journal d'audit applicatif: qui a vu/modifié quoi.

## Conclusion

OPAYS peut scaler si l'équipe résiste à la tentation de tout centraliser comme "plus de contrôle". Le vrai OS n'est pas un dashboard: c'est une chaîne de décisions plus courte, plus mesurable et plus sûre.

La priorité n'est pas d'ajouter des modules. La priorité est d'empêcher les modules existants de mentir: sur le ROI, les accès, les délais et la marge.
