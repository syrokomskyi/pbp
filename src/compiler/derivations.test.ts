/*
<MODULE_CONTRACT>
<purpose>
Unit tests for derivations covering runDerivations. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the derivations suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { runDerivations } from "./derivations.ts";
import type { PbpDerivationContract } from "../derivation.ts";
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

function makeContract(ref: string): PbpDerivationContract {
  return {
    derivationRef: ref,
    contractVersion: "1",
    implementationVersion: "1",
    requiredInputs: [],
    parameters: {},
  } as unknown as PbpDerivationContract;
}

describe("runDerivations", () => {
  it("returns empty results for no contracts", async () => {
    const graph = makeGraph();
    const { results, errors } = await runDerivations(graph, []);

    expect(results).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it("executes first-year-cost derivation", async () => {
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

    const { results, errors } = await runDerivations(graph, [makeContract("first-year-cost")]);

    expect(errors).toHaveLength(0);
    expect(results).toHaveLength(1);
    expect(results[0]?.status).toBe("derived");
    expect(results[0]?.provenance.derivationRef).toBe("first-year-cost");
  });

  it("executes tco derivation", async () => {
    const graph = makeGraph({
      offerings: {
        "off-1": { schema: "test", id: "off-1", type: "offering", status: "published" },
      },
    });

    const { results } = await runDerivations(graph, [makeContract("tco")]);

    expect(results).toHaveLength(1);
    expect(results[0]?.status).toBe("derived");
    expect(results[0]?.provenance.derivationRef).toBe("tco");
  });

  it("skips unknown derivation refs", async () => {
    const graph = makeGraph();

    const { results } = await runDerivations(graph, [makeContract("unknown-derivation")]);

    expect(results).toHaveLength(1);
    expect(results[0]?.status).toBe("skipped");
  });

  it("catches errors from derivation execution", async () => {
    const graph = makeGraph();
    const badContract = {
      derivationRef: "currency-conversion",
      contractVersion: "1",
      implementationVersion: "1",
      requiredInputs: ["sourceAmount", "sourceCurrency", "targetCurrency", "rateSnapshotRef"],
      parameters: {
        pipeline: {
          conversion: null,
          rounding: { mode: "half-up", decimalPlaces: 2 },
        },
      },
    } as unknown as PbpDerivationContract;

    const { errors } = await runDerivations(graph, [badContract]);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.code).toBe("PBP-DERIVE-ERROR");
  });
});
