/**
 * @vitest-environment jsdom
 *
 * Test par propriété du rendu sécurisé des liens vers les Chantier_Externe
 * (`ExternalLink.tsx`).
 *
 * Couvre :
 * - Property 31 « Rendu sécurisé des liens externes » (Requirement 13.3)
 *
 * Harnais : Vitest 3 (globals) + fast-check, numRuns = 100, environnement
 * jsdom, @testing-library/react.
 *
 * Énoncé : pour tout Chantier_Externe rendu via `ExternalLink`, lorsque l'URL
 * est renseignée et absolue valide (http/https), le lien s'ouvre dans un nouvel
 * onglet (`target="_blank"`), porte `rel` contenant à la fois « noopener » et
 * « noreferrer », et signale visuellement son caractère externe (icône dédiée +
 * libellé accessible). Lorsque l'URL est absente ou invalide, aucun lien n'est
 * rendu (sortie vide).
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import type { ExternalProject, ExternalProjectId } from "@/content/externalProjects";
import { ExternalLink } from "./ExternalLink";

const NUM_RUNS = 100;

/**
 * Oracle indépendant : reproduit la règle de validité d'URL de la spec
 * (URL absolue renseignée, protocole http ou https) afin de décider, côté
 * test, si un lien doit être rendu — sans dépendre de l'implémentation.
 */
function isValidAbsoluteUrl(url: string | null): url is string {
  if (url === null) return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const idArb: fc.Arbitrary<ExternalProjectId> = fc.constantFrom(
  "audit-ia",
  "opays-commons",
);

const labelArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 60 })
  .map((s) => (s.trim().length === 0 ? "Chantier externe" : s));

/** URL absolue valide (http/https). */
const validUrlArb: fc.Arbitrary<string> = fc.webUrl();

/** URL invalide : null, vide, relative, ou protocole non http(s). */
const invalidUrlArb: fc.Arbitrary<string | null> = fc.oneof(
  fc.constant(null),
  fc.constantFrom(
    "",
    " ",
    "   ",
    "\t",
    "\n  ",
    "relative/path",
    "/chemin/absolu",
    "pas une url",
    "example.com",
    "ftp://example.com/fichier",
    "mailto:contact@opays.tech",
    "javascript:alert(1)",
    "tel:+33123456789",
  ),
  fc.string({ maxLength: 24 }).filter((s) => !isValidAbsoluteUrl(s)),
);

function projectArb(
  urlArb: fc.Arbitrary<string | null>,
): fc.Arbitrary<ExternalProject> {
  return fc.record({
    id: idArb,
    label: labelArb,
    url: urlArb,
  });
}

describe("ExternalLink", () => {
  // Property 31: Rendu sécurisé des liens externes — Validates: Requirements 13.3
  it("Property 31: une URL valide produit un lien nouvel onglet sécurisé et signalé ; une URL invalide ne produit aucun rendu", () => {
    fc.assert(
      fc.property(
        fc.oneof(projectArb(validUrlArb), projectArb(invalidUrlArb)),
        (project) => {
          const { container, unmount } = render(
            <ExternalLink project={project} />,
          );

          try {
            const anchor = container.querySelector("a");

            if (isValidAbsoluteUrl(project.url)) {
              // Lien visible : ancre présente.
              expect(anchor).not.toBeNull();

              // Ouverture dans un nouvel onglet.
              expect(anchor!.getAttribute("target")).toBe("_blank");

              // Sécurisation de l'ouverture (noopener + noreferrer).
              const rel = anchor!.getAttribute("rel") ?? "";
              expect(rel).toContain("noopener");
              expect(rel).toContain("noreferrer");

              // href pointe sur l'URL résolue.
              expect(anchor!.getAttribute("href")).toBe(project.url!.trim());

              // Signalement visuel d'un lien externe : icône dédiée (svg
              // décoratif) + libellé accessible explicite.
              const icon = anchor!.querySelector("svg");
              expect(icon).not.toBeNull();
              expect(icon!.getAttribute("aria-hidden")).toBe("true");

              const srOnly = anchor!.querySelector(".sr-only");
              expect(srOnly).not.toBeNull();
              expect(srOnly!.textContent ?? "").toMatch(/lien externe/i);
            } else {
              // URL absente ou invalide : aucun lien n'est rendu.
              expect(anchor).toBeNull();
              expect(container).toBeEmptyDOMElement();
            }
          } finally {
            unmount();
            cleanup();
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
