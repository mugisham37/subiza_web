import { claims } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Card, CardBody, Icon, PricingTiers } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function PricingView({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations();
  return (
    <PublicShell lang={lang} path="/pricing">
      <Section
        tone="default"
        eyebrow={t("pricing.eyebrow")}
        title={t("pricing.title")}
        lede={t("pricing.lede")}
      >
        <PricingTiers
          locale={lang}
          startHref={`/${lang}/start`}
          contactHref={`/${lang}/contact`}
          copy={{
            bannerTitle: t("pricing.bannerTitle"),
            bannerBody: t("pricing.bannerBody"),
            gloss: {
              gerageza: t("pricing.g0"),
              ubucuruzi: t("pricing.g1"),
              ikigo: t("pricing.g2"),
              "ikigo-plus": t("pricing.g3"),
            },
            bullets: {
              gerageza: [
                t("pricing.b0a", { minutes: claims.geragezaMinutes.value }),
                t("pricing.b0b", { messages: claims.geragezaMessages.value }),
                t("pricing.b0c"),
              ],
              ubucuruzi: [
                t("pricing.b1a", { minutes: claims.ubucuruziMinutes.value }),
                t("pricing.b1b", { messages: claims.ubucuruziMessages.value }),
                t("pricing.b1c"),
              ],
              ikigo: [
                t("pricing.b2a", { minutes: claims.ikigoMinutes.value }),
                t("pricing.b2b", { messages: claims.ikigoMessages.value }),
                t("pricing.b2c"),
              ],
              "ikigo-plus": [
                t("pricing.b3a", { minutes: claims.ikigoPlusMinutes.value }),
                t("pricing.b3b", { messages: claims.ikigoPlusMessages.value }),
                t("pricing.b3c"),
              ],
            },
            start: t("pricing.get"),
            contact: t("pricing.talk"),
            featured: t("pricing.featured"),
            perMonth: t("pricing.perMonth"),
            usdApprox: (amount) => t("pricing.usd", { amount }),
          }}
        />
        <div className="who-grid" style={{ marginTop: "var(--s-9)" }}>
          <Card>
            <CardBody>
              <h4>
                <Icon name="hand-coins" size={17} /> {t("pricing.momo")}
              </h4>
              <p>{t("pricing.momoBody")}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4>
                <Icon name="shield-check" size={17} /> {t("pricing.bill")}
              </h4>
              <p>{t("pricing.billBody")}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4>
                <Icon name="phone-call" size={17} /> {t("pricing.zero")}
              </h4>
              <p>{t("pricing.zeroBody")}</p>
            </CardBody>
          </Card>
        </div>
        <h2 style={{ marginTop: "var(--s-13)" }}>{t("pricing.freeTitle")}</h2>
        <div className="tblwrap">
          <table className="deftbl">
            <thead>
              <tr>
                <th>{t("pricing.thing")}</th>
                <th>{t("pricing.price")}</th>
                <th>{t("pricing.why")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("pricing.people")}</td>
                <td>{t("pricing.peoplePrice")}</td>
                <td>{t("pricing.peopleWhy")}</td>
              </tr>
              <tr>
                <td>{t("pricing.setup")}</td>
                <td>{t("pricing.setupPrice")}</td>
                <td>{t("pricing.setupWhy")}</td>
              </tr>
              <tr>
                <td>{t("pricing.off")}</td>
                <td>{t("pricing.offPrice")}</td>
                <td>{t("pricing.offWhy")}</td>
              </tr>
              <tr>
                <td>{t("pricing.credit")}</td>
                <td>{t("pricing.creditPrice")}</td>
                <td>{t("pricing.creditWhy")}</td>
              </tr>
              <tr>
                <td>{t("pricing.export")}</td>
                <td>{t("pricing.exportPrice")}</td>
                <td>{t("pricing.exportWhy")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </PublicShell>
  );
}
