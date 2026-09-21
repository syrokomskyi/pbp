/*
<MODULE_CONTRACT>
<purpose>contact-point entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/contact-point.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP ContactPoint entity.
 *
 * @see pbp-specification-package/entity-model §9 (ContactPoint)
 * @see RFC-0412
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const CONTACT_POINT_SCHEMA_ID = pbpSchemaId("contact-point");

const pbpContactChannelSchema = z.enum(["email", "phone", "form", "chat", "postal"]);

export const contactPointSchema = pbpEntitySchema
  .extend({
    type: z.literal("contact-point"),
    name: nonEmptyString,
    channel: pbpContactChannelSchema,
    value: nonEmptyString,
    purposes: z.record(z.string(), z.object({ valueRef: nonEmptyString })).optional(),
    preferred: z.boolean().optional(),
    languages: z.record(z.string(), nonEmptyString).optional(),
  })
  .strict();

export type PbpContactPoint = z.infer<typeof contactPointSchema>;

export type PbpContactChannel = z.infer<typeof pbpContactChannelSchema>;
export const PBP_CONTACT_CHANNELS: readonly PbpContactChannel[] = pbpContactChannelSchema.options;

export function isPbpContactChannel(value: string): value is PbpContactChannel {
  return PBP_CONTACT_CHANNELS.includes(value as PbpContactChannel);
}
