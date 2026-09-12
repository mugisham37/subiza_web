import { getStore } from "./store";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type RateDecision =
  | { ok: true }
  | { ok: false; retryAfterSec: number; reason: "cooldown" | "window" | "source" };

function prune(hits: number[], since: number): number[] {
  return hits.filter((at) => at > since);
}

function take(key: string, windowMs: number, limit: number, now: number): RateDecision {
  const store = getStore();
  const bucket = store.buckets.get(key) ?? { hits: [] };
  bucket.hits = prune(bucket.hits, now - windowMs);
  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    store.buckets.set(key, bucket);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)), reason: "window" };
  }
  bucket.hits.push(now);
  store.buckets.set(key, bucket);
  return { ok: true };
}

function peek(key: string, windowMs: number, limit: number, now: number): boolean {
  const bucket = getStore().buckets.get(key);
  if (!bucket) return true;
  return prune(bucket.hits, now - windowMs).length < limit;
}

export function sendAllowed(input: {
  e164: string;
  ip: string;
  device: string;
  cgnat?: boolean;
}): RateDecision {
  const now = Date.now();
  const ipFactor = input.cgnat ? 10 : 1;

  const cooldown = take(`send:num:${input.e164}:30`, 30 * SECOND, 1, now);
  if (!cooldown.ok) return { ...cooldown, reason: "cooldown" };

  const windows: RateDecision[] = [
    take(`send:num:${input.e164}:15m`, 15 * MINUTE, 3, now),
    take(`send:num:${input.e164}:1h`, HOUR, 5, now),
    take(`send:num:${input.e164}:24h`, DAY, 8, now),
    take(`send:ip:${input.ip}:1h`, HOUR, 30 * ipFactor, now),
    take(`send:ip:${input.ip}:hard`, HOUR, 100 * ipFactor, now),
    take(`send:dev:${input.device}:1h`, HOUR, 5, now),
    take(`send:dev:${input.device}:1d`, DAY, 15, now),
  ];
  const blocked = windows.find((row) => !row.ok);
  return blocked ?? { ok: true };
}

export function verifyCodeAllowed(verificationId: string, max = 5): boolean {
  const record = getStore().verifications.get(verificationId);
  return Boolean(record && record.attempts < max && !record.consumedAt);
}

export function recordCodeAttempt(verificationId: string): number {
  const record = getStore().verifications.get(verificationId);
  if (!record) return 99;
  record.attempts += 1;
  return record.attempts;
}

/** Independent of code lifetime. Resend must not reset this. */
export function verifyNumberAllowed(e164: string, now = Date.now()): boolean {
  const hits = prune(getStore().verifyFails.get(e164) ?? [], now - HOUR);
  getStore().verifyFails.set(e164, hits);
  return hits.length < 10;
}

export function recordNumberFail(e164: string, now = Date.now()): number {
  const hits = prune(getStore().verifyFails.get(e164) ?? [], now - HOUR);
  hits.push(now);
  getStore().verifyFails.set(e164, hits);
  return hits.length;
}

export function numberFailCount(e164: string, now = Date.now()): number {
  return prune(getStore().verifyFails.get(e164) ?? [], now - HOUR).length;
}

export function sourceLooksHealthy(ip: string, device: string): boolean {
  const now = Date.now();
  return peek(`send:ip:${ip}:1h`, HOUR, 30, now) && peek(`send:dev:${device}:1h`, HOUR, 5, now);
}
