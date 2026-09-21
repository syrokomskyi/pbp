/*
<MODULE_CONTRACT>
<purpose>Public API for the PBP compiler — exports compilePbpProfile and all compiler types.</purpose>
<non-goals>
  <item>Does not implement individual phases — each phase has its own module.</item>
  <item>Does not provide CLI access — library-only (RFC-0467).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

export { compilePbpProfile } from "./pipeline.js";
export type {
  PbpCompilerInput,
  PbpCompilerResult,
  PbpResolvedGraph,
  PbpBuyerView,
  PbpProjectionSet,
  PartialCompilerResult,
} from "./types.js";
export { discover } from "./discover.js";
export { parse, type ParsedEntity } from "./parse.js";
export { validateRaw, type RawValidationResult } from "./validate.js";
export {
  buildEntityIndex,
  type EntityIndexResult,
  type LocaleAwareEntityIndex,
} from "./entity-index.js";
export { resolveLocales, type LocaleResolutionResult } from "./locale.js";
export { resolveReferences, type ReferenceResolutionResult } from "./references.js";
export { resolveProfile } from "./profile.js";
export { applyRuntimeOverlays } from "./overlays.js";
export { runDerivations, type DerivationResult } from "./derivations.js";
export { validateSemantic } from "./semantic.js";
export { assembleBuyerView } from "./buyer-view.js";
export { generateProjections } from "./projection.js";
export {
  validateSchemaOrgPrices,
  buildCanonicalPriceSet,
  buildCanonicalCurrencySet,
  extractCanonicalPrice,
} from "./projection.js";
export { snapshot } from "./snapshot.js";
export { publish } from "./publication.js";
export { materializeDerivedPrices } from "./materialize.js";
export type { PbpMaterializedDerivedPrice } from "../materialized-derived-price.js";
