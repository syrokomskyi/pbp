import { describe, it, expect } from "vitest";
import { offeringSchema } from "./offering.ts";

const validOffering = {
  schema: "pbp/offering@1",
  id: "https://warpgogol.com/offerings/foundation",
  type: "offering" as const,
  status: "published" as const,
  name: "Foundation Package",
  businessRef: { ref: "https://warpgogol.com/business" },
};

describe("offeringSchema", () => {
  it("parses a valid offering entity", () => {
    const result = offeringSchema.safeParse(validOffering);
    expect(result.success).toBe(true);
  });

  it("rejects missing businessRef", () => {
    const result = offeringSchema.safeParse({ ...validOffering, businessRef: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts optional pricing with fixed charge", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      pricing: {
        currency: "EUR",
        charges: {
          monthly: {
            type: "recurring",
            purpose: "Monthly subscription",
            amount: { model: "fixed", value: "70.00" },
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects pricing charge without purpose", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      pricing: {
        currency: "EUR",
        charges: {
          monthly: {
            type: "recurring",
            amount: { model: "fixed", value: "70.00" },
          },
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional availability with mode", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      availability: { mode: "declared" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid availability mode", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      availability: { mode: "sometimes" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional guarantees", () => {
    const result = offeringSchema.safeParse({
      ...validOffering,
      guarantees: {
        uptime: { label: "Uptime", detail: "99.9% guaranteed" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = offeringSchema.safeParse({ ...validOffering, extra: "x" });
    expect(result.success).toBe(false);
  });
});
