/*
<MODULE_CONTRACT>
<purpose>
Unit tests for claim covering CLAIM_SCHEMA_ID; PBP_CLAIM_CLASSES; PBP_CLAIM_KINDS. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the claim suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  CLAIM_SCHEMA_ID,
  PBP_CLAIM_CLASSES,
  PBP_CLAIM_KINDS,
  PBP_VERIFICATION_LEVELS,
} from "./claim.ts";

describe("CLAIM_SCHEMA_ID", () => {
  it("equals pbp/claim@1", () => {
    expect(CLAIM_SCHEMA_ID).toBe("pbp/claim@1");
  });
});

describe("PBP_CLAIM_CLASSES", () => {
  it("contains all expected claim classes", () => {
    expect(PBP_CLAIM_CLASSES).toContain("comparative-commercial");
    expect(PBP_CLAIM_CLASSES).toContain("factual");
    expect(PBP_CLAIM_CLASSES).toContain("benefit");
    expect(PBP_CLAIM_CLASSES).toContain("limitation");
  });
});

describe("PBP_CLAIM_KINDS", () => {
  it("contains all expected claim kinds", () => {
    expect(PBP_CLAIM_KINDS).toContain("risk");
    expect(PBP_CLAIM_KINDS).toContain("benefit");
    expect(PBP_CLAIM_KINDS).toContain("comparison");
    expect(PBP_CLAIM_KINDS).toContain("fact");
  });
});

describe("PBP_VERIFICATION_LEVELS", () => {
  it("contains N0 through N3", () => {
    expect(PBP_VERIFICATION_LEVELS).toContain("N0");
    expect(PBP_VERIFICATION_LEVELS).toContain("N1");
    expect(PBP_VERIFICATION_LEVELS).toContain("N2");
    expect(PBP_VERIFICATION_LEVELS).toContain("N3");
  });
});
