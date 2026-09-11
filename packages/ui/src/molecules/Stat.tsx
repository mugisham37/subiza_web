import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export function Stat({
  label,
  value,
  unit,
  delta,
  deltaTone,
  keyed,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "up" | "down";
  keyed?: boolean;
  children?: ReactNode;
}) {
  return (
    <article className={cx("stat", keyed && "stat-key")}>
      <span className="sl">{label}</span>
      <span className="sv">
        {value}
        {unit ? <small>{unit}</small> : null}
      </span>
      {delta ? <span className={cx("sd", deltaTone)}>{delta}</span> : null}
      {children}
    </article>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="cq grid g3">{children}</div>;
}
