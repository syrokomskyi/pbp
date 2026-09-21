/*
<MODULE_CONTRACT>
<purpose>compiler-pipeline — PBP compiler phase pipeline driving entity compilation stages.</purpose>
<non-goals>
  <item>Do not compile entities inline — phases are composed by the pipeline.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP compiler pipeline contract: phases, build context, and source inventory.
 *
 * @see pbp-specification-package/compiler §1 (Purpose), §2 (Components),
 *      §3 (Inputs), §4 (Build context), §5 (Pipeline), §6 (Source inventory)
 * @see RFC-0428
 */

export type PbpCompilerPhase =
  | "discover"
  | "parse"
  | "raw-schema-validation"
  | "build-entity-index"
  | "locale-resolution"
  | "reference-resolution"
  | "profile-resolution"
  | "runtime-overlays"
  | "derivations"
  | "semantic-validation"
  | "buyer-view"
  | "projection"
  | "canonical-snapshot"
  | "publication";

export const PBP_COMPILER_PHASES: readonly PbpCompilerPhase[] = [
  "discover",
  "parse",
  "raw-schema-validation",
  "build-entity-index",
  "locale-resolution",
  "reference-resolution",
  "profile-resolution",
  "runtime-overlays",
  "derivations",
  "semantic-validation",
  "buyer-view",
  "projection",
  "canonical-snapshot",
  "publication",
] as const;

export function isPbpCompilerPhase(value: string): value is PbpCompilerPhase {
  return PBP_COMPILER_PHASES.includes(value as PbpCompilerPhase);
}

export type PbpBuildStrictness = "production" | "migration";

export const PBP_BUILD_STRICTNESSES: readonly PbpBuildStrictness[] = [
  "production",
  "migration",
] as const;

export function isPbpBuildStrictness(value: string): value is PbpBuildStrictness {
  return PBP_BUILD_STRICTNESSES.includes(value as PbpBuildStrictness);
}

export interface PbpBuildContext {
  buildId: string;
  sourceRevision: string;
  buildTime: string;
  locale: string;
  defaultLocale: string;
  schemaSetDigest: string;
  derivationSetDigest: string;
  runtimeSnapshotId: string | null;
}

export interface PbpSourceInventoryEntry {
  physicalPath: string;
  entityId: string;
  schema: string;
  locale: string;
  contentDigest: string;
}

export interface PbpSourceInventoryReport {
  sources: PbpSourceInventoryEntry[];
  recordsDiscovered: number;
  recordsBySchema: Record<string, number>;
}
