import type { IconName } from "./names.generated";
import { CRITICAL_ICON_NAMES } from "./critical";
import { cx } from "../lib/cx";

export type { IconName };

const CRITICAL = new Set<string>(CRITICAL_ICON_NAMES);

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
};

export function Icon({ name, size = 16, className, title }: IconProps) {
  const href = CRITICAL.has(name) ? `#i-${name}` : `/icons/sprite.svg#i-${name}`;
  return (
    <svg
      width={size}
      height={size}
      className={cx("sz-icon", className)}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <use href={href} />
    </svg>
  );
}

export function SpriteDefs({ markup }: { markup: string }) {
  return <span hidden dangerouslySetInnerHTML={{ __html: markup }} />;
}
