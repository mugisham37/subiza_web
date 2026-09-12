import { CONTACT_EMAIL, DEMO_TEL_DISPLAY, DEMO_TEL_E164, DEMO_WHATSAPP, DPO_EMAIL } from "@subiza/core";
import { ButtonLink, Icon } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = 2026;

  return (
    <footer className="site-ftr">
      <div className="sc ftr-grid">
        <div>
          <Link href="/" className="logo">
            <span className="mk" aria-hidden>
              <Icon name="phone-call" size={16} />
            </span>
            Subiza
          </Link>
          <p>{t("chrome.blurb")}</p>
          <ButtonLink href={`tel:${DEMO_TEL_E164}`} tone="primary" size="sm">
            <Icon name="phone-call" size={14} />
            {DEMO_TEL_DISPLAY}
          </ButtonLink>
        </div>
        <div>
          <h4>{t("chrome.product")}</h4>
          <ul>
            <li>
              <Link href="/how">{t("nav.how")}</Link>
            </li>
            <li>
              <Link href="/pricing">{t("nav.pricing")}</Link>
            </li>
            <li>
              <a href="#tryit">{t("chrome.demo")}</a>
            </li>
            <li>
              <Link href="/start">{t("chrome.account")}</Link>
            </li>
            <li>
              <Link href="/signin">{t("nav.signin")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{t("chrome.company")}</h4>
          <ul>
            <li>
              <Link href="/about">{t("nav.about")}</Link>
            </li>
            <li>
              <Link href="/contact">{t("nav.contact")}</Link>
            </li>
            <li>
              <a href={DEMO_WHATSAPP} rel="noopener">
                WhatsApp
              </a>
            </li>
            <li>
              <Link href="/security">{t("nav.security")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{t("chrome.legal")}</h4>
          <ul>
            <li>
              <Link href="/legal/privacy">{t("chrome.privacy")}</Link>
            </li>
            <li>
              <Link href="/legal/terms">{t("chrome.terms")}</Link>
            </li>
            <li>
              <Link href="/data-request">{t("chrome.rights")}</Link>
            </li>
            <li>
              <Link href="/legal">{t("chrome.disclosure")}</Link>
            </li>
            <li>
              <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="sc ftr-copy">© {year} Subiza · Kigali, Rwanda</div>
    </footer>
  );
}
