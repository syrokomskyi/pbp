/*
<MODULE_CONTRACT>
<purpose>
Unit tests for catalog covering CATALOG_SCHEMA_ID; CATALOG_ENTRY_SCHEMA_ID. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the catalog suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
