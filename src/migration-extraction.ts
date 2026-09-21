/*
<MODULE_CONTRACT>
<purpose>migration-extraction — PBP legacy source file types for migration extraction.</purpose>
<non-goals>
  <item>Do not extract content — this module defines the source file contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Legacy extraction contract types.
 *
 * @see pbp-specification-package/migration-plan §2, §3
 * @see RFC-0408
 */

export interface PbpLegacySourceFile {
  file: string;
  currentRole: string;
  problem: string;
}

export type PbpMigrationDecision =
  "extracted" | "needs-owner-decision" | "deferred" | "not-applicable";

export interface PbpUnresolvedItem {
  field: string;
  reason: string;
  sourceFile: string;
}

export interface PbpExtractionResult {
  sourceFile: string;
  targetEntities: string[];
  decisions: Record<string, PbpMigrationDecision>;
  unresolved: PbpUnresolvedItem[];
}
