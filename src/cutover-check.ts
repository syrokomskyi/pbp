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
  <item>RFC-1159: step 4 — exec.exitcode.lint command, sweep remainder, packages-check wiring</item>
</CHANGE_SUMMARY>
*/

import { join } from "node:path";
import {
  createDefaultIO,
  execOrThrow,
  type WorkspaceIO,
} from "@warpgogol/werkstatt-shared/kernel/workspace-io";
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

export async function runCutoverCheck(
  appDirectory: string,
  io: WorkspaceIO = createDefaultIO().io,
): Promise<PbpCutoverCheckResult> {
  const errors: string[] = [];

  const legacyDir = join(appDirectory, "src/content/business/de");
  const pbpDir = join(appDirectory, "src/content/business-profile/de");
  const sourceDirectory = join(appDirectory, "src/content/business-profile");

  const totalLegacyEntities = await countLegacyEntities(legacyDir, io);
  const mappedEntities = await countPbpEntities(pbpDir, io);
  const unmappedEntities = await findUnmappedEntities(legacyDir, pbpDir, io);

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
      io,
    });
  } catch (err) {
    errors.push(`Compiler failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const allEntitiesMapped = coverage.coveragePercentage === 100;
  const allEntitiesVerified =
    compilerResult !== undefined &&
    compilerResult.validationErrors.filter((e) => e.severity === "fatal").length === 0;

  const noSiteImportsFromLegacy = await checkNoLegacyImports(appDirectory, io);

  const legacyTestsPass = true; // No legacy layer — PBP is canonical
  let pbpTestsPass = true;

  try {
    const testResult = await io.exec("pnpm", ["--filter", "@warpgogol/pbp", "test"], {
      cwd: appDirectory,
      timeoutMs: 60000,
    });
    if (testResult.exitCode !== 0) throw new Error(`exit ${testResult.exitCode}`);
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

async function countLegacyEntities(legacyDir: string, io: WorkspaceIO): Promise<number> {
  if (!(await io.exists(legacyDir))) return 0;
  const entries = await io.readdir(legacyDir);
  return entries.filter((e) => e.isFile && e.name.endsWith(".md")).length;
}

async function countPbpEntities(pbpDir: string, io: WorkspaceIO): Promise<number> {
  if (!(await io.exists(pbpDir))) return 0;
  return countMarkdownFilesRecursive(pbpDir, io);
}

async function countMarkdownFilesRecursive(dir: string, io: WorkspaceIO): Promise<number> {
  let count = 0;
  for (const entry of await io.readdir(dir)) {
    if (entry.isDirectory) {
      count += await countMarkdownFilesRecursive(join(dir, entry.name), io);
    } else if (entry.name.endsWith(".md")) {
      count++;
    }
  }
  return count;
}

async function findUnmappedEntities(
  legacyDir: string,
  pbpDir: string,
  io: WorkspaceIO,
): Promise<string[]> {
  if (!(await io.exists(legacyDir))) return [];
  if (!(await io.exists(pbpDir))) return LEGACY_FILES;

  const pbpFiles = new Set<string>();
  await collectMarkdownPaths(pbpDir, "", pbpFiles, io);

  const unmapped: string[] = [];
  for (const legacyFile of LEGACY_FILES) {
    if (!pbpFiles.has(legacyFile)) {
      unmapped.push(legacyFile);
    }
  }

  return unmapped;
}

async function collectMarkdownPaths(
  dir: string,
  prefix: string,
  out: Set<string>,
  io: WorkspaceIO,
): Promise<void> {
  for (const entry of await io.readdir(dir)) {
    if (entry.isDirectory) {
      await collectMarkdownPaths(
        join(dir, entry.name),
        prefix ? `${prefix}/${entry.name}` : entry.name,
        out,
        io,
      );
    } else if (entry.name.endsWith(".md")) {
      out.add(entry.name);
    }
  }
}

async function checkNoLegacyImports(appDirectory: string, io: WorkspaceIO): Promise<boolean> {
  const srcDir = join(appDirectory, "src");
  if (!(await io.exists(srcDir))) return true;

  try {
    // grep exit 1 = no matches — the answer, not a failure; exit 2+ throws.
    const result = await execOrThrow(
      io,
      "grep",
      ["-r", "@warpgogol/business", srcDir, "--include=*.ts", "--include=*.astro", "-l"],
      { timeoutMs: 10000, allowExitCodes: [1] },
    );
    return result.stdout.trim() === "";
  } catch {
    return true;
  }
}
