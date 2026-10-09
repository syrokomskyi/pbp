import { describe, it, expect } from "vitest";
import { productSchema } from "./product.ts";

const validProduct = {
  schema: "pbp/product@1",
  id: "https://warpgogol.com/products/foundation",
  type: "product" as const,
  status: "published" as const,
  kind: "service" as const,
  name: "Foundation",
};

describe("productSchema", () => {
  it("parses a valid product entity", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("rejects invalid kind enum", () => {
    const result = productSchema.safeParse({ ...validProduct, kind: "unknown" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid kinds", () => {
    const kinds = [
      "physical-good",
      "digital-good",
      "service",
      "composite-service",
      "subscription-access",
      "license",
      "rental",
      "insurance-product",
      "bundle",
      "right",
      "data-product",
      "experience",
      "custom-made-good",
    ];
    for (const kind of kinds) {
      const result = productSchema.safeParse({ ...validProduct, kind });
      expect(result.success).toBe(true);
    }
  });

  it("accepts optional purpose with statement", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      purpose: { statement: "Build websites" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects purpose as string (must be object)", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      purpose: "Build websites",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional classification", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      classification: {
        categoryRef: { ref: "https://warpgogol.com/categories/software" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = productSchema.safeParse({ ...validProduct, extra: "x" });
    expect(result.success).toBe(false);
  });
});
