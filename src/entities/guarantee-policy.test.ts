/*
<MODULE_CONTRACT>
<purpose>
Unit tests for guarantee policy covering isPbpGuaranteeOperator; isPbpGuaranteeRemedyType. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the guarantee suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  isPbpGuaranteeOperator,
  isPbpGuaranteeRemedyType,
  PBP_GUARANTEE_OPERATORS,
  PBP_GUARANTEE_REMEDY_TYPES,
} from "./guarantee-policy.ts";

describe("isPbpGuaranteeOperator", () => {
  it("accepts all valid operators", () => {
    for (const op of PBP_GUARANTEE_OPERATORS) {
      expect(isPbpGuaranteeOperator(op)).toBe(true);
    }
  });

  it("rejects invalid operator", () => {
    expect(isPbpGuaranteeOperator("invalid")).toBe(false);
  });
});

describe("isPbpGuaranteeRemedyType", () => {
  it("accepts all valid remedy types", () => {
    for (const rt of PBP_GUARANTEE_REMEDY_TYPES) {
      expect(isPbpGuaranteeRemedyType(rt)).toBe(true);
    }
  });

  it("rejects invalid remedy type", () => {
    expect(isPbpGuaranteeRemedyType("invalid")).toBe(false);
  });
});
