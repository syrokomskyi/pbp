/*
<MODULE_CONTRACT>
<purpose>exit-policy entity — canonical PBP contract: Zod schema, inferred types (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1121: added optional verificationNote field — structured post-export verification disclaimer (spec 03 §4).</item>
  <item>RFC-1102: merged Zod schema from schemas/exit-policy.ts — schema is canonical, entity type derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Exit Policy specialized schema.
 *
 * @see pbp-specification-package/entity-model §23.2 (Portability / Exit)
 * @see RFC-0450
 */

import { z } from "zod";
import { policySchema } from "./policy.js";
import { nonEmptyString } from "../schemas/primitives.js";

const pbpExitPackageSchema = z.object({
  domain: z.object({ included: z.boolean() }).optional(),
  customerContent: z.object({ included: z.boolean() }).optional(),
  builtWebsite: z.object({ included: z.boolean() }).optional(),
});

export const exitPolicySchema = policySchema
  .extend({
    kind: z.literal("exit"),
    trigger: z.object({ event: nonEmptyString }),
    deliveryTarget: z.object({ duration: nonEmptyString }),
    package: pbpExitPackageSchema,
    formats: z
      .object({
        deployableFiles: z.object({ valueRef: nonEmptyString }).optional(),
      })
      .optional(),
    // RFC-1121 (spec 03 §4): structured verification disclaimer — states that
    // post-export trust-claim verification depends on hash-checking the bundled
    // evidence artifacts, consumable by multiple projections.
    verificationNote: nonEmptyString.optional(),
  })
  .strict();

export type PbpExitPolicy = z.infer<typeof exitPolicySchema>;
export type PbpExitPackage = z.infer<typeof pbpExitPackageSchema>;
