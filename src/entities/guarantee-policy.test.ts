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
