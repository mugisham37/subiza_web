import type { ButtonHTMLAttributes } from "react";
import { cx } from "../lib/cx";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
  count?: number;
};

export function Chip({ pressed, count, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cx("chip", pressed && "on", className)}
      aria-pressed={pressed}
      {...props}
    >
      {children}
      {count !== undefined ? <span className="ct">{count}</span> : null}
    </button>
  );
}
