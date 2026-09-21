/*
<MODULE_CONTRACT>
<purpose>normalization — PBP normalization decision types for entity normalization for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not normalize entities — this module defines the decision contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Normalization contract.
 *
 * @see pbp-specification-package/migration-plan §3.6 (Decision statuses), §3.3 (Provenance)
 * @see pbp-specification-package/system-spec §3.9 (Minimize hidden inferences)
 * @see RFC-0424
 */

export type PbpNormalizationDecision =
  | "transformed"
  | "derived-not-stored"
  | "merged"
  | "discarded-as-presentation"
  | "discarded-as-duplicate"
  | "moved-private"
  | "needs-owner-decision"
  | "invalid-source"
  | "not-applicable";

export const PBP_NORMALIZATION_DECISIONS: readonly PbpNormalizationDecision[] = [
  "transformed",
  "derived-not-stored",
  "merged",
  "discarded-as-presentation",
  "discarded-as-duplicate",
  "moved-private",
  "needs-owner-decision",
  "invalid-source",
  "not-applicable",
] as const;

export function isPbpNormalizationDecision(value: string): value is PbpNormalizationDecision {
  return PBP_NORMALIZATION_DECISIONS.includes(value as PbpNormalizationDecision);
}

export interface PbpNormalizationRule {
  sourceField: string;
  targetField?: string;
  decision: PbpNormalizationDecision;
  reason: string;
  provenance: "business-declared" | "derived";
}

export interface PbpNormalizationResult {
  rules: PbpNormalizationRule[];
  unresolved: string[];
}
