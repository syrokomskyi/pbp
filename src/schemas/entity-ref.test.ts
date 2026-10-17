/*
<MODULE_CONTRACT>
<purpose>
Unit tests for entity ref covering pbpEntityRefSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the entity suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
