import { describe, it, expect } from "vitest";
import type { PbpFirstYearCostDerivation, PbpTcoDerivation } from "./first-year-cost.js";

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
