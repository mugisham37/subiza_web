import { SITE_ORIGIN } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function localeAlternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {
    "x-default": `${SITE_ORIGIN}${getPathname({ locale: "rw", href: path })}`,
  };
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_ORIGIN}${getPathname({ locale, href: path })}`;
  }
  return {
    canonical: undefined,
    languages,
  };
}

export function pageMetadata({
  lang,
  path,
  title,
  description,
  index = true,
}: {
  lang: SiteLocale;
  path: string;
  title: string;
  description: string;
  index?: boolean;
}): Metadata {
  const pathname = getPathname({ locale: lang, href: path });
  const languages = localeAlternates(path)?.languages;
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: {
      canonical: pathname,
      languages,
    },
    openGraph: {
      title,
      description,
      locale: lang === "rw" ? "rw_RW" : "en_GB",
      alternateLocale: lang === "rw" ? ["en_GB"] : ["rw_RW"],
      url: pathname,
      siteName: "Subiza",
      type: "website",
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
