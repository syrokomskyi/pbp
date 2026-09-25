/*
<MODULE_CONTRACT>
<purpose>publication — Phase 14, assembles the final PbpCompilerResult from all phase outputs.</purpose>
<non-goals>
  <item>Does not implement individual phases — each phase has its own module.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

import type { PbpBuildContext } from "../compiler-pipeline.js";
import { createDefaultIO, type WorkspaceIO } from "@warpgogol/werkstatt-shared/kernel/workspace-io";
import type {
  PbpCompilerInput,
  PbpCompilerResult,
  PbpResolvedGraph,
  PartialCompilerResult,
} from "./types.js";
import type { PbpEntity } from "../envelope.ts";
import { byteHash } from "@warpgogol/werkstatt-shared/fingerprint";

export async function publish(
  partial: PartialCompilerResult,
  input: PbpCompilerInput,
  io: WorkspaceIO = input.io ?? createDefaultIO().io,
): Promise<PbpCompilerResult> {
  const context = await buildContext(input, partial, io);

  return {
    context,
    inventory: partial.inventory ?? { sources: [], recordsDiscovered: 0, recordsBySchema: {} },
    entityIndex: partial.entityIndex ?? new Map<string, PbpEntity>(),
    resolvedGraph: partial.resolvedGraph ?? emptyGraph(),
    fallbackReport: partial.fallbackReport ?? { locale: input.locale, fallbacks: [] },
    graphErrors: partial.graphErrors ?? [],
    cycleResults: partial.cycleResults ?? [],
    validationErrors: partial.validationErrors ?? [],
    derivationResults: partial.derivationResults ?? [],
    buyerView: partial.buyerView,
    projections: partial.projections ?? { website: [], aiAnswer: [], schemaOrg: {} },
    publication: partial.publication,
  };
}

async function buildContext(
  input: PbpCompilerInput,
  _partial: PartialCompilerResult,
  io: WorkspaceIO,
): Promise<PbpBuildContext> {
  const sourceRevision = await getGitRevision(input.sourceDirectory, io);
  const schemaSetDigest = byteHash("pbp-schema-set-v1");
  const derivationSetDigest = byteHash(
    (input.derivations ?? [])
      .map((d) => d.derivationRef)
      .sort()
      .join(","),
  );

  return {
    buildId: byteHash(`${sourceRevision}:${input.locale}:${input.strictness}`),
    sourceRevision,
    buildTime: input.buildTime ?? new Date().toISOString(),
    locale: input.locale,
    defaultLocale: input.defaultLocale,
    schemaSetDigest,
    derivationSetDigest,
    runtimeSnapshotId: null,
  };
}

async function getGitRevision(sourceDirectory: string, io: WorkspaceIO): Promise<string> {
  try {
    const result = await io.exec("git", ["rev-parse", "HEAD"], {
      cwd: sourceDirectory,
      timeoutMs: 5000,
    });
    return result.exitCode === 0 ? result.stdout.trim() : "unknown";
  } catch {
    return "unknown";
  }
}

function emptyGraph(): PbpResolvedGraph {
  return {
    business: {} as PbpResolvedGraph["business"],
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
  };
}
