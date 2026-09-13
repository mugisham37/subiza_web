"use server";

import {
  abandonEmbeddedSignup,
  answerWhatsAppPreflight,
  checkInstagramAccount,
  chooseWhatsAppRoute,
  confirmCoexistence,
  connectWhatsApp,
  createTelegramBot,
  elevateForChannelConnect,
  enqueueWhatsAppOnboarding,
  exchangeEmbeddedSignup,
  expireSignupCode,
  getTenant,
  reconnectChannel,
  resubmitDisplayName,
  startEmbeddedSignup,
} from "@subiza/auth-tenant";
import { canConnectChannel } from "@subiza/core";
import {
  botUsernameFor,
  isMetaScreen,
  type MessagingChannel,
  type MessagingStep,
  type WhatsAppRoute,
} from "@subiza/domain";
import { redirect as nextRedirect } from "next/navigation";
import { requireStudioContext, setStudioSession } from "@/lib/session";
import { hrefForChannel } from "./steps";

function redirect(path: string): never {
  nextRedirect(path as never);
}

function go(channel: MessagingChannel, step: MessagingStep, query = ""): never {
  redirect(`${hrefForChannel(channel, step)}${query}`);
}

async function writeCtx() {
  const incoming = await requireStudioContext();
  if (incoming.strength === "recovered" || !canConnectChannel(incoming.role)) {
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  const stepped = elevateForChannelConnect(incoming);
  if (stepped.sessionId) await setStudioSession(stepped.sessionId);
  return stepped.ctx;
}

export async function createManagedBotAction() {
  const ctx = await writeCtx();
  createTelegramBot(ctx, "managed", botUsernameFor(getTenant(ctx).name));
  go("telegram", "tg1", "?done=1");
}

export async function createBotFatherAction(form: FormData) {
  const ctx = await writeCtx();
  const token = String(form.get("token") ?? "").trim();
  if (!/^\d{6,}:[A-Za-z0-9_-]{20,}$/.test(token)) {
    go("telegram", "tg2", "?token=invalid");
  }
  createTelegramBot(ctx, "botfather", botUsernameFor(getTenant(ctx).name));
  redirect("/connections");
}

export async function answerPreflightAction(form: FormData) {
  const ctx = await writeCtx();
  const already = String(form.get("alreadyOnWa") ?? "");
  const rdb = String(form.get("rdb") ?? "");
  if (already !== "yes" && already !== "no") go("whatsapp", "wa1");
  if (rdb !== "yes" && rdb !== "no") go("whatsapp", "wa1");
  const number = String(form.get("number") ?? "").replace(/\D/g, "");
  const next = answerWhatsAppPreflight(ctx, {
    alreadyOnWa: already === "yes",
    rdb: rdb === "yes",
    number: number || "788123456",
  });
  go("whatsapp", next.whatsapp.step);
}

export async function chooseRouteAction(form: FormData) {
  const ctx = await writeCtx();
  const raw = String(form.get("route") ?? "");
  const route = (["move", "coex", "other"].includes(raw) ? raw : "move") as WhatsAppRoute;
  const next = chooseWhatsAppRoute(ctx, route);
  go("whatsapp", next.whatsapp.step);
}

export async function confirmCoexAction() {
  const ctx = await writeCtx();
  const next = confirmCoexistence(ctx);
  go("whatsapp", next.whatsapp.step);
}

export async function openMetaAction(form: FormData) {
  const ctx = await writeCtx();
  const started = startEmbeddedSignup(ctx);
  const codeId = started.whatsapp.lastSessionId ?? `${ctx.tenantId}:code`;
  const outcome = String(form.get("outcome") ?? "success");
  if (outcome === "expired") {
    expireSignupCode(codeId);
    exchangeEmbeddedSignup(ctx, codeId);
    go("whatsapp", "wa5", "?force=expired");
  }
  if (outcome === "abandon") {
    const screen = String(form.get("screen") ?? "phone-number");
    abandonEmbeddedSignup(ctx, {
      metaScreen: isMetaScreen(screen) ? screen : "phone-number",
      sessionId: codeId,
    });
    go("whatsapp", "wa5");
  }
  exchangeEmbeddedSignup(ctx, codeId);
  enqueueWhatsAppOnboarding(ctx);
  go("whatsapp", "wa6");
}

export async function relaunchMetaAction() {
  const ctx = await writeCtx();
  startEmbeddedSignup(ctx);
  go("whatsapp", "wa4");
}

export async function submitDisplayNameAction(form: FormData) {
  const ctx = await writeCtx();
  resubmitDisplayName(ctx, String(form.get("name") ?? "").trim() || "Salon Ubwiza");
  go("whatsapp", "wa6");
}

export async function acceptPaymentAction() {
  const ctx = await writeCtx();
  connectWhatsApp(ctx);
  go("whatsapp", "wa9");
}

export async function checkInstagramAction(form: FormData) {
  const ctx = await writeCtx();
  const professional = String(form.get("professional") ?? "1") !== "0";
  const next = checkInstagramAccount(ctx, professional);
  go("instagram", next.instagram.step, professional ? "" : "?still=1");
}

export async function reconnectAction() {
  const ctx = await writeCtx();
  const next = reconnectChannel(ctx, "instagram");
  go("instagram", next.instagram.step);
}

export async function backToConnectionsAction() {
  await requireStudioContext();
  redirect("/connections");
}
