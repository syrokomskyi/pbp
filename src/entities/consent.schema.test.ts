/*
<MODULE_CONTRACT>
<purpose>
Unit tests for consent.schema covering consentSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the consent.schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { consentSchema } from "./consent.ts";

const validConsent = {
  schema: "pbp/consent@1",
  id: "https://warpgogol.com/consent/main",
  type: "consent" as const,
  status: "published" as const,
  name: "Main Consent",
  textVersion: "v1.0",
  purposes: ["marketing"],
  channels: ["email"],
  dataElements: ["name"],
  evidenceRef: "https://warpgogol.com/evidence/consent-1",
  consentScope: {
    document: {
      status: "granted" as const,
      grantedAt: "2026-01-01",
      method: "verified_business_email" as const,
    },
    screenshot: { status: "not_requested" as const, grantedAt: null, method: "none" as const },
    websiteLink: { status: "not_requested" as const, grantedAt: null, method: "none" as const },
  },
};

describe("consentSchema", () => {
  it("parses a valid consent entity", () => {
    const result = consentSchema.safeParse(validConsent);
    expect(result.success).toBe(true);
  });

  it("rejects missing consentScope", () => {
    const result = consentSchema.safeParse({ ...validConsent, consentScope: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects granted status with null grantedAt (refine rule)", () => {
    const result = consentSchema.safeParse({
      ...validConsent,
      consentScope: {
        ...validConsent.consentScope,
        document: { status: "granted", grantedAt: null, method: "verified_business_email" },
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts denied status with null grantedAt", () => {
    const result = consentSchema.safeParse({
      ...validConsent,
      consentScope: {
        ...validConsent.consentScope,
        document: { status: "denied", grantedAt: null, method: "verified_business_email" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid consent method", () => {
    const result = consentSchema.safeParse({
      ...validConsent,
      consentScope: {
        ...validConsent.consentScope,
        document: { status: "granted", grantedAt: "2026-01-01", method: "invalid" },
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty purposes array (no min constraint)", () => {
    const result = consentSchema.safeParse({ ...validConsent, purposes: [] });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = consentSchema.safeParse({ ...validConsent, extra: "x" });
    expect(result.success).toBe(false);
  });
});
