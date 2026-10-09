import { describe, it, expect } from "vitest";
import { generateProjections } from "./projection.ts";
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

describe("RFC-1075 AC-1: canonical URIs in Schema.org projection", () => {
  it("emits @id for Organization and each Offer when siteOrigin is provided", async () => {
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

    const { schemaOrg } = await generateProjections(
      graph,
      undefined,
      "de",
      "https://example.example",
    );

    expect(schemaOrg["@id"]).toBe("https://example.example/.well-known/entity/business.json");
    const offers = schemaOrg.offers as unknown[];
    expect(offers).toHaveLength(2);
    expect((offers[0] as Record<string, unknown>)["@id"]).toBe(
      "https://example.example/.well-known/entity/offering/off-1.json",
    );
    expect((offers[1] as Record<string, unknown>)["@id"]).toBe(
      "https://example.example/.well-known/entity/offering/off-2.json",
    );
  });

  it("omits @id when siteOrigin is absent", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          name: "O1",
        },
      },
    });

    const { schemaOrg } = await generateProjections(graph, undefined, "de");

    expect(schemaOrg["@id"]).toBeUndefined();
    const offers = schemaOrg.offers as unknown[];
    expect((offers[0] as Record<string, unknown>)["@id"]).toBeUndefined();
  });

  it("strips trailing slashes from siteOrigin", async () => {
    const graph = makeGraph();

    const { schemaOrg } = await generateProjections(
      graph,
      undefined,
      "de",
      "https://example.example/",
    );

    expect(schemaOrg["@id"]).toBe("https://example.example/.well-known/entity/business.json");
  });
});
