import { describe, it, expect } from "vitest";
import {
  isPbpTaxTreatment,
  PBP_TAX_TREATMENTS,
} from "./tax.js";

describe("isPbpTaxTreatment", () => {
  it("accepts all valid tax treatments", () => {
    for (const treatment of PBP_TAX_TREATMENTS) {
      expect(isPbpTaxTreatment(treatment)).toBe(true);
    }
  });

  it("rejects invalid treatment", () => {
    expect(isPbpTaxTreatment("invalid")).toBe(false);
  });
});
