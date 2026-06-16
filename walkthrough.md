# Walkthrough - Refonte de l'architecture technique du Chat

## Objectif

Remplacer la logique d'interception maison par le moteur natif du SDK AI, afin que le chat exécute réellement les outils métier au lieu de seulement les annoncer.

## Ce qui a changé

- Suppression du parseur regex et du bloc d'interception directe dans `src/app/api/chat/route.ts`.
- Passage à une orchestration native multi-étapes avec `maxSteps: 5`.
- Alignement du chat, du studio créatif et du réseau d'agents sur l'API actuelle du SDK.
- Remplacement des paramètres obsolètes `api`, `initialMessages`, `input` et `maxTokens` par les mécanismes compatibles avec la version installée.
- Uniformisation du format de messages sur `parts` pour rester compatible avec `UIMessage`.
- Ajout de la gestion de transport via `DefaultChatTransport`.
- Ajout d'un arrêt explicite de génération dans les interfaces de chat.

## Résultat attendu

- Une demande comme "ajoute un prospect + crée deux tâches" doit partir dans le flux d'outils natif.
- Le chat doit afficher un statut réel, et non une confirmation prématurée.
- Les tâches et prospects doivent être créés dans le bon ordre, avec des retours plus fiables.

## Validation technique

- `npm run build` ✅
- Le build passe complètement.
- Un warning Turbopack persiste sur le tracing de `next.config.js` via `src/lib/server/obsidian-sync.ts` et `src/app/api/sync/obsidian/route.ts`.

## Tests manuels à faire

- Créer un prospect `Bridgesat`.
- Créer une tâche pour `Fenelon` avec échéance `mardi 26 mai 2026`.
- Créer une tâche pour `Prince`.
- Vérifier que le chat n'annonce pas "action exécutée" sans preuve réelle.
- Vérifier que le bouton d'arrêt coupe bien une génération en cours.

## Remarques

- Les écrans de chat ont été mis à jour pour le SDK AI actuel, qui repose sur `transport` et `parts`.
- La logique métier doit rester dans le backend. Le front ne doit pas simuler une exécution réussie.
