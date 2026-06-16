/**
 * Types partagés du périmètre « durcissement de l'API de contact ».
 *
 * Source de vérité des contrats de données utilisés par les modules de
 * logique pure (validation, échappement, anti-spam, configuration) et par le
 * handler edge `api/send.ts`. Ces types ne portent aucune logique : ils
 * fixent uniquement les signatures que les tâches suivantes implémenteront.
 *
 * Voir le design : .kiro/specs/site-hardening-amelioration/design.md
 * (section « Components and Interfaces » et « Data Models »).
 */

/**
 * Champs attendus du Formulaire_Contact.
 *
 * Chaque valeur textuelle est contrainte côté validation à une longueur de 0
 * à 2000 caractères. Le champ `contact` est vérifié au format e-mail s'il est
 * fourni comme adresse e-mail (Requirement 1.8).
 */
export interface ContactFields {
  /** Société du Visiteur (0..2000). */
  company: string;
  /** Rôle / fonction du Visiteur (0..2000). */
  role: string;
  /** Processus ou besoin décrit (0..2000). */
  process: string;
  /** Coordonnée de rappel ; format e-mail vérifié si fourni comme e-mail (0..2000). */
  contact: string;
  /**
   * Champ_Honeypot masqué : doit rester vide. Une valeur non vide signale une
   * soumission automatisée à ignorer silencieusement (Requirement 3.2).
   */
  website?: string;
}

/**
 * Résultat discriminé de la validation d'une requête de contact.
 *
 * En cas d'échec, `status` porte le code HTTP attendu par les exigences de
 * transport : 405 (méthode), 415 (content-type), 400 (corps invalide).
 */
export type ValidationResult =
  | { ok: true; value: ContactFields }
  | { ok: false; status: 400 | 405 | 415; message: string };

/**
 * Paramètres d'envoi d'e-mail résolus depuis l'environnement (Requirement 4).
 *
 * Aucune de ces valeurs n'est codée en dur : elles proviennent exclusivement
 * de variables d'environnement (`CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
 * `RESEND_API_KEY`).
 */
export interface EmailConfig {
  /** Adresse destinataire (CONTACT_TO_EMAIL). */
  toAddress: string;
  /** Adresse expéditrice rattachée à un domaine vérifié (CONTACT_FROM_EMAIL). */
  fromAddress: string;
  /** Clé d'API du Service_Email (RESEND_API_KEY). */
  apiKey: string;
}

/**
 * Configuration de la limitation de débit par IP source (Requirement 3.3, 3.4).
 *
 * La limitation est désactivable via `enabled` (clause « WHERE une limitation
 * est activée »).
 */
export interface RateLimitConfig {
  /** Active ou désactive la limitation de débit. */
  enabled: boolean;
  /** Nombre maximal de soumissions acceptées par fenêtre. */
  maxPerWindow: number;
  /** Durée de la fenêtre glissante, en secondes. */
  windowSeconds: number;
}

/**
 * Magasin de comptage des soumissions par IP, sur une fenêtre glissante.
 *
 * Interface stable permettant de brancher une implémentation en mémoire (tests)
 * ou compatible edge (Cloudflare KV / cache à TTL).
 */
export interface RateLimitStore {
  /**
   * Enregistre une soumission pour `ip` et retourne le nombre de hits comptés
   * dans la fenêtre `windowSeconds`.
   */
  hit(ip: string, windowSeconds: number): Promise<number>;
}
