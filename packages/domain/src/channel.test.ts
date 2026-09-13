import { describe, expect, it } from "vitest";
import {
  CHANNEL_EVENTS,
  CODE_TTL_SECONDS,
  DOMAIN_DOCUMENTS,
  EMBEDDED_SIGNUP_VERSION,
  HUMAN_AGENT_TAG,
  WA_TIER_LADDER,
  canTrainOn,
  channelEventSchema,
  codeIsExpired,
  emptyChannels,
  isAgentOutbound,
  mustOfferMigration,
  resolvePrivateReplyOutcome,
  type AgentOutboundMessage,
  type HumanOutboundMessage,
} from "./index";

describe("messaging channel domain", () => {
  it("registers MessagingChannels and keeps Embedded Signup on v4", () => {
    expect(DOMAIN_DOCUMENTS).toContain("MessagingChannels");
    expect(EMBEDDED_SIGNUP_VERSION).toBe(4);
    expect(WA_TIER_LADDER).toEqual([250, 2_000, 10_000, 100_000]);
    expect(emptyChannels().whatsapp.step).toBe("wa1");
  });

  it("never trains on WhatsApp-sourced data", () => {
    expect(canTrainOn("whatsapp")).toBe(false);
    expect(canTrainOn("telegram")).toBe(true);
    expect(canTrainOn("phone")).toBe(true);
  });

  it("expires a signup code after the TTL and never treats timeout as retryable", () => {
    const issued = 1_000;
    expect(codeIsExpired(issued, issued + CODE_TTL_SECONDS * 1_000)).toBe(false);
    expect(codeIsExpired(issued, issued + CODE_TTL_SECONDS * 1_000 + 1)).toBe(true);
    expect(resolvePrivateReplyOutcome("timeout")).toBe("do-not-resend");
    expect(resolvePrivateReplyOutcome("unknown")).toBe("do-not-resend");
    expect(resolvePrivateReplyOutcome("ok")).toBe("sent");
  });

  it("keeps HUMAN_AGENT off the agent path and owes a migration offer", () => {
    const agent: AgentOutboundMessage = { text: "hello", source: "instagram" };
    const human: HumanOutboundMessage = { text: "hello", source: "instagram", tag: HUMAN_AGENT_TAG };
    expect(isAgentOutbound(agent)).toBe(true);
    expect(isAgentOutbound(human)).toBe(false);
    expect(mustOfferMigration(true, true)).toBe(true);
    expect(mustOfferMigration(false, true)).toBe(false);
  });

  it("names channel events", () => {
    expect(CHANNEL_EVENTS).toContain("whatsapp.embedded_signup_abandoned");
    expect(CHANNEL_EVENTS).toContain("instagram.private_reply_recorded");
    expect(
      channelEventSchema.safeParse({
        name: "whatsapp.embedded_signup_abandoned",
        metaScreen: "phone-number",
        errorCode: null,
        sessionId: "s",
      }).success,
    ).toBe(true);
  });
});
