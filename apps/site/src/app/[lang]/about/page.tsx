import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { AboutView } from "@/views/AboutView/AboutView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/about",
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  });
}

export default async function Page({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <AboutView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
