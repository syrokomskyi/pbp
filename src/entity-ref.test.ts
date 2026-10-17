/*
<MODULE_CONTRACT>
<purpose>
Unit tests for entity ref covering PBP_IDENTITY_RELATIONS. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the entity suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { PBP_IDENTITY_RELATIONS } from "./entity-ref.ts";

describe("PBP_IDENTITY_RELATIONS", () => {
  it("contains all expected identity relations", () => {
    expect(PBP_IDENTITY_RELATIONS).toContain("sameIdentityAs");
    expect(PBP_IDENTITY_RELATIONS).toContain("equivalentTo");
    expect(PBP_IDENTITY_RELATIONS).toContain("similarTo");
    expect(PBP_IDENTITY_RELATIONS).toContain("supersedes");
    expect(PBP_IDENTITY_RELATIONS).toContain("derivedFrom");
  });

  it("has exactly 5 relations", () => {
    expect(PBP_IDENTITY_RELATIONS).toHaveLength(5);
  });
});
