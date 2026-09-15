import {
  AGENT_SURFACE_AUTH,
  agentVersionsOf,
  bundleOf,
  documentsOf,
  getTenant,
  inFlightAgentOf,
  liveAgentOf,
  readAgent,
  toggleMode,
} from "@subiza/auth-tenant";
import { can } from "@subiza/core";
import {
  ADVANCED_VIEW_SHIPS_IN_V1,
  AGENT_STEPMAP,
  activeRuleCount,
  detectContradictions,
  diffVersions,
  emptyAgentConfig,
  emptyWeek,
  greetingTooLong,
  isAgentView,
  normalizeAgentConfig,
  ruleCountWarning,
  spokenSeconds,
  toolsForStage,
  type AgentConfig,
  type AgentRule,
  type AgentStep,
  type AgentView,
} from "@subiza/domain";
import { requireStudioContext } from "@/lib/session";

const FORCES = ["toomany", "conflict", "unenforceable", "edited", "history"] as const;
type Force = (typeof FORCES)[number];

function one(search: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = search[key];
  return Array.isArray(value) ? value[0] : value;
}

function paddingRules(count: number): AgentRule[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `rul_pad_${i}`,
    cat: "always" as const,
    stage: "answer" as const,
    enf: "soft" as const,
    on: true,
    lock: false,
    en: `Extra rule ${i + 1}`,
    rw: `Itegeko ryinyongera ${i + 1}`,
    text: `Extra rule ${i + 1}`,
    mechanism: null,
    knowledgeRef: null,
  }));
}

function overlayForce(agent: AgentConfig, force: Force | undefined): AgentConfig {
  if (force === "toomany") {
    return { ...agent, rules: [...agent.rules, ...paddingRules(20)] };
  }
  if (force === "unenforceable") {
    return {
      ...agent,
      rules: [
        ...agent.rules,
        {
          id: "rul_warm",
          cat: "always",
          stage: "greeting",
          enf: "soft",
          on: true,
          lock: false,
          en: "Be warm",
          rw: "Vuga ubwuzu",
          text: "Be warm",
          mechanism: null,
          knowledgeRef: null,
        },
        {
          id: "rul_right",
          cat: "always",
          stage: "answer",
          enf: "hard",
          on: true,
          lock: false,
          en: "Always be right",
          rw: "Buri gihe uba ukuri",
          text: "Always be right",
          mechanism: null,
          knowledgeRef: null,
        },
        {
          id: "rul_missing_kb",
          cat: "always",
          stage: "answer",
          enf: "soft",
          on: true,
          lock: false,
          en: "Quote the unpublished colour card",
          rw: "Vuga ikarita y'amabara itarashyirwa",
          text: "Quote the unpublished colour card",
          mechanism: null,
          knowledgeRef: "kb_missing",
        },
      ],
    };
  }
  if (force === "edited") {
    return { ...agent, unpublished: true };
  }
  return agent;
}

export async function loadAgent(step: AgentStep, search: Record<string, string | string[] | undefined>) {
  const ctx = await requireStudioContext();
  const denied = ctx.strength === "recovered" || !can(ctx.role, "configureAgentPersona");
  const tenant = getTenant(ctx);
  const docs = documentsOf(ctx);
  const bundle = bundleOf(ctx);
  const rawForce = one(search, "force");
  const force = FORCES.includes(rawForce as Force) ? (rawForce as Force) : undefined;
  const viewRaw = one(search, "view") ?? "";
  const view: AgentView = ADVANCED_VIEW_SHIPS_IN_V1 && isAgentView(viewRaw) ? viewRaw : "simple";
  const fromRaw = one(search, "from") ?? "";
  if (!denied && isAgentView(fromRaw) && fromRaw !== view) {
    toggleMode(ctx, view);
  }
  let agent = denied
    ? emptyAgentConfig(emptyWeek())
    : normalizeAgentConfig(readAgent(ctx) ?? emptyAgentConfig(emptyWeek()));
  agent = overlayForce(agent, force);
  const knownIds = (docs.knowledge?.prices ?? []).map((row) => row.id);
  const conflicts = detectContradictions(agent.rules);
  const versions = denied ? [] : agentVersionsOf(ctx);
  const live = liveAgentOf(ctx);
  return {
    ctx,
    tenant,
    docs,
    bundle,
    agent,
    step,
    view,
    denied,
    auth: AGENT_SURFACE_AUTH,
    advancedShips: ADVANCED_VIEW_SHIPS_IN_V1,
    force,
    progressNow: AGENT_STEPMAP[step],
    locale: tenant.language === "en" ? ("en" as const) : ("rw" as const),
    knownIds,
    conflicts,
    versions,
    live,
    inFlight: inFlightAgentOf(ctx),
    diff: versions[0] ? diffVersions(versions[0].snapshot, agent) : diffVersions(agent, agent),
    seconds: spokenSeconds(agent.greeting),
    greetingLong: greetingTooLong(agent.greeting),
    activeCount: activeRuleCount(agent),
    tooMany: ruleCountWarning(agent),
    tools: {
      greeting: toolsForStage(agent, "greeting"),
      answer: toolsForStage(agent, "answer"),
      booking: toolsForStage(agent, "booking"),
      message: toolsForStage(agent, "message"),
      always: toolsForStage(agent, "always"),
    },
  };
}
