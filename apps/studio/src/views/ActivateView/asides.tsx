import { Icon } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import type { ActivationStep } from "@subiza/domain";

export async function StepAside({ step }: { step: ActivationStep }) {
  const t = await getTranslations("aside");
  if (step === "call") {
    return (
      <>
        <div className="gprev">
          <div className="gl">
            <Icon name="target" size={14} />
            <span>{t("w5a")}</span>
          </div>
          <p className="gq">{t("w5ap")}</p>
        </div>
        <div className="asidecard">
          <h3>{t("w5b")}</h3>
          <p>{t("w5bp")}</p>
        </div>
      </>
    );
  }
  const pairs: Record<ActivationStep, [string, string][]> = {
    business: [["w1a", "w1ap"], ["w1b", "w1bp"]],
    hours: [["w2a", "w2ap"], ["w2b", "w2bp"]],
    prices: [["w3a", "w3ap"], ["w3b", "w3bp"]],
    voice: [["w4a", "w4ap"], ["w4b", "w4bp"]],
    call: [],
    review: [["w6a", "w6ap"]],
    escalation: [["w7a", "w7ap"]],
    phone: [["w8a", "w8ap"], ["w8b", "w8bp"]],
    scope: [["w9a", "w9ap"], ["w9b", "w9bp"]],
  };
  return (
    <>
      {pairs[step].map(([h, p]) => (
        <div className="asidecard" key={h}>
          <h3>{t(h)}</h3>
          <p>{t(p)}</p>
        </div>
      ))}
    </>
  );
}
