import { DEMO_TEL_DISPLAY, DEMO_TEL_E164 } from "@subiza/core";
import { Icon } from "@subiza/ui";
import { getTranslations } from "next-intl/server";

export async function StickyCta() {
  const t = await getTranslations("chrome");
  return (
    <div className="stickycta" id="sticky-cta">
      <a className="btn btn-primary" href={`tel:${DEMO_TEL_E164}`}>
        <Icon name="phone-call" size={16} />
        {t("sticky")} — {DEMO_TEL_DISPLAY}
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `(()=>{const b=document.getElementById("sticky-cta");const h=document.querySelector("[data-hero-cta]");if(!b||!h||!("IntersectionObserver"in window))return;const o=new IntersectionObserver((e)=>{b.style.display=e[0].isIntersecting?"none":"flex"},{threshold:.2});o.observe(h);})();`,
        }}
      />
    </div>
  );
}
