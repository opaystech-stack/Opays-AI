/**
 * API_Contact — handler serverless Vercel.
 *
 * Couche de transport mince : lit la requête, délègue la logique aux modules
 * purs, puis traduit le résultat en réponse HTTP. Aucune règle métier, secret
 * ou adresse codée en dur.
 *
 * Orchestration :
 *   1. validateContactRequest   → 405 / 415 / 400
 *   2. isHoneypotTriggered      → 200 silencieux
 *   3. resolveEmailConfig       → 500 si configuration absente
 *   4. checkRateLimit           → 429 si dépassement (optionnel, en mémoire)
 *   5. buildEmailHtml + Resend  → 200 même en cas de défaillance aval
 *
 * Runtime : Vercel Serverless Function (Node.js). Les variables d'env sont
 * lues via process.env. L'IP source est lue depuis x-forwarded-for.
 * Le rate-limiter ne dépend plus de Cloudflare KV ; une implémentation en
 * mémoire est utilisée par défaut (pas de persistance cross-instance, mais
 * ne bloque pas l'envoi si aucun KV n'est branché).
 */

import { Resend } from "resend";

import { resolveEmailConfig } from "../src/server/contact/config";
import {
  checkRateLimit,
  InMemoryRateLimitStore,
  isHoneypotTriggered,
} from "../src/server/contact/antispam";
import { buildEmailHtml } from "../src/server/contact/escape";
import { validateContactRequest } from "../src/server/contact/validation";
import type { RateLimitConfig } from "../src/server/contact/types";

/** Variables d'environnement attendues, fournies par Vercel. */
const {
  CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL,
  RESEND_API_KEY,
  RATE_LIMIT_ENABLED,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} = process.env;

const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 60;

/** Réponse JSON normalisée compatible edge/Request Vercel. */
function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** Tronque une IP pour le log. */
function truncateIp(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) {
    const groups = ip.split(":");
    return `${groups.slice(0, 2).join(":")}:…`;
  }
  const octets = ip.split(".");
  if (octets.length === 4) return `${octets.slice(0, 3).join(".")}.x`;
  return "unknown";
}

/** Lit la config de rate limit avec des valeurs sûres. */
function readRateLimitConfig(): RateLimitConfig {
  const parsedMax = Number(RATE_LIMIT_MAX);
  const parsedWindow = Number(RATE_LIMIT_WINDOW_SECONDS);
  return {
    enabled: RATE_LIMIT_ENABLED === "true",
    maxPerWindow: Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : DEFAULT_RATE_LIMIT_MAX,
    windowSeconds:
      Number.isFinite(parsedWindow) && parsedWindow > 0
        ? parsedWindow
        : DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
  };
}

export default async function handler(request: Request): Promise<Response> {
  // 1. Validation transport
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

  // 2. Honeypot
  if (isHoneypotTriggered(fields)) {
    return jsonResponse(200, { ok: true });
  }

  // 3. Config email
  const configResult = resolveEmailConfig({
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL,
    RESEND_API_KEY,
  });
  if (!configResult.ok) {
    console.error(configResult.logMessage);
    return jsonResponse(configResult.status, {
      error: "Service indisponible. Veuillez réessayer plus tard.",
    });
  }
  const config = configResult.config;

  // 4. Rate limit (mémoire, optionnel)
  const forwarded = request.headers.get("x-forwarded-for") || "unknown";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const rateLimitConfig = readRateLimitConfig();
  if (rateLimitConfig.enabled) {
    const store = new InMemoryRateLimitStore();
    const decision = await checkRateLimit(ip, rateLimitConfig, store);
    if (!decision.allowed) {
      return jsonResponse(429, { error: "Trop de demandes. Merci de réessayer dans un instant." });
    }
  }

  // 5. Envoi via Resend
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
      console.error(`Échec d'envoi (soumission acceptée). IP=${truncateIp(ip)}`);
    }
  } catch {
    console.error(`Exception d'envoi (soumission acceptée). IP=${truncateIp(ip)}`);
  }

  return jsonResponse(200, { ok: true });
}

export const config = {
  // Runtime Node.js car Resend et la logique de contact nécessitent process.env
  // stable et les modules npm habituels.
  runtime: "nodejs",
};
