import type { ReactNode } from "react";
import { AppShell, Button } from "@subiza/ui";
import { pauseAgentAction } from "@/features/activation/actions";
import { loadConsole } from "@/features/activation/load";

export default async function ConsoleLayout({ children }: { children: ReactNode }) {
  const model = await loadConsole();
  const kill = model.docs.goLive != null && model.docs.goLive.rung !== "sandbox";
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
      topbar={
        kill ? (
          <form action={pauseAgentAction}>
            <Button type="submit" tone="danger" size="sm">
              Pause
            </Button>
          </form>
        ) : null
      }
    >
      <div id="content">{children}</div>
    </AppShell>
  );
}
