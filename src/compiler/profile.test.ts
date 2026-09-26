import { describe, it, expect } from "vitest";
import { resolveProfile } from "./profile.js";
import type { PbpEntity } from "../envelope.ts";

function makeEntity(id: string, type: string, extra: Record<string, unknown> = {}): PbpEntity {
  return {
    schema: "test",
    id,
    type,
    status: "published",
    name: `name-${id}`,
    ...extra,
  } as PbpEntity;
}

describe("resolveProfile", () => {
  it("assembles a resolved graph from entity index", async () => {
    const index = new Map<string, PbpEntity>([
      ["biz-1", makeEntity("biz-1", "business", { legalIdentityRef: { ref: "legal-1" } })],
      ["legal-1", makeEntity("legal-1", "legal-identity")],
      ["offering-1", makeEntity("offering-1", "offering")],
      ["product-1", makeEntity("product-1", "product")],
    ]);

    const graph = await resolveProfile(index);

    expect(graph.business.id).toBe("biz-1");
    expect(graph.legalIdentity?.id).toBe("legal-1");
    expect(Object.keys(graph.offerings)).toEqual(["offering-1"]);
    expect(Object.keys(graph.products)).toEqual(["product-1"]);
  });

  it("throws when no business entity exists", async () => {
    const index = new Map<string, PbpEntity>([
      ["offering-1", makeEntity("offering-1", "offering")],
    ]);

    await expect(resolveProfile(index)).rejects.toThrow("No Business entity found");
  });

  it("collects entities by type into records keyed by ID", async () => {
    const index = new Map<string, PbpEntity>([
      ["biz-1", makeEntity("biz-1", "business")],
      ["place-1", makeEntity("place-1", "place")],
      ["place-2", makeEntity("place-2", "place")],
      ["contact-1", makeEntity("contact-1", "contact-point")],
    ]);

    const graph = await resolveProfile(index);

    expect(Object.keys(graph.places).sort()).toEqual(["place-1", "place-2"]);
    expect(Object.keys(graph.contactPoints)).toEqual(["contact-1"]);
  });

  it("resolves brandRef from business entity", async () => {
    const index = new Map<string, PbpEntity>([
      ["biz-1", makeEntity("biz-1", "business", { brandRef: { ref: "brand-1" } })],
      ["brand-1", makeEntity("brand-1", "brand")],
    ]);

    const graph = await resolveProfile(index);
    expect(graph.brand?.id).toBe("brand-1");
  });

  it("returns empty records for types with no entities", async () => {
    const index = new Map<string, PbpEntity>([["biz-1", makeEntity("biz-1", "business")]]);

    const graph = await resolveProfile(index);

    expect(Object.keys(graph.offerings)).toHaveLength(0);
    expect(Object.keys(graph.policies)).toHaveLength(0);
    expect(graph.catalog).toBeUndefined();
  });

  it("sorts entities by ID before grouping", async () => {
    const index = new Map<string, PbpEntity>([
      ["biz-1", makeEntity("biz-1", "business")],
      ["off-c", makeEntity("off-c", "offering")],
      ["off-a", makeEntity("off-a", "offering")],
      ["off-b", makeEntity("off-b", "offering")],
    ]);

    const graph = await resolveProfile(index);
    expect(Object.keys(graph.offerings)).toEqual(["off-a", "off-b", "off-c"]);
  });
});
