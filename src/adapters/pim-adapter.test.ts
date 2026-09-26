import { describe, it, expect } from "vitest";
import type { PbpPimAdapterProfile, PbpShopifyAdapterProfile } from "./pim-adapter.js";

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
