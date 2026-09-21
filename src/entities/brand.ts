/*
<MODULE_CONTRACT>
<purpose>brand entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/brand.ts — schema is canonical, entity type derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Brand entity.
 *
 * @see pbp-specification-package/entity-model §7 (Brand)
 * @see RFC-0410
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";
import { nonEmptyString, pbpExternalIdentifierSchema } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const BRAND_SCHEMA_ID = pbpSchemaId("brand");

export const brandSchema = pbpEntitySchema
  .extend({
    type: z.literal("brand"),
    name: nonEmptyString,
    tagline: nonEmptyString.optional(),
    ownerBusinessRef: pbpEntityRefSchema,
    externalIdentifiers: z.record(z.string(), pbpExternalIdentifierSchema).optional(),
  })
  .strict();

export type PbpBrand = z.infer<typeof brandSchema>;
