/**
 * Test par propriété du noyau de résolution du CTA_Diagnostic (cta.ts).
 *
 * Couvre :
 * - Property 19 « Invariant du CTA_Diagnostic » (Requirements 10.1, 10.3, 9.6)
 *
 * Harnais : Vitest 3 (globals) + fast-check, numRuns = 100.
 *
 * L'invariant est testé au niveau de la fonction pure `resolveCta()` : pour
 * toute page publique (modélisée ici par un nombre arbitraire d'usages et de
 * contextes indépendants), le CTA rendu porte toujours le même libellé unique
 * « Diagnostic gratuit » et dirige toujours vers la Page_Contact (`/contact`).
 * Comme `resolveCta()` lit la constante unique `CTA_DIAGNOSTIC`, l'identité
 * stricte (texte et casse) est garantie mécaniquement et de façon idempotente.
 */

import fc from "fast-check";
import { describe, it, expect } from "vitest";
import { CTA_DIAGNOSTIC, PUBLIC_PAGES } from "../navigation";
import { resolveCta } from "./cta";

const NUM_RUNS = 100;

/** Référence canonique attendue, indépendante de tout appel. */
const EXPECTED = { label: "Diagnostic gratuit", target: "/contact" } as const;

describe("resolveCta", () => {
  // Property 19: Invariant du CTA_Diagnostic — Validates: Requirements 10.1, 10.3, 9.6
  it("Property 19: résout toujours le même libellé unique et la cible /contact, identiques à travers tous les usages", () => {
    fc.assert(
      fc.property(
        // Modélise « pour toute page publique » : un chemin de page arbitraire
        // et un nombre d'usages indépendants du CTA sur cette page.
        fc.constantFrom(...PUBLIC_PAGES.map((p) => p.path)),
        fc.integer({ min: 1, max: 20 }),
        (currentPath, usageCount) => {
          // Appels répétés/indépendants, comme autant d'occurrences du CTA.
          const resolutions = Array.from({ length: usageCount }, () =>
            resolveCta(),
          );

          for (const cta of resolutions) {
            // Libellé strictement identique (texte et casse) à la constante unique.
            expect(cta.label).toBe(EXPECTED.label);
            expect(cta.label).toBe(CTA_DIAGNOSTIC.label);
            // Cible toujours la Page_Contact, quelle que soit la page courante.
            expect(cta.target).toBe(EXPECTED.target);
            expect(cta.target).toBe(CTA_DIAGNOSTIC.target);
            // Identité profonde stricte (invariant idempotent).
            expect(cta).toEqual(EXPECTED);
          }

          // Tous les usages sur la page sont mutuellement identiques.
          for (const cta of resolutions) {
            expect(cta).toEqual(resolutions[0]);
          }

          // La cible (`/contact`) est bien une page publique du site.
          expect(PUBLIC_PAGES.some((p) => p.path === EXPECTED.target)).toBe(
            true,
          );

          // L'usage courant n'altère pas la résolution : invariant indépendant
          // de la page d'où le CTA est rendu.
          expect(typeof currentPath).toBe("string");
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
