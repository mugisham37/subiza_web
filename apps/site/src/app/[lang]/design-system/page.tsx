import type { SiteLocale } from "@subiza/i18n";
import { ViewTransition } from "react";
import { pageMetadata } from "@/lib/metadata";
import { DesignSystemView } from "@/views/DesignSystemView/DesignSystemView";
import { asSiteLocale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/design-system">) {
  const { lang } = await params;
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/design-system",
    title: "Subiza design system",
    description: "Internal inventory. Not a marketing page.",
    index: false,
  });
}

export default async function DesignSystemPage({
  params,
}: PageProps<"/[lang]/design-system">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <DesignSystemView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
