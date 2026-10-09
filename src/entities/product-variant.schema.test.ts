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
