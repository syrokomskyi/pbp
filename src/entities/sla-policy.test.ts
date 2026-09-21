import { describe, it, expect } from "vitest";
import {
  isPbpSlaOperator,
  PBP_SLA_OPERATORS,
} from "./sla-policy.js";

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
