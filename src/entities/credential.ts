/*
<MODULE_CONTRACT>
<purpose>credential entity — PBP schema definition for the credential entity type.</purpose>
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
 * PBP Credential entity (federated identity layer).
 *
 * @see pbp-specification-package/entity-model §28 (Credential)
 * @see pbp-specification-package/system-spec §4.2 (Federated Identity Layer)
 * @see RFC-0418
 */

import type { PbpEntity } from "../envelope.ts";
import type { PbpEntityRef } from "../entity-ref.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const CREDENTIAL_SCHEMA_ID = pbpSchemaId("credential");

export type PbpCredentialKind =
  "professional-qualification" | "certification" | "license" | "accreditation";

export const PBP_CREDENTIAL_KINDS: readonly PbpCredentialKind[] = [
  "professional-qualification",
  "certification",
  "license",
  "accreditation",
] as const;

export function isPbpCredentialKind(value: string): value is PbpCredentialKind {
  return PBP_CREDENTIAL_KINDS.includes(value as PbpCredentialKind);
}

export interface PbpCredential extends PbpEntity {
  type: "credential";
  kind: PbpCredentialKind;
  credentialTypeRef: string;
  holderRef: PbpEntityRef;
  issuerRef: PbpEntityRef;
  issuedAt: string;
  expiresAt?: string | null;
  verification?: {
    evidenceRef?: PbpEntityRef;
    verifiableCredentialRef?: string | null;
  };
}
