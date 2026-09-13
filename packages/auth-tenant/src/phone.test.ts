import { afterEach, describe, expect, it } from "vitest";
import { asMemberId, asTenantId } from "@subiza/core";
import { createTenantContext } from "./context";
import { eventsFor, verifyForwarding } from "./activation";
import {
  PHONE_SURFACE_AUTH,
  changeForwarding,
  choosePhonePath,
  requestPhoneVerification,
  settlePhoneVerification,
} from "./phone";
import { mintSession } from "./sessions";
import { getStore, resetStore } from "./store";

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

describe("verifyForwarding is no longer a fiction", () => {
  it("can fail when forceState is not a pass", () => {
    const ctx = ownerCtx();
    const failed = verifyForwarding(ctx, "not-diverted");
    expect(failed.verification.verifiedAt).toBeNull();
    expect(failed.verification.outcome).toBe("not-diverted");
  });

  it("does not stamp success unconditionally — default still observes a diverted loopback", () => {
    const ctx = ownerCtx();
    const passed = verifyForwarding(ctx);
    expect(passed.verification.verifiedAt).not.toBeNull();
    expect(passed.verification.outcome).toBe("diverted");
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "phone.verification_attempted")).toBe(true);
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "activation.forwarding_verified")).toBe(true);
  });
});

describe("changeForwarding", () => {
  it("exists and accepts otp for first-time surface writes", () => {
    expect(PHONE_SURFACE_AUTH.decision).toBe("b");
    const ctx = ownerCtx("otp");
    const next = changeForwarding(ctx, { path: "forwarding", surfaceStep: "scope" });
    expect(next.path).toBe("forwarding");
    expect(next.surfaceStep).toBe("scope");
  });

  it("denies a destination change on an otp session", () => {
    const ctx = ownerCtx("otp");
    expect(() => changeForwarding(ctx, { subizaNumber: "250788000999" }, true)).toThrow(/notFound/);
  });

  it("reaches each forced verification outcome from the surface machine", () => {
    const ctx = ownerCtx();
    choosePhonePath(ctx, "forwarding");
    const outcomes = [
      "diverted",
      "owner-answered",
      "not-diverted",
      "diverted-no-caller-id",
      "diverted-elsewhere",
      "inconclusive",
      "unconditional",
    ] as const;
    for (const outcome of outcomes) {
      requestPhoneVerification(ctx);
      const settled = settlePhoneVerification(ctx, outcome);
      if (outcome === "not-diverted") {
        expect(settled.verification.status === "retrying" || settled.verification.outcome === "not-diverted").toBe(true);
      } else {
        expect(settled.verification.outcome).toBe(outcome);
      }
    }
  });

  it("does not stamp a pass unless a call was placed or forceState was set", () => {
    const ctx = ownerCtx();
    choosePhonePath(ctx, "forwarding");
    const idle = settlePhoneVerification(ctx);
    expect(idle.verification.verifiedAt).toBeNull();
    expect(idle.verification.outcome).toBeNull();
  });

  it("cannot be invoked across tenants", () => {
    const other = createTenantContext({
      tenantId: asTenantId("tnt_forged"),
      memberId: asMemberId("mem_forged"),
      personId: "per_forged",
      role: "owner",
      strength: "otp",
      actorType: "human",
    });
    expect(() => changeForwarding(other, { path: "forwarding" })).toThrow(/notFound/);
  });
});
