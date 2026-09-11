import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/names.generated";
import { cx } from "../lib/cx";

export type ShellItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: IconName;
  active?: boolean;
  count?: number;
  more?: boolean;
};

const RAIL_ORDER = [
  "home",
  "conversations",
  "agent",
  "connections",
  "results",
  "credit",
  "settings",
] as const;

const TAB_ORDER = ["home", "conversations", "agent", "more"] as const;

export function AppShell({
  items,
  children,
  brand,
  topbar,
}: {
  items: readonly (ShellItem & { id: string })[];
  children: ReactNode;
  brand?: ReactNode;
  topbar?: ReactNode;
}) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const rail = RAIL_ORDER.map((id) => byId.get(id)).filter(Boolean) as ShellItem[];
  const tabs = TAB_ORDER.map((id) => {
    if (id === "more") {
      return {
        href: "#more",
        label: "More",
        shortLabel: "More",
        icon: "ellipsis" as const,
        more: true,
        active: items.some((item) => item.more && item.active),
      };
    }
    return byId.get(id);
  }).filter(Boolean) as ShellItem[];

  return (
    <div className="applayout">
      <nav className="appnav app-rail" aria-label="Studio">
        {brand}
        {rail.map((item) => (
          <a key={item.href} href={item.href} className={cx(item.active && "on")}>
            <Icon name={item.icon} size={16} />
            {item.label}
            {item.count ? <span className="nb">{item.count}</span> : null}
          </a>
        ))}
      </nav>
      <div className="appbody">
        {topbar}
        {children}
      </div>
      <nav className="tabbar app-tabbar" aria-label="Studio">
        {tabs.map((item) => (
          <a key={item.href} href={item.href} className={cx(item.active && "on")}>
            <Icon name={item.icon} size={19} />
            {item.shortLabel}
            {item.count ? <span className="nb" /> : null}
          </a>
        ))}
      </nav>
    </div>
  );
}
