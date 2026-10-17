/*
<MODULE_CONTRACT>
<purpose>
Unit tests for brand covering BRAND_SCHEMA_ID. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the brand suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { BRAND_SCHEMA_ID } from "./brand.ts";

describe("BRAND_SCHEMA_ID", () => {
  it("equals pbp/brand@1", () => {
    expect(BRAND_SCHEMA_ID).toBe("pbp/brand@1");
  });
});
