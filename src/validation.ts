/*
<MODULE_CONTRACT>
<purpose>validation — PBP validation helpers and shared validation patterns for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not define entity schemas — validation consumes them.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP validation utilities — decimal, money range, HTML, empty value.
 *
 * @see pbp-specification-package/entity-model §4.3 (Decimal), §4.5 (MoneyRange)
 * @see pbp-specification-package/decision-log ADR-012, ADR-037, ADR-038
 * @see RFC-0400
 */

import type { PbpMoneyRange } from "./primitives.ts";

export const DECIMAL_RE = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;

export function validateDecimal(value: string): boolean {
  return DECIMAL_RE.test(value);
}

export function validateMoneyRange(
  range: PbpMoneyRange,
): { ok: true } | { ok: false; reason: string } {
  if (range.minimum.currency !== range.maximum.currency) {
    return {
      ok: false,
      reason: `Currency mismatch: minimum="${range.minimum.currency}", maximum="${range.maximum.currency}". Both bounds MUST use the same currency.`,
    };
  }
  return { ok: true };
}

const HTML_TAG_RE = /<[a-z][\s\S]*?>/i;

export function containsHtml(value: string): boolean {
  return HTML_TAG_RE.test(value);
}

export function isEmptyValue(value: string): boolean {
  return value.trim() === "";
}
