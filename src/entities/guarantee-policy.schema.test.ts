/*
<MODULE_CONTRACT>
<purpose>
Unit tests for guarantee policy.schema covering guaranteePolicySchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the guarantee suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { guaranteePolicySchema } from "./guarantee-policy.ts";

const validGuaranteePolicy = {
  schema: "pbp/guarantee-policy@1",
  id: "https://warpgogol.com/policies/guarantee-main",
  type: "policy" as const,
  status: "published" as const,
  kind: "guarantee" as const,
  name: "Guarantee Policy",
  condition: {
    trigger: { event: "downtime" },
    objective: {
      metricRef: "uptime",
      operator: "greater-than-or-equal" as const,
      threshold: { value: "99.9", unitRef: "percent" },
    },
  },
  remedy: {
    type: "service-credit" as const,
    additionalCharge: false,
    until: "resolved",
  },
};

describe("guaranteePolicySchema", () => {
  it("parses a valid guarantee policy entity", () => {
    const result = guaranteePolicySchema.safeParse(validGuaranteePolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal (must be guarantee)", () => {
    const result = guaranteePolicySchema.safeParse({
      ...validGuaranteePolicy,
      kind: "service-level",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing remedy", () => {
    const result = guaranteePolicySchema.safeParse({ ...validGuaranteePolicy, remedy: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects invalid remedy type", () => {
    const result = guaranteePolicySchema.safeParse({
      ...validGuaranteePolicy,
      remedy: { ...validGuaranteePolicy.remedy, type: "invalid" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = guaranteePolicySchema.safeParse({ ...validGuaranteePolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});
