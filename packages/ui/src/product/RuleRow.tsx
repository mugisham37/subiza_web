import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { EnforcementBadge, type EnforcementTone } from "./EnforcementBadge";

export function RuleRow({
  off,
  locked,
  conflicting,
  missingKnowledge,
  badge,
  badgeLabel,
  badgeTitle,
  switchSlot,
  deleteSlot,
  children,
  meta,
}: {
  off?: boolean;
  locked?: boolean;
  conflicting?: boolean;
  missingKnowledge?: boolean;
  badge: EnforcementTone;
  badgeLabel: string;
  badgeTitle: string;
  switchSlot: ReactNode;
  deleteSlot?: ReactNode;
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className={cx("rule", off && "off", locked && "locked", conflicting && "conflict")}>
      {switchSlot}
      <div className="rtx">{children}</div>
      <div className="rmeta">
        <EnforcementBadge tone={badge} label={badgeLabel} title={badgeTitle} />
        {missingKnowledge ? <span className="catchip">{meta}</span> : meta}
        {locked ? null : deleteSlot}
      </div>
    </div>
  );
}
