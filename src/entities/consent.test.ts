import { describe, it, expect } from "vitest";
import {
  CONSENT_SCHEMA_ID,
  isPbpConsentMethod,
  isPbpConsentScopeStatus,
  PBP_CONSENT_METHODS,
  PBP_CONSENT_SCOPE_STATUSES,
} from "./consent.js";

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
