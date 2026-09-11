import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

const tagVariants = cva("tag", {
  variants: {
    tone: {
      neutral: "",
      ok: "tag-ok",
      warn: "tag-warn",
      risk: "tag-risk",
      info: "tag-info",
    },
  },
  defaultVariants: { tone: "neutral" },
});

type TagProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof tagVariants>;

export function Tag({ tone, className, ...props }: TagProps) {
  return <span className={cx(tagVariants({ tone }), className)} {...props} />;
}
