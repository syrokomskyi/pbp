/*
<MODULE_CONTRACT>
<purpose>renewal-policy entity — canonical PBP contract-renewal policy contract: Zod schema, inferred types (RFC-1155, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
  <item>Do not redeclare the inherited terms record — policySchema already carries it.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1155: created specialized renewal policy schema — auto-renewal interval and renewal reminder lead time.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Renewal Policy specialized schema.
 *
 * Canonical home for contract-renewal terms: the auto-renewal interval and
 * the reminder lead time ahead of renewal.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-1155
 */

import { z } from "zod";
import { policySchema } from "./policy.js";
import { pbpIsoDurationSchema } from "../schemas/primitives.js";

export const renewalPolicySchema = policySchema
  .extend({
    kind: z.literal("renewal"),
    renewalPeriod: pbpIsoDurationSchema.optional(),
    reminder: pbpIsoDurationSchema.optional(),
  })
  .strict();

export type PbpRenewalPolicy = z.infer<typeof renewalPolicySchema>;
