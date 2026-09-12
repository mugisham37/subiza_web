import {
  deliveryState,
  ENTRY_COOKIE,
  ENTRY_PHONE_COOKIE,
  failCount,
  membershipsFor,
  PREAUTH_COOKIE,
  readPreauth,
  remainingCodeMs,
  SESSION_COOKIE,
  type AuthStep,
  type EntryKind,
} from "@subiza/auth-tenant";
import { formatRwandaPhone, parseRwandaPhone } from "@subiza/core";
import { cookies } from "next/headers";
import { redirect as nextRedirect } from "next/navigation";
import {
  canShowAuthStep,
  fallbackAuthPath,
  parseEntryKind,
  stepFromPath,
  type AuthMode,
  type RecoveryStep,
} from "./gate";

export type { AuthMode, RecoveryStep } from "./gate";
export { canShowAuthStep, fallbackAuthPath, parseEntryKind, stepFromPath } from "./gate";

export type AuthModel = {
  mode: AuthMode;
  step: AuthStep | RecoveryStep;
  entry: EntryKind;
  phone: string;
  phoneDisplay: string;
  via: string;
  expiresSec: number;
  resendSec: number;
  whatsappReady: boolean;
  voiceReady: boolean;
  error: string | null;
  failCount: number;
  workspaces: { tenantId: string; name: string; role: string }[];
  name: string;
  business: string;
  language: string;
  sessionPresent: boolean;
};

export async function loadAuth(
  mode: AuthMode,
  parts: string[] | undefined,
  locale: string,
  hints: { entry?: string; phone?: string } = {},
): Promise<AuthModel> {
  const jar = await cookies();
  const pre = readPreauth(jar.get(PREAUTH_COOKIE)?.value ?? "");
  const step = stepFromPath(mode, parts);
  const sessionPresent = Boolean(jar.get(SESSION_COOKIE)?.value);
  if (
    !canShowAuthStep({
      mode,
      step,
      preStep: pre?.step ?? null,
      sessionPresent,
    })
  ) {
    nextRedirect(fallbackAuthPath(locale, mode, pre?.step ?? null) as never);
  }

  const cookiePhone = parseRwandaPhone(jar.get(ENTRY_PHONE_COOKIE)?.value ?? "") ?? "";
  const hintPhone = parseRwandaPhone(hints.phone ?? "") ?? "";
  const e164 = pre?.e164 || hintPhone || cookiePhone;
  const entry = pre?.entry ?? parseEntryKind(hints.entry || jar.get(ENTRY_COOKIE)?.value);
  const expiresMs = pre ? remainingCodeMs(pre.id) : 0;
  const delivery = pre ? deliveryState(pre.id) : null;
  const verifiedChooser = pre?.step === "choose";

  return {
    mode,
    step,
    entry,
    phone: e164,
    phoneDisplay: e164 ? formatRwandaPhone(e164) : "",
    via: delivery?.via ?? "sms",
    expiresSec: Math.ceil(expiresMs / 1000),
    resendSec: delivery?.resendSec ?? 30,
    whatsappReady: delivery?.whatsappReady ?? false,
    voiceReady: delivery?.voiceReady ?? false,
    error: jar.get("subiza_auth_err")?.value ?? null,
    failCount: pre ? failCount(pre.e164) : 0,
    workspaces: verifiedChooser
      ? membershipsFor(pre.e164).map((row) => ({
          tenantId: row.tenantId,
          name: row.name,
          role: row.role,
        }))
      : [],
    name: pre?.profile?.name ?? "",
    business: pre?.profile?.business ?? "",
    language: pre?.language ?? "rw",
    sessionPresent,
  };
}
