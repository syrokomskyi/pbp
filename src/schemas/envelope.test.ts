/*
<MODULE_CONTRACT>
<purpose>
Unit tests for envelope covering pbpEntityStatusSchema; entityIdSchema; schemaIdSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the envelope suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  pbpEntitySchema,
  pbpEntityStatusSchema,
  entityIdSchema,
  schemaIdSchema,
} from "./envelope.ts";

describe("pbpEntityStatusSchema", () => {
  it("accepts all valid statuses", () => {
    for (const status of ["draft", "published", "suspended", "retired", "superseded"]) {
      expect(pbpEntityStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(pbpEntityStatusSchema.safeParse("active").success).toBe(false);
  });
});

describe("entityIdSchema", () => {
  it("accepts valid entity ID", () => {
    expect(entityIdSchema.safeParse("https://warpgogol.com/business").success).toBe(true);
  });

  it("rejects empty string", () => {
    expect(entityIdSchema.safeParse("").success).toBe(false);
  });

  it("rejects locale markers (ADR-025)", () => {
    expect(entityIdSchema.safeParse("https://example.com/de/business").success).toBe(false);
    expect(entityIdSchema.safeParse("https://example.com/uk/business").success).toBe(false);
    expect(entityIdSchema.safeParse("https://example.com/en/business").success).toBe(false);
  });

  it("accepts IDs without locale markers", () => {
    expect(entityIdSchema.safeParse("https://warpgogol.com/business").success).toBe(true);
    expect(entityIdSchema.safeParse("https://warpgogol.com/places/office").success).toBe(true);
  });
});

describe("schemaIdSchema", () => {
  it("accepts valid schema ID", () => {
    expect(schemaIdSchema.safeParse("pbp/business@1").success).toBe(true);
    expect(schemaIdSchema.safeParse("pbp/offering@2").success).toBe(true);
  });

  it("rejects schema ID without version", () => {
    expect(schemaIdSchema.safeParse("pbp/business").success).toBe(false);
  });

  it("rejects schema ID without pbp prefix", () => {
    expect(schemaIdSchema.safeParse("business@1").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(schemaIdSchema.safeParse("").success).toBe(false);
  });
});

describe("pbpEntitySchema", () => {
  it("parses a valid base entity", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "active",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid schema ID format", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "invalid",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional name and summary", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      name: "Warpgogol",
      summary: "Studio",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional governance", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      governance: { authorityRef: "https://warpgogol.com/business" },
    });
    expect(result.success).toBe(true);
  });

  it("RFC-1075 AC-6: accepts canonicalUri as optional string", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      canonicalUri: "https://example.example/.well-known/entity/business.json",
    });
    expect(result.success).toBe(true);
  });

  it("RFC-1075 AC-6: accepts entity without canonicalUri (optional)", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("RFC-1075 AC-7: rejects non-string canonicalUri (number)", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      canonicalUri: 123,
    });
    expect(result.success).toBe(false);
  });

  it("RFC-1075 AC-7: rejects non-string canonicalUri (boolean)", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      canonicalUri: true,
    });
    expect(result.success).toBe(false);
  });

  it("RFC-1075 AC-7: rejects non-string canonicalUri (object)", () => {
    const result = pbpEntitySchema.safeParse({
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      canonicalUri: { uri: "test" },
    });
    expect(result.success).toBe(false);
  });
});
