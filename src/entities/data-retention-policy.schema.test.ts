/*
<MODULE_CONTRACT>
<purpose>
Unit tests for data retention policy.schema covering dataRetentionPolicySchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the data suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { dataRetentionPolicySchema } from "./data-retention-policy.ts";

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
