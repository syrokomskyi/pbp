/*
<MODULE_CONTRACT>
<purpose>
Unit tests for legal identity covering LEGAL_IDENTITY_SCHEMA_ID. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the legal suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { LEGAL_IDENTITY_SCHEMA_ID } from "./legal-identity.ts";

describe("LEGAL_IDENTITY_SCHEMA_ID", () => {
  it("equals pbp/legal-identity@1", () => {
    expect(LEGAL_IDENTITY_SCHEMA_ID).toBe("pbp/legal-identity@1");
  });
});
