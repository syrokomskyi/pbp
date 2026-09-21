/*
<MODULE_CONTRACT>
<purpose>quote-contract projection — PBP projection contract for quote input surfaces.</purpose>
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
 * PBP Quote and Contract Input projection contracts.
 *
 * @see pbp-specification-package/compiler §19 (Quote and Contract Input Projections)
 * @see RFC-0457
 */

import type { PbpEntityRef } from "@warpgogol/pbp/entity-ref";

export interface PbpQuoteInput {
  projectionTarget: "quote";
  offeringRef: PbpEntityRef;
  planRef?: string;
  charges: Record<string, unknown>;
  terms?: Record<string, unknown>;
  locale: string;
}

export interface PbpContractInput {
  projectionTarget: "contract";
  offeringRef: PbpEntityRef;
  planRef?: string;
  charges: Record<string, unknown>;
  terms: Record<string, unknown>;
  policyRefs: PbpEntityRef[];
  locale: string;
}
