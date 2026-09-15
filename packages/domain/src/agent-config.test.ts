import { describe, expect, it } from "vitest";
import {
  ADVANCED_VIEW_SHIPS_IN_V1,
  AGENT_EVENTS,
  DOMAIN_DOCUMENTS,
  GREETING_MAX_SECONDS,
  KINYARWANDA_CHECK_POLICY,
  LOCKED_RULE_IDS,
  RULE_COUNT_WARN,
  TOOL_SCOPING_CLAIM,
  WORDS_PER_SECOND,
  activeRuleCount,
  applyConflictResolution,
  canDeleteRule,
  detectContradictions,
  diffVersions,
  badgeTone,
  earnsGuaranteed,
  emptyAgentConfig,
  greetingTooLong,
  normalizeAgentConfig,
  removeRule,
  ruleCountWarning,
  spokenSeconds,
  toolsForStage,
  weekGridFromForm,
  type AgentRule,
} from "./index";
import { clinicWeek, salonWeek } from "./week-grid";

function rule(partial: Partial<AgentRule> & Pick<AgentRule, "id" | "en">): AgentRule {
  return normalizeAgentConfig({
    ...emptyAgentConfig(salonWeek()),
    rules: [partial],
  }).rules[0]!;
}

describe("agent config domain", () => {
  it("records the Prompt 07 named assumptions and stays at twelve documents", () => {
    expect(ADVANCED_VIEW_SHIPS_IN_V1).toBe(true);
    expect(KINYARWANDA_CHECK_POLICY).toBe("dual-run");
    expect(TOOL_SCOPING_CLAIM).toBe("containment");
    expect(DOMAIN_DOCUMENTS).toHaveLength(12);
    expect(AGENT_EVENTS).toContain("agent.published_with_conflict");
    expect(AGENT_EVENTS).toContain("agent.reverted");
  });

  it("measures greeting length in spoken seconds and warns above six", () => {
    expect(WORDS_PER_SECOND).toBe(2.6);
    expect(GREETING_MAX_SECONDS).toBe(6);
    expect(spokenSeconds("Muraho ni Salon Ubwiza")).toBeGreaterThan(0);
    expect(greetingTooLong("one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen")).toBe(true);
    expect(greetingTooLong("Muraho.")).toBe(false);
  });

  it("counts only active rules toward the warning", () => {
    const base = emptyAgentConfig(salonWeek());
    const many = Array.from({ length: RULE_COUNT_WARN + 2 }, (_, i) =>
      rule({ id: `rul_${i}`, en: `Rule ${i}`, on: i !== 0 }),
    );
    const config = { ...base, rules: many };
    expect(activeRuleCount(config)).toBe(RULE_COUNT_WARN + 1);
    expect(ruleCountWarning(config)).toBe(true);
    const off = { ...config, rules: config.rules.map((row, i) => (i < 3 ? { ...row, on: false } : row)) };
    expect(ruleCountWarning(off)).toBe(false);
  });

  it("withholds the pricing tool in booking when the bridal rule is on", () => {
    const config = {
      ...emptyAgentConfig(salonWeek()),
      rules: [
        rule({
          id: "rul_bridal",
          en: "Quote for a bridal party — take a message instead",
          rw: "Ntugire igiciro cy'ubukwe",
          cat: "never",
          stage: "booking",
          enf: "hard",
          mechanism: "tool-absent",
        }),
      ],
    };
    const booking = toolsForStage(config, "booking");
    expect(booking.available).not.toContain("prices");
    expect(booking.withheld.some((row) => row.reason === "bridal-rule")).toBe(true);
  });

  it("detects the price-list vs bridal pair and a dual-run disagreement", () => {
    const rules = [
      rule({
        id: "rul_price_list",
        en: "Give the price only from the price list",
        rw: "Tanga igiciro ku rutonde rw'ibiciro gusa",
        cat: "always",
        mechanism: "typed-field-lookup",
        enf: "hard",
      }),
      rule({
        id: "rul_bridal",
        en: "Quote for a bridal party — take a message instead",
        rw: "Subiza umuntu iyo bavuze ibindi",
        cat: "never",
        mechanism: "tool-absent",
        enf: "hard",
      }),
    ];
    const found = detectContradictions(rules);
    expect(found.some((row) => row.kind === "pair")).toBe(true);
    expect(found.some((row) => row.kind === "dual-run-disagreement")).toBe(true);
    expect(found.find((row) => row.kind === "pair")?.resolutions).toEqual(["never", "always", "narrow"]);
  });

  it("refuses to delete locked rules and keeps a revertible diff", () => {
    const locked = rule({ id: LOCKED_RULE_IDS[0], en: "Say this is an assistant", lock: true, enf: "lock" });
    const extra = rule({ id: "rul_extra", en: "Never promise a discount", cat: "never" });
    const config = { ...emptyAgentConfig(salonWeek()), rules: [locked, extra] };
    expect(canDeleteRule(locked)).toBe(false);
    expect(removeRule(config, locked.id).rules).toHaveLength(2);
    expect(removeRule(config, extra.id).rules).toHaveLength(1);
    const after = applyConflictResolution(config, detectContradictions([extra])[0] ?? {
      id: "x",
      leftId: extra.id,
      rightId: extra.id,
      kind: "pair",
      resolutions: ["never", "always", "narrow"],
    }, "never");
    const diff = diffVersions(config, { ...config, greeting: "Hi" });
    expect(diff.greetingChanged).toBe(true);
    expect(diff.unchangedCount).toBe(2);
    expect(after.needsConflictCheck).toBe(false);
  });

  it("labels warmth as a guideline and price lookup as guaranteed", () => {
    const warm = rule({ id: "rul_warm", en: "Be warm", enf: "soft", mechanism: null });
    const price = rule({
      id: "rul_price_list",
      en: "Give the price only from the price list",
      enf: "hard",
      mechanism: "typed-field-lookup",
    });
    expect(earnsGuaranteed(warm)).toBe(false);
    expect(earnsGuaranteed(price)).toBe(true);
    expect(badgeTone(warm)).toBe("soft");
    expect(badgeTone(price)).toBe("hard");
    expect(badgeTone(rule({ id: LOCKED_RULE_IDS[0], en: "Say this is an assistant", lock: true, enf: "lock" }))).toBe(
      "lock",
    );
    const fakeHard = rule({ id: "rul_fake", en: "Always be right", enf: "hard", mechanism: null });
    expect(earnsGuaranteed(fakeHard)).toBe(false);
    expect(badgeTone(fakeHard)).toBe("soft");
  });
});

describe("weekGridFromForm", () => {
  it("reads posted hours instead of a salon default", () => {
    const form = new FormData();
    form.set("start-mon", "09:00");
    form.set("end-mon", "17:00");
    form.set("closed-sun", "on");
    const next = weekGridFromForm(form, clinicWeek());
    expect(next.mon).toEqual({ open: true, start: "09:00", end: "17:00" });
    expect(next.sun.open).toBe(false);
    expect(next.tue.start).toBe(clinicWeek().tue.start);
  });
});
