/*
<MODULE_CONTRACT>
<purpose>migration — PBP migration transformation types for legacy-to-PBP moves for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not run migrations — this module defines the transformation contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP migration contract types for major version transitions.
 *
 * Defined but not enforced until @2 is created.
 *
 * @see RFC-0401
 */

export interface PbpMigrationTransformation {
  field: string;
  kind: "rename" | "type-convert" | "split" | "merge" | "remove";
  before: string;
  after: string;
  scriptRef?: string;
}

export interface PbpMigrationContract {
  fromMajor: number;
  toMajor: number;
  transformations: PbpMigrationTransformation[];
}
