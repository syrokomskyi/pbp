/*
<MODULE_CONTRACT>
<purpose>
Unit tests for credential covering CREDENTIAL_SCHEMA_ID; isPbpCredentialKind. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the credential suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { CREDENTIAL_SCHEMA_ID, isPbpCredentialKind, PBP_CREDENTIAL_KINDS } from "./credential.ts";

describe("CREDENTIAL_SCHEMA_ID", () => {
  it("equals pbp/credential@1", () => {
    expect(CREDENTIAL_SCHEMA_ID).toBe("pbp/credential@1");
  });
});

describe("isPbpCredentialKind", () => {
  it("accepts all valid credential kinds", () => {
    for (const kind of PBP_CREDENTIAL_KINDS) {
      expect(isPbpCredentialKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpCredentialKind("invalid")).toBe(false);
  });
});
