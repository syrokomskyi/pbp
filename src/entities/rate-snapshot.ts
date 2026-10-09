/*
<MODULE_CONTRACT>
<purpose>PBP RateSnapshot entity — canonical contract: Zod schema, inferred types (RFC-0738, RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not implement logic beyond this module's declared purpose — keep responsibilities in their owning modules.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/rate-snapshot.ts — schema canonical, types via z.infer (DNA-103).</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, decimalString } from "../schemas/primitives.ts";
import { pbpRateModeSchema, pbpRateDirectionSchema } from "./rate-policy.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const RATE_SNAPSHOT_SCHEMA_ID = pbpSchemaId("rate-snapshot");

export const pbpRateSnapshotDigestSchema = z.object({
  algorithm: nonEmptyString,
  value: nonEmptyString,
});

export const pbpRateSnapshotSourceSchema = z.object({
  kind: pbpRateModeSchema,
  sourceContractRef: pbpEntityRefSchema.optional(),
  rateScheduleRef: pbpEntityRefSchema.optional(),
  rateScheduleEntryKey: nonEmptyString.optional(),
});

export const rateSnapshotSchema = pbpEntitySchema
  .extend({
    type: z.literal("rate-snapshot"),
    pair: z.object({
      sourceCurrency: nonEmptyString,
      targetCurrency: nonEmptyString,
    }),
    quotation: z.object({
      direction: pbpRateDirectionSchema,
    }),
    value: decimalString,
    source: pbpRateSnapshotSourceSchema,
    observedAt: nonEmptyString,
    freshUntil: nonEmptyString,
    digest: pbpRateSnapshotDigestSchema,
  })
  .strict();

export type PbpRateSnapshotDigest = z.infer<typeof pbpRateSnapshotDigestSchema>;
export type PbpRateSnapshotSource = z.infer<typeof pbpRateSnapshotSourceSchema>;
export type PbpRateSnapshot = z.infer<typeof rateSnapshotSchema>;
