/*
<MODULE_CONTRACT>
<purpose>
Unit tests for price changes policy.schema covering priceChangesPolicySchema (RFC-1155). It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the price suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { priceChangesPolicySchema } from "./price-changes-policy.ts";

const validPriceChangesPolicy = {
  schema: "pbp/price-changes-policy@1",
  id: "https://warpgogol.com/policies/price-changes",
  type: "policy" as const,
  status: "published" as const,
  kind: "price-changes" as const,
  name: "Price Changes Policy",
  priceFixPeriod: "P12M",
  announcementNotice: "P3M",
  exitRight: "before-effective" as const,
};

describe("priceChangesPolicySchema (RFC-1155)", () => {
  it("parses a valid price-changes policy entity", () => {
    const result = priceChangesPolicySchema.safeParse(validPriceChangesPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = priceChangesPolicySchema.safeParse({
      ...validPriceChangesPolicy,
      kind: "cancellation",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = priceChangesPolicySchema.safeParse({
      ...validPriceChangesPolicy,
      extra: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed ISO duration", () => {
    const result = priceChangesPolicySchema.safeParse({
      ...validPriceChangesPolicy,
      priceFixPeriod: "12-months",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid exitRight enum", () => {
    const result = priceChangesPolicySchema.safeParse({
      ...validPriceChangesPolicy,
      exitRight: "whenever",
    });
    expect(result.success).toBe(false);
  });
});
