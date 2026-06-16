# ACCORD DE CADRAGE & PROTOCOLE DE CONFIDENTIALITÉ (NDA)
## PROGRAMME PILOTE "BRIDGES OPERATING SYSTEM"

**ENTRE LES SOUSSIGNÉS :**

1.  **OPAYS TECH**, cabinet d'ingénierie de l'efficience, représenté par son Directeur Général, M. Fénelon LAMSASIRI, ci-après dénommé **« OPAYS »**, d’une part,
2.  **BRIDGESAT** (et ses filiales Bridgesats, SATGLOB, Bridgesats Energy, Bridgesats Academy), représenté par M. _________________________, ci-après dénommé **« LE CLIENT »**, d’autre part.

Ci-après collectivement dénommés **« Les Parties »**.

---

### PRÉAMBULE
Le Client souhaite évaluer la faisabilité et la valeur ajoutée de l'implémentation d'un système d'exploitation d'entreprise intelligent nommé « Bridges OS » pour optimiser sa coordination interne et ses workflows de gestion.
OPAYS dispose d'une expertise et d'actifs technologiques propriétaires (architectures RAG, frameworks d'agents, méthodes d'ingestion documentaire, technologie "Compass") nécessaires à cette réalisation.
Afin de permettre la réalisation et l'évaluation d'un système pilote fonctionnel directement installé sur l'infrastructure du Client sans compromettre les secrets commerciaux d'OPAYS ni exposer les données sensibles du Client à des serveurs tiers, les Parties conviennent des termes du présent protocole.

---

### ARTICLE 1 : OBJET DU CONTRAT
Le présent contrat définit les conditions de réalisation du programme pilote "Bridges OS" d’une durée de 30 jours, ainsi que les règles strictes de confidentialité, de sécurité physique des données et de protection de la Propriété Intellectuelle associées à ce projet.

---

### ARTICLE 2 : DÉPLOIEMENT ET SÉCURITÉ DE L'HÉBERGEMENT
1.  **Hébergement local :** Le système Bridges OS (V1) sera entièrement déployé et configuré sur le serveur privé virtuel (**VPS**) fourni et contrôlé par le Client. OPAYS n'hébergera aucune donnée du Client sur ses propres serveurs.
2.  **Traitement local des documents :** L'ingestion et le traitement des documents (PDF, rapports, contrats) s'exécutent localement sur le VPS du Client. Le Client n'envoie aucune pièce confidentielle à OPAYS.
3.  **Audit non intrusif :** Durant les phases d'audit opérationnel et de cadrage, OPAYS intervient sur site ou par partage d'écran sécurisé. OPAYS s'interdit de copier, emporter ou dupliquer un quelconque document confidentiel ou fichier métier appartenant au Client.
4.  **Cloisonnement des accès (RBAC) :** Le système intègre des contrôles d'accès stricts. La base de connaissances et les outils associés sont cloisonnés selon les rôles définis (par exemple, un profil de caissier ne disposera pas des accès pour visualiser les documents d'affaires, contrats partenaires ou données stratégiques).

---

### ARTICLE 3 : DÉFINITION DE LA PROPRIÉTÉ INTELLECTUELLE
Les Parties s'accordent sur une séparation stricte de leurs actifs respectifs :
1.  **Propriété d’OPAYS TECH (Les Actifs Technologiques) :** Demeurent la propriété exclusive d'OPAYS l'ensemble des technologies sous-jacentes, architectures de serveurs, structures de bases de données (incluant pgvector/Qdrant), configurations d'agents IA, code source du moteur de contrôle, connecteurs standardisés, algorithmes RAG, et le code de l'assistant de gouvernance "Compass". Le présent contrat n'opère aucun transfert de propriété de ces technologies au profit du Client.
2.  **Propriété du Client (Les Données Métiers) :** Demeurent la propriété exclusive du Client l'ensemble des données opérationnelles, documents bruts (contrats, rapports, procédures), structures de workflows spécifiques à ses métiers, contenus textuels et bases de connaissances injectées dans le système au cours du pilote.
3.  **Droit d’usage :** OPAYS concède au Client un droit d'usage personnel, non transférable et temporaire sur le système pilote Bridges OS pour la durée d'évaluation convenue.

---

### ARTICLE 4 : CLAUSE DE NON-CONTOURNEMENT & DÉVELOPPEMENT INTERNE
Le Client dispose d'une équipe de développement logiciel en interne. En conséquence, le Client s'engage expressément à :
*   **Ne pas reproduire, imiter ou faire reproduire** par ses équipes internes ou par des tiers l'architecture logicielle, le système d'agents de relance automatique, les concepts d'intégration d'agents métier par rôle ou la mécanique de l'assistant "Compass" d'OPAYS qui lui auront été présentés lors du pilote.
*   **Ne pas utiliser les informations techniques**, les documentations de cadrage technique (ADR), ou la structure des dépôts Git d'OPAYS pour développer un système concurrent en interne.
*   **Limiter l'accès aux interfaces techniques** (code, configurations serveurs, bases vectorielles) du prototype aux seuls référents désignés par écrit, à l'exclusion de l'équipe de développement générale du Client, sauf accord écrit préalable d'OPAYS.

---

### ARTICLE 5 : CONFIDENTIALITÉ STRICTE (NDA)
Chaque partie s'engage à conserver sous le sceau de la confidentialité la plus stricte l'ensemble des informations (techniques, financières, commerciales ou méthodologiques) partagées par l'autre partie dans le cadre du projet :
*   Les documents confidentiels ne doivent être partagés qu'aux employés ayant un besoin impératif d'en connaître pour l'exécution du pilote.
*   Cette obligation de confidentialité survit à l'expiration du présent contrat pour une durée de **trois (3) ans**.

---

### ARTICLE 6 : CALENDRIER ET LIVRABLES
Le pilote s'exécute sur 30 jours à compter de la signature des présentes, selon les jalons décrits dans la Proposition Stratégique :
*   **J+3 :** Rapport d'audit rapide et de cadrage opérationnel (sur site).
*   **J+10 :** Présentation de la structure fonctionnelle et des maquettes d'interface.
*   **J+20 :** Déploiement et tests de la première version opérationnelle sur le VPS du Client.
*   **J+30 :** Livraison du système pilote fonctionnel V1 et ouverture des accès d'évaluation.

---

### ARTICLE 7 : CONDITIONS FINANCIÈRES
En contrepartie des prestations d'ingénierie et de la mise à disposition de la plateforme de test, le Client versera à OPAYS la somme globale et forfaitaire de **2 500 USD** selon l'échéancier suivant :
*   **Acompte de 10 % (250 USD) :** Payable au jour de la signature des présentes, conditionnant le démarrage des travaux.
*   **Paiement intermédiaire de 40 % (1 000 USD) :** Payable après déploiement et démonstration du système pilote fonctionnel (V1) installé sur le VPS du Client.
*   **Solde de 50 % (1 250 USD) :** Réparti en trois (3) mensualités égales de **416,66 USD** au cours de la phase d'optimisation et d'accompagnement de 90 jours qui suit la livraison.

---

### ARTICLE 8 : LOI APPLICABLE ET RÉSOLUTION DES LITIGES
Le présent accord est régi par la législation commerciale en vigueur. En cas de litige relatif à la validité, l'interprétation ou l'exécution du présent contrat, les Parties s'engagent à rechercher une solution amiable. À défaut d'accord amiable sous trente (30) jours, le litige sera soumis aux tribunaux compétents du siège social d'OPAYS TECH.

Fait en deux exemplaires originaux, à [Ville], le __________ 2026.

```
┌────────────────────────────────────────────────────────┐
│                      SCEAU OFFICIEL                    │
│                        OPAYS TECH                      │
│             Ingénierie de l'Efficience & IA            │
│                      [ CONFIDENTIEL ]                  │
└────────────────────────────────────────────────────────┘
```

**Pour OPAYS TECH**  
M. __________________________________  
Fonction : ___________________________  
Signature et cachet :  

<br><br>

**Pour Bridgesat**  
M. __________________________________  
Fonction : ___________________________  
Signature et cachet :  
