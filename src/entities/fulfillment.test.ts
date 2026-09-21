import { describe, it, expect } from "vitest";
import {
  isPbpFulfillmentMode,
  PBP_FULFILLMENT_MODES,
} from "./fulfillment.js";

describe("isPbpFulfillmentMode", () => {
  it("accepts all valid fulfillment modes", () => {
    for (const mode of PBP_FULFILLMENT_MODES) {
      expect(isPbpFulfillmentMode(mode)).toBe(true);
    }
  });

  it("rejects invalid mode", () => {
    expect(isPbpFulfillmentMode("invalid")).toBe(false);
  });
});
