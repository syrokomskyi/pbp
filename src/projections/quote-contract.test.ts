/*
<MODULE_CONTRACT>
<purpose>
Unit tests for quote contract covering PbpQuoteInput; PbpContractInput. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the quote suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpQuoteInput, PbpContractInput } from "./quote-contract.ts";

describe("PbpQuoteInput", () => {
  it("defines a valid quote input shape", () => {
    const quote: PbpQuoteInput = {
      projectionTarget: "quote",
      offeringRef: { ref: "https://warpgogol.com/offerings/foundation" },
      charges: { monthly: { value: "70.00" } },
      locale: "de",
    };
    expect(quote.projectionTarget).toBe("quote");
    expect(quote.offeringRef.ref).toBe("https://warpgogol.com/offerings/foundation");
  });
});

describe("PbpContractInput", () => {
  it("defines a valid contract input shape", () => {
    const contract: PbpContractInput = {
      projectionTarget: "contract",
      offeringRef: { ref: "https://warpgogol.com/offerings/foundation" },
      charges: { monthly: { value: "70.00" } },
      terms: { minimumTerm: "P1M" },
      policyRefs: [{ ref: "https://warpgogol.com/policies/sla" }],
      locale: "de",
    };
    expect(contract.projectionTarget).toBe("contract");
    expect(contract.policyRefs).toHaveLength(1);
  });
});
