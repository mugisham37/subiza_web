import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { asSiteLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { ActivateView } from "@/views/ActivateView/ActivateView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/activate">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/activate",
    title: t("activateTitle"),
    description: t("description"),
    index: false,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/activate">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <ActivateView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
