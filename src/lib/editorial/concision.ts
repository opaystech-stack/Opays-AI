/**
 * Analyse de concision éditoriale.
 *
 * Helper de logique pure : mesure la longueur moyenne des phrases d'un bloc de
 * texte (en mots) afin de garantir un style direct, à phrases courtes,
 * conformément à l'Exigence 11.4 (« phrases d'au plus 25 mots en moyenne par
 * bloc de texte »).
 *
 * Couvre : Requirements 11.4 (Property 22 : Concision éditoriale).
 */

/** Nombre maximal de mots par phrase, en moyenne, pour un bloc conforme. */
export const MAX_AVERAGE_SENTENCE_LENGTH = 25;

/**
 * Découpe un bloc de texte en phrases.
 *
 * Une phrase est délimitée par une ponctuation finale (. ! ? …), par un point
 * de suspension ou par un saut de ligne. Les segments vides (espaces seuls)
 * sont ignorés.
 */
export function splitIntoSentences(block: string): string[] {
  return block
    .split(/[.!?…]+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * Compte les mots d'un fragment de texte. Un mot est une suite de caractères
 * séparée par des espaces. La ponctuation isolée n'est pas comptée comme un mot.
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/**
 * Calcule la longueur moyenne des phrases d'un bloc (nombre de mots / nombre de
 * phrases). Renvoie 0 pour un bloc vide ou sans phrase exploitable.
 */
export function averageSentenceLength(block: string): number {
  const sentences = splitIntoSentences(block);
  if (sentences.length === 0) return 0;

  const totalWords = sentences.reduce(
    (sum, sentence) => sum + countWords(sentence),
    0,
  );

  return totalWords / sentences.length;
}

/**
 * Indique si un bloc respecte la contrainte de concision : longueur moyenne des
 * phrases inférieure ou égale au seuil (25 mots par défaut).
 */
export function isConcise(
  block: string,
  maxAverage: number = MAX_AVERAGE_SENTENCE_LENGTH,
): boolean {
  return averageSentenceLength(block) <= maxAverage;
}
