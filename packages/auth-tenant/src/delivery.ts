import { isProduction } from "./env";
import { getStore } from "./store";
import type { DeliveryChannel } from "./sender";
import { senderConfig } from "./sender";

const SMS_RWF = 12;
const VOICE_RWF = 80;
const HOUR_CEILING = 4000;
const DAY_CEILING = 12000;
const VOICE_DAY_CAP = 2;

/**
 * An OTP is transactional and user-initiated. The RURA 08:00–20:00 CAT
 * bulk-SMS window and opt-out-keyword rules govern marketing, not this.
 * Night-time sign-ins must send.
 */
export function deliveryCost(channel: DeliveryChannel): number {
  return channel === "voice" ? VOICE_RWF : SMS_RWF;
}

export function recordSpend(channel: DeliveryChannel): void {
  const store = getStore();
  const cost = deliveryCost(channel);
  store.circuit.spendHourRwf += cost;
  store.circuit.spendDayRwf += cost;
  if (store.circuit.spendHourRwf >= HOUR_CEILING || store.circuit.spendDayRwf >= DAY_CEILING) {
    store.circuit.smsOpen = true;
    store.circuit.openedAt = Date.now();
    if (!store.circuit.paged) {
      store.circuit.paged = true;
      store.pages.push(`otp-spend-ceiling ${senderConfig().smsSenderId}`);
    }
  }
}

export function smsCircuitOpen(): boolean {
  return getStore().circuit.smsOpen;
}

export function pageHuman(message: string): void {
  getStore().pages.push(message);
}

export function canSendVoice(e164: string, smsSends: number, startedAt: number, now = Date.now()): boolean {
  if (smsSends < 2) return false;
  if (now - startedAt < 60_000) return false;
  const voices = [...getStore().verifications.values()].filter(
    (row) => row.e164 === e164 && row.voiceSends > 0 && now - row.createdAt < 86_400_000,
  );
  const used = voices.reduce((sum, row) => sum + row.voiceSends, 0);
  return used < VOICE_DAY_CAP;
}

export function canSendWhatsApp(startedAt: number, now = Date.now()): boolean {
  return now - startedAt >= 30_000;
}

export type SendResult = { ok: true; channel: DeliveryChannel } | { ok: false; reason: "circuit" | "voice-gate" };

export function deliverOtp(input: {
  e164: string;
  channel: DeliveryChannel;
  code: string;
  smsSends: number;
  startedAt: number;
}): SendResult {
  if (input.channel === "sms" && smsCircuitOpen()) {
    return { ok: false, reason: "circuit" };
  }
  if (input.channel === "voice" && !canSendVoice(input.e164, input.smsSends, input.startedAt)) {
    return { ok: false, reason: "voice-gate" };
  }
  recordSpend(input.channel);
  if (!isProduction()) {
    getStore().lastDevOtp = input.code;
    console.info(`[otp:test] ${input.channel} → ${input.e164} code=${input.code} via ${senderConfig().smsSenderId}`);
  }
  return { ok: true, channel: input.channel };
}

export function peekLastOtpForTests(): string {
  if (isProduction()) {
    throw new Error("OTP codes are unreadable from every surface, including tests in production");
  }
  const code = getStore().lastDevOtp;
  if (!code) throw new Error("no test OTP");
  return code;
}
