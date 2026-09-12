import { siteLocales, type SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { demoOutcomes, HeardView } from "@/views/HeardView/HeardView";
import { asSiteLocale } from "@/lib/locale";

export function generateStaticParams() {
  return siteLocales.flatMap((lang) =>
    demoOutcomes.map((outcome) => ({ lang, outcome })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/heard/[outcome]">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/",
    title: t("heardTitle"),
    description: t("description"),
    index: false,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/heard/[outcome]">) {
  const { lang, outcome } = await params;
  return (
    <ViewTransition>
      <HeardView lang={asSiteLocale(lang)} outcome={outcome} />
    </ViewTransition>
  );
}
