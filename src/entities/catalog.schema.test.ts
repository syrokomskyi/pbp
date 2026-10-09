import { describe, it, expect } from "vitest";
import { catalogSchema, catalogEntrySchema } from "./catalog.ts";

const validCatalog = {
  schema: "pbp/catalog@1",
  id: "https://warpgogol.com/catalog/main",
  type: "catalog" as const,
  status: "published" as const,
  name: "Main Catalog",
  businessRef: { ref: "https://warpgogol.com/business" },
  entrySource: { mode: "manifest-directory" as const, logicalPath: "src/content/catalog" },
};

describe("catalogSchema", () => {
  it("parses a valid catalog entity with manifest-directory mode", () => {
    const result = catalogSchema.safeParse(validCatalog);
    expect(result.success).toBe(true);
  });

  it("parses a valid catalog entity with dataset mode", () => {
    const result = catalogSchema.safeParse({
      ...validCatalog,
      entrySource: { mode: "dataset", adapterRef: "json-adapter" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid entrySource mode", () => {
    const result = catalogSchema.safeParse({
      ...validCatalog,
      entrySource: { mode: "invalid", logicalPath: "x" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing businessRef", () => {
    const result = catalogSchema.safeParse({ ...validCatalog, businessRef: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = catalogSchema.safeParse({ ...validCatalog, extra: "x" });
    expect(result.success).toBe(false);
  });
});

const validCatalogEntry = {
  schema: "pbp/catalog-entry@1",
  id: "https://warpgogol.com/catalog/entries/foundation",
  type: "catalog-entry" as const,
  status: "published" as const,
  name: "Foundation Entry",
  catalogRef: { ref: "https://warpgogol.com/catalog/main" },
  itemRef: { ref: "https://warpgogol.com/products/foundation" },
};

describe("catalogEntrySchema", () => {
  it("parses a valid catalog-entry entity", () => {
    const result = catalogEntrySchema.safeParse(validCatalogEntry);
    expect(result.success).toBe(true);
  });

  it("rejects missing catalogRef", () => {
    const result = catalogEntrySchema.safeParse({ ...validCatalogEntry, catalogRef: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects missing itemRef", () => {
    const result = catalogEntrySchema.safeParse({ ...validCatalogEntry, itemRef: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional merchandising", () => {
    const result = catalogEntrySchema.safeParse({
      ...validCatalogEntry,
      merchandising: { featured: true, displayOrder: 1 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = catalogEntrySchema.safeParse({ ...validCatalogEntry, extra: "x" });
    expect(result.success).toBe(false);
  });
});
