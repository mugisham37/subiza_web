import { afterEach, describe, expect, it } from "vitest";
import { asMemberId, asTenantId } from "@subiza/core";
import { businessTemplates } from "@subiza/fixtures";
import {
  advanceTestCall,
  currentStep,
  destinationForTestCall,
  eventsFor,
  requestTestCall,
  saveCorrection,
  saveEscalation,
  saveVoice,
  seedFromTemplate,
  setGoLive,
  skipStep,
  viewTranscript,
} from "./activation";
import { createTenantContext } from "./context";
import { mintSession } from "./sessions";
import { getStore, resetStore } from "./store";

afterEach(() => {
  resetStore();
});

function ownerCtx() {
  const store = getStore();
  const tenant = [...store.tenants.values()].find((row) => row.name === "Salon Ubwiza")!;
  const member = [...store.members.values()].find((row) => row.tenantId === tenant.id && row.role === "owner")!;
  mintSession({
    personId: tenant.ownerPersonId,
    tenantId: tenant.id,
    memberId: member.id,
    strength: "otp",
  });
  return createTenantContext({
    tenantId: tenant.id,
    memberId: member.id,
    personId: tenant.ownerPersonId,
    role: "owner",
    strength: "otp",
    actorType: "human",
  });
}

describe("activation DAL", () => {
  it("fires tenant.activated once, only after the transcript is viewed", () => {
    const ctx = ownerCtx();
    seedFromTemplate(ctx, businessTemplates.salon, null);
    saveVoice(ctx, "warm-female");
    const dest = destinationForTestCall(ctx);
    expect(dest.startsWith("+250")).toBe(true);
    requestTestCall(ctx, "outbound");
    advanceTestCall(ctx, "live");
    const ended = advanceTestCall(ctx, "ended");
    expect(ended.status).toBe("ended");
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "tenant.activated")).toBe(false);
    const first = viewTranscript(ctx);
    const second = viewTranscript(ctx);
    expect(first.activated).toBe(true);
    expect(second.activated).toBe(true);
    expect(eventsFor(ctx.tenantId).filter((event) => event.name === "tenant.activated")).toHaveLength(1);
  });

  it("refuses a second in-flight call and will not reach scope without escalation", () => {
    const ctx = ownerCtx();
    seedFromTemplate(ctx, businessTemplates.salon, null);
    requestTestCall(ctx, "outbound");
    expect(() => requestTestCall(ctx, "browser")).toThrow(/in-flight/);
    expect(() => skipStep(ctx, "escalation")).toThrow(/blocking/);
    expect(() => setGoLive(ctx, "closed-only")).toThrow(/blocking/);
    saveEscalation(ctx, "+250788000111", "message-with-time");
    const live = setGoLive(ctx, "closed-only");
    expect(live.rung).toBe("closed-only");
    expect(currentStep(ctx)).not.toBe("escalation");
  });

  it("starts the browser route live without occupying inbound", () => {
    const ctx = ownerCtx();
    seedFromTemplate(ctx, businessTemplates.salon, null);
    const inbound = requestTestCall(ctx, "inbound");
    expect(inbound.status).toBe("ready");
    const browser = requestTestCall(ctx, "browser");
    expect(browser.status).toBe("live");
    expect(() => requestTestCall(ctx, "outbound")).toThrow(/in-flight/);
  });

  it("writes a correction through to the next call's knowledge", () => {
    const ctx = ownerCtx();
    seedFromTemplate(ctx, businessTemplates.salon, null);
    requestTestCall(ctx, "inbound");
    const call = advanceTestCall(ctx, "ended");
    const ai = call.turns.find((turn) => turn.speaker === "ai" && turn.sourceKind === "hours");
    expect(ai).toBeTruthy();
    saveCorrection(ctx, ai!.id, "Ku wa gatandatu dufunga saa kumi n'ebyiri z'umugoroba.");
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "activation.correction_made")).toBe(true);
  });
});

describe("isolation", () => {
  it("cannot resume another tenant's draft", () => {
    const ctx = ownerCtx();
    seedFromTemplate(ctx, businessTemplates.salon, null);
    const other = createTenantContext({
      tenantId: asTenantId("tnt_forged"),
      memberId: asMemberId("mem_forged"),
      personId: "per_forged",
      role: "owner",
      strength: "otp",
      actorType: "human",
    });
    expect(() => destinationForTestCall(other)).toThrow(/notFound/);
  });
});
