/*
<MODULE_CONTRACT>
<purpose>price-changes-policy entity — canonical PBP price-changes policy contract: Zod schema, inferred types (RFC-1155, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
  <item>Do not redeclare the inherited terms record — policySchema already carries it.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1155: created specialized price-changes policy schema — price-fix period, announcement notice and exit right.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Price Changes Policy specialized schema.
 *
 * Canonical home for price-adjustment contract terms: price-fix period,
 * announcement notice lead time, and the customer's exit right on change.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-1155
 */

import { z } from "zod";
import { policySchema } from "./policy.ts";
import { pbpIsoDurationSchema } from "../schemas/primitives.ts";

export const priceChangesPolicySchema = policySchema
  .extend({
    kind: z.literal("price-changes"),
    priceFixPeriod: pbpIsoDurationSchema.optional(),
    announcementNotice: pbpIsoDurationSchema.optional(),
    exitRight: z.enum(["before-effective", "cooling-off"]).optional(),
  })
  .strict();

export type PbpPriceChangesPolicy = z.infer<typeof priceChangesPolicySchema>;
export type PbpPriceChangesExitRight = z.infer<typeof priceChangesPolicySchema>["exitRight"];
