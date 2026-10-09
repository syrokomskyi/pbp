/*
<MODULE_CONTRACT>
<purpose>pricing entity — canonical PBP pricing contracts: Zod schemas, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schemas from schemas/pricing.ts — schemas canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP pricing core: Charge, Plan, Adjustment.
 *
 * @see pbp-specification-package/entity-model §17 (Pricing model)
 * @see RFC-0437
 */

import { z } from "zod";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, decimalString } from "../schemas/primitives.ts";

const pbpChargeTypeSchema = z.enum(["one-time", "recurring", "usage", "deposit"]);
const pbpAmountModelSchema = z.enum(["fixed", "range", "tiered", "unit-rate"]);
const pbpTierMethodSchema = z.enum(["graduated", "volume"]);

const pbpChargeAmountSchema = z.discriminatedUnion("model", [
  z.object({ model: z.literal("fixed"), value: decimalString }),
  z.object({ model: z.literal("range"), minimum: decimalString, maximum: decimalString }),
  z.object({ model: z.literal("unit-rate"), unitValue: decimalString }),
  z.object({
    model: z.literal("tiered"),
    method: pbpTierMethodSchema,
    tiers: z.record(
      z.string(),
      z.object({
        order: z.number(),
        upTo: nonEmptyString.optional(),
        above: nonEmptyString.optional(),
        unitValue: decimalString,
      }),
    ),
  }),
]);

export const pbpChargeSchema = z.object({
  type: pbpChargeTypeSchema,
  purpose: nonEmptyString,
  amount: pbpChargeAmountSchema,
  trigger: z.object({ event: nonEmptyString }).optional(),
  recurrence: nonEmptyString.optional(),
  basis: z.object({ metricRef: nonEmptyString, unitRef: nonEmptyString }).optional(),
  refundPolicyRef: pbpEntityRefSchema.optional(),
  determination: z.object({ method: nonEmptyString, beforePurchase: z.boolean() }).optional(),
});

export const pbpPlanSchema = z.object({
  name: nonEmptyString,
  chargeRefs: z.record(z.string(), z.object({ ref: nonEmptyString })),
  billing: z.object({ recurrence: nonEmptyString, billingDay: z.number().optional() }),
  terms: z
    .object({
      minimumTerm: nonEmptyString.optional(),
      renewal: z.object({ mode: nonEmptyString, period: nonEmptyString }).optional(),
    })
    .optional(),
});

const pbpAdjustmentTypeSchema = z.enum(["discount", "surcharge", "waiver"]);

export const pbpAdjustmentSchema = z.object({
  type: pbpAdjustmentTypeSchema,
  calculation: z.object({
    model: z.enum(["fixed", "percentage"]),
    value: nonEmptyString,
  }),
  appliesWhen: z.object({ planRef: nonEmptyString.optional() }).optional(),
  appliesTo: z
    .object({ chargeRefs: z.record(z.string(), z.object({ ref: nonEmptyString })) })
    .optional(),
});

const pbpExternalCostAmountSchema = z.discriminatedUnion("model", [
  z.object({ model: z.literal("fixed"), value: decimalString }),
  z.object({ model: z.literal("cap"), value: decimalString }),
  z.object({ model: z.literal("range"), minimum: decimalString, maximum: decimalString }),
]);

const pbpExternalCostPaidBySchema = z.enum(["provider", "client"]);

export const pbpExternalCostSchema = z.object({
  purpose: nonEmptyString,
  amount: pbpExternalCostAmountSchema,
  paidBy: pbpExternalCostPaidBySchema,
  recurrence: nonEmptyString.optional(),
  note: nonEmptyString.optional(),
});

export type PbpChargeType = z.infer<typeof pbpChargeTypeSchema>;
export const PBP_CHARGE_TYPES: readonly PbpChargeType[] = pbpChargeTypeSchema.options;

export function isPbpChargeType(value: string): value is PbpChargeType {
  return PBP_CHARGE_TYPES.includes(value as PbpChargeType);
}

export type PbpAmountModel = z.infer<typeof pbpAmountModelSchema>;
export const PBP_AMOUNT_MODELS: readonly PbpAmountModel[] = pbpAmountModelSchema.options;

export function isPbpAmountModel(value: string): value is PbpAmountModel {
  return PBP_AMOUNT_MODELS.includes(value as PbpAmountModel);
}

export type PbpTierMethod = z.infer<typeof pbpTierMethodSchema>;
export const PBP_TIER_METHODS: readonly PbpTierMethod[] = pbpTierMethodSchema.options;

export type PbpChargeAmount = z.infer<typeof pbpChargeAmountSchema>;
export type PbpCharge = z.infer<typeof pbpChargeSchema>;
export type PbpPlan = z.infer<typeof pbpPlanSchema>;

export type PbpAdjustmentType = z.infer<typeof pbpAdjustmentTypeSchema>;
export const PBP_ADJUSTMENT_TYPES: readonly PbpAdjustmentType[] = pbpAdjustmentTypeSchema.options;

export function isPbpAdjustmentType(value: string): value is PbpAdjustmentType {
  return PBP_ADJUSTMENT_TYPES.includes(value as PbpAdjustmentType);
}

export type PbpAdjustment = z.infer<typeof pbpAdjustmentSchema>;

export type PbpExternalCostAmount = z.infer<typeof pbpExternalCostAmountSchema>;
export type PbpExternalCostPaidBy = z.infer<typeof pbpExternalCostPaidBySchema>;
export type PbpExternalCost = z.infer<typeof pbpExternalCostSchema>;
