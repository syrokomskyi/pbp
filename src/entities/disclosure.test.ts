import { describe, it, expect } from "vitest";
import { DISCLOSURE_SCHEMA_ID, isPbpDisclosureKind, PBP_DISCLOSURE_KINDS } from "./disclosure.js";

describe("DISCLOSURE_SCHEMA_ID", () => {
  it("equals pbp/disclosure@1", () => {
    expect(DISCLOSURE_SCHEMA_ID).toBe("pbp/disclosure@1");
  });
});

describe("isPbpDisclosureKind", () => {
  it("accepts all valid disclosure kinds", () => {
    for (const kind of PBP_DISCLOSURE_KINDS) {
      expect(isPbpDisclosureKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpDisclosureKind("invalid")).toBe(false);
  });
});
