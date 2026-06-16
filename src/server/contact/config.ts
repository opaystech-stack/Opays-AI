/**
 * Résolution de la configuration d'envoi d'e-mail (Requirement 4.1, 4.2).
 *
 * Module de logique pure, sans I/O réseau. Il lit les variables
 * d'environnement nécessaires à l'envoi d'e-mail via le Service_Email (Resend)
 * et échoue proprement (code 500) si l'une d'elles est absente, sans jamais
 * divulguer de secret (ni adresse e-mail, ni clé d'API) dans le message de log.
 *
 * Voir le design : .kiro/specs/site-hardening-amelioration/design.md
 * (section « Components and Interfaces » §4 et « Error Handling »).
 */

import type { EmailConfig } from "./types";

/**
 * Noms des variables d'environnement attendues. Source unique de vérité pour
 * la lecture de la configuration et pour les messages de log.
 */
const ENV_KEYS = {
  toAddress: "CONTACT_TO_EMAIL",
  fromAddress: "CONTACT_FROM_EMAIL",
  apiKey: "RESEND_API_KEY",
} as const;

/**
 * Source d'environnement injectable : un simple dictionnaire clé → valeur.
 * Permet de tester la résolution sans dépendre de l'environnement runtime.
 */
export type EnvSource = Record<string, string | undefined>;

/**
 * Résultat discriminé de la résolution de configuration.
 *
 * En cas d'échec, `logMessage` est sûr à journaliser : il ne contient que les
 * noms des variables manquantes, jamais leur valeur ni aucun autre secret.
 */
export type ConfigResult =
  | { ok: true; config: EmailConfig }
  | { ok: false; status: 500; logMessage: string };

/**
 * Récupère l'environnement runtime par défaut de façon défensive.
 *
 * `process` peut être absent dans certains runtimes edge ; on retourne alors un
 * objet vide plutôt que de lever une exception.
 */
function defaultEnv(): EnvSource {
  if (typeof process !== "undefined" && process.env) {
    return process.env as EnvSource;
  }
  return {};
}

/**
 * Considère une valeur d'environnement comme présente uniquement si elle est
 * une chaîne non vide une fois les espaces de bordure retirés.
 */
function isPresent(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Résout la configuration d'envoi depuis l'environnement fourni (ou l'env
 * runtime par défaut).
 *
 * @param env Source d'environnement injectable. Par défaut, l'environnement
 *   runtime (`process.env`) lorsqu'il est disponible.
 * @returns `{ ok: true, config }` si toutes les variables requises sont
 *   présentes, sinon `{ ok: false, status: 500, logMessage }` avec un message
 *   listant uniquement les NOMS des variables manquantes (sans secret).
 */
export function resolveEmailConfig(env: EnvSource = defaultEnv()): ConfigResult {
  const toAddress = env[ENV_KEYS.toAddress];
  const fromAddress = env[ENV_KEYS.fromAddress];
  const apiKey = env[ENV_KEYS.apiKey];

  const missing: string[] = [];
  if (!isPresent(toAddress)) missing.push(ENV_KEYS.toAddress);
  if (!isPresent(fromAddress)) missing.push(ENV_KEYS.fromAddress);
  if (!isPresent(apiKey)) missing.push(ENV_KEYS.apiKey);

  if (missing.length > 0) {
    return {
      ok: false,
      status: 500,
      // Ne contient que les NOMS des variables manquantes : aucun secret n'est
      // exposé (ni adresse destinataire, ni clé d'API).
      logMessage: `Configuration d'envoi incomplète : variable(s) d'environnement absente(s) : ${missing.join(", ")}`,
    };
  }

  return {
    ok: true,
    config: {
      toAddress: toAddress.trim(),
      fromAddress: fromAddress.trim(),
      apiKey: apiKey.trim(),
    },
  };
}
