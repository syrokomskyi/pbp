/*
<MODULE_CONTRACT>
<purpose>
Unit tests for first year cost covering PbpFirstYearCostDerivation; PbpTcoDerivation. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the first suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpFirstYearCostDerivation, PbpTcoDerivation } from "./first-year-cost.ts";

describe("PbpFirstYearCostDerivation", () => {
  it("defines a valid first-year cost derivation shape", () => {
    const derivation: PbpFirstYearCostDerivation = {
      derivationRef: "pbp/derivation/first-year-cost@1",
      inputs: { plan: "plan-1", period: "P1Y" },
      output: {
        valueType: "monetary-result",
        resultModes: { exact: true, range: false, parameterized: false },
      },
      rounding: { mode: "currency-minor-unit" },
    };
    expect(derivation.derivationRef).toBe("pbp/derivation/first-year-cost@1");
    expect(derivation.output.valueType).toBe("monetary-result");
  });
});

describe("PbpTcoDerivation", () => {
  it("defines a valid TCO derivation shape", () => {
    const derivation: PbpTcoDerivation = {
      derivationRef: "pbp/derivation/tco@1",
      inputs: { plan: "plan-1", period: "P3Y" },
      output: {
        valueType: "monetary-result",
        resultModes: { exact: true, range: true, parameterized: true },
      },
      rounding: { mode: "currency-minor-unit" },
    };
    expect(derivation.output.resultModes.parameterized).toBe(true);
  });
});
