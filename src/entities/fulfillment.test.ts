/*
<MODULE_CONTRACT>
<purpose>
Unit tests for fulfillment covering isPbpFulfillmentMode. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the fulfillment suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { isPbpFulfillmentMode, PBP_FULFILLMENT_MODES } from "./fulfillment.ts";

describe("isPbpFulfillmentMode", () => {
  it("accepts all valid fulfillment modes", () => {
    for (const mode of PBP_FULFILLMENT_MODES) {
      expect(isPbpFulfillmentMode(mode)).toBe(true);
    }
  });

  it("rejects invalid mode", () => {
    expect(isPbpFulfillmentMode("invalid")).toBe(false);
  });
});
