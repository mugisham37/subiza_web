import { Banner, Button } from "@subiza/ui";
import { agentTileStatus } from "@subiza/domain";
import { getTranslations } from "next-intl/server";
import { loadAgent } from "./load";
import { hrefForAgent } from "./steps";

export async function BehaviourSurface() {
  const model = await loadAgent("behaviour", {});
  const t = await getTranslations("agent");
  const status = agentTileStatus(model.agent);
  return (
    <section className="phone-hub">
      <h2>{t("tag")}</h2>
      <Banner tone={status === "published" ? "ok" : status === "conflict" ? "warn" : "info"} title={model.tenant.name}>
        {model.agent.greeting || t("lede")}
      </Banner>
      <Button tone="primary" asChild>
        <a href={hrefForAgent("behaviour")}>{t("title")}</a>
      </Button>
    </section>
  );
}
