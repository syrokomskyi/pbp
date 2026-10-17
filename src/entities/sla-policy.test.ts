/*
<MODULE_CONTRACT>
<purpose>
Unit tests for sla policy covering isPbpSlaOperator. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the sla suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpSlaOperator, PBP_SLA_OPERATORS } from "./sla-policy.ts";

describe("isPbpSlaOperator", () => {
  it("accepts all valid operators", () => {
    for (const op of PBP_SLA_OPERATORS) {
      expect(isPbpSlaOperator(op)).toBe(true);
    }
  });

  it("rejects invalid operator", () => {
    expect(isPbpSlaOperator("invalid")).toBe(false);
  });
});
