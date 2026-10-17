/*
<MODULE_CONTRACT>
<purpose>
Unit tests for normalization covering isPbpNormalizationDecision. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the normalization suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpNormalizationDecision, PBP_NORMALIZATION_DECISIONS } from "./normalization.ts";

describe("isPbpNormalizationDecision", () => {
  it("accepts all valid decisions", () => {
    for (const decision of PBP_NORMALIZATION_DECISIONS) {
      expect(isPbpNormalizationDecision(decision)).toBe(true);
    }
  });

  it("rejects invalid decision", () => {
    expect(isPbpNormalizationDecision("invalid")).toBe(false);
  });
});
