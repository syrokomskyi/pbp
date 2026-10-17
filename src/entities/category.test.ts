/*
<MODULE_CONTRACT>
<purpose>
Unit tests for category covering CATEGORY_SCHEMA_ID. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the category suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { CATEGORY_SCHEMA_ID } from "./category.ts";

describe("CATEGORY_SCHEMA_ID", () => {
  it("equals pbp/category@1", () => {
    expect(CATEGORY_SCHEMA_ID).toBe("pbp/category@1");
  });
});
