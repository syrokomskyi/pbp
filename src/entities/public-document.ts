/*
<MODULE_CONTRACT>
<purpose>public-document entity — canonical PBP public document contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/public-document.ts — schema canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP PublicDocument entity.
 *
 * @see pbp-specification-package/entity-model §30 (PublicDocument)
 * @see RFC-0420
 */

import { z } from "zod";
import { pbpEntitySchema, pbpGovernanceSchema } from "../schemas/envelope.ts";
import { nonEmptyString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const PUBLIC_DOCUMENT_SCHEMA_ID = pbpSchemaId("public-document");

const pbpDocumentKindSchema = z.enum([
  "terms-and-conditions",
  "privacy-policy",
  "imprint",
  "legal-notice",
]);

export const publicDocumentSchema = pbpEntitySchema
  .extend({
    type: z.literal("public-document"),
    kind: pbpDocumentKindSchema,
    name: nonEmptyString,
    canonicalUrl: nonEmptyString,
    governance: pbpGovernanceSchema,
    presentation: z.record(z.string(), z.unknown()).optional(),
    // RFC-1155: canonical home for document-level contract terms
    // (terms.amendmentNotice, terms.preLitigationPeriod, terms.version).
    terms: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type PbpDocumentKind = z.infer<typeof pbpDocumentKindSchema>;
export const PBP_DOCUMENT_KINDS: readonly PbpDocumentKind[] = pbpDocumentKindSchema.options;

export function isPbpDocumentKind(value: string): value is PbpDocumentKind {
  return PBP_DOCUMENT_KINDS.includes(value as PbpDocumentKind);
}

export type PbpPublicDocument = z.infer<typeof publicDocumentSchema>;
