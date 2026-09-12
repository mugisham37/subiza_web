import { defineRouting } from "next-intl/routing";
import { siteLocales } from "@subiza/i18n";

export const routing = defineRouting({
  locales: siteLocales,
  defaultLocale: "rw",
  localePrefix: "always",
  localeDetection: true,
});
