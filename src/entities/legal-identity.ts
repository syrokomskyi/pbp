/*
<MODULE_CONTRACT>
<purpose>legal-identity entity — canonical PBP contract: Zod schema, inferred types (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/legal-identity.ts — schema is canonical, entity type derived via z.infer (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP LegalIdentity entity and public/private boundary.
 *
 * @see pbp-specification-package/entity-model §6 (LegalIdentity), §6.1 (Privacy boundary)
 * @see RFC-0409
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, pbpExternalIdentifierSchema } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const LEGAL_IDENTITY_SCHEMA_ID = pbpSchemaId("legal-identity");

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

export const legalIdentitySchema = pbpEntitySchema
  .extend({
    type: z.literal("legal-identity"),
    legalName: nonEmptyString,
    legalForm: z.object({ valueRef: nonEmptyString }).optional(),
    responsiblePerson: z.object({ name: nonEmptyString }).optional(),
    registeredPlaceRef: pbpEntityRefSchema.optional(),
    publicIdentifiers: z
      .record(
        z.string(),
        z.object({
          status: pbpSemanticStatusSchema,
          value: nonEmptyString.optional(),
        }),
      )
      .optional(),
    publicRegistrations: z.record(z.string(), pbpEntityRefSchema).optional(),
    externalIdentifiers: z.record(z.string(), pbpExternalIdentifierSchema).optional(),
    presentation: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type PbpLegalIdentity = z.infer<typeof legalIdentitySchema>;
