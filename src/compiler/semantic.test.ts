import { describe, it, expect } from "vitest";
import { validateSemantic } from "./semantic.js";
import type { PbpResolvedGraph } from "./types.js";

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

describe("validateSemantic", () => {
  it("passes for clean entities without HTML, empty strings, or legacy keys", async () => {
    const graph = makeGraph();
    const errors = await validateSemantic(graph);
    expect(errors).toHaveLength(0);
  });

  it("detects HTML tags in canonical fields", async () => {
    const graph = makeGraph({
      business: {
        schema: "test",
        id: "biz-1",
        type: "business",
        status: "published",
        name: "<b>HTML</b> name",
      },
    });
    const errors = await validateSemantic(graph);
    expect(errors.some((e) => e.code === "PBP-HTML")).toBe(true);
  });

  it("detects empty strings in canonical fields", async () => {
    const graph = makeGraph({
      business: { schema: "test", id: "biz-1", type: "business", status: "published", name: "" },
    });
    const errors = await validateSemantic(graph);
    expect(errors.some((e) => e.code === "PBP-EMPTY")).toBe(true);
  });

  it("detects presentation-ready money strings", async () => {
    const graph = makeGraph({
      business: {
        schema: "test",
        id: "biz-1",
        type: "business",
        status: "published",
        name: "Costs 100€ per month",
      },
    });
    const errors = await validateSemantic(graph);
    expect(errors.some((e) => e.code === "PBP-MONEY")).toBe(true);
  });

  it("detects locale markers in entity IDs", async () => {
    const graph = makeGraph({
      business: {
        schema: "test",
        id: "biz-1.de",
        type: "business",
        status: "published",
        name: "Test",
      },
    });
    const errors = await validateSemantic(graph);
    expect(errors.some((e) => e.code === "PBP-LOCALE-ID")).toBe(true);
  });

  it("detects legacy keys in entities", async () => {
    const graph = makeGraph({
      business: {
        schema: "test",
        id: "biz-1",
        type: "business",
        status: "published",
        name: "Test",
        hourlyRate: "100",
      },
    });
    const errors = await validateSemantic(graph);
    expect(errors.some((e) => e.code === "PBP-LEGACY-KEY")).toBe(true);
  });

  it("detects sensitive data keys", async () => {
    const graph = makeGraph({
      business: {
        schema: "test",
        id: "biz-1",
        type: "business",
        status: "published",
        name: "Test",
        iban: "DE123",
      },
    });
    const errors = await validateSemantic(graph);
    expect(errors.some((e) => e.code === "PBP-SENSITIVE")).toBe(true);
  });

  it("sorts errors by entityId then path", async () => {
    const graph = makeGraph({
      business: { schema: "test", id: "biz-1", type: "business", status: "published", name: "" },
      offerings: {
        "off-z": {
          schema: "test",
          id: "off-z",
          type: "offering",
          status: "published",
          name: "<b>HTML</b>",
        },
      },
    });
    const errors = await validateSemantic(graph);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.entityId).toBe("biz-1");
  });
});
