/*
<MODULE_CONTRACT>
<purpose>web-presence entity — canonical PBP web presence contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/web-presence.ts — schema canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP WebPresence entity.
 *
 * @see pbp-specification-package/entity-model §10 (WebPresence)
 * @see RFC-0413
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const WEB_PRESENCE_SCHEMA_ID = pbpSchemaId("web-presence");

const pbpWebPresenceKindSchema = z.enum(["primary-website", "landing-page", "social-profile"]);
const pbpWebControlStatusSchema = z.enum(["business-controlled", "third-party", "verified-mirror"]);

export const webPresenceSchema = pbpEntitySchema
  .extend({
    type: z.literal("web-presence"),
    name: nonEmptyString,
    kind: pbpWebPresenceKindSchema,
    canonicalUrl: nonEmptyString,
    businessRef: pbpEntityRefSchema,
    locales: z.record(z.string(), nonEmptyString).optional(),
    control: pbpWebControlStatusSchema,
    sameAs: z.array(nonEmptyString).optional(),
    presentation: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type PbpWebPresenceKind = z.infer<typeof pbpWebPresenceKindSchema>;
export const PBP_WEB_PRESENCE_KINDS: readonly PbpWebPresenceKind[] =
  pbpWebPresenceKindSchema.options;

export function isPbpWebPresenceKind(value: string): value is PbpWebPresenceKind {
  return PBP_WEB_PRESENCE_KINDS.includes(value as PbpWebPresenceKind);
}

export type PbpWebControlStatus = z.infer<typeof pbpWebControlStatusSchema>;
export const PBP_WEB_CONTROL_STATUSES: readonly PbpWebControlStatus[] =
  pbpWebControlStatusSchema.options;

export function isPbpWebControlStatus(value: string): value is PbpWebControlStatus {
  return PBP_WEB_CONTROL_STATUSES.includes(value as PbpWebControlStatus);
}

export type PbpWebPresence = z.infer<typeof webPresenceSchema>;
