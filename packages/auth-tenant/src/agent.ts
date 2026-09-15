import { can, type TenantCapability } from "@subiza/core";
import {
  KINYARWANDA_CHECK_POLICY,
  REVERT_ALERT_MS,
  applyConflictResolution,
  canDeleteRule,
  detectContradictions,
  earnsGuaranteed,
  emptyAgentConfig,
  emptyWeek,
  normalizeAgentConfig,
  removeRule,
  spokenSeconds,
  type AgentConfig,
  type AgentRule,
  type AgentStep,
  type AgentTone,
  type AgentView,
  type AnswerLength,
  type ConfidenceLevel,
  type ConflictResolution,
  type RuleCategory,
  type AgentStage,
} from "@subiza/domain";
import { writeAudit } from "./audit";
import { bundleOf, emit } from "./activation";
import type { TenantContext } from "./context";
import { getTenant, updatePersona as dalUpdatePersona } from "./dal";
import { newEntityId } from "./ids";
import { getStore } from "./store";

/**
 * AUTH DECISION — Prompt 07.
 *
 * configureAgentPersona is FULL for owner and manager. Recovered sessions
 * are refused. Unlike messaging channels, there is no elevated step-up:
 * an otp session that can write may edit behaviour. Every emit on this
 * surface passes `configureAgentPersona` explicitly so the activation
 * default never lands on an agent audit row.
 */
export const AGENT_SURFACE_AUTH = {
  writeRequires: "configureAgentPersona",
  recovered: "denied",
  strength: "otp",
  advanced: "view",
  dualRun: KINYARWANDA_CHECK_POLICY,
} as const;

function deny(ctx: TenantContext, capability: TenantCapability, reason: string): never {
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: capability,
    capability,
    outcome: "denied",
    before: null,
    after: null,
    reason,
  });
  throw Object.assign(new Error("notFound"), { code: "notFound" as const });
}

function requireAgentWrite(ctx: TenantContext): void {
  if (ctx.strength === "recovered") deny(ctx, "configureAgentPersona", "recovered");
  if (!can(ctx.role, "configureAgentPersona")) deny(ctx, "configureAgentPersona", "missing-grant");
  dalUpdatePersona(ctx);
}

function agentOf(ctx: TenantContext): AgentConfig {
  const bundle = bundleOf(ctx);
  const agent = normalizeAgentConfig(bundle.agent ?? emptyAgentConfig(emptyWeek()));
  bundle.agent = agent;
  return agent;
}

function writeAgent(ctx: TenantContext, next: AgentConfig): AgentConfig {
  const bundle = bundleOf(ctx);
  bundle.agent = next;
  return next;
}

export function changeAgent(ctx: TenantContext, patch: Partial<AgentConfig>): AgentConfig {
  requireAgentWrite(ctx);
  const current = agentOf(ctx);
  const next = normalizeAgentConfig({
    ...current,
    ...patch,
    rules: patch.rules ?? current.rules,
    unpublished: patch.unpublished ?? true,
    needsConflictCheck: patch.needsConflictCheck ?? true,
  });
  return writeAgent(ctx, next);
}

export function readAgent(ctx: TenantContext): AgentConfig {
  return agentOf(ctx);
}

export function setAgentStep(ctx: TenantContext, step: AgentStep): AgentConfig {
  requireAgentWrite(ctx);
  return changeAgent(ctx, { surfaceStep: step, unpublished: agentOf(ctx).unpublished, needsConflictCheck: agentOf(ctx).needsConflictCheck });
}

export function updatePersonaText(ctx: TenantContext, persona: string): AgentConfig {
  const next = changeAgent(ctx, { persona });
  emit(ctx, { name: "agent.rule_edited", category: "persona", enforceable: false }, "configureAgentPersona");
  return next;
}

export function updateGreeting(ctx: TenantContext, greeting: string): AgentConfig {
  const next = changeAgent(ctx, { greeting });
  emit(ctx, { name: "agent.greeting_edited", seconds: spokenSeconds(greeting) }, "configureAgentPersona");
  return next;
}

export function updateManner(
  ctx: TenantContext,
  patch: { tone?: AgentTone; answerLength?: AnswerLength; useCallerName?: boolean; confidence?: ConfidenceLevel },
): AgentConfig {
  const next = changeAgent(ctx, patch);
  emit(
    ctx,
    { name: "agent.manner_changed", tone: next.tone, confidence: next.confidence },
    "configureAgentPersona",
  );
  return next;
}

export function toggleRule(ctx: TenantContext, id: string): AgentConfig {
  const current = agentOf(ctx);
  const rule = current.rules.find((row) => row.id === id);
  if (!rule) deny(ctx, "configureAgentPersona", "missing-rule");
  if (rule.lock) deny(ctx, "configureAgentPersona", "locked-rule");
  const next = changeAgent(ctx, {
    rules: current.rules.map((row) => (row.id === id ? { ...row, on: !row.on } : row)),
  });
  const updated = next.rules.find((row) => row.id === id)!;
  emit(
    ctx,
    {
      name: updated.on ? "agent.rule_edited" : "agent.rule_disabled",
      category: updated.cat,
      enforceable: earnsGuaranteed(updated),
    },
    "configureAgentPersona",
  );
  return next;
}

export function editRule(ctx: TenantContext, id: string, text: string, locale: "en" | "rw"): AgentConfig {
  const current = agentOf(ctx);
  const rule = current.rules.find((row) => row.id === id);
  if (!rule) deny(ctx, "configureAgentPersona", "missing-rule");
  if (rule.lock) deny(ctx, "configureAgentPersona", "locked-rule");
  const next = changeAgent(ctx, {
    rules: current.rules.map((row) =>
      row.id === id
        ? {
            ...row,
            en: locale === "en" ? text : row.en,
            rw: locale === "rw" ? text : row.rw,
            text: locale === "en" ? text : row.text,
          }
        : row,
    ),
  });
  emit(ctx, { name: "agent.rule_edited", category: rule.cat, enforceable: earnsGuaranteed(rule) }, "configureAgentPersona");
  return next;
}

export function reassignRule(ctx: TenantContext, id: string, cat: RuleCategory, stage: AgentStage): AgentConfig {
  const current = agentOf(ctx);
  const rule = current.rules.find((row) => row.id === id);
  if (!rule) deny(ctx, "configureAgentPersona", "missing-rule");
  if (rule.lock) deny(ctx, "configureAgentPersona", "locked-rule");
  return changeAgent(ctx, {
    rules: current.rules.map((row) => (row.id === id ? { ...row, cat, stage } : row)),
  });
}

export function addRule(ctx: TenantContext, cat: RuleCategory, text: string): AgentConfig {
  const current = agentOf(ctx);
  const stage: AgentStage = cat === "escalate" ? "always" : "answer";
  const added: AgentRule = {
    id: newEntityId("rul"),
    cat,
    stage,
    enf: "soft",
    on: true,
    lock: false,
    en: text,
    rw: text,
    text,
    mechanism: null,
    knowledgeRef: null,
  };
  const next = changeAgent(ctx, { rules: [...current.rules, added] });
  emit(ctx, { name: "agent.rule_added", category: cat, enforceable: false }, "configureAgentPersona");
  return next;
}

export function deleteRule(ctx: TenantContext, id: string): AgentConfig {
  requireAgentWrite(ctx);
  const current = agentOf(ctx);
  const rule = current.rules.find((row) => row.id === id);
  if (!rule) deny(ctx, "configureAgentPersona", "missing-rule");
  if (!canDeleteRule(rule)) deny(ctx, "configureAgentPersona", "locked-rule");
  const next = removeRule(current, id);
  if (next.rules.length === current.rules.length) deny(ctx, "configureAgentPersona", "locked-rule");
  writeAgent(ctx, { ...next, unpublished: true, needsConflictCheck: true });
  emit(ctx, { name: "agent.rule_deleted", category: rule.cat, enforceable: earnsGuaranteed(rule) }, "configureAgentPersona");
  return next;
}

export function toggleMode(ctx: TenantContext, to: AgentView): void {
  requireAgentWrite(ctx);
  const from: AgentView = to === "advanced" ? "simple" : "advanced";
  emit(ctx, { name: "agent.mode_toggled", from, to }, "configureAgentPersona");
}

function pushVersion(ctx: TenantContext, snapshot: AgentConfig): void {
  const bundle = bundleOf(ctx);
  const tenant = getTenant(ctx);
  const person = getStore().people.get(ctx.personId);
  bundle.agentVersions = [
    {
      id: newEntityId("ver"),
      at: Date.now(),
      authorPersonId: ctx.personId,
      authorName: person?.name ?? tenant.name,
      snapshot: structuredClone(snapshot),
    },
    ...bundle.agentVersions,
  ].slice(0, 40);
}

export function publishAgent(ctx: TenantContext, anyway = false): { agent: AgentConfig; conflicts: ReturnType<typeof detectContradictions> } {
  requireAgentWrite(ctx);
  const current = agentOf(ctx);
  const conflicts = detectContradictions(current.rules);
  emit(ctx, { name: "agent.contradiction_check_run", count: conflicts.length }, "configureAgentPersona");
  if (conflicts.length > 0 && !anyway) {
    writeAgent(ctx, { ...current, needsConflictCheck: true, surfaceStep: "conflict", unpublished: true });
    return { agent: current, conflicts };
  }
  const bundle = bundleOf(ctx);
  if (bundle.liveAgent) pushVersion(ctx, bundle.liveAgent);
  const published = normalizeAgentConfig({
    ...current,
    needsConflictCheck: false,
    unpublished: false,
    publishedAt: Date.now(),
    versionNumber: current.versionNumber + 1,
    surfaceStep: "behaviour",
  });
  bundle.liveAgent = structuredClone(published);
  writeAgent(ctx, published);
  if (anyway && conflicts.length > 0) {
    emit(ctx, { name: "agent.published_with_conflict", count: conflicts.length }, "configureAgentPersona");
  }
  emit(
    ctx,
    { name: "agent.published", version: published.versionNumber, ruleCount: published.rules.filter((row) => row.on).length },
    "configureAgentPersona",
  );
  return { agent: published, conflicts: anyway ? conflicts : [] };
}

export function resolveAgentConflict(ctx: TenantContext, conflictId: string, resolution: ConflictResolution): AgentConfig {
  requireAgentWrite(ctx);
  const current = agentOf(ctx);
  const conflict = detectContradictions(current.rules).find((row) => row.id === conflictId);
  if (!conflict) return current;
  const next = applyConflictResolution(current, conflict, resolution);
  writeAgent(ctx, next);
  emit(ctx, { name: "agent.contradiction_resolved", resolution }, "configureAgentPersona");
  return next;
}

export function restoreAgentVersion(ctx: TenantContext, versionId: string): AgentConfig {
  requireAgentWrite(ctx);
  const bundle = bundleOf(ctx);
  const version = bundle.agentVersions.find((row) => row.id === versionId);
  if (!version) deny(ctx, "configureAgentPersona", "missing-version");
  const current = agentOf(ctx);
  pushVersion(ctx, current);
  const restored = normalizeAgentConfig({
    ...version.snapshot,
    unpublished: false,
    needsConflictCheck: false,
    publishedAt: Date.now(),
    versionNumber: current.versionNumber + 1,
    surfaceStep: "behaviour",
  });
  const msSincePublish = current.publishedAt ? Date.now() - current.publishedAt : 0;
  bundle.liveAgent = structuredClone(restored);
  writeAgent(ctx, restored);
  emit(
    ctx,
    {
      name: "agent.reverted",
      fromVersion: current.versionNumber,
      toVersion: restored.versionNumber,
      msSincePublish,
    },
    "configureAgentPersona",
  );
  void REVERT_ALERT_MS;
  return restored;
}

export function inFlightAgentOf(ctx: TenantContext): AgentConfig | null {
  return bundleOf(ctx).inFlightAgent;
}

export function agentVersionsOf(ctx: TenantContext) {
  return bundleOf(ctx).agentVersions;
}

export function liveAgentOf(ctx: TenantContext): AgentConfig | null {
  return bundleOf(ctx).liveAgent;
}
