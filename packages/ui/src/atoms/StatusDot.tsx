import { cx } from "../lib/cx";

export type StatusTone = "neutral" | "ok" | "warn" | "risk" | "live";

const toneClass: Record<StatusTone, string> = {
  neutral: "dot",
  ok: "dot dot-ok",
  warn: "dot dot-warn",
  risk: "dot dot-risk",
  live: "dot dot-live",
};

export function StatusDot({
  tone = "neutral",
  children,
  className,
}: {
  tone?: StatusTone;
  children: string;
  className?: string;
}) {
  return <span className={cx(toneClass[tone], className)}>{children}</span>;
}
