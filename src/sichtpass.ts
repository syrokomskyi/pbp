/*
<MODULE_CONTRACT>
<purpose>sichtpass — PBP verifiable credential mapping types for sichtpass integration.</purpose>
<non-goals>
  <item>Do not issue credentials — this module defines the mapping contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Sichtpass / Verifiable Credential mapping.
 *
 * @see pbp-specification-package/compiler Phase 14 (Publication)
 * @see RFC-0460
 */

import type { PbpEntityRef } from "./entity-ref.ts";
import type { PbpSignatureAlgorithm } from "./signature.js";

export interface PbpVerifiableCredentialMapping {
  vcType: string;
  entityRef: PbpEntityRef;
  claimMapping: Record<string, string>;
  proofType: PbpSignatureAlgorithm;
}

export interface PbpSichtpassMapping {
  publicationSnapshotRef: string;
  credentialMappings: PbpVerifiableCredentialMapping[];
  issuerRef: PbpEntityRef;
}
