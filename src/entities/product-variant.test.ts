import { describe, it, expect } from "vitest";
import { PRODUCT_VARIANT_SCHEMA_ID } from "./product-variant.ts";

describe("PRODUCT_VARIANT_SCHEMA_ID", () => {
  it("equals pbp/product-variant@1", () => {
    expect(PRODUCT_VARIANT_SCHEMA_ID).toBe("pbp/product-variant@1");
  });
});
