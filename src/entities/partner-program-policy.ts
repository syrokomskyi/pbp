/*
<MODULE_CONTRACT>
<purpose>partner-program-policy entity — canonical PBP partner/referral program policy contract: Zod schema, inferred types (RFC-1155, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
  <item>Do not redeclare the inherited terms record — policySchema already carries it.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1155: created specialized partner-program policy schema — trusted-partner caps, referral reward/qualification/attribution periods and referred-customer benefit.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
  <item>RFC-1258: optional dated `capacity` block (month/free/total/updatedAt) — the wave-capacity fact the referral landing renders; staleness validated site-side, schema stays time-free.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Partner Program Policy specialized schema.
 *
 * Canonical home for trusted-partner and referral contract terms: max active
 * partners, exclusivity rule, reward type/period, qualification and
 * attribution windows, contact-response SLA, referred-customer benefit.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-1155
 */

import { z } from "zod";
import { policySchema } from "./policy.ts";
import { nonEmptyString, pbpIsoDurationSchema } from "../schemas/primitives.ts";

export const partnerProgramPolicySchema = policySchema
  .extend({
    kind: z.literal("partner-program"),
    trustedPartners: z
      .object({
        maxActive: z.number().int().positive().optional(),
        exclusivity: z.enum(["no-direct-competitor-same-niche"]).optional(),
      })
      .optional(),
    referral: z
      .object({
        reward: z
          .object({
            type: z.enum(["subscription-credit", "one-time-payment"]),
            periods: pbpIsoDurationSchema.optional(),
            amountRef: nonEmptyString.optional(),
          })
          .optional(),
        qualifyingPeriod: pbpIsoDurationSchema.optional(),
        attributionWindow: pbpIsoDurationSchema.optional(),
        contactResponse: pbpIsoDurationSchema.optional(),
      })
      .optional(),
    referredCustomerBenefit: z
      .object({
        freePeriod: pbpIsoDurationSchema.optional(),
        priorityStart: z.boolean().optional(),
      })
      .optional(),
    /** RFC-1258: dated wave-capacity fact — the current enrollment wave the
        referral landing's "Nächste Welle: n von m Plätzen frei" line speaks
        about. Operator-maintained; staleness/freshness is validated by
        `referral.partners.validate` (site-side), never here — this schema
        stays time-free (DNA-105). */
    capacity: z
      .object({
        month: z.string().regex(/^\d{4}-\d{2}$/),
        free: z.number().int().min(0),
        total: z.number().int().positive(),
        updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .optional(),
  })
  .strict();

export type PbpPartnerProgramPolicy = z.infer<typeof partnerProgramPolicySchema>;
