/*
<MODULE_CONTRACT>
<purpose>
Unit tests for validation covering validateDecimal; validateMoneyRange; containsHtml. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the validation suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { validateDecimal, validateMoneyRange, containsHtml, isEmptyValue } from "./validation.ts";

describe("validateDecimal", () => {
  it("accepts integer string", () => {
    expect(validateDecimal("70")).toBe(true);
  });

  it("accepts decimal string", () => {
    expect(validateDecimal("70.00")).toBe(true);
  });

  it("accepts negative decimal", () => {
    expect(validateDecimal("-3.14")).toBe(true);
  });

  it("accepts zero", () => {
    expect(validateDecimal("0")).toBe(true);
    expect(validateDecimal("0.0")).toBe(true);
  });

  it("rejects non-numeric string", () => {
    expect(validateDecimal("abc")).toBe(false);
  });

  it("rejects leading zeros (except zero itself)", () => {
    expect(validateDecimal("007")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateDecimal("")).toBe(false);
  });
});

describe("validateMoneyRange", () => {
  it("returns ok when currencies match", () => {
    const result = validateMoneyRange({
      minimum: { value: "50.00", currency: "EUR" },
      maximum: { value: "100.00", currency: "EUR" },
    });
    expect(result.ok).toBe(true);
  });

  it("returns fail when currencies mismatch", () => {
    const result = validateMoneyRange({
      minimum: { value: "50.00", currency: "EUR" },
      maximum: { value: "100.00", currency: "GBP" },
    });
    expect(result.ok).toBe(false);
  });
});

describe("containsHtml", () => {
  it("detects HTML tags", () => {
    expect(containsHtml("<b>hello</b>")).toBe(true);
    expect(containsHtml("<div>text</div>")).toBe(true);
  });

  it("returns false for plain text", () => {
    expect(containsHtml("hello world")).toBe(false);
  });

  it("returns false for angle brackets that are not tags", () => {
    expect(containsHtml("a < b")).toBe(false);
  });
});

describe("isEmptyValue", () => {
  it("returns true for empty string", () => {
    expect(isEmptyValue("")).toBe(true);
  });

  it("returns true for whitespace-only string", () => {
    expect(isEmptyValue("   ")).toBe(true);
  });

  it("returns false for non-empty string", () => {
    expect(isEmptyValue("hello")).toBe(false);
  });
});
