/*
<MODULE_CONTRACT>
<purpose>place entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/place.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Place entity and territory rules.
 *
 * @see pbp-specification-package/entity-model §8 (Place), §8.1 (Rules)
 * @see RFC-0411
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const PLACE_SCHEMA_ID = pbpSchemaId("place");

const pbpPlaceKindSchema = z.enum(["locality", "region", "country"]);

const pbpSemanticStatusSchema = z.enum([
  "declared",
  "derived",
  "not-declared",
  "not-applicable",
  "unavailable",
  "invalid",
  "stale",
  "not-comparable",
]);

export const placeSchema = pbpEntitySchema
  .extend({
    type: z.literal("place"),
    name: nonEmptyString,
    kind: pbpPlaceKindSchema,
    address: z
      .object({
        street: nonEmptyString.optional(),
        streetNumber: nonEmptyString.optional(),
        postalCode: nonEmptyString.optional(),
        locality: nonEmptyString.optional(),
        administrativeArea: nonEmptyString.optional(),
        countryCode: nonEmptyString,
      })
      .optional(),
    geo: z
      .object({
        status: pbpSemanticStatusSchema,
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),
    publicUrl: nonEmptyString.optional(),
  })
  .strict();

export type PbpPlace = z.infer<typeof placeSchema>;

export type PbpPlaceKind = z.infer<typeof pbpPlaceKindSchema>;
export const PBP_PLACE_KINDS: readonly PbpPlaceKind[] = pbpPlaceKindSchema.options;

export function isPbpPlaceKind(value: string): value is PbpPlaceKind {
  return PBP_PLACE_KINDS.includes(value as PbpPlaceKind);
}
