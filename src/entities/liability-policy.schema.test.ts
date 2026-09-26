import { describe, it, expect } from "vitest";
import { liabilityPolicySchema } from "./liability-policy.js";

const validLiabilityPolicy = {
  schema: "pbp/liability-policy@1",
  id: "https://warpgogol.com/policies/liability",
  type: "policy" as const,
  status: "published" as const,
  kind: "liability" as const,
  name: "Liability Policy",
  cap: {
    basis: "sum-of-payments-received" as const,
    period: "P3M",
    exclusions: ["Art. 82 DSGVO", "§ 276 BGB", "life/health"],
  },
};

describe("liabilityPolicySchema (RFC-1155)", () => {
  it("parses a valid liability policy entity", () => {
    const result = liabilityPolicySchema.safeParse(validLiabilityPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = liabilityPolicySchema.safeParse({
      ...validLiabilityPolicy,
      kind: "guarantee",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = liabilityPolicySchema.safeParse({ ...validLiabilityPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects cap without period", () => {
    const result = liabilityPolicySchema.safeParse({
      ...validLiabilityPolicy,
      cap: { basis: "sum-of-payments-received" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed cap period", () => {
    const result = liabilityPolicySchema.safeParse({
      ...validLiabilityPolicy,
      cap: { basis: "sum-of-payments-received", period: "3 months" },
    });
    expect(result.success).toBe(false);
  });
});
