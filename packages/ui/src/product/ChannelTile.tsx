import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/names.generated";
import { StatusDot } from "../atoms/StatusDot";
import { Tag } from "../atoms/Tag";
import { cx } from "../lib/cx";

export type ChannelKind = "ph" | "wa" | "tg" | "ig" | "sms" | "web";
export type ChannelStatus = "working" | "off" | "err" | "action" | "waiting";

const ICONS: Record<ChannelKind, IconName> = {
  ph: "phone",
  wa: "message-circle",
  tg: "send",
  ig: "image",
  sms: "mails",
  web: "globe",
};

function toneFor(status: ChannelStatus): "ok" | "risk" | "warn" | "neutral" {
  if (status === "working") return "ok";
  if (status === "err") return "risk";
  if (status === "action") return "warn";
  return "neutral";
}

function defaultLabel(status: ChannelStatus): string {
  if (status === "working") return "Working";
  if (status === "off") return "Not connected";
  if (status === "err") return "Broken";
  if (status === "waiting") return "Waiting";
  return "Action needed";
}

export function ChannelTile({
  kind,
  name,
  detail,
  status,
  action,
  statusLabel,
  since,
  cta,
}: {
  kind: ChannelKind;
  name: string;
  detail: string;
  status: ChannelStatus;
  action?: ReactNode;
  statusLabel?: string;
  since?: string;
  cta?: ReactNode;
}) {
  return (
    <article
      className={cx(
        "chan",
        `chan-${kind}`,
        status === "off" && "is-off",
        status === "err" && "is-err",
        status === "waiting" && "is-wait",
      )}
    >
      <span className="cico">
        <Icon name={ICONS[kind]} size={21} />
      </span>
      <span className="cmeta">
        <b>{name}</b>
        <span>{since ? `${detail} · ${since}` : detail}</span>
      </span>
      {status === "waiting" ? <Icon name="hourglass" size={12} /> : null}
      <StatusDot tone={toneFor(status)}>{statusLabel ?? defaultLabel(status)}</StatusDot>
      {cta ?? action}
    </article>
  );
}

export function ChannelRow({
  kind,
  name,
  detail,
  status,
  statusLabel,
  tagTone = "neutral",
  href,
  disabled,
}: {
  kind: ChannelKind;
  name: string;
  detail: string;
  status: ChannelStatus;
  statusLabel?: string;
  tagTone?: "ok" | "warn" | "neutral";
  href?: string;
  disabled?: boolean;
}) {
  const className = cx(
    "chanrow",
    `c-${kind}`,
    status === "off" && "off",
    status === "err" && "err",
    status === "waiting" && "wait",
  );
  const inner = (
    <>
      <span className="ci">
        <Icon name={ICONS[kind]} size={21} />
      </span>
      <span className="cm">
        <b>{name}</b>
        <span>{detail}</span>
      </span>
      <span className="cs">
        {statusLabel ? <Tag tone={tagTone}>{statusLabel}</Tag> : null}
      </span>
    </>
  );
  if (disabled || !href) {
    return (
      <div className={className} aria-disabled="true">
        {inner}
      </div>
    );
  }
  return (
    <a className={className} href={href}>
      {inner}
    </a>
  );
}
