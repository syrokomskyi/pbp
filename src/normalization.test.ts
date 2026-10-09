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
