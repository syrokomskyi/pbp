/*
<MODULE_CONTRACT>
<purpose>
Unit tests for publication covering isPbpCanonicalSerializationStep. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the publication suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
