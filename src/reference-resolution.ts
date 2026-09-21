/*
<MODULE_CONTRACT>
<purpose>reference-resolution — PBP reference class types for entity reference resolution.</purpose>
<non-goals>
  <item>Do not resolve references — this module defines the class contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Reference resolution and graph integrity contracts.
 *
 * @see pbp-specification-package/compiler §8 (Reference Resolution)
 * @see RFC-0407
 */

export type PbpReferenceClass = "required" | "optional" | "external-opaque" | "deferred-runtime";

export type PbpExternalRefKind =
  "trusted-registry-snapshot" | "resolvable-https" | "cached-verified-record" | "opaque-identifier";

export type PbpGraphErrorKind =
  | "missing-internal-ref"
  | "type-mismatch"
  | "cycle-detected"
  | "external-ref-unresolvable"
  | "locale-suffix-in-id";

export interface PbpGraphIntegrityError {
  kind: PbpGraphErrorKind;
  entityId: string;
  refPath: string;
  message: string;
}

export type PbpCycleCheckType =
  | "requires"
  | "category-broader"
  | "successor-chain"
  | "product-intrinsic-composition"
  | "offering-optional-relation";

export interface PbpCycleCheckResult {
  checkType: PbpCycleCheckType;
  hasCycle: boolean;
  cyclePath?: string[];
}
