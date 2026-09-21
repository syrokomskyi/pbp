/*
<MODULE_CONTRACT>
<purpose>Infra-only guard for domain/pbp/schemas/ (RFC-1102, DNA-103) — asserts the directory contains only infrastructure modules and that no source file under domain/pbp/ imports a deleted per-entity schemas/&lt;name&gt; path (AC-2, AC-4).</purpose>
<non-goals>
  <item>Does not test schema behavior — envelope/primitives/entity-ref tests cover that.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: created — directory allowlist + stale-import scan (AC-2, AC-4).</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const schemasDir = dirname(fileURLToPath(import.meta.url)); // schemas/
const pbpDir = join(schemasDir, ".."); // domain/pbp/

const INFRA_FILES = new Set(["envelope.ts", "primitives.ts", "entity-ref.ts", "index.ts"]);

const ENTITY_SCHEMA_NAMES = [
  "brand",
  "business",
  "catalog",
  "category",
  "claim",
  "client-testimonial",
  "consent",
  "contact-point",
  "currency-pricing-policy",
  "data-retention-policy",
  "disclosure",
  "evidence-source",
  "exit-policy",
  "guarantee-policy",
  "legal-identity",
  "offering",
  "ownership-policy",
  "place",
  "policy",
  "pricing",
  "product",
  "product-group",
  "product-variant",
  "public-document",
  "rate-policy",
  "rate-snapshot",
  "rate-source",
  "sla-policy",
  "terms",
  "web-presence",
];

const STALE_IMPORT_RE = new RegExp(
  `from\\s+["'][^"']*schemas/(${ENTITY_SCHEMA_NAMES.join("|")})\\.js["']`,
);

function collectTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectTsFiles(full));
    } else if (entry.name.endsWith(".ts")) {
      out.push(full);
    }
  }
  return out;
}

describe("schemas/ is infrastructure-only (RFC-1102, AC-2)", () => {
  it("contains only envelope.ts, primitives.ts, entity-ref.ts, index.ts plus adjacent tests", () => {
    const entries = readdirSync(schemasDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => !name.endsWith(".test.ts"));
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    for (const file of files) {
      expect(INFRA_FILES.has(file), `unexpected per-entity schema file in schemas/: ${file}`).toBe(
        true,
      );
    }
    expect(dirs).toEqual([]);
  });
});

describe("no stale per-entity schemas/ imports (RFC-1102, AC-4)", () => {
  it("no source file under domain/pbp/ imports a deleted schemas/<entity> path", () => {
    const offenders: string[] = [];
    for (const file of collectTsFiles(pbpDir)) {
      const content = readFileSync(file, "utf8");
      if (STALE_IMPORT_RE.test(content)) {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});
