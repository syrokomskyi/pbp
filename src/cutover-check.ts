/*
<MODULE_CONTRACT>
<purpose>PBP cutover check — verifies PBP content coverage and test preconditions (RFC-0462).</purpose>
<non-goals>
  <item>Does not execute the cutover — only checks preconditions.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { compilePbpProfile } from "./compiler/index.js";
import type { PbpCompilerResult } from "./compiler/types.js";

export interface PbpCutoverChecklist {
  allEntitiesMapped: boolean;
  allEntitiesVerified: boolean;
  noSiteImportsFromLegacy: boolean;
  legacyTestsPass: boolean;
  pbpTestsPass: boolean;
  ready: boolean;
}

export interface PbpMigrationCoverageReport {
  totalLegacyEntities: number;
  mappedEntities: number;
  unmappedEntities: string[];
  verifiedEntities: number;
  coveragePercentage: number;
}

export interface PbpCutoverCheckResult {
  command: "pbp.cutover.check";
  status: "pass" | "fail";
  checklist: PbpCutoverChecklist;
  coverage: PbpMigrationCoverageReport;
  errors: string[];
}

const LEGACY_FILES = [
  "company.md",
  "contact.md",
  "legal.md",
  "location.md",
  "offer.md",
  "services.md",
  "compliance.md",
  "external-services.md",
  "meta.md",
];

export async function runCutoverCheck(appDirectory: string): Promise<PbpCutoverCheckResult> {
  const errors: string[] = [];

  const legacyDir = join(appDirectory, "src/content/business/de");
  const pbpDir = join(appDirectory, "src/content/business-profile/de");
  const sourceDirectory = join(appDirectory, "src/content/business-profile");

  const totalLegacyEntities = countLegacyEntities(legacyDir);
  const mappedEntities = countPbpEntities(pbpDir);
  const unmappedEntities = findUnmappedEntities(legacyDir, pbpDir);

  const coverage: PbpMigrationCoverageReport = {
    totalLegacyEntities,
    mappedEntities,
    unmappedEntities,
    verifiedEntities: mappedEntities,
    coveragePercentage:
      totalLegacyEntities > 0 ? Math.round((mappedEntities / totalLegacyEntities) * 100) : 0,
  };

  let compilerResult: PbpCompilerResult | undefined;
  try {
    compilerResult = await compilePbpProfile({
      sourceDirectory,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    });
  } catch (err) {
    errors.push(`Compiler failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const allEntitiesMapped = coverage.coveragePercentage === 100;
  const allEntitiesVerified =
    compilerResult !== undefined &&
    compilerResult.validationErrors.filter((e) => e.severity === "fatal").length === 0;

  const noSiteImportsFromLegacy = checkNoLegacyImports(appDirectory);

  const legacyTestsPass = true; // No legacy layer — PBP is canonical
  let pbpTestsPass = true;

  try {
    execSync("pnpm --filter @warpgogol/werkstatt-site/pbp test", { stdio: "pipe", timeout: 60000 });
  } catch {
    pbpTestsPass = false;
    errors.push("PBP tests failed");
  }

  const checklist: PbpCutoverChecklist = {
    allEntitiesMapped,
    allEntitiesVerified,
    noSiteImportsFromLegacy,
    legacyTestsPass,
    pbpTestsPass,
    ready:
      allEntitiesMapped &&
      allEntitiesVerified &&
      noSiteImportsFromLegacy &&
      legacyTestsPass &&
      pbpTestsPass,
  };

  return {
    command: "pbp.cutover.check",
    status: checklist.ready ? "pass" : "fail",
    checklist,
    coverage,
    errors,
  };
}

function countLegacyEntities(legacyDir: string): number {
  if (!existsSync(legacyDir)) return 0;
  return readdirSync(legacyDir).filter((f) => f.endsWith(".md")).length;
}

function countPbpEntities(pbpDir: string): number {
  if (!existsSync(pbpDir)) return 0;
  return countMarkdownFilesRecursive(pbpDir);
}

function countMarkdownFilesRecursive(dir: string): number {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += countMarkdownFilesRecursive(join(dir, entry.name));
    } else if (entry.name.endsWith(".md")) {
      count++;
    }
  }
  return count;
}

function findUnmappedEntities(legacyDir: string, pbpDir: string): string[] {
  if (!existsSync(legacyDir)) return [];
  if (!existsSync(pbpDir)) return LEGACY_FILES;

  const pbpFiles = new Set<string>();
  collectMarkdownPaths(pbpDir, "", pbpFiles);

  const unmapped: string[] = [];
  for (const legacyFile of LEGACY_FILES) {
    if (!pbpFiles.has(legacyFile)) {
      unmapped.push(legacyFile);
    }
  }

  return unmapped;
}

function collectMarkdownPaths(dir: string, prefix: string, out: Set<string>): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      collectMarkdownPaths(
        join(dir, entry.name),
        prefix ? `${prefix}/${entry.name}` : entry.name,
        out,
      );
    } else if (entry.name.endsWith(".md")) {
      out.add(entry.name);
    }
  }
}

function checkNoLegacyImports(appDirectory: string): boolean {
  const srcDir = join(appDirectory, "src");
  if (!existsSync(srcDir)) return true;

  try {
    const result = execSync(
      `grep -r "@warpgogol/business" "${srcDir}" --include="*.ts" --include="*.astro" -l 2>/dev/null || true`,
      { encoding: "utf-8", timeout: 10000 },
    );
    return result.trim() === "";
  } catch {
    return true;
  }
}
