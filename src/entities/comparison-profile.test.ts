/*
<MODULE_CONTRACT>
<purpose>
Unit tests for comparison profile covering COMPARISON_PROFILE_SCHEMA_ID; isPbpComparisonValueType. It also guards the documented public contract and regression-sensitive edge cases.
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
import {
  COMPARISON_PROFILE_SCHEMA_ID,
  isPbpComparisonValueType,
  PBP_COMPARISON_VALUE_TYPES,
} from "./comparison-profile.ts";

describe("COMPARISON_PROFILE_SCHEMA_ID", () => {
  it("equals pbp/comparison-profile@1", () => {
    expect(COMPARISON_PROFILE_SCHEMA_ID).toBe("pbp/comparison-profile@1");
  });
});

describe("isPbpComparisonValueType", () => {
  it("accepts all valid value types", () => {
    for (const vt of PBP_COMPARISON_VALUE_TYPES) {
      expect(isPbpComparisonValueType(vt)).toBe(true);
    }
  });

  it("rejects invalid value type", () => {
    expect(isPbpComparisonValueType("invalid")).toBe(false);
  });
});
