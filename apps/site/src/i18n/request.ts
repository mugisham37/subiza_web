import { getRequestConfig } from "next-intl/server";
import en from "../../../../packages/i18n/src/messages/en.json";
import fr from "../../../../packages/i18n/src/messages/fr.json";
import rw from "../../../../packages/i18n/src/messages/rw.json";
import sw from "../../../../packages/i18n/src/messages/sw.json";
import { routing } from "./routing";

const catalogs = { en, fr, rw, sw } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && requested in catalogs
      ? (requested as keyof typeof catalogs)
      : routing.defaultLocale;

  return { locale, messages: catalogs[locale] };
});
