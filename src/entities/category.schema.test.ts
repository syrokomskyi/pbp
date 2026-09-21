import { describe, it, expect } from "vitest";
import { categorySchema } from "./category.js";

const validCategory = {
  schema: "pbp/category@1",
  id: "https://warpgogol.com/categories/software",
  type: "category" as const,
  status: "published" as const,
  name: "Software",
};

describe("categorySchema", () => {
  it("parses a valid category entity", () => {
    const result = categorySchema.safeParse(validCategory);
    expect(result.success).toBe(true);
  });

  it("accepts optional broaderRef", () => {
    const result = categorySchema.safeParse({
      ...validCategory,
      broaderRef: { ref: "https://warpgogol.com/categories/parent" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional externalMappings", () => {
    const result = categorySchema.safeParse({
      ...validCategory,
      externalMappings: { google: { value: "software" } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects wrong type literal", () => {
    const result = categorySchema.safeParse({ ...validCategory, type: "tag" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = categorySchema.safeParse({ ...validCategory, extra: "x" });
    expect(result.success).toBe(false);
  });
});
