import { describe, it, expect } from "vitest";
import { PBP_NAMESPACE, PBP_MAJOR_VERSION, pbpSchemaId, validateSchemaId } from "./schema-id.js";

describe("pbpSchemaId", () => {
  it("constructs schema ID from entity name", () => {
    expect(pbpSchemaId("business")).toBe("pbp/business@1");
    expect(pbpSchemaId("offering")).toBe("pbp/offering@1");
  });

  it("uses PBP_NAMESPACE and PBP_MAJOR_VERSION constants", () => {
    expect(PBP_NAMESPACE).toBe("pbp");
    expect(PBP_MAJOR_VERSION).toBe(1);
  });
});

describe("validateSchemaId", () => {
  it("parses valid schema ID", () => {
    const result = validateSchemaId("pbp/business@1");
    expect(result).toEqual({ entity: "business", major: 1 });
  });

  it("parses schema ID with hyphenated entity name", () => {
    const result = validateSchemaId("pbp/legal-identity@1");
    expect(result).toEqual({ entity: "legal-identity", major: 1 });
  });

  it("throws on missing version", () => {
    expect(() => validateSchemaId("pbp/business")).toThrow();
  });

  it("throws on missing namespace", () => {
    expect(() => validateSchemaId("business@1")).toThrow();
  });

  it("throws on uppercase entity name", () => {
    expect(() => validateSchemaId("pbp/Business@1")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => validateSchemaId("")).toThrow();
  });
});
