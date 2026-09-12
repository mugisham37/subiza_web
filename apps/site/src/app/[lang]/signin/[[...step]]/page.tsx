import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { ViewTransition } from "react";
import { loadAuth } from "@/features/auth/load";
import { asSiteLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { AuthView } from "@/views/AuthView/AuthView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/signin/[[...step]]">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/signin",
    title: t("signinTitle"),
    description: t("description"),
    index: false,
  });
}

export default async function Page({
  params,
}: PageProps<"/[lang]/signin/[[...step]]">) {
  const { lang, step } = await params;
  const model = await loadAuth("signin", step, lang);
  return (
    <ViewTransition>
      <AuthView lang={asSiteLocale(lang)} model={model} />
    </ViewTransition>
  );
}
