/*
<MODULE_CONTRACT>
<purpose>
Unit tests for pim adapter covering PbpPimAdapterProfile; PbpShopifyAdapterProfile. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the pim suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpPimAdapterProfile, PbpShopifyAdapterProfile } from "./pim-adapter.ts";

describe("PbpPimAdapterProfile", () => {
  it("defines a valid PIM adapter profile", () => {
    const profile: PbpPimAdapterProfile = {
      adapterType: "pim",
      sourceSystem: "akeneo",
      entityMappings: [
        {
          sourceType: "product",
          targetSchema: "pbp/product@1",
          fieldMappings: { name: "name", sku: "externalIdentifiers.sku.value" },
        },
      ],
    };
    expect(profile.adapterType).toBe("pim");
    expect(profile.entityMappings).toHaveLength(1);
  });
});

describe("PbpShopifyAdapterProfile", () => {
  it("defines a valid Shopify adapter profile", () => {
    const profile: PbpShopifyAdapterProfile = {
      adapterType: "shopify",
      sourceSystem: "shopify",
      entityMappings: [],
      shopDomain: "my-shop.myshopify.com",
      apiVersion: "2024-01",
      collectionMappings: { "custom-collections": "catalog" },
    };
    expect(profile.adapterType).toBe("shopify");
    expect(profile.shopDomain).toBe("my-shop.myshopify.com");
  });
});
