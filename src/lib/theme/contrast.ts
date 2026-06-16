/**
 * Calcul du ratio de contraste selon la formule WCAG 2.1.
 *
 * Helper de logique pure, sans dépendance au DOM ni au réseau. Sert à garantir
 * que le texte principal du message clé reste lisible (ratio >= 4,5:1) même en
 * présence des effets visuels (glass, néon), conformément à l'Exigence 11.3.
 *
 * Couvre : Requirements 11.3 (Property 21 : Contraste lisible du texte principal).
 *
 * Références : https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

/** Composantes rouge/vert/bleu d'une couleur, chacune dans l'intervalle 0..255. */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Seuil de contraste WCAG AA pour le texte normal. */
export const WCAG_AA_NORMAL = 4.5;

/** Seuil de contraste WCAG AA pour le grand texte (>= 18pt ou 14pt gras). */
export const WCAG_AA_LARGE = 3;

/**
 * Convertit une couleur hexadécimale (#rgb, #rrggbb, avec ou sans #) en {@link Rgb}.
 * Renvoie `null` si la chaîne n'est pas un code hexadécimal valide.
 */
export function parseHexColor(hex: string): Rgb | null {
  const cleaned = hex.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }

  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b };
  }

  return null;
}

/**
 * Convertit une chaîne `rgb(...)` ou `rgba(...)` en {@link Rgb}.
 * Renvoie `null` si la chaîne n'est pas reconnue.
 */
export function parseRgbColor(value: string): Rgb | null {
  const match = value
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)$/i);

  if (!match) return null;

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);

  if (r > 255 || g > 255 || b > 255) return null;

  return { r, g, b };
}

/**
 * Convertit une couleur exprimée en chaîne (hex ou rgb/rgba) en {@link Rgb}.
 * Renvoie `null` si le format n'est pas reconnu.
 */
export function parseColor(value: string): Rgb | null {
  return parseHexColor(value) ?? parseRgbColor(value);
}

/**
 * Linéarise une composante sRGB (0..255) pour le calcul de luminance.
 */
function linearizeChannel(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calcule la luminance relative d'une couleur selon WCAG (0 = noir, 1 = blanc).
 */
export function relativeLuminance(color: Rgb): number {
  const r = linearizeChannel(color.r);
  const g = linearizeChannel(color.g);
  const b = linearizeChannel(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calcule le ratio de contraste WCAG entre deux couleurs.
 * Le résultat est compris entre 1:1 (identiques) et 21:1 (noir vs blanc).
 *
 * Accepte des couleurs sous forme {@link Rgb} ou de chaîne (hex, rgb, rgba).
 * Renvoie `null` si l'une des couleurs ne peut pas être interprétée.
 */
export function contrastRatio(
  foreground: Rgb | string,
  background: Rgb | string,
): number | null {
  const fg = typeof foreground === "string" ? parseColor(foreground) : foreground;
  const bg = typeof background === "string" ? parseColor(background) : background;

  if (!fg || !bg) return null;

  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Indique si la paire (texte, arrière-plan) atteint le seuil de contraste demandé.
 * Le seuil par défaut est WCAG AA pour le texte normal (4,5:1).
 *
 * Renvoie `false` si l'une des couleurs est invalide (prudence : on considère
 * alors le contraste comme non garanti).
 */
export function meetsContrast(
  foreground: Rgb | string,
  background: Rgb | string,
  threshold: number = WCAG_AA_NORMAL,
): boolean {
  const ratio = contrastRatio(foreground, background);
  return ratio !== null && ratio >= threshold;
}
