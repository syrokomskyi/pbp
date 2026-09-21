/*
<MODULE_CONTRACT>
<purpose>Phase 4: Builds a locale-aware Map keyed by entity ID, mapping to locale → entity.</purpose>
<non-goals>
  <item>Does not resolve locales — that is Phase 5 (locale.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-0781 — Changed to locale-aware Map&lt;string, Map&lt;string, PbpEntity&gt;&gt; with PBP-ID-LOCALE-DUPLICATE.</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

import type { PbpEntity } from "../envelope.ts";
import type { PbpValidationError } from "../validation-errors.js";

export type LocaleAwareEntityIndex = Map<string, Map<string, PbpEntity>>;

export interface EntityIndexResult {
  index: LocaleAwareEntityIndex;
  errors: PbpValidationError[];
}

export async function buildEntityIndex(entities: PbpEntity[]): Promise<EntityIndexResult> {
  const index: LocaleAwareEntityIndex = new Map();
  const errors: PbpValidationError[] = [];

  const sorted = [...entities].sort((a, b) => a.id.localeCompare(b.id));

  for (const entity of sorted) {
    const localeKey = entity.locale ?? "";

    let localeMap = index.get(entity.id);
    if (!localeMap) {
      localeMap = new Map<string, PbpEntity>();
      index.set(entity.id, localeMap);
    }

    if (localeMap.has(localeKey)) {
      errors.push({
        code: "PBP-ID-LOCALE-DUPLICATE",
        severity: "fatal",
        entityId: entity.id,
        locale: entity.locale,
        message: `Duplicate entity ID "${entity.id}" for locale "${localeKey}".`,
      });
      continue;
    }
    localeMap.set(localeKey, entity);
  }

  return { index, errors };
}
