/*
<MODULE_CONTRACT>
<purpose>uri — PBP URI validation types for entity identifier validation.</purpose>
<non-goals>
  <item>Do not validate URIs — this module defines the validation contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP URI validation utility.
 *
 * @see pbp-specification-package/system-spec §5.1 (Identity and URI)
 * @see RFC-0399
 */

export interface PbpUriValidationOk {
  ok: true;
}

export interface PbpUriValidationFail {
  ok: false;
  reason: string;
}

export type PbpUriValidationResult = PbpUriValidationOk | PbpUriValidationFail;

const DEFAULT_ALLOWED_SCHEMES = ["https"] as const;

const LOCALE_MARKER_RE = /\/(de|en|fr|es|it|nl|pl|ru|uk|pt|tr|ar|zh|ja|ko)\//i;
const ARRAY_INDEX_RE = /\/\d+(\/|$)/;
const FILE_PATH_RE = /^(\.\.?\/|\/(?:home|usr|var|tmp|src|packages|docs|apps)\b)/;

export function validatePbpUri(
  uri: string,
  options?: { allowedSchemes?: string[] },
): PbpUriValidationResult {
  const allowedSchemes = options?.allowedSchemes ?? [...DEFAULT_ALLOWED_SCHEMES];

  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    return { ok: false, reason: "Not a valid absolute URI." };
  }

  const scheme = parsed.protocol.replace(/:$/, "").toLowerCase();
  if (!allowedSchemes.includes(scheme)) {
    return {
      ok: false,
      reason: `Scheme "${scheme}" not allowed. Allowed: ${allowedSchemes.join(", ")}.`,
    };
  }

  if (LOCALE_MARKER_RE.test(parsed.pathname)) {
    return {
      ok: false,
      reason:
        "URI must not contain locale markers (e.g. /de/, /en/). IDs are locale-independent (ADR-025).",
    };
  }

  if (ARRAY_INDEX_RE.test(parsed.pathname)) {
    return {
      ok: false,
      reason: "URI must not contain array indices.",
    };
  }

  if (FILE_PATH_RE.test(uri)) {
    return {
      ok: false,
      reason: "URI must not use local file paths as semantic IDs.",
    };
  }

  return { ok: true };
}
