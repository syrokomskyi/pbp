import { describe, it, expect } from "vitest";
import { ownershipPolicySchema } from "./ownership-policy.ts";

const validOwnershipPolicy = {
  schema: "pbp/ownership-policy@1",
  id: "https://warpgogol.com/policies/ownership-main",
  type: "policy" as const,
  status: "published" as const,
  kind: "ownership" as const,
  name: "Ownership Policy",
  assets: {
    domain: { holder: "customer" as const },
    customerContent: { holder: "customer" as const },
  },
};

describe("ownershipPolicySchema", () => {
  it("parses a valid ownership policy entity", () => {
    const result = ownershipPolicySchema.safeParse(validOwnershipPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = ownershipPolicySchema.safeParse({ ...validOwnershipPolicy, kind: "exit" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid holder enum", () => {
    const result = ownershipPolicySchema.safeParse({
      ...validOwnershipPolicy,
      assets: { domain: { holder: "invalid" } },
    });
    expect(result.success).toBe(false);
  });

  it("accepts all asset holder values", () => {
    for (const holder of ["customer", "third-party", "provider"] as const) {
      const result = ownershipPolicySchema.safeParse({
        ...validOwnershipPolicy,
        assets: { domain: { holder } },
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects unknown keys (strict)", () => {
    const result = ownershipPolicySchema.safeParse({ ...validOwnershipPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});
