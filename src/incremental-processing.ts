/*
<MODULE_CONTRACT>
<purpose>incremental-processing — PBP cache key types for incremental entity processing.</purpose>
<non-goals>
  <item>Do not process entities — this module defines the cache key contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP incremental and bulk processing contract.
 *
 * @see pbp-specification-package/compiler §26 (Incremental Build), §27 (Build Reports)
 * @see RFC-0430
 */

export interface PbpCacheKey {
  entityDigest: string;
  locale: string;
  schemaSetDigest: string;
  derivationSetDigest: string;
}

export type PbpDependencyInvalidationRule =
  | "policy-change-invalidates-offerings"
  | "comparison-profile-change-invalidates-comparisons"
  | "locale-change-invalidates-locale-projections"
  | "product-name-change-invalidates-catalog-entry-display";

export const PBP_DEPENDENCY_INVALIDATION_RULES: readonly PbpDependencyInvalidationRule[] = [
  "policy-change-invalidates-offerings",
  "comparison-profile-change-invalidates-comparisons",
  "locale-change-invalidates-locale-projections",
  "product-name-change-invalidates-catalog-entry-display",
] as const;

export function isPbpDependencyInvalidationRule(
  value: string,
): value is PbpDependencyInvalidationRule {
  return PBP_DEPENDENCY_INVALIDATION_RULES.includes(value as PbpDependencyInvalidationRule);
}

export interface PbpDependencyGraph {
  nodes: Record<string, string[]>;
}

export interface PbpIncrementalBuildConfig {
  enabled: boolean;
  cacheKey: PbpCacheKey;
  dependencyGraph: PbpDependencyGraph;
}

export interface PbpBulkProcessingConfig {
  streaming: boolean;
  batchSize: number;
  maxInMemoryEntities: number;
}
