/*
<MODULE_CONTRACT>
<purpose>product entity — canonical PBP product contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/product.ts — schema canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Product entity and product kind vocabulary.
 *
 * @see pbp-specification-package/entity-model §11 (Product)
 * @see pbp-specification-package/system-spec §3.4 (Federated identity)
 * @see RFC-0404
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, pbpExternalIdentifierSchema } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const PRODUCT_SCHEMA_ID = pbpSchemaId("product");

const pbpProductKindSchema = z.enum([
  "physical-good",
  "digital-good",
  "service",
  "composite-service",
  "subscription-access",
  "license",
  "rental",
  "insurance-product",
  "bundle",
  "right",
  "data-product",
  "experience",
  "custom-made-good",
]);

const pbpProductIntrinsicCompositionSchema = z.record(
  z.string(),
  z.object({
    productRef: pbpEntityRefSchema,
    quantity: z.number().optional(),
  }),
);

export const productSchema = pbpEntitySchema
  .extend({
    type: z.literal("product"),
    kind: pbpProductKindSchema,
    name: nonEmptyString,
    summary: nonEmptyString.optional(),
    authorityRef: pbpEntityRefSchema.optional(),
    classification: z
      .object({
        categoryRef: pbpEntityRefSchema.optional(),
        comparisonProfileRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
      })
      .optional(),
    purpose: z.object({ statement: nonEmptyString }).optional(),
    outcomes: z
      .record(
        z.string(),
        z.object({ name: nonEmptyString, description: nonEmptyString.optional() }),
      )
      .optional(),
    deliverables: z
      .record(z.string(), z.object({ kind: nonEmptyString, name: nonEmptyString }))
      .optional(),
    capabilities: z
      .record(z.string(), z.object({ value: z.union([nonEmptyString, z.boolean()]) }))
      .optional(),
    externalIdentifiers: z.record(z.string(), pbpExternalIdentifierSchema).optional(),
    intrinsicComposition: pbpProductIntrinsicCompositionSchema.optional(),
  })
  .strict();

export type PbpProductKind = z.infer<typeof pbpProductKindSchema>;
export const PBP_PRODUCT_KINDS: readonly PbpProductKind[] = pbpProductKindSchema.options;

export function isPbpProductKind(value: string): value is PbpProductKind {
  return PBP_PRODUCT_KINDS.includes(value as PbpProductKind);
}

export type PbpProduct = z.infer<typeof productSchema>;
export type PbpProductIntrinsicComposition = z.infer<typeof pbpProductIntrinsicCompositionSchema>;
