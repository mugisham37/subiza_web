import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { PricingView } from "@/views/PricingView/PricingView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/pricing",
    title: t("pricingTitle"),
    description: t("pricingDescription"),
  });
}

export default async function Page({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <PricingView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
