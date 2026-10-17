/*
<MODULE_CONTRACT>
<purpose>
Unit tests for snapshot covering snapshot. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the snapshot suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { snapshot } from "./snapshot.ts";
import type { PbpResolvedGraph } from "./types.ts";
import type { PbpBuildContext } from "../compiler-pipeline.ts";

describe("snapshot", () => {
  it("returns undefined (stub for Wave 1)", async () => {
    const graph = {} as PbpResolvedGraph;
    const context: PbpBuildContext = {
      buildId: "",
      sourceRevision: "",
      buildTime: "",
      locale: "de",
      defaultLocale: "de",
      schemaSetDigest: "",
      derivationSetDigest: "",
      runtimeSnapshotId: null,
    };

    const result = await snapshot(graph, context);
    expect(result).toBeUndefined();
  });
});
