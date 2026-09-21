/*
<MODULE_CONTRACT>
<purpose>first-year-cost derivation — PBP derivation computing first-year cost for offerings.</purpose>
<non-goals>
  <item>Do not price beyond year one — the derivation covers the first year only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP First-Year Cost and TCO derivation contracts.
 *
 * @see pbp-specification-package/compiler §11 (Derivation Engine), §11.3 (First-year cost)
 * @see RFC-0453
 */

export interface PbpFirstYearCostDerivation {
  derivationRef: string;
  inputs: {
    plan: string;
    period: string;
    usageParameters?: Record<string, unknown>;
  };
  output: {
    valueType: "monetary-result";
    resultModes: { exact: boolean; range: boolean; parameterized: boolean };
  };
  rounding: { mode: "currency-minor-unit" };
}

export interface PbpTcoDerivation {
  derivationRef: string;
  inputs: {
    plan: string;
    period: string;
    usageParameters?: Record<string, unknown>;
  };
  output: {
    valueType: "monetary-result";
    resultModes: { exact: boolean; range: boolean; parameterized: boolean };
  };
  rounding: { mode: "currency-minor-unit" };
}
