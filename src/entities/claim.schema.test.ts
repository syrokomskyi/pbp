import { describe, it, expect } from "vitest";
import { claimSchema } from "./claim.ts";

const validClaim = {
  schema: "pbp/claim@1",
  id: "https://warpgogol.com/claims/uptime",
  type: "claim" as const,
  status: "published" as const,
  claimClass: "factual" as const,
  claimKind: "fact" as const,
  subject: { kind: "metric", name: "Uptime" },
  statement: "We maintain 99.9% uptime.",
  governance: { authorityRef: "https://warpgogol.com/business" },
};

describe("claimSchema", () => {
  it("parses a valid claim entity", () => {
    const result = claimSchema.safeParse(validClaim);
    expect(result.success).toBe(true);
  });

  it("rejects invalid claimClass enum", () => {
    const result = claimSchema.safeParse({ ...validClaim, claimClass: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid claimKind enum", () => {
    const result = claimSchema.safeParse({ ...validClaim, claimKind: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing governance", () => {
    const result = claimSchema.safeParse({ ...validClaim, governance: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional verificationLevel", () => {
    const result = claimSchema.safeParse({ ...validClaim, verificationLevel: "N2" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid verificationLevel", () => {
    const result = claimSchema.safeParse({ ...validClaim, verificationLevel: "N5" });
    expect(result.success).toBe(false);
  });

  it("accepts optional publication settings", () => {
    const result = claimSchema.safeParse({
      ...validClaim,
      publication: {
        staleBehavior: "warn",
        showAsOfDate: true,
        showEvidenceLabel: true,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = claimSchema.safeParse({ ...validClaim, extra: "x" });
    expect(result.success).toBe(false);
  });
});
