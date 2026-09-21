/*
<MODULE_CONTRACT>
<purpose>Barrel export for PBP schemas infrastructure only — primitives, envelope, entity-ref (RFC-1102: per-entity contracts live in ../entities/).</purpose>
<non-goals>
  <item>Does not export per-entity schemas or aggregates — those live in ../entities/index.ts (DNA-103).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: shrunk to infrastructure-only exports — entity schemas, pbpSchemaById, and pbpEntityDiscriminatedUnion relocated to ../entities/index.ts (DNA-103).</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

// Primitives
export {
  pbpLocalizedStringSchema,
  pbpMoneySchema,
  pbpMoneyRangeSchema,
  pbpIsoDurationSchema,
  pbpQuantitativeDurationSchema,
  pbpTimestampSchema,
  pbpQuantitativeValueSchema,
  pbpExternalIdentifierSchema,
  pbpControlledValueSchema,
  nonEmptyString,
  noHtmlString,
  decimalString,
} from "./primitives.js";

// Envelope
export {
  pbpEntityStatusSchema,
  pbpGovernanceSchema,
  pbpEntitySchema,
  entityIdSchema,
  schemaIdSchema,
} from "./envelope.js";

// EntityRef
export { pbpEntityRefSchema } from "./entity-ref.js";
