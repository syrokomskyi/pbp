/*
<MODULE_CONTRACT>
<purpose>cancellation-policy entity — canonical PBP cancellation policy contract: Zod schema, inferred types (RFC-1155, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
  <item>Do not redeclare the inherited terms record — policySchema already carries it.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1155: created specialized cancellation policy schema — ordinary/extraordinary notice periods and payment-default terms as ISO-8601 durations.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Cancellation Policy specialized schema.
 *
 * Canonical home for contract cancellation terms: ordinary notice period,
 * extraordinary notice, payment-default grace and open-balance consolidation.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-1155
 */

import { z } from "zod";
import { policySchema } from "./policy.ts";
import { nonEmptyString, pbpIsoDurationSchema } from "../schemas/primitives.ts";

export const cancellationPolicySchema = policySchema
  .extend({
    kind: z.literal("cancellation"),
    ordinaryNotice: z
      .object({
        period: pbpIsoDurationSchema,
        effective: nonEmptyString,
      })
      .optional(),
    extraordinaryNotice: z.object({ period: pbpIsoDurationSchema }).optional(),
    paymentDefault: z
      .object({
        reminderRequired: z.boolean().optional(),
        gracePeriod: pbpIsoDurationSchema.optional(),
        consolidationInterval: pbpIsoDurationSchema.optional(),
      })
      .optional(),
  })
  .strict();

export type PbpCancellationPolicy = z.infer<typeof cancellationPolicySchema>;
