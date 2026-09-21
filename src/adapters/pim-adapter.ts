/*
<MODULE_CONTRACT>
<purpose>pim-adapter — PBP adapter mapping PIM entities into the PBP entity model.</purpose>
<non-goals>
  <item>Do not persist entities — the adapter only maps shapes.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP PIM/Shopify adapter profile.
 *
 * @see pbp-specification-package/compiler — source adapters
 * @see RFC-0443
 */

export interface PbpPimEntityMapping {
  sourceType: string;
  targetSchema: string;
  fieldMappings: Record<string, string>;
  transformationRefs?: string[];
}

export interface PbpPimAdapterProfile {
  adapterType: "shopify" | "pim";
  sourceSystem: string;
  entityMappings: PbpPimEntityMapping[];
}

export interface PbpShopifyAdapterProfile extends PbpPimAdapterProfile {
  adapterType: "shopify";
  shopDomain: string;
  apiVersion: string;
  collectionMappings: Record<string, string>;
}
