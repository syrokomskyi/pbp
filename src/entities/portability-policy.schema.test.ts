import { describe, it, expect } from "vitest";
import { portabilityPolicySchema } from "./portability-policy.ts";

const validPortabilityPolicy = {
  schema: "pbp/portability-policy@1",
  id: "https://warpgogol.com/policies/portability",
  type: "policy" as const,
  status: "published" as const,
  kind: "portability" as const,
  name: "Portability Policy",
  exportPackageRef: { ref: "policies/exit", expectedType: "policy" },
  continuity: { runnableCopy: true },
};

describe("portabilityPolicySchema (RFC-1155)", () => {
  it("parses a valid portability policy entity", () => {
    const result = portabilityPolicySchema.safeParse(validPortabilityPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = portabilityPolicySchema.safeParse({
      ...validPortabilityPolicy,
      kind: "exit",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = portabilityPolicySchema.safeParse({
      ...validPortabilityPolicy,
      extra: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed exportPackageRef", () => {
    const result = portabilityPolicySchema.safeParse({
      ...validPortabilityPolicy,
      exportPackageRef: { ref: "" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-boolean runnableCopy", () => {
    const result = portabilityPolicySchema.safeParse({
      ...validPortabilityPolicy,
      continuity: { runnableCopy: "yes" },
    });
    expect(result.success).toBe(false);
  });
});
