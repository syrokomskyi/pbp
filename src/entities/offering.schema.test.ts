/*
<MODULE_CONTRACT>
<purpose>
Unit tests for offering.schema covering offeringSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the offering.schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { offeringSchema } from "./offering.ts";

const validOffering = {
  schema: "pbp/offering@1",
  id: "https://warpgogol.com/offerings/foundation",
  type: "offering" as const,
  status: "published" as const,
  name: "Foundation Package",
  businessRef: { ref: "https://warpgogol.com/business" },
};

describe("offeringSchema", () => {
  it("parses a valid offering entity", () => {
    const result = offeringSchema.safeParse(validOffering);
    expect(result.success).toBe(true);
  });

  it("rejects missing businessRef", () => {
    const result = offeringSchema.safeParse({ ...validOffering, businessRef: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional pricing with fixed charge", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      pricing: {
        currency: "EUR",
        charges: {
          monthly: {
            type: "recurring",
            purpose: "Monthly subscription",
            amount: { model: "fixed", value: "70.00" },
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects pricing charge without purpose", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      pricing: {
        currency: "EUR",
        charges: {
          monthly: {
            type: "recurring",
            amount: { model: "fixed", value: "70.00" },
          },
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional availability with mode", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      availability: { mode: "declared" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid availability mode", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      availability: { mode: "sometimes" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional guarantees", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      guarantees: {
        uptime: { label: "Uptime", detail: "99.9% guaranteed" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = offeringSchema.safeParse({ ...validOffering, extra: "x" });
    expect(result.success).toBe(false);
  });
});
