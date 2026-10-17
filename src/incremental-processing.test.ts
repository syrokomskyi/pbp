/*
<MODULE_CONTRACT>
<purpose>
Unit tests for incremental processing covering isPbpDependencyInvalidationRule. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the incremental suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  isPbpDependencyInvalidationRule,
  PBP_DEPENDENCY_INVALIDATION_RULES,
} from "./incremental-processing.ts";

describe("isPbpDependencyInvalidationRule", () => {
  it("accepts all valid rules", () => {
    for (const rule of PBP_DEPENDENCY_INVALIDATION_RULES) {
      expect(isPbpDependencyInvalidationRule(rule)).toBe(true);
    }
  });

  it("rejects invalid rule", () => {
    expect(isPbpDependencyInvalidationRule("invalid")).toBe(false);
  });
});
