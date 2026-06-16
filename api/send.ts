/**
 * API_Contact — handler edge (Cloudflare Pages Function).
 *
 * Couche de transport MINCE : elle lit la requête, délègue toute la logique aux
 * modules de logique pure du périmètre « durcissement de l'API de contact »,
 * puis traduit le résultat en réponse HTTP. Aucune règle métier, aucun secret
 * ni adresse n'est codé en dur ici.
 *
 * Orchestration (design A2 / Error Handling) :
 *   1. validateContactRequest   → 405 (méthode) / 415 (content-type) / 400 (corps)
 *   2. isHoneypotTriggered      → 200 silencieux (ne pas renseigner le robot)
 *   3. resolveEmailConfig       → 500 si configuration absente (sans secret)
 *   4. checkRateLimit           → 429 si dépassement (si un magasin edge est dispo)
 *   5. buildEmailHtml + Resend  → 200 MÊME en cas de défaillance aval du Service_Email
 *
 * Runtime : Cloudflare Pages Function. La configuration (clé Resend, adresses)
 * provient EXCLUSIVEMENT de `env` via `resolveEmailConfig`. L'adresse
 * expéditrice est rattachée au domaine vérifié (CONTACT_FROM_EMAIL). L'IP source
 * est lue depuis l'en-tête `CF-Connecting-IP`.
 *
 * Voir le design : .kiro/specs/site-hardening-amelioration/design.md
 * (« Components and Interfaces » §5 et « Error Handling »).
 */

import { Resend } from "resend";

import { resolveEmailConfig } from "../src/server/contact/config";
import {
  checkRateLimit,
  EdgeRateLimitStore,
  isHoneypotTriggered,
  type EdgeKVNamespace,
} from "../src/server/contact/antispam";
import { buildEmailHtml } from "../src/server/contact/escape";
import { validateContactRequest } from "../src/server/contact/validation";
import type { RateLimitConfig } from "../src/server/contact/types";

/**
 * Variables et liaisons d'environnement attendues côté Cloudflare.
 *
 * Les adresses et la clé d'API ne sont jamais codées en dur : elles sont
 * injectées via `env`. La limitation de débit est optionnelle et ne s'active
 * que si une liaison KV (`CONTACT_RATE_LIMIT`) est disponible.
 */
interface ContactEnv {
  /** Adresse destinataire (résolue par `resolveEmailConfig`). */
  CONTACT_TO_EMAIL?: string;
  /** Adresse expéditrice rattachée au domaine vérifié. */
  CONTACT_FROM_EMAIL?: string;
  /** Clé d'API du Service_Email (Resend). */
  RESEND_API_KEY?: string;
  /** Active la limitation de débit (« true » pour activer). */
  RATE_LIMIT_ENABLED?: string;
  /** Nombre maximal de soumissions acceptées par fenêtre. */
  RATE_LIMIT_MAX?: string;
  /** Durée de la fenêtre glissante, en secondes. */
  RATE_LIMIT_WINDOW_SECONDS?: string;
  /** Liaison Cloudflare KV pour le comptage par IP (optionnelle). */
  CONTACT_RATE_LIMIT?: EdgeKVNamespace;
}

/**
 * Contexte minimal d'une Cloudflare Pages Function.
 *
 * On définit localement la surface réellement utilisée (request + env) afin de
 * ne pas dépendre des types globaux `@cloudflare/workers-types`, absents du
 * projet.
 */
interface PagesFunctionContext {
  request: Request;
  env: ContactEnv;
}

/** Valeurs par défaut de la limitation de débit (Requirement 3.3). */
const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 60;

/** Construit une réponse JSON normalisée. */
function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/**
 * Tronque une adresse IP pour la journalisation (Error Handling : « IP
 * tronquée »). On masque le dernier segment IPv4 ou les derniers segments IPv6
 * afin de ne pas journaliser une IP complète.
 */
function truncateIp(ip: string): string {
  if (!ip || ip === "unknown") {
    return "unknown";
  }
  if (ip.includes(":")) {
    // IPv6 : conserver les deux premiers groupes.
    const groups = ip.split(":");
    return `${groups.slice(0, 2).join(":")}:…`;
  }
  // IPv4 : masquer le dernier octet.
  const octets = ip.split(".");
  if (octets.length === 4) {
    return `${octets.slice(0, 3).join(".")}.x`;
  }
  return "unknown";
}

/**
 * Lit la configuration de limitation de débit depuis l'environnement, avec des
 * valeurs par défaut sûres.
 */
function readRateLimitConfig(env: ContactEnv): RateLimitConfig {
  const parsedMax = Number(env.RATE_LIMIT_MAX);
  const parsedWindow = Number(env.RATE_LIMIT_WINDOW_SECONDS);

  return {
    enabled: env.RATE_LIMIT_ENABLED === "true",
    maxPerWindow: Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : DEFAULT_RATE_LIMIT_MAX,
    windowSeconds:
      Number.isFinite(parsedWindow) && parsedWindow > 0
        ? parsedWindow
        : DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
  };
}

/**
 * Point d'entrée de la Pages Function (toutes méthodes).
 *
 * On capte toutes les méthodes afin que `validateContactRequest` reste la
 * source unique du rejet 405 (méthode ≠ POST), conformément à l'orchestration
 * du design.
 */
export const onRequest = async (context: PagesFunctionContext): Promise<Response> => {
  const { request, env } = context;

  // 1. Validation de transport et de schéma → 405 / 415 / 400.
  const rawBody = await request.text();
  const validation = validateContactRequest({
    method: request.method,
    contentType: request.headers.get("content-type"),
    rawBody,
  });

  if (!validation.ok) {
    return jsonResponse(validation.status, { error: validation.message });
  }

  const fields = validation.value;

  // 2. Honeypot rempli → 200 silencieux, sans solliciter le Service_Email.
  if (isHoneypotTriggered(fields)) {
    return jsonResponse(200, { ok: true });
  }

  // 3. Résolution de configuration → 500 si une variable est absente.
  const configResult = resolveEmailConfig({
    CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
    RESEND_API_KEY: env.RESEND_API_KEY,
  });

  if (!configResult.ok) {
    // Message sûr : ne contient que les NOMS des variables manquantes.
    console.error(configResult.logMessage);
    return jsonResponse(configResult.status, {
      error: "Service indisponible. Veuillez réessayer plus tard.",
    });
  }

  const config = configResult.config;

  // 4. Limitation de débit par IP source → 429 au dépassement.
  //    Dégradation propre : si aucune liaison KV n'est disponible, la
  //    limitation est ignorée plutôt que de casser la soumission.
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const kv = env.CONTACT_RATE_LIMIT;
  const rateLimitConfig = readRateLimitConfig(env);

  if (rateLimitConfig.enabled && kv) {
    const store = new EdgeRateLimitStore(kv);
    const decision = await checkRateLimit(ip, rateLimitConfig, store);
    if (!decision.allowed) {
      return jsonResponse(429, {
        error: "Trop de demandes. Merci de réessayer dans un instant.",
      });
    }
  }

  // 5. Construction du Modele_Email (valeurs échappées) + envoi via Resend.
  //    Une soumission valide reçoit 200 MÊME si l'envoi échoue en aval
  //    (Requirement 1.10) ; l'échec est journalisé sans secret, IP tronquée.
  const html = buildEmailHtml(fields);

  try {
    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: config.fromAddress,
      to: [config.toAddress],
      subject: `Nouveau Contact : ${fields.company}`,
      html,
    });

    if (error) {
      console.error(`Échec d'envoi du Service_Email (soumission acceptée). IP=${truncateIp(ip)}`);
    }
  } catch {
    console.error(
      `Exception lors de l'envoi du Service_Email (soumission acceptée). IP=${truncateIp(ip)}`,
    );
  }

  return jsonResponse(200, { ok: true });
};

/** Alias POST explicite : la logique de méthode reste dans `validateContactRequest`. */
export const onRequestPost = onRequest;
