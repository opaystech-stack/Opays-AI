/**
 * Validation serveur des soumissions du Formulaire_Contact.
 *
 * Module de logique pure, sans I/O : il décide d'accepter ou de rejeter une
 * requête de contact à partir de sa méthode, de son `Content-Type` et de son
 * corps brut. La couche de transport (`api/send.ts`) se contente de lire la
 * requête, de déléguer la décision ici, puis de répondre.
 *
 * Source de vérité du Requirement 1 (validation côté serveur des soumissions).
 * Voir le design : .kiro/specs/site-hardening-amelioration/design.md
 * (section « Components and Interfaces », module 1).
 *
 * Règles encodées :
 *  - méthode ≠ POST                       → 405 (1.1)
 *  - `Content-Type` ≠ `application/json`  → 415 (1.2)
 *  - JSON invalide                        → 400 (1.3)
 *  - champ absent ou non-chaîne           → 400 + message descriptif (1.4, 1.5)
 *  - longueur > 2000                      → 400 (1.6)
 *  - chaîne vide acceptée                 → ok  (1.7)
 *  - `contact` au format e-mail vérifié   → 400 si format invalide (1.8)
 */

import { z } from "zod";

import type { ContactFields, ValidationResult } from "./types";

/** Longueur maximale autorisée pour toute valeur de champ (Requirement 1.6). */
export const MAX_FIELD_LENGTH = 2000;

/**
 * Détecte si une valeur ressemble à une adresse e-mail.
 *
 * Le Requirement 1.8 n'impose le contrôle de format e-mail que lorsque la
 * valeur du champ `contact` est « fournie comme adresse e-mail ». On considère
 * qu'une valeur est fournie comme e-mail dès qu'elle contient un « @ » : dans
 * ce cas seulement, le format e-mail complet est exigé. Les autres formes de
 * contact (téléphone, pseudo, etc.) restent acceptées.
 */
function looksLikeEmail(value: string): boolean {
  return value.includes("@");
}

/**
 * Schéma Zod d'une valeur de champ textuelle obligatoire (0..2000).
 *
 * Le champ doit être présent et de type chaîne (1.4, 1.5). La chaîne vide est
 * acceptée (1.7) ; toute longueur strictement supérieure à 2000 est rejetée
 * (1.6).
 */
function fieldSchema(fieldName: string): z.ZodString {
  return z
    .string({
      required_error: `Le champ « ${fieldName} » est obligatoire.`,
      invalid_type_error: `Le champ « ${fieldName} » doit être une chaîne de caractères.`,
    })
    .max(
      MAX_FIELD_LENGTH,
      `Le champ « ${fieldName} » ne doit pas dépasser ${MAX_FIELD_LENGTH} caractères.`,
    );
}

/**
 * Schéma Zod du corps de soumission de contact.
 *
 * - `company`, `role`, `process`, `contact` : chaînes obligatoires 0..2000.
 * - `contact` : vérifié au format e-mail uniquement s'il est fourni comme
 *   e-mail (présence d'un « @ »).
 * - `website` : Champ_Honeypot optionnel (chaîne), borné à 2000 caractères ;
 *   sa valeur n'est pas validée davantage ici (l'anti-spam la traite ensuite).
 */
export const contactSchema: z.ZodType<ContactFields> = z.object({
  company: fieldSchema("company"),
  role: fieldSchema("role"),
  process: fieldSchema("process"),
  contact: fieldSchema("contact").refine(
    (value) => !looksLikeEmail(value) || z.string().email().safeParse(value).success,
    { message: "Le champ « contact » doit être une adresse e-mail valide." },
  ),
  website: z.string().max(MAX_FIELD_LENGTH).optional(),
});

/**
 * Construit un message d'erreur descriptif à partir d'une erreur Zod.
 *
 * On retient la première issue afin de produire un message ciblé et lisible
 * pour la couche de transport (Requirement 1.5).
 */
function describeZodError(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) {
    return "Soumission invalide.";
  }
  return issue.message;
}

/**
 * Valide une requête de contact : méthode, content-type, JSON, puis schéma.
 *
 * Retourne un résultat discriminé conforme à {@link ValidationResult} :
 *  - `{ ok: true, value }` lorsque toutes les validations réussissent ;
 *  - `{ ok: false, status, message }` avec le code HTTP attendu sinon.
 */
export function validateContactRequest(input: {
  method: string;
  contentType: string | null;
  rawBody: string;
}): ValidationResult {
  // 1.1 — méthode ≠ POST → 405
  if (input.method.toUpperCase() !== "POST") {
    return {
      ok: false,
      status: 405,
      message: "Méthode non autorisée. Utilisez POST.",
    };
  }

  // 1.2 — Content-Type ≠ application/json → 415
  // On accepte les paramètres optionnels (ex. « application/json; charset=utf-8 »).
  const mediaType = (input.contentType ?? "").split(";")[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return {
      ok: false,
      status: 415,
      message: "Type de contenu non supporté. Utilisez application/json.",
    };
  }

  // 1.3 — JSON invalide → 400
  let parsed: unknown;
  try {
    parsed = JSON.parse(input.rawBody);
  } catch {
    return {
      ok: false,
      status: 400,
      message: "Corps de requête JSON invalide.",
    };
  }

  // 1.4 à 1.8 — validation du schéma → 400 avec message descriptif
  const result = contactSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      status: 400,
      message: describeZodError(result.error),
    };
  }

  return { ok: true, value: result.data };
}
