import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

export function Eyebrow({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cx("eyebrow", className)} {...props}>
      <i />
      {children}
    </p>
  );
}

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: string;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

export function Hint({ id, children }: { id?: string; children: string }) {
  return (
    <p className="hint" id={id}>
      {children}
    </p>
  );
}

export function VisuallyHidden({ children }: { children: string }) {
  return <span className="sr-only">{children}</span>;
}
