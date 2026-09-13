import { Banner, EscalationLadder } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { loadConsole } from "@/features/activation/load";
import { MessagingSurface } from "@/features/channels/MessagingSurface";
import { PhoneSurface } from "@/features/phone/PhoneSurface";

export async function AgentSurface() {
  const model = await loadConsole();
  const t = await getTranslations("console");
  return (
    <main className="surface-ro">
      <h1>{t("agent")}</h1>
      <p>{t("readonly")}</p>
      <Banner tone="info" title={model.tenant.name}>
        {model.docs.agent?.greeting ?? "—"}
      </Banner>
      {model.docs.agent?.rules.map((rule) => (
        <p key={rule.id}>{rule.text}</p>
      ))}
    </main>
  );
}

export async function KnowledgeSurface() {
  const model = await loadConsole();
  const t = await getTranslations("console");
  return (
    <main className="surface-ro">
      <h1>{t("knowledge")}</h1>
      <p>{t("readonly")}</p>
      <ul>
        {(model.docs.knowledge?.prices ?? []).map((row) => (
          <li key={row.id}>
            {row.name} · {row.amount === null ? "?" : `${row.amount} RWF`}
          </li>
        ))}
      </ul>
    </main>
  );
}

export async function VoiceSurface() {
  const model = await loadConsole();
  const t = await getTranslations("console");
  return (
    <main className="surface-ro">
      <h1>{t("voice")}</h1>
      <p>{t("readonly")}</p>
      <p>{model.docs.voice?.voiceId ?? "—"}</p>
    </main>
  );
}

export async function ConnectionsSurface() {
  const model = await loadConsole();
  const t = await getTranslations("console");
  return (
    <main className="surface-ro">
      <h1>{t("connections")}</h1>
      <PhoneSurface />
      <MessagingSurface />
      {model.docs.escalation ? (
        <EscalationLadder
          rungs={[
            { title: model.docs.escalation.primaryE164, detail: model.docs.escalation.noAnswer, state: "done" },
          ]}
        />
      ) : null}
    </main>
  );
}
