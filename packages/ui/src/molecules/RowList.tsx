import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export function RowList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rowlist", className)}>{children}</div>;
}

export function RowItem({
  href,
  avatar,
  title,
  subtitle,
  side,
  className,
}: {
  href?: string;
  avatar?: ReactNode;
  title: string;
  subtitle?: string;
  side?: ReactNode;
  className?: string;
}) {
  const inner = (
    <>
      {avatar ? <span className="rav">{avatar}</span> : null}
      <span className="rmain">
        <b>{title}</b>
        {subtitle ? <span>{subtitle}</span> : null}
      </span>
      {side ? <span className="rside">{side}</span> : null}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cx("rowitem", className)}>
        {inner}
      </a>
    );
  }
  return <div className={cx("rowitem", className)}>{inner}</div>;
}
