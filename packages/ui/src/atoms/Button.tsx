import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cx } from "../lib/cx";

export const buttonVariants = cva("btn", {
  variants: {
    tone: {
      primary: "btn-primary",
      solid: "btn-solid",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      danger: "btn-danger",
    },
    size: {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    },
    block: { true: "btn-block", false: "" },
    icon: { true: "btn-icon", false: "" },
    loading: { true: "btn-load", false: "" },
  },
  defaultVariants: {
    tone: "primary",
    size: "md",
    block: false,
    icon: false,
    loading: false,
  },
});

type Common = VariantProps<typeof buttonVariants> & { className?: string };

export type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export function Button({
  tone,
  size,
  block,
  icon,
  loading,
  className,
  asChild,
  type = "button",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cx(buttonVariants({ tone, size, block, icon, loading }), className)}
      disabled={disabled || Boolean(loading)}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
    </Comp>
  );
}

export type ButtonLinkProps = Common & ComponentProps<"a">;

export function ButtonLink({
  tone,
  size,
  block,
  icon,
  loading,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cx(buttonVariants({ tone, size, block, icon, loading }), className)}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...props}
    >
      {children}
    </a>
  );
}
