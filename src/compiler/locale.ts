/*
<MODULE_CONTRACT>
<purpose>Phase 5: Resolves locale fallbacks by deep-merging non-default locale overrides onto default locale entities.</purpose>
<non-goals>
  <item>Does not resolve cross-entity references — that is Phase 6 (references.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-0781 — Accept locale-aware index, use shared deepMerge with JSON Merge Patch semantics.</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import type { PbpEntity } from "../envelope.ts";
import type { PbpFallbackReport, PbpFallbackEntry } from "../locale.ts";
import type { LocaleAwareEntityIndex } from "./entity-index.ts";
import { deepMerge } from "../utils/deep-merge.ts";

export interface LocaleResolutionResult {
  resolved: Map<string, PbpEntity>;
  fallbackReport: PbpFallbackReport;
}

export async function resolveLocales(
  index: LocaleAwareEntityIndex,
  locale: string,
  defaultLocale: string,
): Promise<LocaleResolutionResult> {
  const resolved = new Map<string, PbpEntity>();
  const fallbacks: PbpFallbackEntry[] = [];

  const defaultLocaleKey = defaultLocale;
  const targetLocaleKey = locale;

  for (const [id, localeMap] of index) {
    const defaultEntity = localeMap.get(defaultLocaleKey);
    const targetEntity = localeMap.get(targetLocaleKey);

    if (!defaultEntity && !targetEntity) {
      const firstEntity = localeMap.values().next().value;
      if (firstEntity) {
        resolved.set(id, firstEntity);
      }
      continue;
    }

    if (locale === defaultLocale) {
      if (defaultEntity) {
        resolved.set(id, defaultEntity);
      }
      continue;
    }

    if (!defaultEntity) {
      if (targetEntity) {
        resolved.set(id, targetEntity);
      }
      continue;
    }

    if (!targetEntity) {
      resolved.set(id, defaultEntity);
      continue;
    }

    const merged = deepMerge(
      defaultEntity as unknown as Record<string, unknown>,
      targetEntity as unknown as Record<string, unknown>,
    ) as unknown as PbpEntity;
    resolved.set(id, merged);

    const diffPaths = findDiffPaths(
      defaultEntity as unknown as Record<string, unknown>,
      targetEntity as unknown as Record<string, unknown>,
    );
    for (const path of diffPaths) {
      fallbacks.push({
        entityId: id,
        path,
        sourceLocale: defaultLocale,
        targetLocale: locale,
        severity: "info",
      });
    }
  }

  fallbacks.sort((a, b) => a.entityId.localeCompare(b.entityId) || a.path.localeCompare(b.path));

  return {
    resolved,
    fallbackReport: { locale, fallbacks },
  };
}

function findDiffPaths(
  base: Record<string, unknown>,
  overlay: Record<string, unknown>,
  prefix = "",
): string[] {
  const paths: string[] = [];
  for (const key of Object.keys(overlay).sort()) {
    const path = prefix ? `${prefix}.${key}` : key;
    const baseVal = base[key];
    const overlayVal = overlay[key];
    if (
      baseVal &&
      overlayVal &&
      typeof baseVal === "object" &&
      typeof overlayVal === "object" &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overlayVal)
    ) {
      paths.push(
        ...findDiffPaths(
          baseVal as Record<string, unknown>,
          overlayVal as Record<string, unknown>,
          path,
        ),
      );
    } else if (JSON.stringify(baseVal) !== JSON.stringify(overlayVal)) {
      paths.push(path);
    }
  }
  return paths;
}
