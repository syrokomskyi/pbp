/*
<MODULE_CONTRACT>
<purpose>machine-use-policy entity — PBP schema definition for the machine use policy entity type.</purpose>
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
 * PBP MachineUsePolicy entity and AI access projection.
 *
 * @see pbp-specification-package/system-spec §25 (MachineUsePolicy)
 * @see RFC-0434
 */

import type { PbpEntity } from "../envelope.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const MACHINE_USE_POLICY_SCHEMA_ID = pbpSchemaId("machine-use-policy");

export type PbpMachineUsePermission =
  | "discovery"
  | "retrieval"
  | "indexing"
  | "summarization"
  | "quotation"
  | "attribution"
  | "source-link-requirement"
  | "training"
  | "automated-purchasing"
  | "caching"
  | "redistribution";

export const PBP_MACHINE_USE_PERMISSIONS: readonly PbpMachineUsePermission[] = [
  "discovery",
  "retrieval",
  "indexing",
  "summarization",
  "quotation",
  "attribution",
  "source-link-requirement",
  "training",
  "automated-purchasing",
  "caching",
  "redistribution",
] as const;

export function isPbpMachineUsePermission(value: string): value is PbpMachineUsePermission {
  return PBP_MACHINE_USE_PERMISSIONS.includes(value as PbpMachineUsePermission);
}

export type PbpMachineUseVerdict = "allowed" | "denied" | "conditional";

export const PBP_MACHINE_USE_VERDICTS: readonly PbpMachineUseVerdict[] = [
  "allowed",
  "denied",
  "conditional",
] as const;

export function isPbpMachineUseVerdict(value: string): value is PbpMachineUseVerdict {
  return PBP_MACHINE_USE_VERDICTS.includes(value as PbpMachineUseVerdict);
}

export interface PbpMachineUsePolicy extends PbpEntity {
  type: "machine-use-policy";
  name: string;
  permissions: Record<PbpMachineUsePermission, PbpMachineUseVerdict>;
  conditions?: Record<string, string>;
}
