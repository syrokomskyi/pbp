/*
<MODULE_CONTRACT>
<purpose>
Unit tests for comparison covering isPbpComparisonStatus. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the comparison suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpComparisonStatus, PBP_COMPARISON_STATUSES } from "./comparison.ts";

describe("isPbpComparisonStatus", () => {
  it("accepts all valid statuses", () => {
    for (const status of PBP_COMPARISON_STATUSES) {
      expect(isPbpComparisonStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpComparisonStatus("invalid")).toBe(false);
  });
});
