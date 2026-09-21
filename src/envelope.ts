/*
<MODULE_CONTRACT>
<purpose>envelope — PBP entity envelope and status types wrapping entity payloads.</purpose>
<non-goals>
  <item>Do not process payloads — the envelope only wraps them.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP entity envelope, status vocabulary, and governance block.
 *
 * @see pbp-specification-package/entity-model §3 (Entity envelope)
 * @see RFC-0399
 */

export type PbpEntityStatus = "draft" | "published" | "suspended" | "retired" | "superseded";

export const PBP_ENTITY_STATUSES: readonly PbpEntityStatus[] = [
  "draft",
  "published",
  "suspended",
  "retired",
  "superseded",
] as const;

export function isPbpEntityStatus(value: string): value is PbpEntityStatus {
  return PBP_ENTITY_STATUSES.includes(value as PbpEntityStatus);
}

export interface PbpGovernance {
  authorityRef: string;
  effectiveFrom?: string;
  reviewedAt?: string;
  reviewEvery?: string;
  maintenanceOwnerRef?: string;
}

export interface PbpEntity {
  schema: string;
  id: string;
  type: string;
  status: PbpEntityStatus;
  name?: string;
  summary?: string;
  governance?: PbpGovernance;
  locale?: string;
  /** RFC-1075: persistent canonical URI for Linked Data @id. Optional — derived from site origin + id when absent. */
  canonicalUri?: string;
}
