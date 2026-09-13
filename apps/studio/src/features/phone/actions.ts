"use server";

import {
  advancePhoneCode,
  choosePhonePath,
  detectPhoneNetwork,
  markCodeShown,
  markPhoneDone,
  requestAssistedCall,
  requestPhoneVerification,
  setPhoneScope,
  setPhoneSurfaceStep,
  setRepairRung,
  settlePhoneVerification,
  startNewNumber,
} from "@subiza/auth-tenant";
import type { PhoneNetwork, PhoneStep, VerificationOutcome } from "@subiza/domain";
import { redirect as nextRedirect } from "next/navigation";
import { requireStudioContext } from "@/lib/session";
import { hrefForPhone } from "./steps";

function redirect(path: string): never {
  nextRedirect(path as never);
}

function go(step: PhoneStep, query = ""): never {
  redirect(`${hrefForPhone(step)}${query}`);
}

export async function choosePathAction(form: FormData) {
  const ctx = await requireStudioContext();
  const path = String(form.get("path") ?? "forwarding") === "new-number" ? "new-number" : "forwarding";
  choosePhonePath(ctx, path);
  go(path === "new-number" ? "number" : "scope");
}

export async function saveScopeAction(form: FormData) {
  const ctx = await requireStudioContext();
  const raw = String(form.get("scope") ?? "miss");
  const choice = raw === "no-reply" || raw === "all" ? raw : "miss";
  setPhoneScope(ctx, choice);
  go("code");
}

export async function correctNetworkAction(form: FormData) {
  const ctx = await requireStudioContext();
  const raw = String(form.get("network") ?? "unknown");
  const network = (["mtn", "airtel", "unknown"].includes(raw) ? raw : "unknown") as PhoneNetwork;
  detectPhoneNetwork(ctx, network);
  go("code");
}

export async function shownCodeAction() {
  const ctx = await requireStudioContext();
  markCodeShown(ctx);
  go("code");
}

export async function dialledCodeAction() {
  const ctx = await requireStudioContext();
  const next = advancePhoneCode(ctx);
  go(next.surfaceStep === "verify" ? "verify" : "code");
}

export async function startVerifyAction(form: FormData) {
  const ctx = await requireStudioContext();
  const kind = String(form.get("kind") ?? "activation") === "recurring" ? "recurring" : "activation";
  requestPhoneVerification(ctx, kind);
  const force = String(form.get("force") ?? "");
  go("verify", force ? `?watch=1&force=${encodeURIComponent(force)}` : "?watch=1");
}

export async function settleVerifyAction(form: FormData) {
  const ctx = await requireStudioContext();
  const raw = String(form.get("force") ?? "");
  const force = (
    [
      "diverted",
      "owner-answered",
      "not-diverted",
      "diverted-no-caller-id",
      "diverted-elsewhere",
      "inconclusive",
      "unconditional",
    ] as const
  ).includes(raw as VerificationOutcome)
    ? (raw as VerificationOutcome)
    : undefined;
  const next = settlePhoneVerification(ctx, force);
  if (next.verification.status === "retrying") {
    go("verify", "?watch=1&retry=1");
  }
  go("result");
}

export async function retryVerifyAction() {
  const ctx = await requireStudioContext();
  setPhoneSurfaceStep(ctx, "verify");
  go("verify");
}

export async function continueToDoneAction() {
  const ctx = await requireStudioContext();
  markPhoneDone(ctx);
  go("done");
}

export async function openRepairAction() {
  const ctx = await requireStudioContext();
  setPhoneSurfaceStep(ctx, "repair");
  go("repair");
}

export async function climbRepairAction(form: FormData) {
  const ctx = await requireStudioContext();
  const rung = Number(form.get("rung") ?? 1);
  const prepaid = form.get("prepaid") === "1";
  setRepairRung(ctx, rung, prepaid);
  if (prepaid) go("repair", "?prepaid=1");
  go("code", `?rung=${rung}`);
}

export async function requestHumanAction() {
  const ctx = await requireStudioContext();
  requestAssistedCall(ctx, "repair");
  go("repair", "?human=1");
}

export async function takeNewNumberAction() {
  const ctx = await requireStudioContext();
  startNewNumber(ctx);
  go("number");
}

export async function backToPathAction() {
  const ctx = await requireStudioContext();
  setPhoneSurfaceStep(ctx, "path");
  go("path");
}

export async function finishPhoneAction() {
  await requireStudioContext();
  redirect("/connections");
}
