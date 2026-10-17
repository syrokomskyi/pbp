/*
<MODULE_CONTRACT>
<purpose>
Unit tests for signature covering isPbpSignatureAlgorithm. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the signature suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpSignatureAlgorithm, PBP_SIGNATURE_ALGORITHMS } from "./signature.ts";

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
