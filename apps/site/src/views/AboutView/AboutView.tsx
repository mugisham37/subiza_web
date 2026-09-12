import { claims, DEMO_TEL_DISPLAY } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Banner } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function AboutView({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations();
  return (
    <PublicShell lang={lang} path="/about">
      <Section
        tone="default"
        eyebrow={t("about.eyebrow")}
        title={<span dangerouslySetInnerHTML={{ __html: t.raw("about.title") }} />}
        lede={<span dangerouslySetInnerHTML={{ __html: t.raw("about.lede") }} />}
        narrow
      >
        <div className="prose">
          <h3>{t("about.notice")}</h3>
          <p>{t("about.notice1")}</p>
          <p>{t("about.notice2", { enterprises: claims.rwandaEnterprises.value.toLocaleString("en-RW") })}</p>
          <h3>{t("about.believe")}</h3>
          <p>
            <b>{t("about.b1")}</b> {t("about.b1b")}
          </p>
          <p>
            <b>{t("about.b2")}</b> {t("about.b2b")}
          </p>
          <p>
            <b>{t("about.b3")}</b> {t("about.b3b")}
          </p>
          <p>
            <b>{t("about.b4")}</b> {t("about.b4b")}
          </p>
          <h3>{t("about.where")}</h3>
          <p>
            {t("about.whereBody")} {DEMO_TEL_DISPLAY}
          </p>
          <Banner tone="info" title={t("about.team")}>
            {t("about.teamBody")}
          </Banner>
          <p>{t("about.address")}</p>
          <p>{t("about.rdb")}</p>
          <h3>{t("about.name")}</h3>
          <p>{t("about.nameBody")}</p>
        </div>
      </Section>
    </PublicShell>
  );
}
