/*
<MODULE_CONTRACT>
<purpose>catalog entity — canonical PBP contracts: Zod schemas, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schemas from schemas/catalog.ts — schemas are canonical, entity types derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Catalog and CatalogEntry entities.
 *
 * @see pbp-specification-package/entity-model §13 (Catalog), §14 (CatalogEntry)
 * @see pbp-specification-package/system-spec §10 (Catalog and CatalogEntry)
 * @see RFC-0427
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const CATALOG_SCHEMA_ID = pbpSchemaId("catalog");
export const CATALOG_ENTRY_SCHEMA_ID = pbpSchemaId("catalog-entry");

const pbpCatalogEntrySourceModeSchema = z.enum(["manifest-directory", "dataset"]);

const pbpCatalogEntrySourceSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("manifest-directory"), logicalPath: nonEmptyString }),
  z.object({ mode: z.literal("dataset"), adapterRef: nonEmptyString }),
]);

export const catalogSchema = pbpEntitySchema
  .extend({
    type: z.literal("catalog"),
    name: nonEmptyString,
    businessRef: pbpEntityRefSchema,
    entrySource: pbpCatalogEntrySourceSchema,
  })
  .strict();

export const catalogEntrySchema = pbpEntitySchema
  .extend({
    type: z.literal("catalog-entry"),
    name: nonEmptyString,
    summary: nonEmptyString.optional(),
    catalogRef: pbpEntityRefSchema,
    itemRef: pbpEntityRefSchema,
    localIdentifiers: z.record(z.string(), nonEmptyString).optional(),
    merchandising: z
      .object({
        featured: z.boolean().optional(),
        displayOrder: z.number().optional(),
      })
      .optional(),
    offeringRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
  })
  .strict();

export type PbpCatalog = z.infer<typeof catalogSchema>;
export type PbpCatalogEntry = z.infer<typeof catalogEntrySchema>;

export type PbpCatalogEntrySource = z.infer<typeof pbpCatalogEntrySourceSchema>;
export type PbpCatalogEntrySourceMode = z.infer<typeof pbpCatalogEntrySourceModeSchema>;

export const PBP_CATALOG_ENTRY_SOURCE_MODES: readonly PbpCatalogEntrySourceMode[] =
  pbpCatalogEntrySourceModeSchema.options;

export function isPbpCatalogEntrySourceMode(value: string): value is PbpCatalogEntrySourceMode {
  return PBP_CATALOG_ENTRY_SOURCE_MODES.includes(value as PbpCatalogEntrySourceMode);
}
