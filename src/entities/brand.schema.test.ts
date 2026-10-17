/*
<MODULE_CONTRACT>
<purpose>
Unit tests for brand.schema covering brandSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the brand.schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { brandSchema } from "./brand.ts";

const validBrand = {
  schema: "pbp/brand@1",
  id: "https://warpgogol.com/brand/main",
  type: "brand" as const,
  status: "published" as const,
  name: "Main Brand",
  ownerBusinessRef: { ref: "https://warpgogol.com/business" },
};

describe("brandSchema", () => {
  it("parses a valid brand entity", () => {
    const result = brandSchema.safeParse(validBrand);
    expect(result.success).toBe(true);
  });

  it("rejects missing ownerBusinessRef", () => {
    const result = brandSchema.safeParse({ ...validBrand, ownerBusinessRef: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional tagline", () => {
    const result = brandSchema.safeParse({ ...validBrand, tagline: "Best in class" });
    expect(result.success).toBe(true);
  });

  it("rejects wrong type literal", () => {
    const result = brandSchema.safeParse({ ...validBrand, type: "business" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = brandSchema.safeParse({ ...validBrand, extra: "x" });
    expect(result.success).toBe(false);
  });
});
