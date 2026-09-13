import {
  canConnectChannel,
  canDisconnectChannel,
  canRead,
  type TenantCapability,
} from "@subiza/core";
import {
  BSP_TIER,
  CODE_TTL_SECONDS,
  EMBEDDED_SIGNUP_VERSION,
  IG_TOKEN_DAYS,
  ONBOARDING_WEEKLY_CAP,
  ONBOARDING_WINDOW_DAYS,
  canTrainOn,
  codeIsExpired,
  emptyChannels,
  isTokenExpiring,
  normalizeChannels,
  resolvePrivateReplyOutcome,
  type ConversationSource,
  type MessagingChannels,
  type MessagingKind,
  type MessagingStep,
  type PrivateReplyClaim,
  type TelegramMode,
  type WhatsAppRoute,
  type WhatsAppStep,
} from "@subiza/domain";
import { writeAudit } from "./audit";
import { bundleOf, emit } from "./activation";
import type { TenantContext } from "./context";
import { createTenantContext } from "./context";
import { connectChannel as dalConnect, disconnectChannel as dalDisconnect } from "./dal";
import { mintSession } from "./sessions";
import { getStore } from "./store";

/**
 * AUTH STRENGTH DECISION — Prompt 06 §15.
 *
 * connectDisconnectChannel is elevated AND recovered-denied.
 * Connect requires elevated — step up on entry to the sub-flow.
 * Disconnect requires elevated plus scope `full` (owner only).
 * A recovered session is refused outright.
 * Hub visibility is `canRead`.
 */
export const CHANNEL_SURFACE_AUTH = {
  connectRequires: "elevated",
  disconnectRequires: "elevated-full",
  recovered: "denied",
  hub: "canRead",
  bspTier: BSP_TIER,
} as const;

function deny(ctx: TenantContext, capability: TenantCapability, reason: string): never {
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: capability,
    capability,
    outcome: "denied",
    before: null,
    after: null,
    reason,
  });
  throw Object.assign(new Error("notFound"), { code: "notFound" as const });
}

function requireConnect(ctx: TenantContext): void {
  if (ctx.strength === "recovered") deny(ctx, "connectDisconnectChannel", "recovered");
  if (!canConnectChannel(ctx.role)) deny(ctx, "connectDisconnectChannel", "missing-grant");
  if (ctx.strength !== "elevated") deny(ctx, "connectDisconnectChannel", "needs-elevated");
  dalConnect(ctx);
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: "connectDisconnectChannel",
    capability: "connectDisconnectChannel",
    outcome: "allowed",
    before: null,
    after: { strength: ctx.strength, decision: CHANNEL_SURFACE_AUTH.connectRequires },
    reason: "channel-surface-elevated",
  });
}

function requireDisconnect(ctx: TenantContext): void {
  if (ctx.strength === "recovered") deny(ctx, "connectDisconnectChannel", "recovered");
  if (!canDisconnectChannel(ctx.role)) deny(ctx, "connectDisconnectChannel", "disconnect-owner-only");
  if (ctx.strength !== "elevated") deny(ctx, "connectDisconnectChannel", "needs-elevated");
  dalDisconnect(ctx);
}

function channelsOf(ctx: TenantContext): MessagingChannels {
  const bundle = bundleOf(ctx);
  const next = normalizeChannels(bundle.channels ?? emptyChannels());
  bundle.channels = next;
  return next;
}

function writeChannels(ctx: TenantContext, next: MessagingChannels): MessagingChannels {
  bundleOf(ctx).channels = next;
  return next;
}

export function elevateForChannelConnect(ctx: TenantContext): { ctx: TenantContext; sessionId: string | null } {
  if (ctx.strength === "recovered") deny(ctx, "connectDisconnectChannel", "recovered");
  if (!canConnectChannel(ctx.role)) deny(ctx, "connectDisconnectChannel", "missing-grant");
  if (ctx.strength === "elevated") return { ctx, sessionId: null };
  const session = mintSession({
    personId: ctx.personId,
    tenantId: ctx.tenantId,
    memberId: ctx.memberId,
    strength: "elevated",
  });
  return {
    ctx: createTenantContext({
      tenantId: ctx.tenantId,
      memberId: ctx.memberId,
      personId: ctx.personId,
      role: ctx.role,
      strength: "elevated",
      actorType: ctx.actorType,
    }),
    sessionId: session.id,
  };
}

export function readChannels(ctx: TenantContext): MessagingChannels {
  if (!canRead(ctx.role, "connectDisconnectChannel")) {
    deny(ctx, "connectDisconnectChannel", "missing-read");
  }
  return channelsOf(ctx);
}

export function setChannelStep(ctx: TenantContext, kind: "telegram" | "whatsapp" | "instagram", step: MessagingStep): MessagingChannels {
  requireConnect(ctx);
  const current = channelsOf(ctx);
  if (kind === "telegram" && (step === "tg1" || step === "tg2")) {
    return writeChannels(ctx, { ...current, telegram: { ...current.telegram, step } });
  }
  if (kind === "whatsapp" && step.startsWith("wa")) {
    return writeChannels(ctx, { ...current, whatsapp: { ...current.whatsapp, step: step as WhatsAppStep } });
  }
  if (kind === "instagram" && (step === "ig1" || step === "ig2")) {
    return writeChannels(ctx, { ...current, instagram: { ...current.instagram, step } });
  }
  return current;
}

export function createTelegramBot(ctx: TenantContext, mode: TelegramMode, username: string): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "telegram.bot_created", mode }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    telegram: {
      ...current.telegram,
      status: "working",
      mode,
      username,
      connectedAt: Date.now(),
      disconnectedAt: null,
      step: mode === "botfather" ? "tg2" : "tg1",
    },
  });
}

export function answerWhatsAppPreflight(
  ctx: TenantContext,
  input: { alreadyOnWa: boolean; rdb: boolean; number: string },
): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "whatsapp.preflight_answered", alreadyOnWa: input.alreadyOnWa, rdb: input.rdb }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  const nextStep = input.alreadyOnWa ? "wa2" : "wa4";
  return writeChannels(ctx, {
    ...current,
    whatsapp: {
      ...current.whatsapp,
      numberAlreadyOnWa: input.alreadyOnWa,
      rdbRegistered: input.rdb,
      ownerNumber: input.number,
      step: nextStep,
      status: "action",
    },
  });
}

export function chooseWhatsAppRoute(ctx: TenantContext, route: WhatsAppRoute): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "whatsapp.route_chosen", route }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  const nextStep = route === "coex" ? "wa3" : "wa4";
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, route, step: nextStep },
  });
}

export function setCoexistenceUnavailable(ctx: TenantContext, unavailable: boolean): MessagingChannels {
  requireConnect(ctx);
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, coexistenceUnavailable: unavailable },
  });
}

export function confirmCoexistence(ctx: TenantContext): MessagingChannels {
  requireConnect(ctx);
  const current = channelsOf(ctx);
  if (current.whatsapp.coexistenceUnavailable) {
    return writeChannels(ctx, {
      ...current,
      whatsapp: { ...current.whatsapp, step: "wa2", route: null },
    });
  }
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, step: "wa4" },
  });
}

export function startEmbeddedSignup(ctx: TenantContext): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "whatsapp.embedded_signup_started", version: EMBEDDED_SIGNUP_VERSION }, "connectDisconnectChannel");
  const store = getStore();
  const codeId = `${ctx.tenantId}:${Date.now()}`;
  store.signupCodes.set(codeId, { issuedAt: Date.now(), used: false });
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, step: "wa4", lastSessionId: codeId, codeExpired: false },
  });
}

export function exchangeEmbeddedSignup(ctx: TenantContext, codeId: string, now = Date.now()): MessagingChannels {
  requireConnect(ctx);
  const store = getStore();
  const row = store.signupCodes.get(codeId);
  if (!row || row.used || codeIsExpired(row.issuedAt, now)) {
    emit(ctx, { name: "whatsapp.embedded_signup_expired" }, "connectDisconnectChannel");
    const current = channelsOf(ctx);
    return writeChannels(ctx, {
      ...current,
      whatsapp: { ...current.whatsapp, codeExpired: true, step: "wa5" },
    });
  }
  row.used = true;
  emit(ctx, { name: "whatsapp.embedded_signup_exchanged", ttlSeconds: CODE_TTL_SECONDS }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, codeExchangedAt: now, codeExpired: false, step: "wa6", status: "waiting", waitingSince: now },
  });
}

export function abandonEmbeddedSignup(
  ctx: TenantContext,
  input: { metaScreen: string; errorCode?: string; sessionId: string },
): MessagingChannels {
  requireConnect(ctx);
  emit(
    ctx,
    {
      name: "whatsapp.embedded_signup_abandoned",
      metaScreen: input.metaScreen,
      errorCode: input.errorCode ?? null,
      sessionId: input.sessionId,
    },
    "connectDisconnectChannel",
  );
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: {
      ...current.whatsapp,
      step: "wa5",
      lastMetaScreen: input.metaScreen,
      lastErrorCode: input.errorCode ?? null,
      lastSessionId: input.sessionId,
    },
  });
}

export function enqueueWhatsAppOnboarding(ctx: TenantContext, now = Date.now()): MessagingChannels {
  requireConnect(ctx);
  const store = getStore();
  const windowStart = now - ONBOARDING_WINDOW_DAYS * 86_400_000;
  store.onboardingAttempts = store.onboardingAttempts.filter((row) => row.at >= windowStart);
  const already = store.onboardingAttempts.some((row) => row.tenantId === ctx.tenantId);
  const position = store.onboardingAttempts.filter((row) => row.tenantId !== ctx.tenantId).length + 1;
  if (!already && store.onboardingAttempts.length >= ONBOARDING_WEEKLY_CAP) {
    emit(ctx, { name: "channel.onboarding_queued", position }, "connectDisconnectChannel");
    const current = channelsOf(ctx);
    return writeChannels(ctx, {
      ...current,
      whatsapp: { ...current.whatsapp, queuePosition: position, step: "wa6", status: "waiting" },
    });
  }
  if (!already) store.onboardingAttempts.push({ tenantId: ctx.tenantId, at: now });
  emit(ctx, { name: "whatsapp.waiting" }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, queuePosition: already ? current.whatsapp.queuePosition : null, step: "wa6", status: "waiting", waitingSince: current.whatsapp.waitingSince ?? now },
  });
}

export function markDisplayNameRejected(ctx: TenantContext, cause: "emoji" | "promotional" | "generic" | "rdb-mismatch" = "emoji"): MessagingChannels {
  requireConnect(ctx);
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: {
      ...current.whatsapp,
      displayNameRejected: true,
      rejectCause: cause,
      displayName: current.whatsapp.displayName ?? "Salon Ubwiza Best Hair",
      step: "wa7",
    },
  });
}

export function resubmitDisplayName(ctx: TenantContext, name: string): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "whatsapp.display_name_resubmitted" }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, displayName: name, displayNameRejected: false, rejectCause: null, step: "wa6" },
  });
}

export function connectWhatsApp(ctx: TenantContext): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "whatsapp.connected" }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  return writeChannels(ctx, {
    ...current,
    whatsapp: { ...current.whatsapp, status: "working", connectedAt: Date.now(), step: "wa9" },
  });
}

export function checkInstagramAccount(ctx: TenantContext, professional: boolean): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "instagram.account_checked", professional }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  if (!professional) {
    return writeChannels(ctx, {
      ...current,
      instagram: { ...current.instagram, professional: false, step: "ig1", status: "action" },
    });
  }
  emit(ctx, { name: "instagram.connected" }, "connectDisconnectChannel");
  const expires = Date.now() + IG_TOKEN_DAYS * 86_400_000;
  return writeChannels(ctx, {
    ...current,
    brokenKind: current.brokenKind === "instagram" ? null : current.brokenKind,
    instagram: {
      ...current.instagram,
      professional: true,
      status: "working",
      connectedAt: Date.now(),
      tokenExpiresAt: expires,
      tokenExpiring: isTokenExpiring(expires, Date.now()),
      step: "ig2",
      disconnectedAt: null,
    },
  });
}

export function expireSignupCode(codeId: string): void {
  const row = getStore().signupCodes.get(codeId);
  if (row) row.issuedAt = Date.now() - (CODE_TTL_SECONDS + 1) * 1_000;
}

export function maybeRefreshInstagramToken(ctx: TenantContext, now = Date.now(), fail = false): MessagingChannels {
  const current = channelsOf(ctx);
  if (current.instagram.status !== "working" || current.instagram.tokenExpiresAt == null) return current;
  if (fail) {
    return detectSilentDisconnect(ctx, "instagram", now);
  }
  if (!isTokenExpiring(current.instagram.tokenExpiresAt, now)) return current;
  const expires = now + IG_TOKEN_DAYS * 86_400_000;
  return writeChannels(ctx, {
    ...current,
    instagram: { ...current.instagram, tokenExpiresAt: expires, tokenExpiring: false },
  });
}

export function claimPrivateReply(ctx: TenantContext, commentId: string, now = Date.now()): PrivateReplyClaim {
  requireConnect(ctx);
  const key = `${ctx.tenantId}:${commentId}`;
  const store = getStore();
  const existing = store.privateReplyClaims.get(key);
  if (existing) {
    return { ...existing, status: "do-not-resend" };
  }
  const claim: PrivateReplyClaim = { tenantId: ctx.tenantId, commentId, status: "claimed", at: now };
  store.privateReplyClaims.set(key, claim);
  emit(ctx, { name: "instagram.private_reply_recorded", commentId }, "connectDisconnectChannel");
  return claim;
}

export function settlePrivateReply(ctx: TenantContext, commentId: string, outcome: "ok" | "timeout" | "unknown" | "duplicate"): PrivateReplyClaim {
  const key = `${ctx.tenantId}:${commentId}`;
  const store = getStore();
  const current = store.privateReplyClaims.get(key);
  if (!current) {
    return claimPrivateReply(ctx, commentId);
  }
  const next = { ...current, status: resolvePrivateReplyOutcome(outcome) };
  store.privateReplyClaims.set(key, next);
  return next;
}

export function markChannelDisconnected(ctx: TenantContext, kind: MessagingKind, now = Date.now()): MessagingChannels {
  requireDisconnect(ctx);
  emit(ctx, { name: "channel.disconnected", kind, since: now }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  if (kind === "web" || kind === "sms") {
    return writeChannels(ctx, { ...current, [kind]: { status: "err" }, brokenKind: kind });
  }
  return writeChannels(ctx, {
    ...current,
    brokenKind: kind,
    [kind]: { ...current[kind], status: "err", disconnectedAt: now },
  });
}

export function detectSilentDisconnect(ctx: TenantContext, kind: MessagingKind, now = Date.now()): MessagingChannels {
  if (!canRead(ctx.role, "connectDisconnectChannel")) return channelsOf(ctx);
  const current = channelsOf(ctx);
  if (kind === "web" || kind === "sms") return current;
  const row = current[kind];
  if (row.status !== "working") return current;
  emit(ctx, { name: "channel.disconnected", kind, since: now }, "connectDisconnectChannel");
  return writeChannels(ctx, {
    ...current,
    brokenKind: kind,
    [kind]: { ...row, status: "err", disconnectedAt: now },
  });
}

export function reconnectChannel(ctx: TenantContext, kind: MessagingKind): MessagingChannels {
  requireConnect(ctx);
  emit(ctx, { name: "channel.reconnected", kind }, "connectDisconnectChannel");
  const current = channelsOf(ctx);
  if (kind === "instagram") {
    return checkInstagramAccount(ctx, true);
  }
  if (kind === "telegram") {
    return writeChannels(ctx, {
      ...current,
      brokenKind: current.brokenKind === kind ? null : current.brokenKind,
      telegram: { ...current.telegram, status: "working", disconnectedAt: null },
    });
  }
  if (kind === "whatsapp") {
    return writeChannels(ctx, {
      ...current,
      brokenKind: current.brokenKind === kind ? null : current.brokenKind,
      whatsapp: { ...current.whatsapp, status: "working", disconnectedAt: null, step: "wa9" },
    });
  }
  return current;
}

export function enqueueWebhook(input: { id: string; timestamp: number; tenantId: string; kind: string }): { accepted: boolean; duplicate: boolean } {
  const store = getStore();
  if (store.webhookInbox.some((row) => row.id === input.id)) {
    return { accepted: true, duplicate: true };
  }
  store.webhookInbox.push(input);
  store.webhookInbox.sort((a, b) => a.timestamp - b.timestamp);
  return { accepted: true, duplicate: false };
}

export function trainingCorpusFor(source: ConversationSource): readonly string[] {
  if (!canTrainOn(source)) return [];
  return ["tenant-exclusive"];
}

export type { MessagingChannels };
