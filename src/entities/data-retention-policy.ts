/*
<MODULE_CONTRACT>
<purpose>data-retention-policy entity — canonical PBP contract: Zod schema, inferred types (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/data-retention-policy.ts — schema is canonical, entity type derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Data Retention and Deletion policy.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-0452
 */

import { z } from "zod";
import { policySchema } from "./policy.ts";
import { nonEmptyString, pbpIsoDurationSchema } from "../schemas/primitives.ts";

const pbpRetentionPeriodSchema = z.object({
  duration: pbpIsoDurationSchema,
  startsFrom: nonEmptyString,
});

export const dataRetentionPolicySchema = policySchema
  .extend({
    kind: z.literal("data-retention"),
    retention: z.record(z.string(), pbpRetentionPeriodSchema),
    deletion: z.object({ method: nonEmptyString, timeline: nonEmptyString }),
  })
  .strict();

export type PbpDataRetentionPolicy = z.infer<typeof dataRetentionPolicySchema>;
export type PbpRetentionPeriod = z.infer<typeof pbpRetentionPeriodSchema>;
