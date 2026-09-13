import type { ActivationStep } from "./cursor";

/** 1h, 24h, 72h — three nudges, then a human. */
export const RESUME_NUDGE_AT_MS = [3_600_000, 86_400_000, 259_200_000] as const;
export const HUMAN_HANDOFF_AT_MS = 30 * 86_400_000;
export const RESUME_GAP_MS = 3_600_000;

export type ResumeNudgeChannel = "sms" | "whatsapp" | "human";

export function resumeNudgeChannel(index: number): Exclude<ResumeNudgeChannel, "human"> {
  return index === 0 ? "sms" : "whatsapp";
}

export function dueResumeAction(
  startedAt: number,
  now: number,
  nudgesSent: number,
): ResumeNudgeChannel | null {
  const elapsed = now - startedAt;
  if (elapsed >= HUMAN_HANDOFF_AT_MS) return "human";
  if (nudgesSent >= RESUME_NUDGE_AT_MS.length) return null;
  const nextAt = RESUME_NUDGE_AT_MS[nudgesSent];
  if (nextAt !== undefined && elapsed >= nextAt) return resumeNudgeChannel(nudgesSent);
  return null;
}

export const RESUME_LABEL: Record<ActivationStep, string> = {
  business: "resumeBusiness",
  hours: "resumeHours",
  prices: "resumePrices",
  voice: "resumeVoice",
  call: "resumeCall",
  review: "resumeReview",
  escalation: "resumeEscalation",
  phone: "resumePhone",
  scope: "resumeScope",
};
