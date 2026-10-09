import { describe, it, expect } from "vitest";
import { CATEGORY_SCHEMA_ID } from "./category.ts";

describe("CATEGORY_SCHEMA_ID", () => {
  it("equals pbp/category@1", () => {
    expect(CATEGORY_SCHEMA_ID).toBe("pbp/category@1");
  });
});
