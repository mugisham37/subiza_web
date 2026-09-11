import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export function Dropdown({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cx("dd", className)} name="subiza-dropdown">
      <summary>{label}</summary>
      <div className="ddc">{children}</div>
    </details>
  );
}
