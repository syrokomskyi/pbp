/*
<MODULE_CONTRACT>
<purpose>tax entity — PBP schema definition for the tax entity type.</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP tax treatment and buyer presentation.
 *
 * @see pbp-specification-package/entity-model §17.1 (Pricing header, tax)
 * @see RFC-0446
 */

export type PbpTaxTreatment = "not-declared" | "gross" | "net" | "vat-included";

export const PBP_TAX_TREATMENTS: readonly PbpTaxTreatment[] = [
  "not-declared",
  "gross",
  "net",
  "vat-included",
] as const;

export function isPbpTaxTreatment(value: string): value is PbpTaxTreatment {
  return PBP_TAX_TREATMENTS.includes(value as PbpTaxTreatment);
}

export interface PbpTaxJurisdiction {
  countryCode: string;
}

export interface PbpTax {
  treatment: PbpTaxTreatment;
  jurisdiction?: PbpTaxJurisdiction;
}
