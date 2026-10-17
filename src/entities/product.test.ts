/*
<MODULE_CONTRACT>
<purpose>
Unit tests for product covering PRODUCT_SCHEMA_ID; isPbpProductKind. It also guards the documented public contract and regression-sensitive edge cases.
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
import { PRODUCT_SCHEMA_ID, isPbpProductKind, PBP_PRODUCT_KINDS } from "./product.ts";

describe("PRODUCT_SCHEMA_ID", () => {
  it("equals pbp/product@1", () => {
    expect(PRODUCT_SCHEMA_ID).toBe("pbp/product@1");
  });
});

describe("isPbpProductKind", () => {
  it("accepts all valid product kinds", () => {
    for (const kind of PBP_PRODUCT_KINDS) {
      expect(isPbpProductKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpProductKind("invalid")).toBe(false);
  });
});
