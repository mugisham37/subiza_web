import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/names.generated";
import { cx } from "../lib/cx";

const bannerVariants = cva("banner", {
  variants: {
    tone: {
      ok: "banner-ok",
      warn: "banner-warn",
      risk: "banner-risk",
      info: "banner-info",
    },
  },
  defaultVariants: { tone: "info" },
});

const icons: Record<NonNullable<VariantProps<typeof bannerVariants>["tone"]>, IconName> = {
  ok: "circle-check",
  warn: "triangle-alert",
  risk: "circle-alert",
  info: "info",
};

export function Banner({
  tone,
  title,
  children,
  action,
  className,
}: VariantProps<typeof bannerVariants> & {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const resolved = tone ?? "info";
  return (
    <div className={cx(bannerVariants({ tone: resolved }), className)} role="status">
      <Icon name={icons[resolved]} size={19} className="bi" />
      <div>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
      {action ? <div className="ba">{action}</div> : null}
    </div>
  );
}
