/*
<MODULE_CONTRACT>
<purpose>
Unit tests for registry covering rate source adapter registry. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the registry suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  registerRateSourceAdapter,
  getRateSourceAdapter,
  clearRateSourceAdapters,
} from "./registry.ts";
import type { RateSourceAdapter } from "./types.ts";

describe("rate source adapter registry", () => {
  it("returns undefined for unregistered adapter", () => {
    clearRateSourceAdapters();
    expect(getRateSourceAdapter("nonexistent")).toBeUndefined();
  });

  it("registers and retrieves an adapter", () => {
    clearRateSourceAdapters();
    const adapter: RateSourceAdapter = {
      sourceContractRef: { ref: "test" },
      fetchRate: async () => ({ value: "1.0", observedAt: "2026-01-01", sourceKind: "external" }),
    };
    registerRateSourceAdapter("test", adapter);
    expect(getRateSourceAdapter("test")).toBe(adapter);
  });

  it("clear removes all adapters", () => {
    const adapter: RateSourceAdapter = {
      sourceContractRef: { ref: "test2" },
      fetchRate: async () => ({ value: "1.0", observedAt: "2026-01-01", sourceKind: "external" }),
    };
    registerRateSourceAdapter("test2", adapter);
    clearRateSourceAdapters();
    expect(getRateSourceAdapter("test2")).toBeUndefined();
  });
});
