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
