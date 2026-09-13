import { z } from "zod";
import { claims } from "@subiza/core";

/**
 * Named assumptions (Prompt 06 §13).
 *
 * Embedded Signup cannot be resumed. No provider can pick up a mid-window
 * Meta session; it restarts from the beginning for everyone. `current_step`
 * on CANCEL is display-only narrative. Never persist a resume pointer into
 * Meta's flow.
 *
 * Coexistence availability in Rwanda is unconfirmed. Meta shipped Nigeria
 * and South Africa in April 2026, country by country. Detect unavailability
 * immediately and move the owner to another route — they must not discover
 * it halfway through a 24-hour one-shot sync.
 */
export const EMBEDDED_SIGNUP_RESUMABLE = false;
export const COEX_RWANDA_CONFIRMED = false;

export const EMBEDDED_SIGNUP_VERSION = 4 as const;
export const CODE_TTL_SECONDS = 30;
export const EMBEDDED_SIGNUP_SCREENS = [
  "login",
  "portfolio",
  "waba",
  "phone-number",
  "display-name",
  "otp",
] as const;

export const COEX_HISTORY_DAYS = 180;
export const COEX_PHASES = 3;
export const COEX_WINDOW_HOURS = 24;
export const COEX_MEDIA_DAYS = 14;
export const COEX_THROUGHPUT_MPS = 20;
export const COEX_RETRYABLE = false;

export const WA_TIER_LADDER = [250, 2_000, 10_000, 100_000] as const;
export const WA_FREE_SERVICE_PER_NUMBER = 1_000;
export const WA_SERVICE_BILLABLE_FROM = "2026-10-01";
export const WA_QUALITY_GRACE_DAYS = 7;
export const WA_WINDOW_HOURS = 24;

export const META_VERIFICATION_MIN = claims.metaVerificationMin.value;
export const META_VERIFICATION_MAX = claims.metaVerificationMax.value;

export const DISPLAY_NAME_REJECT_CAUSES = ["emoji", "promotional", "generic", "rdb-mismatch"] as const;
export type DisplayNameRejectCause = (typeof DISPLAY_NAME_REJECT_CAUSES)[number];

export const IG_WINDOW_HOURS = 24;
export const IG_PRIVATE_REPLY_PER_COMMENT = 1;
export const IG_HUMAN_AGENT_TAG_PERMITTED = false;
export const IG_TOKEN_DAYS = 60;
export const IG_SCOPES = ["instagram_business_basic", "instagram_business_manage_messages"] as const;

export const DISCONNECT_VISIBLE_MS = 300_000;
export const ONBOARDING_WEEKLY_CAP = 10;
export const ONBOARDING_WINDOW_DAYS = 7;
export const ONBOARDING_POST_REVIEW_CAP = 200;

/**
 * Phase A1 — BSP tier. Recorded, not flipped.
 *
 * Tech Provider: Meta bills the business; every owner needs an international
 * card. Solution Partner: we pay Meta, the owner pays us by MoMo.
 * Until the partner confirmation lands, wa8 states the card wall plainly
 * and offers the dignified exit to other channels.
 */
export const BSP_TIER = "tech-provider-pending" as const;
export type BspTier = typeof BSP_TIER;

export const MESSAGING_KINDS = ["telegram", "whatsapp", "instagram", "web", "sms"] as const;
export type MessagingKind = (typeof MESSAGING_KINDS)[number];

export const CHANNEL_STATUSES = ["off", "action", "waiting", "working", "err"] as const;
export type ChannelHealth = (typeof CHANNEL_STATUSES)[number];

export const TG_STEPS = ["tg1", "tg2"] as const;
export type TelegramStep = (typeof TG_STEPS)[number];

export const WA_STEPS = ["wa1", "wa2", "wa3", "wa4", "wa5", "wa6", "wa7", "wa8", "wa9"] as const;
export type WhatsAppStep = (typeof WA_STEPS)[number];

export const IG_STEPS = ["ig1", "ig2"] as const;
export type InstagramStep = (typeof IG_STEPS)[number];

export const REPAIR_STEPS = ["brk"] as const;
export type RepairStep = (typeof REPAIR_STEPS)[number];

export const MESSAGING_CHANNELS = ["telegram", "whatsapp", "instagram", "repair"] as const;
export type MessagingChannel = (typeof MESSAGING_CHANNELS)[number];

export const MESSAGING_STEPS = [...TG_STEPS, ...WA_STEPS, ...IG_STEPS, ...REPAIR_STEPS] as const;
export type MessagingStep = (typeof MESSAGING_STEPS)[number];

export const MESSAGING_STEPMAP = {
  tg1: 1,
  tg2: 1,
  wa1: 1,
  wa2: 2,
  wa3: 2,
  wa4: 3,
  wa5: 3,
  wa6: 4,
  wa7: 3,
  wa8: 4,
  wa9: 4,
  ig1: 1,
  ig2: 2,
  brk: 0,
} as const satisfies Record<MessagingStep, number>;

export const WA_ROUTES = ["move", "coex", "other"] as const;
export type WhatsAppRoute = (typeof WA_ROUTES)[number];

export const TG_MODES = ["managed", "botfather"] as const;
export type TelegramMode = (typeof TG_MODES)[number];

export const WA_DATA_SOURCE = "whatsapp" as const;
export const CONVERSATION_SOURCES = ["whatsapp", "telegram", "instagram", "phone", "web", "sms"] as const;
export type ConversationSource = (typeof CONVERSATION_SOURCES)[number];

/** WhatsApp-sourced data — including anonymous, aggregate, or derived — may not train any model except a per-tenant exclusive fine-tune. */
export function canTrainOn(source: ConversationSource): boolean {
  return source !== "whatsapp";
}

export const HUMAN_AGENT_TAG = "HUMAN_AGENT" as const;
export type HumanAgentTag = typeof HUMAN_AGENT_TAG;

/** Agent-authored outbound. The tag is not expressible. */
export type AgentOutboundMessage = {
  text: string;
  source: ConversationSource;
  tag?: never;
};

/** A genuine human on the rota may set the tag. The agent path cannot. */
export type HumanOutboundMessage = {
  text: string;
  source: ConversationSource;
  tag?: HumanAgentTag;
};

export function isAgentOutbound(message: AgentOutboundMessage | HumanOutboundMessage): message is AgentOutboundMessage {
  return !("tag" in message && message.tag === HUMAN_AGENT_TAG);
}

const telegramSchema = z.object({
  status: z.enum(CHANNEL_STATUSES).default("off"),
  mode: z.enum(TG_MODES).nullable().default(null),
  username: z.string().nullable().default(null),
  connectedAt: z.number().nullable().default(null),
  pausedPerChat: z.boolean().default(false),
  disconnectedAt: z.number().nullable().default(null),
  step: z.enum(TG_STEPS).default("tg1"),
});

const whatsappSchema = z.object({
  status: z.enum(CHANNEL_STATUSES).default("off"),
  numberAlreadyOnWa: z.boolean().nullable().default(null),
  rdbRegistered: z.boolean().nullable().default(null),
  ownerNumber: z.string().nullable().default(null),
  route: z.enum(WA_ROUTES).nullable().default(null),
  coexistenceUnavailable: z.boolean().default(!COEX_RWANDA_CONFIRMED),
  displayName: z.string().nullable().default(null),
  displayNameRejected: z.boolean().default(false),
  rejectCause: z.enum(DISPLAY_NAME_REJECT_CAUSES).nullable().default(null),
  waitingSince: z.number().nullable().default(null),
  connectedAt: z.number().nullable().default(null),
  disconnectedAt: z.number().nullable().default(null),
  lastMetaScreen: z.string().nullable().default(null),
  lastErrorCode: z.string().nullable().default(null),
  lastSessionId: z.string().nullable().default(null),
  codeExchangedAt: z.number().nullable().default(null),
  codeExpired: z.boolean().default(false),
  queuePosition: z.number().int().nonnegative().nullable().default(null),
  step: z.enum(WA_STEPS).default("wa1"),
});

const instagramSchema = z.object({
  status: z.enum(CHANNEL_STATUSES).default("off"),
  professional: z.boolean().default(false),
  connectedAt: z.number().nullable().default(null),
  disconnectedAt: z.number().nullable().default(null),
  tokenExpiresAt: z.number().nullable().default(null),
  tokenExpiring: z.boolean().default(false),
  step: z.enum(IG_STEPS).default("ig1"),
});

const stubSchema = z.object({
  status: z.enum(CHANNEL_STATUSES).default("off"),
});

export const messagingChannelsSchema = z.object({
  telegram: telegramSchema,
  whatsapp: whatsappSchema,
  instagram: instagramSchema,
  web: stubSchema,
  sms: stubSchema,
  brokenKind: z.enum(MESSAGING_KINDS).nullable().default(null),
});

export type MessagingChannels = z.infer<typeof messagingChannelsSchema>;
export type TelegramChannel = z.infer<typeof telegramSchema>;
export type WhatsAppChannel = z.infer<typeof whatsappSchema>;
export type InstagramChannel = z.infer<typeof instagramSchema>;

export function emptyChannels(): MessagingChannels {
  return messagingChannelsSchema.parse({
    telegram: {},
    whatsapp: {},
    instagram: {},
    web: {},
    sms: { status: "off" },
  });
}

export function normalizeChannels(value: unknown): MessagingChannels {
  const parsed = messagingChannelsSchema.safeParse(value);
  return parsed.success ? parsed.data : emptyChannels();
}

export function stepsFor(channel: MessagingChannel): readonly MessagingStep[] {
  if (channel === "telegram") return TG_STEPS;
  if (channel === "whatsapp") return WA_STEPS;
  if (channel === "instagram") return IG_STEPS;
  return REPAIR_STEPS;
}

export function isMessagingChannel(value: string): value is MessagingChannel {
  return (MESSAGING_CHANNELS as readonly string[]).includes(value);
}

export function isMessagingStep(value: string): value is MessagingStep {
  return (MESSAGING_STEPS as readonly string[]).includes(value);
}

export function stepBelongsTo(channel: MessagingChannel, step: MessagingStep): boolean {
  return (stepsFor(channel) as readonly string[]).includes(step);
}

export function deriveChannelStep(docs: MessagingChannels, channel: MessagingChannel): MessagingStep {
  if (channel === "repair") return "brk";
  if (channel === "telegram") return docs.telegram.step;
  if (channel === "instagram") return docs.instagram.professional && docs.instagram.connectedAt ? "ig2" : docs.instagram.step;
  return docs.whatsapp.step;
}

export function channelTileStatus(kind: MessagingKind, docs: MessagingChannels): ChannelHealth {
  if (kind === "sms") return "off";
  if (kind === "web") return docs.web.status;
  return docs[kind].status;
}

export function codeIsExpired(issuedAt: number, now: number): boolean {
  return now - issuedAt > CODE_TTL_SECONDS * 1_000;
}

export function isTokenExpiring(expiresAt: number | null, now: number): boolean {
  if (expiresAt == null) return false;
  return expiresAt - now < 7 * 86_400_000;
}

export function disconnectionSince(at: number, now: number): boolean {
  return now - at <= DISCONNECT_VISIBLE_MS || at > 0;
}

export type PrivateReplyClaim = {
  tenantId: string;
  commentId: string;
  status: "claimed" | "sent" | "do-not-resend";
  at: number;
};

export function resolvePrivateReplyOutcome(outcome: "ok" | "timeout" | "unknown" | "duplicate"): PrivateReplyClaim["status"] {
  if (outcome === "ok") return "sent";
  return "do-not-resend";
}

export function formatDisconnectedSince(at: number, locale: "en" | "rw"): string {
  const time = new Intl.DateTimeFormat(locale === "rw" ? "en-GB" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Kigali",
  }).format(new Date(at));
  return time;
}

export function formatServiceBillFrom(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${WA_SERVICE_BILLABLE_FROM}T00:00:00Z`));
}

export function botUsernameFor(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20);
  return `${slug || "subiza"}_bot`;
}

export function mustOfferMigration(unresolved: boolean, windowClosed: boolean): boolean {
  return unresolved && windowClosed;
}

export function isMetaScreen(value: string): boolean {
  return (EMBEDDED_SIGNUP_SCREENS as readonly string[]).includes(value);
}
