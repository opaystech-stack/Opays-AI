# Skill : Rendu Vidéo HyperFrames (Video-as-Code)

## Rôle
Capacité à structurer et animer des compositions vidéo complexes à l'aide de code HTML, CSS et JavaScript, en exploitant le framework open-source HyperFrames.

## Principes d'HyperFrames
1. **Video-as-Code :** Les vidéos sont définies comme des pages web standards. C'est l'approche idéale pour la génération automatisée de contenu par des agents IA.
2. **Timing Sémantique (Attributs `data-*`) :**
   - **`data-start`** : Position de début en secondes (ex: `data-start="2.5"`).
   - **`data-duration`** : Durée de visibilité/d'activité de la séquence en secondes (ex: `data-duration="5"`).
3. **Rendu Déterministe :** Le moteur de rendu capture les images frame par frame. Aucune interaction utilisateur en temps réel n'est autorisée pendant le rendu final (MP4).
4. **Animation Runtimes (GSAP) :**
   - Les animations complexes utilisent **GSAP**.
   - Déclarer des timelines en mode pause (`{ paused: true }`).
   - Enregistrer obligatoirement les instances de timelines sur le tableau global `window.__timelines = [...]` pour que le Frame Adapter d'HyperFrames puisse piloter le défilement temporel de manière déterministe.

## Directives pour l'Agent Studio
- **Transitions fluides :** Utiliser des fondus (`opacity`), des translations CSS et des courbes de timing ergonomiques (`cubic-bezier`).
- **Synchronisation :** Ajuster précisément les attributs `data-start` et `data-duration` pour éviter les vides ou les chevauchements involontaires.
- **Charte Opays Tech :**
  - Fond sombre obligatoire : `#0A0A0A`.
  - Accents Cyan Électrique (`#00FFE0`) et Bleu Cobalt (`#0055FF`).
  - Polices Inter (pour les textes) et JetBrains Mono (pour le code et les chiffres).
