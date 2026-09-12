import { isSiteLocale, type SiteLocale } from "@subiza/i18n";
import { notFound } from "next/navigation";

export function asSiteLocale(value: string): SiteLocale {
  if (!isSiteLocale(value)) notFound();
  return value;
}
