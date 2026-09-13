import { z } from "zod";
import type { AgentConfig } from "./agent-config";
import type { EscalationRota } from "./escalation";
import type { GoLive } from "./go-live";
import type { Knowledge } from "./knowledge";
import type { MessagingChannels } from "./channel";
import type { PhoneChannel } from "./phone-channel";
import { canFireActivated, type TestCall } from "./test-call";
import type { VoiceSelection } from "./voice";

export const ACTIVATION_STEPS = [
  "business",
  "hours",
  "prices",
  "voice",
  "call",
  "review",
  "escalation",
  "phone",
  "scope",
] as const;
export type ActivationStep = (typeof ACTIVATION_STEPS)[number];
export const activationStepSchema = z.enum(ACTIVATION_STEPS);

export const BLOCKING_STEP: ActivationStep = "escalation";

export const BACK_STEPS: readonly ActivationStep[] = ["hours", "prices", "voice"];

export const PARTS = {
  business: 1,
  hours: 1,
  prices: 1,
  voice: 1,
  call: 2,
  review: 2,
  escalation: 3,
  phone: 3,
  scope: 3,
} as const satisfies Record<ActivationStep, 1 | 2 | 3>;

export const activationCursorSchema = z.object({
  skipSet: z.array(activationStepSchema),
  startedAt: z.number().nullable(),
  resumedFrom: activationStepSchema.nullable(),
});
export type ActivationCursor = z.infer<typeof activationCursorSchema>;

export function emptyCursor(): ActivationCursor {
  return { skipSet: [], startedAt: null, resumedFrom: null };
}

export type TenantDocuments = {
  agent: AgentConfig | null;
  knowledge: Knowledge | null;
  voice: VoiceSelection | null;
  testCall: TestCall | null;
  escalation: EscalationRota | null;
  phone: PhoneChannel | null;
  channels: MessagingChannels | null;
  goLive: GoLive | null;
};

export function stepSatisfied(step: ActivationStep, docs: TenantDocuments, skipSet: readonly ActivationStep[]): boolean {
  if (skipSet.includes(step) && step !== BLOCKING_STEP) return true;
  switch (step) {
    case "business":
      return docs.agent?.templateKind != null;
    case "hours":
      return docs.agent?.hoursConfirmedAt != null;
    case "prices":
      return docs.knowledge?.pricesConfirmedAt != null || docs.knowledge?.priceSource === "skipped";
    case "voice":
      return docs.voice?.confirmedAt != null;
    case "call":
      return docs.testCall != null && docs.testCall.status === "ended";
    case "review":
      return docs.testCall?.transcriptViewedAt != null;
    case "escalation":
      return docs.escalation != null;
    case "phone":
      return docs.phone?.verification.verifiedAt != null || docs.phone?.skippedAt != null;
    case "scope":
      return docs.goLive?.chosenAt != null;
  }
}

export function deriveStep(docs: TenantDocuments, skipSet: readonly ActivationStep[]): ActivationStep {
  for (const step of ACTIVATION_STEPS) {
    if (!stepSatisfied(step, docs, skipSet)) return step;
  }
  return "scope";
}

export function stepIndex(step: ActivationStep): number {
  return ACTIVATION_STEPS.indexOf(step);
}

export function canVisit(
  target: ActivationStep,
  docs: TenantDocuments,
  skipSet: readonly ActivationStep[],
): boolean {
  const current = deriveStep(docs, skipSet);
  if (target === current) return true;
  if (stepIndex(target) < stepIndex(current)) {
    if (stepIndex(target) >= stepIndex("call") && !BACK_STEPS.includes(target)) {
      return stepSatisfied(target, docs, skipSet);
    }
    return true;
  }
  for (const step of ACTIVATION_STEPS) {
    if (step === target) return true;
    if (!stepSatisfied(step, docs, skipSet)) return false;
  }
  return true;
}

export function wizardComplete(docs: TenantDocuments, skipSet: readonly ActivationStep[]): boolean {
  return ACTIVATION_STEPS.every((step) => stepSatisfied(step, docs, skipSet));
}

export function tenantIsActivated(docs: TenantDocuments): boolean {
  return docs.testCall != null && canFireActivated(docs.testCall);
}
