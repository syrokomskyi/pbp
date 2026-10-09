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
