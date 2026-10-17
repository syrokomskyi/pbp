/*
<MODULE_CONTRACT>
<purpose>
Unit tests for registry covering isPbpRegistryKind. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the registry suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpRegistryKind, PBP_REGISTRY_KINDS } from "./registry.ts";

describe("isPbpRegistryKind", () => {
  it("accepts all valid registry kinds", () => {
    for (const kind of PBP_REGISTRY_KINDS) {
      expect(isPbpRegistryKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpRegistryKind("invalid")).toBe(false);
  });
});
