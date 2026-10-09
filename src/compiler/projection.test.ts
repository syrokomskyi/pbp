import { describe, it, expect } from "vitest";
import {
  generateProjections,
  buildCanonicalPriceSet,
  buildCanonicalCurrencySet,
  validateSchemaOrgPrices,
} from "./projection.ts";
import type { PbpResolvedGraph } from "./types.ts";

function makeGraph(overrides: Record<string, unknown> = {}): PbpResolvedGraph {
  return {
    business: { schema: "test", id: "biz-1", type: "business", status: "published", name: "Test" },
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
    ...overrides,
  } as unknown as PbpResolvedGraph;
}

describe("generateProjections", () => {
  it("generates website projections for each offering", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          name: "Offering 1",
        },
        "off-2": {
          schema: "test",
          id: "off-2",
          type: "offering",
          status: "published",
          name: "Offering 2",
        },
      },
    });

    const { website } = await generateProjections(graph, undefined, "de");

    expect(website).toHaveLength(2);
    expect((website[0] as unknown as Record<string, unknown>)?.offeringId).toBe("off-1");
    expect(website[0]?.locale).toBe("de");
  });

  it("generates AI answer projections for each offering", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": { schema: "test", id: "off-1", type: "offering", status: "published", name: "O1" },
      },
    });

    const { aiAnswer } = await generateProjections(graph, undefined, "de");

    expect(aiAnswer).toHaveLength(1);
    expect((aiAnswer[0] as unknown as Record<string, unknown>)?.offeringId).toBe("off-1");
  });

  it("generates Schema.org projection with business name", async () => {
    const graph = makeGraph();

    const { schemaOrg } = await generateProjections(graph, undefined, "de");

    expect(schemaOrg["@context"]).toBe("https://schema.org");
    expect(schemaOrg["@type"]).toBe("Organization");
    expect(schemaOrg.name).toBe("Test");
  });

  it("includes price in Schema.org when offering has fixed charge", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          name: "O1",
          pricing: {
            currency: "EUR",
            charges: { base: { amount: { model: "fixed", value: "99.00" } } },
          },
        },
      },
    });

    const { schemaOrg } = await generateProjections(graph, undefined, "de");
    const offers = schemaOrg.offers as unknown[];
    expect(offers).toHaveLength(1);
    const offer = offers[0] as Record<string, unknown>;
    expect(offer.price).toBe("99.00");
    expect(offer.priceCurrency).toBe("EUR");
  });
});

describe("buildCanonicalPriceSet", () => {
  it("collects canonical prices from offerings with fixed charges", () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          pricing: {
            currency: "EUR",
            charges: { base: { amount: { model: "fixed", value: "50.00" } } },
          },
        },
        "off-2": {
          schema: "test",
          id: "off-2",
          type: "offering",
          status: "published",
          pricing: {
            currency: "EUR",
            charges: { base: { amount: { model: "fixed", value: "75.00" } } },
          },
        },
      },
    });

    const prices = buildCanonicalPriceSet(graph);
    expect(prices.has("50.00")).toBe(true);
    expect(prices.has("75.00")).toBe(true);
    expect(prices.size).toBe(2);
  });

  it("returns empty set for offerings without fixed charges", () => {
    const graph = makeGraph();
    const prices = buildCanonicalPriceSet(graph);
    expect(prices.size).toBe(0);
  });
});

describe("buildCanonicalCurrencySet", () => {
  it("collects source currency codes from offerings", () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          pricing: { currency: "EUR" },
        },
        "off-2": {
          schema: "test",
          id: "off-2",
          type: "offering",
          status: "published",
          pricing: { currency: "USD" },
        },
      },
    });

    const currencies = buildCanonicalCurrencySet(graph);
    expect(currencies.has("EUR")).toBe(true);
    expect(currencies.has("USD")).toBe(true);
  });
});

describe("validateSchemaOrgPrices", () => {
  it("passes when all prices are canonical", () => {
    const canonicalPrices = new Set(["50.00", "75.00"]);
    const canonicalCurrencies = new Set(["EUR"]);
    const schemaOrg = {
      offers: [
        { price: "50.00", priceCurrency: "EUR" },
        { price: "75.00", priceCurrency: "EUR" },
      ],
    };

    const errors = validateSchemaOrgPrices(schemaOrg, canonicalPrices, canonicalCurrencies);
    expect(errors).toHaveLength(0);
  });

  it("reports error for non-canonical price", () => {
    const canonicalPrices = new Set(["50.00"]);
    const canonicalCurrencies = new Set(["EUR"]);
    const schemaOrg = {
      offers: [{ price: "99.99", priceCurrency: "EUR" }],
    };

    const errors = validateSchemaOrgPrices(schemaOrg, canonicalPrices, canonicalCurrencies);
    expect(errors.some((e) => e.code === "PBP-SCHEMA-PRICE")).toBe(true);
  });

  it("reports error for non-canonical currency", () => {
    const canonicalPrices = new Set(["50.00"]);
    const canonicalCurrencies = new Set(["EUR"]);
    const schemaOrg = {
      offers: [{ price: "50.00", priceCurrency: "USD" }],
    };

    const errors = validateSchemaOrgPrices(schemaOrg, canonicalPrices, canonicalCurrencies);
    expect(errors.some((e) => e.code === "PBP-SCHEMA-PRICE")).toBe(true);
  });

  it("returns no errors when offers is not an array", () => {
    const errors = validateSchemaOrgPrices({ offers: "not-array" }, new Set(), new Set());
    expect(errors).toHaveLength(0);
  });
});

describe("RFC-1075 AC-2: Schema.org emits @id when siteOrigin is provided", () => {
  it("emits @id for Organization node", async () => {
    const graph = makeGraph();
    const { schemaOrg } = await generateProjections(
      graph,
      undefined,
      "de",
      "https://example.example",
    );
    expect(schemaOrg["@id"]).toBe("https://example.example/.well-known/entity/business.json");
  });

  it("emits @id for each Offer node", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": { schema: "test", id: "off-1", type: "offering", status: "published", name: "O1" },
      },
    });
    const { schemaOrg } = await generateProjections(
      graph,
      undefined,
      "de",
      "https://example.example",
    );
    const offers = schemaOrg.offers as unknown[];
    expect((offers[0] as Record<string, unknown>)["@id"]).toBe(
      "https://example.example/.well-known/entity/offering/off-1.json",
    );
  });
});

describe("RFC-1075 AC-3: authored canonicalUri takes priority over derivation", () => {
  it("uses authored business canonicalUri as-is", async () => {
    const graph = makeGraph({
      business: {
        schema: "test",
        id: "biz-1",
        type: "business",
        status: "published",
        name: "Test",
        canonicalUri: "https://custom.example/business",
      },
    });
    const { schemaOrg } = await generateProjections(
      graph,
      undefined,
      "de",
      "https://example.example",
    );
    expect(schemaOrg["@id"]).toBe("https://custom.example/business");
  });

  it("uses authored offering canonicalUri as-is", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          name: "O1",
          canonicalUri: "https://custom.example/offering-1",
        },
      },
    });
    const { schemaOrg } = await generateProjections(
      graph,
      undefined,
      "de",
      "https://example.example",
    );
    const offers = schemaOrg.offers as unknown[];
    expect((offers[0] as Record<string, unknown>)["@id"]).toBe("https://custom.example/offering-1");
  });
});
