import { describe, it, expect } from "vitest";
import { pbpSchemaById, pbpEntityDiscriminatedUnion } from "./index.js";

describe("pbpSchemaById registry", () => {
  it("contains schema for business", () => {
    expect(pbpSchemaById["pbp/business@1"]).toBeDefined();
  });

  it("contains schema for offering", () => {
    expect(pbpSchemaById["pbp/offering@1"]).toBeDefined();
  });

  it("contains schema for all registered entity types", () => {
    const expectedKeys = [
      "pbp/business@1",
      "pbp/legal-identity@1",
      "pbp/brand@1",
      "pbp/place@1",
      "pbp/contact-point@1",
      "pbp/web-presence@1",
      "pbp/category@1",
      "pbp/product@1",
      "pbp/product-group@1",
      "pbp/product-variant@1",
      "pbp/catalog@1",
      "pbp/catalog-entry@1",
      "pbp/offering@1",
      "pbp/policy@1",
      "pbp/sla-policy@1",
      "pbp/guarantee-policy@1",
      "pbp/ownership-policy@1",
      "pbp/exit-policy@1",
      "pbp/data-retention-policy@1",
      "pbp/claim@1",
      "pbp/evidence-source@1",
      "pbp/disclosure@1",
      "pbp/consent@1",
      "pbp/client-testimonial@1",
      "pbp/public-document@1",
      "pbp/currency-pricing-policy@1",
      "pbp/rate-policy@1",
      "pbp/rate-schedule@1",
      "pbp/rate-snapshot@1",
      "pbp/rate-source@1",
    ];
    for (const key of expectedKeys) {
      expect(pbpSchemaById[key]).toBeDefined();
    }
  });
});

describe("pbpEntityDiscriminatedUnion", () => {
  it("is defined as a ZodType", () => {
    expect(pbpEntityDiscriminatedUnion).toBeDefined();
  });

  it("throws on parse because schemas lack literal schema discriminator", () => {
    expect(() =>
      pbpEntityDiscriminatedUnion.safeParse({
        schema: "pbp/business@1",
        id: "https://warpgogol.com/business",
        type: "business",
        status: "published",
        name: "Warpgogol",
      }),
    ).toThrow();
  });
});
