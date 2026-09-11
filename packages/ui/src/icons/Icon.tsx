import type { IconName } from "./names.generated";
import { cx } from "../lib/cx";

export type { IconName };

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
};

export function Icon({ name, size = 16, className, title }: IconProps) {
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
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function SpriteDefs({ markup }: { markup: string }) {
  return <span hidden dangerouslySetInnerHTML={{ __html: markup }} />;
}
