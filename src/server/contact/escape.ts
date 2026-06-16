/**
 * Échappement HTML et construction du gabarit d'e-mail (Modele_Email).
 *
 * Logique pure, sans I/O ni dépendance externe. Source de vérité de
 * l'Exigence 2 : aucune valeur soumise n'est insérée brute dans le
 * Modele_Email ; chaque valeur est échappée avant insertion afin de
 * neutraliser toute injection HTML ou script (2.1, 2.3) tout en conservant
 * un texte lisible et fidèle à l'original (2.2).
 *
 * Voir le design : .kiro/specs/site-hardening-amelioration/design.md
 * (section « Components and Interfaces » §2).
 */

import type { ContactFields } from "./types";

/**
 * Table d'échappement des caractères HTML spéciaux.
 *
 * L'esperluette (`&`) est volontairement la première entrée : en remplaçant
 * chaque caractère en une seule passe via une expression régulière, on évite
 * tout double-échappement destructeur (une entité déjà produite, par ex.
 * `&lt;`, n'est jamais ré-échappée car le balayage est unique).
 */
const ESCAPE_MAP: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Table inverse, dérivée de `ESCAPE_MAP`, pour le déséchappement. */
const UNESCAPE_MAP: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(ESCAPE_MAP).map(([char, entity]) => [entity, char]),
);

const ESCAPE_PATTERN = /[&<>"']/g;
const UNESCAPE_PATTERN = /&(?:amp|lt|gt|quot|#39);/g;

/**
 * Échappe les caractères HTML spéciaux (`&`, `<`, `>`, `"`, `'`) d'une chaîne.
 *
 * Le remplacement s'effectue en une seule passe : chaque caractère source est
 * substitué exactement une fois, ce qui empêche le double-échappement
 * destructeur du texte lisible.
 *
 * @param value chaîne d'origine soumise par le Visiteur
 * @returns chaîne sûre à insérer dans un contexte HTML
 */
export function escapeHtml(value: string): string {
  return value.replace(ESCAPE_PATTERN, (char) => ESCAPE_MAP[char]);
}

/**
 * Restitue la chaîne d'origine à partir d'une chaîne échappée par
 * {@link escapeHtml}.
 *
 * Garantit la propriété de round-trip `unescapeHtml(escapeHtml(x)) === x` :
 * le balayage unique reconvertit chaque entité connue en son caractère, sans
 * réinterpréter le résultat.
 *
 * @param value chaîne produite par {@link escapeHtml}
 * @returns chaîne d'origine restaurée
 */
export function unescapeHtml(value: string): string {
  return value.replace(UNESCAPE_PATTERN, (entity) => UNESCAPE_MAP[entity]);
}

/**
 * Construit le Modele_Email (gabarit HTML) à partir des champs soumis.
 *
 * Chaque valeur insérée est systématiquement échappée via {@link escapeHtml}.
 * Le champ honeypot (`website`) n'est jamais rendu : il ne sert qu'à la
 * détection anti-spam côté serveur.
 *
 * @param fields champs validés du Formulaire_Contact
 * @returns fragment HTML prêt à être transmis au Service_Email
 */
export function buildEmailHtml(fields: ContactFields): string {
  const company = escapeHtml(fields.company);
  const role = escapeHtml(fields.role);
  const process = escapeHtml(fields.process);
  const contact = escapeHtml(fields.contact);

  return `
        <h2>Nouvelle demande de consultance</h2>
        <p><strong>Entreprise :</strong> ${company}</p>
        <p><strong>Rôle :</strong> ${role}</p>
        <p><strong>Processus à optimiser :</strong> ${process}</p>
        <p><strong>Contact (Email/Tel) :</strong> ${contact}</p>
      `;
}
