import { describe, it, expect } from "vitest";
import { applyRuntimeOverlays } from "./overlays.ts";
import type { PbpResolvedGraph } from "./types.ts";

describe("applyRuntimeOverlays", () => {
  it("returns the graph unchanged (stub for Wave 1)", async () => {
    const graph = {
      business: { id: "biz-1" },
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

    const result = await applyRuntimeOverlays(graph);
    expect(result).toBe(graph);
  });
});
