/*
<MODULE_CONTRACT>
<purpose>liability-policy entity — canonical PBP liability policy contract: Zod schema, inferred types (RFC-1155, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
  <item>Do not redeclare the inherited terms record — policySchema already carries it.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1155: created specialized liability policy schema — payments-received cap basis, cap period and statutory exclusions.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Liability Policy specialized schema.
 *
 * Canonical home for liability contract terms: the cap basis (e.g. sum of
 * payments received over a period) and statutory exclusions.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-1155
 */

import { z } from "zod";
import { policySchema } from "./policy.ts";
import { nonEmptyString, pbpIsoDurationSchema } from "../schemas/primitives.ts";

export const liabilityPolicySchema = policySchema
  .extend({
    kind: z.literal("liability"),
    cap: z
      .object({
        basis: z.enum(["sum-of-payments-received"]),
        period: pbpIsoDurationSchema,
        exclusions: z.array(nonEmptyString).optional(),
      })
      .optional(),
  })
  .strict();

export type PbpLiabilityPolicy = z.infer<typeof liabilityPolicySchema>;
