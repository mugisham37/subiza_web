import { detectRwandaNetwork, type TenantCapability, type TenantId } from "@subiza/core";
import {
  canFireActivated,
  emptyCursor,
  emptyGoLive,
  emptyKnowledge,
  emptyChannels,
  emptyPhoneChannel,
  emptyTestCall,
  emptyVoiceSelection,
  type ActivationCursor,
  type ActivationStep,
  type TenantEvent,
  type AgentConfig,
  type EscalationRota,
  type GoLive,
  type GoLiveRung,
  type Knowledge,
  type MessagingChannels,
  type PhoneChannel,
  type PriceRow,
  type TemplateKind,
  type TestCall,
  type TestCallRoute,
  type TestCallState,
  type TenantDocuments,
  type TranscriptTurn,
  type VoiceSelection,
  applyCorrection,
  applyTemplate,
  applyVerificationOutcome,
  confirmPrices,
  deriveStep,
  dueResumeAction,
  isSuccessOutcome,
  markTurnViewed,
  normalizePhoneChannel,
  observationForForce,
  outcomeFromObservation,
  propagationRetry,
  stepSatisfied,
  wizardComplete,
  ACTIVATION_STEPS,
  type AfterHoursPolicy,
  type LibraryVoiceId,
  type NoAnswerFallback,
  type VerificationOutcome,
  type WeekGrid,
} from "@subiza/domain";
import { writeAudit } from "./audit";
import type { TenantContext } from "./context";
import { getTenant, requireGrant } from "./dal";
import { newEntityId } from "./ids";
import { getStore } from "./store";

export const TEST_SPEND_CEILING_RWF = 2_000;
export const TEST_CALL_RATE_RWF_PER_MIN = 50;
export const INBOUND_TEST_NUMBER = "0788 000 113";
export const SUBIZA_FORWARD_NUMBER = "250788456123";

export type TenantBundle = {
  agent: AgentConfig | null;
  knowledge: Knowledge | null;
  voice: VoiceSelection | null;
  testCall: TestCall | null;
  inFlightCallId: string | null;
  escalation: EscalationRota | null;
  phone: PhoneChannel | null;
  channels: MessagingChannels | null;
  goLive: GoLive;
  cursor: ActivationCursor;
  activatedAt: number | null;
  spendTestRwf: number;
  lastCallEndedAt: number | null;
  inboundNumber: string;
  corrections: number;
  lastSeenAt: number | null;
  resumeNudgesSent: number;
};

export function emptyBundle(language: "rw" | "en"): TenantBundle {
  return {
    agent: null,
    knowledge: emptyKnowledge(),
    voice: emptyVoiceSelection(language),
    testCall: null,
    inFlightCallId: null,
    escalation: null,
    phone: emptyPhoneChannel(SUBIZA_FORWARD_NUMBER),
    channels: emptyChannels(),
    goLive: emptyGoLive(),
    cursor: emptyCursor(),
    activatedAt: null,
    spendTestRwf: 0,
    lastCallEndedAt: null,
    inboundNumber: INBOUND_TEST_NUMBER,
    corrections: 0,
    lastSeenAt: null,
    resumeNudgesSent: 0,
  };
}

export function bundleOf(ctx: TenantContext): TenantBundle {
  const store = getStore();
  const existing = store.documents.get(ctx.tenantId);
  if (existing) return existing;
  const tenant = getTenant(ctx);
  const language = tenant.language === "en" ? "en" : "rw";
  const created = emptyBundle(language);
  store.documents.set(ctx.tenantId, created);
  return created;
}

export function documentsOf(ctx: TenantContext): TenantDocuments {
  const bundle = bundleOf(ctx);
  return {
    agent: bundle.agent,
    knowledge: bundle.knowledge,
    voice: bundle.voice,
    testCall: bundle.testCall,
    escalation: bundle.escalation,
    phone: bundle.phone,
    channels: bundle.channels,
    goLive: bundle.goLive,
  };
}

export function emit(
  ctx: TenantContext,
  event: TenantEvent,
  capability: TenantCapability = "completeSignupAndActivation",
): void {
  getStore().activationEvents.push({ tenantId: ctx.tenantId, at: Date.now(), event });
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: event.name,
    capability,
    outcome: "allowed",
    before: null,
    after: event,
    reason: null,
  });
}

function clearResume(bundle: TenantBundle): void {
  if (bundle.cursor.resumedFrom) {
    bundle.cursor = { ...bundle.cursor, resumedFrom: null };
  }
}

export function markStarted(ctx: TenantContext, language: string, entry: string): void {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  const bundle = bundleOf(ctx);
  const now = Date.now();
  if (bundle.cursor.startedAt === null) {
    bundle.cursor = { ...bundle.cursor, startedAt: now };
    emit(ctx, { name: "activation.started", language, entry });
  } else if (
    bundle.lastSeenAt != null &&
    now - bundle.lastSeenAt >= 3_600_000 &&
    bundle.cursor.resumedFrom === null &&
    !wizardComplete(documentsOf(ctx), bundle.cursor.skipSet)
  ) {
    bundle.cursor = { ...bundle.cursor, resumedFrom: deriveStep(documentsOf(ctx), bundle.cursor.skipSet) };
  }
  bundle.lastSeenAt = now;
}

export function forceResume(ctx: TenantContext): void {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  const bundle = bundleOf(ctx);
  bundle.cursor = {
    ...bundle.cursor,
    resumedFrom: deriveStep(documentsOf(ctx), bundle.cursor.skipSet),
  };
}

export function dueActivationResume(ctx: TenantContext, now = Date.now()) {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  const bundle = bundleOf(ctx);
  if (!bundle.cursor.startedAt || wizardComplete(documentsOf(ctx), bundle.cursor.skipSet)) {
    return null;
  }
  return dueResumeAction(bundle.cursor.startedAt, now, bundle.resumeNudgesSent);
}

export function recordResumeNudge(ctx: TenantContext, now = Date.now()): void {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  const due = dueActivationResume(ctx, now);
  if (!due) return;
  const bundle = bundleOf(ctx);
  if (due === "human") {
    emit(ctx, {
      name: "activation.abandoned",
      lastStep: deriveStep(documentsOf(ctx), bundle.cursor.skipSet),
      durationMs: now - (bundle.cursor.startedAt ?? now),
      completedSteps: completedStepCount(ctx),
    });
    return;
  }
  bundle.resumeNudgesSent += 1;
}

function completedStepCount(ctx: TenantContext): number {
  const bundle = bundleOf(ctx);
  const docs = documentsOf(ctx);
  return ACTIVATION_STEPS.filter((step) => stepSatisfied(step, docs, bundle.cursor.skipSet)).length;
}

export function markStepViewed(ctx: TenantContext, step: ActivationStep): void {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  emit(ctx, { name: "activation.step_viewed", step, durationMs: null });
}

export function skipStep(ctx: TenantContext, step: ActivationStep): void {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  if (step === "escalation") {
    throw Object.assign(new Error("blocking"), { code: "blocking" as const });
  }
  const bundle = bundleOf(ctx);
  if (!bundle.cursor.skipSet.includes(step)) {
    bundle.cursor = { ...bundle.cursor, skipSet: [...bundle.cursor.skipSet, step] };
  }
  clearResume(bundle);
  if (step === "prices" && bundle.knowledge) {
    bundle.knowledge = { ...bundle.knowledge, priceSource: "skipped", pricesConfirmedAt: Date.now() };
  }
  if (step === "hours" && bundle.agent) {
    bundle.agent = { ...bundle.agent, hoursConfirmedAt: Date.now() };
  }
  if (step === "voice" && bundle.voice) {
    bundle.voice = { ...bundle.voice, confirmedAt: Date.now(), voiceId: bundle.voice.voiceId ?? "warm-female" };
  }
  if (step === "phone" && bundle.phone) {
    bundle.phone = { ...bundle.phone, skippedAt: Date.now() };
  }
  if (step === "call" || step === "review") {
    /* skip does not activate */
  }
  emit(ctx, { name: "activation.step_skipped", step, durationMs: null });
}

export function seedFromTemplate(
  ctx: TenantContext,
  template: Parameters<typeof applyTemplate>[0],
  otherDescription: string | null,
): void {
  requireGrant(ctx, "configureAgentPersona", "write", "full");
  requireGrant(ctx, "editKnowledgeBase", "write", "full");
  const tenant = getTenant(ctx);
  const seeded = applyTemplate(template, tenant.name);
  const bundle = bundleOf(ctx);
  bundle.agent = {
    ...seeded.agent,
    otherDescription: template.kind === "generic" ? otherDescription : null,
  };
  bundle.knowledge = {
    ...seeded.knowledge,
    prices: bundle.knowledge?.prices ?? [],
    pricesConfirmedAt: bundle.knowledge?.pricesConfirmedAt ?? null,
    priceSource: bundle.knowledge?.priceSource ?? null,
  };
  if (bundle.voice) {
    bundle.voice = { ...bundle.voice, voiceId: template.suggestedVoice };
  }
  clearResume(bundle);
  emit(ctx, { name: "activation.template_selected", kind: template.kind });
  emit(ctx, { name: "activation.step_completed", step: "business", durationMs: null });
}

export function saveHours(ctx: TenantContext, hours: WeekGrid, afterHours: AfterHoursPolicy): void {
  requireGrant(ctx, "configureAgentPersona", "write", "full");
  const bundle = bundleOf(ctx);
  if (!bundle.agent) throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  bundle.agent = { ...bundle.agent, hours, afterHours, hoursConfirmedAt: Date.now() };
  clearResume(bundle);
  emit(ctx, { name: "activation.step_completed", step: "hours", durationMs: null });
}

export function savePrices(
  ctx: TenantContext,
  prices: readonly PriceRow[],
  method: "photo" | "type" | "import" | "skipped",
  rowsEdited: number,
): void {
  requireGrant(ctx, "editKnowledgeBase", "write", "full");
  const bundle = bundleOf(ctx);
  const base = bundle.knowledge ?? emptyKnowledge();
  bundle.knowledge = { ...confirmPrices(base, prices, Date.now()), priceSource: method };
  clearResume(bundle);
  emit(ctx, {
    name: "activation.price_extraction",
    method,
    rowsExtracted: prices.length,
    rowsEdited,
    accepted: true,
  });
  emit(ctx, { name: "activation.step_completed", step: "prices", durationMs: null });
}

export function previewVoice(ctx: TenantContext, voice: LibraryVoiceId): void {
  requireGrant(ctx, "selectLibraryVoice", "write", "full");
  const bundle = bundleOf(ctx);
  emit(ctx, { name: "activation.voice_previewed", voice, language: bundle.voice?.language ?? "rw" });
}

export function saveVoice(ctx: TenantContext, voice: LibraryVoiceId): void {
  requireGrant(ctx, "selectLibraryVoice", "write", "full");
  const bundle = bundleOf(ctx);
  const language = bundle.voice?.language ?? "rw";
  bundle.voice = { voiceId: voice, language, confirmedAt: Date.now(), cloneOffered: false };
  clearResume(bundle);
  emit(ctx, { name: "activation.voice_selected", voice, language });
  emit(ctx, { name: "activation.step_completed", step: "voice", durationMs: null });
}

function verifiedE164(ctx: TenantContext): string {
  const tenant = getTenant(ctx);
  const person = getStore().people.get(tenant.ownerPersonId);
  if (!person) throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  return person.e164;
}

export function destinationForTestCall(ctx: TenantContext): string {
  requireGrant(ctx, "runTestConversation", "write", "full");
  return verifiedE164(ctx);
}

function remainingCeiling(bundle: TenantBundle): number {
  return TEST_SPEND_CEILING_RWF - bundle.spendTestRwf;
}

export function requestTestCall(
  ctx: TenantContext,
  route: TestCallRoute,
  forceState?: TestCallState,
): TestCall {
  requireGrant(ctx, "runTestConversation", "write", "full");
  const bundle = bundleOf(ctx);
  if (bundle.inFlightCallId) {
    throw Object.assign(new Error("in-flight"), { code: "in-flight" as const });
  }
  if (remainingCeiling(bundle) < TEST_CALL_RATE_RWF_PER_MIN) {
    const call = {
      ...emptyTestCall(route),
      id: newEntityId("tst"),
      status: "rate-limited" as const,
      retryAfterMs: 8 * 60 * 1000,
    };
    bundle.testCall = call;
    return call;
  }
  if (forceState === "platform-outage" || forceState === "offline" || forceState === "carrier-failed") {
    const call = { ...emptyTestCall(route), id: newEntityId("tst"), status: forceState };
    bundle.testCall = call;
    emit(ctx, { name: "activation.test_call_requested", channel: route, attempt: 1 });
    return call;
  }
  const call: TestCall = {
    ...emptyTestCall(route),
    id: newEntityId("tst"),
    status: route === "inbound" ? "ready" : route === "browser" ? "live" : "ringing",
    startedAt: Date.now(),
  };
  bundle.testCall = call;
  if (route !== "inbound") bundle.inFlightCallId = call.id;
  emit(ctx, { name: "activation.test_call_requested", channel: route, attempt: 1 });
  return call;
}

export function advanceTestCall(ctx: TenantContext, next: TestCallState): TestCall {
  requireGrant(ctx, "runTestConversation", "write", "full");
  const bundle = bundleOf(ctx);
  const call = bundle.testCall;
  if (!call) throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  if (next === "voicemail-detected" || next === "no-answer" || next === "carrier-failed") {
    bundle.inFlightCallId = null;
    bundle.lastCallEndedAt = Date.now();
    bundle.spendTestRwf += Math.ceil(TEST_CALL_RATE_RWF_PER_MIN / 6);
    bundle.testCall = { ...call, status: next, endedAt: Date.now(), durationSeconds: 8 };
    return bundle.testCall;
  }
  if (next === "live") {
    bundle.testCall = { ...call, status: "live" };
    return bundle.testCall;
  }
  if (next === "ended") {
    return completeTestCall(ctx, scriptedTurns(ctx));
  }
  bundle.testCall = { ...call, status: next };
  return bundle.testCall;
}

function scriptedTurns(ctx: TenantContext): TranscriptTurn[] {
  const tenant = getTenant(ctx);
  const prices = bundleOf(ctx).knowledge?.prices.filter((row) => row.amount !== null) ?? [];
  const first = prices[0];
  const quote = first ? `${first.name} · ${first.amount}` : null;
  return [
    {
      id: "trn_ai_1",
      speaker: "ai",
      text: `Muraho, murakaza neza kwa ${tenant.name}. Nabafasha nte?`,
      translation: `Hello, welcome to ${tenant.name}. How can I help you?`,
      atSeconds: 2,
      interim: false,
      asrConfidence: 0.94,
      sourceKind: "rule",
      sourceLabel: "Greeting",
      vote: null,
      correctedText: null,
    },
    {
      id: "trn_you_1",
      speaker: "human",
      text: "Ni angahe ku mfuruka?",
      translation: "How much for braids?",
      atSeconds: 8,
      interim: false,
      asrConfidence: 0.88,
      sourceKind: null,
      sourceLabel: null,
      vote: null,
      correctedText: null,
    },
    {
      id: "trn_ai_2",
      speaker: "ai",
      text: first
        ? `${first.name} ni ${first.amount} amafaranga.`
        : "Sinabonye igiciro cy'iyo serivisi. Nabahamagara umuntu.",
      translation: first ? `${first.name} is ${first.amount} francs.` : "I don't have that price. I'll fetch a person.",
      atSeconds: 12,
      interim: false,
      asrConfidence: 0.91,
      sourceKind: first ? "price" : "unknown",
      sourceLabel: quote,
      vote: null,
      correctedText: null,
    },
    {
      id: "trn_ai_3",
      speaker: "ai",
      text: "Ku wa gatandatu dufunga saa kumi n'ebyiri.",
      translation: "On Saturday we close at six.",
      atSeconds: 22,
      interim: false,
      asrConfidence: 0.61,
      sourceKind: "hours",
      sourceLabel: "Saturday",
      vote: null,
      correctedText: null,
    },
  ];
}

export function completeTestCall(ctx: TenantContext, turns: readonly TranscriptTurn[]): TestCall {
  requireGrant(ctx, "runTestConversation", "write", "full");
  const bundle = bundleOf(ctx);
  const call = bundle.testCall ?? emptyTestCall();
  const duration = 47;
  const spend = Math.ceil((duration / 60) * TEST_CALL_RATE_RWF_PER_MIN);
  bundle.spendTestRwf += spend;
  bundle.inFlightCallId = null;
  bundle.lastCallEndedAt = Date.now();
  const pricesQuoted = turns
    .filter((turn) => turn.sourceKind === "price" && turn.sourceLabel)
    .map((turn) => turn.sourceLabel as string);
  bundle.testCall = {
    ...call,
    id: call.id || newEntityId("tst"),
    status: "ended",
    endedAt: Date.now(),
    durationSeconds: duration,
    turns: [...turns],
    pricesQuoted,
    spendRwf: spend,
  };
  emit(ctx, {
    name: "activation.test_call_completed",
    durationSeconds: duration,
    turns: turns.length,
  });
  return bundle.testCall;
}

export function viewTranscript(ctx: TenantContext): { activated: boolean } {
  requireGrant(ctx, "runTestConversation", "write", "full");
  const bundle = bundleOf(ctx);
  if (!bundle.testCall || bundle.testCall.status !== "ended") {
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  bundle.testCall = markTurnViewed(bundle.testCall, Date.now());
  emit(ctx, { name: "activation.step_completed", step: "review", durationMs: null });
  return { activated: fireActivated(ctx) };
}

function fireActivated(ctx: TenantContext): boolean {
  const bundle = bundleOf(ctx);
  if (bundle.activatedAt !== null) return true;
  if (!bundle.testCall || !canFireActivated(bundle.testCall)) return false;
  const tenant = getTenant(ctx);
  bundle.activatedAt = Date.now();
  emit(ctx, {
    name: "tenant.activated",
    timeSinceSignupMs: Date.now() - tenant.createdAt,
    stepsCompleted: 6,
    corrections: bundle.corrections,
  });
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: "tenant.activated",
    capability: "completeSignupAndActivation",
    outcome: "allowed",
    before: { activated: false },
    after: { activated: true },
    reason: "transcript-viewed",
  });
  return true;
}

export function saveCorrection(ctx: TenantContext, turnId: string, correctedText: string): void {
  requireGrant(ctx, "editKnowledgeBase", "write", "full");
  requireGrant(ctx, "configureAgentPersona", "write", "full");
  const bundle = bundleOf(ctx);
  const turn = bundle.testCall?.turns.find((row) => row.id === turnId);
  if (!turn || !bundle.agent || !bundle.knowledge) {
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  const result = applyCorrection({
    turn,
    correctedText,
    knowledge: bundle.knowledge,
    agent: bundle.agent,
  });
  bundle.knowledge = result.knowledge;
  bundle.agent = result.agent;
  bundle.corrections += 1;
  if (bundle.testCall) {
    bundle.testCall = {
      ...bundle.testCall,
      turns: bundle.testCall.turns.map((row) =>
        row.id === turnId ? { ...row, correctedText, vote: "down" } : row,
      ),
    };
  }
  for (const target of result.targets) {
    emit(ctx, { name: "activation.correction_made", target });
  }
}

export function saveEscalation(ctx: TenantContext, primaryE164: string, noAnswer: NoAnswerFallback): void {
  requireGrant(ctx, "configureEscalationRules", "write", "full");
  const bundle = bundleOf(ctx);
  bundle.escalation = { primaryE164, noAnswer, confirmedAt: Date.now() };
  emit(ctx, { name: "activation.step_completed", step: "escalation", durationMs: null });
}

export function verifyForwarding(ctx: TenantContext, forceState?: VerificationOutcome): PhoneChannel {
  requireGrant(ctx, "completeSignupAndActivation", "write", "full");
  const bundle = bundleOf(ctx);
  const phone = normalizePhoneChannel(bundle.phone ?? emptyPhoneChannel(SUBIZA_FORWARD_NUMBER), SUBIZA_FORWARD_NUMBER);
  const now = Date.now();
  const owner = verifiedE164(ctx);
  const observation = observationForForce(forceState ?? "diverted", phone.subizaNumber, owner, now);
  const outcome = outcomeFromObservation(observation, phone.subizaNumber);
  emit(ctx, { name: "phone.verification_attempted", attempt: phone.verification.attempts + 1 });
  let next = applyVerificationOutcome(phone, outcome, observation, now);
  if (outcome === "not-diverted") {
    const decision = propagationRetry({
      attempts: next.verification.attempts,
      lastAttemptAt: next.verification.lastAttemptAt,
      lastOutcome: outcome,
      now,
    });
    if (decision.action !== "report") {
      next = { ...next, verification: { ...next.verification, status: "retrying" } };
    }
  }
  bundle.phone = next;
  emit(ctx, { name: "phone.verification_result", outcome });
  if (next.verification.callerIdSurvived != null) {
    emit(ctx, { name: "phone.caller_id_preserved", preserved: next.verification.callerIdSurvived });
  }
  if (isSuccessOutcome(outcome)) {
    emit(ctx, {
      name: "activation.forwarding_verified",
      network: detectRwandaNetwork(owner),
      attempts: next.verification.attempts,
      method: "verification-call",
    });
    emit(ctx, { name: "activation.step_completed", step: "phone", durationMs: null });
  }
  return next;
}

export function setGoLive(ctx: TenantContext, rung: GoLiveRung): GoLive {
  requireGrant(ctx, "takeAgentLiveOrPause", "write", "full");
  const bundle = bundleOf(ctx);
  if (!bundle.escalation) {
    throw Object.assign(new Error("blocking"), { code: "blocking" as const });
  }
  bundle.goLive = { rung, chosenAt: Date.now(), pausedAt: null };
  emit(ctx, { name: "activation.golive_scope_set", scope: rung });
  emit(ctx, { name: "activation.step_completed", step: "scope", durationMs: null });
  return bundle.goLive;
}

export function pauseLive(ctx: TenantContext): GoLive {
  requireGrant(ctx, "takeAgentLiveOrPause", "write", "full");
  const bundle = bundleOf(ctx);
  bundle.goLive = { ...bundle.goLive, pausedAt: Date.now(), rung: "sandbox" };
  return bundle.goLive;
}

export function currentStep(ctx: TenantContext): ActivationStep {
  const bundle = bundleOf(ctx);
  return deriveStep(documentsOf(ctx), bundle.cursor.skipSet);
}

export function eventsFor(tenantId: TenantId): TenantEvent[] {
  return getStore()
    .activationEvents.filter((row) => row.tenantId === tenantId)
    .map((row) => row.event);
}

export { verifiedE164 };

export type { TemplateKind };
