import { describe, it, expect } from "vitest";
import { partnerProgramPolicySchema } from "./partner-program-policy.ts";

const validPartnerProgramPolicy = {
  schema: "pbp/partner-program-policy@1",
  id: "https://warpgogol.com/policies/partner-program",
  type: "policy" as const,
  status: "published" as const,
  kind: "partner-program" as const,
  name: "Partner Program Policy",
  trustedPartners: {
    maxActive: 12,
    exclusivity: "no-direct-competitor-same-niche" as const,
  },
  referral: {
    reward: { type: "subscription-credit" as const, periods: "P1M" },
    qualifyingPeriod: "P60D",
    attributionWindow: "P30D",
    contactResponse: "PT24H",
  },
  referredCustomerBenefit: { freePeriod: "P1M", priorityStart: true },
};

describe("partnerProgramPolicySchema (RFC-1155)", () => {
  it("parses a valid partner-program policy entity", () => {
    const result = partnerProgramPolicySchema.safeParse(validPartnerProgramPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      kind: "renewal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      extra: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive maxActive", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      trustedPartners: { maxActive: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed qualifyingPeriod", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      referral: { qualifyingPeriod: "60d" },
    });
    expect(result.success).toBe(false);
  });

  it("parses a valid capacity block (RFC-1258)", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      capacity: { month: "2026-11", free: 2, total: 4, updatedAt: "2026-10-11" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects capacity with bad month format", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      capacity: { month: "2026-11-01", free: 2, total: 4, updatedAt: "2026-10-11" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects capacity with negative free", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      capacity: { month: "2026-11", free: -1, total: 4, updatedAt: "2026-10-11" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects capacity with non-positive total", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      capacity: { month: "2026-11", free: 2, total: 0, updatedAt: "2026-10-11" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects capacity with bad updatedAt format", () => {
    const result = partnerProgramPolicySchema.safeParse({
      ...validPartnerProgramPolicy,
      capacity: { month: "2026-11", free: 2, total: 4, updatedAt: "10/2026" },
    });
    expect(result.success).toBe(false);
  });
});
