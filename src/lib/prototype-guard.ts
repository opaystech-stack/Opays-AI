/**
 * Garde d'accès des Pages_Prototype internes (`/tenant-0`, `/bridges-os`).
 *
 * Le Site_Public ne dispose pas (encore) d'un mécanisme d'authentification.
 * En l'absence d'auth, l'accès aux prototypes est gouverné par un flag de
 * build explicite, avec **refus par défaut en production** (Requirements 10.5,
 * 10.6).
 *
 * Stratégie de défense en profondeur :
 * 1. Contrôle principal — `assertPrototypeAccess()` est appelé dans le
 *    `beforeLoad` de chaque route prototype : un accès non autorisé est
 *    redirigé vers la page publique d'accueil avant tout chargement
 *    (Requirement 10.5).
 * 2. Repli (fallback) — `isPrototypeAccessAllowed()` est ré-évalué au rendu du
 *    composant. Si le contrôle principal a été contourné (bypass de
 *    `beforeLoad`, hydratation partielle, erreur de routage), le composant
 *    n'affiche jamais le contenu sensible : il rend un écran neutre, marqué
 *    `noindex` (Requirement 10.6).
 *
 * Activation : définir la variable d'environnement de build
 * `VITE_ENABLE_PROTOTYPES=true` (documentée). Sans ce flag :
 * - en production (`import.meta.env.PROD`), l'accès est **refusé** ;
 * - en développement, l'accès reste autorisé pour faciliter le travail local.
 */

import { redirect } from "@tanstack/react-router";

/** Valeurs reconnues comme « activé » pour le flag d'autorisation. */
const TRUTHY = new Set(["true", "1", "yes", "on"]);

/**
 * Indique si l'accès aux Pages_Prototype est autorisé dans le contexte courant.
 *
 * - Autorisé si `VITE_ENABLE_PROTOTYPES` est explicitement activé.
 * - Sinon, autorisé uniquement hors production (développement local).
 * - Refusé par défaut en production.
 */
export function isPrototypeAccessAllowed(): boolean {
  const flag = import.meta.env.VITE_ENABLE_PROTOTYPES;
  if (typeof flag === "string" && TRUTHY.has(flag.trim().toLowerCase())) {
    return true;
  }
  // Refus par défaut en production ; toléré en développement.
  return import.meta.env.PROD !== true;
}

/**
 * Contrôle principal de la garde : à appeler dans le `beforeLoad` d'une route
 * prototype. Redirige vers la page publique d'accueil si l'accès n'est pas
 * autorisé (Requirement 10.5).
 */
export function assertPrototypeAccess(): void {
  if (!isPrototypeAccessAllowed()) {
    throw redirect({ to: "/" });
  }
}
