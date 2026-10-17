/*
<MODULE_CONTRACT>
<purpose>
Unit tests for schema id covering pbpSchemaId; validateSchemaId. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { PBP_NAMESPACE, PBP_MAJOR_VERSION, pbpSchemaId, validateSchemaId } from "./schema-id.ts";

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
