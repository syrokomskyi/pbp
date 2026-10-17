/*
<MODULE_CONTRACT>
<purpose>
Unit tests for validate covering validateRaw. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the validate suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { validateRaw } from "./validate.ts";
import type { ParsedEntity } from "./parse.ts";

function makeParsed(
  entityId: string,
  schema: string,
  data: Record<string, unknown>,
  locale = "de",
): ParsedEntity {
  return { data, body: "", physicalPath: `/test/${entityId}.md`, locale, entityId, schema };
}

const validBusinessData = {
  schema: "pbp/business@1",
  id: "https://warpgogol.com/business",
  type: "business",
  status: "published",
  name: "Test Business",
  summary: "A test business",
};

describe("validateRaw", () => {
  it("validates entities against registered Zod schemas", async () => {
    const parsed = [makeParsed("biz-1", "pbp/business@1", validBusinessData)];

    const { entities, errors } = await validateRaw(parsed, "production");

    expect(errors).toHaveLength(0);
    expect(entities).toHaveLength(1);
    expect(entities[0]?.id).toBe("https://warpgogol.com/business");
    expect(entities[0]?.locale).toBe("de");
  });

  it("reports PBP-SCHEMA-UNKNOWN for unregistered schema IDs", async () => {
    const parsed = [makeParsed("biz-1", "nonexistent-schema", { id: "biz-1" })];

    const { entities, errors } = await validateRaw(parsed, "production");

    expect(entities).toHaveLength(0);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe("PBP-SCHEMA-UNKNOWN");
    expect(errors[0]?.severity).toBe("fatal");
  });

  it("reports PBP-SCHEMA-VALIDATION for invalid entity data", async () => {
    const parsed = [
      makeParsed("biz-1", "pbp/business@1", {
        ...validBusinessData,
        status: "not-a-valid-status",
      }),
    ];

    const { entities, errors } = await validateRaw(parsed, "production");

    expect(entities).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.code === "PBP-SCHEMA-VALIDATION")).toBe(true);
  });

  it("includes entities even on validation failure in migration mode", async () => {
    const parsed = [
      makeParsed("biz-1", "pbp/business@1", {
        ...validBusinessData,
        status: "not-a-valid-status",
      }),
    ];

    const { entities, errors } = await validateRaw(parsed, "migration");

    expect(errors.length).toBeGreaterThan(0);
    expect(entities).toHaveLength(1);
    expect(entities[0]?.locale).toBe("de");
  });

  it("sets locale on validated entities", async () => {
    const parsed = [makeParsed("biz-1", "pbp/business@1", validBusinessData, "uk")];

    const { entities } = await validateRaw(parsed, "production");
    expect(entities[0]?.locale).toBe("uk");
  });
});
