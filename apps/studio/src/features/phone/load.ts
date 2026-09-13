import {
  SUBIZA_FORWARD_NUMBER,
  bundleOf,
  detectPhoneNetwork,
  documentsOf,
  getTenant,
  maybeDetectSilentFailure,
  ownerNumber,
  settlePhoneVerification,
} from "@subiza/auth-tenant";
import {
  PHONE_STEPMAP,
  derivePhoneStep,
  emptyPhoneChannel,
  forwardingCodes,
  normalizePhoneChannel,
  type PhoneStep,
  type VerificationOutcome,
} from "@subiza/domain";
import { can, detectRwandaNetwork, formatRwandaPhone } from "@subiza/core";
import { headers } from "next/headers";
import { requireStudioContext } from "@/lib/session";

const FORCES = [
  "diverted",
  "owner-answered",
  "not-diverted",
  "diverted-no-caller-id",
  "diverted-elsewhere",
  "inconclusive",
  "unconditional",
] as const;

function one(search: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = search[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function loadPhone(step: PhoneStep, search: Record<string, string | string[] | undefined>) {
  const ctx = await requireStudioContext();
  if (step === "lost" || one(search, "health") === "1") {
    maybeDetectSilentFailure(ctx);
  }
  const bundle = bundleOf(ctx);
  const docs = documentsOf(ctx);
  let phone = normalizePhoneChannel(bundle.phone ?? emptyPhoneChannel(SUBIZA_FORWARD_NUMBER), SUBIZA_FORWARD_NUMBER);
  if (
    phone.network === "unknown" &&
    !phone.networkCorrectedManually &&
    can(ctx.role, "setupCallForwarding")
  ) {
    phone = detectPhoneNetwork(ctx);
  }
  const forceRaw = one(search, "force");
  const force = FORCES.includes(forceRaw as VerificationOutcome) ? (forceRaw as VerificationOutcome) : undefined;
  let redirectTo: PhoneStep | null = null;
  if (one(search, "settle") === "1") {
    phone = settlePhoneVerification(ctx, force);
    if (phone.verification.status === "retrying") {
      redirectTo = "verify";
    } else if (phone.verification.status === "settled") {
      redirectTo = "result";
    }
  }
  const ua = (await headers()).get("user-agent") ?? "";
  const platformParam = one(search, "platform");
  const platform: "ios" | "android" | "unknown" =
    platformParam === "ios" || platformParam === "android" || platformParam === "unknown"
      ? platformParam
      : /iPhone|iPad|iPod/i.test(ua)
        ? "ios"
        : /Android/i.test(ua)
          ? "android"
          : "unknown";
  const owner = ownerNumber(ctx);
  return {
    ctx,
    tenant: getTenant(ctx),
    docs,
    phone,
    step,
    derived: derivePhoneStep(phone),
    progressNow: PHONE_STEPMAP[step],
    owner,
    ownerDisplay: formatRwandaPhone(owner),
    detectedNetwork: detectRwandaNetwork(owner),
    platform,
    force,
    codes: forwardingCodes(phone),
    watch: one(search, "watch") === "1",
    retry: one(search, "retry") === "1" || phone.verification.status === "retrying",
    human: one(search, "human") === "1",
    prepaid: one(search, "prepaid") === "1" || phone.prepaidBlocked,
    rung: Number(one(search, "rung") ?? phone.repairRung),
    live: docs.goLive != null && docs.goLive.rung !== "sandbox" && docs.goLive.pausedAt === null,
    redirectTo,
  };
}
