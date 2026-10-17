/*
<MODULE_CONTRACT>
<purpose>
Unit tests for overlays covering applyRuntimeOverlays. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the overlays suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
