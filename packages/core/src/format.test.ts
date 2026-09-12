import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatRwandaPhone,
  formatRwf,
  isAllocatedRwandaMno,
  parseRwandaPhone,
} from "./format";

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

  it("parses a Rwandan mobile to E.164", () => {
    expect(parseRwandaPhone("0788123456")).toBe("+250788123456");
    expect(parseRwandaPhone("+1 202 555 0100")).toBeNull();
  });

  it("refuses unallocated and foreign prefixes before spend", () => {
    expect(isAllocatedRwandaMno("+250788123456")).toBe(true);
    expect(isAllocatedRwandaMno("+250721234567")).toBe(true);
    expect(isAllocatedRwandaMno("+250761234567")).toBe(false);
    expect(isAllocatedRwandaMno("+12025550100")).toBe(false);
  });
});
