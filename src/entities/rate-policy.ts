/*
<MODULE_CONTRACT>
<purpose>rate-policy entity — canonical PBP rate policy/schedule contracts: Zod schemas, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schemas from schemas/rate-policy.ts — schemas canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP RatePolicy and RateSchedule entities — rate source and schedule definitions.
 *
 * @see RFC-0737
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString, decimalString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const RATE_POLICY_SCHEMA_ID = pbpSchemaId("rate-policy");
export const RATE_SCHEDULE_SCHEMA_ID = pbpSchemaId("rate-schedule");

export const pbpRateModeSchema = z.enum(["external", "business-fixed"]);

export const pbpRateDirectionSchema = z.enum(["target-per-source", "source-per-target"]);

export const pbpCurrencyPairSchema = z.object({
  sourceCurrency: nonEmptyString,
  targetCurrency: nonEmptyString,
});

export const pbpQuotationSchema = z.object({
  direction: pbpRateDirectionSchema,
});

export const pbpRatePolicySchema = pbpEntitySchema
  .extend({
    type: z.literal("rate-policy"),
    pair: pbpCurrencyPairSchema,
    quotation: pbpQuotationSchema,
    mode: pbpRateModeSchema,
    sources: z
      .object({
        primary: pbpEntityRefSchema,
        fallback: pbpEntityRefSchema.optional(),
      })
      .optional(),
    freshness: z.object({
      maximumAge: nonEmptyString,
      allowLastKnownValue: z.boolean(),
    }),
    failure: z.object({
      noAcceptableRate: z.enum(["source-price-only", "block-publication"]),
    }),
  })
  .strict();

export const pbpRateScheduleEntrySchema = z.object({
  value: decimalString,
  validFrom: nonEmptyString,
});

export const pbpRateScheduleSchema = pbpEntitySchema
  .extend({
    type: z.literal("rate-schedule"),
    pair: pbpCurrencyPairSchema,
    quotation: pbpQuotationSchema,
    entries: z
      .record(z.string(), pbpRateScheduleEntrySchema)
      .refine((val) => Object.keys(val).length >= 1, {
        message: "entries must have at least one entry",
      }),
  })
  .strict();

export type PbpRateMode = z.infer<typeof pbpRateModeSchema>;
export const PBP_RATE_MODES: readonly PbpRateMode[] = pbpRateModeSchema.options;

export function isPbpRateMode(value: string): value is PbpRateMode {
  return PBP_RATE_MODES.includes(value as PbpRateMode);
}

export type PbpRateDirection = z.infer<typeof pbpRateDirectionSchema>;
export const PBP_RATE_DIRECTIONS: readonly PbpRateDirection[] = pbpRateDirectionSchema.options;

export function isPbpRateDirection(value: string): value is PbpRateDirection {
  return PBP_RATE_DIRECTIONS.includes(value as PbpRateDirection);
}

export type PbpCurrencyPair = z.infer<typeof pbpCurrencyPairSchema>;
export type PbpQuotation = z.infer<typeof pbpQuotationSchema>;
export type PbpRatePolicy = z.infer<typeof pbpRatePolicySchema>;
export type PbpRateScheduleEntry = z.infer<typeof pbpRateScheduleEntrySchema>;
export type PbpRateSchedule = z.infer<typeof pbpRateScheduleSchema>;
