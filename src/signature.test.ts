import { describe, it, expect } from "vitest";
import {
  isPbpSignatureAlgorithm,
  PBP_SIGNATURE_ALGORITHMS,
} from "./signature.js";

describe("isPbpSignatureAlgorithm", () => {
  it("accepts all valid algorithms", () => {
    for (const alg of PBP_SIGNATURE_ALGORITHMS) {
      expect(isPbpSignatureAlgorithm(alg)).toBe(true);
    }
  });

  it("rejects invalid algorithm", () => {
    expect(isPbpSignatureAlgorithm("invalid")).toBe(false);
  });
});
