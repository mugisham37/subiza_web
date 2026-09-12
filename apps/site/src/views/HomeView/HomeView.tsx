import {
  claims,
  comparisonWages,
  DEMO_TEL_DISPLAY,
  DEMO_TEL_E164,
  DEMO_WHATSAPP,
  formatRwf,
} from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import {
  Banner,
  ButtonLink,
  Card,
  CardBody,
  Icon,
  LiveCallCard,
  RowItem,
  RowList,
  Tag,
  Transcript,
  WhatsAppBubble,
} from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { ComparisonBars } from "../chrome/ComparisonBars";
import { DemoCall } from "../chrome/DemoCall";
import { FaqList } from "../chrome/FaqList";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function HomeView({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations();

  return (
    <PublicShell lang={lang} path="/">
      <section className="hero">
        <div className="sc in">
          <div>
            <p className="eyebrow">
              <i />
              {t("hero.eyebrow")}
            </p>
            <h1 dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
            <p className="lede">{t("hero.lede")}</p>
            <div className="herocta" data-hero-cta>
              <ButtonLink href={`tel:${DEMO_TEL_E164}`} tone="primary" size="lg">
                <Icon name="phone-call" size={16} />
                {t("hero.hear")}
              </ButtonLink>
              <ButtonLink href="/how" tone="secondary" size="lg">
                {t("hero.how")}
                <Icon name="arrow-right" size={16} />
              </ButtonLink>
            </div>
            <ul className="herotrust">
              <li>{t("hero.keepNumber")}</li>
              <li>{t("hero.noCard")}</li>
              <li>{t("hero.momo")}</li>
              <li>{t("hero.offCode")}</li>
            </ul>
          </div>
          <DemoCall lang={lang} />
        </div>
      </section>

      <Section
        tone="default"
        headingLevel={2}
        eyebrow={t("honesty.eyebrow")}
        title={t("honesty.title")}
        lede={t("honesty.intro")}
      >
        <div className="proof">
          <div>
            <h3>{t("honesty.can")}</h3>
            <ul>
              {(["can1", "can2", "can3", "can4"] as const).map((key) => (
                <li key={key}>
                  <Icon name="check" size={16} />
                  <span>{t(`honesty.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("honesty.cant")}</h3>
            <ul>
              {(["cant1", "cant2", "cant3", "cant4"] as const).map((key) => (
                <li key={key}>
                  <Icon name="info" size={16} />
                  <span>{t(`honesty.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        tone="ink"
        headingLevel={2}
        eyebrow={t("hear.eyebrow")}
        title={t("hear.title")}
        lede={t("hear.lede")}
      >
        <p className="illus">{t("hear.label")}</p>
        <LiveCallCard
          who={t("hear.who")}
          line={t("hear.line")}
          elapsed="01:24"
          liveLabel={t("hear.needed")}
          primaryLabel={t("hear.taken")}
        />
        <Transcript
          turns={[
            {
              id: "1",
              speaker: "ai",
              name: "Subiza",
              time: "14:02",
              text: "Muraho, Salon Ubwiza. Ndi umufasha wa Aline. Nabafasha nte?",
              original: "Hello, Salon Ubwiza. I'm Aline's assistant. How can I help?",
            },
            {
              id: "2",
              speaker: "human",
              name: "MK",
              time: "14:02",
              text: "Mwakwakira abantu umunani ku wa gatandatu mu gitondo?",
              original: "Could you take eight people on Saturday morning?",
            },
            {
              id: "3",
              speaker: "ai",
              name: "Subiza",
              time: "14:02",
              text: "Icyo nticyo nemeza njyenyine. Aline azaguhamagara mbere ya saa kumi n'ebyiri. Yego?",
              original: "That's not something I can confirm myself. Aline will call you before 6pm. Is that all right?",
              mark: t("hear.mark"),
            },
          ]}
        />
        <p className="sec-lede" dangerouslySetInnerHTML={{ __html: t.raw("hear.close") }} />
      </Section>

      <Section
        tone="tint"
        headingLevel={2}
        eyebrow={t("thursday.eyebrow")}
        title={t("thursday.title")}
        lede={t("thursday.lede")}
      >
        <p className="illus">{t("thursday.label")}</p>
        <div className="g2">
          <div>
            <h3>{t("thursday.now")}</h3>
            <RowList>
              <RowItem title="+250 788 402 119" subtitle={t("thursday.r1")} side={<Tag tone="risk">{t("thursday.lost")}</Tag>} />
              <RowItem title="+250 722 118 004" subtitle={t("thursday.r2")} side={<Tag tone="risk">{t("thursday.lost")}</Tag>} />
              <RowItem title="WhatsApp" subtitle={t("thursday.r3")} side={<Tag tone="warn">{t("thursday.late")}</Tag>} />
              <RowItem title="+250 788 900 331" subtitle={t("thursday.r4")} side={<Tag tone="risk">{t("thursday.lost")}</Tag>} />
            </RowList>
            <p className="hint">4 {t("thursday.nowFoot")}</p>
          </div>
          <div>
            <h3>{t("thursday.with")}</h3>
            <RowList>
              <RowItem title="Marie K." subtitle={t("thursday.w1")} side={<Tag tone="ok">{t("thursday.handled")}</Tag>} />
              <RowItem title="Jean B." subtitle={t("thursday.w2")} side={<Tag tone="ok">{t("thursday.handled")}</Tag>} />
              <RowItem title="WhatsApp" subtitle={t("thursday.w3")} side={<Tag tone="ok">{t("thursday.handled")}</Tag>} />
              <RowItem title="Eric N." subtitle={t("thursday.w4")} side={<Tag tone="info">{t("thursday.handed")}</Tag>} />
            </RowList>
            <p className="hint">4 {t("thursday.withFoot")}</p>
          </div>
        </div>
      </Section>

      <Section headingLevel={2} tone="default" eyebrow={t("who.eyebrow")} title={t("who.title")} lede={t("who.lede")}>
        <div className="who-grid">
          <Card>
            <CardBody>
              <h3>{t("who.salon")}</h3>
              <p>{t("who.salonBody")}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3>{t("who.clinic")}</h3>
              <p>{t("who.clinicBody")}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3>{t("who.hotel")}</h3>
              <p>{t("who.hotelBody")}</p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section
        headingLevel={2}
        tone="default"
        eyebrow={t("code.eyebrow")}
        title={t("code.title", { year: claims.forwardingSince.value })}
        lede={<span dangerouslySetInnerHTML={{ __html: t.raw("code.lede") }} />}
      >
        <ButtonLink href="/how" tone="secondary">
          {t("code.see")}
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </Section>

      <Section
        headingLevel={2}
        tone="tint"
        eyebrow={t("channels.eyebrow")}
        title={t("channels.title")}
        lede={t("channels.lede")}
      >
        <div className="chan-grid">
          {(
            [
              ["phone", "phone", "phoneDetail"],
              ["wa", "message-circle", "waDetail"],
              ["sms", "mails", "smsDetail"],
              ["messenger", "message-circle-more", "messengerDetail"],
              ["web", "message-square-text", "webDetail"],
              ["ussd", "smartphone", "ussdDetail"],
              ["notes", "mic", "notesDetail"],
              ["ig", "image", "igDetail"],
            ] as const
          ).map(([key, icon, detail]) => (
            <Card key={key}>
              <CardBody>
                <Icon name={icon} size={22} />
                <h3>{t(`channels.${key}`)}</h3>
                <p>{t(`channels.${detail}`)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section headingLevel={2} tone="default" eyebrow={t("kinya.eyebrow")} title={t("kinya.title")} lede={t("kinya.lede")}>
        <Banner tone="info" title={t("kinya.title")}>
          {t("kinya.unique")}
        </Banner>
      </Section>

      <Section
        headingLevel={2}
        tone="tint"
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title")}
        lede={t("compare.lede")}
      >
        <ComparisonBars
          locale={lang}
          labels={{
            rep: t("compare.rep"),
            desk: t("compare.desk"),
            us: t("compare.us"),
          }}
        />
        <p className="hint">
          {formatRwf(comparisonWages.supportRepRwf, lang)} · {formatRwf(comparisonWages.receptionistRwf, lang)} ·{" "}
          {formatRwf(comparisonWages.subizaFromRwf, lang)}
        </p>
        <div className="dims">
          <Card>
            <CardBody>
              <h3>{t("compare.hours")}</h3>
              <p>
                {t("compare.hoursUs")} / {t("compare.hoursThem")}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3>{t("compare.lang")}</h3>
              <p>
                {t("compare.langUs")} / {t("compare.langThem")}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3>{t("compare.stop")}</h3>
              <p>
                {t("compare.stopUs")} / {t("compare.stopThem")}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3>{t("compare.nothing")}</h3>
              <p>{t("compare.nothingBody")}</p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section headingLevel={2} tone="default" eyebrow={t("report.eyebrow")} title={t("report.title")} lede={t("report.lede")}>
        <p className="illus">{t("thursday.label")}</p>
        <WhatsAppBubble
          name={t("report.name")}
          outcome={t("report.outcome")}
          weakness={t("report.weakness")}
          href={`/${lang}/start`}
          time={t("report.time")}
        />
      </Section>

      <Section headingLevel={2} tone="default" eyebrow={t("wrong.eyebrow")} title={t("wrong.title")} lede={t("wrong.lede")}>
        <ol className="wrong">
          <li>{t("wrong.w1")}</li>
          <li>{t("wrong.w2")}</li>
          <li>{t("wrong.w3")}</li>
          <li>{t("wrong.w4")}</li>
          <li>{t("wrong.w5")}</li>
        </ol>
      </Section>

      <Section headingLevel={2} tone="default" eyebrow={t("faq.eyebrow")} title={t("faq.title")}>
        <FaqList
          items={[1, 2, 3, 4, 5, 6, 7].map((n) => ({
            q: t(`faq.q${n}`),
            a: n === 7 ? t("faq.a7", { year: claims.forwardingSince.value }) : t(`faq.a${n}`),
          }))}
        />
      </Section>

      <Section headingLevel={2} tone="tint" eyebrow={t("pilot.eyebrow")} title={t("pilot.title")} lede={t("pilot.lede")}>
        <Banner tone="info" title={t("pilot.partial")}>
          {t("pilot.applyBody")}
        </Banner>
        <ButtonLink href="/contact" tone="primary">
          {t("pilot.apply")}
        </ButtonLink>
      </Section>

      <Section headingLevel={2} tone="ink" title={<span dangerouslySetInnerHTML={{ __html: t.raw("final.title") }} />} lede={t("final.lede")}>
        <div className="herocta">
          <ButtonLink href={`tel:${DEMO_TEL_E164}`} tone="primary" size="lg">
            {t("final.call", { number: DEMO_TEL_DISPLAY })}
          </ButtonLink>
          <ButtonLink href="/start" tone="secondary" size="lg">
            {t("final.account")}
          </ButtonLink>
          <ButtonLink href={DEMO_WHATSAPP} tone="ghost" size="lg">
            {t("final.wa")}
          </ButtonLink>
        </div>
      </Section>
    </PublicShell>
  );
}
