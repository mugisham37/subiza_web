import { afterEach, describe, expect, it } from "vitest";
import { createTenantContext } from "./context";
import { eventsFor } from "./activation";
import {
  CHANNEL_SURFACE_AUTH,
  abandonEmbeddedSignup,
  answerWhatsAppPreflight,
  checkInstagramAccount,
  claimPrivateReply,
  createTelegramBot,
  detectSilentDisconnect,
  elevateForChannelConnect,
  enqueueWhatsAppOnboarding,
  enqueueWebhook,
  exchangeEmbeddedSignup,
  expireSignupCode,
  readChannels,
  settlePrivateReply,
  startEmbeddedSignup,
  trainingCorpusFor,
} from "./channels";
import { mintSession } from "./sessions";
import { getStore, resetStore } from "./store";
import { ingestMetaWebhook, metaHandshake, verifyMetaSignature } from "./webhooks";
import { createHmac } from "node:crypto";
import { ONBOARDING_WEEKLY_CAP } from "@subiza/domain";

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

describe("channel surface auth", () => {
  it("records the Prompt 06 decision and steps otp up to elevated", () => {
    expect(CHANNEL_SURFACE_AUTH.connectRequires).toBe("elevated");
    expect(CHANNEL_SURFACE_AUTH.disconnectRequires).toBe("elevated-full");
    expect(CHANNEL_SURFACE_AUTH.recovered).toBe("denied");
    const next = elevateForChannelConnect(ownerCtx("otp"));
    expect(next.ctx.strength).toBe("elevated");
    expect(next.sessionId).toBeTruthy();
  });

  it("refuses a recovered session", () => {
    expect(() => elevateForChannelConnect(ownerCtx("recovered"))).toThrow(/notFound/);
  });
});

describe("telegram and whatsapp machines", () => {
  it("creates a managed Telegram bot and records the mode", () => {
    const ctx = elevateForChannelConnect(ownerCtx("otp")).ctx;
    const next = createTelegramBot(ctx, "managed", "salonubwiza_bot");
    expect(next.telegram.status).toBe("working");
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "telegram.bot_created")).toBe(true);
  });

  it("exchanges a signup code once and never retries after expiry", () => {
    const ctx = elevateForChannelConnect(ownerCtx("otp")).ctx;
    const started = startEmbeddedSignup(ctx);
    const codeId = started.whatsapp.lastSessionId!;
    const first = exchangeEmbeddedSignup(ctx, codeId);
    expect(first.whatsapp.step).toBe("wa6");
    expect(first.whatsapp.status).toBe("waiting");
    expireSignupCode(codeId);
    const again = exchangeEmbeddedSignup(ctx, codeId);
    expect(again.whatsapp.codeExpired).toBe(true);
    expect(again.whatsapp.step).toBe("wa5");
  });

  it("narrates abandonment from Meta's current_step", () => {
    const ctx = elevateForChannelConnect(ownerCtx("otp")).ctx;
    const next = abandonEmbeddedSignup(ctx, { metaScreen: "phone-number", sessionId: "sess" });
    expect(next.whatsapp.lastMetaScreen).toBe("phone-number");
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "whatsapp.embedded_signup_abandoned")).toBe(true);
  });

  it("queues when the weekly onboarding cap is full", () => {
    const ctx = elevateForChannelConnect(ownerCtx("otp")).ctx;
    const store = getStore();
    for (let i = 0; i < ONBOARDING_WEEKLY_CAP; i += 1) {
      store.onboardingAttempts.push({ tenantId: `other-${i}`, at: Date.now() });
    }
    const queued = enqueueWhatsAppOnboarding(ctx);
    expect(queued.whatsapp.queuePosition).toBe(ONBOARDING_WEEKLY_CAP + 1);
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "channel.onboarding_queued")).toBe(true);
  });
});

describe("isolation, training, and private replies", () => {
  it("breaks Instagram without touching WhatsApp or Telegram", () => {
    const ctx = elevateForChannelConnect(ownerCtx("otp")).ctx;
    createTelegramBot(ctx, "managed", "salonubwiza_bot");
    answerWhatsAppPreflight(ctx, { alreadyOnWa: false, rdb: true, number: "788123456" });
    const started = startEmbeddedSignup(ctx);
    exchangeEmbeddedSignup(ctx, started.whatsapp.lastSessionId!);
    checkInstagramAccount(ctx, true);
    detectSilentDisconnect(ctx, "instagram");
    const next = readChannels(ctx);
    expect(next.instagram.status).toBe("err");
    expect(next.telegram.status).toBe("working");
    expect(next.whatsapp.status).toBe("waiting");
    expect(next.brokenKind).toBe("instagram");
  });

  it("writes a private-reply claim before send and refuses a second", () => {
    const ctx = elevateForChannelConnect(ownerCtx("otp")).ctx;
    const first = claimPrivateReply(ctx, "c1");
    expect(first.status).toBe("claimed");
    const second = claimPrivateReply(ctx, "c1");
    expect(second.status).toBe("do-not-resend");
    expect(settlePrivateReply(ctx, "c1", "timeout").status).toBe("do-not-resend");
    expect(eventsFor(ctx.tenantId).some((event) => event.name === "instagram.private_reply_recorded")).toBe(true);
  });

  it("blocks cross-tenant training on WhatsApp data", () => {
    expect(trainingCorpusFor("whatsapp")).toEqual([]);
    expect(trainingCorpusFor("telegram").length).toBeGreaterThan(0);
  });
});

describe("webhooks", () => {
  it("verifies the raw-body signature and orders by timestamp", () => {
    const secret = "test-meta-secret";
    const raw = JSON.stringify({
      entry: [
        { changes: [{ value: { messages: [{ id: "b", timestamp: "20" }, { id: "a", timestamp: "10" }] } }] },
      ],
    });
    const header = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
    expect(verifyMetaSignature(raw, header, secret)).toBe(true);
    expect(verifyMetaSignature("{tampered}", header, secret)).toBe(false);
    ingestMetaWebhook(raw, "t1");
    ingestMetaWebhook(raw, "t1");
    const inbox = getStore().webhookInbox;
    expect(inbox.map((row) => row.id)).toEqual(["a", "b"]);
    expect(enqueueWebhook({ id: "a", timestamp: 1, tenantId: "t1", kind: "whatsapp" }).duplicate).toBe(true);
  });

  it("answers the Meta handshake", () => {
    const ok = metaHandshake(new URLSearchParams("hub.mode=subscribe&hub.verify_token=tok&hub.challenge=99"), "tok");
    expect(ok).toEqual({ ok: true, challenge: "99" });
  });
});
