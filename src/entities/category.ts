/*
<MODULE_CONTRACT>
<purpose>category entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/category.ts — schema is canonical, entity type derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Category entity (global semantic layer).
 *
 * @see pbp-specification-package/entity-model §31 (Category)
 * @see pbp-specification-package/system-spec §4.1 (Global Semantic Layer)
 * @see RFC-0414
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const CATEGORY_SCHEMA_ID = pbpSchemaId("category");

export const categorySchema = pbpEntitySchema
  .extend({
    type: z.literal("category"),
    name: nonEmptyString,
    broaderRef: pbpEntityRefSchema.optional(),
    externalMappings: z.record(z.string(), z.object({ value: nonEmptyString })).optional(),
  })
  .strict();

export type PbpCategory = z.infer<typeof categorySchema>;
