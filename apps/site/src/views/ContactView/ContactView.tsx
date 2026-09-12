import {
  claims,
  CONTACT_EMAIL,
  DEMO_TEL_DISPLAY,
  DEMO_TEL_E164,
  DEMO_WHATSAPP,
  DPO_EMAIL,
} from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Button, CardLink, Field, Input, Textarea } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { submitContact } from "@/features/demo/place-demo-call";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function ContactView({
  lang,
  sent = false,
}: {
  lang: SiteLocale;
  sent?: boolean;
}) {
  const t = await getTranslations();
  const start = String(claims.contactHoursStart.value);
  const end = String(claims.contactHoursEnd.value);
  return (
    <PublicShell lang={lang} path="/contact">
      <Section tone="default" eyebrow={t("contact.eyebrow")} title={t("contact.title")} lede={t("contact.lede")}>
        <div className="contact-grid">
          <CardLink href={DEMO_WHATSAPP}>
            <h3>{t("contact.wa")}</h3>
            <p>{t("contact.waBody", { start, end })}</p>
            <b>{DEMO_TEL_DISPLAY}</b>
          </CardLink>
          <CardLink href={`tel:${DEMO_TEL_E164}`}>
            <h3>{t("contact.call")}</h3>
            <p>{t("contact.callBody")}</p>
            <b>{DEMO_TEL_DISPLAY}</b>
          </CardLink>
          <CardLink href={`mailto:${CONTACT_EMAIL}`}>
            <h3>{t("contact.email")}</h3>
            <p>{t("contact.emailBody")}</p>
            <b>{CONTACT_EMAIL}</b>
          </CardLink>
        </div>
        <p className="hint">{t("contact.hoursNote")}</p>
        <div className="g2" style={{ marginTop: "var(--s-9)" }}>
          <div className="card">
            <h3>{t("contact.where")}</h3>
            <p>{t("about.address")}</p>
            <p>{t("about.rdb")}</p>
          </div>
          <div className="card">
            <h3>{t("contact.data")}</h3>
            <p>{t("contact.dataBody")}</p>
            <a className="btn btn-secondary btn-sm" href={`mailto:${DPO_EMAIL}`}>
              {DPO_EMAIL}
            </a>
          </div>
        </div>
        <form action={submitContact} style={{ maxWidth: 520, marginTop: "var(--s-10)" }}>
          <input type="hidden" name="locale" value={lang} />
          <h3>{t("contact.formTitle")}</h3>
          {sent ? <p role="status">{t("contact.sent", { end })}</p> : null}
          <label className="honeypot" htmlFor="company-c">
            {t("demo.company")}
            <input id="company-c" name="company" tabIndex={-1} autoComplete="off" />
          </label>
          <Field id="cname" label={t("contact.name")}>
            <Input id="cname" name="name" required />
          </Field>
          <Field id="cphone" label={t("contact.phone")}>
            <Input id="cphone" name="phone" inputMode="tel" autoComplete="tel" required />
          </Field>
          <Field id="cmsg" label={t("contact.message")}>
            <Textarea id="cmsg" name="message" required />
          </Field>
          <Button type="submit" tone="primary">
            {t("contact.send")}
          </Button>
        </form>
      </Section>
    </PublicShell>
  );
}
