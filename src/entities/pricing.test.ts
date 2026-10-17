/*
<MODULE_CONTRACT>
<purpose>
Unit tests for pricing covering isPbpChargeType; isPbpAmountModel; PBP_TIER_METHODS. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the pricing suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  isPbpChargeType,
  isPbpAmountModel,
  PBP_CHARGE_TYPES,
  PBP_AMOUNT_MODELS,
  PBP_TIER_METHODS,
} from "./pricing.ts";

describe("isPbpChargeType", () => {
  it("accepts all valid charge types", () => {
    for (const type of PBP_CHARGE_TYPES) {
      expect(isPbpChargeType(type)).toBe(true);
    }
  });

  it("rejects invalid charge type", () => {
    expect(isPbpChargeType("invalid")).toBe(false);
  });
});

describe("isPbpAmountModel", () => {
  it("accepts all valid amount models", () => {
    for (const model of PBP_AMOUNT_MODELS) {
      expect(isPbpAmountModel(model)).toBe(true);
    }
  });

  it("rejects invalid amount model", () => {
    expect(isPbpAmountModel("invalid")).toBe(false);
  });
});

describe("PBP_TIER_METHODS", () => {
  it("contains graduated and volume", () => {
    expect(PBP_TIER_METHODS).toContain("graduated");
    expect(PBP_TIER_METHODS).toContain("volume");
  });
});
