/*
<MODULE_CONTRACT>
<purpose>entity-ref — PBP entity reference type used to link entities across the graph.</purpose>
<non-goals>
  <item>Do not resolve references — this module defines the reference shape.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP EntityRef and identity relation types.
 *
 * @see pbp-specification-package/entity-model §4.1 (EntityRef)
 * @see pbp-specification-package/system-spec §5.5 (Identity equivalence)
 * @see RFC-0399
 */

export interface PbpEntityRef {
  ref: string;
  expectedType?: string;
}

export type PbpIdentityRelation =
  "sameIdentityAs" | "equivalentTo" | "similarTo" | "supersedes" | "derivedFrom";

export const PBP_IDENTITY_RELATIONS: readonly PbpIdentityRelation[] = [
  "sameIdentityAs",
  "equivalentTo",
  "similarTo",
  "supersedes",
  "derivedFrom",
] as const;
