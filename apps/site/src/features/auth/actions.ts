"use server";

import {
  createAccount,
  deletePreauth,
  DEVICE_COOKIE,
  ENTRY_COOKIE,
  hostCookie,
  membershipsFor,
  opaqueId,
  openRecovery,
  PREAUTH_COOKIE,
  readPreauth,
  sendCode,
  SESSION_COOKIE,
  setStep,
  signInExisting,
  updatePreauth,
  verifyCode,
} from "@subiza/auth-tenant";
import type { BusinessType, DeliveryChannel, EntryKind } from "@subiza/auth-tenant";
import { asTenantId } from "@subiza/core";
import { cookies, headers } from "next/headers";
import { redirect as nextRedirect } from "next/navigation";

function redirect(path: string): never {
  nextRedirect(path as never);
}

function localeOf(form: FormData): "rw" | "en" {
  return form.get("locale") === "en" ? "en" : "rw";
}

function modeOf(form: FormData): "start" | "signin" {
  return form.get("mode") === "signin" ? "signin" : "start";
}

function base(locale: string, mode: "start" | "signin"): string {
  return `/${locale}/${mode}`;
}

async function trustedIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  const hop = forwarded.split(",")[0]?.trim();
  return hop || "127.0.0.1";
}

async function deviceId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;
  const next = opaqueId(16);
  jar.set(DEVICE_COOKIE, next, hostCookie(60 * 60 * 24 * 365));
  return next;
}

async function preauthId(): Promise<string | undefined> {
  return (await cookies()).get(PREAUTH_COOKIE)?.value;
}

export async function requestCode(form: FormData) {
  const locale = localeOf(form);
  const mode = modeOf(form);
  if (String(form.get("company") ?? "").trim()) {
    redirect(`${base(locale, mode)}`);
  }
  const jar = await cookies();
  const entryRaw = jar.get(ENTRY_COOKIE)?.value;
  let entry: EntryKind = "landing";
  if (entryRaw === "demo" || entryRaw === "referral" || entryRaw === "invite" || entryRaw === "field") {
    entry = entryRaw;
  }
  const existing = await preauthId();
  const remembered = existing ? readPreauth(existing)?.e164 : undefined;
  const formEntry = form.get("entry");
  if (formEntry === "demo" || formEntry === "referral" || formEntry === "invite" || formEntry === "field") {
    entry = formEntry;
  }
  const result = sendCode({
    phone: String(form.get("phone") ?? "") || remembered || "",
    ip: await trustedIp(),
    device: await deviceId(),
    locale,
    entry,
    channel: (form.get("channel") as DeliveryChannel | null) ?? "sms",
    ...(existing ? { preauthId: existing } : {}),
  });

  if (!result.ok) {
    if (result.reason === "rate-limited") redirect(`${base(locale, mode)}/blocked`);
    jar.set("subiza_auth_err", result.reason, hostCookie(60));
    if (existing && (result.reason === "cooldown" || result.reason === "circuit" || result.reason === "voice-gate")) {
      redirect(`${base(locale, mode)}/code`);
    }
    redirect(`${base(locale, mode)}`);
  }

  jar.set(PREAUTH_COOKIE, result.preauth.id, hostCookie(30 * 60));
  jar.set("subiza_auth_err", "", { ...hostCookie(0), maxAge: 0 });
  redirect(`${base(locale, mode)}/code`);
}

export async function submitCode(form: FormData) {
  const locale = localeOf(form);
  const mode = modeOf(form);
  const id = await preauthId();
  if (!id) redirect(`${base(locale, mode)}`);
  const result = verifyCode(id, String(form.get("code") ?? "").replace(/\D/g, ""));
  const jar = await cookies();
  if (!result.ok) {
    jar.set("subiza_auth_err", result.reason, hostCookie(60));
    redirect(`${base(locale, mode)}/code`);
  }

  jar.set("subiza_auth_err", "", { ...hostCookie(0), maxAge: 0 });
  if (result.branch === "signup") {
    setStep(id, "profile");
    redirect(`${base(locale, "start")}/name`);
  }
  if (result.branch === "invite") {
    const invited = readPreauth(id);
    if (invited?.inviteTenantId) {
      const sessionId = signInExisting(invited.e164, invited.inviteTenantId);
      deletePreauth(id);
      jar.set(PREAUTH_COOKIE, "", { ...hostCookie(0), maxAge: 0 });
      jar.set(SESSION_COOKIE, sessionId, hostCookie(14 * 24 * 60 * 60));
    }
    redirect(`/${locale}/start/done`);
  }
  if (result.branch === "recycled") {
    setStep(id, "recycled");
    redirect(`/${locale}/recover/recycled`);
  }
  if (result.branch === "many") {
    setStep(id, "choose");
    redirect(`${base(locale, mode)}/choose`);
  }

  const pre = readPreauth(id);
  const seats = pre ? membershipsFor(pre.e164) : [];
  const first = seats[0];
  if (pre && first) {
    const sessionId = signInExisting(pre.e164, first.tenantId);
    deletePreauth(id);
    jar.set(PREAUTH_COOKIE, "", { ...hostCookie(0), maxAge: 0 });
    jar.set(SESSION_COOKIE, sessionId, hostCookie(14 * 24 * 60 * 60));
    redirect(`/${locale}/start/done`);
  }
  redirect(`${base(locale, mode)}`);
}

export async function changeNumber(form: FormData) {
  const locale = localeOf(form);
  const mode = modeOf(form);
  const jar = await cookies();
  const id = await preauthId();
  if (id) deletePreauth(id);
  jar.set(PREAUTH_COOKIE, "", { ...hostCookie(0), maxAge: 0 });
  redirect(`${base(locale, mode)}`);
}

export async function saveProfile(form: FormData) {
  const locale = localeOf(form);
  const id = await preauthId();
  if (!id) redirect(`/${locale}/start`);
  const current = readPreauth(id);
  if (!current || (current.step !== "profile" && current.step !== "language" && current.step !== "consent")) {
    redirect(`/${locale}/start/code`);
  }
  const type = String(form.get("type") ?? "other");
  const businessType: BusinessType =
    type === "salon" || type === "clinic" || type === "hotel" ? type : "other";
  updatePreauth(id, {
    profile: {
      name: String(form.get("name") ?? "").trim(),
      business: String(form.get("business") ?? "").trim(),
      type: businessType,
    },
    step: "language",
  });
  redirect(`/${locale}/start/language`);
}

export async function saveLanguage(form: FormData) {
  const locale = localeOf(form);
  const id = await preauthId();
  if (!id) redirect(`/${locale}/start`);
  const current = readPreauth(id);
  if (!current?.profile || (current.step !== "language" && current.step !== "consent")) {
    redirect(`/${locale}/start/name`);
  }
  const language = String(form.get("language") ?? "rw");
  updatePreauth(id, { language, step: "consent" });
  redirect(`/${locale}/start/consent`);
}

export async function saveConsent(form: FormData) {
  const locale = localeOf(form);
  const id = await preauthId();
  if (!id) redirect(`/${locale}/start`);
  const pre = readPreauth(id);
  if (!pre?.profile || pre.step !== "consent") redirect(`/${locale}/start/name`);
  if (form.get("contract") !== "on") {
    (await cookies()).set("subiza_auth_err", "consent", hostCookie(60));
    redirect(`/${locale}/start/consent`);
  }
  const created = createAccount({
    e164: pre.e164,
    name: pre.profile.name,
    business: pre.profile.business,
    type: pre.profile.type,
    language: pre.language ?? "rw",
    marketing: form.get("marketing") === "on",
    ip: await trustedIp(),
    textVersion: "1.0",
  });
  const jar = await cookies();
  deletePreauth(id);
  jar.set(PREAUTH_COOKIE, "", { ...hostCookie(0), maxAge: 0 });
  jar.set(SESSION_COOKIE, created.sessionId, hostCookie(14 * 24 * 60 * 60));
  redirect(`/${locale}/start/done`);
}

export async function chooseWorkspace(form: FormData) {
  const locale = localeOf(form);
  const mode = modeOf(form);
  const id = await preauthId();
  if (!id) redirect(`${base(locale, mode)}`);
  const pre = readPreauth(id);
  const tenantId = String(form.get("tenant") ?? "");
  if (!pre || pre.step !== "choose" || !tenantId) redirect(`${base(locale, mode)}`);
  const sessionId = signInExisting(pre.e164, asTenantId(tenantId));
  const jar = await cookies();
  deletePreauth(id);
  jar.set(PREAUTH_COOKIE, "", { ...hostCookie(0), maxAge: 0 });
  jar.set(SESSION_COOKIE, sessionId, hostCookie(14 * 24 * 60 * 60));
  redirect(`/${locale}/start/done`);
}

export async function startRecovery(form: FormData) {
  const locale = localeOf(form);
  const kind = String(form.get("kind") ?? "delivery");
  const pre = readPreauth((await preauthId()) ?? "");
  openRecovery({
    e164: pre?.e164 ?? "unknown",
    kind: kind as "delivery" | "lost" | "changed" | "recycled" | "not-me" | "dispute",
  });
  redirect(`/${locale}/recover/sent`);
}
