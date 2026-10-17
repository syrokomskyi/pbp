/*
<MODULE_CONTRACT>
<purpose>
Unit tests for offering covering OFFERING_SCHEMA_ID; isPbpAvailabilityMode; isPbpOfferingRelation. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the offering suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
