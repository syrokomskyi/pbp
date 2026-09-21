/*
<MODULE_CONTRACT>
<purpose>claim entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/claim.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Claim entity.
 *
 * @see pbp-specification-package/entity-model §24 (Claim)
 * @see RFC-0405
 * @see RFC-0706 (statementLang extension)
 * @see ADR-0028 (verificationLevel extension)
 */

import { z } from "zod";
import { pbpEntitySchema, pbpGovernanceSchema } from "../schemas/envelope.js";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const CLAIM_SCHEMA_ID = pbpSchemaId("claim");

const pbpClaimClassSchema = z.enum([
  "comparative-commercial",
  "comparative-technical",
  "factual",
  "risk",
  "benefit",
  "limitation",
]);

const pbpClaimKindSchema = z.enum([
  "risk",
  "benefit",
  "comparison",
  "fact",
  "limitation",
  "recommendation",
]);

// ADR-0028: Nachweisregister verification levels (N0–N3)
const pbpVerificationLevelSchema = z.enum(["N0", "N1", "N2", "N3"]);

export const claimSchema = pbpEntitySchema
  .extend({
    type: z.literal("claim"),
    claimClass: pbpClaimClassSchema,
    claimKind: pbpClaimKindSchema,
    subject: z.object({
      kind: nonEmptyString,
      name: nonEmptyString,
    }),
    statement: nonEmptyString,
    evidenceRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
    governance: pbpGovernanceSchema,
    publication: z
      .object({
        staleBehavior: z.enum(["block", "warn", "omit"]),
        showAsOfDate: z.boolean(),
        showEvidenceLabel: z.boolean(),
      })
      .optional(),
    confidence: z.enum(["high", "medium", "low"]).optional(),
    statementLang: nonEmptyString.optional(),
    verificationLevel: pbpVerificationLevelSchema.optional(),
  })
  .strict();

export type PbpClaim = z.infer<typeof claimSchema>;

export type PbpClaimClass = z.infer<typeof pbpClaimClassSchema>;
export const PBP_CLAIM_CLASSES: readonly PbpClaimClass[] = pbpClaimClassSchema.options;

export type PbpClaimKind = z.infer<typeof pbpClaimKindSchema>;
export const PBP_CLAIM_KINDS: readonly PbpClaimKind[] = pbpClaimKindSchema.options;

export type PbpVerificationLevel = z.infer<typeof pbpVerificationLevelSchema>;
export const PBP_VERIFICATION_LEVELS: readonly PbpVerificationLevel[] =
  pbpVerificationLevelSchema.options;
