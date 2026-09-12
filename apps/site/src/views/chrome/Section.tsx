import { Eyebrow } from "@subiza/ui";
import type { ReactNode } from "react";
import { cx } from "@subiza/ui";

export function Section({
  id,
  tone = "default",
  eyebrow,
  title,
  lede,
  narrow,
  headingLevel = 1,
  children,
}: {
  id?: string;
  tone?: "default" | "tint" | "ink";
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  narrow?: boolean;
  headingLevel?: 1 | 2;
  children?: ReactNode;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id={id} className={cx("sec", "rv", tone !== "default" && tone)}>
      <div className={narrow ? "sc sc-n" : "sc"}>
        {eyebrow || title || lede ? (
          <div className="secintro">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? <Heading>{title}</Heading> : null}
            {lede ? <div className="sec-lede">{lede}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
