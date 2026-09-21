/*
<MODULE_CONTRACT>
<purpose>derivation — PBP derivation status types for derived entity fields.</purpose>
<non-goals>
  <item>Do not compute derivations — this module defines the status contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP derivation contract: pure function execution model and result envelope.
 *
 * @see pbp-specification-package/compiler §11 (Derivation Engine)
 * @see RFC-0431
 */

export type PbpDerivationStatus = "derived" | "skipped" | "failed";

export const PBP_DERIVATION_STATUSES: readonly PbpDerivationStatus[] = [
  "derived",
  "skipped",
  "failed",
] as const;

export function isPbpDerivationStatus(value: string): value is PbpDerivationStatus {
  return PBP_DERIVATION_STATUSES.includes(value as PbpDerivationStatus);
}

export type PbpDerivationMode = "exact" | "range" | "parameterized";

export const PBP_DERIVATION_MODES: readonly PbpDerivationMode[] = [
  "exact",
  "range",
  "parameterized",
] as const;

export function isPbpDerivationMode(value: string): value is PbpDerivationMode {
  return PBP_DERIVATION_MODES.includes(value as PbpDerivationMode);
}

export interface PbpDerivationProvenance {
  derivationRef: string;
  implementationVersion: string;
  inputDigests: string[];
}

export interface PbpDerivationContract {
  derivationRef: string;
  contractVersion: string;
  implementationVersion: string;
  requiredInputs: string[];
  parameters?: Record<string, unknown>;
}

export interface PbpDerivationResult {
  status: PbpDerivationStatus;
  mode: PbpDerivationMode;
  value?: unknown;
  minimum?: unknown;
  maximum?: unknown;
  formulaDescription?: string;
  requiredParameters?: Record<string, { unitRef: string }>;
  provenance: PbpDerivationProvenance;
}
