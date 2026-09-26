import { describe, it, expect } from "vitest";
import { renewalPolicySchema } from "./renewal-policy.js";

const validRenewalPolicy = {
  schema: "pbp/renewal-policy@1",
  id: "https://warpgogol.com/policies/renewal",
  type: "policy" as const,
  status: "published" as const,
  kind: "renewal" as const,
  name: "Renewal Policy",
  renewalPeriod: "P12M",
  reminder: "P14D",
};

describe("renewalPolicySchema (RFC-1155)", () => {
  it("parses a valid renewal policy entity", () => {
    const result = renewalPolicySchema.safeParse(validRenewalPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = renewalPolicySchema.safeParse({
      ...validRenewalPolicy,
      kind: "price-changes",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = renewalPolicySchema.safeParse({ ...validRenewalPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects malformed renewalPeriod", () => {
    const result = renewalPolicySchema.safeParse({
      ...validRenewalPolicy,
      renewalPeriod: "PT",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed reminder", () => {
    const result = renewalPolicySchema.safeParse({
      ...validRenewalPolicy,
      reminder: "14 days",
    });
    expect(result.success).toBe(false);
  });
});
