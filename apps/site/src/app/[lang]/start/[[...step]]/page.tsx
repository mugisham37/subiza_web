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
}: PageProps<"/[lang]/start/[[...step]]">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/start",
    title: t("startTitle"),
    description: t("description"),
    index: false,
  });
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[lang]/start/[[...step]]">) {
  const { lang, step } = await params;
  const query = await searchParams;
  const entry = typeof query["ref"] === "string" ? "referral" : typeof query["invite"] === "string" ? "invite" : undefined;
  const model = await loadAuth("start", step, lang, entry ? { entry } : {});
  return (
    <ViewTransition>
      <AuthView lang={asSiteLocale(lang)} model={model} />
    </ViewTransition>
  );
}
