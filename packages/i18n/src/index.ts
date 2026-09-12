export const locales = ["rw", "en", "fr", "sw"] as const;
export const siteLocales = ["rw", "en"] as const;
export type Locale = (typeof locales)[number];
export type SiteLocale = (typeof siteLocales)[number];
export const defaultLocale: Locale = "rw";

export function isSiteLocale(value: string): value is SiteLocale {
  return (siteLocales as readonly string[]).includes(value);
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
