import { isAllocatedRwandaMno, parseRwandaPhone } from "@subiza/core";
import { env } from "./env";
import { generateOtp, hmacOtp, isSixDigitCode, otpEquals } from "./otp";
import { canSendVoice, canSendWhatsApp, deliverOtp, type SendResult } from "./delivery";
import { newEntityId, opaqueId } from "./ids";
import {
  numberFailCount,
  recordCodeAttempt,
  recordNumberFail,
  sendAllowed,
  verifyCodeAllowed,
  verifyNumberAllowed,
} from "./rates";
import { getStore } from "./store";
import type { DeliveryChannel } from "./sender";
import type { AuthStep, EntryKind, PreAuthRecord, VerificationRecord } from "./types";

const CODE_TTL_MS = 5 * 60 * 1000;

export type SendCodeInput = {
  phone: string;
  ip: string;
  device: string;
  locale: string;
  entry: EntryKind;
  channel?: DeliveryChannel;
  preauthId?: string;
};

export type SendCodeResult =
  | { ok: true; preauth: PreAuthRecord; retryAfterSec: number; via: DeliveryChannel }
  | { ok: false; reason: "not-rwandan" | "rate-limited" | "cooldown" | "circuit" | "voice-gate"; retryAfterSec?: number };

function parity<T>(work: () => T, minMs = 180): T {
  const started = Date.now();
  const result = work();
  if (env("VITEST") === "true") return result;
  const wait = minMs - (Date.now() - started);
  if (wait > 0) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
  }
  return result;
}

export function sendCode(input: SendCodeInput): SendCodeResult {
  return parity(() => sendCodeInner(input));
}

function sendCodeInner(input: SendCodeInput): SendCodeResult {
  const e164 = parseRwandaPhone(input.phone);
  if (!e164 || !isAllocatedRwandaMno(e164)) {
    return { ok: false, reason: "not-rwandan" };
  }

  const store = getStore();
  const existing = input.preauthId ? store.preauth.get(input.preauthId) : undefined;
  const channel = input.channel ?? "sms";

  const rate = sendAllowed({ e164, ip: input.ip, device: input.device });
  if (!rate.ok) {
    return {
      ok: false,
      reason: rate.reason === "cooldown" ? "cooldown" : "rate-limited",
      retryAfterSec: rate.retryAfterSec,
    };
  }

  const now = Date.now();
  const previous = existing ? store.verifications.get(existing.verificationId) : undefined;
  const smsSends = (previous?.smsSends ?? 0) + (channel === "sms" ? 1 : 0);
  const startedAt = previous?.createdAt ?? existing?.createdAt ?? now;

  const code = generateOtp();
  const sent: SendResult = deliverOtp({
    e164,
    channel,
    code,
    smsSends: previous?.smsSends ?? 0,
    startedAt,
  });
  if (!sent.ok) {
    return { ok: false, reason: sent.reason };
  }

  const verification: VerificationRecord = {
    id: newEntityId("ver"),
    e164,
    hmac: hmacOtp(code),
    channel,
    createdAt: now,
    expiresAt: now + CODE_TTL_MS,
    consumedAt: null,
    attempts: 0,
    smsSends,
    smsFailures: previous?.smsFailures ?? 0,
    voiceSends: (previous?.voiceSends ?? 0) + (channel === "voice" ? 1 : 0),
  };
  store.verifications.set(verification.id, verification);

  const preauth: PreAuthRecord = existing
    ? { ...existing, e164, verificationId: verification.id, step: "code" }
    : {
        id: opaqueId(32),
        e164,
        verificationId: verification.id,
        step: "code",
        entry: input.entry,
        locale: input.locale,
        inviteTenantId: null,
        profile: null,
        language: null,
        createdAt: now,
        verifyFails: 0,
      };
  store.preauth.set(preauth.id, preauth);
  return { ok: true, preauth, retryAfterSec: 30, via: channel };
}

export type VerifyResult =
  | { ok: true; preauth: PreAuthRecord; branch: "signup" | "one" | "many" | "recycled" | "invite" }
  | { ok: false; reason: "wrong" | "expired" | "burned" | "throttled" | "missing" };

export function verifyCode(preauthId: string, code: string): VerifyResult {
  const store = getStore();
  const preauth = store.preauth.get(preauthId);
  if (!preauth) return { ok: false, reason: "missing" };
  const verification = store.verifications.get(preauth.verificationId);
  if (!verification) return { ok: false, reason: "missing" };

  if (!isSixDigitCode(code)) return { ok: false, reason: "wrong" };
  if (verification.consumedAt) return { ok: false, reason: "burned" };
  if (verification.expiresAt < Date.now()) return { ok: false, reason: "expired" };
  if (!verifyNumberAllowed(preauth.e164)) return { ok: false, reason: "throttled" };
  if (preauth.verifyFails >= 6) return { ok: false, reason: "throttled" };
  if (!verifyCodeAllowed(verification.id)) return { ok: false, reason: "burned" };

  if (!otpEquals(code, verification.hmac)) {
    const attempts = recordCodeAttempt(verification.id);
    recordNumberFail(preauth.e164);
    preauth.verifyFails += 1;
    if (attempts >= 5) verification.consumedAt = Date.now();
    return { ok: false, reason: preauth.verifyFails >= 6 ? "throttled" : attempts >= 5 ? "burned" : "wrong" };
  }

  verification.consumedAt = Date.now();
  const personId = store.peopleByE164.get(preauth.e164);
  const memberships = personId
    ? [...store.members.values()].filter((row) => row.personId === personId && !row.removedAt)
    : [];
  const recycled = memberships.some((row) => store.tenants.get(row.tenantId)?.recycledSuspect);

  let branch: "signup" | "one" | "many" | "recycled" | "invite" = "signup";
  if (recycled) branch = "recycled";
  else if (preauth.inviteTenantId) branch = "invite";
  else if (memberships.length === 1) branch = "one";
  else if (memberships.length > 1) branch = "many";

  preauth.step =
    branch === "signup" ? "profile" : branch === "many" ? "choose" : branch === "recycled" ? "recycled" : "done";
  return { ok: true, preauth, branch };
}

export function readPreauth(id: string): PreAuthRecord | null {
  return getStore().preauth.get(id) ?? null;
}

export function deletePreauth(id: string): void {
  getStore().preauth.delete(id);
}

export function updatePreauth(id: string, patch: Partial<PreAuthRecord>): PreAuthRecord | null {
  const row = getStore().preauth.get(id);
  if (!row) return null;
  const next = { ...row, ...patch };
  getStore().preauth.set(id, next);
  return next;
}

export function markSmsFailure(verificationId: string): void {
  const row = getStore().verifications.get(verificationId);
  if (row) row.smsFailures += 1;
}

export function remainingCodeMs(preauthId: string): number {
  const preauth = getStore().preauth.get(preauthId);
  if (!preauth) return 0;
  const verification = getStore().verifications.get(preauth.verificationId);
  if (!verification) return 0;
  return Math.max(0, verification.expiresAt - Date.now());
}

export function failCount(e164: string): number {
  return numberFailCount(e164);
}

export function setStep(id: string, step: AuthStep): void {
  const row = getStore().preauth.get(id);
  if (row) row.step = step;
}

export function deliveryState(preauthId: string) {
  const store = getStore();
  const pre = store.preauth.get(preauthId);
  const ver = pre ? store.verifications.get(pre.verificationId) : undefined;
  const started = ver?.createdAt ?? pre?.createdAt ?? Date.now();
  const e164 = pre?.e164 ?? "";
  const smsSends = ver?.smsSends ?? 0;
  return {
    smsSends,
    via: ver?.channel ?? "sms",
    whatsappReady: canSendWhatsApp(started),
    voiceReady: canSendVoice(e164, smsSends, started),
    resendSec: Math.max(0, 30 - Math.floor((Date.now() - started) / 1000)),
  };
}

export function membershipsFor(e164: string) {
  const store = getStore();
  const personId = store.peopleByE164.get(e164);
  if (!personId) return [];
  return [...store.members.values()]
    .filter((row) => row.personId === personId && !row.removedAt)
    .map((member) => {
      const tenant = store.tenants.get(member.tenantId);
      return {
        memberId: member.id,
        tenantId: member.tenantId,
        role: member.role,
        name: tenant?.name ?? "",
        type: tenant?.type ?? "other",
      };
    });
}
