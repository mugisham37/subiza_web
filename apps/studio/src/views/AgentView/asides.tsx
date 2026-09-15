import { Icon } from "@subiza/ui";
import type { AgentStep } from "@subiza/domain";
import { getTranslations } from "next-intl/server";

export async function AgentAside({ step, view }: { step: AgentStep; view: "simple" | "advanced" }) {
  const t = await getTranslations("agentAside");
  const pane = step === "conflict" ? "b2" : step === "history" ? "b3" : view === "advanced" ? "adv" : "b1";
  const pairs: Record<string, [string, string][]> = {
    b1: [
      ["b1a", "b1ap"],
      ["b1b", "b1bp"],
      ["b1c", "b1cp"],
    ],
    adv: [
      ["adva", "advap"],
      ["advb", "advbp"],
      ["advc", "advcp"],
    ],
    b2: [
      ["b2a", "b2ap"],
      ["b2b", "b2bp"],
    ],
    b3: [
      ["b3a", "b3ap"],
      ["b3b", "b3bp"],
    ],
  };
  return (
    <>
      {(pairs[pane] ?? []).map(([h, p]) => (
        <div className="asidecard" key={h}>
          <h3>{t(h)}</h3>
          <p dangerouslySetInnerHTML={{ __html: t.raw(p) }} />
        </div>
      ))}
    </>
  );
}
