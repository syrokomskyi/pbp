import { describe, it, expect } from "vitest";
import { assembleBuyerView } from "./buyer-view.ts";
import type { PbpResolvedGraph } from "./types.ts";

function makeGraph(overrides: Record<string, unknown> = {}): PbpResolvedGraph {
  return {
    business: {
      schema: "test",
      id: "biz-1",
      type: "business",
      status: "published",
      name: "Test Business",
    },
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

describe("assembleBuyerView", () => {
  it("builds identity section from business entity", async () => {
    const graph = makeGraph();
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.schemaRef).toEqual({ ref: "buyer-view-1" });
    expect(view.sections["identity"]).toBeDefined();
    const identityData = (view.sections["identity"] as unknown as Record<string, unknown>)?.data as
      Record<string, unknown> | undefined;
    expect(identityData).toHaveProperty("name", "Test Business");
  });

  it("merges legal identity into identity section", async () => {
    const graph = makeGraph({
      legalIdentity: {
        schema: "test",
        id: "legal-1",
        type: "legal-identity",
        status: "published",
        legalName: "Legal Name",
      },
    });
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    const identityData = (view.sections["identity"] as unknown as Record<string, unknown>)?.data as
      Record<string, unknown> | undefined;
    expect(identityData).toHaveProperty("legalName", "Legal Name");
  });

  it("builds suitability section from products", async () => {
    const graph = makeGraph({
      products: {
        "prod-1": {
          schema: "test",
          id: "prod-1",
          type: "product",
          status: "published",
          purpose: { statement: "P" },
        },
      },
    });
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.sections["suitability"]).toBeDefined();
  });

  it("builds value section from benefit claims", async () => {
    const graph = makeGraph({
      claims: {
        "claim-1": {
          schema: "test",
          id: "claim-1",
          type: "claim",
          status: "published",
          claimClass: "benefit",
        },
      },
    });
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.sections["value"]).toBeDefined();
  });

  it("builds pricing section from first offering", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": {
          schema: "test",
          id: "off-1",
          type: "offering",
          status: "published",
          pricing: { currency: "EUR" },
        },
      },
    });
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.sections["pricing"]).toBeDefined();
  });

  it("builds assurances section from guarantee and SLA policies", async () => {
    const graph = makeGraph({
      policies: {
        "pol-1": {
          schema: "test",
          id: "pol-1",
          type: "policy",
          status: "published",
          policyKind: "guarantee",
        },
      },
    });
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.sections["assurances"]).toBeDefined();
  });

  it("builds limitations section from disclosures", async () => {
    const graph = makeGraph({
      disclosures: {
        "disc-1": { schema: "test", id: "disc-1", type: "disclosure", status: "published" },
      },
    });
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.sections["limitations"]).toBeDefined();
  });

  it("omits sections with no source data", async () => {
    const graph = makeGraph();
    const view = await assembleBuyerView(graph, { ref: "buyer-view-1" });

    expect(view.sections["suitability"]).toBeUndefined();
    expect(view.sections["value"]).toBeUndefined();
    expect(view.sections["pricing"]).toBeUndefined();
  });
});
