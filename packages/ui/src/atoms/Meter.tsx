import { cx } from "../lib/cx";

export function Meter({
  value,
  tone = "ok",
  className,
}: {
  value: number;
  tone?: "ok" | "warn" | "risk";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <span
      className={cx("meter", tone !== "ok" && tone, className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <i style={{ ["--pct" as string]: `${pct}%` }} />
    </span>
  );
}
