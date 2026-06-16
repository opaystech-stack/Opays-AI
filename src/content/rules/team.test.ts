/**
 * Tests de propriété pour le noyau de règles de la Section_Equipe.
 *
 * Harness : Vitest 3 (globals) + fast-check (numRuns: 100).
 *
 * Property 16 — Fiches d'équipe complètes :
 *   Pour toute liste de membres fondateurs, `selectRenderableMembers` conserve
 *   exactement les fiches disposant d'un nom non vide ET d'au moins un rôle non
 *   vide, et omet toute fiche incomplète, sans produire de champ vide.
 *
 * Validates: Requirements 7.1, 7.6
 */

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { TeamMember } from "../team";
import { selectRenderableMembers } from "./team";

const NUM_RUNS = 100;

/** Une fiche est rendable ssi nom non vide ET au moins un rôle non vide (après trim). */
function isRenderable(member: TeamMember): boolean {
  return (
    member.fullName.trim().length > 0 &&
    member.roles.some((role) => role.trim().length > 0)
  );
}

/**
 * Générateur de chaînes couvrant intelligemment l'espace d'entrée :
 * chaînes vides, chaînes purement blanches et chaînes non vides.
 */
const stringArb = fc.oneof(
  fc.constant(""),
  fc.stringMatching(/^[ \t\n]+$/), // blancs uniquement
  fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0), // non vide après trim
);

const memberArb: fc.Arbitrary<TeamMember> = fc.record({
  fullName: stringArb,
  roles: fc.array(stringArb, { maxLength: 5 }),
});

const membersArb = fc.array(memberArb, { maxLength: 12 });

describe("selectRenderableMembers (Property 16: Fiches d'équipe complètes)", () => {
  it("conserve exactement les fiches complètes et omet les fiches incomplètes", () => {
    fc.assert(
      fc.property(membersArb, (members) => {
        const result = selectRenderableMembers(members);
        const expected = members.filter(isRenderable);

        // Conserve exactement les fiches rendables, dans l'ordre, sans altération.
        expect(result).toEqual(expected);

        // Aucune fiche rendue ne comporte de champ vide (nom ou rôle manquant).
        for (const member of result) {
          expect(member.fullName.trim().length).toBeGreaterThan(0);
          expect(member.roles.some((r) => r.trim().length > 0)).toBe(true);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("omet toute fiche sans nom OU sans rôle non vide", () => {
    fc.assert(
      fc.property(membersArb, (members) => {
        const result = selectRenderableMembers(members);
        for (const member of members) {
          if (!isRenderable(member)) {
            expect(result).not.toContain(member);
          }
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
