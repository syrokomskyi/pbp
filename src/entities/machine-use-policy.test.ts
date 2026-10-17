/*
<MODULE_CONTRACT>
<purpose>
Unit tests for machine use policy covering MACHINE_USE_POLICY_SCHEMA_ID; isPbpMachineUsePermission; isPbpMachineUseVerdict.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the machine suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  MACHINE_USE_POLICY_SCHEMA_ID,
  isPbpMachineUsePermission,
  isPbpMachineUseVerdict,
  PBP_MACHINE_USE_PERMISSIONS,
  PBP_MACHINE_USE_VERDICTS,
} from "./machine-use-policy.ts";

describe("MACHINE_USE_POLICY_SCHEMA_ID", () => {
  it("equals pbp/machine-use-policy@1", () => {
    expect(MACHINE_USE_POLICY_SCHEMA_ID).toBe("pbp/machine-use-policy@1");
  });
});

describe("isPbpMachineUsePermission", () => {
  it("accepts all valid permissions", () => {
    for (const perm of PBP_MACHINE_USE_PERMISSIONS) {
      expect(isPbpMachineUsePermission(perm)).toBe(true);
    }
  });

  it("rejects invalid permission", () => {
    expect(isPbpMachineUsePermission("invalid")).toBe(false);
  });
});

describe("isPbpMachineUseVerdict", () => {
  it("accepts all valid verdicts", () => {
    for (const verdict of PBP_MACHINE_USE_VERDICTS) {
      expect(isPbpMachineUseVerdict(verdict)).toBe(true);
    }
  });

  it("rejects invalid verdict", () => {
    expect(isPbpMachineUseVerdict("invalid")).toBe(false);
  });
});
