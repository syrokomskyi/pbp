/*
<MODULE_CONTRACT>
<purpose>
Unit tests for locale covering resolveLocales. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the locale suite's contract for test-file scaffold coverage.</item>
  <item>RFC-1328: review fix pass: envelope fields in vendored schema defs, locale merge prose guard, manifest defaultLocale threading

F-1 blocking: inject statementByLocale/localeNeutral into every exported pbp
def so producers can self-validate AMD-005 bundles. F-2/F-3: LOCALE_SCOPED_FIELDS
never merge onto existing locale docs; defaultLocale param replaces the
hardcoded de across semantic profile, currency, referral capacity. F-4..F-10:
statementLang rewrite, prose drops on clones/variants, INTAKE-12 name+literals,
currency-policy gate, predicate signature, doc drift. Unblocks dna-trace
WS-WRITE-02 false positive (_io naming).</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { resolveLocales } from "./locale.ts";
import type { LocaleAwareEntityIndex } from "./entity-index.ts";
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
      makeEntity("biz-1", "de", {
        name: "German name",
        summary: "DE summary",
        legalName: "DE GmbH",
      }),
      makeEntity("biz-1", "uk", { name: "UK name" }),
    ]);

    const { resolved, fallbackReport } = await resolveLocales(index, "uk", "de");

    const entity = resolved.get("biz-1");
    expect(entity?.name).toBe("UK name");
    // RFC-1328 (AMD-005): prose fields never cross locales — the uk doc
    // deliberately omits summary, so the de text must not be restored.
    expect(entity?.summary).toBeUndefined();
    // Structural/identity fields still merge.
    expect(entity?.legalName).toBe("DE GmbH");
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
