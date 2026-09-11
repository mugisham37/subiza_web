import { describe, expect, it } from "vitest";
import { formatDuration, formatRwandaPhone, formatRwf } from "./format";

describe("formatters", () => {
  it("formats RWF with no minor unit", () => {
    const value = formatRwf(14200, "en");
    expect(value.includes("14")).toBe(true);
    expect(value.includes(".00")).toBe(false);
  });

  it("formats a Rwandan mobile number", () => {
    expect(formatRwandaPhone("0788123456")).toBe("+250 788 123 456");
    expect(formatRwandaPhone("+250788123456")).toBe("+250 788 123 456");
  });

  it("formats a call duration", () => {
    expect(formatDuration(125)).toBe("02:05");
  });
});
