# Services externes à évaluer — capture de veille

> Note de veille séparée. N'impacte pas la refonte du site vitrine
> (`refonte-site-vitrine`). À convertir en spec dédiée si l'équipe décide
> d'intégrer un de ces services à l'offre Opays.

## Source

- Site de référence : https://smarttechgenius.com/
- Statut d'extraction : **complet**. Capture réussie via Playwright (Chromium
  headless, rendu JS). Les 12 pages publiques ont été lues et synthétisées.
  Voir la note consolidée et reformulée : `services_smarttechgenius_capture.md`
  (source unique de vérité pour cette veille). Le design n'a pas été repris
  (on reste sur la charte Opays).

## Périmètre demandé

- Récupérer les services intéressants de ce site **sauf** le service de
  création de site web (hors périmètre, déjà couvert côté Opays).
- Pièce centrale retenue : **agent vocal pour l'audit**.

## Écosystème de services observé (confirmé par capture)

Six services publiés (cf. `services_smarttechgenius_capture.md`) :

1. Web Intelligent (création de site) — **exclu** par décision.
2. ChatBot Intelligent — assistant conversationnel.
3. Automatisation — suppression des tâches répétitives.
4. Agents IA — agents autonomes métier.
5. Intégration IA — IA greffée sur les outils existants.
6. Consultation Web et IA — conseil/cadrage payant.

Remarque : il n'existe **pas** de service « agent vocal » distinct sur le site.
L'angle agent vocal d'audit reste une **proposition Opays** dérivée des services
« Agents IA » + « Consultation », à cadrer dans une spec dédiée.

## Angle Opays : agent vocal d'audit

L'agent vocal s'aligne naturellement sur le positionnement Opays (cabinet
d'ingénierie de l'efficience) via le **Palier Diagnostic** :

- Un agent vocal qui mène un premier audit conversationnel des processus
  (qualification, cartographie des frictions) avant le Diagnostic gratuit humain.
- Reste cohérent avec la promesse de souveraineté : exécution locale,
  données sous contrôle, sans dépendre d'infrastructures non maîtrisées.
- Ne remplace pas le diagnostic humain ; il le prépare et le rend plus efficient.

## Prochaines étapes proposées

1. Compléter la veille : lecture manuelle du site (ou capture d'écran fournie)
   pour confirmer la liste exacte des services et le design à reprendre.
2. Décider quels services entrent dans l'offre Opays (hébergement, CRM,
   marketing, agent vocal) au regard de la règle de décision d'`AGENTS.md`
   (sert la promesse ? simplifie ? exécutable proprement ? renforce la confiance ?).
3. Si l'agent vocal d'audit est retenu : ouvrir une **spec dédiée** (séparée de
   la refonte) couvrant le parcours, l'intégration au Palier Diagnostic et les
   contraintes de souveraineté.

## Limites de cette note

- Liste de services **non vérifiée intégralement** (une seule source de
  recherche).
- Aucune reprise de design effectuée (extraction du site impossible).
- Document de capture uniquement : aucune modification du code ni de l'offre.
