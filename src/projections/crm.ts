/*
<MODULE_CONTRACT>
<purpose>crm projection — PBP projection contract for CRM payload surfaces.</purpose>
<non-goals>
  <item>Do not render — this module defines the projection contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP CRM projection contract.
 *
 * @see pbp-specification-package/compiler §22 (CRM Projection)
 * @see RFC-0433
 */

export interface PbpCrmPayload {
  businessId: string;
  catalogEntryId: string;
  offeringId: string;
  planId: string;
  charges: Record<string, unknown>;
  relatedOfferingIds: string[];
  sourceRevision: string;
}

export interface PbpCrmProjection {
  payload: PbpCrmPayload;
  projectionTarget: "crm";
}
