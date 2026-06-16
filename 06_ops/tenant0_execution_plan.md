# Tenant 0 - Plan d'execution technique

**Statut :** plan operatoire initial  
**But :** construire l'environnement interne de cobaye qui servira de reference avant toute commercialisation  
**Principe :** commencer petit, isoler fort, instrumenter tout, ne rien rendre irreversible

## 1. Role du tenant 0

Le tenant 0 est notre propre entreprise vue comme un client.

Il doit permettre de valider :

- la gouvernance documentaire,
- la segregation des droits,
- le suivi des couts IA,
- le fonctionnement des skills Compass,
- la qualite du shell UI,
- la restauration apres incident,
- l'interoperabilite avec nos futurs clients.

## 2. Infra minimale retenue

### A. Control Plane

Services cibles :

- PostgreSQL
- Keycloak ou Authentik
- n8n
- MinIO
- Loki
- Prometheus
- Grafana
- Restic repository
- Gitea ou GitHub miroir

Role :

- identité,
- configuration,
- journalisation,
- orchestration interne,
- stockage des actifs,
- supervision.

### B. Runtime Tenant 0

Services cibles :

- interface web interne,
- Compass,
- moteur de consultation documentaire,
- moteur RAG,
- Qdrant ou pgvector,
- Caddy ou Traefik,
- CrowdSec,
- conteneurs agents limites.

Role :

- exécution quotidienne,
- navigation interne,
- lecture de la mémoire,
- utilisation des skills,
- validation des workflows.

## 3. Isolation

Regles non negociables :

- un control plane distinct du runtime,
- des secrets distincts,
- des volumes distincts,
- pas d'acces direct aux bases depuis l'UI,
- pas d'appel agentique sans trace,
- pas de secret en clair dans le code ou les logs,
- pas de mutuelle entre tenants hors politique explicite.

Niveaux :

- tenant 0 en environnement interne,
- staging dedie avant toute evolution critique,
- client pilote ensuite seulement.

## 4. Compass dans le tenant 0

Compass devient la mémoire vivante de gouvernance.

Sources de vérité :

- `00_hq`
- `brain`
- `06_ops`
- `05_decisions`

Fonctions :

- répondre aux décisions,
- retrouver les ADR,
- lister les standards,
- rappeler le plan,
- produire des checklists,
- signaler les écarts.

Skills attaches :

- `check-compliance`
- `plan-progress`
- `generate-checklist`

## 4b. Coexistence avec Opays-HQ legacy

Le dépôt GitHub `Opays-HQ` reste le socle métier legacy.

Le tenant 0 ne le remplace pas immédiatement. Il :

- consomme ses données via API ou contrat explicite,
- évite de dupliquer le modèle de vérité,
- audite et documente les politiques RLS/RBAC déjà présentes,
- ajoute la couche UX, Compass et l'orchestration moderne autour.

Règle :

- pas de réécriture du socle Supabase si le besoin est déjà couvert,
- seulement durcissement, audit, documentation et exposition propre.

## 5. Shell UI initial

Page unique au départ :

- sidebar de navigation,
- zone de travail centrale,
- panneau Compass,
- vues de base pour agents, connaissances, conformité, activité.

Objectif :

- rendre la structure visible,
- preparer la navigation future,
- valider l'ergonomie avant la refonte profonde.

## 6. Ordre d'execution

1. figer le plan et la decision de tenant 0,
2. brancher Compass comme mémoire de gouvernance,
3. livrer le shell UI interne,
4. poser le control plane minimal,
5. connecter la mémoire documentaire,
6. activer les premiers checks de conformité,
7. seulement ensuite, commencer la profondeur infra.

## 7. Definition de fini pour la phase 1

La phase tenant 0 est considérée comme suffisante lorsque :

- Compass répond sur les décisions et le plan,
- les 3 skills fonctionnent en CLI,
- le shell UI s'ouvre et permet de naviguer,
- le control plane minimal est identifié,
- la documentation interne est consultable,
- la structure d'isolement est claire,
- le prochain pas vers l'infra peut se faire sans repartir de zero.
