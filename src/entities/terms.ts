/*
<MODULE_CONTRACT>
<purpose>terms entity — canonical PBP terms contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/terms.ts — schema canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP terms and commercial lifecycle.
 *
 * @see pbp-specification-package/entity-model §19 (Terms)
 * @see RFC-0438
 */

import { z } from "zod";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";
import { nonEmptyString } from "../schemas/primitives.js";

const pbpRenewalModeSchema = z.enum(["automatic", "manual", "none"]);

export const pbpTermsSchema = z.object({
  minimumTerm: nonEmptyString.optional(),
  renewal: z
    .object({
      mode: pbpRenewalModeSchema,
      period: nonEmptyString,
    })
    .optional(),
  cancellation: z.object({ policyRef: pbpEntityRefSchema }).optional(),
  priceChanges: z.object({ policyRef: pbpEntityRefSchema }).optional(),
});

export type PbpRenewalMode = z.infer<typeof pbpRenewalModeSchema>;
export const PBP_RENEWAL_MODES: readonly PbpRenewalMode[] = pbpRenewalModeSchema.options;

export function isPbpRenewalMode(value: string): value is PbpRenewalMode {
  return PBP_RENEWAL_MODES.includes(value as PbpRenewalMode);
}

export type PbpTerms = z.infer<typeof pbpTermsSchema>;
