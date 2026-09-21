/*
<MODULE_CONTRACT>
<purpose>disclosure entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/disclosure.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Disclosure entity.
 *
 * @see pbp-specification-package/entity-model §26 (Disclosure)
 * @see RFC-0417
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const DISCLOSURE_SCHEMA_ID = pbpSchemaId("disclosure");

const pbpDisclosureKindSchema = z.enum([
  "technology-dependency",
  "data-processing",
  "ownership-change",
  "regulatory",
]);

const pbpDisclosureMaterialitySchema = z.enum(["informative", "material", "critical"]);

export const disclosureSchema = pbpEntitySchema
  .extend({
    type: z.literal("disclosure"),
    kind: pbpDisclosureKindSchema,
    name: nonEmptyString,
    statement: nonEmptyString,
    scope: z
      .object({
        offeringRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
      })
      .optional(),
    relatedPartyRef: pbpEntityRefSchema.optional(),
    materiality: pbpDisclosureMaterialitySchema,
    publication: z.object({ required: z.boolean() }),
  })
  .strict();

export type PbpDisclosure = z.infer<typeof disclosureSchema>;

export type PbpDisclosureKind = z.infer<typeof pbpDisclosureKindSchema>;
export const PBP_DISCLOSURE_KINDS: readonly PbpDisclosureKind[] = pbpDisclosureKindSchema.options;

export function isPbpDisclosureKind(value: string): value is PbpDisclosureKind {
  return PBP_DISCLOSURE_KINDS.includes(value as PbpDisclosureKind);
}

export type PbpDisclosureMateriality = z.infer<typeof pbpDisclosureMaterialitySchema>;
export const PBP_DISCLOSURE_MATERIALITIES: readonly PbpDisclosureMateriality[] =
  pbpDisclosureMaterialitySchema.options;

export function isPbpDisclosureMateriality(value: string): value is PbpDisclosureMateriality {
  return PBP_DISCLOSURE_MATERIALITIES.includes(value as PbpDisclosureMateriality);
}
