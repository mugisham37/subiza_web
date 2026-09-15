import { z } from "zod";
import { activationStepSchema } from "./cursor";
import { templateKindSchema } from "./agent-config";
import { testCallRouteSchema } from "./test-call";
import { goLiveRungSchema } from "./go-live";
import { libraryVoiceSchema } from "./voice";

/**
 * Atlas Flow 06 §11 — twelve instrumentation rows.
 * Emitted from server actions only. Never from a client handler.
 */
export const ACTIVATION_EVENTS = [
  "activation.started",
  "activation.step_viewed",
  "activation.step_completed",
  "activation.step_skipped",
  "activation.template_selected",
  "activation.price_extraction",
  "activation.voice_previewed",
  "activation.voice_selected",
  "activation.test_call_requested",
  "activation.test_call_completed",
  "tenant.activated",
  "activation.correction_made",
  "activation.forwarding_verified",
  "activation.golive_scope_set",
  "activation.abandoned",
] as const;
export type ActivationEventName = (typeof ACTIVATION_EVENTS)[number];

export const activationEventSchema = z.discriminatedUnion("name", [
  z.object({ name: z.literal("activation.started"), language: z.string(), entry: z.string() }),
  z.object({
    name: z.literal("activation.step_viewed"),
    step: activationStepSchema,
    durationMs: z.number().nullable(),
  }),
  z.object({
    name: z.literal("activation.step_completed"),
    step: activationStepSchema,
    durationMs: z.number().nullable(),
  }),
  z.object({
    name: z.literal("activation.step_skipped"),
    step: activationStepSchema,
    durationMs: z.number().nullable(),
  }),
  z.object({ name: z.literal("activation.template_selected"), kind: templateKindSchema }),
  z.object({
    name: z.literal("activation.price_extraction"),
    method: z.enum(["photo", "type", "import", "skipped"]),
    rowsExtracted: z.number(),
    rowsEdited: z.number(),
    accepted: z.boolean(),
  }),
  z.object({ name: z.literal("activation.voice_previewed"), voice: libraryVoiceSchema, language: z.string() }),
  z.object({ name: z.literal("activation.voice_selected"), voice: libraryVoiceSchema, language: z.string() }),
  z.object({
    name: z.literal("activation.test_call_requested"),
    channel: testCallRouteSchema,
    attempt: z.number(),
  }),
  z.object({
    name: z.literal("activation.test_call_completed"),
    durationSeconds: z.number(),
    turns: z.number(),
  }),
  z.object({
    name: z.literal("tenant.activated"),
    timeSinceSignupMs: z.number(),
    stepsCompleted: z.number(),
    corrections: z.number(),
  }),
  z.object({
    name: z.literal("activation.correction_made"),
    target: z.enum(["knowledge", "rule", "pronunciation"]),
  }),
  z.object({
    name: z.literal("activation.forwarding_verified"),
    network: z.string(),
    attempts: z.number(),
    method: z.enum(["verification-call", "skipped"]),
  }),
  z.object({ name: z.literal("activation.golive_scope_set"), scope: goLiveRungSchema }),
  z.object({
    name: z.literal("activation.abandoned"),
    lastStep: activationStepSchema,
    durationMs: z.number(),
    completedSteps: z.number(),
  }),
]);
export type ActivationEvent = z.infer<typeof activationEventSchema>;

export const PHONE_EVENTS = [
  "phone.path_chosen",
  "phone.network_detected",
  "phone.code_shown",
  "phone.verification_attempted",
  "phone.verification_result",
  "phone.caller_id_preserved",
  "phone.assisted_requested",
  "phone.forwarding_lost_detected",
  "number.provisioning_state_changed",
] as const;
export type PhoneEventName = (typeof PHONE_EVENTS)[number];

export const phoneEventSchema = z.discriminatedUnion("name", [
  z.object({ name: z.literal("phone.path_chosen"), path: z.enum(["forwarding", "new-number"]) }),
  z.object({
    name: z.literal("phone.network_detected"),
    network: z.enum(["mtn", "airtel", "unknown"]),
    correctedManually: z.boolean(),
  }),
  z.object({
    name: z.literal("phone.code_shown"),
    codeType: z.string(),
    network: z.enum(["mtn", "airtel", "unknown"]),
  }),
  z.object({ name: z.literal("phone.verification_attempted"), attempt: z.number() }),
  z.object({
    name: z.literal("phone.verification_result"),
    outcome: z.enum([
      "diverted",
      "owner-answered",
      "not-diverted",
      "diverted-no-caller-id",
      "diverted-elsewhere",
      "inconclusive",
      "unconditional",
    ]),
  }),
  z.object({ name: z.literal("phone.caller_id_preserved"), preserved: z.boolean() }),
  z.object({ name: z.literal("phone.assisted_requested"), step: z.string() }),
  z.object({ name: z.literal("phone.forwarding_lost_detected"), daysSinceLastVerified: z.number() }),
  z.object({
    name: z.literal("number.provisioning_state_changed"),
    state: z.string(),
    daysElapsed: z.number(),
  }),
]);
export type PhoneEvent = z.infer<typeof phoneEventSchema>;

export const CHANNEL_EVENTS = [
  "telegram.bot_created",
  "whatsapp.preflight_answered",
  "whatsapp.route_chosen",
  "whatsapp.embedded_signup_started",
  "whatsapp.embedded_signup_exchanged",
  "whatsapp.embedded_signup_expired",
  "whatsapp.embedded_signup_abandoned",
  "whatsapp.waiting",
  "whatsapp.display_name_resubmitted",
  "whatsapp.connected",
  "instagram.account_checked",
  "instagram.connected",
  "instagram.private_reply_recorded",
  "channel.disconnected",
  "channel.reconnected",
  "channel.onboarding_queued",
] as const;
export type ChannelEventName = (typeof CHANNEL_EVENTS)[number];

export const channelEventSchema = z.discriminatedUnion("name", [
  z.object({ name: z.literal("telegram.bot_created"), mode: z.enum(["managed", "botfather"]) }),
  z.object({
    name: z.literal("whatsapp.preflight_answered"),
    alreadyOnWa: z.boolean(),
    rdb: z.boolean(),
  }),
  z.object({ name: z.literal("whatsapp.route_chosen"), route: z.enum(["move", "coex", "other"]) }),
  z.object({ name: z.literal("whatsapp.embedded_signup_started"), version: z.literal(4) }),
  z.object({ name: z.literal("whatsapp.embedded_signup_exchanged"), ttlSeconds: z.number() }),
  z.object({ name: z.literal("whatsapp.embedded_signup_expired") }),
  z.object({
    name: z.literal("whatsapp.embedded_signup_abandoned"),
    metaScreen: z.string(),
    errorCode: z.string().nullable(),
    sessionId: z.string(),
  }),
  z.object({ name: z.literal("whatsapp.waiting") }),
  z.object({ name: z.literal("whatsapp.display_name_resubmitted") }),
  z.object({ name: z.literal("whatsapp.connected") }),
  z.object({ name: z.literal("instagram.account_checked"), professional: z.boolean() }),
  z.object({ name: z.literal("instagram.connected") }),
  z.object({ name: z.literal("instagram.private_reply_recorded"), commentId: z.string() }),
  z.object({ name: z.literal("channel.disconnected"), kind: z.string(), since: z.number() }),
  z.object({ name: z.literal("channel.reconnected"), kind: z.string() }),
  z.object({ name: z.literal("channel.onboarding_queued"), position: z.number() }),
]);
export type ChannelEvent = z.infer<typeof channelEventSchema>;

export const AGENT_EVENTS = [
  "agent.mode_toggled",
  "agent.rule_added",
  "agent.rule_edited",
  "agent.rule_disabled",
  "agent.rule_deleted",
  "agent.greeting_edited",
  "agent.manner_changed",
  "agent.contradiction_check_run",
  "agent.contradiction_resolved",
  "agent.published_with_conflict",
  "agent.published",
  "agent.reverted",
] as const;
export type AgentEventName = (typeof AGENT_EVENTS)[number];

export const agentEventSchema = z.discriminatedUnion("name", [
  z.object({ name: z.literal("agent.mode_toggled"), from: z.enum(["simple", "advanced"]), to: z.enum(["simple", "advanced"]) }),
  z.object({ name: z.literal("agent.rule_added"), category: z.string(), enforceable: z.boolean() }),
  z.object({ name: z.literal("agent.rule_edited"), category: z.string(), enforceable: z.boolean() }),
  z.object({ name: z.literal("agent.rule_disabled"), category: z.string(), enforceable: z.boolean() }),
  z.object({ name: z.literal("agent.rule_deleted"), category: z.string(), enforceable: z.boolean() }),
  z.object({ name: z.literal("agent.greeting_edited"), seconds: z.number() }),
  z.object({ name: z.literal("agent.manner_changed"), tone: z.string(), confidence: z.string() }),
  z.object({ name: z.literal("agent.contradiction_check_run"), count: z.number() }),
  z.object({ name: z.literal("agent.contradiction_resolved"), resolution: z.string() }),
  z.object({ name: z.literal("agent.published_with_conflict"), count: z.number() }),
  z.object({ name: z.literal("agent.published"), version: z.number(), ruleCount: z.number() }),
  z.object({
    name: z.literal("agent.reverted"),
    fromVersion: z.number(),
    toVersion: z.number(),
    msSincePublish: z.number(),
  }),
]);
export type AgentEvent = z.infer<typeof agentEventSchema>;
export type TenantEvent = ActivationEvent | PhoneEvent | ChannelEvent | AgentEvent;
