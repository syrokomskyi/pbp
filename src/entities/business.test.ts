import { describe, it, expect } from "vitest";
import { BUSINESS_SCHEMA_ID } from "./business.js";

describe("BUSINESS_SCHEMA_ID", () => {
  it("equals pbp/business@1", () => {
    expect(BUSINESS_SCHEMA_ID).toBe("pbp/business@1");
  });
});
