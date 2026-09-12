import {
  claims,
  DEMO_TEL_DISPLAY,
  DEMO_TEL_E164,
} from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Banner, Button, Field, Icon, Input } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { placeDemoCall } from "@/features/demo/place-demo-call";

export async function DemoCall({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations("demo");

  return (
    <aside className="tryit" id="tryit">
      <div className="tryit-tabs" role="tablist">
        <a className="on" href="#call-subiza">
          {t("callTab")}
        </a>
        <a href="#we-call-you">{t("weCallTab")}</a>
      </div>
      <div className="tryit-body" id="call-subiza">
        <p>{t("callIntro")}</p>
        <a className="dialnum" href={`tel:${DEMO_TEL_E164}`}>
          {DEMO_TEL_DISPLAY}
        </a>
        <p>
          <b>{t("try")}</b>
        </p>
        <ul className="try-list">
          <li>{t("try1")}</li>
          <li>{t("try2")}</li>
          <li>{t("try3")}</li>
          <li>{t("try4")}</li>
        </ul>
        <p className="hint">{t("abuse", { minutes: claims.onboardingMinutes.value })}</p>
      </div>
      <form className="tryit-body" id="we-call-you" action={placeDemoCall}>
        <input type="hidden" name="locale" value={lang} />
        <p>{t("weIntro")}</p>
        <label className="honeypot" htmlFor="company">
          {t("company")}
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <Field id="demo-phone" label={t("phone")} hint={t("hint")}>
          <Input
            id="demo-phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="788 123 456"
            required
          />
        </Field>
        <Button type="submit" tone="primary" block>
          {t("submit")}
          <Icon name="arrow-right" size={16} />
        </Button>
        <p className="hint">{t("consent")}</p>
      </form>
    </aside>
  );
}

export function DemoFallback() {
  return (
    <p>
      <a className="dialnum" href={`tel:${DEMO_TEL_E164}`}>
        {DEMO_TEL_DISPLAY}
      </a>
    </p>
  );
}

export async function DemoNotice({
  tone,
  title,
  body,
}: {
  tone: "warn" | "risk" | "info";
  title: string;
  body: string;
}) {
  return (
    <Banner tone={tone} title={title}>
      {body}
    </Banner>
  );
}
