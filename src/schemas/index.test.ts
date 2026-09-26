/*
<MODULE_CONTRACT>
<purpose>Asserts the schemas/ barrel exports infrastructure only — primitives, envelope, entity-ref — after the RFC-1102 relocation of entity contracts to ../entities/.</purpose>
<non-goals>
  <item>Does not test entity schemas — those live in entities/__tests__/.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: rewritten — asserts infra-only export surface (AC-2).</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import * as schemasBarrel from "./index.js";

const EXPECTED_INFRA_EXPORTS = [
  // primitives
  "pbpLocalizedStringSchema",
  "pbpMoneySchema",
  "pbpMoneyRangeSchema",
  "pbpIsoDurationSchema",
  "pbpQuantitativeDurationSchema",
  "pbpTimestampSchema",
  "pbpQuantitativeValueSchema",
  "pbpExternalIdentifierSchema",
  "pbpControlledValueSchema",
  "nonEmptyString",
  "noHtmlString",
  "decimalString",
  // envelope
  "pbpEntityStatusSchema",
  "pbpGovernanceSchema",
  "pbpEntitySchema",
  "entityIdSchema",
  "schemaIdSchema",
  // entity-ref
  "pbpEntityRefSchema",
] as const;

describe("schemas/index.ts barrel (RFC-1102)", () => {
  it("exports exactly the infrastructure surface", () => {
    expect(Object.keys(schemasBarrel).sort()).toEqual([...EXPECTED_INFRA_EXPORTS].sort());
  });

  it("does not export entity aggregates (moved to entities/index.ts)", () => {
    expect("pbpSchemaById" in schemasBarrel).toBe(false);
    expect("pbpEntityDiscriminatedUnion" in schemasBarrel).toBe(false);
  });
});
