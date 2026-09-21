import { describe, it, expect } from "vitest";
import { resolveReferences } from "./references.js";
import type { PbpEntity } from "../envelope.ts";

function makeEntity(id: string, type: string, extra: Record<string, unknown> = {}): PbpEntity {
  return { schema: "test", id, type, status: "published", ...extra } as PbpEntity;
}

describe("resolveReferences", () => {
  it("detects missing internal references", async () => {
    const index = new Map<string, PbpEntity>([
      ["offering-1", makeEntity("offering-1", "offering", { productRef: { ref: "missing-product" } })],
    ]);

    const { errors } = await resolveReferences(index);

    expect(errors.some((e) => e.kind === "missing-internal-ref")).toBe(true);
  });

  it("passes when all references resolve", async () => {
    const index = new Map<string, PbpEntity>([
      ["product-1", makeEntity("product-1", "product")],
      ["offering-1", makeEntity("offering-1", "offering", { productRef: { ref: "product-1" } })],
    ]);

    const { errors } = await resolveReferences(index);

    expect(errors.filter((e) => e.kind === "missing-internal-ref")).toHaveLength(0);
  });

  it("detects type mismatch between ref and target entity", async () => {
    const index = new Map<string, PbpEntity>([
      ["cat-1", makeEntity("cat-1", "category")],
      ["offering-1", makeEntity("offering-1", "offering", {
        productRef: { ref: "cat-1", expectedType: "product" },
      })],
    ]);

    const { errors } = await resolveReferences(index);

    expect(errors.some((e) => e.kind === "type-mismatch")).toBe(true);
  });

  it("detects locale suffixes in entity IDs", async () => {
    const index = new Map<string, PbpEntity>([
      ["offering-1.de", makeEntity("offering-1.de", "offering", { productRef: { ref: "product-1.de" } })],
    ]);

    const { errors } = await resolveReferences(index);

    expect(errors.some((e) => e.kind === "locale-suffix-in-id")).toBe(true);
  });

  it("detects cycles in requires relationship", async () => {
    const index = new Map<string, PbpEntity>([
      ["off-a", makeEntity("off-a", "offering", {
        relatedOfferings: { req1: { relation: "requires", offeringRef: { ref: "off-b" } } },
      })],
      ["off-b", makeEntity("off-b", "offering", {
        relatedOfferings: { req2: { relation: "requires", offeringRef: { ref: "off-a" } } },
      })],
    ]);

    const { cycleResults } = await resolveReferences(index);

    const requiresCycle = cycleResults.find((c) => c.checkType === "requires");
    expect(requiresCycle?.hasCycle).toBe(true);
  });

  it("detects cycles in category-broader relationship", async () => {
    const index = new Map<string, PbpEntity>([
      ["cat-a", makeEntity("cat-a", "category", { broaderRef: { ref: "cat-b" } })],
      ["cat-b", makeEntity("cat-b", "category", { broaderRef: { ref: "cat-a" } })],
    ]);

    const { cycleResults } = await resolveReferences(index);

    const catCycle = cycleResults.find((c) => c.checkType === "category-broader");
    expect(catCycle?.hasCycle).toBe(true);
  });

  it("reports no cycles in a clean graph", async () => {
    const index = new Map<string, PbpEntity>([
      ["cat-a", makeEntity("cat-a", "category")],
      ["cat-b", makeEntity("cat-b", "category", { broaderRef: { ref: "cat-a" } })],
    ]);

    const { cycleResults } = await resolveReferences(index);

    expect(cycleResults.every((c) => !c.hasCycle)).toBe(true);
  });

  it("sorts errors by entityId then refPath", async () => {
    const index = new Map<string, PbpEntity>([
      ["zzz", makeEntity("zzz", "offering", { productRef: { ref: "missing-z" } })],
      ["aaa", makeEntity("aaa", "offering", { productRef: { ref: "missing-a" } })],
    ]);

    const { errors } = await resolveReferences(index);
    const missingRefErrors = errors.filter((e) => e.kind === "missing-internal-ref");
    expect(missingRefErrors[0]?.entityId).toBe("aaa");
    expect(missingRefErrors[1]?.entityId).toBe("zzz");
  });
});
