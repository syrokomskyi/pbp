/*
<MODULE_CONTRACT>
<purpose>business entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/business.ts — schema is canonical, entity type derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Business entity.
 *
 * @see pbp-specification-package/entity-model §5 (Business)
 * @see RFC-0403
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, pbpExternalIdentifierSchema } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const BUSINESS_SCHEMA_ID = pbpSchemaId("business");

export const businessSchema = pbpEntitySchema
  .extend({
    type: z.literal("business"),
    name: nonEmptyString,
    summary: nonEmptyString.optional(),
    description: nonEmptyString.optional(),
    businessModel: z.object({ typeRef: nonEmptyString }).optional(),
    markets: z.record(z.string(), z.object({ valueRef: nonEmptyString })).optional(),
    industries: z.record(z.string(), z.object({ categoryRef: nonEmptyString })).optional(),
    yearEstablished: z.number().int().positive().optional(),
    mission: nonEmptyString.optional(),
    brandRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
    legalIdentityRef: pbpEntityRefSchema.optional(),
    placeRefs: z
      .record(
        z.string(),
        z.object({
          ref: nonEmptyString,
          expectedType: nonEmptyString.optional(),
          role: nonEmptyString.optional(),
        }),
      )
      .optional(),
    contactPointRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
    webPresenceRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
    catalogRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
    externalIdentifiers: z.record(z.string(), pbpExternalIdentifierSchema).optional(),
    presentation: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type PbpBusiness = z.infer<typeof businessSchema>;
