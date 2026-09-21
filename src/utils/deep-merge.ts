/*
<MODULE_CONTRACT>
<purpose>Shared deep-merge utility with JSON Merge Patch (RFC 7386) semantics for PBP entities.</purpose>
<non-goals>
  <item>Does not perform schema validation — callers must validate the merged result.</item>
  <item>Does not handle diff path tracking — that stays in locale.ts findDiffPaths.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

/**
 * Guard that returns true for plain objects (not arrays, not class instances).
 * Uses Object.prototype.toString to exclude Date, RegExp, Map, Set, etc.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Deep merge with JSON Merge Patch (RFC 7386) semantics:
 *
 * - `null` in overlay → delete the key from the result
 * - `undefined` in overlay → skip (retain the base value)
 * - Plain objects → merge recursively
 * - Arrays and primitives → replace wholesale
 *
 * The result is a new object; neither input is mutated.
 */
export function deepMerge<T>(base: T, overlay: Partial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(overlay)) {
    return (overlay ?? base) as T;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const key of Object.keys(overlay)) {
    const overlayVal = (overlay as Record<string, unknown>)[key];

    if (overlayVal === null) {
      delete result[key];
      continue;
    }

    if (overlayVal === undefined) {
      continue;
    }

    const baseVal = (base as Record<string, unknown>)[key];

    if (isPlainObject(baseVal) && isPlainObject(overlayVal)) {
      result[key] = deepMerge(baseVal, overlayVal);
    } else {
      result[key] = overlayVal;
    }
  }

  return result as T;
}
