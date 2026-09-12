import type { SiteLocale } from "@subiza/i18n";
import { Button, Field, Input } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { submitDataRequest } from "@/features/demo/place-demo-call";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function DataRequestView({
  lang,
  sent = false,
}: {
  lang: SiteLocale;
  sent?: boolean;
}) {
  const t = await getTranslations();
  return (
    <PublicShell lang={lang} path="/data-request">
      <Section tone="default" eyebrow={t("data.eyebrow")} title={t("data.title")} lede={t("data.lede")} narrow>
        {sent ? <p role="status">{t("data.sent")}</p> : null}
        <form action={submitDataRequest}>
          <input type="hidden" name="locale" value={lang} />
          <label className="honeypot" htmlFor="company-d">
            {t("demo.company")}
            <input id="company-d" name="company" tabIndex={-1} autoComplete="off" />
          </label>
          <fieldset>
            <legend>{t("data.type")}</legend>
            <label>
              <input type="radio" name="type" value="access" defaultChecked /> {t("data.access")}
            </label>
            <label>
              <input type="radio" name="type" value="correct" /> {t("data.correct")}
            </label>
            <label>
              <input type="radio" name="type" value="erase" /> {t("data.erase")}
            </label>
            <label>
              <input type="radio" name="type" value="port" /> {t("data.port")}
            </label>
          </fieldset>
          <Field id="d-id" label={t("data.identity")}>
            <Input id="d-id" name="identity" required autoComplete="tel" />
          </Field>
          <p className="hint">{t("data.window")}</p>
          <Button type="submit" tone="primary">
            {t("data.submit")}
          </Button>
        </form>
      </Section>
    </PublicShell>
  );
}
