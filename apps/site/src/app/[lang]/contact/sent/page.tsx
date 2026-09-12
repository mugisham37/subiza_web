import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { ContactView } from "@/views/ContactView/ContactView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact/sent">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
    index: false,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/contact/sent">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <ContactView lang={asSiteLocale(lang)} sent />
    </ViewTransition>
  );
}
