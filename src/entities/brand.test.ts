import { describe, it, expect } from "vitest";
import { BRAND_SCHEMA_ID } from "./brand.js";

describe("BRAND_SCHEMA_ID", () => {
  it("equals pbp/brand@1", () => {
    expect(BRAND_SCHEMA_ID).toBe("pbp/brand@1");
  });
});
