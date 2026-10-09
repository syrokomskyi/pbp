import { describe, it, expect } from "vitest";
import { CATALOG_SCHEMA_ID, CATALOG_ENTRY_SCHEMA_ID } from "./catalog.ts";

describe("CATALOG_SCHEMA_ID", () => {
  it("equals pbp/catalog@1", () => {
    expect(CATALOG_SCHEMA_ID).toBe("pbp/catalog@1");
  });
});

describe("CATALOG_ENTRY_SCHEMA_ID", () => {
  it("equals pbp/catalog-entry@1", () => {
    expect(CATALOG_ENTRY_SCHEMA_ID).toBe("pbp/catalog-entry@1");
  });
});
