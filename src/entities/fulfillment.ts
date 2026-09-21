/*
<MODULE_CONTRACT>
<purpose>fulfillment entity — PBP schema definition for the fulfillment entity type.</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP fulfillment, shipping, pickup and return.
 *
 * @see pbp-specification-package/entity-model §18 (Fulfillment and Buyer Responsibilities)
 * @see RFC-0451
 */

import type { PbpEntityRef } from "../entity-ref.js";

export type PbpFulfillmentMode =
  "service-delivery" | "digital-delivery" | "physical-shipping" | "pickup" | "hybrid";

export const PBP_FULFILLMENT_MODES: readonly PbpFulfillmentMode[] = [
  "service-delivery",
  "digital-delivery",
  "physical-shipping",
  "pickup",
  "hybrid",
] as const;

export function isPbpFulfillmentMode(value: string): value is PbpFulfillmentMode {
  return PBP_FULFILLMENT_MODES.includes(value as PbpFulfillmentMode);
}

export interface PbpFulfillment {
  mode: PbpFulfillmentMode;
  startTrigger?: { event: string };
  target?: { duration: { value: string; unitRef: string } };
  deliveryMethods?: Record<string, { valueRef: string }>;
  returnPolicy?: { policyRef: PbpEntityRef };
}

export interface PbpCustomerResponsibility {
  requirementRef: string;
}
