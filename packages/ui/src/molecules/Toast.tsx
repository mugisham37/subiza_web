import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import { cx } from "../lib/cx";

export function Toast({
  children,
  onDismiss,
  className,
}: {
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div className={cx("toast", className)} role="status" aria-live="polite">
      <Icon name="wifi-off" size={18} />
      <span className="tt">{children}</span>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
}
