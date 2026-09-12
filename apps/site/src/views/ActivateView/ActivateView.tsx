import { SESSION_COOKIE } from "@subiza/auth-tenant";
import type { SiteLocale } from "@subiza/i18n";
import { ButtonLink, Icon, Tag } from "@subiza/ui";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import "../AuthView/auth.css";

export async function ActivateView({ lang }: { lang: SiteLocale }) {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) redirect(`/${lang}/start` as never);
  const t = await getTranslations("auth");

  return (
    <div className="auth">
      <div className="authmain">
        <header className="authhead">
          <Link href="/" className="blogo">
            <span className="mk">
              <Icon name="audio-lines" size={17} />
            </span>
            <b>Subiza</b>
          </Link>
          <Tag>{t("tagStart")}</Tag>
        </header>
        <main id="content" className="authbody">
          <div className="screen" style={{ textAlign: "center" }}>
            <div className="donemark">
              <Icon name="phone-call" size={34} />
            </div>
            <h1>{t("activateTitle")}</h1>
            <p className="sub" style={{ maxWidth: "38ch", marginLeft: "auto", marginRight: "auto" }}>
              {t("activateLede")}
            </p>
            <a className="fbrow wa" href="https://wa.me/250788782492">
              <span className="fi">
                <Icon name="message-circle-more" size={16} />
              </span>
              <span className="fw">
                <b>{t("messageUs")}</b>
                <span>0788 782 492</span>
              </span>
            </a>
            <div style={{ marginTop: "var(--s-7)" }}>
              <ButtonLink href={`/${lang}/start/done`} tone="secondary" size="lg" block>
                {t("back")}
              </ButtonLink>
            </div>
          </div>
        </main>
        <footer className="authfoot">
          <p className="microfoot" style={{ textAlign: "left" }}>
            {t("footStore")} · <Link href="/legal/privacy">{t("footPrivacy")}</Link> ·{" "}
            <a href="mailto:ibanga@subiza.rw">ibanga@subiza.rw</a>
          </p>
        </footer>
      </div>
      <aside className="authaside">
        <div className="gprev">
          <div className="gl">
            <Icon name="phone-call" size={14} />
            <span>{t("asideNext")}</span>
          </div>
          <p className="gq">{t("asideNextBody")}</p>
        </div>
      </aside>
    </div>
  );
}
