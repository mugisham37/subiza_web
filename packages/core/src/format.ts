const RW_PHONE = /^(\+?250|0)?(7[2-9]\d{7})$/;

/** Allocated Rwanda MNO prefixes. Foreign and unallocated prefixes are refused before any OTP spend. */
export const ALLOCATED_RW_MNO = ["72", "73", "75", "78", "79"] as const;

/** Prefix → home network. Degrades to `unknown`. Always overridable by the owner. */
export const RW_MNO_BY_PREFIX: Record<string, "mtn" | "airtel"> = {
  "78": "mtn",
  "79": "mtn",
  "72": "airtel",
  "73": "airtel",
  "75": "airtel",
};

export function detectRwandaNetwork(e164: string): "mtn" | "airtel" | "unknown" {
  const match = /^\+?250?(7\d)\d{7}$/.exec(e164.replace(/\s+/g, ""));
  const prefix = match?.[1];
  if (!prefix) return "unknown";
  return RW_MNO_BY_PREFIX[prefix] ?? "unknown";
}

export function isAllocatedRwandaMno(e164: string): boolean {
  const match = /^\+250(7\d)\d{7}$/.exec(e164);
  const prefix = match?.[1];
  return prefix !== undefined && (ALLOCATED_RW_MNO as readonly string[]).includes(prefix);
}

export function parseRwandaPhone(raw: string): string | null {
  const digits = raw.replace(/\s+/g, "");
  const match = RW_PHONE.exec(digits);
  const local = match?.[2];
  if (!local) return null;
  return `+250${local}`;
}

export function formatRwf(amount: number, locale = "rw"): string {
  return new Intl.NumberFormat(locale === "rw" ? "en-RW" : locale, {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string, locale = "rw"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string, locale = "rw"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatRwandaPhone(raw: string): string {
  const digits = raw.replace(/\s+/g, "");
  const match = RW_PHONE.exec(digits);
  if (!match) return raw;
  const local = match[2];
  if (!local) return raw;
  return `+250 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

function intlLocale(locale: string): string {
  if (locale === "rw") return "en-RW";
  if (locale === "sw") return "sw-TZ";
  return locale;
}
