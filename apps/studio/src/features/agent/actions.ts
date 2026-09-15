"use server";

import {
  addRule,
  deleteRule,
  editRule,
  publishAgent,
  resolveAgentConflict,
  restoreAgentVersion,
  toggleMode,
  toggleRule,
  updateGreeting,
  updateManner,
  updatePersonaText,
} from "@subiza/auth-tenant";
import {
  ANSWER_LENGTHS,
  CONFIDENCE_LEVELS,
  CONFLICT_RESOLUTIONS,
  RULE_CATEGORIES,
  TONES,
  isAgentStep,
  isAgentView,
  type AgentStep,
  type AgentView,
  type AnswerLength,
  type ConfidenceLevel,
  type ConflictResolution,
  type RuleCategory,
  type AgentTone,
} from "@subiza/domain";
import { redirect as nextRedirect } from "next/navigation";
import { requireStudioContext } from "@/lib/session";
import { hrefForAgent } from "./steps";

function redirect(path: string): never {
  nextRedirect(path as never);
}

function readView(form: FormData): AgentView {
  const raw = String(form.get("view") ?? "simple");
  return isAgentView(raw) ? raw : "simple";
}

function readStep(form: FormData, fallback: AgentStep): AgentStep {
  const raw = String(form.get("step") ?? fallback);
  return isAgentStep(raw) ? raw : fallback;
}

function go(step: AgentStep, view: AgentView = "simple"): never {
  redirect(hrefForAgent(step, view));
}

export async function toggleViewAction(form: FormData) {
  const ctx = await requireStudioContext();
  const view = readView(form);
  toggleMode(ctx, view);
  go(readStep(form, "behaviour"), view);
}

export async function savePersonaAction(form: FormData) {
  const ctx = await requireStudioContext();
  updatePersonaText(ctx, String(form.get("persona") ?? "").trim());
  go(readStep(form, "behaviour"), readView(form));
}

export async function saveGreetingAction(form: FormData) {
  const ctx = await requireStudioContext();
  updateGreeting(ctx, String(form.get("greeting") ?? "").trim());
  go(readStep(form, "behaviour"), readView(form));
}

export async function saveMannerAction(form: FormData) {
  const ctx = await requireStudioContext();
  const toneRaw = String(form.get("tone") ?? "");
  const lengthRaw = String(form.get("answerLength") ?? "");
  const nameRaw = String(form.get("useCallerName") ?? "");
  const confRaw = String(form.get("confidence") ?? "");
  updateManner(ctx, {
    ...(TONES.includes(toneRaw as AgentTone) ? { tone: toneRaw as AgentTone } : {}),
    ...(ANSWER_LENGTHS.includes(lengthRaw as AnswerLength) ? { answerLength: lengthRaw as AnswerLength } : {}),
    ...(nameRaw === "yes" ? { useCallerName: true } : nameRaw === "no" ? { useCallerName: false } : {}),
    ...(CONFIDENCE_LEVELS.includes(confRaw as ConfidenceLevel) ? { confidence: confRaw as ConfidenceLevel } : {}),
  });
  go(readStep(form, "behaviour"), readView(form));
}

export async function toggleRuleAction(form: FormData) {
  const ctx = await requireStudioContext();
  toggleRule(ctx, String(form.get("id") ?? ""));
  go(readStep(form, "behaviour"), readView(form));
}

export async function editRuleAction(form: FormData) {
  const ctx = await requireStudioContext();
  const locale = String(form.get("locale") ?? "en") === "rw" ? "rw" : "en";
  editRule(ctx, String(form.get("id") ?? ""), String(form.get("text") ?? "").trim(), locale);
  go(readStep(form, "behaviour"), readView(form));
}

export async function addRuleAction(form: FormData) {
  const ctx = await requireStudioContext();
  const catRaw = String(form.get("cat") ?? "always");
  const cat: RuleCategory = RULE_CATEGORIES.includes(catRaw as RuleCategory) ? (catRaw as RuleCategory) : "always";
  const text = String(form.get("text") ?? "").trim();
  if (text) addRule(ctx, cat, text);
  go(readStep(form, "behaviour"), readView(form));
}

export async function deleteRuleAction(form: FormData) {
  const ctx = await requireStudioContext();
  deleteRule(ctx, String(form.get("id") ?? ""));
  go(readStep(form, "behaviour"), readView(form));
}

export async function publishAgentAction(form: FormData) {
  const ctx = await requireStudioContext();
  const anyway = String(form.get("anyway") ?? "") === "1";
  const view = readView(form);
  const result = publishAgent(ctx, anyway);
  if (result.conflicts.length > 0 && !anyway) {
    go("conflict", view);
  }
  go("behaviour", view);
}

export async function resolveConflictAction(form: FormData) {
  const ctx = await requireStudioContext();
  const raw = String(form.get("resolution") ?? "never");
  const resolution: ConflictResolution = CONFLICT_RESOLUTIONS.includes(raw as ConflictResolution)
    ? (raw as ConflictResolution)
    : "never";
  resolveAgentConflict(ctx, String(form.get("conflictId") ?? ""), resolution);
  go("behaviour", readView(form));
}

export async function restoreVersionAction(form: FormData) {
  const ctx = await requireStudioContext();
  restoreAgentVersion(ctx, String(form.get("versionId") ?? ""));
  go("history", readView(form));
}
