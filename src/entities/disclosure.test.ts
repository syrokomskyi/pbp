/*
<MODULE_CONTRACT>
<purpose>
Unit tests for disclosure covering DISCLOSURE_SCHEMA_ID; isPbpDisclosureKind. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the disclosure suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { DISCLOSURE_SCHEMA_ID, isPbpDisclosureKind, PBP_DISCLOSURE_KINDS } from "./disclosure.ts";

describe("DISCLOSURE_SCHEMA_ID", () => {
  it("equals pbp/disclosure@1", () => {
    expect(DISCLOSURE_SCHEMA_ID).toBe("pbp/disclosure@1");
  });
});

describe("isPbpDisclosureKind", () => {
  it("accepts all valid disclosure kinds", () => {
    for (const kind of PBP_DISCLOSURE_KINDS) {
      expect(isPbpDisclosureKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpDisclosureKind("invalid")).toBe(false);
  });
});
