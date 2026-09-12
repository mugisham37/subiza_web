import { claims } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Banner, ButtonLink, EscalationLadder, ForwardingCodeCard } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function HowView({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations();
  return (
    <PublicShell lang={lang} path="/how">
      <Section
        tone="default"
        eyebrow={t("how.eyebrow")}
        title={t("how.title", { year: claims.forwardingSince.value })}
        lede={t("how.lede")}
      >
        <div className="g2">
          <div className="steps">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <div key={n} className="step">
                <h3>{t(`how.s${n}`)}</h3>
                <p dangerouslySetInnerHTML={{ __html: t.raw(`how.s${n}b`) }} />
                {n === 2 ? (
                  <ForwardingCodeCard
                    number="250788456123"
                    platformNote={t("how.plat")}
                    heading={t("how.heading")}
                    offNote={t("how.off")}
                    copyLabel={t("how.copy")}
                    dialLabel={t("how.dial")}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div>
            <h3>{t("how.break")}</h3>
            <p>{t("how.breakLede")}</p>
            <EscalationLadder
              rungs={[
                { title: t("how.r1"), detail: t("how.r1d"), state: "done" },
                { title: t("how.r2"), detail: t("how.r2d"), state: "done" },
                { title: t("how.r3"), detail: t("how.r3d"), state: "done" },
                { title: t("how.r4"), detail: t("how.r4d"), state: "now" },
              ]}
            />
            <Banner tone="ok" title={t("how.promise")}>
              {t("how.promiseBody")}
            </Banner>
            <ButtonLink href="/start" tone="primary">
              {t("how.cta")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
