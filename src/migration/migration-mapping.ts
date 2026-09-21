/*
<MODULE_CONTRACT>
<purpose>migration-mapping — PBP legacy-to-PBP field map types for migration for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not map fields — this module defines the mapping contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Warpgogol legacy migration contract.
 *
 * @see pbp-specification-package/migration-plan
 * @see RFC-0461
 */

export interface PbpLegacyToPbpFieldMap {
  legacyPath: string;
  pbpPath: string;
  transformation?: string;
}

export interface PbpMigrationMapping {
  legacyEntity: string;
  pbpEntity: string;
  fieldMaps: PbpLegacyToPbpFieldMap[];
  status: "pending" | "mapped" | "verified" | "cutover";
}
