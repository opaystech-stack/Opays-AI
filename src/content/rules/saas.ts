/**
 * Noyau de logique pure — produits SaaS (Page_SaaS).
 *
 * Fonctions sans I/O appliquant les règles d'affichage des Produit_SaaS :
 * sélection des produits valides et résolution de l'action proposée par
 * produit (lien d'accès ou repli sur le CTA_Diagnostic).
 *
 * Couvre : Requirements 8.1, 8.2, 8.4, 8.6.
 */

import type { SaasProduct } from "../saas";

/** Longueur minimale du nom d'un produit (inclus). */
export const NAME_MIN = 1;
/** Longueur maximale du nom d'un produit (inclus). */
export const NAME_MAX = 60;
/** Longueur minimale du descriptif d'un produit (inclus). */
export const DESC_MIN = 40;
/** Longueur maximale du descriptif d'un produit (inclus). */
export const DESC_MAX = 300;
/** Nombre minimal de produits affichables sur la page. */
export const PRODUCTS_MIN = 2;
/** Nombre maximal de produits affichables sur la page. */
export const PRODUCTS_MAX = 12;

/** Action résolue pour un produit : lien d'accès ou repli sur le CTA_Diagnostic. */
export type ProductAction = { kind: "access"; url: string } | { kind: "cta" };

/**
 * Vrai ssi le nom respecte la contrainte de longueur (1 à 60 caractères).
 */
function hasValidName(name: string): boolean {
  const length = name.trim().length;
  return length >= NAME_MIN && length <= NAME_MAX;
}

/**
 * Vrai ssi le descriptif respecte la contrainte de longueur (40 à 300 caractères).
 */
function hasValidDescription(description: string): boolean {
  const length = description.trim().length;
  return length >= DESC_MIN && length <= DESC_MAX;
}

/**
 * Vrai ssi l'URL d'accès est renseignée et constitue une URL absolue valide
 * (protocole http ou https). Une URL absente, vide ou non analysable est
 * considérée comme invalide.
 */
function hasValidAccessUrl(accessUrl: string | null): accessUrl is string {
  if (accessUrl === null) {
    return false;
  }
  const trimmed = accessUrl.trim();
  if (trimmed.length === 0) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Conserve les produits dont le nom (1 à 60 caractères) et la description
 * (40 à 300 caractères) respectent les bornes, en préservant l'ordre d'entrée,
 * puis plafonne le résultat à 12 produits.
 *
 * Requirements : 8.1 (max 12 produits), 8.2 (longueurs nom/description).
 */
export function selectRenderableProducts(products: SaasProduct[]): SaasProduct[] {
  return products
    .filter((product) => hasValidName(product.name) && hasValidDescription(product.description))
    .slice(0, PRODUCTS_MAX);
}

/**
 * Détermine l'action d'un produit : un lien d'accès si l'URL d'accès est
 * renseignée et valide, sinon un repli sur le CTA_Diagnostic. Garantit qu'au
 * moins une action est toujours disponible par produit.
 *
 * Requirements : 8.4 (au moins un élément d'action), 8.6 (repli CTA si lien
 * indisponible ou non renseigné).
 */
export function resolveProductAction(product: SaasProduct): ProductAction {
  if (hasValidAccessUrl(product.accessUrl)) {
    return { kind: "access", url: product.accessUrl.trim() };
  }
  return { kind: "cta" };
}
