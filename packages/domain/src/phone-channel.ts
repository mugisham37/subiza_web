import { z } from "zod";

export const FORWARD_CONDITIONS = ["no-reply", "busy", "unreachable", "unconditional"] as const;
export type ForwardCondition = (typeof FORWARD_CONDITIONS)[number];

export const PHONE_PATHS = ["forwarding", "new-number"] as const;
export type PhonePath = (typeof PHONE_PATHS)[number];

export const PHONE_NETWORKS = ["mtn", "airtel", "unknown"] as const;
export type PhoneNetwork = (typeof PHONE_NETWORKS)[number];

export const VERIFICATION_OUTCOMES = [
  "diverted",
  "owner-answered",
  "not-diverted",
  "diverted-no-caller-id",
  "diverted-elsewhere",
  "inconclusive",
  "unconditional",
] as const;
export type VerificationOutcome = (typeof VERIFICATION_OUTCOMES)[number];

export const VERIFICATION_STATUSES = ["idle", "calling", "retrying", "settled"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const PROVISIONING_STATES = [
  "not-started",
  "documents-ready",
  "regulatory-review",
  "number-selection",
  "assigned",
  "rejected",
] as const;
export type ProvisioningState = (typeof PROVISIONING_STATES)[number];

export const PHONE_STEPS = [
  "path",
  "scope",
  "code",
  "verify",
  "result",
  "repair",
  "done",
  "number",
  "lost",
] as const;
export type PhoneStep = (typeof PHONE_STEPS)[number];

/** Four-mark bar. Hidden on s9 (`lost`). */
export const PHONE_STEPMAP = {
  path: 1,
  scope: 2,
  code: 3,
  verify: 4,
  result: 4,
  repair: 3,
  done: 4,
  number: 2,
  lost: 0,
} as const satisfies Record<PhoneStep, number>;

export const FORWARD_TIMER_SECONDS = 20;
export const G22_LOOPBACK_MS = 8_000;
export const PROPAGATION_RETRY_MS = 60_000;
export const REVERIFY_MAX_DAYS = 7;
export const WAKING_HOUR_START = 8;
export const WAKING_HOUR_END = 19;
export const CLEAR_ALL_FORWARDING = "##002#";
export const SUBIZA_DID_DEFAULT = "250788456123";

/**
 * Named assumption (Prompt 04 §10.2).
 *
 * A time-blind `**61` registration forwards every unanswered call after the
 * timer, including during opening hours. We cannot unset that from the web.
 *
 * When the go-live rung is after-hours-only (`closed-only`) and a forwarded
 * call arrives during opening hours, Subiza **rings the owner through**. It
 * does not take the conversation as the agent. If the owner still does not
 * answer, it takes a message. Decline and carrier-voicemail are rejected:
 * both look like the product is broken on the first real missed call.
 */
export const OPENING_HOURS_FORWARD_POLICY = "ring-through" as const;
export type OpeningHoursForwardPolicy = typeof OPENING_HOURS_FORWARD_POLICY;

const verificationSchema = z.object({
  verifiedAt: z.number().nullable(),
  callerIdSurvived: z.boolean().nullable(),
  pickupSeconds: z.number().nullable(),
  attempts: z.number().int().nonnegative().default(0),
  lastAttemptAt: z.number().nullable().default(null),
  outcome: z.enum(VERIFICATION_OUTCOMES).nullable().default(null),
  lastVerifiedAt: z.number().nullable().default(null),
  nextCheckAt: z.number().nullable().default(null),
  status: z.enum(VERIFICATION_STATUSES).default("idle"),
  kind: z.enum(["activation", "recurring"]).default("activation"),
  rejectWith486: z.boolean().default(false),
  callerNumber: z.string().nullable().default(null),
});

const provisioningSchema = z.object({
  state: z.enum(PROVISIONING_STATES).default("not-started"),
  startedAt: z.number().nullable().default(null),
  expectedDaysMin: z.number().int().positive().default(3),
  expectedDaysMax: z.number().int().positive().default(7),
});

export const phoneChannelSchema = z.object({
  condition: z.enum(FORWARD_CONDITIONS),
  subizaNumber: z.string().min(8),
  timerSeconds: z.number().int().positive(),
  deactivationCode: z.string().min(2),
  skippedAt: z.number().nullable(),
  verification: verificationSchema,
  openingHoursForwardPolicy: z.literal(OPENING_HOURS_FORWARD_POLICY),
  path: z.enum(PHONE_PATHS).default("forwarding"),
  network: z.enum(PHONE_NETWORKS).default("unknown"),
  networkCorrectedManually: z.boolean().default(false),
  conditions: z.array(z.enum(FORWARD_CONDITIONS)).default(["no-reply"]),
  currentCodeIndex: z.number().int().nonnegative().default(0),
  voicemailConflictAcknowledgedAt: z.number().nullable().default(null),
  assistedRequestedAt: z.number().nullable().default(null),
  forwardingLostAt: z.number().nullable().default(null),
  repairRung: z.number().int().nonnegative().default(0),
  prepaidBlocked: z.boolean().default(false),
  surfaceStep: z.enum(PHONE_STEPS).optional(),
  provisioning: provisioningSchema.default({
    state: "not-started",
    startedAt: null,
    expectedDaysMin: 3,
    expectedDaysMax: 7,
  }),
});
export type PhoneChannel = z.infer<typeof phoneChannelSchema>;

export type ForwardingCodeRow = {
  condition: ForwardCondition;
  code: string;
  deactivate: string;
  interrogate: string;
};

export type LoopbackObservation = {
  inboundAt: number | null;
  callerNumber: string | null;
  loopbackMs: number | null;
  answeredBy: "us" | "owner" | "elsewhere" | "none" | "unknown";
};

export type LoopbackDisposition = "answer" | "reject-486";

export function emptyPhoneChannel(subizaNumber: string): PhoneChannel {
  return {
    condition: "no-reply",
    subizaNumber,
    timerSeconds: FORWARD_TIMER_SECONDS,
    deactivationCode: "##61#",
    skippedAt: null,
    verification: {
      verifiedAt: null,
      callerIdSurvived: null,
      pickupSeconds: null,
      attempts: 0,
      lastAttemptAt: null,
      outcome: null,
      lastVerifiedAt: null,
      nextCheckAt: null,
      status: "idle",
      kind: "activation",
      rejectWith486: false,
      callerNumber: null,
    },
    openingHoursForwardPolicy: OPENING_HOURS_FORWARD_POLICY,
    path: "forwarding",
    network: "unknown",
    networkCorrectedManually: false,
    conditions: ["no-reply"],
    currentCodeIndex: 0,
    voicemailConflictAcknowledgedAt: null,
    assistedRequestedAt: null,
    forwardingLostAt: null,
    repairRung: 0,
    prepaidBlocked: false,
    surfaceStep: undefined,
    provisioning: {
      state: "not-started",
      startedAt: null,
      expectedDaysMin: 3,
      expectedDaysMax: 7,
    },
  };
}

export function normalizePhoneChannel(raw: unknown, fallbackNumber: string): PhoneChannel {
  const parsed = phoneChannelSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  const fallback = emptyPhoneChannel(fallbackNumber);
  if (!raw || typeof raw !== "object") return fallback;
  const merged = phoneChannelSchema.safeParse({ ...fallback, ...raw });
  return merged.success ? merged.data : fallback;
}

export function resolvedConditions(channel: PhoneChannel): ForwardCondition[] {
  if (channel.conditions.length > 0) return channel.conditions;
  return [channel.condition];
}

export function deactivationCodeFor(condition: ForwardCondition): string {
  if (condition === "unconditional") return "##21#";
  if (condition === "busy") return "##67#";
  if (condition === "unreachable") return "##62#";
  return "##61#";
}

export function interrogateCodeFor(condition: ForwardCondition): string {
  if (condition === "unconditional") return "*#21#";
  if (condition === "busy") return "*#67#";
  if (condition === "unreachable") return "*#62#";
  return "*#61#";
}

export const INTERROGATE_CODE_FOR = interrogateCodeFor;

function digitsOf(number: string): string {
  return number.replace(/\D/g, "");
}

export function codeForCondition(
  condition: ForwardCondition,
  subizaNumber: string,
  timerSeconds = FORWARD_TIMER_SECONDS,
): string {
  const n = digitsOf(subizaNumber);
  if (condition === "unconditional") return `**21*${n}#`;
  if (condition === "busy") return `**67*${n}#`;
  if (condition === "unreachable") return `**62*${n}#`;
  return `**61*${n}*11*${timerSeconds}#`;
}

export function forwardingCode(channel: PhoneChannel): string {
  const current = resolvedConditions(channel)[channel.currentCodeIndex] ?? channel.condition;
  return codeForCondition(current, channel.subizaNumber, channel.timerSeconds);
}

/** Repair-ladder rung 1 — drop SIB and the timer. Fewest variables to reject. */
export function shorterForwardingCode(channel: PhoneChannel): string {
  return `**61*${digitsOf(channel.subizaNumber)}#`;
}

/**
 * TS 22.030 §6.5.2 permits `*SIA**SIC#`, skipping SIB with a doubled separator.
 * A legitimate extra variant on the repair ladder — not the default we send.
 */
export function skippedSibForwardingCode(channel: PhoneChannel): string {
  return `**61*${digitsOf(channel.subizaNumber)}**${channel.timerSeconds}#`;
}

export function forwardingCodes(channel: PhoneChannel): ForwardingCodeRow[] {
  return resolvedConditions(channel).map((condition) => ({
    condition,
    code: codeForCondition(condition, channel.subizaNumber, channel.timerSeconds),
    deactivate: deactivationCodeFor(condition),
    interrogate: interrogateCodeFor(condition),
  }));
}

export function telHref(code: string): string {
  return `tel:${encodeURIComponent(code).replace(/#/g, "%23")}`;
}

export function dispositionForCheck(kind: "activation" | "recurring"): LoopbackDisposition {
  return kind === "recurring" ? "reject-486" : "answer";
}

export function isSuccessOutcome(outcome: VerificationOutcome | null): boolean {
  return outcome === "diverted" || outcome === "diverted-no-caller-id";
}

export function isFailureOutcome(outcome: VerificationOutcome | null): boolean {
  return outcome === "not-diverted" || outcome === "diverted-elsewhere" || outcome === "unconditional";
}

export function isNeutralOutcome(outcome: VerificationOutcome | null): boolean {
  return outcome === "owner-answered" || outcome === "inconclusive";
}

export function outcomeFromObservation(
  observation: LoopbackObservation,
  expectedDid: string,
): VerificationOutcome {
  if (observation.answeredBy === "unknown") return "inconclusive";
  if (observation.answeredBy === "owner") return "owner-answered";
  if (observation.answeredBy === "elsewhere") return "diverted-elsewhere";
  if (observation.answeredBy === "none" || observation.inboundAt == null) return "not-diverted";
  if (observation.loopbackMs != null && observation.loopbackMs < G22_LOOPBACK_MS) {
    return "unconditional";
  }
  const did = digitsOf(expectedDid);
  const seen = observation.callerNumber ? digitsOf(observation.callerNumber) : "";
  if (seen && did && seen !== did) return "diverted-no-caller-id";
  return "diverted";
}

export function observationForForce(
  force: VerificationOutcome,
  expectedDid: string,
  ownerMsisdn: string,
  now: number,
): LoopbackObservation {
  if (force === "inconclusive") {
    return { inboundAt: null, callerNumber: null, loopbackMs: null, answeredBy: "unknown" };
  }
  if (force === "owner-answered") {
    return { inboundAt: null, callerNumber: ownerMsisdn, loopbackMs: null, answeredBy: "owner" };
  }
  if (force === "not-diverted") {
    return { inboundAt: null, callerNumber: null, loopbackMs: null, answeredBy: "none" };
  }
  if (force === "diverted-elsewhere") {
    return { inboundAt: now, callerNumber: null, loopbackMs: 22_000, answeredBy: "elsewhere" };
  }
  if (force === "unconditional") {
    return { inboundAt: now, callerNumber: expectedDid, loopbackMs: 3_000, answeredBy: "us" };
  }
  if (force === "diverted-no-caller-id") {
    return { inboundAt: now, callerNumber: ownerMsisdn, loopbackMs: 21_000, answeredBy: "us" };
  }
  return { inboundAt: now, callerNumber: expectedDid, loopbackMs: 21_000, answeredBy: "us" };
}

export function applyVerificationOutcome(
  channel: PhoneChannel,
  outcome: VerificationOutcome,
  observation: LoopbackObservation,
  now: number,
): PhoneChannel {
  const attempts = channel.verification.attempts + 1;
  const callerIdSurvived = outcome === "diverted" ? true : outcome === "diverted-no-caller-id" ? false : channel.verification.callerIdSurvived;
  const passed = isSuccessOutcome(outcome);
  const pickupSeconds =
    observation.loopbackMs != null ? Math.round(observation.loopbackMs / 1000) : outcome === "diverted" ? 20 : channel.verification.pickupSeconds;
  return {
    ...channel,
    skippedAt: passed ? null : channel.skippedAt,
    forwardingLostAt: passed ? null : channel.forwardingLostAt,
    verification: {
      ...channel.verification,
      attempts,
      lastAttemptAt: now,
      outcome,
      status: "settled",
      callerNumber: observation.callerNumber,
      callerIdSurvived,
      pickupSeconds,
      verifiedAt: passed ? now : channel.verification.verifiedAt,
      lastVerifiedAt: passed ? now : channel.verification.lastVerifiedAt,
      nextCheckAt: passed ? nextReverificationAt(now) : channel.verification.nextCheckAt,
    },
  };
}

export function propagationRetry(input: {
  attempts: number;
  lastAttemptAt: number | null;
  lastOutcome: VerificationOutcome | null;
  now: number;
}): { action: "report" } | { action: "retry"; waitMs: number } | { action: "wait"; waitMs: number } {
  if (input.lastOutcome !== "not-diverted") return { action: "report" };
  if (input.attempts >= 2) return { action: "report" };
  if (input.attempts === 1 && input.lastAttemptAt != null) {
    const due = input.lastAttemptAt + PROPAGATION_RETRY_MS;
    if (input.now >= due) return { action: "retry", waitMs: 0 };
    return { action: "wait", waitMs: due - input.now };
  }
  return { action: "report" };
}

export function kigaliHour(ms: number): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Kigali",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date(ms));
  return Number.parseInt(formatted, 10);
}

export function isWakingHour(ms: number): boolean {
  const hour = kigaliHour(ms);
  return hour >= WAKING_HOUR_START && hour < WAKING_HOUR_END;
}

export function nextReverificationAt(fromMs: number): number {
  let t = fromMs + REVERIFY_MAX_DAYS * 86_400_000;
  for (let i = 0; i < 48; i += 1) {
    if (isWakingHour(t)) return t;
    t += 60 * 60 * 1000;
  }
  return fromMs + REVERIFY_MAX_DAYS * 86_400_000 + 10 * 60 * 60 * 1000;
}

export function isReverificationDue(channel: PhoneChannel, now: number): boolean {
  if (channel.forwardingLostAt != null) return false;
  const last = channel.verification.lastVerifiedAt ?? channel.verification.verifiedAt;
  if (last == null) return false;
  if (channel.verification.nextCheckAt != null) return now >= channel.verification.nextCheckAt;
  return now - last >= REVERIFY_MAX_DAYS * 86_400_000;
}

export function phoneTileStatus(
  channel: PhoneChannel,
  now = Date.now(),
): "working" | "action" | "err" | "off" {
  if (channel.forwardingLostAt != null) return "err";
  if (channel.verification.verifiedAt != null && !isReverificationDue(channel, now)) return "working";
  if (channel.verification.verifiedAt != null && isReverificationDue(channel, now)) return "action";
  if (channel.skippedAt != null || channel.verification.verifiedAt == null) return "action";
  return "off";
}

export function derivePhoneStep(channel: PhoneChannel): PhoneStep {
  if (channel.forwardingLostAt != null) return "lost";
  if (channel.surfaceStep) return channel.surfaceStep;
  if (channel.path === "new-number") return "number";
  if (channel.prepaidBlocked) return "repair";
  const outcome = channel.verification.outcome;
  if (channel.verification.status === "calling" || channel.verification.status === "retrying") {
    return "verify";
  }
  if (outcome != null) return isSuccessOutcome(outcome) ? "done" : "result";
  if (channel.voicemailConflictAcknowledgedAt != null) return "code";
  return "path";
}

export const REPAIR_LADDER = ["shorter", "interrogate", "erase", "human", "prepaid"] as const;
export type RepairRung = (typeof REPAIR_LADDER)[number];

/** The string the owner actually dials on a given repair rung. */
export function codeForRepairRung(channel: PhoneChannel, rung: number): string {
  const condition = resolvedConditions(channel)[channel.currentCodeIndex] ?? channel.condition;
  if (rung === 1) return shorterForwardingCode(channel);
  if (rung === 2) return interrogateCodeFor(condition);
  if (rung === 3) return CLEAR_ALL_FORWARDING;
  return forwardingCode(channel);
}

export function scopeFromChoice(choice: "miss" | "no-reply" | "all"): ForwardCondition[] {
  if (choice === "miss") return ["no-reply", "busy", "unreachable"];
  if (choice === "all") return ["unconditional"];
  return ["no-reply"];
}
