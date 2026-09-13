"use server";

import {
  advanceTestCall,
  pauseLive,
  previewVoice,
  requestTestCall,
  saveCorrection,
  saveEscalation,
  saveHours,
  savePrices,
  saveVoice,
  seedFromTemplate,
  setGoLive,
  skipStep,
  verifyForwarding,
  viewTranscript,
} from "@subiza/auth-tenant";
import { parseRwandaPhone } from "@subiza/core";
import {
  WEEKDAYS,
  flagLowConfidence,
  newPriceId,
  salonWeek,
  type AfterHoursPolicy,
  type ActivationStep,
  type GoLiveRung,
  type LibraryVoiceId,
  type NoAnswerFallback,
  type PriceRow,
  type TemplateKind,
  type TestCallState,
  type WeekGrid,
  type Weekday,
} from "@subiza/domain";
import { businessTemplates } from "@subiza/fixtures";
import { redirect as nextRedirect } from "next/navigation";
import { requireStudioContext } from "@/lib/session";
import { hrefFor, nextAfter } from "./steps";

function redirect(path: string): never {
  nextRedirect(path as never);
}

function go(step: ActivationStep | "home"): never {
  redirect(step === "home" ? "/home" : hrefFor(step));
}

export async function saveBusiness(form: FormData) {
  const ctx = await requireStudioContext();
  const raw = String(form.get("type") ?? "salon");
  const kind = (["shop", "salon", "restaurant", "clinic", "repair", "generic"].includes(raw)
    ? raw
    : "generic") as TemplateKind;
  const other = String(form.get("other") ?? "").trim();
  seedFromTemplate(ctx, businessTemplates[kind], other || null);
  go("hours");
}

export async function saveHoursAction(form: FormData) {
  const ctx = await requireStudioContext();
  const hours = salonWeek();
  const varies = form.get("varies") === "on";
  for (const day of WEEKDAYS) {
    const closed = varies || form.get(`closed-${day}`) === "on";
    const start = String(form.get(`start-${day}`) ?? hours[day].start);
    const end = String(form.get(`end-${day}`) ?? hours[day].end);
    hours[day] = { open: !closed, start, end };
  }
  const after = (varies ? "message-only" : String(form.get("after") ?? "answer-and-message")) as AfterHoursPolicy;
  saveHours(ctx, hours as WeekGrid, after);
  go("prices");
}

function rowsFromForm(form: FormData): PriceRow[] {
  const ids = form.getAll("priceId").map(String);
  const names = form.getAll("priceName").map(String);
  const amounts = form.getAll("priceAmount").map(String);
  const rows: PriceRow[] = [];
  const count = Math.max(ids.length, names.length, amounts.length);
  for (let i = 0; i < count; i++) {
    const name = (names[i] ?? "").trim();
    if (!name) continue;
    const raw = (amounts[i] ?? "").trim();
    const amount = raw === "?" || raw === "" ? null : Number(raw.replace(/[^\d]/g, "")) || null;
    const row: PriceRow = {
      id: ids[i] || newPriceId(i),
      name,
      amount,
      currency: "RWF",
      confidence: amount === null ? 0 : 0.95,
      confirmed: true,
      escalateIfUnknown: amount === null,
    };
    rows.push(row);
  }
  return rows;
}

const EXTRACTED: PriceRow[] = [
  { id: "prc_1", name: "Braids — small", amount: 15000, currency: "RWF", confidence: 0.92, confirmed: false, escalateIfUnknown: false },
  { id: "prc_2", name: "Braids — large", amount: 10000, currency: "RWF", confidence: 0.9, confirmed: false, escalateIfUnknown: false },
  { id: "prc_3", name: "Relaxer", amount: null, currency: "RWF", confidence: 0.31, confirmed: false, escalateIfUnknown: true },
  { id: "prc_4", name: "Cut", amount: 5000, currency: "RWF", confidence: 0.88, confirmed: false, escalateIfUnknown: false },
  { id: "prc_5", name: "Colour", amount: 12000, currency: "RWF", confidence: 0.84, confirmed: false, escalateIfUnknown: false },
  { id: "prc_6", name: "Nails", amount: 8000, currency: "RWF", confidence: 0.79, confirmed: false, escalateIfUnknown: false },
  { id: "prc_7", name: "Bridal", amount: null, currency: "RWF", confidence: 0.22, confirmed: false, escalateIfUnknown: true },
  { id: "prc_8", name: "Kids cut", amount: 3000, currency: "RWF", confidence: 0.86, confirmed: false, escalateIfUnknown: false },
];

export async function uploadPrices(form: FormData) {
  const ctx = await requireStudioContext();
  const quality = String(form.get("quality") ?? "");
  if (quality === "blurry") {
    redirect("/activate/prices?tab=cam&err=blurry");
  }
  const file = form.get("photo");
  if (file instanceof File && file.size > 0) {
    savePrices(
      ctx,
      EXTRACTED.map((row) => ({ ...row, escalateIfUnknown: row.amount === null || flagLowConfidence(row) })),
      "photo",
      0,
    );
    redirect("/activate/prices?tab=cam&confirm=1");
  }
  redirect("/activate/prices?tab=cam");
}

export async function confirmPricesAction(form: FormData) {
  const ctx = await requireStudioContext();
  const method = String(form.get("method") ?? "type") as "photo" | "type" | "import";
  savePrices(ctx, rowsFromForm(form), method, Number(form.get("edited") ?? 0));
  go("voice");
}

export async function importPrices(form: FormData) {
  const ctx = await requireStudioContext();
  const url = String(form.get("url") ?? "").trim();
  if (!url) redirect("/activate/prices?tab=web");
  savePrices(ctx, EXTRACTED.slice(0, 4), "import", 0);
  go("voice");
}

export async function skipPrices() {
  const ctx = await requireStudioContext();
  skipStep(ctx, "prices");
  go("voice");
}

export async function saveVoiceAction(form: FormData) {
  const ctx = await requireStudioContext();
  const voice = String(form.get("voice") ?? "warm-female") as LibraryVoiceId;
  saveVoice(ctx, voice);
  go("call");
}

export async function previewVoiceAction(form: FormData) {
  const ctx = await requireStudioContext();
  previewVoice(ctx, String(form.get("voice") ?? "warm-female") as LibraryVoiceId);
}

export async function startCallAction(form: FormData) {
  const ctx = await requireStudioContext();
  const route = String(form.get("route") ?? "outbound") as "outbound" | "browser" | "inbound";
  const force = String(form.get("force") ?? "") as TestCallState | "";
  try {
    requestTestCall(ctx, route, force || undefined);
  } catch (error) {
    if (error instanceof Error && error.message === "in-flight") {
      redirect("/activate/call?state=live");
    }
    throw error;
  }
  go("call");
}

export async function advanceCallAction(form: FormData) {
  const ctx = await requireStudioContext();
  const next = String(form.get("next") ?? "ended") as TestCallState;
  try {
    advanceTestCall(ctx, next);
  } catch {
    requestTestCall(ctx, "inbound");
    advanceTestCall(ctx, next);
  }
  if (next === "ended") go("review");
  go("call");
}

export async function skipCall() {
  const ctx = await requireStudioContext();
  skipStep(ctx, "call");
  skipStep(ctx, "review");
  go("escalation");
}

export async function viewTranscriptAction() {
  const ctx = await requireStudioContext();
  viewTranscript(ctx);
  go("escalation");
}

export async function correctTurn(form: FormData) {
  const ctx = await requireStudioContext();
  const turnId = String(form.get("turnId") ?? "");
  const text = String(form.get("corrected") ?? "");
  if (turnId && text.trim()) saveCorrection(ctx, turnId, text);
  go("review");
}

export async function saveEscalationAction(form: FormData) {
  const ctx = await requireStudioContext();
  const parsed = parseRwandaPhone(String(form.get("phone") ?? ""));
  if (!parsed) redirect("/activate/escalation?err=phone");
  const noAnswer = String(form.get("fallback") ?? "message-with-time") as NoAnswerFallback;
  saveEscalation(ctx, parsed, noAnswer);
  go("phone");
}

export async function verifyPhoneAction() {
  const ctx = await requireStudioContext();
  verifyForwarding(ctx);
  go("phone");
}

export async function continuePhone() {
  await requireStudioContext();
  go("scope");
}

export async function skipPhone() {
  const ctx = await requireStudioContext();
  skipStep(ctx, "phone");
  go("scope");
}

export async function saveScopeAction(form: FormData) {
  const ctx = await requireStudioContext();
  const rung = String(form.get("rung") ?? "closed-only") as GoLiveRung;
  setGoLive(ctx, rung);
  go("home");
}

export async function skipTo(step: ActivationStep) {
  const ctx = await requireStudioContext();
  if (step !== "escalation") skipStep(ctx, step);
  const next = nextAfter(step);
  go(next);
}

export async function pauseAgentAction() {
  const ctx = await requireStudioContext();
  pauseLive(ctx);
  redirect("/home?paused=1");
}

export type { Weekday };
