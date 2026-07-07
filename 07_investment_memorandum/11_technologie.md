# 11. La technologie

## 11.1 Philosophie technologique

La technologie d’Opays Tech n’est pas une fin en soi. Elle est un moyen pour rendre les opérations plus simples. Notre choix technique obéit à trois impératifs :

1. **Légèreté** : nos produits doivent fonctionner sur un téléphone, même avec une connexion intermittente.
2. **Modularité** : chaque Business Unit doit pouvoir évoluer indépendamment tout en partageant les briques communes.
3. **Souveraineté** : les clients doivent garder le contrôle de leurs données, avec la possibilité d’hébergement local quand le contexte l’exige.

## 11.2 Stack technique

| Couche | Technologie choisie |
|--------|---------------------|
| **Frontend** | React, TypeScript, Tailwind CSS, TanStack Router |
| **Backend** | Bun + Elysia (API REST ou GraphQL) |
| **Base de données** | PostgreSQL pour les données structurées |
| **Agent IA** | LLM avec tool-use, protocole MCP |
| **Mémoire et RAG** | Base vectorielle + stockage persistant |
| **Hébergement** | VPS Hostinger + Dokploy pour le déploiement continu |
| **Imprimante** | Imprimante thermique portable Bluetooth |

Cette stack a été choisie pour sa performance, son coût maîtrisé et sa capacité à supporter une architecture multi-dashboards.

## 11.3 Architecture agentique

Le moteur central d’Opays Tech est un agent intelligent capable de comprendre le langage naturel, de planifier des actions et d’exécuter des opérations métier.

Le pipeline de traitement est le suivant :

```
Entrée utilisateur (texte ou voix)
  → Compréhension de l’intention
  → Extraction des entités métier
  → Normalisation des données
  → Déduction du contexte métier
  → Planification des actions
  → Sélection des outils (API / base de données / interface)
  → Exécution des actions
  → Vérification des résultats
  → Confirmation utilisateur si nécessaire
  → Réponse finale en langage clair
```

L’agent est conçu pour être fiable : il ne devine pas. En cas d’ambiguïté, il demande une confirmation à l’utilisateur.

## 11.4 Fonctionnement multi-dashboards

Chaque Business Unit dispose de son propre dashboard métier. Tous partagent une architecture commune :

```
dashboards/<nom-du-dashboard>/
  ├── apps/
  │   ├── web/          # Interface React
  │   ├── api/          # Backend API
  │   └── agent/        # Agent LLM + MCP
  ├── packages/
  │   ├── shared/       # Types et utilitaires communs
  │   └── tools/        # Outils métiers (create_sale, update_stock, etc.)
  ├── docs/             # Documentation produit
  └── README.md         # Pitch commercial + technique
```

Cette structure permet :
- de développer chaque produit comme un projet autonome ;
- de mutualiser la sécurité, l’authentification et les composants UI ;
- d’ajouter de nouveaux dashboards sans refondre la plateforme.

## 11.5 Sécurité et conformité

La sécurité est intégrée dès la conception :
- authentification sécurisée par utilisateur ;
- contrôle d’accès basé sur les rôles ;
- chiffrement des données en transit et au repos ;
- sauvegardes régulières ;
- traçabilité des actions importantes.

Sur la conformité :
- prise en compte des normes comptables OHADA pour les modules financiers ;
- capacité à respecter les exigences de reporting des bailleurs pour la BU-2 ;
- possibilité d’hébergement local pour les institutions sensibles via la branche Sovereign.

## 11.6 Souveraineté et open source

Opays Tech s’appuie massivement sur l’open source pour plusieurs raisons :
- réduire les coûts de licence ;
- conserver la maîtrise du code et des données ;
- contribuer à un écosystème local de compétences ;
- garantir la résilience face aux aléas des fournisseurs étrangers.

Cette approche est au cœur de la branche Sovereign, qui vise à développer des actifs technologiques propriétaires tout en s’appuyant sur des standards ouverts.

## 11.7 Propriété intellectuelle

À ce stade, la propriété intellectuelle d’Opays Tech repose sur :
- la marque Opays Tech et le domaine opays.io ;
- la méthode de diagnostic et d’implémentation documentée ;
- le code développé pour les produits minimum viables ;
- les skills et outils métiers créés pour les agents IA.

Aucun brevet n’est déposé à ce jour. Cette question fera l’objet d’une stratégie dédiée à mesure de la maturité des produits.

## 11.8 Avantages technologiques clés

| Avantage | Explication |
|----------|-------------|
| **Pilotage par langage naturel** | L’utilisateur n’a pas besoin de maîtriser une interface complexe. |
| **Architecture modulaire** | Chaque produit peut vivre seul et grandir ensemble. |
| **Mobile-first** | L’expérience est pensée d’abord pour le téléphone. |
| **Hébergement souverain possible** | Réponse aux besoins de confidentialité des institutions. |
| **Stack moderne et peu coûteuse** | Rend le développement rapide et maîtrisé financièrement. |

