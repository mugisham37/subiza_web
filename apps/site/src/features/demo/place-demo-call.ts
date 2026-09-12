"use server";

import { ENTRY_COOKIE, ENTRY_PHONE_COOKIE, hostCookie } from "@subiza/auth-tenant";
import { parseRwandaPhone } from "@subiza/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkRateLimit, recordDemo, rememberIdempotency } from "./store";

export type DemoOutcome =
  | "ringing"
  | "answered"
  | "rate-limited"
  | "failed"
  | "not-rwandan"
  | "offline";

export async function placeDemoCall(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "rw";
  const honey = String(formData.get("company") ?? "").trim();
  const raw = String(formData.get("phone") ?? "");
  const idem = `${parseRwandaPhone(raw) ?? raw}:${new Date().toISOString().slice(0, 10)}`;

  if (honey) {
    redirect(`/${locale}/heard/failed`);
  }

  const e164 = parseRwandaPhone(raw);
  if (!e164) {
    redirect(`/${locale}/heard/not-rwandan`);
  }

  if (!rememberIdempotency(idem)) {
    redirect(`/${locale}/heard/ringing`);
  }

  const ip = "public";
  const limit = checkRateLimit(e164, ip);
  if (!limit.ok) {
    redirect(`/${locale}/heard/rate-limited`);
  }

  recordDemo(e164, ip);
  const jar = await cookies();
  jar.set(ENTRY_COOKIE, "demo", hostCookie(30 * 60));
  jar.set(ENTRY_PHONE_COOKIE, e164, hostCookie(30 * 60));
  redirect(`/${locale}/heard/ringing`);
}

export async function submitContact(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "rw";
  if (String(formData.get("company") ?? "").trim()) {
    redirect(`/${locale}/contact`);
  }
  redirect(`/${locale}/contact/sent`);
}

export async function submitDataRequest(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "rw";
  if (String(formData.get("company") ?? "").trim()) {
    redirect(`/${locale}/data-request`);
  }
  redirect(`/${locale}/data-request/sent`);
}

export async function submitPilot(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "rw";
  if (String(formData.get("company") ?? "").trim()) {
    redirect(`/${locale}`);
  }
  redirect(`/${locale}/contact/sent`);
}
