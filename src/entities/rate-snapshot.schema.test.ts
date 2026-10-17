/*
<MODULE_CONTRACT>
<purpose>
Unit tests for rate snapshot.schema covering rateSnapshotSchema. It also guards the documented public contract and regression-sensitive edge cases.
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
import { rateSnapshotSchema } from "./rate-snapshot.ts";

const validRateSnapshot = {
  schema: "pbp/rate-snapshot@1",
  id: "https://warpgogol.com/rate-snapshots/eur-gbp-2026-01-01",
  type: "rate-snapshot" as const,
  status: "published" as const,
  pair: { sourceCurrency: "EUR", targetCurrency: "GBP" },
  quotation: { direction: "target-per-source" as const },
  value: "0.85",
  source: { kind: "external" as const },
  observedAt: "2026-01-01T00:00:00Z",
  freshUntil: "2026-01-02T00:00:00Z",
  digest: { algorithm: "sha256", value: "abc123" },
};

describe("rateSnapshotSchema", () => {
  it("parses a valid rate-snapshot entity", () => {
    const result = rateSnapshotSchema.safeParse(validRateSnapshot);
    expect(result.success).toBe(true);
  });

  it("rejects non-decimal value", () => {
    const result = rateSnapshotSchema.safeParse({ ...validRateSnapshot, value: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects missing digest", () => {
    const result = rateSnapshotSchema.safeParse({ ...validRateSnapshot, digest: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects missing source", () => {
    const result = rateSnapshotSchema.safeParse({ ...validRateSnapshot, source: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts source with sourceContractRef", () => {
    const result = rateSnapshotSchema.safeParse({
      ...validRateSnapshot,
      source: {
        kind: "external",
        sourceContractRef: { ref: "https://warpgogol.com/rate-sources/ecb" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = rateSnapshotSchema.safeParse({ ...validRateSnapshot, extra: "x" });
    expect(result.success).toBe(false);
  });
});
