/*
<MODULE_CONTRACT>
<purpose>discover — Phase 1 source file discovery, scans all .md files under sourceDirectory.</purpose>
<non-goals>
  <item>Does not parse file contents — that is Phase 2 (parse.ts).</item>
  <item>Does not validate entities — that is Phase 3 (validate.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { byteHash } from "@warpgogol/werkstatt-shared/fingerprint";
import { parseMarkdownFrontmatter } from "@warpgogol/werkstatt-shared/content/markdown-frontmatter";
import type { PbpSourceInventoryEntry, PbpSourceInventoryReport } from "../compiler-pipeline.js";
import type { PbpCompilerInput } from "./types.js";

export async function discover(input: PbpCompilerInput): Promise<PbpSourceInventoryReport> {
  const sources: PbpSourceInventoryEntry[] = [];
  const files = collectMdFiles(input.sourceDirectory);

  for (const filePath of files) {
    const raw = readFileSync(filePath, "utf-8");
    const { data } = parseMarkdownFrontmatter(raw);

    const entityId = typeof data.id === "string" ? data.id : "";
    const schema = typeof data.schema === "string" ? data.schema : "";

    const relPath = relative(input.sourceDirectory, filePath);
    const locale = extractLocaleFromPath(relPath);

    sources.push({
      physicalPath: filePath,
      entityId,
      schema,
      locale,
      contentDigest: byteHash(raw),
    });
  }

  sources.sort((a, b) => a.entityId.localeCompare(b.entityId));

  const recordsBySchema: Record<string, number> = {};
  for (const s of sources) {
    recordsBySchema[s.schema] = (recordsBySchema[s.schema] ?? 0) + 1;
  }

  return {
    sources,
    recordsDiscovered: sources.length,
    recordsBySchema,
  };
}

function collectMdFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith("old-") || entry.name.startsWith("-")) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectMdFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory does not exist or is not readable — return empty
  }
  return results;
}

function extractLocaleFromPath(relPath: string): string {
  const parts = relPath.split(sep);
  return parts.length > 0 ? parts[0] : "";
}
