import { z } from "zod";
import { afterHoursSchema, emptyWeek, weekGridSchema, type AfterHoursPolicy, type WeekGrid } from "./week-grid";

/**
 * Named assumptions (Prompt 07 §2 / §10 / §0.4).
 *
 * Advanced ships in v1 as a *view*, not a mode. Nielsen (2026) rejects
 * Simple/Advanced toggles because they fracture codebases and assume power
 * users who mostly do not exist. The answers still hold: there is one rule
 * array; Advanced adds visibility (tools per stage), never capability; the
 * switch is a GET `?view=` with no confirmation and no persisted preference.
 * Instrument `agent.mode_toggled`. Simple remains complete on its own.
 *
 * Kinyarwanda contradiction-check accuracy is unmeasured. Until a dual
 * test-call week settles it, rules authored in Kinyarwanda are stored as
 * written, and the check runs on both the original and an English rendering.
 * Disagreement is a finding, never a silent resolve.
 *
 * Tool scoping is containment, not immunity. A `guaranteed` badge claims
 * "guaranteed for this rule", never "the agent cannot be manipulated".
 */
export const ADVANCED_VIEW_SHIPS_IN_V1 = true;
export const KINYARWANDA_CHECK_POLICY = "dual-run" as const;
export const TOOL_SCOPING_CLAIM = "containment" as const;

export const TEMPLATE_KINDS = ["shop", "salon", "restaurant", "clinic", "repair", "generic"] as const;
export type TemplateKind = (typeof TEMPLATE_KINDS)[number];
export const templateKindSchema = z.enum(TEMPLATE_KINDS);

export const RULE_CATEGORIES = ["always", "never", "escalate"] as const;
export type RuleCategory = (typeof RULE_CATEGORIES)[number];

export const AGENT_STAGES = ["greeting", "answer", "booking", "message", "always"] as const;
export type AgentStage = (typeof AGENT_STAGES)[number];

export const RULE_ENFORCEMENT = ["hard", "soft", "lock"] as const;
export type RuleEnforcement = (typeof RULE_ENFORCEMENT)[number];

export const TONES = ["warm", "neutral", "formal"] as const;
export type AgentTone = (typeof TONES)[number];

export const ANSWER_LENGTHS = ["short", "normal", "detailed"] as const;
export type AnswerLength = (typeof ANSWER_LENGTHS)[number];

export const CONFIDENCE_LEVELS = ["relaxed", "balanced", "careful"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const AGENT_TOOLS = ["prices", "booking", "hours", "message", "escalate", "knowledge"] as const;
export type AgentTool = (typeof AGENT_TOOLS)[number];

export const RULE_MECHANISMS = [
  "typed-field-lookup",
  "tool-absent",
  "every-turn-trigger",
  "required-step-before-commit",
] as const;
export type RuleMechanism = (typeof RULE_MECHANISMS)[number];

export const CONFLICT_RESOLUTIONS = ["never", "always", "narrow"] as const;
export type ConflictResolution = (typeof CONFLICT_RESOLUTIONS)[number];

export const AGENT_STEPS = ["behaviour", "conflict", "history"] as const;
export type AgentStep = (typeof AGENT_STEPS)[number];

export const AGENT_VIEWS = ["simple", "advanced"] as const;
export type AgentView = (typeof AGENT_VIEWS)[number];

export const AGENT_STEPMAP = {
  behaviour: 1,
  conflict: 2,
  history: 3,
} as const satisfies Record<AgentStep, number>;

export const LOCKED_RULE_IDS = ["rul_disclosure", "rul_out_of_scope"] as const;
export type LockedRuleId = (typeof LOCKED_RULE_IDS)[number];

export const RULE_COUNT_WARN = 25;
export const GREETING_MAX_SECONDS = 6;
export const WORDS_PER_SECOND = 2.6;
export const REVERT_ALERT_MS = 86_400_000;

export const STAGE_TOOLS: Record<AgentStage, readonly AgentTool[]> = {
  greeting: ["hours"],
  answer: ["prices", "hours", "knowledge"],
  booking: ["booking", "prices"],
  message: ["message"],
  always: ["escalate"],
};

const mannerSchema = z.object({
  tone: z.enum(TONES).default("warm"),
  answerLength: z.enum(ANSWER_LENGTHS).default("short"),
  useCallerName: z.boolean().default(true),
  confidence: z.enum(CONFIDENCE_LEVELS).default("balanced"),
});

const agentRuleSchemaInner = z.object({
  id: z.string().min(1),
  cat: z.enum(RULE_CATEGORIES).default("always"),
  stage: z.enum(AGENT_STAGES).default("answer"),
  enf: z.enum(RULE_ENFORCEMENT).default("soft"),
  on: z.boolean().default(true),
  lock: z.boolean().default(false),
  en: z.string().min(1).default(""),
  rw: z.string().min(1).default(""),
  text: z.string().optional(),
  locked: z.boolean().optional(),
  mechanism: z.enum(RULE_MECHANISMS).nullable().default(null),
  knowledgeRef: z.string().nullable().default(null),
});

export const agentRuleSchema = agentRuleSchemaInner;
export type AgentRule = z.infer<typeof agentRuleSchemaInner>;

const conflictSchema = z.object({
  id: z.string(),
  leftId: z.string(),
  rightId: z.string(),
  kind: z.enum(["pair", "dual-run-disagreement"]),
  resolutions: z.array(z.enum(CONFLICT_RESOLUTIONS)),
});
export type AgentConflict = z.infer<typeof conflictSchema>;

export const agentConfigSchema = z.object({
  templateKind: templateKindSchema.nullable(),
  otherDescription: z.string().nullable(),
  persona: z.string(),
  greeting: z.string(),
  rules: z.array(agentRuleSchemaInner),
  hours: weekGridSchema,
  afterHours: afterHoursSchema,
  hoursConfirmedAt: z.number().nullable(),
  needsConflictCheck: z.boolean(),
  tone: z.enum(TONES).default("warm"),
  answerLength: z.enum(ANSWER_LENGTHS).default("short"),
  useCallerName: z.boolean().default(true),
  confidence: z.enum(CONFIDENCE_LEVELS).default("balanced"),
  surfaceStep: z.enum(AGENT_STEPS).default("behaviour"),
  publishedAt: z.number().nullable().default(null),
  versionNumber: z.number().int().nonnegative().default(0),
  unpublished: z.boolean().default(false),
});
export type AgentConfig = z.infer<typeof agentConfigSchema>;

export type AgentVersion = {
  id: string;
  at: number;
  authorPersonId: string;
  authorName: string;
  snapshot: AgentConfig;
};

function hydrateRule(raw: unknown): AgentRule {
  const row = (raw ?? {}) as Record<string, unknown>;
  const text = typeof row["text"] === "string" ? row["text"] : "";
  const en = typeof row["en"] === "string" && row["en"] ? row["en"] : text;
  const rw = typeof row["rw"] === "string" && row["rw"] ? row["rw"] : en;
  const lock = row["lock"] === true || row["locked"] === true || LOCKED_RULE_IDS.includes(row["id"] as LockedRuleId);
  const parsed = agentRuleSchemaInner.safeParse({
    ...row,
    en: en || "Rule",
    rw: rw || en || "Rule",
    text: en || text || "Rule",
    lock,
    on: row["on"] === false ? false : true,
    enf: lock ? "lock" : row["enf"],
  });
  if (parsed.success) {
    return { ...parsed.data, text: parsed.data.en, lock, enf: lock ? "lock" : parsed.data.enf };
  }
  return {
    id: String(row["id"] ?? "rul_unknown"),
    cat: "always",
    stage: "answer",
    enf: lock ? "lock" : "soft",
    on: true,
    lock,
    en: en || "Rule",
    rw: rw || en || "Rule",
    text: en || "Rule",
    mechanism: null,
    knowledgeRef: null,
  };
}

export function emptyAgentConfig(hours: WeekGrid, afterHours: AfterHoursPolicy = "answer-and-message"): AgentConfig {
  return agentConfigSchema.parse({
    templateKind: null,
    otherDescription: null,
    persona: "",
    greeting: "",
    rules: [],
    hours,
    afterHours,
    hoursConfirmedAt: null,
    needsConflictCheck: false,
    ...mannerSchema.parse({}),
  });
}

export function normalizeAgentConfig(raw: unknown): AgentConfig {
  const fallback = emptyAgentConfig(emptyWeek());
  if (!raw || typeof raw !== "object") return fallback;
  const row = raw as Record<string, unknown>;
  const rules = Array.isArray(row["rules"]) ? row["rules"].map(hydrateRule) : [];
  const merged = {
    ...fallback,
    ...row,
    rules,
    hours: weekGridSchema.safeParse(row["hours"]).success ? row["hours"] : fallback.hours,
  };
  const parsed = agentConfigSchema.safeParse(merged);
  return parsed.success ? parsed.data : fallback;
}

export function ruleText(rule: AgentRule, locale: "en" | "rw" = "en"): string {
  if (locale === "rw" && rule.rw) return rule.rw;
  return rule.en || rule.text || "";
}

export function isLockedRule(rule: Pick<AgentRule, "id" | "lock">): boolean {
  return rule.lock || (LOCKED_RULE_IDS as readonly string[]).includes(rule.id);
}

export function canDeleteRule(rule: Pick<AgentRule, "id" | "lock">): boolean {
  return !isLockedRule(rule);
}

export function removeRule(config: AgentConfig, id: string): AgentConfig {
  const rule = config.rules.find((row) => row.id === id);
  if (!rule || !canDeleteRule(rule)) return config;
  return { ...config, rules: config.rules.filter((row) => row.id !== id), unpublished: true, needsConflictCheck: true };
}

export function enabledRules(config: AgentConfig): AgentRule[] {
  return config.rules.filter((rule) => rule.on);
}

export function activeRuleCount(config: AgentConfig): number {
  return enabledRules(config).length;
}

export function ruleCountWarning(config: AgentConfig): boolean {
  return activeRuleCount(config) > RULE_COUNT_WARN;
}

export function rulesByCategory(config: AgentConfig, cat: RuleCategory): AgentRule[] {
  return config.rules.filter((rule) => rule.cat === cat);
}

export function rulesByStage(config: AgentConfig, stage: AgentStage): AgentRule[] {
  return config.rules.filter((rule) => rule.stage === stage);
}

export function earnsGuaranteed(rule: AgentRule): boolean {
  return rule.enf === "hard" && rule.mechanism != null && (RULE_MECHANISMS as readonly string[]).includes(rule.mechanism);
}

export function badgeTone(rule: AgentRule): RuleEnforcement {
  if (isLockedRule(rule) || rule.enf === "lock") return "lock";
  if (earnsGuaranteed(rule)) return "hard";
  return "soft";
}

export function ruleMissingKnowledge(rule: AgentRule, knownIds: readonly string[]): boolean {
  return rule.knowledgeRef != null && rule.knowledgeRef.length > 0 && !knownIds.includes(rule.knowledgeRef);
}

export function spokenSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.round((words / WORDS_PER_SECOND) * 10) / 10;
}

export function greetingTooLong(text: string): boolean {
  return spokenSeconds(text) > GREETING_MAX_SECONDS;
}

export type ToolPresence = {
  tool: AgentTool;
  available: boolean;
  withheld: boolean;
  reason: "bridal-rule" | "no-such-tool" | null;
};

export function toolsForStage(config: AgentConfig, stage: AgentStage): {
  available: AgentTool[];
  withheld: ToolPresence[];
  all: ToolPresence[];
} {
  const expected = STAGE_TOOLS[stage];
  const bridalOn = config.rules.some(
    (rule) => rule.on && rule.mechanism === "tool-absent" && /bridal/i.test(`${rule.en} ${rule.rw}`),
  );
  const all: ToolPresence[] = AGENT_TOOLS.map((tool) => {
    const onStage = expected.includes(tool);
    if (tool === "prices" && stage === "booking" && bridalOn) {
      return { tool, available: false, withheld: true, reason: "bridal-rule" };
    }
    if (!onStage) {
      return { tool, available: false, withheld: true, reason: "no-such-tool" };
    }
    return { tool, available: true, withheld: false, reason: null };
  });
  return {
    available: all.filter((row) => row.available).map((row) => row.tool),
    withheld: all.filter((row) => row.withheld),
    all,
  };
}

function pairId(left: string, right: string): string {
  return [left, right].sort().join(":");
}

function body(rule: AgentRule, locale: "en" | "rw"): string {
  return locale === "rw" ? rule.rw : rule.en;
}

function looksLikePriceList(rule: AgentRule, locale: "en" | "rw" = "en"): boolean {
  return rule.mechanism === "typed-field-lookup" || /price list|urutonde rw.?ibiciro/i.test(body(rule, locale));
}

function looksLikeBridal(rule: AgentRule, locale: "en" | "rw" = "en"): boolean {
  return /bridal|ubukwe|wedding/i.test(body(rule, locale));
}

function pairsFor(rules: readonly AgentRule[], locale: "en" | "rw"): AgentConflict[] {
  const active = rules.filter((rule) => rule.on);
  const conflicts: AgentConflict[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i]!;
      const b = active[j]!;
      const price = looksLikePriceList(a, locale) ? a : looksLikePriceList(b, locale) ? b : null;
      const bridal = looksLikeBridal(a, locale) ? a : looksLikeBridal(b, locale) ? b : null;
      if (price && bridal && price.id !== bridal.id) {
        conflicts.push({
          id: pairId(price.id, bridal.id),
          leftId: price.id,
          rightId: bridal.id,
          kind: "pair",
          resolutions: ["never", "always", "narrow"],
        });
      }
    }
  }
  return conflicts;
}

export function detectContradictions(rules: readonly AgentRule[]): AgentConflict[] {
  const enPairs = pairsFor(rules, "en");
  const rwPairs = pairsFor(rules, "rw");
  const findings = [...enPairs];
  const enSet = new Set(enPairs.map((row) => row.id));
  const rwSet = new Set(rwPairs.map((row) => row.id));
  let disagree = enSet.size !== rwSet.size;
  if (!disagree) {
    for (const id of enSet) if (!rwSet.has(id)) disagree = true;
  }
  if (disagree) {
    const first = enPairs[0] ?? rwPairs[0];
    findings.push({
      id: first ? `dual:${first.id}` : "dual:none",
      leftId: first?.leftId ?? "",
      rightId: first?.rightId ?? "",
      kind: "dual-run-disagreement",
      resolutions: ["never", "always", "narrow"],
    });
  }
  return findings;
}

export type VersionDiff = {
  added: string[];
  removed: string[];
  unchangedCount: number;
  greetingChanged: boolean;
  hoursChanged: boolean;
};

export function diffVersions(a: AgentConfig, b: AgentConfig): VersionDiff {
  const aIds = new Set(a.rules.map((rule) => rule.id));
  const bIds = new Set(b.rules.map((rule) => rule.id));
  const added = b.rules.filter((rule) => !aIds.has(rule.id)).map((rule) => rule.en);
  const removed = a.rules.filter((rule) => !bIds.has(rule.id)).map((rule) => rule.en);
  const unchangedCount = a.rules.filter((rule) => bIds.has(rule.id)).length;
  return {
    added,
    removed,
    unchangedCount,
    greetingChanged: a.greeting !== b.greeting,
    hoursChanged: JSON.stringify(a.hours) !== JSON.stringify(b.hours),
  };
}

export function agentTileStatus(config: AgentConfig): "draft" | "published" | "conflict" | "too-many" {
  if (ruleCountWarning(config)) return "too-many";
  if (config.needsConflictCheck && detectContradictions(config.rules).length > 0) return "conflict";
  if (config.unpublished || config.publishedAt == null) return "draft";
  return "published";
}

export function deriveAgentStep(config: AgentConfig): AgentStep {
  if (config.surfaceStep === "history" || config.surfaceStep === "conflict" || config.surfaceStep === "behaviour") {
    return config.surfaceStep;
  }
  if (config.needsConflictCheck) return "conflict";
  return "behaviour";
}

export function isAgentStep(value: string): value is AgentStep {
  return (AGENT_STEPS as readonly string[]).includes(value);
}

export function isAgentView(value: string): value is AgentView {
  return (AGENT_VIEWS as readonly string[]).includes(value);
}

export function applyConflictResolution(
  config: AgentConfig,
  conflict: AgentConflict,
  resolution: ConflictResolution,
): AgentConfig {
  const bridal =
    config.rules.find(
      (rule) => looksLikeBridal(rule) && (rule.id === conflict.leftId || rule.id === conflict.rightId),
    ) ?? config.rules.find((rule) => looksLikeBridal(rule));
  const price = config.rules.find((rule) => looksLikePriceList(rule));
  if (resolution === "always" && bridal && canDeleteRule(bridal)) {
    return removeRule(config, bridal.id);
  }
  if (resolution === "narrow" && price) {
    return {
      ...config,
      unpublished: true,
      needsConflictCheck: false,
      rules: config.rules.map((rule) =>
        rule.id === price.id
          ? {
              ...rule,
              en: "Give the price only for single services",
              rw: "Tanga igiciro ku bikorwa by'umuntu umwe gusa",
              text: "Give the price only for single services",
            }
          : rule,
      ),
    };
  }
  return { ...config, needsConflictCheck: false, unpublished: true };
}

export { mannerSchema };
