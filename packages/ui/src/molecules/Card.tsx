import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export function Card({
  inset,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return <div className={cx("card", inset && "card-i", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card-hd", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card-bd", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card-ft", className)} {...props} />;
}

export function CardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={cx("card", "card-link", className)}>
      {children}
    </a>
  );
}
