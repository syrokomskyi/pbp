import { describe, it, expect } from "vitest";
import { PRODUCT_GROUP_SCHEMA_ID } from "./product-group.ts";

describe("PRODUCT_GROUP_SCHEMA_ID", () => {
  it("equals pbp/product-group@1", () => {
    expect(PRODUCT_GROUP_SCHEMA_ID).toBe("pbp/product-group@1");
  });
});
