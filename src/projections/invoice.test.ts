import { describe, it, expect } from "vitest";
import type { PbpInvoiceInput } from "./invoice.ts";

describe("PbpInvoiceInput", () => {
  it("defines a valid invoice input shape", () => {
    const invoice: PbpInvoiceInput = {
      projectionTarget: "invoice",
      offeringRef: { ref: "https://warpgogol.com/offerings/foundation" },
      charges: { monthly: { value: "70.00" } },
      tax: { vat: { rate: "19", amount: "13.30" } },
      locale: "de",
    };
    expect(invoice.projectionTarget).toBe("invoice");
    expect(invoice.locale).toBe("de");
  });
});
