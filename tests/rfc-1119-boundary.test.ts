/*
<MODULE_CONTRACT>
<purpose>RFC-1119 boundary tests — machine-checkable probes for AC-1, AC-2, AC-5, AC-6. Assert the framework-free package boundary holds after the PBP domain move.</purpose>
<non-goals>
  <item>Do not test domain logic here — this file only guards the package boundary.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1119: initial boundary probes (AC-1 no astro deps, AC-2 no pbp domain dirs in werkstatt-site, AC-5 no pbp @2 namespace, AC-6 rate-fetcher clean).</item>
</CHANGE_SUMMARY>
*/

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = join(PKG_ROOT, "..", "..");
const SITE_DOMAIN = join(REPO_ROOT, "packages/werkstatt-site/src/domain");

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
      yield* walk(abs);
    } else {
      yield abs;
    }
  }
}

describe("RFC-1119 boundary", () => {
  it("declares no astro dependencies", () => {
    const pkg = JSON.parse(readFileSync(join(PKG_ROOT, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    };
    for (const dep of Object.keys(allDeps)) {
      expect(dep, `dependency ${dep} must not be astro`).not.toMatch(/^(@astrojs\/|astro$)/);
    }
    // Source must not import astro either — the package is framework-free.
    const offenders: string[] = [];
    for (const file of walk(join(PKG_ROOT, "src"))) {
      if (!file.endsWith(".ts")) continue;
      const text = readFileSync(file, "utf8");
      if (/from\s+["'](astro|astro:|@astrojs\/)/.test(text)) {
        offenders.push(relative(PKG_ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("werkstatt-site no longer contains pbp domain directories", () => {
    for (const gone of [
      "pbp/compiler",
      "pbp/entities",
      "pbp/projections",
      "pbp/schemas",
      "pbp/derivations",
      "pbp-rate-adapters",
    ]) {
      expect(existsSync(join(SITE_DOMAIN, gone)), `${gone} must not exist`).toBe(false);
    }
    // The thinned adapter keeps only the astro-facing files.
    const remaining = readdirSync(join(SITE_DOMAIN, "pbp")).sort();
    expect(remaining).toEqual([
      "astro.ts",
      "env.d.ts",
      "load-target-currencies.test.ts",
      "loaders.ts",
      "semantic-model.ts",
    ]);
  });

  it("no pbp @2 namespace strings anywhere", () => {
    // Test files are excluded — parser fixtures legitimately exercise @2 acceptance.
    const offenders: string[] = [];
    for (const file of walk(join(REPO_ROOT, "packages"))) {
      if (!file.endsWith(".ts") && !file.endsWith(".astro")) continue;
      if (file.endsWith(".test.ts") || file.includes("/tests/")) continue;
      const text = readFileSync(file, "utf8");
      if (/pbp\/[a-z-]+@2/.test(text)) offenders.push(relative(REPO_ROOT, file));
    }
    expect(offenders).toEqual([]);
  });

  it("rate-fetcher does not import werkstatt-site", () => {
    const svcDir = join(REPO_ROOT, "services/rate-fetcher");
    const pkg = JSON.parse(readFileSync(join(svcDir, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
    };
    expect(pkg.dependencies?.["@warpgogol/werkstatt-site"]).toBeUndefined();
    expect(pkg.dependencies?.["@warpgogol/pbp"]).toBe("workspace:*");
    for (const file of walk(join(svcDir, "src"))) {
      if (!file.endsWith(".ts")) continue;
      const text = readFileSync(file, "utf8");
      expect(
        /from\s+["']@warpgogol\/werkstatt-site/.test(text),
        `${relative(REPO_ROOT, file)} must not import werkstatt-site`,
      ).toBe(false);
    }
  });
});
