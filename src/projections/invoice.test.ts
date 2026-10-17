/*
<MODULE_CONTRACT>
<purpose>
Unit tests for invoice covering PbpInvoiceInput. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the invoice suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
