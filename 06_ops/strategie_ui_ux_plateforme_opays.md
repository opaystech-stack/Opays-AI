# Strategie UI/UX - Plateforme Opays Tech

**Statut :** note de design produit interne  
**Objectif :** definir une direction UI/UX claire, vendable et durable pour l'application interne et future plateforme client

## 1. Decision de depart

L'UI/UX n'est pas un detail.
Si l'outil n'est pas agreable, lisible et rapide a comprendre, il ne sera ni utilise, ni vendu, ni defendu dans la duree.

La plateforme doit donc proposer une experience :

- claire,
- premium,
- dense sans etre confuse,
- rassurante,
- orientee action,
- compatible avec des usages de gestion d'entreprise.

## 2. Principe directeur

Nous ne reinventons pas l'interface d'entreprise depuis zero.
Nous nous inspirons des meilleurs patterns deja prouves dans les outils de gestion :

- `Plane` pour la lisibilite des projets et des tickets,
- `Notion` / `Outline` pour la knowledge base,
- `Odoo` pour la densite fonctionnelle et les formulaires metier,
- `Grafana` pour la lecture des metriques,
- `Linear` pour la proprete visuelle et la vitesse,
- `Retool` / `ToolJet` uniquement comme accelerateurs temporaires pour des dashboards internes ou des prototypes rapides, pas comme base principale du produit.

## 3. Position UX retenue

### Ce que nous voulons

- un espace de travail tres lisible,
- une navigation rapide,
- des tableaux et des details bien structures,
- des actions evidentes,
- des etats clairs,
- une hiérarchie visuelle forte,
- des ecrans qui inspirent confiance.

### Ce que nous ne voulons pas

- un dashboard charge de widgets inutiles,
- une interface trop decorative,
- des menus caches sans logique,
- des ecrans qui demandent trop d'effort cognitif,
- une UX "demo" qui se casse quand l'usage devient serieux.

## 4. Structure d'interface cible

La plateforme doit suivre un modele proche d'un `enterprise workspace`.

### Composition recommandee

| Zone | Role |
|---|---|
| Sidebar gauche | navigation principale, spaces, tenants, modules |
| Top bar | recherche globale, commandes rapides, contexte actif |
| Zone centrale | workspace principal, tableau, detail, document, timeline |
| Panel droit | contexte, actions, audit, suggestions IA, liens |
| Footer discret | statut, synchro, alertes, version |

### Vues standard

1. **Dashboard de pilotage**
   - sante du systeme,
   - couts,
   - alertes,
   - taches en cours,
   - statut des tenants.

2. **Workspace projet**
   - liste,
   - detail,
   - historique,
   - owner,
   - dependances,
   - commentaires,
   - fichiers.

3. **Knowledge Vault**
   - pages,
   - recherche,
   - tags,
   - provenance,
   - version,
   - statut de sensibilité.

4. **Agent Console**
   - chat,
   - actions suggerees,
   - execution en cours,
   - logs resumés,
   - historique des sessions.

5. **Admin & Security**
   - roles,
   - acces,
   - secrets,
   - modules,
   - environnements,
   - politiques.

## 5. Stack UI choisie

Nous tranchons sur un socle qui correspond a l'existant du projet :

- `React`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui` sur la base deja preparee
- `Radix UI`
- `Lucide`
- `Framer Motion`
- `TanStack Router`
- `React Query`

### Pourquoi ce choix

- il est deja coherent avec le projet actuel,
- il permet une interface premium sans lourdeur,
- il facilite la creation de composants reutilisables,
- il permet de garder une architecture propre et scalable,
- il reste compatible avec les besoins d'administration dense.

### Regle de non-duplication

On ne rajoute pas une seconde stack UI principale.
Le socle officiel reste celui du projet actuel.
Les outils no-code ou low-code peuvent servir pour des prototypes internes, des dashboards ponctuels ou des validations rapides, mais pas comme colonne vertébrale du produit.

## 6. Regles de design

### 6.1 Systeme visuel

- couleurs sobres,
- contraste fort,
- accent marque controle,
- espacements constants,
- cartes lisibles,
- typographie claire,
- etats hover/focus bien visibles.

### 6.2 Densite

- les ecrans de gestion doivent etre denses mais aeres,
- les informations critiques doivent apparaitre sans scroller inutilement,
- les actions primaires doivent etre visibles immediatement,
- les zones secondaires doivent etre repliables.

### 6.3 Interaction

- recherche globale en premiere ligne,
- commandes rapides accessibles,
- confirmations sur les actions sensibles,
- feedback visuel sur chaque operation,
- gestion propre des erreurs et des etats vides.

### 6.4 Accessibilite

- navigation clavier,
- contrastes suffisants,
- labels explicites,
- composants cohérents,
- message d'erreur compréhensible.

## 7. Direction produit par zone

### Opays HQ interne

- plus dense,
- plus analytique,
- plus admin,
- plus orientee pilotage et gouvernance.

### Client portal

- plus simple,
- plus rassurant,
- plus operationnel,
- plus orientee statut, actions et valeur.

### Agent UI

- plus conversationnel,
- plus contextuel,
- plus orienté session, historique et actions rapides.

## 8. Raccourcis de conception

Pour aller vite sans sacrifier la qualite :

- utiliser des layouts reutilisables,
- standardiser les cards, tables, drawers, tabs et dialogs,
- factoriser les etats vides et d'erreur,
- creer un composant `page shell` commun,
- maintenir un `design token set` unique,
- ne pas multiplier les variantes visuelles.

## 9. Reference de developpement

### Phase UI 1

- creer la coque visuelle,
- definir la navigation,
- poser la typographie et les tokens,
- definir les composants de base,
- standardiser les layouts.

### Phase UI 2

- construire le dashboard interne,
- construire le knowledge vault,
- construire l'agent console,
- construire les vues d'administration,
- brancher les donnees reelles.

### Phase UI 3

- tester avec les utilisateurs internes,
- corriger la lisibilite,
- verifier la coherence mobile/desktop,
- ajouter les etats de charge, vide et erreur,
- figer la v1.

## 10. Regle de validation

Une interface est consideree acceptable seulement si :

- elle donne la bonne information en moins de 10 secondes,
- elle laisse comprendre la prochaine action,
- elle ne semble pas bricolée,
- elle reste claire sur desktop et mobile,
- elle ne casse pas la confiance.
