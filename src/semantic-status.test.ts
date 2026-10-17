/*
<MODULE_CONTRACT>
<purpose>
Unit tests for semantic status covering isPbpSemanticStatus. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the semantic suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpSemanticStatus, PBP_SEMANTIC_STATUSES } from "./semantic-status.ts";

describe("isPbpSemanticStatus", () => {
  it("accepts all valid semantic statuses", () => {
    for (const status of PBP_SEMANTIC_STATUSES) {
      expect(isPbpSemanticStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpSemanticStatus("active")).toBe(false);
  });
});
