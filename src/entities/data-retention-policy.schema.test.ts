import { describe, it, expect } from "vitest";
import { dataRetentionPolicySchema } from "./data-retention-policy.js";

const validDataRetentionPolicy = {
  schema: "pbp/data-retention-policy@1",
  id: "https://warpgogol.com/policies/data-retention-main",
  type: "policy" as const,
  status: "published" as const,
  kind: "data-retention" as const,
  name: "Data Retention Policy",
  retention: {
    default: { duration: "P1Y", startsFrom: "account-closure" },
  },
  deletion: { method: "secure-erase", timeline: "30-days" },
};

describe("dataRetentionPolicySchema", () => {
  it("parses a valid data retention policy entity", () => {
    const result = dataRetentionPolicySchema.safeParse(validDataRetentionPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = dataRetentionPolicySchema.safeParse({
      ...validDataRetentionPolicy,
      kind: "exit",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing retention", () => {
    const result = dataRetentionPolicySchema.safeParse({
      ...validDataRetentionPolicy,
      retention: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing deletion", () => {
    const result = dataRetentionPolicySchema.safeParse({
      ...validDataRetentionPolicy,
      deletion: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects retention entry without duration", () => {
    const result = dataRetentionPolicySchema.safeParse({
      ...validDataRetentionPolicy,
      retention: { default: { startsFrom: "closure" } },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = dataRetentionPolicySchema.safeParse({ ...validDataRetentionPolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});
