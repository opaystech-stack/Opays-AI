# Requirements Document

## Introduction

Ce document décrit les exigences d'une initiative globale de durcissement (sécurité) et d'amélioration du site marketing Opays Tech. Le site est une application monopage (SPA) rendue côté client, construite avec React 19, TanStack Router, Tailwind 4 et Vite. Il comprend des pages de prototype internes (`/tenant-0`, `/bridges-os`) et un formulaire de contact relié à une fonction edge (`api/send.ts`) qui envoie un e-mail via Resend.

Un audit a été réalisé et a identifié des écarts dans six domaines : sécurité de l'API de contact, référencement et indexation, conformité légale (FR/UE/RGPD), positionnement et confidentialité des prototypes internes, qualité front et accessibilité, et performance. L'initiative vise à corriger ces écarts en privilégiant la clarté, la crédibilité et la maintenabilité, conformément au positionnement d'Opays Tech comme cabinet d'« ingénierie de l'efficience ».

L'objectif est d'atteindre un site public sûr, conforme, correctement indexable, sans fuite de prototypes internes, et techniquement propre.

## Glossary

- **Site_Public** : application web marketing Opays Tech servie publiquement (pages et ressources statiques destinées aux visiteurs externes).
- **API_Contact** : fonction edge `api/send.ts` qui reçoit les soumissions du formulaire de contact et déclenche l'envoi d'un e-mail.
- **Formulaire_Contact** : composant front (`Contact.tsx`) permettant à un visiteur de soumettre une demande de consultance.
- **Modele_Email** : gabarit HTML de l'e-mail généré par l'API_Contact à partir des valeurs soumises.
- **Service_Email** : service tiers d'envoi d'e-mails (Resend) utilisé par l'API_Contact.
- **Couche_Rendu_SEO** : mécanisme de rendu côté serveur (SSR) ou de pré-rendu (pre-rendering) produisant du HTML peuplé pour les robots d'indexation.
- **Gestionnaire_Meta** : mécanisme de gestion des balises `<head>` (titre, description, canonical, Open Graph, données structurées) par page.
- **Pages_Prototype** : pages internes non destinées au public, à savoir `/tenant-0` et `/bridges-os`.
- **Navbar** : composant de navigation principal (`Navbar.tsx`).
- **Footer** : composant de pied de page (`Footer.tsx`).
- **Page_Mentions_Legales** : page d'informations légales obligatoires (mentions légales).
- **Page_Confidentialite** : page de politique de confidentialité (traitement des données personnelles).
- **Variable_Environnement** : valeur de configuration injectée à l'exécution et absente du code source versionné.
- **Robots_Txt** : fichier `robots.txt` servi à la racine du Site_Public.
- **Sitemap_Xml** : fichier `sitemap.xml` servi à la racine du Site_Public.
- **Champ_Honeypot** : champ de formulaire masqué destiné à piéger les robots de spam.
- **Visiteur** : personne accédant au Site_Public via un navigateur.
- **Robot_Indexation** : agent automatisé (crawler) d'un moteur de recherche.

## Requirements

### Requirement 1: Validation côté serveur des soumissions de contact

**User Story:** En tant qu'exploitant du Site_Public, je veux que toutes les soumissions du formulaire de contact soient validées côté serveur, afin de garantir l'intégrité des données reçues et de bloquer les requêtes malformées ou malveillantes.

#### Acceptance Criteria

1. WHEN une requête est reçue avec une méthode HTTP différente de POST, THE API_Contact SHALL répondre avec le code de statut 405.
2. IF l'en-tête `Content-Type` de la requête n'est pas `application/json`, THEN THE API_Contact SHALL rejeter la requête avec le code de statut 415.
3. IF le corps de la requête n'est pas un JSON valide, THEN THE API_Contact SHALL rejeter la requête avec le code de statut 400.
4. THE API_Contact SHALL vérifier que les champs `company`, `role`, `process` et `contact` sont présents et de type chaîne de caractères.
5. IF un champ obligatoire est absent ou n'est pas de type chaîne de caractères, THEN THE API_Contact SHALL rejeter la requête avec le code de statut 400 et un message d'erreur descriptif.
6. THE API_Contact SHALL rejeter avec le code de statut 400 toute valeur de champ dont la longueur dépasse 2000 caractères.
7. THE API_Contact SHALL accepter une valeur de champ vide (0 caractère) tant que sa longueur reste inférieure à la limite de 2000 caractères.
8. IF la valeur du champ `contact` est fournie comme adresse e-mail, THEN THE API_Contact SHALL vérifier que cette valeur respecte un format d'adresse e-mail valide.
9. WHEN toutes les validations réussissent, THE API_Contact SHALL transmettre la soumission au Service_Email et répondre avec le code de statut 200.
10. WHEN toutes les validations réussissent, THE API_Contact SHALL répondre avec le code de statut 200 indépendamment d'une défaillance en aval du Service_Email.

### Requirement 2: Échappement HTML des données injectées dans l'e-mail

**User Story:** En tant qu'exploitant du Site_Public, je veux que les valeurs soumises soient échappées avant insertion dans l'e-mail, afin d'empêcher l'injection de contenu HTML ou de scripts dans le Modele_Email.

#### Acceptance Criteria

1. WHEN l'API_Contact construit le Modele_Email, THE API_Contact SHALL échapper les caractères HTML spéciaux (`&`, `<`, `>`, `"`, `'`) de chaque valeur soumise avant insertion.
2. THE API_Contact SHALL conserver le texte d'origine soumis par le Visiteur de manière lisible après échappement dans le Modele_Email.
3. FOR ALL valeurs soumises, l'échappement puis le rendu du Modele_Email SHALL produire un contenu dans lequel aucune valeur soumise n'est interprétée comme balise HTML active.

### Requirement 3: Protection anti-spam du formulaire de contact

**User Story:** En tant qu'exploitant du Site_Public, je veux protéger l'API_Contact contre les soumissions automatisées, afin de limiter le spam et les abus.

#### Acceptance Criteria

1. THE Formulaire_Contact SHALL inclure un Champ_Honeypot masqué visuellement et exclu de la navigation au clavier.
2. IF le Champ_Honeypot est renseigné dans une soumission reçue, THEN THE API_Contact SHALL rejeter la soumission sans solliciter le Service_Email et répondre avec le code de statut 200.
3. WHERE une limitation de débit est activée, THE API_Contact SHALL limiter le nombre de soumissions acceptées à un maximum défini par adresse IP source sur une fenêtre de temps configurable.
4. IF le nombre de soumissions d'une adresse IP source dépasse la limite définie, THEN THE API_Contact SHALL rejeter la soumission avec le code de statut 429.

### Requirement 4: Configuration des paramètres d'envoi d'e-mail

**User Story:** En tant qu'exploitant du Site_Public, je veux que l'adresse destinataire et le domaine expéditeur soient configurés de façon sûre et professionnelle, afin d'éviter les valeurs codées en dur et d'améliorer la délivrabilité.

#### Acceptance Criteria

1. THE API_Contact SHALL lire l'adresse e-mail destinataire depuis une Variable_Environnement.
2. IF la Variable_Environnement de l'adresse destinataire est absente au démarrage, THEN THE API_Contact SHALL répondre avec le code de statut 500 et journaliser une erreur de configuration sans révéler de secret.
3. THE API_Contact SHALL utiliser une adresse expéditrice rattachée à un domaine vérifié auprès du Service_Email.
4. THE API_Contact SHALL exclure du code source versionné l'adresse destinataire et la clé d'API du Service_Email.

### Requirement 5: Rendu indexable pour les moteurs de recherche

**User Story:** En tant que responsable du référencement, je veux que les robots reçoivent du HTML peuplé, afin que le contenu du Site_Public soit correctement indexé.

#### Acceptance Criteria

1. THE Couche_Rendu_SEO SHALL produire, pour chaque page publique, une réponse HTML contenant le contenu textuel principal et les balises `<head>` avant exécution de JavaScript côté client.
2. WHEN un Robot_Indexation demande une page publique, THE Site_Public SHALL renvoyer un document HTML dont le contenu principal est présent dans la réponse initiale.
3. THE Couche_Rendu_SEO SHALL préserver le comportement de navigation côté client pour le Visiteur après hydratation.

### Requirement 6: Gestion complète des balises de tête par page

**User Story:** En tant que responsable du référencement, je veux une gestion complète des métadonnées par page, afin d'améliorer le partage social et la compréhension du site par les moteurs.

#### Acceptance Criteria

1. THE Gestionnaire_Meta SHALL définir, pour chaque page publique, une balise `<title>` et une balise meta `description`.
2. THE Gestionnaire_Meta SHALL définir une balise `<link rel="canonical">` pointant vers l'URL canonique de chaque page publique.
3. THE Gestionnaire_Meta SHALL définir les balises Open Graph `og:title`, `og:description`, `og:type`, `og:url` et `og:image` pour chaque page publique.
4. THE Gestionnaire_Meta SHALL inclure un bloc de données structurées JSON-LD de type `Organization` ou `LocalBusiness` décrivant Opays Tech.
5. THE Gestionnaire_Meta SHALL référencer une image Open Graph accessible publiquement via une URL absolue.

### Requirement 7: Fichiers robots.txt et sitemap.xml

**User Story:** En tant que responsable du référencement, je veux exposer un robots.txt et un sitemap.xml, afin de guider l'exploration et l'indexation du Site_Public.

#### Acceptance Criteria

1. THE Site_Public SHALL servir un fichier Robots_Txt accessible à la racine.
2. THE Robots_Txt SHALL référencer l'URL absolue du Sitemap_Xml.
3. THE Site_Public SHALL servir un fichier Sitemap_Xml accessible à la racine, listant les URL des pages publiques destinées à l'indexation.
4. THE Robots_Txt SHALL exclure de l'indexation les chemins des Pages_Prototype.

### Requirement 8: Pages légales obligatoires

**User Story:** En tant que représentant légal d'Opays Tech, je veux publier les mentions légales et la politique de confidentialité, afin de respecter les obligations FR/UE et RGPD.

#### Acceptance Criteria

1. THE Site_Public SHALL fournir une Page_Mentions_Legales accessible via une URL dédiée.
2. THE Site_Public SHALL fournir une Page_Confidentialite accessible via une URL dédiée décrivant les traitements de données personnelles.
3. THE Footer SHALL fournir un lien fonctionnel vers la Page_Mentions_Legales et un lien fonctionnel vers la Page_Confidentialite.
4. IF un lien légal du Footer est rompu, THEN THE Footer SHALL rester affiché avec les liens en l'état.
5. WHEN un Visiteur active le lien « Privacy » du Footer, THE Site_Public SHALL afficher la Page_Confidentialite.
6. THE Page_Confidentialite SHALL être rédigée en français.

### Requirement 9: Information sur la collecte de données dans le formulaire de contact

**User Story:** En tant que Visiteur, je veux être informé de l'usage de mes données lorsque je soumets le formulaire, afin de donner un consentement éclairé conforme au RGPD.

#### Acceptance Criteria

1. THE Formulaire_Contact SHALL afficher une mention indiquant la finalité de la collecte des données personnelles saisies.
2. THE Formulaire_Contact SHALL fournir un lien vers la Page_Confidentialite à proximité du bouton de soumission.
3. WHERE un consentement explicite est requis, THE Formulaire_Contact SHALL n'autoriser la soumission qu'après vérification du consentement du Visiteur.
4. IF le consentement requis n'est pas donné, THEN THE Formulaire_Contact SHALL empêcher la soumission et afficher un message d'information.

### Requirement 10: Confidentialité des pages de prototype internes

**User Story:** En tant que responsable du positionnement d'Opays Tech, je veux que les Pages_Prototype ne soient pas exposées au public, afin de protéger la crédibilité de la marque et la confidentialité des données de démonstration.

#### Acceptance Criteria

1. THE Navbar SHALL exclure de l'affichage public tout lien vers les Pages_Prototype.
2. THE Site_Public SHALL restreindre l'accès aux Pages_Prototype par un contrôle d'accès OU les marquer comme non indexables (`noindex`) et les retirer de la navigation publique.
3. THE Sitemap_Xml SHALL exclure les URL des Pages_Prototype.
4. THE Pages_Prototype SHALL exclure de leur contenu public toute donnée fictive nominative.
5. IF un Visiteur non autorisé accède à une Page_Prototype protégée, THEN THE Site_Public SHALL refuser l'accès ou rediriger vers une page publique.
6. WHERE le contrôle d'accès principal échoue, THE Site_Public SHALL appliquer une protection complémentaire (filtrage du contenu ou validation de session) avant d'afficher une Page_Prototype.

### Requirement 11: Correction de l'icône du bloc Contact

**User Story:** En tant que Visiteur, je veux que l'icône du bloc Contact s'affiche correctement, afin de percevoir un site soigné et crédible.

#### Acceptance Criteria

1. THE Formulaire_Contact SHALL afficher une icône rendue par une ressource d'icône effectivement chargée par le Site_Public.
2. IF une police d'icônes externe est requise pour le rendu d'une icône, THEN THE Site_Public SHALL charger cette police avant l'affichage de l'icône.
3. THE Site_Public SHALL afficher l'icône du bloc Contact sans afficher de texte de repli (glyphe brut ou caractère de substitution).

### Requirement 12: Mise à jour des mentions du pied de page

**User Story:** En tant que responsable de la marque, je veux un pied de page à jour et en français, afin de refléter l'année courante et la cohérence linguistique.

#### Acceptance Criteria

1. THE Footer SHALL afficher une année de copyright correspondant à l'année courante.
2. THE Footer SHALL afficher la mention des droits réservés en français.

### Requirement 13: Stabilité visuelle des images

**User Story:** En tant que Visiteur, je veux un affichage stable sans décalage de mise en page, afin de naviguer confortablement et d'améliorer les indicateurs de performance.

#### Acceptance Criteria

1. THE Site_Public SHALL définir les attributs `width` et `height` sur chaque image affichée dans une page publique.
2. WHEN une page publique se charge, THE Site_Public SHALL réserver l'espace de chaque image avant son chargement complet afin d'éviter tout décalage de mise en page.

### Requirement 14: Suppression du code mort

**User Story:** En tant que développeur mainteneur, je veux un code source sans éléments inutilisés, afin de préserver la lisibilité et la maintenabilité.

#### Acceptance Criteria

1. THE Site_Public SHALL exclure de son code source le composant `Bullet` inutilisé du fichier `Contact.tsx`.
2. THE Site_Public SHALL compiler et passer le linter sans erreur après suppression du code mort.

### Requirement 15: Allègement du déploiement public

**User Story:** En tant que responsable de la performance, je veux éviter de livrer le code des prototypes lourds au public, afin de réduire le poids du Site_Public et d'accélérer le chargement.

#### Acceptance Criteria

1. THE Site_Public SHALL exclure du bundle servi au public le code des Pages_Prototype lorsque celles-ci ne sont pas destinées à l'accès public.
2. WHERE les Pages_Prototype sont conservées dans le déploiement, THE Site_Public SHALL charger leur code de manière différée (code splitting) afin de ne pas l'inclure dans le bundle initial des pages publiques.
3. THE Site_Public SHALL servir les images dans un format optimisé et à une résolution adaptée à leur taille d'affichage.
