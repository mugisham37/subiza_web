import { ACTIVATION_STEPS, type ActivationStep } from "@subiza/domain";

export const STEP_PATH = {
  business: "business",
  hours: "hours",
  prices: "prices",
  voice: "voice",
  call: "call",
  review: "review",
  escalation: "escalation",
  phone: "phone",
  scope: "scope",
} as const satisfies Record<ActivationStep, string>;

export function isActivationStep(value: string): value is ActivationStep {
  return (ACTIVATION_STEPS as readonly string[]).includes(value);
}

export function hrefFor(step: ActivationStep): `/activate/${ActivationStep}` {
  return `/activate/${step}`;
}

export function nextAfter(step: ActivationStep): ActivationStep | "home" {
  const index = ACTIVATION_STEPS.indexOf(step);
  return ACTIVATION_STEPS[index + 1] ?? "home";
}

export function prevOf(step: ActivationStep): ActivationStep | null {
  const index = ACTIVATION_STEPS.indexOf(step);
  return index > 0 ? (ACTIVATION_STEPS[index - 1] ?? null) : null;
}
