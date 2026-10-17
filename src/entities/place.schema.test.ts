/*
<MODULE_CONTRACT>
<purpose>
Unit tests for place.schema covering placeSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the place.schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { placeSchema } from "./place.ts";

const validPlace = {
  schema: "pbp/place@1",
  id: "https://warpgogol.com/places/office",
  type: "place" as const,
  status: "published" as const,
  name: "Office",
  kind: "locality" as const,
};

describe("placeSchema", () => {
  it("parses a valid place entity", () => {
    const result = placeSchema.safeParse(validPlace);
    expect(result.success).toBe(true);
  });

  it("rejects invalid kind enum", () => {
    const result = placeSchema.safeParse({ ...validPlace, kind: "city" });
    expect(result.success).toBe(false);
  });

  it("accepts address with countryCode", () => {
    const result = placeSchema.safeParse({
      ...validPlace,
      address: { countryCode: "DE", locality: "Berlin" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects address without countryCode", () => {
    const result = placeSchema.safeParse({
      ...validPlace,
      address: { locality: "Berlin" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts geo with semantic status", () => {
    const result = placeSchema.safeParse({
      ...validPlace,
      geo: { status: "declared", latitude: 52.5, longitude: 13.4 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict)", () => {
    const result = placeSchema.safeParse({ ...validPlace, extra: "x" });
    expect(result.success).toBe(false);
  });
});
