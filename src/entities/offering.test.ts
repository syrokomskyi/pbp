import { describe, it, expect } from "vitest";
import {
  OFFERING_SCHEMA_ID,
  isPbpAvailabilityMode,
  isPbpOfferingRelation,
  isPbpOfferingAcquisition,
  PBP_AVAILABILITY_MODES,
  PBP_OFFERING_RELATIONS,
  PBP_OFFERING_ACQUISITIONS,
} from "./offering.ts";

describe("OFFERING_SCHEMA_ID", () => {
  it("equals pbp/offering@1", () => {
    expect(OFFERING_SCHEMA_ID).toBe("pbp/offering@1");
  });
});

describe("isPbpAvailabilityMode", () => {
  it("accepts all valid modes", () => {
    for (const mode of PBP_AVAILABILITY_MODES) {
      expect(isPbpAvailabilityMode(mode)).toBe(true);
    }
  });

  it("rejects invalid mode", () => {
    expect(isPbpAvailabilityMode("invalid")).toBe(false);
  });
});

describe("isPbpOfferingRelation", () => {
  it("accepts all valid relations", () => {
    for (const rel of PBP_OFFERING_RELATIONS) {
      expect(isPbpOfferingRelation(rel)).toBe(true);
    }
  });

  it("rejects invalid relation", () => {
    expect(isPbpOfferingRelation("invalid")).toBe(false);
  });
});

describe("isPbpOfferingAcquisition", () => {
  it("accepts all valid acquisitions", () => {
    for (const acq of PBP_OFFERING_ACQUISITIONS) {
      expect(isPbpOfferingAcquisition(acq)).toBe(true);
    }
  });

  it("rejects invalid acquisition", () => {
    expect(isPbpOfferingAcquisition("invalid")).toBe(false);
  });
});
