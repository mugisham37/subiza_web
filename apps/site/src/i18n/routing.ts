import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@subiza/i18n";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
