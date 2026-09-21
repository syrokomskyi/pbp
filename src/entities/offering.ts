/*
<MODULE_CONTRACT>
<purpose>offering entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/offering.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Offering entity and supporting types.
 *
 * @see pbp-specification-package/entity-model §15 (Offering), §15.1 (Full structure)
 * @see pbp-specification-package/system-spec §9 (Offering)
 * @see RFC-0429
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpChargeSchema, pbpExternalCostSchema } from "./pricing.js";
import { pbpSchemaId } from "../schema-id.js";

export const OFFERING_SCHEMA_ID = pbpSchemaId("offering");

const pbpAvailabilityModeSchema = z.enum(["declared", "on-request", "unavailable"]);
const pbpOfferingRelationSchema = z.enum([
  "optional",
  "requires",
  "incompatibleWith",
  "alternativeTo",
  "included",
]);
const pbpOfferingAcquisitionSchema = z.enum(["standalone", "with-this-offering", "either"]);

const pbpAllowanceSchema = z.object({
  subjectRef: nonEmptyString,
  includedQuantity: z.object({ value: nonEmptyString, unitRef: nonEmptyString }).optional(),
  resetPeriod: nonEmptyString.optional(),
  overageChargeRef: nonEmptyString.optional(),
});

const pbpGuaranteeItemSchema = z.object({
  label: nonEmptyString,
  detail: nonEmptyString,
});

const pbpRelatedOfferingSchema = z.object({
  relation: pbpOfferingRelationSchema,
  offeringRef: pbpEntityRefSchema,
  acquisition: pbpOfferingAcquisitionSchema.optional(),
  label: nonEmptyString.optional(),
  description: nonEmptyString.optional(),
});

const pbpPricingSchema = z.object({
  currency: nonEmptyString,
  tax: z.record(z.string(), z.unknown()).optional(),
  charges: z.record(z.string(), pbpChargeSchema).optional(),
  externalCosts: z.record(z.string(), pbpExternalCostSchema).optional(),
  plans: z.record(z.string(), z.unknown()).optional(),
  adjustments: z.record(z.string(), z.unknown()).optional(),
});

export const offeringSchema = pbpEntitySchema
  .extend({
    type: z.literal("offering"),
    name: nonEmptyString,
    summary: nonEmptyString.optional(),
    businessRef: pbpEntityRefSchema,
    catalogEntryRef: pbpEntityRefSchema.optional(),
    audience: z
      .object({
        buyerTypes: z.record(z.string(), z.object({ valueRef: nonEmptyString })).optional(),
        segments: z.record(z.string(), z.object({ valueRef: nonEmptyString })).optional(),
      })
      .optional(),
    availability: z
      .object({
        mode: pbpAvailabilityModeSchema,
        territories: z.record(z.string(), z.object({ countryCode: nonEmptyString })).optional(),
      })
      .optional(),
    package: z
      .object({
        included: z
          .record(
            z.string(),
            z.object({
              itemRef: pbpEntityRefSchema,
              inclusion: nonEmptyString,
            }),
          )
          .optional(),
        allowances: z.record(z.string(), pbpAllowanceSchema).optional(),
      })
      .optional(),
    pricing: pbpPricingSchema.optional(),
    acquisition: z
      .object({
        channelRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
      })
      .optional(),
    fulfillment: z.record(z.string(), z.unknown()).optional(),
    customerResponsibilities: z.record(z.string(), z.unknown()).optional(),
    terms: z.record(z.string(), z.unknown()).optional(),
    policyRefs: z.record(z.string(), pbpEntityRefSchema).optional(),
    relatedOfferings: z.record(z.string(), pbpRelatedOfferingSchema).optional(),
    limitations: z.record(z.string(), z.unknown()).optional(),
    guarantees: z.record(z.string(), pbpGuaranteeItemSchema).optional(),
  })
  .strict();

export type PbpOffering = z.infer<typeof offeringSchema>;

export type PbpAvailabilityMode = z.infer<typeof pbpAvailabilityModeSchema>;
export const PBP_AVAILABILITY_MODES: readonly PbpAvailabilityMode[] =
  pbpAvailabilityModeSchema.options;

export function isPbpAvailabilityMode(value: string): value is PbpAvailabilityMode {
  return PBP_AVAILABILITY_MODES.includes(value as PbpAvailabilityMode);
}

export type PbpOfferingRelation = z.infer<typeof pbpOfferingRelationSchema>;
export const PBP_OFFERING_RELATIONS: readonly PbpOfferingRelation[] =
  pbpOfferingRelationSchema.options;

export function isPbpOfferingRelation(value: string): value is PbpOfferingRelation {
  return PBP_OFFERING_RELATIONS.includes(value as PbpOfferingRelation);
}

export type PbpOfferingAcquisition = z.infer<typeof pbpOfferingAcquisitionSchema>;
export const PBP_OFFERING_ACQUISITIONS: readonly PbpOfferingAcquisition[] =
  pbpOfferingAcquisitionSchema.options;

export function isPbpOfferingAcquisition(value: string): value is PbpOfferingAcquisition {
  return PBP_OFFERING_ACQUISITIONS.includes(value as PbpOfferingAcquisition);
}

export type PbpAllowance = z.infer<typeof pbpAllowanceSchema>;
export type PbpRelatedOffering = z.infer<typeof pbpRelatedOfferingSchema>;
export type PbpPricing = z.infer<typeof pbpPricingSchema>;
