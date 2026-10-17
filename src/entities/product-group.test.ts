/*
<MODULE_CONTRACT>
<purpose>
Unit tests for product group covering PRODUCT_GROUP_SCHEMA_ID. It also guards the documented public contract and regression-sensitive edge cases.
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
import { PRODUCT_GROUP_SCHEMA_ID } from "./product-group.ts";

describe("PRODUCT_GROUP_SCHEMA_ID", () => {
  it("equals pbp/product-group@1", () => {
    expect(PRODUCT_GROUP_SCHEMA_ID).toBe("pbp/product-group@1");
  });
});
