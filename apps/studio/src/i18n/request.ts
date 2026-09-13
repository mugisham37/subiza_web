import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import en from "../../messages/en.json";
import rw from "../../messages/rw.json";

const catalogs = { en, rw } as const;

export default getRequestConfig(async () => {
  const jar = await cookies();
  const header = (await headers()).get("x-subiza-locale");
  const raw = jar.get("subiza-locale")?.value ?? header ?? "rw";
  const locale = raw === "en" ? "en" : "rw";
  return { locale, messages: catalogs[locale] };
});
