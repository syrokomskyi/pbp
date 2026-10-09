/*
<MODULE_CONTRACT>
<purpose>Frankfurter rate source adapter — fetches daily reference rates from the Frankfurter API (RFC-0744).
Frankfurter is a free, no-key API that serves ECB reference rates in JSON format.
API: https://api.frankfurter.dev/v2/rate/{base}/{quote} → { date, base, quote, rate }</purpose>
<non-goals>
  <item>Does not define the RateSourceAdapter interface — that is in src/types.ts.</item>
  <item>Does not handle scheduling — that is the rate-fetcher service.</item>
  <item>Does not fetch historical rates — only the latest daily rate.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import type { PbpEntityRef } from "../../entity-ref.ts";
import type { RateFetchResult, RateSourceAdapter } from "../types.ts";

const FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2";

interface FrankfurterRateResponse {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

export function parseFrankfurterResponse(json: string): FrankfurterRateResponse {
  const parsed = JSON.parse(json) as Partial<FrankfurterRateResponse>;
  if (
    typeof parsed.date !== "string" ||
    typeof parsed.base !== "string" ||
    typeof parsed.quote !== "string" ||
    typeof parsed.rate !== "number"
  ) {
    throw new Error("Frankfurter adapter: invalid response shape");
  }
  return parsed as FrankfurterRateResponse;
}

export function createFrankfurterAdapter(
  sourceContractRef: PbpEntityRef,
  fetchFn: (url: string) => Promise<string> = defaultFetch,
): RateSourceAdapter {
  return {
    sourceContractRef,
    async fetchRate(pair: {
      sourceCurrency: string;
      targetCurrency: string;
    }): Promise<RateFetchResult> {
      const url = `${FRANKFURTER_BASE_URL}/rate/${pair.sourceCurrency}/${pair.targetCurrency}`;
      const body = await fetchFn(url);
      const data = parseFrankfurterResponse(body);

      return {
        value: data.rate.toString(),
        observedAt: data.date,
        sourceKind: "external",
        metadata: {
          source: "frankfurter",
          base: data.base,
          quote: data.quote,
        },
      };
    },
  };
}

async function defaultFetch(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Frankfurter fetch failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}
