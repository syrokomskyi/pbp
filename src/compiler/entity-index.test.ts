import { describe, it, expect } from "vitest";
import { buildEntityIndex } from "./entity-index.ts";
import type { PbpEntity } from "../envelope.ts";

function makeEntity(id: string, locale: string, type = "business"): PbpEntity {
  return { schema: "test", id, type, status: "published", locale } as PbpEntity;
}

describe("buildEntityIndex", () => {
  it("builds a locale-aware Map keyed by entity ID", async () => {
    const entities = [
      makeEntity("biz-1", "de"),
      makeEntity("biz-1", "uk"),
      makeEntity("biz-2", "de"),
    ];

    const { index, errors } = await buildEntityIndex(entities);

    expect(errors).toHaveLength(0);
    expect(index.size).toBe(2);
    expect(index.get("biz-1")?.size).toBe(2);
    expect(index.get("biz-1")?.get("de")?.locale).toBe("de");
    expect(index.get("biz-1")?.get("uk")?.locale).toBe("uk");
    expect(index.get("biz-2")?.get("de")?.locale).toBe("de");
  });

  it("detects duplicate entity ID in the same locale", async () => {
    const entities = [makeEntity("biz-1", "de"), makeEntity("biz-1", "de")];

    const { index, errors } = await buildEntityIndex(entities);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe("PBP-ID-LOCALE-DUPLICATE");
    expect(errors[0]?.severity).toBe("fatal");
    expect(errors[0]?.entityId).toBe("biz-1");
    expect(index.get("biz-1")?.size).toBe(1);
  });

  it("allows same entity ID across different locales", async () => {
    const entities = [
      makeEntity("biz-1", "de"),
      makeEntity("biz-1", "uk"),
      makeEntity("biz-1", "fr"),
    ];

    const { index, errors } = await buildEntityIndex(entities);

    expect(errors).toHaveLength(0);
    expect(index.get("biz-1")?.size).toBe(3);
  });

  it("uses empty string as locale key for entities without locale", async () => {
    const entity: PbpEntity = {
      schema: "test",
      id: "biz-1",
      type: "business",
      status: "published",
    };
    const { index, errors } = await buildEntityIndex([entity]);

    expect(errors).toHaveLength(0);
    expect(index.get("biz-1")?.get("")?.id).toBe("biz-1");
  });

  it("sorts entities by ID before indexing", async () => {
    const entities = [makeEntity("zzz", "de"), makeEntity("aaa", "de"), makeEntity("mmm", "de")];

    const { index } = await buildEntityIndex(entities);
    const ids = [...index.keys()];
    expect(ids).toEqual(["aaa", "mmm", "zzz"]);
  });
});
