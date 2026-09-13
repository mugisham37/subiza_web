import { Banner, ChannelRow, Icon } from "@subiza/ui";
import {
  COEX_WINDOW_HOURS,
  META_VERIFICATION_MAX,
  META_VERIFICATION_MIN,
  channelTileStatus,
} from "@subiza/domain";
import { getTranslations } from "next-intl/server";
import { loadMessagingHub } from "./load";
import { hrefForChannel } from "./steps";

export async function MessagingSurface() {
  const model = await loadMessagingHub();
  const t = await getTranslations("channel");
  const ch = model.channels;
  const tg = channelTileStatus("telegram", ch);
  const wa = channelTileStatus("whatsapp", ch);
  const ig = channelTileStatus("instagram", ch);
  const figures = { minDays: META_VERIFICATION_MIN, maxDays: META_VERIFICATION_MAX, window: COEX_WINDOW_HOURS };
  return (
    <section className="msg-hub">
      <h1>{t("hubTitle")}</h1>
      <p className="sub">{t("hubLede")}</p>
      {ch.brokenKind ? (
        <Banner tone="risk" title={t("brkTitle", { channel: t(ch.brokenKind) })}>
          {t("brkBody", { since: model.since ?? "—", channel: t(ch.brokenKind) })}
        </Banner>
      ) : null}
      <div className="chanlist">
        <ChannelRow
          kind="tg"
          name={t("telegram")}
          detail={t("tgDetail")}
          status={tg}
          statusLabel={tg === "working" ? t("working") : tg === "err" ? t("disconnected", { since: model.since ?? "" }) : t("startHere")}
          tagTone={tg === "err" ? "warn" : "ok"}
          href={hrefForChannel("telegram", tg === "working" ? "tg1" : "tg1")}
        />
        <ChannelRow
          kind="wa"
          name={t("whatsapp")}
          detail={t("waDetail", figures)}
          status={wa}
          statusLabel={
            wa === "waiting"
              ? t("waitingMeta")
              : wa === "working"
                ? t("working")
                : wa === "err"
                  ? t("disconnected", { since: model.since ?? "" })
                  : t("startToday")
          }
          tagTone={wa === "waiting" || wa === "working" ? "neutral" : "warn"}
          href={hrefForChannel("whatsapp", ch.whatsapp.step)}
        />
        <ChannelRow
          kind="ig"
          name={t("instagram")}
          detail={t("igDetail")}
          status={ig}
          statusLabel={
            ch.instagram.tokenExpiring
              ? t("tokenExpiring")
              : ig === "working"
                ? t("working")
                : ig === "err"
                  ? t("disconnected", { since: model.since ?? "" })
                  : t("notConnected")
          }
          tagTone="neutral"
          href={ig === "err" ? hrefForChannel("repair", "brk") : hrefForChannel("instagram", ch.instagram.step)}
        />
        <ChannelRow kind="web" name={t("web")} detail={t("webDetail")} status="off" statusLabel={t("notConnected")} />
        <ChannelRow kind="sms" name={t("sms")} detail={t("smsDetail")} status="off" statusLabel={t("later")} disabled />
      </div>
      <p className="chanhint">
        <Icon name="info" size={14} />
        <span>{t("hubOrder")}</span>
      </p>
    </section>
  );
}
