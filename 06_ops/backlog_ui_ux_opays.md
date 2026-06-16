# Backlog UI/UX - Plateforme Opays Tech

**Statut :** backlog produit interne  
**Objectif :** structurer l'experience utilisateur page par page avant la refonte profonde du tenant 0

## 1. Regle de base

On conserve le socle frontend actuel du projet.
On ne change pas de stack principale.
On developpe d'abord la coque produit, puis les pages critiques, puis les vues secondaires.

## 2. Ordre de priorite

### P0 - Coque commune

1. `App Shell`
   - sidebar,
   - top bar,
   - zone centrale,
   - panneau contextuel,
   - footer discret.

2. `Navigation globale`
   - spaces,
   - tenants,
   - modules,
   - recherche,
   - commandes rapides.

3. `System states`
   - loading,
   - empty,
   - error,
   - success,
   - offline,
   - syncing.

### P1 - Pages métier centrales

4. `Dashboard de pilotage`
   - santé,
   - coûts,
   - alertes,
   - tâches,
   - état des tenants.

5. `Workspace projet`
   - liste,
   - détail,
   - historique,
   - owners,
   - dépendances,
   - commentaires.

6. `Knowledge Vault`
   - pages,
   - tags,
   - provenance,
   - versions,
   - recherche,
   - sensibilité.

7. `Agent Console`
   - chat,
   - historique,
   - actions proposées,
   - exécution,
   - logs.

### P2 - Administration et gouvernance

8. `Admin & Security`
   - rôles,
   - accès,
   - secrets,
   - politiques,
   - modules,
   - environnements.

9. `Decision log`
   - ADR,
   - statut,
   - historique,
   - lien vers plan et checklists.

10. `Compass center`
   - résumé du plan,
   - écarts,
   - décisions récentes,
   - tâches à faire,
   - checklists générées.

### P3 - Portail client

11. `Client overview`
   - services actifs,
   - statut,
   - consommation,
   - incidents,
   - prochaines actions.

12. `Client documents`
   - import,
   - export,
   - recherche,
   - version,
   - accès.

13. `Client support`
   - demandes,
   - suivi,
   - échanges,
   - SLA / délais.

## 3. Principes d'acceptation UI

Chaque page doit :

- être compréhensible sans formation lourde,
- montrer l'action principale immédiatement,
- garder une hiérarchie visuelle claire,
- fonctionner sur desktop et mobile,
- avoir des états vides et d'erreur propres,
- rester cohérente avec la charte.

## 4. Ce qu'on évite

- refonte visuelle avant structure,
- duplication de composants,
- variations graphiques inutiles,
- dashboards décoratifs,
- empilement de widgets,
- pages sans owner.

## 5. Usage

Ce backlog sert de base à :

- la refonte du shell,
- les prototypes internes,
- la priorisation de l'équipe frontend,
- les tests UX du tenant 0.

