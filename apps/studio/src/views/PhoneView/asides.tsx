import { Icon } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import type { PhoneStep } from "@subiza/domain";

export async function PhoneAside({ step }: { step: PhoneStep }) {
  const t = await getTranslations("phoneAside");
  if (step === "verify") {
    return (
      <>
        <div className="gprev">
          <div className="gl">
            <Icon name="badge-check" size={14} />
            <span>{t("s4a")}</span>
          </div>
          <p className="gq">{t("s4ap")}</p>
        </div>
        <div className="asidecard">
          <h3>{t("s4b")}</h3>
          <p>{t("s4bp")}</p>
        </div>
      </>
    );
  }
  const pairs: Partial<Record<PhoneStep, [string, string][]>> = {
    path: [
      ["s1a", "s1ap"],
      ["s1b", "s1bp"],
    ],
    scope: [
      ["s2a", "s2ap"],
      ["s2b", "s2bp"],
    ],
    code: [
      ["s3a", "s3ap"],
      ["s3b", "s3bp"],
      ["s3c", "s3cp"],
    ],
    result: [
      ["s5a", "s5ap"],
      ["s5b", "s5bp"],
    ],
    repair: [
      ["s6a", "s6ap"],
      ["s6b", "s6bp"],
    ],
    done: [
      ["s7a", "s7ap"],
      ["s7b", "s7bp"],
    ],
    number: [["s8a", "s8ap"]],
    lost: [
      ["s9a", "s9ap"],
      ["s9b", "s9bp"],
    ],
  };
  return (
    <>
      {(pairs[step] ?? []).map(([h, p]) => (
        <div className="asidecard" key={h}>
          <h3>{t(h)}</h3>
          <p dangerouslySetInnerHTML={{ __html: t.raw(p) }} />
        </div>
      ))}
    </>
  );
}
