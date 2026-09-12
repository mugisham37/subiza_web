import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { DataRequestView } from "@/views/DataRequestView/DataRequestView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[lang]/data-request">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/data-request",
    title: t("dataTitle"),
    description: t("dataDescription"),
    index: false,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/data-request">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <DataRequestView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
