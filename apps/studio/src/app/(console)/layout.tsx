import type { ReactNode } from "react";
import { AppShell } from "@subiza/ui";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      items={[
        { id: "home", href: "/home", label: "Home", shortLabel: "Home", icon: "house", active: true },
        { id: "conversations", href: "/conversations", label: "Conversations", shortLabel: "Chats", icon: "inbox" },
        { id: "agent", href: "/agent", label: "Agent", shortLabel: "Agent", icon: "bot" },
        { id: "connections", href: "/connections", label: "Connections", shortLabel: "Links", icon: "link" },
        { id: "results", href: "/results", label: "Results", shortLabel: "Results", icon: "chart-column" },
        { id: "credit", href: "/credit", label: "Credit", shortLabel: "Credit", icon: "wallet" },
        { id: "settings", href: "/settings", label: "Settings", shortLabel: "More", icon: "settings" },
      ]}
    >
      <div id="content">{children}</div>
    </AppShell>
  );
}
