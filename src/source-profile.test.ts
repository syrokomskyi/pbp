import { describe, it, expect } from "vitest";
import {
  isPbpSourceAdapterType,
  PBP_SOURCE_ADAPTER_TYPES,
} from "./source-profile.js";

describe("isPbpSourceAdapterType", () => {
  it("accepts all valid adapter types", () => {
    for (const type of PBP_SOURCE_ADAPTER_TYPES) {
      expect(isPbpSourceAdapterType(type)).toBe(true);
    }
  });

  it("rejects invalid type", () => {
    expect(isPbpSourceAdapterType("invalid")).toBe(false);
  });
});
