import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { parse } from "./parse.js";
import type { PbpSourceInventoryReport } from "../compiler-pipeline.js";

let testDir: string;

beforeEach(() => {
  testDir = join(tmpdir(), `pbp-parse-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(testDir, { recursive: true });
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

describe("parse", () => {
  it("parses YAML frontmatter from source files into ParsedEntity objects", async () => {
    const filePath = join(testDir, "business.md");
    writeFileSync(filePath, "---\nid: biz-1\nschema: business\ntype: business\n---\nBody text\n");

    const inventory: PbpSourceInventoryReport = {
      sources: [
        {
          physicalPath: filePath,
          entityId: "biz-1",
          schema: "business",
          locale: "de",
          contentDigest: "abc",
        },
      ],
      recordsDiscovered: 1,
      recordsBySchema: { business: 1 },
    };

    const parsed = await parse(inventory);

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.entityId).toBe("biz-1");
    expect(parsed[0]?.schema).toBe("business");
    expect(parsed[0]?.locale).toBe("de");
    expect(parsed[0]?.data.id).toBe("biz-1");
    expect(parsed[0]?.body).toBe("Body text\n");
  });

  it("sorts parsed entities by entityId", async () => {
    const files = ["c.md", "a.md", "b.md"];
    const ids = ["ccc", "aaa", "bbb"];
    const sources = files.map((f, i) => {
      const p = join(testDir, f);
      writeFileSync(p, `---\nid: ${ids[i]}\nschema: business\n---\nbody\n`);
      return {
        physicalPath: p,
        entityId: ids[i]!,
        schema: "business",
        locale: "de",
        contentDigest: "x",
      };
    });

    const inventory: PbpSourceInventoryReport = {
      sources,
      recordsDiscovered: 3,
      recordsBySchema: { business: 3 },
    };

    const parsed = await parse(inventory);
    expect(parsed.map((p) => p.entityId)).toEqual(["aaa", "bbb", "ccc"]);
  });

  it("handles empty inventory", async () => {
    const inventory: PbpSourceInventoryReport = {
      sources: [],
      recordsDiscovered: 0,
      recordsBySchema: {},
    };

    const parsed = await parse(inventory);
    expect(parsed).toHaveLength(0);
  });
});
