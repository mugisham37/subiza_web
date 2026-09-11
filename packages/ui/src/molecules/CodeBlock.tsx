import { cx } from "../lib/cx";

export function CodeBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <pre className={cx("codeblk", className)}>{children}</pre>;
}
