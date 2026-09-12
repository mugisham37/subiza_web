import { DeniedState } from "@subiza/ui";
import type { SiteLocale } from "@subiza/i18n";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/consent/[token]">) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return pageMetadata({
    lang: lang as SiteLocale,
    path: "/data-request",
    title: t("voiceTitle"),
    description: t("dataDescription"),
    index: false,
  });
}

export default async function ConsentPage({
  params,
}: PageProps<"/[lang]/consent/[token]">) {
  const { token } = await params;
  const valid = /^[a-z0-9-]{12,}$/i.test(token);
  if (!valid) {
    return (
      <main id="content" className="sec">
        <DeniedState
          title="This consent link is not valid"
          body="It may have expired, or it was already used. Ask the business to send a new one."
        />
      </main>
    );
  }
  return (
    <main id="content" className="sec">
      <div className="sc sc-n">
        <h1>Voice consent</h1>
        <p>This public route is ready. The remaining screens ship in a later prompt.</p>
      </div>
    </main>
  );
}
