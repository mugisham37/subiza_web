import type { HTMLAttributes } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/names.generated";
import { cx } from "../lib/cx";

export type EnforcementTone = "hard" | "soft" | "lock";

const ICONS: Record<EnforcementTone, IconName> = {
  hard: "shield-check",
  soft: "circle-help",
  lock: "lock",
};

export function EnforcementBadge({
  tone,
  label,
  title,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone: EnforcementTone;
  label: string;
}) {
  return (
    <span className={cx("enf", tone, className)} title={title} {...props}>
      <Icon name={ICONS[tone]} size={12} />
      {label}
    </span>
  );
}
