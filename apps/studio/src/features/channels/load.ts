import {
  bundleOf,
  connectWhatsApp,
  detectSilentDisconnect,
  documentsOf,
  getTenant,
  markDisplayNameRejected,
  maybeRefreshInstagramToken,
  setCoexistenceUnavailable,
  ownerNumber,
  readChannels,
  setChannelStep,
} from "@subiza/auth-tenant";
import { canConnectChannel, canRead, formatRwandaPhone } from "@subiza/core";
import {
  MESSAGING_STEPMAP,
  botUsernameFor,
  deriveChannelStep,
  formatDisconnectedSince,
  formatServiceBillFrom,
  normalizeChannels,
  type MessagingChannel,
  type MessagingStep,
} from "@subiza/domain";
import { redirect } from "next/navigation";
import { requireStudioContext } from "@/lib/session";

function one(search: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = search[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function loadChannels(
  channel: MessagingChannel,
  step: MessagingStep,
  search: Record<string, string | string[] | undefined>,
) {
  const incoming = await requireStudioContext();
  const canSee = canRead(incoming.role, "connectDisconnectChannel");
  const canWrite = canConnectChannel(incoming.role) && incoming.strength !== "recovered";
  const denied = !canWrite;
  if (canWrite && incoming.strength !== "elevated") {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      if (typeof value === "string") qs.set(key, value);
    }
    const next = `/connections/messaging/${channel}/${step}${qs.size ? `?${qs}` : ""}`;
    redirect(`/connections/messaging/enter?next=${encodeURIComponent(next)}` as never);
  }
  const ctx = incoming;

  if (canWrite && one(search, "force") === "break") {
    detectSilentDisconnect(ctx, "instagram");
  }
  if (canWrite && one(search, "force") === "revoke") {
    maybeRefreshInstagramToken(ctx, Date.now(), true);
  } else if (canWrite) {
    maybeRefreshInstagramToken(ctx);
  }
  if (canWrite && one(search, "force") === "name") markDisplayNameRejected(ctx);
  if (canWrite && one(search, "force") === "pay") setChannelStep(ctx, "whatsapp", "wa8");
  if (canWrite && one(search, "force") === "done") connectWhatsApp(ctx);
  if (canWrite && one(search, "force") === "available") setCoexistenceUnavailable(ctx, false);
  if (canWrite && one(search, "still") === "1") setChannelStep(ctx, "instagram", "ig1");

  const locale = getTenant(ctx).language === "en" ? "en" : "rw";
  const channels = canSee ? readChannels(ctx) : normalizeChannels(bundleOf(ctx).channels);
  const tenant = getTenant(ctx);
  const owner = ownerNumber(ctx);
  const brokenAt = channels.instagram.disconnectedAt ?? channels.whatsapp.disconnectedAt ?? channels.telegram.disconnectedAt;
  return {
    ctx,
    tenant,
    docs: documentsOf(ctx),
    channels,
    channel,
    step,
    derived: deriveChannelStep(channels, channel),
    progressNow: MESSAGING_STEPMAP[step],
    owner,
    ownerDisplay: formatRwandaPhone(owner),
    botUsername: channels.telegram.username ?? botUsernameFor(tenant.name),
    billFrom: formatServiceBillFrom(),
    since: brokenAt ? formatDisconnectedSince(brokenAt, locale) : null,
    denied,
    canSee,
    force: one(search, "force") ?? "",
    metaScreen: one(search, "screen") ?? channels.whatsapp.lastMetaScreen ?? "phone-number",
    tokenInvalid: one(search, "token") === "invalid",
    telegramDone: one(search, "done") === "1",
    stillPersonal: one(search, "still") === "1",
    live: (() => {
      const goLive = documentsOf(ctx).goLive;
      return goLive != null && goLive.rung !== "sandbox" && goLive.pausedAt === null;
    })(),
  };
}

export async function loadMessagingHub() {
  const ctx = await requireStudioContext();
  const tenant = getTenant(ctx);
  const locale = tenant.language === "en" ? "en" : "rw";
  const channels = canRead(ctx.role, "connectDisconnectChannel")
    ? readChannels(ctx)
    : normalizeChannels(bundleOf(ctx).channels);
  const brokenAt =
    channels.instagram.disconnectedAt ?? channels.whatsapp.disconnectedAt ?? channels.telegram.disconnectedAt;
  return {
    ctx,
    tenant,
    channels,
    canSee: canRead(ctx.role, "connectDisconnectChannel"),
    since: brokenAt ? formatDisconnectedSince(brokenAt, locale) : null,
  };
}
