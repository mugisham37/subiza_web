import { getTranslations } from "next-intl/server";
import type { MessagingStep } from "@subiza/domain";
import { META_VERIFICATION_MAX, META_VERIFICATION_MIN } from "@subiza/domain";

export async function ChannelAside({ step }: { step: MessagingStep }) {
  const t = await getTranslations("channelAside");
  const figures = { minDays: META_VERIFICATION_MIN, maxDays: META_VERIFICATION_MAX };
  const pairs: Partial<Record<MessagingStep, [string, string][]>> = {
    tg1: [
      ["tg1a", "tg1ap"],
      ["tg1b", "tg1bp"],
    ],
    tg2: [
      ["tg2a", "tg2ap"],
      ["tg2b", "tg2bp"],
    ],
    wa1: [
      ["wa1a", "wa1ap"],
      ["wa1b", "wa1bp"],
    ],
    wa2: [
      ["wa2a", "wa2ap"],
      ["wa2b", "wa2bp"],
    ],
    wa3: [
      ["wa3a", "wa3ap"],
      ["wa3b", "wa3bp"],
    ],
    wa4: [
      ["wa4a", "wa4ap"],
      ["wa4b", "wa4bp"],
    ],
    wa5: [
      ["wa5a", "wa5ap"],
      ["wa5b", "wa5bp"],
    ],
    wa6: [
      ["wa6a", "wa6ap"],
      ["wa6b", "wa6bp"],
    ],
    wa7: [
      ["wa7a", "wa7ap"],
      ["wa7b", "wa7bp"],
    ],
    wa8: [
      ["wa8a", "wa8ap"],
      ["wa8b", "wa8bp"],
    ],
    wa9: [
      ["wa9a", "wa9ap"],
      ["wa9b", "wa9bp"],
    ],
    ig1: [
      ["ig1a", "ig1ap"],
      ["ig1b", "ig1bp"],
    ],
    ig2: [
      ["ig2a", "ig2ap"],
      ["ig2b", "ig2bp"],
    ],
    brk: [
      ["brka", "brkap"],
      ["brkb", "brkbp"],
    ],
  };
  return (
    <>
      {(pairs[step] ?? []).map(([h, p]) => (
        <div className="asidecard" key={h}>
          <h3>{t(h, figures)}</h3>
          <p dangerouslySetInnerHTML={{ __html: t.raw(p) }} />
        </div>
      ))}
    </>
  );
}
