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
