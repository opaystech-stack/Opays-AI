# Plan d'execution - Refonte Opays Tech sur 90 jours

**Statut :** plan de mise en oeuvre v1  
**Objectif :** transformer le cadrage de refonte en systeme operable, testable et migrable sans casser l'existant  
**Principe :** recuperer, nettoyer, standardiser, puis industrialiser

## 1. Objectif general

La refonte doit produire un socle qui :

- garde ce qui est utile dans l'existant,
- nettoie les redundances,
- met la plateforme sous controle,
- prepare le tenant 0,
- permet de livrer un client pilote sans re-inventer la stack a chaque fois,
- laisse une capacite de migration et d'interopérabilité.

## 2. Ce qui est conserve

Nous ne repartons pas de zero.

### A conserver

- les bases du livre blanc,
- la structure `Forge / Sovereign / Nexus`,
- la methode de chiffrage de la fuite,
- les notes, wiki, decisions, templates utiles,
- les composants deja cohérents,
- les elements de gouvernance deja valides,
- la logique de progression par phases.

### A refondre

- tout ce qui est ambigu sur l'architecture,
- tout ce qui melange knowledge, documents et execution,
- tout ce qui n'a pas de proprietaire clair,
- tout ce qui n'a pas de version,
- tout ce qui n'est pas testable ou auditable.

## 3. Ordre de priorite

| Priorite | Sujet | Pourquoi |
|---|---|---|
| 1 | Gouvernance technique | Sans regles, on ne peut pas refondre proprement |
| 2 | Tenant 0 | On valide le nouveau modele sur nous-memes |
| 3 | Knowledge Vault | C'est le coeur de la memoire et de la valeur |
| 4 | Security plane | Pour servir des clients sensibles et durer |
| 5 | Integration plane | Pour ne pas exiger un remplacement total chez le client |
| 6 | Template client | Pour industrialiser la livraison |
| 7 | Portail et UX | Pour rendre le systeme operable par les equipes |
| 8 | Compass / memoire | Pour guider les decisions et suivre le plan |

## 4. Phases de travail

### Phase 0 - Nettoyage et cartographie

Livrables :

- inventaire des dossiers et documents existants,
- classement `a conserver / a refondre / a archiver / a supprimer`,
- cartographie des dependances,
- liste des doublons,
- liste des contradictions,
- liste des actifs reutilisables.

En parallele :

- definir le pilote interne de gouvernance `Compass`,
- fixer le vocabulaire des statuts `actif / refonte / archive / brouillon / obsolete`,
- recenser les elements UI/UX a reprendre et ceux a remanier.

### Phase 1 - Architecture cible figée

Livrables :

- architecture en 7 plans,
- regles immuables,
- niveaux de confinement,
- politique documentaire,
- politique de versioning,
- politique de rollback,
- politique de backup / PRA.

En parallele :

- figer la direction UX de la plateforme,
- choisir les patterns visuels de reference,
- definir la coque d'application avant le refactoring profond.

### Phase 2 - Tenant 0

Livrables :

- environnements control / runtime,
- base documentaire interne,
- agent interne de reference,
- suivi des couts IA,
- monitoring,
- sauvegarde,
- restauration testee.

Inclure :

- le skill `Compass`,
- la memoire des decisions,
- le premier shell UI interne.

### Phase 3 - Template et interop

Livrables :

- template client,
- connecteurs generiques,
- export/import,
- federation d'identite si besoin,
- staging client,
- packaging de livraison.

Inclure :

- le portail interne minimum,
- le portail client minimum,
- les composants UI reutilisables.

### Phase 4 - Client pilote

Livrables :

- un premier client reel ou test,
- ingestion documentaire,
- configuration des agents,
- mesure des couts,
- mesure des erreurs,
- rapport de retour d'experience.

### Phase 5 - Generalisation

Livrables :

- standardisation des modules,
- catalogue versionne,
- runbooks,
- portail client,
- procedure de migration,
- procedure d'audit,
- procedure de decommission.

## 5. Cadence sur 90 jours

### Jours 1 à 15

- cartographier l'existant,
- nettoyer le repository local,
- isoler les dossiers actifs,
- valider les documents de reference,
- figer les choix d'architecture.

### Jours 16 à 30

- mettre en place le tenant 0,
- installer les couches de base,
- brancher la documentation interne,
- mettre en place le suivi des couts,
- mettre en place les sauvegardes testees.

### Jours 31 à 60

- construire le template client,
- definir les connecteurs,
- versionner les modules,
- tester le rollback,
- produire les runbooks.

### Jours 61 à 90

- deploier un client pilote,
- ingérer sa documentation,
- valider l'interoperabilité,
- mesurer les performances,
- corriger le template,
- figer la v1 de reference.

## 6. Nettoyage du projet local

Le nettoyage du dossier local doit etre organise et non destructif.

### Regles

- ne rien supprimer sans classification prealable,
- archiver avant de supprimer,
- garder une trace des decisions,
- conserver les sources de reference,
- separer les zones `actif`, `refonte`, `archive`, `brouillon`, `obsolet`.

### Objectif

Permettre a l'equipe de naviguer facilement dans le projet sans perdre le savoir accumule.

## 7. Definition du livrable final

A la fin des 90 jours, nous devons avoir :

- une architecture cible claire,
- un tenant 0 operationnel,
- un knowledge vault interne valide,
- un template client reproductible,
- une strategie de rollback,
- une strategie de migration,
- une strategie de securite,
- une strategie d'interop,
- une base de documentation propre.

## 8. Critere de sortie

Le plan est considere comme reussi si :

- l'existant utile a ete recupere,
- l'existant inutile a ete archive ou retire sans perte de connaissance,
- le noyau technique est stable,
- le tenant 0 fonctionne,
- les couts sont visibles,
- les agents sont limites,
- les documents client sont gouvernes,
- la livraison est repetable.
