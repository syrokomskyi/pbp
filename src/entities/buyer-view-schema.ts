/*
<MODULE_CONTRACT>
<purpose>buyer-view-schema entity — PBP schema definition for the buyer view schema entity type.</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP BuyerViewSchema entity.
 *
 * @see pbp-specification-package/entity-model §34 (BuyerViewSchema)
 * @see RFC-0441
 */

import type { PbpEntity } from "../envelope.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const BUYER_VIEW_SCHEMA_ID = pbpSchemaId("buyer-view-schema");

export interface PbpBuyerViewSection {
  order: number;
  required: boolean;
}

export interface PbpBuyerViewSchema extends PbpEntity {
  type: "buyer-view-schema";
  name: string;
  sections: Record<string, PbpBuyerViewSection>;
}
