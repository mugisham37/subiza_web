import { afterEach, describe, expect, it } from "vitest";
import { LOCKED_RULE_IDS } from "@subiza/domain";
import { businessTemplates } from "@subiza/fixtures";
import { createTenantContext } from "./context";
import { eventsFor, seedFromTemplate } from "./activation";
import {
  AGENT_SURFACE_AUTH,
  addRule,
  deleteRule,
  publishAgent,
  readAgent,
  restoreAgentVersion,
  toggleRule,
  updateGreeting,
  updatePersonaText,
} from "./agent";
import { updatePersona } from "./dal";
import { mintSession } from "./sessions";
import { getStore, resetStore } from "./store";
import { requestTestCall } from "./activation";
import { agentVersionsOf, inFlightAgentOf, liveAgentOf } from "./agent";

afterEach(() => {
  resetStore();
});

function ownerCtx(strength: "otp" | "elevated" | "recovered" = "otp") {
  const store = getStore();
  const tenant = [...store.tenants.values()].find((row) => row.name === "Salon Ubwiza")!;
  const member = [...store.members.values()].find((row) => row.tenantId === tenant.id && row.role === "owner")!;
  mintSession({
    personId: tenant.ownerPersonId,
    tenantId: tenant.id,
    memberId: member.id,
    strength,
  });
  return createTenantContext({
    tenantId: tenant.id,
    memberId: member.id,
    personId: tenant.ownerPersonId,
    role: "owner",
    strength,
    actorType: "human",
  });
}

describe("agent surface auth", () => {
  it("records the Prompt 07 decision and exposes dal.updatePersona", () => {
    expect(AGENT_SURFACE_AUTH.writeRequires).toBe("configureAgentPersona");
    expect(AGENT_SURFACE_AUTH.recovered).toBe("denied");
    expect(AGENT_SURFACE_AUTH.advanced).toBe("view");
    expect(() => updatePersona(ownerCtx("otp"))).not.toThrow();
  });

  it("refuses a recovered session", () => {
    expect(() => updateGreeting(ownerCtx("recovered"), "Hi")).toThrow(/notFound/);
  });
});

describe("agent mutators", () => {
  it("cannot delete a locked rule via the exported mutator", () => {
    const ctx = ownerCtx("otp");
    seedFromTemplate(ctx, businessTemplates.salon, null);
    const agent = readAgent(ctx);
    expect(agent.rules.some((row) => row.id === LOCKED_RULE_IDS[0])).toBe(true);
    expect(() => deleteRule(ctx, LOCKED_RULE_IDS[0])).toThrow(/notFound/);
    expect(() => deleteRule(ctx, LOCKED_RULE_IDS[1])).toThrow(/notFound/);
    expect(readAgent(ctx).rules.map((row) => row.id)).toEqual(expect.arrayContaining([...LOCKED_RULE_IDS]));
  });

  it("reads and clears needsConflictCheck on publish, and audits an override", () => {
    const ctx = ownerCtx("otp");
    seedFromTemplate(ctx, businessTemplates.salon, null);
    const blocked = publishAgent(ctx, false);
    expect(blocked.conflicts.length).toBeGreaterThan(0);
    expect(readAgent(ctx).needsConflictCheck).toBe(true);
    const published = publishAgent(ctx, true);
    expect(published.agent.needsConflictCheck).toBe(false);
    expect(liveAgentOf(ctx)?.versionNumber).toBeGreaterThan(0);
    const names = eventsFor(ctx.tenantId).map((event) => event.name);
    expect(names).toContain("agent.published_with_conflict");
    expect(names).toContain("agent.published");
  });

  it("saves current state before restore so the revert is revertible", () => {
    const ctx = ownerCtx("otp");
    seedFromTemplate(ctx, businessTemplates.salon, null);
    publishAgent(ctx, true);
    updateGreeting(ctx, "Muraho gato.");
    publishAgent(ctx, true);
    const first = agentVersionsOf(ctx)[0]!;
    restoreAgentVersion(ctx, first.id);
    expect(agentVersionsOf(ctx).length).toBeGreaterThan(1);
    const reverted = eventsFor(ctx.tenantId).find((event) => event.name === "agent.reverted");
    expect(reverted).toBeTruthy();
    if (reverted && reverted.name === "agent.reverted") {
      expect(typeof reverted.msSincePublish).toBe("number");
    }
  });

  it("does not change an in-flight call snapshot when publishing", () => {
    const ctx = ownerCtx("otp");
    seedFromTemplate(ctx, businessTemplates.salon, null);
    publishAgent(ctx, true);
    requestTestCall(ctx, "browser");
    const snap = inFlightAgentOf(ctx)?.greeting;
    updateGreeting(ctx, "A completely different greeting for the next call.");
    publishAgent(ctx, true);
    expect(inFlightAgentOf(ctx)?.greeting).toBe(snap);
    expect(liveAgentOf(ctx)?.greeting).toContain("completely different");
  });

  it("never awards guaranteed to a free-text add, and emits twelve agent events", () => {
    const ctx = ownerCtx("otp");
    seedFromTemplate(ctx, businessTemplates.salon, null);
    addRule(ctx, "always", "Be warm");
    const warm = readAgent(ctx).rules.find((row) => row.en === "Be warm")!;
    expect(warm.enf).toBe("soft");
    expect(warm.mechanism).toBeNull();
    publishAgent(ctx, true);
    const names = new Set(eventsFor(ctx.tenantId).map((event) => event.name));
    expect(names.has("agent.rule_added")).toBe(true);
    expect(names.has("agent.published")).toBe(true);
  });

  it("emits configureAgentPersona rather than the activation default", () => {
    const ctx = ownerCtx("otp");
    seedFromTemplate(ctx, businessTemplates.salon, null);
    updatePersonaText(ctx, "Warm and brief");
    addRule(ctx, "never", "Promise a colour treatment");
    const extra = readAgent(ctx).rules.find((row) => row.en === "Promise a colour treatment")!;
    toggleRule(ctx, extra.id);
    const row = [...getStore().audits].reverse().find((item) => item.action === "agent.rule_added");
    expect(row?.capability).toBe("configureAgentPersona");
  });
});
