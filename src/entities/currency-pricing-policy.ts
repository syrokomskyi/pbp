/*
<MODULE_CONTRACT>
<purpose>currency-pricing-policy entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/currency-pricing-policy.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP CurrencyPricingPolicy entity — business-level currency strategy.
 *
 * @see RFC-0736
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const CURRENCY_PRICING_POLICY_SCHEMA_ID = pbpSchemaId("currency-pricing-policy");

export const pbpCurrentUsesSchema = z.object({
  presentation: z.boolean(),
  aiAnswers: z.boolean(),
  quote: z.boolean(),
  contract: z.boolean(),
  invoice: z.boolean(),
  settlement: z.boolean(),
});

export const pbpCurrencyStrategySchema = z.enum(["derived", "fixed"]);

export const pbpRoundingOverrideSchema = z.object({
  mode: z.enum(["ceiling", "floor", "half-up", "half-even"]),
  increment: z.string().optional(),
  decimalPlaces: z.number().optional(),
});

export const pbpPipelineOverrideSchema = z.object({
  rounding: pbpRoundingOverrideSchema.optional(),
});

export const pbpCurrencyTargetSchema = z.object({
  currency: nonEmptyString,
  strategy: pbpCurrencyStrategySchema,
  derivationContractRef: pbpEntityRefSchema.optional(),
  ratePolicyRef: pbpEntityRefSchema.optional(),
  pipelineOverride: pbpPipelineOverrideSchema.optional(),
  currentUses: pbpCurrentUsesSchema,
});

export const pbpCurrencyPricingPolicySchema = pbpEntitySchema
  .extend({
    type: z.literal("currency-pricing-policy"),
    businessRef: pbpEntityRefSchema,
    baseCurrency: nonEmptyString,
    targetCurrencies: z
      .record(z.string(), pbpCurrencyTargetSchema)
      .refine((val) => Object.keys(val).length >= 1, {
        message: "targetCurrencies must have at least one entry",
      }),
  })
  .strict();

export type PbpCurrencyPricingPolicy = z.infer<typeof pbpCurrencyPricingPolicySchema>;

export type PbpCurrencyStrategy = z.infer<typeof pbpCurrencyStrategySchema>;
export const PBP_CURRENCY_STRATEGIES: readonly PbpCurrencyStrategy[] =
  pbpCurrencyStrategySchema.options;

export function isPbpCurrencyStrategy(value: string): value is PbpCurrencyStrategy {
  return PBP_CURRENCY_STRATEGIES.includes(value as PbpCurrencyStrategy);
}

export type PbpCurrentUses = z.infer<typeof pbpCurrentUsesSchema>;
export type PbpCurrencyTarget = z.infer<typeof pbpCurrencyTargetSchema>;
