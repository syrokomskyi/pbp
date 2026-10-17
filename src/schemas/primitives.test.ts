/*
<MODULE_CONTRACT>
<purpose>
Unit tests for primitives covering nonEmptyString; decimalString; pbpMoneySchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the primitives suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  nonEmptyString,
  decimalString,
  pbpMoneySchema,
  pbpMoneyRangeSchema,
  pbpLocalizedStringSchema,
  pbpQuantitativeValueSchema,
  pbpExternalIdentifierSchema,
} from "./primitives.ts";

describe("nonEmptyString", () => {
  it("accepts non-empty string", () => {
    expect(nonEmptyString.safeParse("hello").success).toBe(true);
  });

  it("rejects empty string", () => {
    expect(nonEmptyString.safeParse("").success).toBe(false);
  });

  it("rejects HTML tags (ADR-037)", () => {
    expect(nonEmptyString.safeParse("<b>hello</b>").success).toBe(false);
  });

  it("accepts string with angle brackets that are not HTML tags", () => {
    expect(nonEmptyString.safeParse("a < b").success).toBe(true);
  });
});

describe("decimalString", () => {
  it("accepts decimal string", () => {
    expect(decimalString.safeParse("70.00").success).toBe(true);
  });

  it("accepts integer string", () => {
    expect(decimalString.safeParse("70").success).toBe(true);
  });

  it("rejects non-decimal string", () => {
    expect(decimalString.safeParse("abc").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(decimalString.safeParse("").success).toBe(false);
  });
});

describe("pbpMoneySchema", () => {
  it("parses valid money object", () => {
    const result = pbpMoneySchema.safeParse({ value: "70.00", currency: "EUR" });
    expect(result.success).toBe(true);
  });

  it("rejects non-decimal value", () => {
    const result = pbpMoneySchema.safeParse({ value: "abc", currency: "EUR" });
    expect(result.success).toBe(false);
  });

  it("rejects missing currency", () => {
    const result = pbpMoneySchema.safeParse({ value: "70.00" });
    expect(result.success).toBe(false);
  });
});

describe("pbpMoneyRangeSchema", () => {
  it("parses valid range", () => {
    const result = pbpMoneyRangeSchema.safeParse({
      minimum: { value: "50.00", currency: "EUR" },
      maximum: { value: "100.00", currency: "EUR" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing maximum", () => {
    const result = pbpMoneyRangeSchema.safeParse({
      minimum: { value: "50.00", currency: "EUR" },
    });
    expect(result.success).toBe(false);
  });
});

describe("pbpLocalizedStringSchema", () => {
  it("parses valid localized string", () => {
    const result = pbpLocalizedStringSchema.safeParse({ value: "Hello", language: "en" });
    expect(result.success).toBe(true);
  });

  it("rejects empty value", () => {
    const result = pbpLocalizedStringSchema.safeParse({ value: "", language: "en" });
    expect(result.success).toBe(false);
  });
});

describe("pbpQuantitativeValueSchema", () => {
  it("parses with value and unitRef", () => {
    const result = pbpQuantitativeValueSchema.safeParse({ value: "10", unitRef: "GB" });
    expect(result.success).toBe(true);
  });

  it("parses with min/max and unitRef", () => {
    const result = pbpQuantitativeValueSchema.safeParse({
      minimum: "5",
      maximum: "20",
      unitRef: "GB",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing unitRef", () => {
    const result = pbpQuantitativeValueSchema.safeParse({ value: "10" });
    expect(result.success).toBe(false);
  });
});

describe("pbpExternalIdentifierSchema", () => {
  it("parses valid external identifier", () => {
    const result = pbpExternalIdentifierSchema.safeParse({
      schemeRef: "vat",
      value: "DE123456789",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional authorityRef", () => {
    const result = pbpExternalIdentifierSchema.safeParse({
      schemeRef: "vat",
      value: "DE123456789",
      authorityRef: "bzst",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing schemeRef", () => {
    const result = pbpExternalIdentifierSchema.safeParse({ value: "DE123456789" });
    expect(result.success).toBe(false);
  });
});
