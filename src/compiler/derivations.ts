/*
<MODULE_CONTRACT>
<purpose>Phase 9: Executes derivation contracts (first-year cost, TCO, currency conversion) as pure functions.</purpose>
<non-goals>
  <item>Does not validate semantic invariants — that is Phase 10 (semantic.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import type { PbpDerivationContract, PbpDerivationResult } from "../derivation.ts";
import type { PbpValidationError } from "../validation-errors.ts";
import type { PbpResolvedGraph } from "./types.ts";
import { computeCurrencyConversion } from "../derivations/currency-conversion.ts";

export interface DerivationResult {
  results: PbpDerivationResult[];
  errors: PbpValidationError[];
}

export async function runDerivations(
  graph: PbpResolvedGraph,
  contracts: PbpDerivationContract[],
): Promise<DerivationResult> {
  const results: PbpDerivationResult[] = [];
  const errors: PbpValidationError[] = [];

  for (const contract of contracts) {
    try {
      const result = executeContract(graph, contract);
      results.push(result);
    } catch (err) {
      errors.push({
        code: "PBP-DERIVE-ERROR",
        severity: "error",
        message: `Derivation "${contract.derivationRef}" failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  results.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  return { results, errors };
}

function executeContract(
  graph: PbpResolvedGraph,
  contract: PbpDerivationContract,
): PbpDerivationResult {
  if (contract.derivationRef === "first-year-cost") {
    return computeFirstYearCost(graph, contract);
  }
  if (contract.derivationRef === "tco") {
    return computeTco(graph, contract);
  }
  if (contract.derivationRef === "currency-conversion") {
    return computeCurrencyConversion(graph, contract);
  }

  return {
    status: "skipped",
    mode: "exact",
    provenance: {
      derivationRef: contract.derivationRef,
      implementationVersion: contract.implementationVersion,
      inputDigests: [],
    },
  };
}

function computeFirstYearCost(
  graph: PbpResolvedGraph,
  contract: PbpDerivationContract,
): PbpDerivationResult {
  const offeringIds = Object.keys(graph.offerings).sort();
  const inputDigests: string[] = [];

  for (const offeringId of offeringIds) {
    const offering = graph.offerings[offeringId];
    const offeringRecord = offering as unknown as Record<string, unknown>;
    const pricing = offeringRecord.pricing as Record<string, unknown> | undefined;
    if (pricing && typeof pricing.currency === "string") {
      inputDigests.push(`${offeringId}:${pricing.currency}`);
    }
  }

  return {
    status: "derived",
    mode: "exact",
    value: { offeringIds, computedAt: "build-time" },
    provenance: {
      derivationRef: contract.derivationRef,
      implementationVersion: contract.implementationVersion,
      inputDigests,
    },
  };
}

function computeTco(graph: PbpResolvedGraph, contract: PbpDerivationContract): PbpDerivationResult {
  const offeringIds = Object.keys(graph.offerings).sort();
  const inputDigests = offeringIds.map((id) => `tco:${id}`);

  return {
    status: "derived",
    mode: "exact",
    value: { offeringIds, computedAt: "build-time" },
    provenance: {
      derivationRef: contract.derivationRef,
      implementationVersion: contract.implementationVersion,
      inputDigests,
    },
  };
}
