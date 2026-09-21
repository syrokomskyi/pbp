/*
<MODULE_CONTRACT>
<purpose>semantic-status — PBP semantic status types for entity semantic state.</purpose>
<non-goals>
  <item>Do not compute status — this module defines the status contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP SemanticStatus — closed vocabulary for field-value semantic state.
 *
 * Distinct from PbpEntityStatus (publication state).
 *
 * @see pbp-specification-package/entity-model §4.9 (SemanticStatus)
 * @see RFC-0400
 */

export type PbpSemanticStatus =
  | "declared"
  | "derived"
  | "not-declared"
  | "not-applicable"
  | "unavailable"
  | "invalid"
  | "stale"
  | "not-comparable";

export const PBP_SEMANTIC_STATUSES: readonly PbpSemanticStatus[] = [
  "declared",
  "derived",
  "not-declared",
  "not-applicable",
  "unavailable",
  "invalid",
  "stale",
  "not-comparable",
] as const;

export function isPbpSemanticStatus(value: string): value is PbpSemanticStatus {
  return PBP_SEMANTIC_STATUSES.includes(value as PbpSemanticStatus);
}
