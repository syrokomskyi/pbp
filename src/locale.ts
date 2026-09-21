/*
<MODULE_CONTRACT>
<purpose>locale — PBP locale field policy types for localized entity fields.</purpose>
<non-goals>
  <item>Do not localize content — this module defines the policy contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Locale resolution contracts.
 *
 * @see pbp-specification-package/compiler §7 (Locale Resolution)
 * @see RFC-0406
 */

export type PbpLocaleFieldPolicy =
  "localizable" | "invariant" | "locale-variant-allowed" | "not-localized";

export type PbpLocaleResolutionStatus = "full-locale" | "full-file-fallback" | "partial-fallback";

export interface PbpFallbackEntry {
  entityId: string;
  path: string;
  sourceLocale: string;
  targetLocale: string;
  severity: "warning" | "info";
}

export interface PbpFallbackReport {
  locale: string;
  fallbacks: PbpFallbackEntry[];
}
