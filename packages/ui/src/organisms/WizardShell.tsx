import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import { Tag } from "../atoms/Tag";
import { cx } from "../lib/cx";

export function WizardShell({
  brandHref = "/",
  brand,
  tag,
  tagTone,
  progress,
  progressNow,
  children,
  aside,
  footer,
}: {
  brandHref?: string;
  brand?: ReactNode;
  tag: string;
  tagTone?: "neutral" | "ok";
  progress?: number;
  progressNow?: number;
  children: ReactNode;
  aside: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="auth">
      <div className="authmain">
        <header className="authhead">
          <a href={brandHref} className="blogo">
            {brand ?? (
              <>
                <span className="mk">
                  <Icon name="audio-lines" size={17} />
                </span>
                <b>Subiza</b>
              </>
            )}
          </a>
          <Tag tone={tagTone}>{tag}</Tag>
        </header>
        <main id="content" className="authbody">
          {progress && progressNow !== undefined ? (
            <div className="prog" aria-hidden="true">
              {Array.from({ length: progress }, (_, index) => (
                <i
                  key={index}
                  className={cx(index < progressNow && "done", index === progressNow && "now")}
                />
              ))}
            </div>
          ) : null}
          <div className="screen">{children}</div>
        </main>
        <footer className="authfoot">{footer}</footer>
      </div>
      <aside className="authaside">{aside}</aside>
    </div>
  );
}
