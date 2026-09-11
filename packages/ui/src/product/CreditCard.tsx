import { formatRwf } from "@subiza/core";
import { Meter } from "../atoms/Meter";

export function CreditCard({
  balance,
  cap,
  locale = "rw",
}: {
  balance: number;
  cap: number;
  locale?: string;
}) {
  const pct = cap === 0 ? 0 : Math.round((balance / cap) * 100);
  const tone = pct < 5 ? "risk" : pct < 20 ? "warn" : "ok";
  return (
    <article className="credit">
      <div className="credit-top">
        <span className="credit-v">
          {formatRwf(balance, locale)}
          <small>left</small>
        </span>
      </div>
      <Meter value={pct} tone={tone} />
      <div className="credit-ft">
        <span>
          <b>{pct}%</b> of this cycle
        </span>
        {tone !== "ok" ? <span>Calls still reach you if credit runs out.</span> : null}
      </div>
    </article>
  );
}
