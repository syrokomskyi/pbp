/*
<MODULE_CONTRACT>
<purpose>package-manifest — PBP locale profile types for package manifests for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not build manifests — this module defines the profile contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP package manifest, locale profile, and build config types.
 *
 * @see pbp-specification-package/compiler §3.1 (Package manifest), §3.3 (Build request)
 * @see pbp-specification-package/decision-log ADR-026
 * @see RFC-0402
 */

import type { PbpEntityRef } from "./entity-ref.ts";

export interface PbpLocaleProfile {
  sourceRef: string;
  fallbackRef?: string;
}

export interface PbpBuildConfig {
  strict: boolean;
  failOnWarnings: boolean;
}

export interface PbpPackageManifest {
  schema: string;
  id: string;
  defaultLocale: string;
  locales: Record<string, PbpLocaleProfile>;
  sources: Record<string, { sourceRef?: string; path?: string; type: string }>;
  registries?: Record<string, { sourceRef: string }>;
  buyerViewSchemaRef?: PbpEntityRef;
  build: PbpBuildConfig;
}

export interface PbpBuildRequest {
  locale: string;
  asOf?: string;
  projectionTargets: string[];
  includeRuntimeState: boolean;
  strictness: "production" | "migration";
}
