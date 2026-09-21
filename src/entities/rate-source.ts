/*
<MODULE_CONTRACT>
<purpose>PBP RateSource entity — canonical contract: Zod schema, inferred type (RFC-0744, RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Does not define RatePolicy or RateSnapshot — those are RFC-0737/RFC-0738.</item>
  <item>Does not implement the adapter — that lives in @warpgogol/pbp/rate-adapters.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/rate-source.ts — schema canonical, type via z.infer (DNA-103).</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const RATE_SOURCE_SCHEMA_ID = pbpSchemaId("rate-source");

export const pbpRateSourceSchema = pbpEntitySchema
  .extend({
    type: z.literal("rate-source"),
    name: nonEmptyString,
    adapter: nonEmptyString,
    config: z.record(z.string(), z.unknown()),
  })
  .strict();

export type PbpRateSource = z.infer<typeof pbpRateSourceSchema>;
