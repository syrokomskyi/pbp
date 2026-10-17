/*
<MODULE_CONTRACT>
<purpose>
Unit tests for category.schema covering categorySchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the category.schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { categorySchema } from "./category.ts";

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
