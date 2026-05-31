# Déploiement automatisé d'Opays HQ Google

Ce dossier est synchronisé vers Google Apps Script avec **clasp**.

## Principe

1. Tu modifies le code dans GitHub.
2. GitHub Actions lance `clasp push`.
3. Le workflow met à jour le déploiement Apps Script existant.
4. L'URL publique `.../exec` reste la même.

## Secrets à créer dans GitHub

Ajoute ces secrets dans le dépôt GitHub :

- `CLASP_RC_JSON`
  - contenu complet du fichier local `~/.clasprc.json`
  - obtenu après un `clasp login`
- `CLASP_DEPLOYMENT_ID`
  - l'identifiant de déploiement visible dans l'URL de l'application web
  - dans ton cas, c'est la longue chaîne entre `/s/` et `/exec`

## Pré-requis locaux

Sur ta machine, dans le dossier `opays-hq-google` :

```bash
npx @google/clasp login
npx @google/clasp push --force
```

## Déclenchement

Le workflow se lance :

- à chaque push sur `main` si des fichiers de `opays-hq-google/` ont changé
- manuellement via **Actions > Deploy Opays HQ Google Apps Script > Run workflow**

## Vérification

Après le push :

- ouvre le déploiement Apps Script
- recharge la page `.../exec`
- si le site n'a pas bougé, vérifie que le bon `CLASP_DEPLOYMENT_ID` est bien renseigné
