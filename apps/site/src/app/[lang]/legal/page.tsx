import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { LegalView } from "@/views/LegalView/LegalView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/legal",
    title: t("legalTitle"),
    description: t("legalDescription"),
  });
}

export default async function Page({ params }: PageProps<"/[lang]/legal">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <LegalView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
