/*
<MODULE_CONTRACT>
<purpose>
Unit tests for business covering BUSINESS_SCHEMA_ID. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the business suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { BUSINESS_SCHEMA_ID } from "./business.ts";

describe("BUSINESS_SCHEMA_ID", () => {
  it("equals pbp/business@1", () => {
    expect(BUSINESS_SCHEMA_ID).toBe("pbp/business@1");
  });
});
