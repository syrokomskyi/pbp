/*
<MODULE_CONTRACT>
<purpose>
Unit tests for product variant.schema covering productVariantSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the product suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { productVariantSchema } from "./product-variant.ts";

const validProductVariant = {
  schema: "pbp/product-variant@1",
  id: "https://warpgogol.com/product-variants/hosting-pro",
  type: "product-variant" as const,
  status: "published" as const,
  name: "Hosting Pro",
  groupRef: { ref: "https://warpgogol.com/product-groups/hosting" },
  variantValues: { tier: { valueRef: "pro" } },
};

describe("productVariantSchema", () => {
  it("parses a valid product-variant entity", () => {
    const result = productVariantSchema.safeParse(validProductVariant);
    expect(result.success).toBe(true);
  });

  it("rejects missing groupRef", () => {
    const result = productVariantSchema.safeParse({ ...validProductVariant, groupRef: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects missing variantValues", () => {
    const result = productVariantSchema.safeParse({
      ...validProductVariant,
      variantValues: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects variantValues entry without valueRef", () => {
    const result = productVariantSchema.safeParse({
      ...validProductVariant,
      variantValues: { tier: {} },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = productVariantSchema.safeParse({ ...validProductVariant, extra: "x" });
    expect(result.success).toBe(false);
  });
});
