import { describe, it, expect } from "vitest";
import { pbpEntityRefSchema } from "./entity-ref.ts";

describe("pbpEntityRefSchema", () => {
  it("parses a valid entity ref with ref only", () => {
    const result = pbpEntityRefSchema.safeParse({ ref: "https://warpgogol.com/business" });
    expect(result.success).toBe(true);
  });

  it("parses a valid entity ref with expectedType", () => {
    const result = pbpEntityRefSchema.safeParse({
      ref: "https://warpgogol.com/business",
      expectedType: "business",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing ref", () => {
    const result = pbpEntityRefSchema.safeParse({ expectedType: "business" });
    expect(result.success).toBe(false);
  });

  it("rejects empty ref", () => {
    const result = pbpEntityRefSchema.safeParse({ ref: "" });
    expect(result.success).toBe(false);
  });

  it("rejects HTML in ref", () => {
    const result = pbpEntityRefSchema.safeParse({ ref: "<script>alert(1)</script>" });
    expect(result.success).toBe(false);
  });
});
