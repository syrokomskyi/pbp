import { describe, it, expect } from "vitest";
import { exitPolicySchema } from "./exit-policy.js";

const validExitPolicy = {
  schema: "pbp/exit-policy@1",
  id: "https://warpgogol.com/policies/exit-main",
  type: "policy" as const,
  status: "published" as const,
  kind: "exit" as const,
  name: "Exit Policy",
  trigger: { event: "customer-request" },
  deliveryTarget: { duration: "30-days" },
  package: {
    domain: { included: true },
    customerContent: { included: true },
  },
};

describe("exitPolicySchema", () => {
  it("parses a valid exit policy entity", () => {
    const result = exitPolicySchema.safeParse(validExitPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = exitPolicySchema.safeParse({ ...validExitPolicy, kind: "ownership" });
    expect(result.success).toBe(false);
  });

  it("rejects missing trigger", () => {
    const result = exitPolicySchema.safeParse({ ...validExitPolicy, trigger: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects missing deliveryTarget", () => {
    const result = exitPolicySchema.safeParse({ ...validExitPolicy, deliveryTarget: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional formats", () => {
    const result = exitPolicySchema.safeParse({
      ...validExitPolicy,
      formats: { deployableFiles: { valueRef: "zip" } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = exitPolicySchema.safeParse({ ...validExitPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});
