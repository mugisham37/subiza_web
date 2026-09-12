import { claims, DEMO_TEL_DISPLAY, DEMO_TEL_E164 } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Banner, ButtonLink, LiveCallCard } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { DemoOutcome } from "@/features/demo/place-demo-call";
import { PublicShell } from "../chrome/PublicShell";

export const demoOutcomes = [
  "ringing",
  "answered",
  "rate-limited",
  "failed",
  "not-rwandan",
  "offline",
] as const satisfies readonly DemoOutcome[];

export async function HeardView({
  lang,
  outcome,
}: {
  lang: SiteLocale;
  outcome: string;
}) {
  if (!demoOutcomes.includes(outcome as DemoOutcome)) notFound();
  const t = await getTranslations();
  const tel = (
    <p>
      {t("demo.fallback")}{" "}
      <a className="dialnum" href={`tel:${DEMO_TEL_E164}`}>
        {DEMO_TEL_DISPLAY}
      </a>
    </p>
  );

  return (
    <PublicShell lang={lang} path={`/heard/${outcome}`}>
      <main className="sec">
        <div className="sc" style={{ maxWidth: 560 }}>
          {outcome === "ringing" ? (
            <>
              <h1>{t("demo.ringingTitle")}</h1>
              <p>{t("demo.ringingBody")}</p>
              <LiveCallCard who="Subiza" line={DEMO_TEL_DISPLAY} elapsed="00:08" compact />
              <ButtonLink href={`/${lang}/heard/answered`} tone="primary">
                {t("demo.pickedUp")}
              </ButtonLink>
            </>
          ) : null}
          {outcome === "answered" ? (
            <>
              <h1>{t("demo.doneTitle")}</h1>
              <p>{t("demo.doneBody")}</p>
              <ButtonLink href={`/${lang}/start`} tone="primary">
                {t("demo.keep")}
              </ButtonLink>
              <ButtonLink href="/" tone="secondary">
                {t("demo.again")}
              </ButtonLink>
            </>
          ) : null}
          {outcome === "rate-limited" ? (
            <>
              <h1>{t("demo.rateTitle")}</h1>
              <Banner tone="warn" title={t("demo.rateTitle")}>
                {t("demo.rateBody", { minutes: 180 })}
              </Banner>
              {tel}
            </>
          ) : null}
          {outcome === "failed" ? (
            <>
              <h1>{t("demo.failTitle")}</h1>
              <Banner tone="risk" title={t("demo.failTitle")}>
                {t("demo.failBody")}
              </Banner>
              {tel}
            </>
          ) : null}
          {outcome === "not-rwandan" ? (
            <>
              <h1>{t("demo.notRw")}</h1>
              <Banner tone="warn" title={t("demo.notRw")}>
                {t("demo.hint")}
              </Banner>
              {tel}
            </>
          ) : null}
          {outcome === "offline" ? (
            <>
              <h1>{t("demo.offlineTitle")}</h1>
              <Banner tone="info" title={t("demo.offlineTitle")}>
                {t("demo.offlineBody")}
              </Banner>
              {tel}
            </>
          ) : null}
          <p className="hint">{t("demo.consent")}</p>
          <p className="sr-only">{String(claims.demoPerDay.value)}</p>
        </div>
      </main>
    </PublicShell>
  );
}
