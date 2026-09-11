export const locales = ["rw", "en", "fr", "sw"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "rw";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
