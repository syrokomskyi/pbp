/*
<MODULE_CONTRACT>
<purpose>
Unit tests for tax covering isPbpTaxTreatment. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the tax suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpTaxTreatment, PBP_TAX_TREATMENTS } from "./tax.ts";

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
