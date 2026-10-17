/*
<MODULE_CONTRACT>
<purpose>
Unit tests for source profile covering isPbpSourceAdapterType. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the source suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpSourceAdapterType, PBP_SOURCE_ADAPTER_TYPES } from "./source-profile.ts";

describe("isPbpSourceAdapterType", () => {
  it("accepts all valid adapter types", () => {
    for (const type of PBP_SOURCE_ADAPTER_TYPES) {
      expect(isPbpSourceAdapterType(type)).toBe(true);
    }
  });

  it("rejects invalid type", () => {
    expect(isPbpSourceAdapterType("invalid")).toBe(false);
  });
});
