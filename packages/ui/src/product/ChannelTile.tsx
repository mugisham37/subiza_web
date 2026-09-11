import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/names.generated";
import { StatusDot } from "../atoms/StatusDot";
import { cx } from "../lib/cx";

export type ChannelKind = "ph" | "wa" | "tg" | "ig";
export type ChannelStatus = "working" | "off" | "err" | "action";

const ICONS: Record<ChannelKind, IconName> = {
  ph: "phone",
  wa: "message-circle",
  tg: "send",
  ig: "image",
};

export function ChannelTile({
  kind,
  name,
  detail,
  status,
  action,
}: {
  kind: ChannelKind;
  name: string;
  detail: string;
  status: ChannelStatus;
  action?: ReactNode;
}) {
  return (
    <article
      className={cx(
        "chan",
        `chan-${kind}`,
        status === "off" && "is-off",
        status === "err" && "is-err",
      )}
    >
      <span className="cico">
        <Icon name={ICONS[kind]} size={21} />
      </span>
      <span className="cmeta">
        <b>{name}</b>
        <span>{detail}</span>
      </span>
      <StatusDot
        tone={status === "working" ? "ok" : status === "err" ? "risk" : status === "action" ? "warn" : "neutral"}
      >
        {status === "working"
          ? "Working"
          : status === "off"
            ? "Not connected"
            : status === "err"
              ? "Broken"
              : "Action needed"}
      </StatusDot>
      {action}
    </article>
  );
}
