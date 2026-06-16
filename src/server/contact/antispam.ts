/**
 * Module anti-spam du périmètre « durcissement de l'API de contact ».
 *
 * Deux niveaux de protection, conformes au design (A4) :
 *  - Niveau 1 — Champ_Honeypot : `isHoneypotTriggered` détecte une soumission
 *    automatisée (champ masqué `website` rempli) à ignorer silencieusement
 *    (Requirement 3.2).
 *  - Niveau 2 — Limitation de débit par IP source : `checkRateLimit` accepte au
 *    plus `maxPerWindow` soumissions sur une fenêtre glissante et répond 429 au
 *    dépassement (Requirements 3.3, 3.4). La limitation est désactivable via
 *    `config.enabled` (clause « WHERE une limitation est activée »).
 *
 * Toute la logique de décision est pure et déterministe. Le comptage est
 * délégué à un `RateLimitStore` injectable : une implémentation en mémoire pour
 * les tests, et une implémentation compatible edge (Cloudflare KV / cache à
 * TTL) pour la production.
 *
 * Voir le design : .kiro/specs/site-hardening-amelioration/design.md
 * (section « 3. Module anti-spam »).
 */

import type { ContactFields, RateLimitConfig, RateLimitStore } from "./types";

/**
 * Indique si le Champ_Honeypot d'une soumission est rempli.
 *
 * Le champ `website` est masqué côté formulaire et doit rester vide. Un humain
 * ne le remplit jamais ; une valeur non vide (hors espaces) signale donc un
 * robot. Dans ce cas, l'API_Contact répond 200 sans solliciter le
 * Service_Email (Requirement 3.2).
 *
 * @returns `true` si la soumission doit être ignorée silencieusement.
 */
export function isHoneypotTriggered(fields: ContactFields): boolean {
  const honeypot = fields.website;
  return typeof honeypot === "string" && honeypot.trim().length > 0;
}

/**
 * Résultat de la décision de limitation de débit.
 *
 * `allowed` indique si la soumission est acceptée. En cas de refus, `status`
 * porte le code HTTP 429 attendu (Requirement 3.4).
 */
export interface RateLimitDecision {
  allowed: boolean;
  status?: 429;
}

/**
 * Décide d'accepter ou de rejeter une soumission selon la limitation de débit.
 *
 * Comportement :
 *  - Si la limitation est désactivée (`config.enabled === false`), la
 *    soumission est toujours acceptée sans interroger le magasin.
 *  - Sinon, le magasin enregistre la soumission de `ip` et retourne le nombre
 *    de hits comptés dans la fenêtre. La soumission est acceptée tant que ce
 *    nombre reste inférieur ou égal à `maxPerWindow`, et rejetée (429) au-delà.
 *
 * @param ip Adresse IP source de la soumission.
 * @param config Configuration de la limitation (activation, max, fenêtre).
 * @param store Magasin de comptage par IP sur fenêtre glissante.
 */
export async function checkRateLimit(
  ip: string,
  config: RateLimitConfig,
  store: RateLimitStore,
): Promise<RateLimitDecision> {
  if (!config.enabled) {
    return { allowed: true };
  }

  const hits = await store.hit(ip, config.windowSeconds);

  if (hits > config.maxPerWindow) {
    return { allowed: false, status: 429 };
  }

  return { allowed: true };
}

/**
 * Source de temps injectable, en millisecondes depuis l'époque Unix.
 *
 * Permet de rendre les implémentations de magasin déterministes et testables
 * en remplaçant `Date.now` par une horloge contrôlée.
 */
export type Clock = () => number;

/**
 * Implémentation en mémoire du `RateLimitStore`, déterministe et testable.
 *
 * Conserve, par IP, l'horodatage des soumissions et applique une véritable
 * fenêtre glissante : à chaque `hit`, les horodatages plus anciens que
 * `windowSeconds` sont purgés avant d'ajouter le nouveau, puis le nombre de
 * hits restants est retourné.
 *
 * Cette implémentation est destinée aux tests et aux environnements à processus
 * unique ; elle n'est pas partagée entre plusieurs instances edge.
 */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly hitsByIp = new Map<string, number[]>();
  private readonly now: Clock;

  /**
   * @param now Horloge injectable (par défaut `Date.now`) pour le déterminisme.
   */
  constructor(now: Clock = Date.now) {
    this.now = now;
  }

  async hit(ip: string, windowSeconds: number): Promise<number> {
    const current = this.now();
    const windowStart = current - windowSeconds * 1000;

    const timestamps = this.hitsByIp.get(ip) ?? [];
    const withinWindow = timestamps.filter((ts) => ts > windowStart);
    withinWindow.push(current);

    this.hitsByIp.set(ip, withinWindow);
    return withinWindow.length;
  }

  /** Réinitialise le magasin (utile entre deux scénarios de test). */
  reset(): void {
    this.hitsByIp.clear();
  }
}

/**
 * Magasin clé/valeur minimal compatible Cloudflare KV.
 *
 * Restreint à la surface réellement utilisée par `EdgeRateLimitStore`, ce qui
 * permet de brancher un `KVNamespace` Cloudflare, un cache à TTL ou toute
 * implémentation équivalente sans dépendance directe.
 */
export interface EdgeKVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

/**
 * Implémentation compatible edge du `RateLimitStore` (Cloudflare KV / cache à
 * TTL).
 *
 * Stocke par IP la liste des horodatages de soumissions sous forme de JSON,
 * avec une expiration (`expirationTtl`) égale à la fenêtre : le magasin se
 * nettoie ainsi de lui-même. À chaque `hit`, les horodatages hors fenêtre sont
 * purgés, le nouveau est ajouté, et l'ensemble est réécrit avec un TTL
 * rafraîchi.
 *
 * Note : KV étant à cohérence éventuelle, le comptage est approché en
 * conditions de concurrence forte ; c'est un compromis assumé pour une
 * protection anti-spam au niveau edge.
 */
export class EdgeRateLimitStore implements RateLimitStore {
  private readonly kv: EdgeKVNamespace;
  private readonly keyPrefix: string;
  private readonly now: Clock;

  /**
   * @param kv Espace clé/valeur compatible Cloudflare KV.
   * @param options Préfixe de clé et horloge injectable.
   */
  constructor(kv: EdgeKVNamespace, options: { keyPrefix?: string; now?: Clock } = {}) {
    this.kv = kv;
    this.keyPrefix = options.keyPrefix ?? "ratelimit:contact:";
    this.now = options.now ?? Date.now;
  }

  async hit(ip: string, windowSeconds: number): Promise<number> {
    const key = `${this.keyPrefix}${ip}`;
    const current = this.now();
    const windowStart = current - windowSeconds * 1000;

    const stored = await this.kv.get(key);
    const timestamps = parseTimestamps(stored);
    const withinWindow = timestamps.filter((ts) => ts > windowStart);
    withinWindow.push(current);

    await this.kv.put(key, JSON.stringify(withinWindow), {
      expirationTtl: windowSeconds,
    });

    return withinWindow.length;
  }
}

/**
 * Analyse une valeur stockée en JSON pour en extraire des horodatages valides.
 *
 * Toute valeur absente, illisible ou de forme inattendue est traitée comme une
 * absence d'historique (aucun hit), garantissant un comportement robuste.
 */
function parseTimestamps(stored: string | null): number[] {
  if (!stored) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((ts): ts is number => typeof ts === "number" && Number.isFinite(ts));
  } catch {
    return [];
  }
}
