import { describe, it, expect } from "vitest";
import {
  isPbpDerivationStatus,
  isPbpDerivationMode,
  PBP_DERIVATION_STATUSES,
  PBP_DERIVATION_MODES,
} from "./derivation.js";

describe("isPbpDerivationStatus", () => {
  it("accepts all valid statuses", () => {
    for (const status of PBP_DERIVATION_STATUSES) {
      expect(isPbpDerivationStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpDerivationStatus("invalid")).toBe(false);
  });
});

describe("isPbpDerivationMode", () => {
  it("accepts all valid modes", () => {
    for (const mode of PBP_DERIVATION_MODES) {
      expect(isPbpDerivationMode(mode)).toBe(true);
    }
  });

  it("rejects invalid mode", () => {
    expect(isPbpDerivationMode("invalid")).toBe(false);
  });
});
