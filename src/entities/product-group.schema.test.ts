import { describe, it, expect } from "vitest";
import { productGroupSchema } from "./product-group.js";

const validProductGroup = {
  schema: "pbp/product-group@1",
  id: "https://warpgogol.com/product-groups/hosting",
  type: "product-group" as const,
  status: "published" as const,
  name: "Hosting Plans",
  variationAxes: {
    tier: { attributeRef: "tier", required: true },
  },
};

describe("productGroupSchema", () => {
  it("parses a valid product-group entity", () => {
    const result = productGroupSchema.safeParse(validProductGroup);
    expect(result.success).toBe(true);
  });

  it("rejects missing variationAxes", () => {
    const result = productGroupSchema.safeParse({ ...validProductGroup, variationAxes: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional classification", () => {
    const result = productGroupSchema.safeParse({
      ...validProductGroup,
      classification: { categoryRef: { ref: "https://warpgogol.com/categories/hosting" } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects variationAxes entry without required field", () => {
    const result = productGroupSchema.safeParse({
      ...validProductGroup,
      variationAxes: { tier: { attributeRef: "tier" } },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = productGroupSchema.safeParse({ ...validProductGroup, extra: "x" });
    expect(result.success).toBe(false);
  });
});
