/*
<MODULE_CONTRACT>
<purpose>validation-errors — PBP validation severity types for entity validation for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not validate entities — this module defines the severity contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Validation severity and error code taxonomy.
 *
 * @see pbp-specification-package/compiler §12 (Semantic Validation), §13 (Validation Severity), §14 (Error Code Taxonomy)
 * @see RFC-0422
 */

export type PbpValidationSeverity = "fatal" | "error" | "warning" | "info";

export const PBP_VALIDATION_SEVERITIES: readonly PbpValidationSeverity[] = [
  "fatal",
  "error",
  "warning",
  "info",
] as const;

export function isPbpValidationSeverity(value: string): value is PbpValidationSeverity {
  return PBP_VALIDATION_SEVERITIES.includes(value as PbpValidationSeverity);
}

export type PbpErrorPrefix =
  | "PBP-PARSE"
  | "PBP-SCHEMA"
  | "PBP-ID"
  | "PBP-REF"
  | "PBP-LOC"
  | "PBP-PRODUCT"
  | "PBP-CATALOG"
  | "PBP-OFFER"
  | "PBP-PRICE"
  | "PBP-POLICY"
  | "PBP-CLAIM"
  | "PBP-DERIVE"
  | "PBP-RUNTIME"
  | "PBP-PROJECT"
  | "PBP-SIGN";

export const PBP_ERROR_PREFIXES: readonly PbpErrorPrefix[] = [
  "PBP-PARSE",
  "PBP-SCHEMA",
  "PBP-ID",
  "PBP-REF",
  "PBP-LOC",
  "PBP-PRODUCT",
  "PBP-CATALOG",
  "PBP-OFFER",
  "PBP-PRICE",
  "PBP-POLICY",
  "PBP-CLAIM",
  "PBP-DERIVE",
  "PBP-RUNTIME",
  "PBP-PROJECT",
  "PBP-SIGN",
] as const;

export function isPbpErrorPrefix(value: string): value is PbpErrorPrefix {
  return PBP_ERROR_PREFIXES.includes(value as PbpErrorPrefix);
}

export interface PbpValidationError {
  code: string;
  severity: PbpValidationSeverity;
  entityId?: string;
  locale?: string;
  path?: string;
  message: string;
}
