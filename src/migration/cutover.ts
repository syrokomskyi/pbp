/*
<MODULE_CONTRACT>
<purpose>cutover — PBP migration coverage report types for cutover verification.</purpose>
<non-goals>
  <item>Do not cut over — this module defines the coverage report contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Migration Coverage and Cutover contract.
 *
 * @see pbp-specification-package/migration-plan
 * @see RFC-0462
 */

export interface PbpMigrationCoverageReport {
  totalLegacyEntities: number;
  mappedEntities: number;
  unmappedEntities: string[];
  verifiedEntities: number;
  coveragePercentage: number;
}

export interface PbpCutoverChecklist {
  allEntitiesMapped: boolean;
  allEntitiesVerified: boolean;
  noSiteImportsFromLegacy: boolean;
  legacyTestsPass: boolean;
  pbpTestsPass: boolean;
  ready: boolean;
}
