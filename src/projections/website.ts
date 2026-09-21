/*
<MODULE_CONTRACT>
<purpose>website projection — PBP projection contract for website surfaces for the werkstatt-site domain layer.</purpose>
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
 * PBP Website Projection contract.
 *
 * @see pbp-specification-package/compiler Phase 12 (Projection)
 * @see RFC-0455
 */

import type { PbpEntityRef } from "@warpgogol/pbp/entity-ref";
import type { PbpPriceProjection } from "./price-projection.js";

export interface PbpWebsiteProjection {
  projectionTarget: "website";
  offeringRef: PbpEntityRef;
  buyerViewSchemaRef?: PbpEntityRef;
  renderedSections: Record<string, unknown>;
  locale: string;
  /** Price projections keyed by target currency code. Only present when multi-currency is entitled (RFC-0742). */
  priceProjections?: Record<string, PbpPriceProjection>;
}
