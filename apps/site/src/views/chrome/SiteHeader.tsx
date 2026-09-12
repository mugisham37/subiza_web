import { DEMO_TEL_E164, DEMO_TEL_DISPLAY } from "@subiza/core";
import type { SiteLocale } from "@subiza/i18n";
import { Icon, MotionSwitch, ThemeSwitch } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const LINKS = [
  { href: "/how" as const, key: "how" },
  { href: "/pricing" as const, key: "pricing" },
  { href: "/security" as const, key: "security" },
  { href: "/about" as const, key: "about" },
  { href: "/contact" as const, key: "contact" },
];

function Prefs({ theme, motion }: { theme: string; motion: string }) {
  return (
    <details className="prefs">
      <summary className="btn btn-ghost btn-icon" aria-label={`${theme} · ${motion}`}>
        <Icon name="sun" size={16} />
      </summary>
      <div className="prefs-panel">
        <p className="prefs-label">{theme}</p>
        <ThemeSwitch />
        <p className="prefs-label">{motion}</p>
        <MotionSwitch />
      </div>
    </details>
  );
}

export async function SiteHeader({
  lang,
  path,
}: {
  lang: SiteLocale;
  path: string;
}) {
  const t = await getTranslations("nav");

  return (
    <header className="site-hdr" id="site-hdr">
      <div className="sc in">
        <Link href="/" className="logo">
          <span className="mk" aria-hidden>
            <Icon name="phone-call" size={16} />
          </span>
          Subiza
        </Link>
        <nav className="mainnav" aria-label="Primary">
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href}>
              {t(item.key)}
            </Link>
          ))}
          <Link href="/signin">{t("signin")}</Link>
          <Link href="/start" className="btn btn-primary btn-sm">
            {t("start")}
          </Link>
        </nav>
        <div className="hdr-tools">
          <div className="lang-switch" aria-label={t("language")}>
            <Link href={path || "/"} locale="rw" aria-current={lang === "rw" ? "page" : undefined}>
              RW
            </Link>
            <Link href={path || "/"} locale="en" aria-current={lang === "en" ? "page" : undefined}>
              EN
            </Link>
          </div>
          <Prefs theme={t("theme")} motion={t("motion")} />
          <a className="btn btn-ghost btn-sm hdr-tel" href={`tel:${DEMO_TEL_E164}`}>
            {DEMO_TEL_DISPLAY}
          </a>
        </div>
        <details className="mnav">
          <summary className="btn btn-ghost btn-icon" aria-label={t("menu")}>
            <Icon name="menu" size={18} />
          </summary>
          <div className="panel">
            <Link href="/">{t("home")}</Link>
            {LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {t(item.key)}
              </Link>
            ))}
            <Link href="/legal">{t("legal")}</Link>
            <Link href="/signin">{t("signin")}</Link>
            <Link href="/start" className="btn btn-primary">
              {t("startNow")}
            </Link>
            <a className="btn btn-ghost" href={`tel:${DEMO_TEL_E164}`}>
              {DEMO_TEL_DISPLAY}
            </a>
            <p className="hint">{t("langNote")}</p>
            <div className="lang-switch">
              <Link href={path || "/"} locale="rw" aria-current={lang === "rw" ? "page" : undefined}>
                RW
              </Link>
              <Link href={path || "/"} locale="en" aria-current={lang === "en" ? "page" : undefined}>
                EN
              </Link>
            </div>
            <p className="soon">{t("frenchSoon")}</p>
            <p className="soon">{t("swahiliSoon")}</p>
            <Prefs theme={t("theme")} motion={t("motion")} />
          </div>
        </details>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(()=>{const h=document.getElementById("site-hdr");if(!h)return;const on=()=>h.classList.toggle("is-stuck",window.scrollY>8);on();window.addEventListener("scroll",on,{passive:true});})();`,
        }}
      />
    </header>
  );
}
