import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import { Button } from "../atoms/Button";
import { cx } from "../lib/cx";

export type CallStageState =
  | "ready"
  | "ringing"
  | "live"
  | "ended"
  | "no-answer"
  | "voicemail-detected"
  | "carrier-failed"
  | "rate-limited"
  | "platform-outage"
  | "offline";

export function CallStage({
  state,
  pill,
  time,
  title,
  hint,
  destination,
  children,
  primary,
  secondary,
  tertiary,
}: {
  state: CallStageState;
  pill?: string | undefined;
  time?: string | undefined;
  title?: string | undefined;
  hint?: string | undefined;
  destination?: string | undefined;
  children?: ReactNode | undefined;
  primary?: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
}) {
  const calling = state === "ringing" || state === "live";
  return (
    <div className="callstage">
      <div className="cs-top">
        <span className={cx("cs-live", !calling && "idle")}>
          {state === "live" || state === "ringing" ? <i /> : null}
          <span>{pill}</span>
        </span>
        {time ? <span className="cs-time">{time}</span> : null}
      </div>
      {children ?? (
        <div className="cs-empty">
          <span className={cx("cs-ring", calling && "calling")}>
            <Icon name={state === "no-answer" || state === "voicemail-detected" ? "phone-missed" : "phone-call"} size={32} />
          </span>
          {title ? <h3>{title}</h3> : null}
          {destination ? <p>{destination}</p> : null}
          {hint ? <p className="cs-hint">{hint}</p> : null}
        </div>
      )}
      {primary}
      {secondary}
      {tertiary}
    </div>
  );
}

export function LiveTranscript({
  turns,
  interim,
}: {
  turns: readonly { id: string; speaker: "ai" | "human"; text: string; translation?: string | undefined }[];
  interim?: string | undefined;
}) {
  return (
    <>
      <div className="ltrans" role="log">
        {turns.map((turn) => (
          <div key={turn.id} className={cx("lturn", turn.speaker === "human" ? "you" : "ai")}>
            <span className="la">{turn.speaker === "ai" ? "AI" : "YOU"}</span>
            <p>
              {turn.text}
              {turn.translation ? <span className="lo">{turn.translation}</span> : null}
            </p>
          </div>
        ))}
      </div>
      {interim ? (
        <p className="lturn interim" aria-live="off">
          {interim}
        </p>
      ) : null}
    </>
  );
}

export function CallPrimary({
  children,
  action,
  name,
  value,
  tone = "primary",
}: {
  children: ReactNode;
  action?: string;
  name?: string;
  value?: string;
  tone?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <Button tone={tone} size="lg" block formAction={action} name={name} value={value}>
      {children}
    </Button>
  );
}
