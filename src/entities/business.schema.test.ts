import { describe, it, expect } from "vitest";
import { businessSchema } from "./business.ts";

const validBusiness = {
  schema: "pbp/business@1",
  id: "https://warpgogol.com/business",
  type: "business" as const,
  status: "published" as const,
  name: "Warpgogol",
  summary: "Software development studio",
};

describe("businessSchema", () => {
  it("parses a valid business entity", () => {
    const result = businessSchema.safeParse(validBusiness);
    expect(result.success).toBe(true);
  });

  it("rejects wrong type literal", () => {
    const result = businessSchema.safeParse({ ...validBusiness, type: "brand" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = businessSchema.safeParse({ ...validBusiness, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects HTML in name", () => {
    const result = businessSchema.safeParse({ ...validBusiness, name: "<b>Warpgogol</b>" });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = businessSchema.safeParse({
      ...validBusiness,
      description: "A studio",
      yearEstablished: 2020,
      mission: "Build great software",
      businessModel: { typeRef: "studio" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = businessSchema.safeParse({ ...validBusiness, unknownField: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects locale markers in ID (ADR-025)", () => {
    const result = businessSchema.safeParse({
      ...validBusiness,
      id: "https://example.com/de/business",
    });
    expect(result.success).toBe(false);
  });
});
