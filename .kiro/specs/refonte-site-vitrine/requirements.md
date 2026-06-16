# Requirements Document

## Introduction

Ce document décrit les exigences de la refonte du site vitrine public d'Opays Tech. Le site actuel est une application monopage (one-pager) construite avec React et TanStack Start, organisée en sections (Hero, Approche, Solutions, RD, PourquoiNous, Vision, FAQ, Contact, Footer). Il est élégant mais n'expose ni les offres, ni la preuve opérationnelle, ni les livrables de la méthode, ni un chemin d'achat clair.

La refonte a été cadrée après une analyse concurrentielle (notamment du concurrent blackfig.tech, positionné cloud, model-agnostic, anglophone, mid-market). L'objectif est de transformer le one-pager en un site multi-pages structuré qui présente publiquement les offres productisées (sans montants), une méthode avec livrables et durées, un bloc de preuves opérationnelles, la crédibilité de l'équipe fondatrice, et une page des produits SaaS développés par Opays. Le site s'adresse à un public unique : les PME en croissance. Il porte un angle différenciant clair (souveraineté, IA locale, ancrage français et terrain) et un appel à l'action unique et répété (« Diagnostic gratuit »).

La refonte conserve l'identité visuelle actuelle (effets glass, néon, animations framer-motion) et reste cohérente avec le spec existant `site-hardening-amelioration` (SEO par page, conformité légale, performance, mise au privé des prototypes internes). Les chantiers hors périmètre — l'outil d'audit IA conversationnel interactif et la plateforme Opays Commons — ne sont pas traités ici, mais le site doit pouvoir y renvoyer ultérieurement.

## Glossary

- **Site_Vitrine** : application web marketing publique d'Opays Tech, objet de la présente refonte.
- **Page_Accueil** : page d'entrée du Site_Vitrine présentant le message-pivot, le public cible et les portes d'entrée vers les autres pages.
- **Page_Methode** : page présentant la méthode Opays sous forme de phases avec livrables nommés et durées indicatives.
- **Page_Offres** : page présentant les trois Paliers d'offre productisés.
- **Page_SaaS** : page présentant les produits SaaS développés par Opays.
- **Page_Souverainete_RD** : page présentant la branche recherche, l'IA locale et la souveraineté technologique.
- **Page_Contact** : page permettant au Visiteur de demander un Diagnostic gratuit.
- **Public_Cible** : segment unique adressé par le Site_Vitrine, à savoir les PME en croissance disposant d'une activité réelle mais de processus dispersés à structurer.
- **Message_Pivot** : phrase d'angle différenciant du Site_Vitrine : « L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas. »
- **Palier** : niveau d'offre productisée nommé, présenté publiquement sans montant.
- **Palier_Diagnostic** : Palier 1 « Diagnostic d'Efficience », porte d'entrée (audit + recommandations chiffrées).
- **Palier_Systeme** : Palier 2 « Système d'Efficience », recommandé (conception + déploiement + suivi mensuel, branche FORGE).
- **Palier_Transformation** : Palier 3 « Transformation Souveraine » (IA locale, RBAC, patrimoine cognitif propriétaire, branche SOVEREIGN).
- **Resume_Offre** : description structurée d'un Palier suivant les cinq lignes obligatoires d'OPAYS_HQ section 9 : problème traité, solution proposée, bénéfice opérationnel, niveau d'accompagnement, prochaine action.
- **Phase_Methode** : étape de la méthode Opays comportant un nom, un ou plusieurs livrables nommés et une durée indicative.
- **Livrable** : production concrète et nommée associée à une Phase_Methode.
- **Bloc_Preuves** : section présentant des métriques de résultat opérationnel (temps gagné, erreurs évitées, retour sur investissement).
- **Section_Equipe** : section ou page présentant les fondateurs nommés et leurs rôles.
- **Produit_SaaS** : produit logiciel en libre-service développé par Opays (par exemple Opays Nexus, Brand Content OS).
- **CTA_Diagnostic** : appel à l'action unique du Site_Vitrine invitant à réserver un Diagnostic gratuit.
- **Identite_Visuelle** : système visuel existant d'Opays Tech (effets glass, néon, animations framer-motion).
- **Navigation_Principale** : composant de navigation reliant les pages du Site_Vitrine.
- **Visiteur** : personne accédant au Site_Vitrine via un navigateur.
- **Chantier_Externe** : initiative hors périmètre destinée à être liée ultérieurement (outil d'audit IA conversationnel, plateforme Opays Commons).

## Requirements

### Requirement 1: Structure multi-pages

**User Story:** En tant que Visiteur, je veux naviguer dans un site structuré en pages distinctes, afin de trouver rapidement l'information correspondant à mon besoin.

#### Acceptance Criteria

1. THE Site_Vitrine SHALL fournir les pages distinctes suivantes, chacune accessible par une URL dédiée et unique : Page_Accueil, Page_Methode, Page_Offres, Page_SaaS, Page_Souverainete_RD et Page_Contact.
2. THE Navigation_Principale SHALL fournir, pour chacune des 6 pages publiques du Site_Vitrine, un lien activable menant à l'URL dédiée de cette page.
3. WHEN un Visiteur active un lien de la Navigation_Principale, THE Site_Vitrine SHALL afficher la page cible correspondante dans un délai maximal de 2 secondes après l'activation.
4. WHEN un Visiteur saisit ou ouvre directement l'URL dédiée d'une page publique, THE Site_Vitrine SHALL afficher la page correspondant à cette URL.
5. IF un Visiteur demande une URL ne correspondant à aucune page publique définie, THEN THE Site_Vitrine SHALL afficher une page d'erreur indiquant que la ressource est introuvable et présentant un lien de retour vers la Page_Accueil.
6. WHILE une page publique est affichée, THE Navigation_Principale SHALL distinguer visuellement le lien de la page courante de tous les autres liens, par un état visuel actif différent de l'état par défaut.
7. WHEN un Visiteur navigue entre deux pages publiques après le chargement initial, THE Site_Vitrine SHALL effectuer la transition côté client sans rechargement complet de la page.

### Requirement 2: Public cible unique et message-pivot

**User Story:** En tant que dirigeant de PME en croissance, je veux comprendre immédiatement que le Site_Vitrine s'adresse à moi et ce qui distingue Opays, afin de décider de poursuivre ma lecture.

#### Acceptance Criteria

1. WHEN la Page_Accueil est chargée, THE Page_Accueil SHALL afficher dans la zone visible sans défilement (above-the-fold) une formulation désignant explicitement le Public_Cible comme les PME en croissance.
2. WHEN la Page_Accueil est chargée, THE Page_Accueil SHALL afficher dans la zone visible sans défilement (above-the-fold) le Message_Pivot en reproduisant exactement la formulation du Glossaire : « L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas. »
3. THE Site_Vitrine SHALL présenter le Public_Cible comme un segment unique, c'est-à-dire un seul et unique Public_Cible affiché, sans liste ni page dédiée à des secteurs d'activité distincts.
4. WHEN la Page_Accueil est chargée, THE Page_Accueil SHALL formuler l'angle différenciant en mentionnant explicitement les trois axes suivants : la souveraineté, l'IA locale et l'ancrage français et terrain.
5. IF la Page_Accueil est chargée sans afficher dans la zone visible sans défilement (above-the-fold) à la fois la désignation du Public_Cible et le Message_Pivot exact, THEN THE Site_Vitrine SHALL être considéré comme non conforme à l'exigence d'identification immédiate du public et du message-pivot.

### Requirement 3: Offres productisées sans montant

**User Story:** En tant que Visiteur, je veux voir clairement les trois niveaux d'offre d'Opays sans être confronté à un prix avant compréhension de mon besoin, afin d'identifier la porte d'entrée adaptée.

#### Acceptance Criteria

1. THE Page_Offres SHALL présenter publiquement les trois Paliers (Palier_Diagnostic, Palier_Systeme et Palier_Transformation), affichés dans cet ordre croissant d'engagement, chacun comportant un titre, une description et la liste de ses livrables.
2. THE Page_Offres SHALL exclure de l'affichage public tout montant tarifaire, fourchette de prix ou unité monétaire associé à un Palier, quel que soit le Palier concerné.
3. THE Page_Offres SHALL identifier le Palier_Systeme comme palier recommandé au moyen d'un indicateur visuel distinctif (libellé ou badge « Recommandé ») présent uniquement sur ce Palier et absent des deux autres Paliers.
4. THE Page_Offres SHALL identifier le Palier_Diagnostic comme porte d'entrée de la relation commerciale au moyen d'une mention textuelle explicite indiquant qu'il constitue la première étape recommandée du parcours.
5. WHEN l'un des trois Paliers est affiché, THE Page_Offres SHALL présenter, dans le bloc de ce Palier, un CTA_Diagnostic visible et activable orientant vers la prise de rendez-vous de diagnostic.
6. IF l'activation d'un CTA_Diagnostic échoue (cible indisponible ou non chargée), THEN THE Page_Offres SHALL afficher un message d'erreur indiquant que la prise de rendez-vous est momentanément indisponible et conserver l'affichage des trois Paliers sans perte d'information.

### Requirement 4: Résumé d'offre selon les cinq lignes obligatoires

**User Story:** En tant que responsable de la marque, je veux que chaque offre soit résumée selon le format standard d'OPAYS_HQ, afin de garantir clarté et cohérence.

#### Acceptance Criteria

1. THE Page_Offres SHALL fournir, pour chaque Palier, un Resume_Offre comportant une ligne « problème traité » contenant un texte non vide d'au maximum 280 caractères.
2. THE Page_Offres SHALL fournir, pour chaque Palier, un Resume_Offre comportant une ligne « solution proposée » contenant un texte non vide d'au maximum 280 caractères.
3. THE Page_Offres SHALL fournir, pour chaque Palier, un Resume_Offre comportant une ligne « bénéfice opérationnel » contenant un texte non vide d'au maximum 280 caractères.
4. THE Page_Offres SHALL fournir, pour chaque Palier, un Resume_Offre comportant une ligne « niveau d'accompagnement » contenant un texte non vide d'au maximum 280 caractères.
5. THE Page_Offres SHALL fournir, pour chaque Palier, un Resume_Offre comportant une ligne « prochaine action » contenant un texte non vide d'au maximum 280 caractères.
6. WHEN un visiteur affiche la Page_Offres, THE Page_Offres SHALL présenter les cinq lignes de chaque Resume_Offre dans l'ordre obligatoire suivant : problème traité, solution proposée, bénéfice opérationnel, niveau d'accompagnement, prochaine action.
7. IF un Palier ne comporte pas les cinq lignes obligatoires non vides, THEN THE Page_Offres SHALL ne pas afficher le Palier concerné et SHALL présenter une indication signalant que le Resume_Offre est incomplet, sans altérer l'affichage des autres Paliers.

### Requirement 5: Méthode avec livrables et durées

**User Story:** En tant que Visiteur, je veux comprendre les étapes concrètes de la méthode Opays, leurs livrables et leurs durées, afin d'évaluer ce que j'obtiens et dans quels délais.

#### Acceptance Criteria

1. THE Page_Methode SHALL présenter la méthode Opays sous forme d'au minimum 4 Phase_Methode successives et distinctes.
2. THE Page_Methode SHALL afficher, pour chaque Phase_Methode, au moins un Livrable identifié par un libellé textuel non vide.
3. THE Page_Methode SHALL afficher, pour chaque Phase_Methode, une durée indicative exprimée dans une unité de temps explicite (jours ou semaines).
4. THE Page_Methode SHALL présenter au minimum quatre Phase_Methode couvrant respectivement la lecture du terrain, la cartographie des frictions, la construction et la mise en service, chacune apparaissant comme une phase distincte.
5. THE Page_Methode SHALL afficher les Phase_Methode dans leur ordre chronologique de déroulement, de la première à la dernière phase.
6. IF une Phase_Methode ne dispose pas de Livrable nommé ou de durée indicative, THEN THE Page_Methode SHALL omettre cette Phase_Methode de l'affichage plutôt que de présenter un champ vide.

### Requirement 6: Bloc de preuves et métriques

**User Story:** En tant que Visiteur, je veux voir des résultats opérationnels mesurables, afin d'évaluer la crédibilité d'Opays.

#### Acceptance Criteria

1. WHEN un Visiteur consulte la page contenant le Bloc_Preuves, THE Site_Vitrine SHALL afficher le Bloc_Preuves présentant entre 3 et 6 métriques de résultat opérationnel, chaque métrique comportant une valeur chiffrée et son unité de mesure associée.
2. THE Bloc_Preuves SHALL présenter au moins les trois catégories de métriques suivantes : temps gagné, erreurs évitées et retour sur investissement.
3. THE Bloc_Preuves SHALL présenter les preuves clients sous forme générique, sans mentionner de nom de client, de raison sociale, de logo ou de marque permettant d'identifier un client référencé.
4. THE Bloc_Preuves SHALL exclure toute métrique dépourvue d'une source de validation interne consultable et toute valeur de résultat dépassant les bornes plausibles définies par catégorie (par exemple, un gain de temps strictement compris entre 1 % et 100 %).
5. IF aucune métrique disposant d'une source de validation interne n'est disponible, THEN THE Bloc_Preuves SHALL masquer la métrique concernée plutôt qu'afficher une valeur vide, nulle ou par défaut.

### Requirement 7: Crédibilité de l'équipe

**User Story:** En tant que Visiteur, je veux connaître les personnes derrière Opays et leurs rôles, afin de renforcer ma confiance.

#### Acceptance Criteria

1. WHEN un Visiteur consulte la Section_Equipe, THE Site_Vitrine SHALL afficher une fiche distincte pour chacun des quatre membres fondateurs, chaque fiche présentant au minimum le nom complet et le ou les rôles du membre.
2. WHEN la Section_Equipe est affichée, THE Section_Equipe SHALL présenter Fénelon Lamsasiri avec les rôles « Directeur Général » et « Lead R&D ».
3. WHEN la Section_Equipe est affichée, THE Section_Equipe SHALL présenter Prince Bagheni avec le rôle « Directeur Commercial (CSO) ».
4. WHEN la Section_Equipe est affichée, THE Section_Equipe SHALL présenter Patricia Zamwana avec les rôles « Ventes », « Comptabilité » et « Trésorerie ».
5. WHEN la Section_Equipe est affichée, THE Section_Equipe SHALL présenter Zaina Bwale Godlove avec les rôles « Ventes » et « Communication ».
6. IF les informations (nom ou rôle) d'un membre fondateur ne sont pas disponibles au moment de l'affichage, THEN THE Site_Vitrine SHALL omettre la fiche incomplète et afficher uniquement les fiches dont le nom et le ou les rôles sont disponibles, sans afficher de champ vide.

### Requirement 8: Page des produits SaaS

**User Story:** En tant que Visiteur, je veux découvrir les produits SaaS développés par Opays, afin d'évaluer leur capacité de production logicielle.

#### Acceptance Criteria

1. WHEN un Visiteur consulte la Page_SaaS, THE Page_SaaS SHALL afficher la liste des Produit_SaaS développés par Opays, avec un minimum de 2 produits et un maximum de 12 produits par page.
2. THE Page_SaaS SHALL afficher, pour chaque Produit_SaaS, son nom (1 à 60 caractères) et un descriptif de la valeur opérationnelle apportée (40 à 300 caractères).
3. THE Page_SaaS SHALL inclure au minimum les Produit_SaaS « Opays Nexus » et « Brand Content OS ».
4. WHERE un Produit_SaaS est affiché, THE Page_SaaS SHALL fournir, pour ce produit, au moins un élément d'action parmi un CTA_Diagnostic ou un lien d'accès au produit.
5. IF aucun Produit_SaaS n'est disponible à l'affichage, THEN THE Page_SaaS SHALL afficher un message indiquant l'absence de produit à présenter et conserver l'accès au CTA_Diagnostic global de la page.
6. IF un lien d'accès à un Produit_SaaS est indisponible ou non renseigné, THEN THE Page_SaaS SHALL afficher le CTA_Diagnostic à la place du lien pour ce produit, sans interrompre l'affichage des autres Produit_SaaS.

### Requirement 9: Page souveraineté et R&D

**User Story:** En tant que Visiteur sensible à l'indépendance technologique, je veux comprendre l'approche d'Opays en matière d'IA locale et de souveraineté, afin d'apprécier l'angle différenciant.

#### Acceptance Criteria

1. THE Page_Souverainete_RD SHALL présenter, dans une section dédiée à l'IA locale, l'approche d'Opays en matière de souveraineté technologique et d'ancrage français et terrain, en énonçant explicitement le principe selon lequel l'IA est opérée « sans dépendre d'infrastructures que vous ne contrôlez pas ».
2. THE Page_Souverainete_RD SHALL présenter le patrimoine cognitif propriétaire comme élément du Palier_Transformation, en décrivant en une phrase son rôle (capitalisation des savoirs de l'organisation sous contrôle conjoint d'Opays et du client).
3. THE Page_Souverainete_RD SHALL afficher le texte exact du Message_Pivot « L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas. » ou un lien explicite vers la Page_Accueil qui le porte.
4. THE Page_Souverainete_RD SHALL présenter le contrôle d'accès (RBAC) comme élément du Palier_Transformation, en décrivant en une phrase son rôle (restriction des accès aux données et aux modèles selon les rôles).
5. THE Page_Souverainete_RD SHALL présenter la branche recherche d'Opays en nommant Fénelon Lamsasiri avec le rôle de Lead R&D.
6. WHEN la Page_Souverainete_RD est affichée, THE Site_Vitrine SHALL fournir un CTA_Diagnostic dirigeant vers la Page_Contact, cohérent avec le CTA_Diagnostic unique défini en Requirement 10.

### Requirement 10: Appel à l'action unique et répété

**User Story:** En tant que Visiteur intéressé, je veux un chemin d'action clair et constant, afin de réserver facilement un Diagnostic gratuit depuis n'importe quelle page.

#### Acceptance Criteria

1. THE Site_Vitrine SHALL utiliser un CTA_Diagnostic unique dont le libellé est choisi une seule fois parmi « Diagnostic gratuit » ou « Réserver une consultance gratuite » et reste strictement identique (texte et casse) sur toutes les pages publiques.
2. THE Site_Vitrine SHALL afficher le CTA_Diagnostic sur chacune des pages publiques à raison d'au moins une occurrence visible sans défilement supplémentaire au chargement de la page.
3. WHEN un Visiteur active le CTA_Diagnostic, THE Site_Vitrine SHALL diriger le Visiteur vers la Page_Contact en moins de 2 secondes.
4. IF la Page_Contact est indisponible lorsqu'un Visiteur active le CTA_Diagnostic, THEN THE Site_Vitrine SHALL afficher un message d'erreur indiquant l'indisponibilité, maintenir le Visiteur sur la page courante et préserver son contexte de navigation.
5. THE Site_Vitrine SHALL limiter chaque page publique à un seul appel à l'action principal, qui est le CTA_Diagnostic, tout autre lien ou bouton étant présenté uniquement comme navigation secondaire et menant à une destination distincte de la réservation du Diagnostic gratuit.

### Requirement 11: Cohérence de l'identité visuelle

**User Story:** En tant que responsable de la marque, je veux que les nouvelles pages conservent l'identité visuelle existante, afin de préserver la continuité et le caractère premium.

#### Acceptance Criteria

1. WHEN une page publique se charge, THE Site_Vitrine SHALL appliquer les composants de l'Identite_Visuelle existante (effets glass, néon, animations framer-motion) définis dans la charte, de sorte que chaque page publique utilise au moins ces trois familles d'effets.
2. WHEN une page publique affiche son contenu principal, THE Site_Vitrine SHALL rendre le message clé (titre et proposition de valeur) visible dans la première zone visible (sans défilement) sur un écran de 1280x720 pixels, avant tout effet visuel décoratif.
3. IF un effet visuel (glass, néon, animation) réduit le ratio de contraste du texte principal sous 4,5:1 ou retarde l'affichage du message clé au-delà de 1 seconde, THEN THE Site_Vitrine SHALL prioriser le rendu lisible du message en désactivant ou atténuant l'effet concerné.
4. THE Site_Vitrine SHALL rédiger le contenu publié des pages publiques en français, à la voix active et à la deuxième personne, avec des phrases d'au plus 25 mots en moyenne par bloc de texte.
5. THE Site_Vitrine SHALL exclure du contenu publié les termes de jargon figurant dans la liste de mots interdits de la charte éditoriale ainsi que toute affirmation chiffrée non accompagnée d'une source vérifiable.

### Requirement 12: Cohérence avec le durcissement du site

**User Story:** En tant que responsable technique, je veux que la refonte reste compatible avec le spec de durcissement, afin de ne pas régresser sur le SEO, le légal et la confidentialité des prototypes.

#### Acceptance Criteria

1. WHEN une nouvelle page publique est rendue, THE Site_Vitrine SHALL fournir une balise `<title>` non vide de 1 à 60 caractères, unique parmi les pages publiques.
2. WHEN une nouvelle page publique est rendue, THE Site_Vitrine SHALL fournir une balise meta `description` non vide de 50 à 160 caractères, propre à la page.
3. IF une page publique ne possède pas de balise `<title>` ou de balise meta `description` conforme aux longueurs spécifiées, THEN THE Site_Vitrine SHALL empêcher la publication de la page et signaler l'erreur indiquant la balise manquante ou non conforme lors de la construction.
4. WHEN une nouvelle page publique est rendue, THE Site_Vitrine SHALL fournir une balise `<link rel="canonical">` pointant vers l'URL canonique absolue et unique de la page.
5. THE Site_Vitrine SHALL exclure de la Navigation_Principale toute page de prototype interne et SHALL marquer chaque page de prototype interne comme non indexable.
6. THE Site_Vitrine SHALL exclure du fichier sitemap toute page de prototype interne.
7. THE Site_Vitrine SHALL fournir, dans le pied de page de chaque page publique, un lien vers la page de mentions légales et un lien vers la page de politique de confidentialité, chaque lien retournant la page cible correspondante.
8. WHEN une nouvelle page publique est ajoutée, THE Site_Vitrine SHALL inclure son URL canonique dans le fichier sitemap.
9. IF l'ajout d'une page publique au fichier sitemap échoue, THEN THE Site_Vitrine SHALL conserver le sitemap dans son état valide antérieur et signaler l'erreur indiquant l'URL non ajoutée.

### Requirement 13: Préparation des liens vers les chantiers externes

**User Story:** En tant que responsable produit, je veux que le Site_Vitrine puisse renvoyer plus tard vers les chantiers externes, afin d'éviter une refonte structurelle ultérieure.

#### Acceptance Criteria

1. THE Site_Vitrine SHALL exclure de son périmètre fonctionnel toute intégration de l'outil d'audit IA conversationnel interactif et de la plateforme Opays Commons.
2. WHERE un Chantier_Externe est mis à disposition, THE Site_Vitrine SHALL permettre l'ajout d'un lien sortant vers l'URL de ce Chantier_Externe sans ajout, suppression ni renommage d'une entrée existante de la Navigation_Principale.
3. WHEN un Visiteur active un lien vers un Chantier_Externe, THE Site_Vitrine SHALL ouvrir l'URL cible dans un nouvel onglet et signaler visuellement au Visiteur qu'il s'agit d'un lien externe.
4. IF aucun Chantier_Externe n'est mis à disposition, THEN THE Site_Vitrine SHALL n'afficher aucun lien vers un Chantier_Externe et exclure tout lien inactif ou pointant vers une cible indisponible.
5. THE Site_Vitrine SHALL exclure les URL des Chantier_Externe du fichier sitemap et des balises canoniques des pages du Site_Vitrine.
