import type { ReactNode } from "react";
import { EmptyArt } from "./EmptyArt";
import { cx } from "../lib/cx";

export function Empty({
  title,
  children,
  action,
  art,
  className,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  art?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("empty", className)}>
      <div className="eart">{art ?? <EmptyArt />}</div>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
