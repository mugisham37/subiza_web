import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { HowView } from "@/views/HowView/HowView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[lang]/how">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/how",
    title: t("howTitle"),
    description: t("howDescription"),
  });
}

export default async function Page({ params }: PageProps<"/[lang]/how">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <HowView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
