import { describe, it, expect } from "vitest";
import { materializeDerivedPrices } from "./materialize.ts";
import type { PbpResolvedGraph } from "./types.ts";
import type { PbpCurrencyPricingPolicy } from "../entities/currency-pricing-policy.ts";

describe("materializeDerivedPrices", () => {
  it("returns empty prices and no errors for empty graph", () => {
    const graph = {
      business: { id: "biz-1", kind: "business" },
      places: {},
      contactPoints: {},
      webPresences: {},
      products: {},
      categories: {},
      catalogEntries: {},
      offerings: {},
      policies: {},
      claims: {},
      evidenceSources: {},
      disclosures: {},
      publicDocuments: {},
      ratePolicies: {},
      rateSnapshots: {},
    } as unknown as PbpResolvedGraph;

    const policy = {
      sourceCurrency: "EUR",
      targetCurrencies: {},
    } as unknown as PbpCurrencyPricingPolicy;

    const result = materializeDerivedPrices(graph, policy, "2026-01-01T00:00:00Z");
    expect(result.prices).toEqual({});
    expect(result.errors).toEqual([]);
  });

  it("skips offerings without pricing", () => {
    const graph = {
      business: { id: "biz-1", kind: "business" },
      offerings: {
        "off-1": { id: "off-1", kind: "offering" },
      },
      places: {},
      contactPoints: {},
      webPresences: {},
      products: {},
      categories: {},
      catalogEntries: {},
      policies: {},
      claims: {},
      evidenceSources: {},
      disclosures: {},
      publicDocuments: {},
      ratePolicies: {},
      rateSnapshots: {},
    } as unknown as PbpResolvedGraph;

    const policy = {
      sourceCurrency: "EUR",
      targetCurrencies: {
        usd: { currency: "USD", strategy: "derived" },
      },
    } as unknown as PbpCurrencyPricingPolicy;

    const result = materializeDerivedPrices(graph, policy, "2026-01-01T00:00:00Z");
    expect(result.prices).toEqual({});
    expect(result.errors).toEqual([]);
  });

  it("skips target currencies with strategy: fixed", () => {
    const graph = {
      business: { id: "biz-1", kind: "business" },
      offerings: {
        "off-1": {
          id: "off-1",
          kind: "offering",
          pricing: {
            currency: "EUR",
            charges: {
              base: {
                amount: { model: "fixed", value: "100.00" },
              },
            },
          },
        },
      },
      places: {},
      contactPoints: {},
      webPresences: {},
      products: {},
      categories: {},
      catalogEntries: {},
      policies: {},
      claims: {},
      evidenceSources: {},
      disclosures: {},
      publicDocuments: {},
      ratePolicies: {},
      rateSnapshots: {},
    } as unknown as PbpResolvedGraph;

    const policy = {
      sourceCurrency: "EUR",
      targetCurrencies: {
        usd: { currency: "USD", strategy: "fixed" },
      },
    } as unknown as PbpCurrencyPricingPolicy;

    const result = materializeDerivedPrices(graph, policy, "2026-01-01T00:00:00Z");
    expect(result.prices).toEqual({});
    expect(result.errors).toEqual([]);
  });

  it("emits PBP-DERIVED-PRICE-03 when no rate policy exists for derived target", () => {
    const graph = {
      business: { id: "biz-1", kind: "business" },
      offerings: {
        "off-1": {
          id: "off-1",
          kind: "offering",
          pricing: {
            currency: "EUR",
            charges: {
              base: {
                amount: { model: "fixed", value: "100.00" },
              },
            },
          },
        },
      },
      places: {},
      contactPoints: {},
      webPresences: {},
      products: {},
      categories: {},
      catalogEntries: {},
      policies: {},
      claims: {},
      evidenceSources: {},
      disclosures: {},
      publicDocuments: {},
      ratePolicies: {},
      rateSnapshots: {},
    } as unknown as PbpResolvedGraph;

    const policy = {
      sourceCurrency: "EUR",
      targetCurrencies: {
        usd: { currency: "USD", strategy: "derived" },
      },
    } as unknown as PbpCurrencyPricingPolicy;

    const result = materializeDerivedPrices(graph, policy, "2026-01-01T00:00:00Z");
    expect(result.prices).toEqual({});
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]!.code).toBe("PBP-DERIVED-PRICE-03");
    expect(result.errors[0]!.entityId).toBe("off-1");
  });

  it("emits PBP-DERIVED-PRICE-06 when source and target currency are the same", () => {
    const graph = {
      business: { id: "biz-1", kind: "business" },
      offerings: {
        "off-1": {
          id: "off-1",
          kind: "offering",
          pricing: {
            currency: "EUR",
            charges: {
              base: {
                amount: { model: "fixed", value: "100.00" },
              },
            },
          },
        },
      },
      places: {},
      contactPoints: {},
      webPresences: {},
      products: {},
      categories: {},
      catalogEntries: {},
      policies: {},
      claims: {},
      evidenceSources: {},
      disclosures: {},
      publicDocuments: {},
      ratePolicies: {},
      rateSnapshots: {},
    } as unknown as PbpResolvedGraph;

    const policy = {
      sourceCurrency: "EUR",
      targetCurrencies: {
        eur: { currency: "EUR", strategy: "derived" },
      },
    } as unknown as PbpCurrencyPricingPolicy;

    const result = materializeDerivedPrices(graph, policy, "2026-01-01T00:00:00Z");
    expect(result.prices).toEqual({});
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]!.code).toBe("PBP-DERIVED-PRICE-06");
  });
});
