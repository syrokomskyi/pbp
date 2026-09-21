/*
<MODULE_CONTRACT>
<purpose>guarantee-policy entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/guarantee-policy.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Guarantee Policy specialized schema.
 *
 * @see pbp-specification-package/entity-model §22 (Guarantee Policy)
 * @see RFC-0448
 */

import { z } from "zod";
import { policySchema } from "./policy.js";
import { nonEmptyString } from "../schemas/primitives.js";

const pbpGuaranteeOperatorSchema = z.enum([
  "less-than-or-equal",
  "greater-than-or-equal",
  "equals",
]);

const pbpGuaranteeRemedyTypeSchema = z.enum(["continued-performance", "service-credit", "refund"]);

const pbpGuaranteeConditionSchema = z.object({
  trigger: z.object({ event: nonEmptyString }),
  objective: z.object({
    metricRef: nonEmptyString,
    operator: pbpGuaranteeOperatorSchema,
    threshold: z.object({ value: nonEmptyString, unitRef: nonEmptyString }),
  }),
});

const pbpGuaranteeRemedySchema = z.object({
  type: pbpGuaranteeRemedyTypeSchema,
  additionalCharge: z.boolean(),
  until: nonEmptyString,
});

export const guaranteePolicySchema = policySchema
  .extend({
    kind: z.literal("guarantee"),
    condition: pbpGuaranteeConditionSchema,
    remedy: pbpGuaranteeRemedySchema,
  })
  .strict();

export type PbpGuaranteePolicy = z.infer<typeof guaranteePolicySchema>;

export type PbpGuaranteeOperator = z.infer<typeof pbpGuaranteeOperatorSchema>;
export const PBP_GUARANTEE_OPERATORS: readonly PbpGuaranteeOperator[] =
  pbpGuaranteeOperatorSchema.options;

export function isPbpGuaranteeOperator(value: string): value is PbpGuaranteeOperator {
  return PBP_GUARANTEE_OPERATORS.includes(value as PbpGuaranteeOperator);
}

export type PbpGuaranteeRemedyType = z.infer<typeof pbpGuaranteeRemedyTypeSchema>;
export const PBP_GUARANTEE_REMEDY_TYPES: readonly PbpGuaranteeRemedyType[] =
  pbpGuaranteeRemedyTypeSchema.options;

export function isPbpGuaranteeRemedyType(value: string): value is PbpGuaranteeRemedyType {
  return PBP_GUARANTEE_REMEDY_TYPES.includes(value as PbpGuaranteeRemedyType);
}

export type PbpGuaranteeCondition = z.infer<typeof pbpGuaranteeConditionSchema>;
export type PbpGuaranteeRemedy = z.infer<typeof pbpGuaranteeRemedySchema>;
