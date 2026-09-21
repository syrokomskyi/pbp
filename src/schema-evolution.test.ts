import { describe, it, expect } from "vitest";
import {
  validateSchemaCompatibility,
  type PbpSchemaDefinition,
} from "./schema-evolution.js";

describe("validateSchemaCompatibility", () => {
  it("returns ok when schemas are identical", () => {
    const def: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: true }],
    };
    const result = validateSchemaCompatibility(def, def);
    expect(result.ok).toBe(true);
  });

  it("detects key-rename (removed field)", () => {
    const before: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: true }],
    };
    const after: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "b", type: "string", required: true }],
    };
    const result = validateSchemaCompatibility(before, after);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]?.kind).toBe("key-rename");
    }
  });

  it("detects type-change", () => {
    const before: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: true }],
    };
    const after: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "number", required: true }],
    };
    const result = validateSchemaCompatibility(before, after);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations[0]?.kind).toBe("type-change");
    }
  });

  it("detects optional-to-required", () => {
    const before: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: false }],
    };
    const after: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: true }],
    };
    const result = validateSchemaCompatibility(before, after);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations[0]?.kind).toBe("optional-to-required");
    }
  });

  it("does not flag required-to-optional", () => {
    const before: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: true }],
    };
    const after: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [{ name: "a", type: "string", required: false }],
    };
    const result = validateSchemaCompatibility(before, after);
    expect(result.ok).toBe(true);
  });

  it("detects multiple violations", () => {
    const before: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [
        { name: "a", type: "string", required: true },
        { name: "b", type: "string", required: false },
      ],
    };
    const after: PbpSchemaDefinition = {
      schemaId: "pbp/test@1",
      fields: [
        { name: "a", type: "number", required: true },
        { name: "b", type: "string", required: true },
      ],
    };
    const result = validateSchemaCompatibility(before, after);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toHaveLength(2);
    }
  });
});
