import { cx } from "../lib/cx";

export function Skeleton({
  width,
  height,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <span
      className={cx("sk", className)}
      style={{
        display: "inline-block",
        width: width ?? "100%",
        height: height ?? 16,
      }}
      aria-hidden
    />
  );
}
