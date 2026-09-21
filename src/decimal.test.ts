import { describe, it, expect } from "vitest";
import {
  decimalMultiply,
  decimalAdd,
  decimalSubtract,
  decimalDivide,
  decimalRound,
  isPbpRoundingMode,
  PBP_ROUNDING_MODES,
} from "./decimal.js";

describe("decimalMultiply", () => {
  it("multiplies two decimal strings", () => {
    expect(decimalMultiply("2", "3")).toBe("6");
    expect(decimalMultiply("0.1", "0.2")).toBe("0.02");
  });
});

describe("decimalAdd", () => {
  it("adds two decimal strings", () => {
    expect(decimalAdd("1.5", "2.5")).toBe("4");
    expect(decimalAdd("0.1", "0.2")).toBe("0.3");
  });
});

describe("decimalSubtract", () => {
  it("subtracts b from a", () => {
    expect(decimalSubtract("5", "3")).toBe("2");
    expect(decimalSubtract("1.0", "0.3")).toBe("0.7");
  });
});

describe("decimalDivide", () => {
  it("divides a by b with precision", () => {
    expect(decimalDivide("10", "3", 4)).toBe("3.3333");
    expect(decimalDivide("1", "4", 2)).toBe("0.25");
  });
});

describe("decimalRound", () => {
  it("rounds to 0 decimal places by default", () => {
    expect(decimalRound("3.7", "half-up")).toBe("4");
    expect(decimalRound("3.2", "half-up")).toBe("3");
  });

  it("rounds to specified decimal places", () => {
    expect(decimalRound("3.14159", "half-up", undefined, 2)).toBe("3.14");
  });

  it("rounds to nearest increment", () => {
    expect(decimalRound("73", "half-up", "10")).toBe("70");
    expect(decimalRound("75", "half-up", "10")).toBe("80");
  });

  it("ceiling mode always rounds up", () => {
    expect(decimalRound("3.1", "ceiling")).toBe("4");
  });

  it("floor mode always rounds down", () => {
    expect(decimalRound("3.9", "floor")).toBe("3");
  });

  it("throws on non-positive increment", () => {
    expect(() => decimalRound("10", "half-up", "0")).toThrow();
    expect(() => decimalRound("10", "half-up", "-1")).toThrow();
  });
});

describe("isPbpRoundingMode", () => {
  it("accepts valid rounding modes", () => {
    for (const mode of PBP_ROUNDING_MODES) {
      expect(isPbpRoundingMode(mode)).toBe(true);
    }
  });

  it("rejects invalid mode", () => {
    expect(isPbpRoundingMode("invalid")).toBe(false);
  });
});
