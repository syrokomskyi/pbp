import { describe, it, expect } from "vitest";
import { resolveLocales } from "./locale.js";
import type { LocaleAwareEntityIndex } from "./entity-index.js";
import type { PbpEntity } from "../envelope.ts";

function makeEntity(id: string, locale: string, extra: Record<string, unknown> = {}): PbpEntity {
  return {
    schema: "test",
    id,
    type: "business",
    status: "published",
    locale,
    name: `name-${locale}`,
    ...extra,
  } as PbpEntity;
}

function buildIndex(entities: PbpEntity[]): LocaleAwareEntityIndex {
  const index: LocaleAwareEntityIndex = new Map();
  for (const e of entities) {
    const localeKey = e.locale ?? "";
    let localeMap = index.get(e.id);
    if (!localeMap) {
      localeMap = new Map();
      index.set(e.id, localeMap);
    }
    localeMap.set(localeKey, e);
  }
  return index;
}

describe("resolveLocales", () => {
  it("returns default locale entities when target equals default locale", async () => {
    const index = buildIndex([
      makeEntity("biz-1", "de", { name: "German name" }),
      makeEntity("biz-1", "uk", { name: "UK name" }),
    ]);

    const { resolved, fallbackReport } = await resolveLocales(index, "de", "de");

    expect(resolved.get("biz-1")?.name).toBe("German name");
    expect(fallbackReport.fallbacks).toHaveLength(0);
  });

  it("deep-merges non-default locale overlay onto default locale entity", async () => {
    const index = buildIndex([
      makeEntity("biz-1", "de", { name: "German name", summary: "DE summary" }),
      makeEntity("biz-1", "uk", { name: "UK name" }),
    ]);

    const { resolved, fallbackReport } = await resolveLocales(index, "uk", "de");

    const entity = resolved.get("biz-1");
    expect(entity?.name).toBe("UK name");
    expect(entity?.summary).toBe("DE summary");
    expect(fallbackReport.locale).toBe("uk");
    expect(fallbackReport.fallbacks.length).toBeGreaterThan(0);
    expect(fallbackReport.fallbacks[0]?.sourceLocale).toBe("de");
    expect(fallbackReport.fallbacks[0]?.targetLocale).toBe("uk");
  });

  it("falls back to default locale when target locale entity is missing", async () => {
    const index = buildIndex([makeEntity("biz-1", "de", { name: "German name" })]);

    const { resolved, fallbackReport } = await resolveLocales(index, "fr", "de");

    expect(resolved.get("biz-1")?.name).toBe("German name");
    expect(fallbackReport.fallbacks).toHaveLength(0);
  });

  it("falls back to target entity when default locale is missing", async () => {
    const index = buildIndex([makeEntity("biz-1", "uk", { name: "UK name" })]);

    const { resolved } = await resolveLocales(index, "uk", "de");

    expect(resolved.get("biz-1")?.name).toBe("UK name");
  });

  it("uses first available entity when neither default nor target locale exists", async () => {
    const index = buildIndex([makeEntity("biz-1", "fr", { name: "French name" })]);

    const { resolved } = await resolveLocales(index, "es", "de");

    expect(resolved.get("biz-1")?.name).toBe("French name");
  });

  it("sorts fallbacks by entityId then path", async () => {
    const index = buildIndex([
      makeEntity("biz-a", "de", { name: "A-DE", summary: "S" }),
      makeEntity("biz-a", "uk", { name: "A-UK" }),
      makeEntity("biz-b", "de", { name: "B-DE", summary: "S" }),
      makeEntity("biz-b", "uk", { name: "B-UK" }),
    ]);

    const { fallbackReport } = await resolveLocales(index, "uk", "de");

    expect(fallbackReport.fallbacks[0]?.entityId).toBe("biz-a");
    expect(fallbackReport.fallbacks[fallbackReport.fallbacks.length - 1]?.entityId).toBe("biz-b");
  });
});
