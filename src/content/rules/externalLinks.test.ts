/**
 * Test par propriété du noyau des liens vers les Chantier_Externe
 * (externalLinks.ts).
 *
 * Couvre :
 * - Property 32 « Absence de lien pour chantier non disponible » (Requirement 13.4)
 *
 * Harnais : Vitest 3 + fast-check, numRuns = 100.
 * L'oracle de référence réplique la règle de validité d'URL absolue
 * (http/https, après trim) appliquée par l'implémentation. Tant qu'aucun
 * Chantier_Externe n'est mis à disposition (URL absente ou invalide), aucun
 * lien ne doit être exposé.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import type { ExternalProject } from "../externalProjects";
import { resolveExternalLink } from "./externalLinks";

const NUM_RUNS = 100;

/** URL valide ssi renseignée et absolue http(s) (après trim) — même règle que le noyau. */
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

/** URL absente ou invalide : chantier non disponible (cas central de 13.4). */
const unavailableUrlArb: fc.Arbitrary<string | null> = fc.oneof(
  fc.constant(null),
  fc.constantFrom(
    "",
    "   ",
    "\t",
    "chantier-externe",
    "example.com",
    "/chemin/relatif",
    "ftp://fichier.example.com",
    "mailto:contact@opays.tech",
    "javascript:alert(1)",
  ),
  fc.string(),
);

/** URL valide et disponible (avec variantes entourées d'espaces). */
const availableUrlArb: fc.Arbitrary<string> = fc.oneof(
  fc.webUrl(),
  fc.webUrl().map((u) => `  ${u}  `),
);

/** Chantier_Externe paramétré par l'arbitraire de son URL. */
function projectArb(urlArb: fc.Arbitrary<string | null>): fc.Arbitrary<ExternalProject> {
  return fc.record({
    id: fc.constantFrom<ExternalProject["id"]>("audit-ia", "opays-commons"),
    label: fc
      .string({ minLength: 1, maxLength: 60 })
      .map((s) => (s.trim().length === 0 ? "Chantier externe" : s)),
    url: urlArb,
  });
}

describe("resolveExternalLink", () => {
  // Property 32: Absence de lien pour chantier non disponible
  // Validates: Requirements 13.4
  it("Property 32: ne rend aucun lien lorsque l'URL est absente ou invalide, et rend un lien externe ssi l'URL est absolue valide", () => {
    fc.assert(
      fc.property(projectArb(fc.oneof(unavailableUrlArb, availableUrlArb)), (project) => {
        const resolved = resolveExternalLink(project);

        if (isValidAbsoluteUrl(project.url)) {
          // Chantier disponible => lien externe portant l'URL normalisée.
          expect(resolved.visible).toBe(true);
          if (resolved.visible) {
            expect(resolved.url).toBe(project.url.trim());
            expect(resolved.label).toBe(project.label);
            expect(resolved.external).toBe(true);
          }
        } else {
          // Chantier non disponible => aucun lien rendu (13.4).
          expect(resolved).toEqual({ visible: false });
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Renforcement ciblé de 13.4 : un chantier explicitement indisponible
  // (URL absente/invalide) n'expose jamais de lien.
  it("Property 32 (ciblé): aucun lien n'est exposé pour un chantier non disponible", () => {
    fc.assert(
      fc.property(projectArb(unavailableUrlArb), (project) => {
        expect(resolveExternalLink(project)).toEqual({ visible: false });
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
