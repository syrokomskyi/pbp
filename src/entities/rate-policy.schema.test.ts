/*
<MODULE_CONTRACT>
<purpose>
Unit tests for rate policy.schema covering pbpRatePolicySchema; pbpRateScheduleSchema; pbpRateModeSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the rate suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  pbpRatePolicySchema,
  pbpRateScheduleSchema,
  pbpRateModeSchema,
  pbpRateDirectionSchema,
} from "./rate-policy.ts";

const validRatePolicy = {
  schema: "pbp/rate-policy@1",
  id: "https://warpgogol.com/rate-policies/eur-gbp",
  type: "rate-policy" as const,
  status: "published" as const,
  pair: { sourceCurrency: "EUR", targetCurrency: "GBP" },
  quotation: { direction: "target-per-source" as const },
  mode: "external" as const,
  freshness: { maximumAge: "P1D", allowLastKnownValue: false },
  failure: { noAcceptableRate: "block-publication" as const },
};

describe("pbpRatePolicySchema", () => {
  it("parses a valid rate-policy entity", () => {
    const result = pbpRatePolicySchema.safeParse(validRatePolicy);
    expect(result.success).toBe(true);
  });

  it("rejects invalid mode enum", () => {
    const result = pbpRatePolicySchema.safeParse({ ...validRatePolicy, mode: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid direction enum", () => {
    const result = pbpRatePolicySchema.safeParse({
      ...validRatePolicy,
      quotation: { direction: "invalid" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional sources", () => {
    const result = pbpRatePolicySchema.safeParse({
      ...validRatePolicy,
      sources: { primary: { ref: "https://warpgogol.com/rate-sources/ecb" } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = pbpRatePolicySchema.safeParse({ ...validRatePolicy, extra: "x" });
    expect(result.success).toBe(false);
  });
});

const validRateSchedule = {
  schema: "pbp/rate-schedule@1",
  id: "https://warpgogol.com/rate-schedules/eur-gbp",
  type: "rate-schedule" as const,
  status: "published" as const,
  pair: { sourceCurrency: "EUR", targetCurrency: "GBP" },
  quotation: { direction: "target-per-source" as const },
  entries: {
    "2026-01-01": { value: "0.85", validFrom: "2026-01-01" },
  },
};

describe("pbpRateScheduleSchema", () => {
  it("parses a valid rate-schedule entity", () => {
    const result = pbpRateScheduleSchema.safeParse(validRateSchedule);
    expect(result.success).toBe(true);
  });

  it("rejects empty entries (refine rule)", () => {
    const result = pbpRateScheduleSchema.safeParse({ ...validRateSchedule, entries: {} });
    expect(result.success).toBe(false);
  });

  it("rejects entry with non-decimal value", () => {
    const result = pbpRateScheduleSchema.safeParse({
      ...validRateSchedule,
      entries: { "2026-01-01": { value: "abc", validFrom: "2026-01-01" } },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = pbpRateScheduleSchema.safeParse({ ...validRateSchedule, extra: "x" });
    expect(result.success).toBe(false);
  });
});

describe("pbpRateModeSchema", () => {
  it("accepts external mode", () => {
    expect(pbpRateModeSchema.safeParse("external").success).toBe(true);
  });

  it("accepts business-fixed mode", () => {
    expect(pbpRateModeSchema.safeParse("business-fixed").success).toBe(true);
  });

  it("rejects invalid mode", () => {
    expect(pbpRateModeSchema.safeParse("invalid").success).toBe(false);
  });
});

describe("pbpRateDirectionSchema", () => {
  it("accepts target-per-source", () => {
    expect(pbpRateDirectionSchema.safeParse("target-per-source").success).toBe(true);
  });

  it("accepts source-per-target", () => {
    expect(pbpRateDirectionSchema.safeParse("source-per-target").success).toBe(true);
  });
});
