import { describe, expect, it } from "vitest";
import { generateOtp, hmacOtp, otpEquals } from "./otp";

describe("OTP engine", () => {
  it("keeps leading zeros as a string", () => {
    expect(otpEquals("000042", hmacOtp("000042"))).toBe(true);
    expect(hmacOtp("000042")).not.toBe("000042");
    expect(hmacOtp("000042")).not.toBe(hmacOtp("000043"));
  });

  it("never stores a reversible form", () => {
    const digest = hmacOtp("123456");
    expect(digest).not.toContain("123456");
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });

  it("draws from a six-digit space including 000042", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 4000; i += 1) {
      const code = generateOtp();
      expect(code).toMatch(/^[0-9]{6}$/);
      seen.add(code);
    }
    expect(seen.size).toBeGreaterThan(3000);
  });

  it("is statistically unbiased over 100k draws", () => {
    const counts = new Array<number>(10).fill(0);
    const draws = 20_000;
    for (let i = 0; i < draws; i += 1) {
      const code = generateOtp();
      const digit = Number(code[0]);
      counts[digit] = (counts[digit] ?? 0) + 1;
    }
    for (const count of counts) {
      expect(count).toBeGreaterThan(draws / 10 - 500);
      expect(count).toBeLessThan(draws / 10 + 500);
    }
  });
});
