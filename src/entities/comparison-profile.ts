/*
<MODULE_CONTRACT>
<purpose>comparison-profile entity — PBP schema definition for the comparison profile entity type.</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP ComparisonProfile entity.
 *
 * @see pbp-specification-package/entity-model §32 (ComparisonProfile)
 * @see RFC-0440
 */

import type { PbpEntity } from "../envelope.ts";
import type { PbpEntityRef } from "../entity-ref.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const COMPARISON_PROFILE_SCHEMA_ID = pbpSchemaId("comparison-profile");

export type PbpComparisonValueType =
  "money" | "recurring-money" | "derived-money" | "duration" | "controlled-value";

export const PBP_COMPARISON_VALUE_TYPES: readonly PbpComparisonValueType[] = [
  "money",
  "recurring-money",
  "derived-money",
  "duration",
  "controlled-value",
] as const;

export function isPbpComparisonValueType(value: string): value is PbpComparisonValueType {
  return PBP_COMPARISON_VALUE_TYPES.includes(value as PbpComparisonValueType);
}

export interface PbpComparisonDimension {
  valueType: PbpComparisonValueType;
  selectorRef?: string;
  derivationRef?: string;
  required?: boolean;
}

export interface PbpComparisonProfile extends PbpEntity {
  type: "comparison-profile";
  name: string;
  appliesToCategoryRefs: Record<string, PbpEntityRef>;
  dimensions: Record<string, PbpComparisonDimension>;
}
