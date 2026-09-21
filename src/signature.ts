/*
<MODULE_CONTRACT>
<purpose>signature — PBP signature algorithm types for entity signing for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not sign entities — this module defines the algorithm contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Signature Envelope contract.
 *
 * @see pbp-specification-package/compiler Phase 14 (Publication), §24.4 (Signature)
 * @see RFC-0459
 */

export type PbpSignatureAlgorithm = "ed25519" | "rsa-pss-sha256" | "ecdsa-p256-sha256";

export const PBP_SIGNATURE_ALGORITHMS: readonly PbpSignatureAlgorithm[] = [
  "ed25519",
  "rsa-pss-sha256",
  "ecdsa-p256-sha256",
] as const;

export function isPbpSignatureAlgorithm(value: string): value is PbpSignatureAlgorithm {
  return PBP_SIGNATURE_ALGORITHMS.includes(value as PbpSignatureAlgorithm);
}

export interface PbpSignatureEnvelope {
  algorithm: PbpSignatureAlgorithm;
  value: string;
  publicKeyRef?: string;
  signedAt: string;
}
