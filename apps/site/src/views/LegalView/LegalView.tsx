import { citations, DPO_EMAIL } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Card, RowItem, RowList } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { PublicShell } from "../chrome/PublicShell";
import { Section } from "../chrome/Section";

export async function LegalView({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations();
  return (
    <PublicShell lang={lang} path="/legal">
      <Section tone="default" eyebrow={t("legal.eyebrow")} title={t("legal.title")} lede={t("legal.lede")}>
        <div className="g2">
          <div className="prose">
            <h3>{t("legal.collect")}</h3>
            <table className="deftbl">
              <thead>
                <tr>
                  <th>{t("legal.what")}</th>
                  <th>{t("legal.why")}</th>
                  <th>{t("legal.kept")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("legal.phone")}</td>
                  <td>{t("legal.phoneWhy")}</td>
                  <td>{t("legal.phoneKept")}</td>
                </tr>
                <tr>
                  <td>{t("legal.biz")}</td>
                  <td>{t("legal.bizWhy")}</td>
                  <td>{t("legal.bizKept")}</td>
                </tr>
                <tr>
                  <td>{t("legal.transcripts")}</td>
                  <td>{t("legal.transcriptsWhy")}</td>
                  <td>{t("legal.transcriptsKept")}</td>
                </tr>
                <tr>
                  <td>{t("legal.rec")}</td>
                  <td>{t("legal.recWhy")}</td>
                  <td>{t("legal.recKept")}</td>
                </tr>
                <tr>
                  <td>{t("legal.callers")}</td>
                  <td>{t("legal.callersWhy")}</td>
                  <td>{t("legal.callersKept")}</td>
                </tr>
                <tr>
                  <td>{t("legal.voice")}</td>
                  <td>{t("legal.voiceWhy")}</td>
                  <td>{t("legal.voiceKept")}</td>
                </tr>
              </tbody>
            </table>
            <h3>{t("legal.lives")}</h3>
            <p>{t("legal.livesBody")}</p>
            <h3>{t("legal.rights")}</h3>
            <ul>
              <li>{t("legal.access")}</li>
              <li>{t("legal.correction")}</li>
              <li>{t("legal.deletion")}</li>
              <li>{t("legal.port")}</li>
              <li>{t("legal.appeal")}</li>
            </ul>
            <h3>{t("legal.never")}</h3>
            <ul>
              <li>{t("legal.n1")}</li>
              <li>{t("legal.n2")}</li>
              <li>{t("legal.n3")}</li>
              <li>{t("legal.n4")}</li>
            </ul>
          </div>
          <div>
            <Card>
              <h3>{t("legal.ai")}</h3>
              <p dangerouslySetInnerHTML={{ __html: t.raw("legal.aiBody") }} />
              <p>{t("legal.aiNote")}</p>
            </Card>
            <Card>
              <h3>{t("legal.dpo")}</h3>
              <p>{t("legal.dpoBody")}</p>
              <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
            </Card>
            <Card>
              <h3>{t("legal.docs")}</h3>
              <RowList>
                <RowItem href={`/${lang}/legal/terms`} title={t("legal.terms")} />
                <RowItem href={`/${lang}/legal/privacy`} title={t("legal.privacy")} />
                <RowItem href={`/${lang}/legal/dpa`} title={t("legal.dpa")} />
                <RowItem href={`/${lang}/legal/voice-consent`} title={t("legal.voiceDoc")} />
                <RowItem href={`/${lang}/data-request`} title={t("chrome.rights")} />
              </RowList>
            </Card>
            <Card>
              <h3>{t("legal.citations")}</h3>
              <ul>
                {Object.values(citations).map((cite) => (
                  <li key={cite.id}>
                    <a href={cite.url}>{cite.label}</a>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3>{t("legal.a11y")}</h3>
              <p>{t("legal.a11yBody")}</p>
            </Card>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}

export async function LegalDocumentView({
  lang,
  kind,
}: {
  lang: SiteLocale;
  kind: "terms" | "privacy" | "dpa" | "voice";
}) {
  const t = await getTranslations();
  const title =
    kind === "terms"
      ? t("legal.terms")
      : kind === "privacy"
        ? t("legal.privacy")
        : kind === "dpa"
          ? t("legal.dpa")
          : t("legal.voiceDoc");
  const lede =
    kind === "terms"
      ? t("docs.termsLede")
      : kind === "privacy"
        ? t("docs.privacyLede")
        : kind === "dpa"
          ? t("docs.dpaLede")
          : t("docs.voiceLede");
  return (
    <PublicShell lang={lang} path={`/legal/${kind === "voice" ? "voice-consent" : kind}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Subiza", item: `https://subiza.rw/${lang}` },
              { "@type": "ListItem", position: 2, name: t("legal.eyebrow"), item: `https://subiza.rw/${lang}/legal` },
              { "@type": "ListItem", position: 3, name: title },
            ],
          }),
        }}
      />
      <Section tone="default" eyebrow={t("legal.eyebrow")} title={title} lede={lede} narrow>
        <div className="prose">
          <p>{t("docs.updated")}</p>
          {kind === "privacy" ? (
            <>
              <h3>{t("legal.collect")}</h3>
              <p>{t("legal.phoneWhy")}</p>
              <h3>{t("legal.lives")}</h3>
              <p>{t("legal.livesBody")}</p>
              <h3>{t("legal.rights")}</h3>
              <ul>
                <li>{t("legal.access")}</li>
                <li>{t("legal.correction")}</li>
                <li>{t("legal.deletion")}</li>
                <li>{t("legal.port")}</li>
                <li>{t("legal.appeal")}</li>
              </ul>
              <h3>{t("legal.never")}</h3>
              <ul>
                <li>{t("legal.n1")}</li>
                <li>{t("legal.n2")}</li>
                <li>{t("legal.n3")}</li>
                <li>{t("legal.n4")}</li>
              </ul>
              <p>
                <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
              </p>
            </>
          ) : kind === "voice" ? (
            <>
              <p>{t("legal.voiceWhy")}</p>
              <p>{t("legal.voiceKept")}</p>
              <p dangerouslySetInnerHTML={{ __html: t.raw("legal.aiBody") }} />
              <p>{t("legal.aiNote")}</p>
              <p>
                <a href={`/${lang}/data-request`}>{t("chrome.rights")}</a>
              </p>
            </>
          ) : kind === "dpa" ? (
            <>
              <p>{t("legal.livesBody")}</p>
              <p>{t("security.subBody")}</p>
              <p>{t("security.accessBody")}</p>
              <p>{t("security.retentionBody")}</p>
              <p>{t("legal.n1")}</p>
            </>
          ) : (
            <>
              <p>{t("pricing.lede")}</p>
              <p>{t("how.promiseBody")}</p>
              <p>{t("legal.n4")}</p>
              <p>{t("legal.n1")}</p>
              <h3>{t("legal.ai")}</h3>
              <p dangerouslySetInnerHTML={{ __html: t.raw("legal.aiBody") }} />
            </>
          )}
        </div>
      </Section>
    </PublicShell>
  );
}
