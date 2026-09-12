import type { AuthStep } from "@subiza/auth-tenant";

export type AuthMode = "start" | "signin" | "recover";

export type RecoveryStep =
  | "recover"
  | "delivery"
  | "lost"
  | "changed"
  | "recycled"
  | "not-me"
  | "dispute"
  | "sent";

export function stepFromPath(mode: AuthMode, parts: string[] | undefined): AuthStep | RecoveryStep {
  const raw = parts?.[0];
  if (mode === "recover") {
    if (!raw) return "recover";
    if (
      raw === "delivery" ||
      raw === "lost" ||
      raw === "changed" ||
      raw === "recycled" ||
      raw === "not-me" ||
      raw === "dispute" ||
      raw === "sent"
    ) {
      return raw;
    }
    return "recover";
  }
  if (!raw) return "phone";
  if (raw === "name") return "profile";
  if (
    raw === "phone" ||
    raw === "code" ||
    raw === "profile" ||
    raw === "language" ||
    raw === "consent" ||
    raw === "done" ||
    raw === "choose" ||
    raw === "blocked" ||
    raw === "recycled"
  ) {
    return raw;
  }
  return "phone";
}

export function parseEntryKind(raw: string | undefined): "landing" | "demo" | "referral" | "invite" | "field" {
  if (raw === "demo" || raw === "referral" || raw === "invite" || raw === "field") return raw;
  return "landing";
}

export function canShowAuthStep(input: {
  mode: AuthMode;
  step: AuthStep | RecoveryStep;
  preStep: AuthStep | null;
  sessionPresent: boolean;
}): boolean {
  const { mode, step, preStep, sessionPresent } = input;
  if (mode === "recover") {
    if (step === "recycled") return preStep === "recycled";
    return true;
  }
  if (step === "phone" || step === "blocked") return true;
  if (step === "done") return sessionPresent;
  if (!preStep) return false;
  if (step === "code") return true;
  if (step === "profile") return preStep === "profile" || preStep === "language" || preStep === "consent";
  if (step === "language") return preStep === "language" || preStep === "consent";
  if (step === "consent") return preStep === "consent";
  if (step === "choose") return preStep === "choose";
  if (step === "recycled") return preStep === "recycled";
  return false;
}

export function fallbackAuthPath(locale: string, mode: AuthMode, preStep: AuthStep | null): string {
  if (mode === "recover") {
    return preStep === "recycled" ? `/${locale}/recover/recycled` : `/${locale}/recover`;
  }
  const root = `/${locale}/${mode === "signin" ? "signin" : "start"}`;
  if (preStep === "code") return `${root}/code`;
  if (preStep === "profile") return `${root}/name`;
  if (preStep === "language") return `${root}/language`;
  if (preStep === "consent") return `${root}/consent`;
  if (preStep === "choose") return `${root}/choose`;
  if (preStep === "recycled") return `/${locale}/recover/recycled`;
  return root;
}
