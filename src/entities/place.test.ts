import { describe, it, expect } from "vitest";
import { PLACE_SCHEMA_ID, isPbpPlaceKind, PBP_PLACE_KINDS } from "./place.js";

describe("PLACE_SCHEMA_ID", () => {
  it("equals pbp/place@1", () => {
    expect(PLACE_SCHEMA_ID).toBe("pbp/place@1");
  });
});

describe("isPbpPlaceKind", () => {
  it("accepts all valid place kinds", () => {
    for (const kind of PBP_PLACE_KINDS) {
      expect(isPbpPlaceKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpPlaceKind("invalid")).toBe(false);
  });
});
