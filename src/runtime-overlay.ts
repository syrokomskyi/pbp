/*
<MODULE_CONTRACT>
<purpose>runtime-overlay — PBP overlay stale behavior types for runtime overlays.</purpose>
<non-goals>
  <item>Do not apply overlays — this module defines the behavior contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Runtime State Overlay.
 *
 * @see pbp-specification-package/system-spec §4.4 (Runtime State Layer)
 * @see pbp-specification-package/compiler §10 (Runtime Overlay Resolution)
 * @see RFC-0421
 */

export type PbpOverlayStaleBehavior =
  "omit" | "show-unknown" | "show-stale-warning" | "block-transaction";

export const PBP_OVERLAY_STALE_BEHAVIORS: readonly PbpOverlayStaleBehavior[] = [
  "omit",
  "show-unknown",
  "show-stale-warning",
  "block-transaction",
] as const;

export function isPbpOverlayStaleBehavior(value: string): value is PbpOverlayStaleBehavior {
  return PBP_OVERLAY_STALE_BEHAVIORS.includes(value as PbpOverlayStaleBehavior);
}

export interface PbpRuntimeOverlay {
  schema: string;
  subjectRef: string;
  observedAt: string;
  expiresAt?: string;
  sourceRef: string;
  values: Record<string, unknown>;
}
