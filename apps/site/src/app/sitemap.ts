import { SITE_ORIGIN } from "@subiza/core";
import { siteLocales } from "@subiza/i18n";
import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";

const paths = [
  "/",
  "/how",
  "/pricing",
  "/security",
  "/about",
  "/contact",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
  "/legal/dpa",
  "/legal/voice-consent",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${SITE_ORIGIN}${getPathname({ locale: "rw", href: path })}`,
    alternates: {
      languages: Object.fromEntries(
        siteLocales.map((locale) => [
          locale,
          `${SITE_ORIGIN}${getPathname({ locale, href: path })}`,
        ]),
      ),
    },
  }));
}
