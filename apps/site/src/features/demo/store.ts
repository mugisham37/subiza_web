const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_NUMBER = 2;

type Stamp = number[];

const byNumber = new Map<string, Stamp>();
const byIp = new Map<string, Stamp>();
const seen = new Set<string>();

function prune(stamps: Stamp, now: number): Stamp {
  return stamps.filter((time) => now - time < WINDOW_MS);
}

export function resetDemoStore() {
  byNumber.clear();
  byIp.clear();
  seen.clear();
}

export function rememberIdempotency(key: string): boolean {
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}

export function checkRateLimit(number: string, ip: string): { ok: true } | { ok: false; retryAfterMinutes: number } {
  const now = Date.now();
  const numbers = prune(byNumber.get(number) ?? [], now);
  const ips = prune(byIp.get(ip) ?? [], now);
  if (numbers.length >= MAX_PER_NUMBER || ips.length >= MAX_PER_NUMBER * 4) {
    const oldest = Math.min(...numbers, ...ips);
    return { ok: false, retryAfterMinutes: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 60000)) };
  }
  return { ok: true };
}

export function recordDemo(number: string, ip: string) {
  const now = Date.now();
  byNumber.set(number, [...prune(byNumber.get(number) ?? [], now), now]);
  byIp.set(ip, [...prune(byIp.get(ip) ?? [], now), now]);
}
