import { describe, it, expect } from "vitest";
import {
  isPbpCanonicalSerializationStep,
  PBP_CANONICAL_SERIALIZATION_STEPS,
} from "./publication.ts";

describe("isPbpCanonicalSerializationStep", () => {
  it("accepts all valid steps", () => {
    for (const step of PBP_CANONICAL_SERIALIZATION_STEPS) {
      expect(isPbpCanonicalSerializationStep(step)).toBe(true);
    }
  });

  it("rejects invalid step", () => {
    expect(isPbpCanonicalSerializationStep("invalid")).toBe(false);
  });
});
