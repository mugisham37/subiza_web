import { Banner, Button, Icon, Tag } from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { pauseAgentAction } from "@/features/activation/actions";
import { loadConsole } from "@/features/activation/load";

const LABELS = {
  account: "account",
  "business-hours": "hours",
  prices: "prices",
  voice: "voice",
  heard: "heard",
  phone: "phone",
  whatsapp: "wa",
  "clone-voice": "clone",
  "more-knowledge": "more",
  "invite-team": "team",
  "add-credit": "credit",
} as const;

export async function HomeView({ paused }: { paused?: boolean }) {
  const model = await loadConsole();
  const t = await getTranslations("home");
  const live = model.live && !paused;
  const pct = `${Math.round((model.checklist.doneCount / model.checklist.total) * 100)}%`;
  return (
    <main>
      <Tag tone={live ? "ok" : "info"}>{live ? t("pillClosed") : t("pillSandbox")}</Tag>
      <h1>{live ? t("title") : t("sandboxTitle")}</h1>
      <p>{t("lede")}</p>
      {paused ? <Banner tone="ok" title={t("paused")}>{t("paused")}</Banner> : null}
      <div className="checklist">
        <div className="ch">
          <b>{t("progress", { done: model.checklist.doneCount, total: model.checklist.total })}</b>
          <span className="chbar">
            <i style={{ ["--w" as string]: pct }} />
          </span>
        </div>
        {model.checklist.items.map((item) => (
          <div key={item.id} className={item.done ? "citem done" : item.highlight ? "citem next" : "citem"}>
            <span className="cm">
              <Icon name="check" size={12} />
            </span>
            <span className="cx">
              <b>{t(LABELS[item.id])}</b>
              {item.id === "whatsapp" ? <span>{t("waD")}</span> : null}
              {item.id === "clone-voice" ? <span>{t("cloneD")}</span> : null}
              {item.id === "add-credit" ? <span>{t("creditD")}</span> : null}
            </span>
            {item.highlight ? (
              <Button tone="solid" size="sm" asChild>
                <a href={item.href}>{t("start")}</a>
              </Button>
            ) : null}
          </div>
        ))}
      </div>
      {model.docs.goLive && model.docs.goLive.rung !== "sandbox" ? (
        <form action={pauseAgentAction} className="kill">
          <Button type="submit" tone="danger">
            {t("pause")}
          </Button>
        </form>
      ) : null}
    </main>
  );
}
