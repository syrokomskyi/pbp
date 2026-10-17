/*
<MODULE_CONTRACT>
<purpose>
Unit tests for consent covering CONSENT_SCHEMA_ID; isPbpConsentMethod; isPbpConsentScopeStatus. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the consent suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  CONSENT_SCHEMA_ID,
  isPbpConsentMethod,
  isPbpConsentScopeStatus,
  PBP_CONSENT_METHODS,
  PBP_CONSENT_SCOPE_STATUSES,
} from "./consent.ts";

describe("CONSENT_SCHEMA_ID", () => {
  it("equals pbp/consent@1", () => {
    expect(CONSENT_SCHEMA_ID).toBe("pbp/consent@1");
  });
});

describe("isPbpConsentMethod", () => {
  it("accepts all valid methods", () => {
    for (const method of PBP_CONSENT_METHODS) {
      expect(isPbpConsentMethod(method)).toBe(true);
    }
  });

  it("rejects invalid method", () => {
    expect(isPbpConsentMethod("invalid")).toBe(false);
  });
});

describe("isPbpConsentScopeStatus", () => {
  it("accepts all valid scope statuses", () => {
    for (const status of PBP_CONSENT_SCOPE_STATUSES) {
      expect(isPbpConsentScopeStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpConsentScopeStatus("invalid")).toBe(false);
  });
});
