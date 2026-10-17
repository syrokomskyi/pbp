/*
<MODULE_CONTRACT>
<purpose>
Unit tests for derivation covering isPbpDerivationStatus; isPbpDerivationMode. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the derivation suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  isPbpDerivationStatus,
  isPbpDerivationMode,
  PBP_DERIVATION_STATUSES,
  PBP_DERIVATION_MODES,
} from "./derivation.ts";

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
