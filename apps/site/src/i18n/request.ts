import { getRequestConfig } from "next-intl/server";
import sharedEn from "../../../../packages/i18n/src/messages/en.json";
import sharedRw from "../../../../packages/i18n/src/messages/rw.json";
import siteEn from "../../messages/en.json";
import siteRw from "../../messages/rw.json";
import { routing } from "./routing";

const catalogs = {
  en: { ...sharedEn, ...siteEn },
  rw: { ...sharedRw, ...siteRw },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && requested in catalogs
      ? (requested as keyof typeof catalogs)
      : routing.defaultLocale;

  return { locale, messages: catalogs[locale] };
});
