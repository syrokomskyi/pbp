import { describe, it, expect } from "vitest";
import {
  COMPARISON_PROFILE_SCHEMA_ID,
  isPbpComparisonValueType,
  PBP_COMPARISON_VALUE_TYPES,
} from "./comparison-profile.js";

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
