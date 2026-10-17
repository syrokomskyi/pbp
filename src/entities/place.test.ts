/*
<MODULE_CONTRACT>
<purpose>
Unit tests for place covering PLACE_SCHEMA_ID; isPbpPlaceKind. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the place suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { PLACE_SCHEMA_ID, isPbpPlaceKind, PBP_PLACE_KINDS } from "./place.ts";

describe("PLACE_SCHEMA_ID", () => {
  it("equals pbp/place@1", () => {
    expect(PLACE_SCHEMA_ID).toBe("pbp/place@1");
  });
});

describe("isPbpPlaceKind", () => {
  it("accepts all valid place kinds", () => {
    for (const kind of PBP_PLACE_KINDS) {
      expect(isPbpPlaceKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpPlaceKind("invalid")).toBe(false);
  });
});
