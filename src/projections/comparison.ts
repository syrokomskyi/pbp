/*
<MODULE_CONTRACT>
<purpose>comparison projection — PBP projection contract for comparison surfaces for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not render — this module defines the projection contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Comparison Projection output contract.
 *
 * @see pbp-specification-package/compiler §23 (Comparison Projection)
 * @see RFC-0454
 */

import type { PbpEntityRef } from "@warpgogol/pbp/entity-ref";

export type PbpComparisonStatus = "comparable" | "incomparable" | "missing";

export const PBP_COMPARISON_STATUSES: readonly PbpComparisonStatus[] = [
  "comparable",
  "incomparable",
  "missing",
] as const;

export function isPbpComparisonStatus(value: string): value is PbpComparisonStatus {
  return PBP_COMPARISON_STATUSES.includes(value as PbpComparisonStatus);
}

export interface PbpComparisonResult {
  dimension: string;
  status: PbpComparisonStatus;
  values: Record<string, unknown>;
  reason?: string;
}

export interface PbpComparisonProjection {
  projectionTarget: "comparison";
  profileRef: PbpEntityRef;
  offeringRefs: PbpEntityRef[];
  results: PbpComparisonResult[];
}
