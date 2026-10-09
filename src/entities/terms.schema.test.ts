import { describe, it, expect } from "vitest";
import { pbpTermsSchema } from "./terms.ts";

describe("pbpTermsSchema", () => {
  it("parses empty object (all fields optional)", () => {
    const result = pbpTermsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("parses with minimumTerm", () => {
    const result = pbpTermsSchema.safeParse({ minimumTerm: "P1M" });
    expect(result.success).toBe(true);
  });

  it("parses with renewal", () => {
    const result = pbpTermsSchema.safeParse({
      renewal: { mode: "automatic", period: "P1M" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid renewal mode", () => {
    const result = pbpTermsSchema.safeParse({
      renewal: { mode: "invalid", period: "P1M" },
    });
    expect(result.success).toBe(false);
  });

  it("parses with cancellation policyRef", () => {
    const result = pbpTermsSchema.safeParse({
      cancellation: { policyRef: { ref: "https://warpgogol.com/policies/cancellation" } },
    });
    expect(result.success).toBe(true);
  });

  it("parses with priceChanges policyRef", () => {
    const result = pbpTermsSchema.safeParse({
      priceChanges: { policyRef: { ref: "https://warpgogol.com/policies/price-changes" } },
    });
    expect(result.success).toBe(true);
  });

  it("accepts unknown keys (not strict)", () => {
    const result = pbpTermsSchema.safeParse({ extra: "x" });
    expect(result.success).toBe(true);
  });
});
