import { describe, it, expect } from "vitest";
import { pbpRateSourceSchema } from "./rate-source.ts";

const validRateSource = {
  schema: "pbp/rate-source@1",
  id: "https://warpgogol.com/rate-sources/ecb",
  type: "rate-source" as const,
  status: "published" as const,
  name: "ECB Rates",
  adapter: "ecb-xml",
  config: { url: "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml" },
};

describe("pbpRateSourceSchema", () => {
  it("parses a valid rate-source entity", () => {
    const result = pbpRateSourceSchema.safeParse(validRateSource);
    expect(result.success).toBe(true);
  });

  it("rejects missing adapter", () => {
    const result = pbpRateSourceSchema.safeParse({ ...validRateSource, adapter: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects missing config", () => {
    const result = pbpRateSourceSchema.safeParse({ ...validRateSource, config: undefined });
    expect(result.success).toBe(false);
  });

  it("accepts empty config record", () => {
    const result = pbpRateSourceSchema.safeParse({ ...validRateSource, config: {} });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = pbpRateSourceSchema.safeParse({ ...validRateSource, extra: "x" });
    expect(result.success).toBe(false);
  });
});
