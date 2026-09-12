import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { SecurityView } from "@/views/SecurityView/SecurityView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[lang]/security">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/security",
    title: t("securityTitle"),
    description: t("securityDescription"),
  });
}

export default async function Page({ params }: PageProps<"/[lang]/security">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <SecurityView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
