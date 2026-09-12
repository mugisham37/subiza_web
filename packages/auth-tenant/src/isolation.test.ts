import { afterEach, describe, expect, it } from "vitest";
import { createTenantContext, disconnectChannel, readConversation, resumeAgent } from "./dal";
import { asMemberId, asTenantId } from "@subiza/core";
import { resetStore } from "./store";

afterEach(() => {
  resetStore();
});

describe("tenant isolation and grants", () => {
  it("returns notFound for a cross-tenant conversation", () => {
    const ctx = createTenantContext({
      tenantId: asTenantId("tnt_a"),
      memberId: asMemberId("mem_a"),
      personId: "per_a",
      role: "owner",
      strength: "otp",
      actorType: "human",
    });
    expect(() => readConversation(ctx, "tnt_b:conv_1")).toThrowError(/notFound/);
  });

  it("refuses resume on a pause-only grant", () => {
    const ctx = createTenantContext({
      tenantId: asTenantId("tnt_a"),
      memberId: asMemberId("mem_a"),
      personId: "per_a",
      role: "agent",
      strength: "otp",
      actorType: "human",
    });
    expect(() => resumeAgent(ctx)).toThrowError(/notFound/);
  });

  it("refuses disconnect on a connect-only grant", () => {
    const ctx = createTenantContext({
      tenantId: asTenantId("tnt_a"),
      memberId: asMemberId("mem_a"),
      personId: "per_a",
      role: "manager",
      strength: "elevated",
      actorType: "human",
    });
    expect(() => disconnectChannel(ctx)).toThrowError(/notFound/);
  });
});
