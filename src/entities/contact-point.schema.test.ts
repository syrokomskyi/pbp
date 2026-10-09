import { describe, it, expect } from "vitest";
import { contactPointSchema } from "./contact-point.ts";

const validContactPoint = {
  schema: "pbp/contact-point@1",
  id: "https://warpgogol.com/contacts/email",
  type: "contact-point" as const,
  status: "published" as const,
  name: "Main Email",
  channel: "email" as const,
  value: "hello@warpgogol.com",
};

describe("contactPointSchema", () => {
  it("parses a valid contact-point entity", () => {
    const result = contactPointSchema.safeParse(validContactPoint);
    expect(result.success).toBe(true);
  });

  it("rejects invalid channel enum", () => {
    const result = contactPointSchema.safeParse({ ...validContactPoint, channel: "fax" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid channels", () => {
    for (const channel of ["email", "phone", "form", "chat", "postal"] as const) {
      const result = contactPointSchema.safeParse({ ...validContactPoint, channel });
      expect(result.success).toBe(true);
    }
  });

  it("accepts optional preferred flag", () => {
    const result = contactPointSchema.safeParse({ ...validContactPoint, preferred: true });
    expect(result.success).toBe(true);
  });

  it("rejects empty value", () => {
    const result = contactPointSchema.safeParse({ ...validContactPoint, value: "" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = contactPointSchema.safeParse({ ...validContactPoint, extra: "x" });
    expect(result.success).toBe(false);
  });
});
