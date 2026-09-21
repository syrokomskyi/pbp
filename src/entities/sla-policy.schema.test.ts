import { describe, it, expect } from "vitest";
import { slaPolicySchema } from "./sla-policy.js";

const validSlaPolicy = {
  schema: "pbp/sla-policy@1",
  id: "https://warpgogol.com/policies/sla-main",
  type: "policy" as const,
  status: "published" as const,
  kind: "service-level" as const,
  name: "SLA Policy",
  objective: {
    metricRef: "uptime",
    operator: "greater-than-or-equal" as const,
    threshold: { value: "99.9", unitRef: "percent" },
    measurementWindow: "monthly",
  },
};

describe("slaPolicySchema", () => {
  it("parses a valid SLA policy entity", () => {
    const result = slaPolicySchema.safeParse(validSlaPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal (must be service-level)", () => {
    const result = slaPolicySchema.safeParse({ ...validSlaPolicy, kind: "guarantee" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid operator enum", () => {
    const result = slaPolicySchema.safeParse({
      ...validSlaPolicy,
      objective: { ...validSlaPolicy.objective, operator: "invalid" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional remedy", () => {
    const result = slaPolicySchema.safeParse({
      ...validSlaPolicy,
      remedy: {
        trigger: "objective-not-met",
        type: "service-credit",
        application: "automatic",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = slaPolicySchema.safeParse({ ...validSlaPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});
