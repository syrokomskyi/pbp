import { describe, it, expect } from "vitest";
import { policySchema, pbpPolicyKindSchema } from "./policy.js";

const validPolicy = {
  schema: "pbp/policy@1",
  id: "https://warpgogol.com/policies/sla-main",
  type: "policy" as const,
  status: "published" as const,
  kind: "service-level" as const,
  name: "SLA Policy",
};

describe("policySchema", () => {
  it("parses a valid policy entity", () => {
    const result = policySchema.safeParse(validPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects invalid kind enum", () => {
    const result = policySchema.safeParse({ ...validPolicy, kind: "unknown" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid policy kinds", () => {
    const kinds = [
      "service-level",
      "guarantee",
      "ownership",
      "exit",
      "data-retention",
      "cancellation",
      "price-changes",
    ];
    for (const kind of kinds) {
      const result = policySchema.safeParse({ ...validPolicy, kind });
      expect(result.success).toBe(true);
    }
  });

  it("accepts optional scope with offeringRefs", () => {
    const result = policySchema.safeParse({
      ...validPolicy,
      scope: { offeringRefs: { main: { ref: "https://warpgogol.com/offerings/foundation" } } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = policySchema.safeParse({ ...validPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});

describe("pbpPolicyKindSchema", () => {
  it("accepts all valid policy kinds", () => {
    const kinds = [
      "service-level",
      "guarantee",
      "ownership",
      "exit",
      "data-retention",
      "cancellation",
      "price-changes",
    ];
    for (const kind of kinds) {
      expect(pbpPolicyKindSchema.safeParse(kind).success).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(pbpPolicyKindSchema.safeParse("invalid").success).toBe(false);
  });
});
