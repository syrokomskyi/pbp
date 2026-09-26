import { describe, it, expect } from "vitest";
import { cancellationPolicySchema } from "./cancellation-policy.js";

const validCancellationPolicy = {
  schema: "pbp/cancellation-policy@1",
  id: "https://warpgogol.com/policies/cancellation",
  type: "policy" as const,
  status: "published" as const,
  kind: "cancellation" as const,
  name: "Cancellation Policy",
  ordinaryNotice: { period: "P30D", effective: "end-of-calendar-month" },
  extraordinaryNotice: { period: "P6D" },
  paymentDefault: {
    reminderRequired: true,
    gracePeriod: "P6D",
    consolidationInterval: "P2M",
  },
};

describe("cancellationPolicySchema (RFC-1155)", () => {
  it("parses a valid cancellation policy entity", () => {
    const result = cancellationPolicySchema.safeParse(validCancellationPolicy);
    expect(result.success).toBe(true);
  });

  it("rejects wrong kind literal", () => {
    const result = cancellationPolicySchema.safeParse({
      ...validCancellationPolicy,
      kind: "exit",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = cancellationPolicySchema.safeParse({
      ...validCancellationPolicy,
      extra: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed ISO duration", () => {
    const result = cancellationPolicySchema.safeParse({
      ...validCancellationPolicy,
      ordinaryNotice: { period: "P3OD", effective: "month-end" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects bare P duration", () => {
    const result = cancellationPolicySchema.safeParse({
      ...validCancellationPolicy,
      extraordinaryNotice: { period: "P" },
    });
    expect(result.success).toBe(false);
  });
});
