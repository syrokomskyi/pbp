import { describe, it, expect } from "vitest";
import { pbpCurrencyPricingPolicySchema } from "./currency-pricing-policy.js";

const validCurrencyPricingPolicy = {
  schema: "pbp/currency-pricing-policy@1",
  id: "https://warpgogol.com/currency-pricing-policies/main",
  type: "currency-pricing-policy" as const,
  status: "published" as const,
  businessRef: { ref: "https://warpgogol.com/business" },
  baseCurrency: "EUR",
  targetCurrencies: {
    GBP: {
      currency: "GBP",
      strategy: "derived" as const,
      currentUses: {
        presentation: true,
        aiAnswers: true,
        quote: false,
        contract: false,
        invoice: false,
        settlement: false,
      },
    },
  },
};

describe("pbpCurrencyPricingPolicySchema", () => {
  it("parses a valid currency-pricing-policy entity", () => {
    const result = pbpCurrencyPricingPolicySchema.safeParse(validCurrencyPricingPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects empty targetCurrencies (refine rule)", () => {
    const result = pbpCurrencyPricingPolicySchema.safeParse({
      ...validCurrencyPricingPolicy,
      targetCurrencies: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing businessRef", () => {
    const result = pbpCurrencyPricingPolicySchema.safeParse({
      ...validCurrencyPricingPolicy,
      businessRef: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid strategy enum", () => {
    const result = pbpCurrencyPricingPolicySchema.safeParse({
      ...validCurrencyPricingPolicy,
      targetCurrencies: {
        GBP: {
          ...validCurrencyPricingPolicy.targetCurrencies.GBP,
          strategy: "invalid",
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts fixed strategy with pipelineOverride", () => {
    const result = pbpCurrencyPricingPolicySchema.safeParse({
      ...validCurrencyPricingPolicy,
      targetCurrencies: {
        GBP: {
          ...validCurrencyPricingPolicy.targetCurrencies.GBP,
          strategy: "fixed",
          pipelineOverride: {
            rounding: { mode: "half-up", decimalPlaces: 2 },
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = pbpCurrencyPricingPolicySchema.safeParse({
      ...validCurrencyPricingPolicy,
      extra: "x",
    });
    expect(result.success).toBe(false);
  });
});
