/*
<MODULE_CONTRACT>
<purpose>registry — PBP registry kind types for entity registry classification.</purpose>
<non-goals>
  <item>Do not register entities — this module defines the kind contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Registry and Resolver types.
 *
 * @see pbp-specification-package/system-spec §4.1 (Global Semantic Layer), §3.7 (Reproducibility)
 * @see RFC-0423
 */

export type PbpRegistryKind =
  | "category"
  | "comparison-profile"
  | "derivation-contract"
  | "identifier-scheme"
  | "unit-definition"
  | "metric-definition"
  | "controlled-vocabulary";

export const PBP_REGISTRY_KINDS: readonly PbpRegistryKind[] = [
  "category",
  "comparison-profile",
  "derivation-contract",
  "identifier-scheme",
  "unit-definition",
  "metric-definition",
  "controlled-vocabulary",
] as const;

export function isPbpRegistryKind(value: string): value is PbpRegistryKind {
  return PBP_REGISTRY_KINDS.includes(value as PbpRegistryKind);
}

export interface PbpRegistryEntry {
  id: string;
  kind: PbpRegistryKind;
  schema: string;
  authority: string;
  canonicalUri: string;
}

export type PbpResolverStatus = "resolved" | "not-found" | "ambiguous" | "stale";

export interface PbpResolverResult {
  ref: string;
  status: PbpResolverStatus;
  canonicalUri?: string;
  entry?: PbpRegistryEntry;
}
