import { describe, it, expect } from "vitest";
import { disclosureSchema } from "./disclosure.ts";

const validDisclosure = {
  schema: "pbp/disclosure@1",
  id: "https://warpgogol.com/disclosures/tech-dep",
  type: "disclosure" as const,
  status: "published" as const,
  kind: "technology-dependency" as const,
  name: "Technology Dependency",
  statement: "We depend on Cloudflare.",
  materiality: "informative" as const,
  publication: { required: true },
};

describe("disclosureSchema", () => {
  it("parses a valid disclosure entity", () => {
    const result = disclosureSchema.safeParse(validDisclosure);
    expect(result.success).toBe(true);
  });

  it("rejects invalid kind enum", () => {
    const result = disclosureSchema.safeParse({ ...validDisclosure, kind: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid materiality enum", () => {
    const result = disclosureSchema.safeParse({ ...validDisclosure, materiality: "low" });
    expect(result.success).toBe(false);
  });

  it("rejects missing publication.required", () => {
    const result = disclosureSchema.safeParse({ ...validDisclosure, publication: {} });
    expect(result.success).toBe(false);
  });

  it("accepts optional scope with offeringRefs", () => {
    const result = disclosureSchema.safeParse({
      ...validDisclosure,
      scope: { offeringRefs: { main: { ref: "https://warpgogol.com/offerings/foundation" } } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = disclosureSchema.safeParse({ ...validDisclosure, extra: "x" });
    expect(result.success).toBe(false);
  });
});
