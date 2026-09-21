/*
<MODULE_CONTRACT>
<purpose>ownership-policy entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/ownership-policy.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Ownership Policy specialized schema.
 *
 * @see pbp-specification-package/entity-model §23.1 (Ownership)
 * @see RFC-0449
 */

import { z } from "zod";
import { policySchema } from "./policy.js";
import { nonEmptyString } from "../schemas/primitives.js";

const pbpAssetHolderSchema = z.enum(["customer", "third-party", "provider"]);

const pbpOwnershipAssetSchema = z.object({
  holder: pbpAssetHolderSchema,
  timing: nonEmptyString.optional(),
  usageBasis: nonEmptyString.optional(),
});

export const ownershipPolicySchema = policySchema
  .extend({
    kind: z.literal("ownership"),
    assets: z.object({
      domain: pbpOwnershipAssetSchema.optional(),
      customerContent: pbpOwnershipAssetSchema.optional(),
      builtWebsite: pbpOwnershipAssetSchema.optional(),
      sourceCode: pbpOwnershipAssetSchema.optional(),
      thirdPartyComponents: pbpOwnershipAssetSchema.optional(),
    }),
  })
  .strict();

export type PbpOwnershipPolicy = z.infer<typeof ownershipPolicySchema>;

export type PbpAssetHolder = z.infer<typeof pbpAssetHolderSchema>;
export const PBP_ASSET_HOLDERS: readonly PbpAssetHolder[] = pbpAssetHolderSchema.options;

export function isPbpAssetHolder(value: string): value is PbpAssetHolder {
  return PBP_ASSET_HOLDERS.includes(value as PbpAssetHolder);
}

export type PbpOwnershipAsset = z.infer<typeof pbpOwnershipAssetSchema>;
