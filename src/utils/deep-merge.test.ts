import { describe, it, expect } from "vitest";
import { isPlainObject, deepMerge } from "./deep-merge.js";

describe("isPlainObject", () => {
  it("returns true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
  });

  it("returns false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject("hello")).toBe(false);
  });

  it("returns false for Date instances", () => {
    expect(isPlainObject(new Date())).toBe(false);
  });
});

describe("deepMerge", () => {
  it("merges nested plain objects", () => {
    const base = { a: { b: 1, c: 2 } };
    const overlay = { a: { c: 3, d: 4 } } as unknown as Partial<typeof base>;
    expect(deepMerge(base, overlay)).toEqual({ a: { b: 1, c: 3, d: 4 } });
  });

  it("null in overlay deletes the key", () => {
    const base = { a: 1, b: 2 };
    const overlay = { a: null } as unknown as Partial<typeof base>;
    expect(deepMerge(base, overlay)).toEqual({ b: 2 });
  });

  it("undefined in overlay retains base value", () => {
    const base = { a: 1, b: 2 };
    const overlay = { a: undefined, c: 3 } as unknown as Partial<typeof base>;
    expect(deepMerge(base, overlay)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("arrays are replaced wholesale", () => {
    const base = { items: [1, 2, 3] };
    const overlay = { items: [4, 5] };
    expect(deepMerge(base, overlay)).toEqual({ items: [4, 5] });
  });

  it("primitives are replaced", () => {
    const base = { count: 5 };
    const overlay = { count: 10 };
    expect(deepMerge(base, overlay)).toEqual({ count: 10 });
  });

  it("does not mutate inputs", () => {
    const base = { a: { b: 1 } };
    const overlay = { a: { c: 2 } } as unknown as Partial<typeof base>;
    const result = deepMerge(base, overlay);
    expect(base).toEqual({ a: { b: 1 } });
    expect(overlay).toEqual({ a: { c: 2 } });
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it("returns overlay when base is not a plain object", () => {
    expect(
      deepMerge(
        42 as unknown as Record<string, unknown>,
        { a: 1 } as Partial<Record<string, unknown>>,
      ),
    ).toEqual({ a: 1 });
  });

  it("returns base when overlay is not a plain object", () => {
    expect(deepMerge({ a: 1 }, null as unknown as Partial<{ a: number }>)).toEqual({ a: 1 });
  });
});
