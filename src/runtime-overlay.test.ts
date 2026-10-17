/*
<MODULE_CONTRACT>
<purpose>
Unit tests for runtime overlay covering isPbpOverlayStaleBehavior. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the runtime suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpOverlayStaleBehavior, PBP_OVERLAY_STALE_BEHAVIORS } from "./runtime-overlay.ts";

describe("isPbpOverlayStaleBehavior", () => {
  it("accepts all valid stale behaviors", () => {
    for (const behavior of PBP_OVERLAY_STALE_BEHAVIORS) {
      expect(isPbpOverlayStaleBehavior(behavior)).toBe(true);
    }
  });

  it("rejects invalid behavior", () => {
    expect(isPbpOverlayStaleBehavior("invalid")).toBe(false);
  });
});
