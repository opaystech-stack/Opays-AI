/**
 * Filtre de jargon éditorial.
 *
 * Helper de logique pure : détecte la présence de termes de jargon interdits
 * par la charte éditoriale Opays (docs/marketing/GUIDE_DE_TON_ET_MARKETING.md
 * « Mots bannis » et 02_brand/tone.md « Formulations à éviter ») dans un
 * contenu publié.
 *
 * Couvre : Requirements 11.5 (Property 23 : Absence de jargon interdit).
 */

/**
 * Liste de mots et expressions interdits issue de la charte éditoriale.
 *
 * Source : « Mots bannis » du guide de ton marketing et « Formulations à
 * éviter » du ton de marque. La comparaison est insensible à la casse et aux
 * accents (voir {@link findForbiddenTerms}).
 */
export const FORBIDDEN_TERMS: readonly string[] = [
  // Guide de ton marketing — Mots bannis
  "révolutionner",
  "révolutionnaire",
  "dans un monde en constante évolution",
  "incontournable",
  "synergie",
  "paradigme",
  "cutting-edge",
  "state-of-the-art",
  "leverager",
  "disruptif",
  "disruption",
  "solution clé en main",
  "au cœur de",
  "booster",
  // Ton de marque — Formulations à éviter
  "game changer",
  "solution magique",
  "ia de pointe",
];

/**
 * Normalise une chaîne pour la comparaison : minuscules, accents retirés,
 * espaces multiples réduits. Permet une détection robuste indépendante de la
 * casse et des diacritiques.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Échappe les caractères spéciaux d'une chaîne destinée à une expression
 * régulière.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Renvoie la liste des termes interdits présents dans le contenu fourni.
 *
 * La détection est insensible à la casse et aux accents. Les termes d'un seul
 * mot sont recherchés sur des frontières de mot afin d'éviter les faux positifs
 * (par exemple « synergie » ne déclenche pas sur un sous-mot accidentel). Les
 * expressions de plusieurs mots sont recherchées telles quelles.
 *
 * @param content Texte publié à analyser.
 * @param terms Liste de termes interdits (par défaut {@link FORBIDDEN_TERMS}).
 * @returns Les termes interdits détectés, dans leur forme normalisée, sans doublon.
 */
export function findForbiddenTerms(
  content: string,
  terms: readonly string[] = FORBIDDEN_TERMS,
): string[] {
  const haystack = normalize(content);
  const found = new Set<string>();

  for (const term of terms) {
    const needle = normalize(term);
    if (needle.length === 0) continue;

    const pattern = /\s/.test(needle)
      ? escapeRegExp(needle)
      : `\\b${escapeRegExp(needle)}\\b`;

    if (new RegExp(pattern, "u").test(haystack)) {
      found.add(needle);
    }
  }

  return [...found];
}

/**
 * Indique si un contenu est exempt de tout terme de jargon interdit.
 */
export function isJargonFree(
  content: string,
  terms: readonly string[] = FORBIDDEN_TERMS,
): boolean {
  return findForbiddenTerms(content, terms).length === 0;
}
