import {
  formatRwf,
  PILOT_YEAR,
  pricingTiers,
  type PricingTier,
} from "@subiza/core";
import { Banner } from "../molecules/Banner";
import { ButtonLink } from "../atoms/Button";
import { Icon } from "../icons/Icon";
import { Tag } from "../atoms/Tag";
import { cx } from "../lib/cx";

export const PILOT_BANNER_TEXT = "Read this first: these are pilot prices";

export type PricingCopy = {
  bannerTitle: string;
  bannerBody: string;
  gloss: Record<PricingTier["id"], string>;
  bullets: Record<PricingTier["id"], readonly string[]>;
  start: string;
  contact: string;
  featured: string;
  perMonth: string;
  usdApprox: (amount: number) => string;
};

export function PricingTiers({
  locale,
  copy,
  startHref,
  contactHref,
}: {
  locale: string;
  copy: PricingCopy;
  startHref: string;
  contactHref: string;
}) {
  return (
    <div className="pricing-block">
      <Banner tone="warn" title={copy.bannerTitle} className="pricing-banner">
        {copy.bannerBody}
      </Banner>
      <p className="sr-only">
        {PILOT_BANNER_TEXT} {PILOT_YEAR}
      </p>
      <div className="tiers">
        {pricingTiers.map((tier) => {
          const href = tier.cta === "contact" ? contactHref : startHref;
          return (
            <article key={tier.id} className={cx("tier", tier.featured && "key")}>
              {tier.featured ? <Tag>{copy.featured}</Tag> : null}
              <span className="tn">{tier.properName}</span>
              <span className="tw">{copy.gloss[tier.id]}</span>
              <span className="tp">
                {formatRwf(tier.rwf, locale)}
                {tier.rwf > 0 ? <small>{copy.perMonth}</small> : null}
              </span>
              <p className="tu">
                {locale === "en" && tier.usdApprox != null
                  ? copy.usdApprox(tier.usdApprox)
                  : null}{" "}
                {copy.gloss[tier.id]}
              </p>
              <ul>
                {copy.bullets[tier.id].map((bullet) => (
                  <li key={bullet}>
                    <Icon name="check" size={14} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={href}
                tone={tier.featured ? "primary" : "secondary"}
                block
              >
                {tier.cta === "contact" ? copy.contact : copy.start}
              </ButtonLink>
            </article>
          );
        })}
      </div>
    </div>
  );
}
