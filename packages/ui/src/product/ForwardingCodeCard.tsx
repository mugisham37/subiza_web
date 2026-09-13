import { codeForCondition, telHref as domainTelHref } from "@subiza/domain";
import { Button } from "../atoms/Button";
import { Icon } from "../icons/Icon";

export type ForwardCondition = "no-reply" | "busy" | "unreachable" | "unconditional";
export type ForwardPlatform = "android" | "ios" | "unknown";

export function ForwardingCodeCard({
  condition = "no-reply",
  subizaNumber,
  number,
  timerSeconds = 20,
  platform = "unknown",
  deactivationCode = "##61#",
  heading = "Forwarding code",
  offNote,
  copyLabel = "Copy the code",
  dialLabel = "Open dialler",
  copyWorks = "Copy is the action that works.",
  platformNote,
  step1,
  step2,
  step3,
  code,
  telHref,
}: {
  condition?: ForwardCondition;
  subizaNumber?: string;
  timerSeconds?: number;
  platform?: ForwardPlatform;
  deactivationCode?: string;
  heading?: string;
  offNote?: string;
  copyLabel?: string;
  dialLabel?: string;
  copyWorks?: string;
  platformNote?: string;
  step1?: string;
  step2?: string;
  step3?: string;
  /** Derived by the caller from `@subiza/domain`. */
  code?: string;
  telHref?: string;
  /** @deprecated use subizaNumber */
  number?: string;
}) {
  const digits = (subizaNumber ?? number ?? "").replace(/\D/g, "");
  const on = code ?? codeForCondition(condition, digits, timerSeconds);
  const href = telHref ?? domainTelHref(on);
  const note = offNote ?? `Off-switch: ${deactivationCode}`;
  const ios = platform === "ios";

  return (
    <article className="fcode">
      <div className="fcode-h">
        <Icon name="phone-forwarded" size={14} />
        {heading}
      </div>
      <div className="fcode-b">
        <p className="fcode-s">
          {on.split(digits).map((chunk, i, all) =>
            i < all.length - 1 ? (
              <span key={chunk + i}>
                {chunk}
                <b>{digits}</b>
              </span>
            ) : (
              <span key={chunk + i}>{chunk}</span>
            ),
          )}
        </p>
        <p className="fcode-n">{note}</p>
      </div>
      <div className="fcode-a">
        <Button tone="primary" data-copy={on}>
          {copyLabel}
        </Button>
        {ios ? null : (
          <Button tone="secondary" asChild>
            <a href={href}>{dialLabel}</a>
          </Button>
        )}
      </div>
      {ios ? (
        <ol className="fcode-ios">
          <li>{step1 ?? "Copy the code above."}</li>
          <li>{step2 ?? "Open the Phone app."}</li>
          <li>{step3 ?? "Paste it and call. Tap-to-dial links fail silently on iPhone."}</li>
        </ol>
      ) : null}
      <p className="fcode-plat">
        <Icon name="smartphone" size={14} />
        <span>
          <b>{copyWorks}</b>{" "}
          {platformNote ??
            (ios
              ? "On iPhone, tap-to-dial links fail silently — use the three steps."
              : "Android only, and it never dials by itself.")}
        </span>
      </p>
    </article>
  );
}
