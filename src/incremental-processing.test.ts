import { describe, it, expect } from "vitest";
import {
  isPbpDependencyInvalidationRule,
  PBP_DEPENDENCY_INVALIDATION_RULES,
} from "./incremental-processing.ts";

describe("isPbpDependencyInvalidationRule", () => {
  it("accepts all valid rules", () => {
    for (const rule of PBP_DEPENDENCY_INVALIDATION_RULES) {
      expect(isPbpDependencyInvalidationRule(rule)).toBe(true);
    }
  });

  it("rejects invalid rule", () => {
    expect(isPbpDependencyInvalidationRule("invalid")).toBe(false);
  });
});
