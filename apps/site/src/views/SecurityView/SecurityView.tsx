import { DPO_EMAIL } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { ButtonLink } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

const KEYS = ["residency", "ncsa", "access", "retention", "sub", "breach", "host"] as const;

export async function SecurityView({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations();
  return (
    <PublicShell lang={lang} path="/security">
      <Section tone="default" eyebrow={t("security.eyebrow")} title={t("security.title")} lede={t("security.lede")} narrow>
        <div className="prose">
          {KEYS.map((key) => (
            <div key={key}>
              <h3>{t(`security.${key}`)}</h3>
              <p>{t(`security.${key}Body`)}</p>
            </div>
          ))}
          <p>
            <a href="/.well-known/security.txt">{t("security.txt")}</a>
            {" · "}
            <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
          </p>
          <ButtonLink href="/data-request" tone="primary">
            {t("security.cta")}
          </ButtonLink>
        </div>
      </Section>
    </PublicShell>
  );
}
