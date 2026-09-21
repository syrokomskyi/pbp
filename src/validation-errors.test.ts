import { describe, it, expect } from "vitest";
import {
  isPbpValidationSeverity,
  isPbpErrorPrefix,
  PBP_VALIDATION_SEVERITIES,
  PBP_ERROR_PREFIXES,
} from "./validation-errors.js";

describe("isPbpValidationSeverity", () => {
  it("accepts all valid severities", () => {
    for (const sev of PBP_VALIDATION_SEVERITIES) {
      expect(isPbpValidationSeverity(sev)).toBe(true);
    }
  });

  it("rejects invalid severity", () => {
    expect(isPbpValidationSeverity("critical")).toBe(false);
  });
});

describe("isPbpErrorPrefix", () => {
  it("accepts all valid prefixes", () => {
    for (const prefix of PBP_ERROR_PREFIXES) {
      expect(isPbpErrorPrefix(prefix)).toBe(true);
    }
  });

  it("rejects invalid prefix", () => {
    expect(isPbpErrorPrefix("PBP-INVALID")).toBe(false);
  });
});
