import { describe, it, expect } from "vitest";
import { brandSchema } from "./brand.js";

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
