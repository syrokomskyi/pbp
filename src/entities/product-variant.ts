/*
<MODULE_CONTRACT>
<purpose>product-variant entity — canonical PBP product variant contract: Zod schema, inferred type (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/product-variant.ts — schema canonical, type via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP ProductVariant entity.
 *
 * @see pbp-specification-package/entity-model §12 (ProductGroup and ProductVariant), §12.3 (Invariants)
 * @see RFC-0415
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, pbpExternalIdentifierSchema } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const PRODUCT_VARIANT_SCHEMA_ID = pbpSchemaId("product-variant");

export const productVariantSchema = pbpEntitySchema
  .extend({
    type: z.literal("product-variant"),
    name: nonEmptyString,
    groupRef: pbpEntityRefSchema,
    variantValues: z.record(z.string(), z.object({ valueRef: nonEmptyString })),
    externalIdentifiers: z.record(z.string(), pbpExternalIdentifierSchema).optional(),
  })
  .strict();

export type PbpProductVariant = z.infer<typeof productVariantSchema>;
