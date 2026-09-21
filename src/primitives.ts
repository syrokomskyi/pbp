/*
<MODULE_CONTRACT>
<purpose>primitives — PBP primitive types including localized strings and shared scalars.</purpose>
<non-goals>
  <item>Do not process primitives — this module defines the primitive contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP primitive types — common value types used by all entity schemas.
 *
 * @see pbp-specification-package/entity-model §4 (Common primitives)
 * @see RFC-0400
 */

export interface PbpLocalizedString {
  value: string;
  language: string;
}

export interface PbpMoney {
  value: string;
  currency: string;
}

export interface PbpMoneyRange {
  minimum: PbpMoney;
  maximum: PbpMoney;
}

export type PbpIsoDuration = string;

export interface PbpQuantitativeDuration {
  value: number;
  unitRef: string;
}

export type PbpTimestamp = string;

export interface PbpQuantitativeValue {
  value?: string;
  minimum?: string;
  maximum?: string;
  unitRef: string;
}

export interface PbpExternalIdentifier {
  schemeRef: string;
  value: string;
  authorityRef?: string;
}

export interface PbpControlledValue {
  valueRef: string;
}
