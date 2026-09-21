import { describe, it, expect } from "vitest";
import { legalIdentitySchema } from "./legal-identity.js";

const validLegalIdentity = {
  schema: "pbp/legal-identity@1",
  id: "https://warpgogol.com/legal-identity/main",
  type: "legal-identity" as const,
  status: "published" as const,
  legalName: "Warpgogol GmbH",
};

describe("legalIdentitySchema", () => {
  it("parses a valid legal-identity entity", () => {
    const result = legalIdentitySchema.safeParse(validLegalIdentity);
    expect(result.success).toBe(true);
  });

  it("rejects missing legalName", () => {
    const result = legalIdentitySchema.safeParse({ ...validLegalIdentity, legalName: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional legalForm and registeredPlaceRef", () => {
    const result = legalIdentitySchema.safeParse({
      ...validLegalIdentity,
      legalForm: { valueRef: "gmbh" },
      registeredPlaceRef: { ref: "https://warpgogol.com/places/office" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts publicIdentifiers with semantic status", () => {
    const result = legalIdentitySchema.safeParse({
      ...validLegalIdentity,
      publicIdentifiers: {
        hrb: { status: "declared", value: "HRB 123456" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid semantic status in publicIdentifiers", () => {
    const result = legalIdentitySchema.safeParse({
      ...validLegalIdentity,
      publicIdentifiers: {
        hrb: { status: "invalid-status", value: "HRB 123456" },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = legalIdentitySchema.safeParse({ ...validLegalIdentity, extra: "x" });
    expect(result.success).toBe(false);
  });
});
