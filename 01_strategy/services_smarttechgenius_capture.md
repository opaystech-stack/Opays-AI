# Capture services — référence smarttechgenius.com

> Note de veille, séparée de la refonte du site vitrine (`refonte-site-vitrine`).
> Objectif : identifier les services et les arguments réutilisables pour l'offre
> Opays, **sans** reprendre le service de création de site web (hors périmètre
> par décision client), et sans perturber le travail en cours.
>
> **Source** : [smarttechgenius.com](https://smarttechgenius.com/) — agence
> canadienne (Moncton, Nouveau-Brunswick) positionnée web + IA pour PME.
> **Méthode d'extraction** : capture via Playwright (Chromium headless, rendu JS
> complet, attente `networkidle`). Les tentatives précédentes (fetch standard)
> avaient échoué car le site est entièrement rendu côté JavaScript.
> **Statut** : 12 pages capturées (toutes les pages publiques connues).
> **Conformité** : tout le contenu ci-dessous est **reformulé / synthétisé**.
> Aucune reprise verbatim. Contenu rephrasé pour conformité avec les
> restrictions de licence. Les chiffres de marché qu'ils citent sont repris
> comme faits sourcés par eux (à revérifier avant tout usage public Opays).

## 1. Arborescence complète du site (12 pages)

| Page | URL | Rôle |
|---|---|---|
| Accueil | `/` | Hub des 6 services + preuve sociale + FAQ |
| À propos | `/a-propos/` | Vision, 25 ans d'expérience revendiqués, compteurs |
| Portfolio | `/portfolio/` | ~12 réalisations (sites sectoriels) |
| Support | `/support/` | Formulaire d'assistance client/prospect |
| FAQ | `/foire-aux-questions/` | FAQ thématique par service |
| Se lancer | `/se-lancer/` | Formulaire de qualification → page de réservation |
| Web Intelligent | `/web-intelligent/` | Service : sites performants |
| ChatBot Intelligent | `/chatbot-intelligent/` | Service : assistant conversationnel |
| Automatisation | `/automatisation/` | Service : automatisation des process |
| Agents IA | `/agents-ia/` | Service : agents autonomes métier |
| Intégration IA | `/integration-ia/` | Service : IA greffée sur outils existants |
| Consultation Web et IA | `/consultation-web-et-ia/` | Service : conseil/cadrage payant |

**Identité** : « Smart Tech Génius », baseline « construire, lancer, faire
croître ». Cible déclarée : PME internationales. Contact : Moncton (Canada),
bilingue FR/EN.

## 2. Synthèse par service + décision Opays

Décision appliquée selon `AGENTS.md` : sert-elle la promesse ? simplifie-t-elle ?
exécutable proprement ? renforce-t-elle la confiance ?

### 2.1 Web Intelligent — ⚠️ Exclu (création de site)
- **Promesse** : le site comme « actif générant du CA », pas une vitrine.
- **6 piliers** : ultra-rapide (<1,5 s), SEO complet, conçu pour convertir,
  responsive total, connecté aux outils (CRM/analytics/paiement/IA), sécurisé
  par défaut (HTTPS, RGPD, Loi 25 Québec).
- **Stack affichée** : Next.js, React, Tailwind, Node.js, PostgreSQL.
- **Décision Opays** : **hors périmètre** (création de site exclue). À noter
  toutefois : l'argument « actif vs dépense » et les piliers performance/SEO/
  sécurité sont cohérents avec le durcissement déjà fait côté Opays.

### 2.2 ChatBot Intelligent — 🟡 À évaluer (brique du Diagnostic)
- **Promesse** : disponibilité 24/7, réponse < 2 s, multilingue (50+ langues),
  qualification automatique des leads avec scoring.
- **Comparatif** : service client humain (heures de bureau, lent, coûteux) vs
  bot (permanent, instantané, capacité illimitée).
- **Décision Opays** : intéressant **uniquement** rattaché à un système mesurable
  et à la souveraineté (exécution maîtrisée). Le chatbot pur dilue le
  positionnement « cabinet d'ingénierie » ; à considérer comme composant, pas
  comme offre autonome.

### 2.3 Automatisation — ✅ Retenu (cœur de l'efficience)
- **Promesse** : supprimer les tâches répétitives (copier-coller inter-logiciels,
  relances, ressaisie CRM, reporting manuel).
- **Arguments** : ~40 % du temps de travail automatisable ; erreurs de saisie
  comme source majeure de défauts ; gain de 1 500–3 000 h/an pour une PME de 10.
- **Méthode** : audit → priorisation → conception → mise en place → optimisation.
- **Décision Opays** : **aligné directement** avec la promesse d'efficience. À
  cadrer comme livrable du **Palier Système**. C'est le service le plus cohérent
  avec le discours Opays existant.

### 2.4 Agents IA — ✅ Retenu (Palier Transformation + souveraineté)
- **Promesse** : « employés digitaux » autonomes, mémoire long terme, capables
  d'agir (API, bases, CRM, web), raisonnement multi-étapes, guard-rails.
- **Méthode** : cas d'usage → architecture → développement → tests & guard-rails
  → déploiement + suivi.
- **Décision Opays** : **fort potentiel**, à rattacher au **Palier
  Transformation** et au discours souveraineté (déploiement local, données sous
  contrôle, guard-rails). À distinguer nettement du simple chatbot.

### 2.5 Intégration IA — ✅ Retenu (greffe sur l'existant)
- **Promesse** : ajouter de l'IA aux outils déjà en place (CRM, email, site,
  reporting) sans changer la stack — scoring de leads, prédiction, next best
  action, résumés d'appels, détection de churn.
- **Argument central** : « vos outils ne pensent pas » → l'IA est le cerveau
  manquant ; aucun changement d'outil pour les équipes.
- **Décision Opays** : **très cohérent** avec l'efficience et la maintenabilité
  (on capitalise sur l'existant). À positionner entre Palier Système et
  Transformation.

### 2.6 Consultation Web et IA — ✅ Retenu (= notre Diagnostic)
- **Promesse** : cadrer avant de dépenser ; consultation payante = indépendance
  (peut recommander de NE PAS faire le projet).
- **Méthode** : appel découverte gratuit (30 min) → audit préparatoire → session
  stratégique → livrable (roadmap) → suivi 30 jours.
- **Décision Opays** : **miroir direct du Diagnostic d'Efficience**. L'angle
  « l'audit gratuit des prestataires sert à vous vendre ; notre cadrage est
  indépendant » est un argument de confiance fort, réutilisable (en l'adaptant
  à notre Diagnostic gratuit + Palier Diagnostic payant).

## 3. Pièce maîtresse retenue : l'agent vocal d'audit

Le fil conducteur de la veille reste l'**agent vocal d'audit** : un agent IA
(section 2.4) spécialisé qui mène un premier audit conversationnel des process
(qualification, cartographie des frictions) **en amont** du Diagnostic gratuit
humain. Il relie trois services observés (Agents IA + Consultation + Intégration)
à la promesse centrale Opays : diagnostic, efficience, souveraineté (exécution
locale, données maîtrisées). Il prépare le diagnostic humain, ne le remplace pas.

## 4. Patterns réutilisables (structure & rhétorique)

Leurs pages de service suivent un gabarit narratif très efficace, transposable
à la charte Opays (sans copier le texte) :

1. **Accroche-douleur** : « pendant que vous lisez ces lignes, vous perdez… ».
2. **Le constat brutal** : 4 chiffres de marché + conséquence directe.
3. **Calcul du coût d'inaction** (manque à gagner chiffré).
4. **La solution** : 6 piliers / différenciateurs.
5. **Tableau comparatif** « avant ❌ vs après ✅ ».
6. **Méthode en 5 étapes** avec livrable clair par étape (anti-jargon).
7. **Timeline de gains** (0–3 mois / 3–6 / 6–12) avec bénéfice + impact.
8. **Étude de cas chiffrée** + verbatim client.
9. **Objections** (« Oui mais… ») en FAQ.
10. **Urgence finale** : « le moment est maintenant ».

→ Utile pour la **Page_Methode** et la **Page_Offres** Opays : le pattern
« méthode = étapes à livrable clair » et « timeline de gains » est compatible
avec nos exigences (phases, livrables, durées). Attention : leur ton très
agressif/urgentiste n'est **pas** la tonalité Opays (premium, humain, sobre).

## 5. Ce qu'on garde / ce qu'on écarte

**On garde (candidats d'extension de l'offre Opays) :**
- Automatisation des process → Palier Système.
- Agents IA + agent vocal d'audit → Palier Transformation / Diagnostic.
- Intégration IA sur l'existant → continuité Système ↔ Transformation.
- Posture de consultation indépendante → renforce notre Diagnostic.
- Le gabarit « méthode à livrables clairs » + « timeline de gains ».

**On écarte :**
- Création de site web (décision client, déjà couvert côté Opays).
- Le ton urgentiste/anxiogène et les chiffres ROI spectaculaires non sourcés
  (10x–50x) : incompatibles avec la crédibilité Opays. À ne reprendre qu'avec
  des preuves sourcées et anonymisées (cf. règles Bloc_Preuves de la refonte).
- Le design : on reste sur la charte Opays (glass/néon premium déjà en place).

## 6. Limites de cette capture

- Le texte des **accordéons FAQ** et de certaines **étapes** n'est que
  partiellement déplié (titres récupérés, réponses parfois repliées dans le DOM).
- Les **compteurs** (clients, projets, satisfaction) s'affichent à « 0+ » :
  animés au scroll, valeurs réelles non capturées.
- Les **études de cas** sont des exemples marketing (verbatims anonymes), à
  traiter comme du copywriting, pas comme des preuves vérifiables.

## 7. Prochaine étape proposée (hors refonte en cours)

Conformément à la règle « ne pas produire de refonte massive sans besoin clair »,
ouvrir un **spec dédié** (ex. `extension-offre-services` ou `agent-vocal-audit`)
pour cadrer proprement l'intégration de ces services à l'offre Opays, en gardant
les deux chantiers découplés. Entrée recommandée : agent vocal d'audit rattaché
au Palier Diagnostic, avec contraintes de souveraineté.

> Artefacts bruts de capture : `.codex_tmp/smarttech_pages/` (12 fichiers `.txt`
> + `_index.json`). Scripts : `.codex_tmp/capture_smarttech.mjs` et
> `capture_retry.mjs`.
