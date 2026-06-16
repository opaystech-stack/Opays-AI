# Cahier des charges - Refonte de la plateforme Opays Tech

**Statut :** document de cadrage et de specification v1  
**Objet :** refonte totale de l'application et de l'infrastructure interne pour en faire une plateforme souveraine, modulaire, auditable et durable  
**Perimetre :** architecture, securite, donnees, IA, orchestration, interop, exploitation, gouvernance technique  
**Hors perimetre :** business, pricing, marketing, juridique detaille

## 1. Decision de depart

Nous ne devons pas construire un "super outil IA" monolithique.
Nous devons construire une **plateforme d'exploitation d'entreprise** avec :

- un **coeur de controle** solide,
- une **execution federée** et isolee,
- une **couche de connaissance** versionnee,
- une **couche modele** interchangeable,
- une **couche d'integration** avec les outils existants,
- une **couche de securite** plus forte que l'IA elle-meme,
- une **couche d'exploitation** capable de survivre aux evolutions de modeles et d'outils pendant 20 ans.

## 2. Vision cible

La plateforme Opays doit pouvoir servir :

- des PME et ETI classiques,
- des organisations tres sensibles,
- des administrations,
- des structures de recherche,
- des secteurs reglementes,
- des entreprises qui conservent deja leur propre ERP / CRM / GED / messagerie / outils metier.

La plateforme doit donc etre :

- adaptable a plusieurs modeles d'entreprise,
- integrable a des systemes externes,
- modulable fonctionnellement,
- securisee par conception,
- evolutive sans refonte complete a chaque changement de modele IA.

## 3. Principes non negociables

| Principe | Exigence |
|---|---|
| Separation des responsabilites | Controle, donnees, connaissance, modele, integration et exploitation doivent etre distincts |
| Zero secret en clair | Aucun secret ne doit apparaitre en clair dans le code, les logs ou les documents |
| Zero acces implicite | Tout acces doit etre explicite, trace et reversible |
| Zero agent omnipotent | Chaque agent doit avoir un role limite et auditable |
| Zero donnée client melangee | Isolation stricte ou segmentation forte selon le niveau de sensibilité |
| Zero changement sans rollback | Toute evolution doit pouvoir etre annulee rapidement |
| Zero feature sans owner | Chaque module a un responsable et un cycle de vie |
| Zero prod sans test | Toute fonctionnalite critique doit avoir au minimum un parcours de validation |

## 4. Architecture cible retenue

Nous retenons une architecture en **7 plans**.

### 4.1 Control Plane

Role :

- identite,
- gestion des acces,
- politiques,
- approvals,
- audit,
- catalogue des capacites,
- supervision de haut niveau.

### 4.2 Data Plane

Role :

- workflows,
- taches,
- actions metier,
- transactions,
- execution des agents,
- connecteurs operationnels.

### 4.3 Knowledge Plane

Role :

- ingestion documentaire,
- chunking,
- vectorisation,
- provenance,
- versioning,
- recherche semantique,
- export et suppression.

### 4.4 Model Plane

Role :

- selection du modele,
- fallback,
- quotas,
- budget,
- evaluation,
- routage des requetes,
- adaptation aux changements de fournisseurs ou de versions.

### 4.5 Integration Plane

Role :

- connexion aux ERP/CRM/GED/mail/API,
- webhooks,
- synchronisation,
- import/export,
- transformation de schema,
- compatibilite avec les systemes deja en place chez le client.

### 4.6 Security Plane

Role :

- secrets,
- chiffrement,
- segmentation reseau,
- sandboxing,
- durcissement,
- detection d'abus,
- policies as code.

### 4.7 Operations Plane

Role :

- monitoring,
- logs,
- traces,
- sauvegardes,
- tests de restauration,
- PRA,
- mises a jour,
- incident response,
- exercice de crise.

## 5. Cible fonctionnelle

La plateforme doit offrir au minimum les fonctions suivantes :

| Fonction | Description |
|---|---|
| Gestion des projets | Taches, jalons, dependances, etat d'avancement, owners |
| Base de connaissance interne | Vision, methodes, decisions, playbooks, documentation produit |
| Agents specialises | Agents limites par role, par client ou par cas d'usage |
| Automatisation | Workflows deterministes et scenarios event-driven |
| RAG documentaire | Questions/reponses sur les documents internes ou client |
| Suivi de couts | Cout IA, cout infra, cout par tenant, cout par agent |
| Journalisation | Journal d'action, journal de consultation, journal de modification |
| Administration | Gestion des acces, des tenants, des modules et des versions |
| Portail interne | Interface de pilotage pour Opays HQ |
| Portail client | Interface de consultation, logs, statut, consommation, exports |
| Assistant de gouvernance | Memoire du plan, checklists, rappel des decisions et controle de coherence |

## 6. Exigences non fonctionnelles

### 6.1 Securite

Exigences :

- authentification centralisee,
- MFA pour les comptes privilegies,
- RBAC ou ABAC selon le besoin,
- secrets chiffrés,
- journalisation immuable ou quasi immuable,
- isolation reseau par tenant ou par classe de sensibilite,
- sandbox par agent,
- liste blanche d'outils autorises,
- approval gates sur les actions sensibles,
- revue d'acces periodique,
- rotation des secrets,
- tests de securite avant mise en production.

### 6.2 Scalabilite

Exigences :

- architecture modulaire,
- ajout de clients sans refonte,
- ajout de fonctions sans casser l'existant,
- separation des environnements,
- support de plusieurs niveaux de confinement,
- compatibilite avec des clients qui conservent leurs outils actuels,
- possibilite de monter du standard vers du sensible, puis vers du tres sensible.

### 6.3 Performance

Exigences :

- latence acceptable pour les usages internes,
- files de traitement pour les operations longues,
- separation des taches interactives et batch,
- quotas par tenant,
- limitation des boucles d'agents,
- degradation gracieuse si le modele principal est indisponible,
- cache quand cela est utile et sans risque de fuite.

### 6.4 Disponibilite

Exigences :

- sauvegardes planifiees,
- restauration testee,
- RPO et RTO definis,
- monitoring central,
- alerting,
- plan de reprise,
- scenario de bascule en cas de panne d'un composant critique.

### 6.5 Portabilite

Exigences :

- possibilite de changer de modele IA,
- possibilite de changer de moteur vectoriel,
- possibilite de changer de reverse proxy,
- possibilite de changer de fournisseur de VPS,
- possibilite d'exporter les donnees client,
- possibilite de migrer un tenant sans perdre les capacites essentielles.

## 7. Gestion de la documentation client

### 7.1 Principe

La documentation client ne doit pas etre traitee comme un simple dossier de fichiers.
Elle doit devenir un **Knowledge Vault** gouverne et versionne.

### 7.2 Regles

- chaque client a un vault distinct,
- les documents sources sont identifies et classes,
- les données sensibles sont chiffrees,
- les connaissances extraites sont rattachees a leur provenance,
- les versions sont conservees,
- la mise a jour se fait par delta quand c'est possible,
- l'export et la suppression doivent etre possibles,
- toute consultation doit pouvoir etre tracee selon le niveau de sensibilité.

### 7.3 Cycle de vie documentaire

1. Ingestion des documents.
2. Nettoyage et classification.
3. Chunking.
4. Vectorisation.
5. Indexation.
6. RAG.
7. Journalisation des usages.
8. Mise a jour delta.
9. Export ou suppression.

### 7.4 Recommandation

Le default doit etre :

- **RAG d'abord**,
- **fine-tuning seulement si justifie**,
- **fine-tuning toujours isole**,
- **jamais de melange entre clients sans anonymisation et validation**.

## 8. Interoperabilite

La plateforme doit pouvoir travailler avec des systemes deja en place.

### Capacites attendues

- lecture et ecriture via API,
- webhooks entrants et sortants,
- synchronisation de documents,
- recuperation d'etats depuis des logiciels externes,
- injection de taches ou de notifications,
- adaptateurs pour ERP/CRM/GED et outils internes,
- mappings de schema,
- gestion des formats heterogenes,
- mode "coexistence" avec un autre outil de gestion.

### Regle d'architecture

La plateforme ne doit jamais supposer qu'elle remplace tout.
Elle doit pouvoir **s'interfacer** avec l'existant.

## 9. Gouvernance technique

### 9.1 RACI simplifie

| Domaine | Responsable | Validateur |
|---|---|---|
| Architecture globale | CTO | DG |
| Securite et acces | CTO / RSSI fonctionnel | DG |
| Knowledge Vault | Lead R&D / Data owner | CTO |
| Releases et versions | CTO | DG |
| Operations / PRA | SRE / CTO | DG |
| Catalogue de modules | CTO | Lead R&D |

### 9.2 Niveaux de decision

| Niveau | Exemple |
|---|---|
| Operationnel | correction de bug, ajustement de workflow |
| Produit | ajout d'un module, evolution d'un agent |
| Architecture | changement de stack, changement de modele de donnees |
| Direction | ouverture a un nouveau niveau de sensibilité, changement de strategie d'hébergement |

## 10. Strategy de versioning

### Regle

Tout composant important doit avoir une version.

Exemples :

- agent,
- workflow,
- connecteur,
- prompt,
- schema de donnees,
- policy,
- template client.

### Politique

- PATCH : correction sans changement fonctionnel majeur,
- MINOR : ajout retrocompatible,
- MAJOR : rupture, migration, validation supplementaire.

### Deploiement

1. Tenant 0.
2. Client interne pilote.
3. Client volontaire.
4. Generalisation.

### Rollback

Chaque release doit pouvoir revenir a la version precedente dans un delai court.

## 11. Supervision et evidence

La plateforme doit produire des preuves d'exploitation :

- logs,
- metriques,
- traces,
- audit,
- preuves de restore,
- historique des versions,
- historique des approbations,
- indicateurs de couts IA,
- indicateurs de latence,
- indicateurs d'erreurs.

## 12. Regles de securite agentique

Chaque agent doit respecter :

- droit minimum,
- outils explicitement autorises,
- pas d'acces libre a Internet sans justification,
- pas d'execution de scripts non approuves,
- journalisation de ses actions,
- approval gate pour les actions a impact,
- sandbox ou conteneur limite,
- limite de temps et de ressources,
- detection des comportements anormaux.

## 13. Niveaux de confinement client

| Niveau | Usage | Exigence |
|---|---|---|
| Standard | PME, operations classiques | isolation logique forte |
| Sensible | finance, juridique, sante, donnees critiques | isolation forte, audit renforce |
| Tres sensible | gouvernement, defense, recherche a risque | confinement dur, pas de confiance par defaut, contraintes d'exploitation maximales |

## 14. Architecture interne cible pour le cobaye

Le systeme interne doit devenir le **tenant 0**.

### Composants

- Control Plane : Opays HQ
- Knowledge Vault interne : documentation, decisions, playbooks
- Runtime agentique : agents internes specialises
- Integration Hub : connecteurs et workflows
- Security Overlay : IAM, secrets, policies
- Operations Layer : monitoring, backups, PRA

### Objectif

Valider sur nous-memes :

- la gestion des droits,
- la gestion documentaire,
- la version des modules,
- les restaurations,
- le cout IA,
- la compatibilite avec des outils externes,
- la capacite de migration.

## 15. Livrables attendus

### Livrables de conception

- architecture cible v1,
- schema des plans,
- catalogue des modules,
- politique de securite,
- politique de versioning,
- politique documentaire,
- politique de backup et PRA,
- standard d'integration.
- systeme de design et de navigation,
- assistant de gouvernance interne (`Compass`),

### Livrables techniques

- template de deploiement,
- depot de base,
- scripts de provisioning,
- base de tests,
- agent interne de reference,
- pipeline d'ingestion documentaire,
- dashboard de couts,
- procedure de rollback,
- runbook de restauration.

### Livrables d'exploitation

- process de review,
- process de release,
- process d'upgrade,
- process d'onboarding client,
- process d'export/suppression,
- process d'audit,
- process d'incident.

## 15.1 Priorite UX

La plateforme doit d'abord etre utilisable.
Avant de refondre profondement tous les composants internes, nous devons figer la coque d'experience utilisateur :

- structure de navigation,
- composants communs,
- systeme de tokens visuels,
- pages de pilotage,
- pages de knowledge,
- pages d'administration,
- pages agentiques.

La bonne UX n'est pas un habillage final.
C'est une couche structurante du produit.

## 16. Phasage de refonte

### Phase 0 - Cadrage

- valider l'architecture cible,
- valider les principes non negociables,
- valider le niveau de confinement,
- valider le modele documentaire,
- valider les choix de socle.
- valider la strategie UX et la direction visuelle.

### Phase 1 - Tenant 0

- reconstruire l'environnement interne,
- mettre en place le Knowledge Vault,
- mettre en place les policies,
- mettre en place le monitoring,
- mettre en place les backups,
- mettre en place le suivi des couts.
- mettre en place le shell UI interne.

### Phase 2 - Template client

- industrialiser le socle,
- parametrer les modules,
- automatiser le provisioning,
- tester le rollback,
- documenter le mode de livraison.
- figer les patterns d'interface.

### Phase 3 - Client pilote

- deploiement sur un client volontaire,
- ingestion documentaire,
- interop avec l'existant,
- mesure des latences et du cout,
- mesure de l'usage reel.

### Phase 4 - Generalisation

- stabilisation,
- standardisation,
- durcissement,
- catalogue,
- packaging,
- portail client.

## 17. Risques a anticiper

| Risque | Impact | Mesure de mitigation |
|---|---|---|
| Melange des donnees | fuite client | isolation stricte, tenant-aware policies |
| Derive de complexite | dette technique | standardisation, catalogue, modules limites |
| Changement de modele IA | cassure fonctionnelle | model plane interchangeable |
| Dependance a un outil tiers | verrouillage | abstraction, adaptateurs, export |
| Prompt injection | actions non voulues | sandbox, validation, liste blanche |
| Cout IA non maitrise | marge perdue | suivi par tenant et par agent |
| Panne de restauration | perte de confiance | tests de restore reguliers |
| Trop d'outils | confusion | systeme de reference unique par fonction |

## 18. Critere d'acceptation

La refonte sera consideree comme suffisamment solide si :

- un tenant peut etre cree a partir d'un template sans intervention manuelle lourde,
- un document client peut etre ingere, versionne et interroge localement,
- un agent peut etre limite, audite et desactive,
- un workflow peut etre versionne et rollbacke,
- un changement de modele IA ne casse pas les workflows,
- un client externe peut s'interfacer avec la plateforme,
- la restauration d'un tenant a ete testee reellement,
- les couts IA sont visibles par tenant et par agent,
- les acces sont explicites et revisionnables,
- le systeme peut etre conserve, migré ou remplace sans perdre la memoire.
- l'interface est utilisable, claire et cohérente,
- un utilisateur interne comprend quoi faire sans formation excessive.

## 19. Conclusion tranchee

La bonne refonte n'est pas une accumulation d'outils.
La bonne refonte est une **plateforme de controle et d'execution** qui :

- garde la maitrise de la securite,
- accepte l'evolution des modeles,
- protege la connaissance,
- s'interface avec l'existant,
- isole les clients,
- permet l'industrialisation,
- et peut survivre a de nombreuses generations de technologies.

Le vrai avantage competitif n'est pas "avoir le meilleur modele du moment".
Le vrai avantage competitif est de disposer d'une architecture qui reste fiable quand le modele, l'outil ou le fournisseur change.

## 20. Recuperation de l'existant et nettoyage

La refonte ne doit pas etre interpretee comme une suppression de ce qui existe deja.
Notre approche doit etre :

- **recuperer** ce qui est utile,
- **nettoyer** ce qui est redondant ou confus,
- **archiver** ce qui n'est plus prioritaire,
- **renommer** ce qui doit etre clarifie,
- **restructurer** ce qui reste pertinent,
- **supprimer uniquement** ce qui est obsolet, dangereux ou contradictoire avec la nouvelle architecture.

### 20.1 Regle de migration

Tout contenu ou composant existant doit passer par l'une de ces 5 categories :

| Categorie | Action |
|---|---|
| A conserver | on garde tel quel ou avec ajustement mineur |
| A refondre | on reprend le fond mais on re-ecrit la forme |
| A fusionner | on combine avec un autre actif proche |
| A archiver | on conserve en historique mais hors du chemin actif |
| A supprimer | on retire car obsolete, incoherent ou risqué |

### 20.2 Règle pour le dossier local du projet

Le dossier local ne doit pas devenir une pile d'artefacts sans gouvernance.
Il doit etre nettoye selon les memes categories :

- dossiers actifs,
- dossiers en refonte,
- archive,
- brouillons,
- tests,
- obsolete.

### 20.3 Principe de prudence

Avant toute suppression :

1. identifier les dependances,
2. verifier les usages,
3. marquer comme obsolete,
4. archiver,
5. supprimer seulement en derniere etape si aucun risque de perte de savoir.

Cette regle est importante pour ne pas casser des acquis, ni perdre le savoir deja accumule.
