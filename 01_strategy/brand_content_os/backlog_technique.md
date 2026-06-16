# Backlog technique exécutable — Brand Content OS

## Légende
- **P0** : indispensable pour le MVP
- **P1** : important après le socle
- **P2** : amélioration / extension

---

## Épic 1 — Fondations produit
### P0
1. Créer la structure du projet front/backend.
2. Mettre en place l’authentification.
3. Créer la gestion des organisations.
4. Créer les rôles : admin, éditeur, valideur, lecteur.
5. Mettre en place la base PostgreSQL.
6. Ajouter l’audit log.
7. Mettre en place le stockage des médias.

### Critère d’acceptation
- un utilisateur peut se connecter,
- appartenir à une organisation,
- accéder à un espace isolé,
- laisser une trace d’action.

---

## Épic 2 — Brand Kit
### P0
1. Créer le modèle de données Brand Kit.
2. Permettre l’import du logo.
3. Gérer les couleurs de marque.
4. Gérer les typographies.
5. Gérer la voix éditoriale.
6. Gérer les mots interdits / autorisés.
7. Créer la bibliothèque de templates.

### P1
8. Gérer plusieurs brand kits par organisation.
9. Ajouter des presets par campagne ou pays.

### Critère d’acceptation
- une organisation peut configurer sa marque et la réutiliser dans les créations.

---

## Épic 3 — Composer de contenu
### P0
1. Créer le formulaire de brief.
2. Gérer objectif, audience, canal, langue, ton.
3. Créer la génération de texte par réseau.
4. Ajouter l’édition manuelle du résultat.
5. Ajouter la sauvegarde en brouillon.
6. Ajouter le statut de contenu.

### P1
7. Ajouter plusieurs variantes par publication.
8. Ajouter un mode “short / formal / campaign”.

### Critère d’acceptation
- un utilisateur peut créer un brief et obtenir plusieurs versions prêtes à être relues.

---

## Épic 4 — Génération d’images
### P0
1. Créer le service de génération d’image.
2. Stocker les images générées.
3. Associer image et campagne.
4. Permettre le téléchargement.
5. Permettre la réutilisation dans la bibliothèque.

### P1
6. Gérer les formats par réseau.
7. Gérer les prompts modèles par brand kit.

### Critère d’acceptation
- un visuel peut être généré, sauvegardé et réutilisé.

---

## Épic 5 — Workflow de validation
### P0
1. Créer les statuts : brouillon, en revue, approuvé, rejeté, programmé, publié.
2. Ajouter un valideur.
3. Ajouter un commentaire de validation.
4. Ajouter l’historique des versions.

### P1
5. Ajouter les notifications internes.
6. Ajouter les rappels de validation.

### Critère d’acceptation
- un contenu ne peut pas passer en publication sans statut valide.

---

## Épic 6 — Scheduler
### P0
1. Créer le calendrier éditorial.
2. Créer une file de jobs de publication.
3. Gérer la date/heure de publication.
4. Gérer les retries en cas d’échec.
5. Gérer le journal des échecs.

### Critère d’acceptation
- un post programmé se publie automatiquement ou remonte une erreur exploitable.

---

## Épic 7 — Connecteurs réseaux sociaux
### P0
1. Créer une abstraction de connecteur.
2. Intégrer le premier réseau prioritaire.
3. Gérer les tokens d’accès.
4. Gérer la publication de texte.
5. Gérer la publication avec média.

### P1
6. Ajouter un deuxième réseau.
7. Ajouter un troisième réseau.

### P2
8. Ajouter un support plus avancé par réseau selon les APIs.

### Critère d’acceptation
- au moins 1 à 3 réseaux peuvent recevoir une publication de bout en bout.

---

## Épic 8 — Bibliothèque de contenus
### P0
1. Créer la bibliothèque des posts.
2. Créer la bibliothèque des médias.
3. Ajouter la recherche simple.
4. Ajouter le filtre par projet / canal / statut.
5. Ajouter la réutilisation d’un contenu validé.

### P1
6. Ajouter les tags.
7. Ajouter la duplication de campagne.

### Critère d’acceptation
- une campagne validée peut être retrouvée et réutilisée rapidement.

---

## Épic 9 — Analytics
### P1
1. Compter les contenus créés.
2. Compter les contenus validés.
3. Compter les contenus publiés.
4. Afficher le taux d’échec de publication.
5. Afficher la fréquence de publication.

### P2
6. Ajouter les vues par canal.
7. Ajouter des métriques de réutilisation.

### Critère d’acceptation
- l’équipe peut suivre l’activité produit et la santé des publications.

---

## Épic 10 — Sécurité & exploitation
### P0
1. Chiffrer les secrets.
2. Séparer les organisations.
3. Restreindre les accès par rôle.
4. Journaliser les actions sensibles.
5. Prévoir la rotation des tokens.

### P1
6. Ajouter la rétention des contenus.
7. Ajouter l’export des journaux.

### Critère d’acceptation
- le produit est exploitable en contexte sensible sans perte de gouvernance.

---

## Séquence de livraison recommandée
### Sprint 1
- fondations,
- auth,
- organisation,
- base de données,
- audit log.

### Sprint 2
- brand kit,
- composer,
- génération texte,
- brouillon.

### Sprint 3
- génération image,
- bibliothèque,
- validation.

### Sprint 4
- scheduler,
- connecteur social 1,
- publication.

### Sprint 5
- connecteur social 2,
- analytics de base,
- durcissement sécurité.

---

## Dette volontaire à accepter au MVP
- vidéo lourde non prioritaire,
- multi-langue avancée limitée,
- collaboration temps réel non prioritaire,
- automation complète non prioritaire.

