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
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

export { compilePbpProfile } from "./pipeline.ts";
export type {
  PbpCompilerInput,
  PbpCompilerResult,
  PbpResolvedGraph,
  PbpBuyerView,
  PbpProjectionSet,
  PartialCompilerResult,
} from "./types.ts";
export { discover } from "./discover.ts";
export { parse, type ParsedEntity } from "./parse.ts";
export { validateRaw, type RawValidationResult } from "./validate.ts";
export {
  buildEntityIndex,
  type EntityIndexResult,
  type LocaleAwareEntityIndex,
} from "./entity-index.ts";
export { resolveLocales, type LocaleResolutionResult } from "./locale.ts";
export { resolveReferences, type ReferenceResolutionResult } from "./references.ts";
export { resolveProfile } from "./profile.ts";
export { applyRuntimeOverlays } from "./overlays.ts";
export { runDerivations, type DerivationResult } from "./derivations.ts";
export { validateSemantic } from "./semantic.ts";
export { assembleBuyerView } from "./buyer-view.ts";
export { generateProjections } from "./projection.ts";
export {
  validateSchemaOrgPrices,
  buildCanonicalPriceSet,
  buildCanonicalCurrencySet,
  extractCanonicalPrice,
} from "./projection.ts";
export { snapshot } from "./snapshot.ts";
export { publish } from "./publication.ts";
export { materializeDerivedPrices } from "./materialize.ts";
export type { PbpMaterializedDerivedPrice } from "../materialized-derived-price.ts";
