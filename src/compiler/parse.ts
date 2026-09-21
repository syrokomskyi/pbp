/*
<MODULE_CONTRACT>
<purpose>Phase 2: Parses YAML frontmatter from discovered source files into raw entity objects.</purpose>
<non-goals>
  <item>Does not validate entities — that is Phase 3 (validate.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

import { readFileSync } from "node:fs";
import { parseMarkdownFrontmatter } from "@warpgogol/werkstatt-shared/content/markdown-frontmatter";
import type { PbpSourceInventoryReport } from "../compiler-pipeline.js";

export interface ParsedEntity {
  data: Record<string, unknown>;
  body: string;
  physicalPath: string;
  locale: string;
  entityId: string;
  schema: string;
}

export async function parse(inventory: PbpSourceInventoryReport): Promise<ParsedEntity[]> {
  const results: ParsedEntity[] = [];

  for (const source of inventory.sources) {
    const raw = readFileSync(source.physicalPath, "utf-8");
    const { data, content } = parseMarkdownFrontmatter(raw);

    results.push({
      data,
      body: content,
      physicalPath: source.physicalPath,
      locale: source.locale,
      entityId: source.entityId,
      schema: source.schema,
    });
  }

  results.sort((a, b) => a.entityId.localeCompare(b.entityId));
  return results;
}
