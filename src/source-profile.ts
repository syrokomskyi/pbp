/*
<MODULE_CONTRACT>
<purpose>source-profile — PBP source adapter types for entity source profiles.</purpose>
<non-goals>
  <item>Do not adapt sources — this module defines the adapter contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP source profile and adapter type definitions.
 *
 * @see pbp-specification-package/compiler §3.2 (Source adapters)
 * @see RFC-0402
 */

export type PbpSourceAdapterType =
  | "manifest-directory"
  | "jsonl-dataset"
  | "sql-adapter"
  | "external-api-adapter"
  | "runtime-overlay-adapter";

export const PBP_SOURCE_ADAPTER_TYPES: readonly PbpSourceAdapterType[] = [
  "manifest-directory",
  "jsonl-dataset",
  "sql-adapter",
  "external-api-adapter",
  "runtime-overlay-adapter",
] as const;

export function isPbpSourceAdapterType(value: string): value is PbpSourceAdapterType {
  return PBP_SOURCE_ADAPTER_TYPES.includes(value as PbpSourceAdapterType);
}

export interface PbpSourceProfile {
  type: PbpSourceAdapterType;
  path?: string;
  sourceRef?: string;
}
