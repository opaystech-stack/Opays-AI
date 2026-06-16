# Skill : Check Compliance

## Role
Vérifie l'état de conformité technique d'un environnement Opays (tenant 0, staging, client pilote) par rapport au plan et aux standards.

## Contrôles minimaux
- Secrets stockés dans Vault ou équivalent, jamais en clair.
- Logs centralisés.
- Dernier backup réussi.
- CrowdSec / protections actives.
- Rollback disponible et testable.
- Services critiques en ligne.
- Règles de sécurité appliquées.

## Sortie attendue
Un rapport synthétique avec :
- état général (`🟢`, `🟠`, `🔴`),
- anomalies détectées,
- criticité,
- action corrective recommandée.

## Règles
- Ne pas masquer les échecs.
- Ne pas conclure sans preuve.
- Si une donnée manque, la signaler comme non vérifiée.

