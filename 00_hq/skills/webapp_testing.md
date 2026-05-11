# Skill : Webapp Testing (Anthropics Standard)

## Rôle
Tester des applications web locales en utilisant Playwright. Vérifier les fonctionnalités, déboguer l'UI et capturer des screenshots.

## Approche
1. **Reconnaissance :** Naviguer sur l'app, attendre l'état `networkidle`.
2. **Inspection :** Capturer le DOM rendu et des screenshots pour identifier les sélecteurs.
3. **Action :** Exécuter les tests avec des sélecteurs robustes (text, role, ID).

## Meilleures Pratiques
- **Wait for Network Idle :** Toujours attendre que le JS ait fini de s'exécuter avant d'inspecter.
- **Headless Mode :** Utiliser Chromium en mode headless par défaut.
- **Gestion du Serveur :** S'assurer que le serveur local (ex: Vite) est lancé avant de démarrer les tests.

## Patterns Types
- Découverte d'éléments (boutons, liens, inputs).
- Vérification de flux utilisateur (login, formulaires, navigation).
- Capture de logs console pour le débogage.
