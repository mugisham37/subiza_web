import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { env, isProduction } from "./env";

const RANGE = 1_000_000;

function pepper(): string {
  const value = env("OTP_PEPPER");
  if (isProduction() && !value) {
    throw new Error("OTP_PEPPER must be set from KMS in production");
  }
  return value ?? "dev-only-pepper-not-a-kms-secret";
}

/**
 * CSPRNG with rejection sampling via crypto.randomInt — never Math.random,
 * never a timestamp, never `value % 1000000` on a raw 32-bit draw.
 * Stored as a zero-padded string so 000042 remains valid.
 */
export function generateOtp(): string {
  return String(randomInt(0, RANGE)).padStart(6, "0");
}

export function hmacOtp(code: string): string {
  return createHmac("sha256", pepper()).update(code, "utf8").digest("hex");
}

export function otpEquals(code: string, digest: string): boolean {
  const next = Buffer.from(hmacOtp(code), "hex");
  const held = Buffer.from(digest, "hex");
  if (next.length !== held.length) return false;
  return timingSafeEqual(next, held);
}

export function isSixDigitCode(value: string): boolean {
  return /^[0-9]{6}$/.test(value);
}
