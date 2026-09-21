import { describe, it, expect } from "vitest";
import {
  pbpChargeSchema,
  pbpExternalCostSchema,
  pbpPlanSchema,
  pbpAdjustmentSchema,
} from "./pricing.js";

describe("pbpChargeSchema", () => {
  it("parses a fixed charge", () => {
    const result = pbpChargeSchema.safeParse({
      type: "recurring",
      purpose: "Monthly subscription",
      amount: { model: "fixed", value: "70.00" },
    });
    expect(result.success).toBe(true);
  });

  it("parses a range charge", () => {
    const result = pbpChargeSchema.safeParse({
      type: "usage",
      purpose: "Variable cost",
      amount: { model: "range", minimum: "50.00", maximum: "100.00" },
    });
    expect(result.success).toBe(true);
  });

  it("parses a unit-rate charge", () => {
    const result = pbpChargeSchema.safeParse({
      type: "usage",
      purpose: "Per GB",
      amount: { model: "unit-rate", unitValue: "0.50" },
    });
    expect(result.success).toBe(true);
  });

  it("parses a tiered charge", () => {
    const result = pbpChargeSchema.safeParse({
      type: "usage",
      purpose: "Tiered pricing",
      amount: {
        model: "tiered",
        method: "graduated",
        tiers: {
          "1": { order: 1, upTo: "100", unitValue: "0.50" },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing purpose", () => {
    const result = pbpChargeSchema.safeParse({
      type: "recurring",
      amount: { model: "fixed", value: "70.00" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-decimal value in fixed amount", () => {
    const result = pbpChargeSchema.safeParse({
      type: "recurring",
      purpose: "Monthly",
      amount: { model: "fixed", value: "abc" },
    });
    expect(result.success).toBe(false);
  });
});

describe("pbpExternalCostSchema", () => {
  it("parses a valid external cost", () => {
    const result = pbpExternalCostSchema.safeParse({
      purpose: "Domain registration",
      amount: { model: "fixed", value: "15.00" },
      paidBy: "provider",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid paidBy", () => {
    const result = pbpExternalCostSchema.safeParse({
      purpose: "Domain",
      amount: { model: "fixed", value: "15.00" },
      paidBy: "customer",
    });
    expect(result.success).toBe(false);
  });
});

describe("pbpPlanSchema", () => {
  it("parses a valid plan", () => {
    const result = pbpPlanSchema.safeParse({
      name: "Pro",
      chargeRefs: { monthly: { ref: "monthly-charge" } },
      billing: { recurrence: "P1M" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing billing recurrence", () => {
    const result = pbpPlanSchema.safeParse({
      name: "Pro",
      chargeRefs: { monthly: { ref: "monthly-charge" } },
      billing: {},
    });
    expect(result.success).toBe(false);
  });
});

describe("pbpAdjustmentSchema", () => {
  it("parses a valid discount adjustment", () => {
    const result = pbpAdjustmentSchema.safeParse({
      type: "discount",
      calculation: { model: "percentage", value: "10" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid adjustment type", () => {
    const result = pbpAdjustmentSchema.safeParse({
      type: "invalid",
      calculation: { model: "percentage", value: "10" },
    });
    expect(result.success).toBe(false);
  });
});
