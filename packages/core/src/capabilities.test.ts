import { describe, expect, it } from "vitest";
import {
  can,
  canDisconnectChannel,
  canInitiateVoiceCloning,
  canPauseAgent,
  canRead,
  canResumeAgent,
  tenantCapabilities,
  tenantMatrix,
  tenantRoles,
} from "./capabilities";
import {
  enforcementSites,
  mintGrant,
  recoveredDeniedCapabilities,
} from "./grants";

describe("tenant capability matrix", () => {
  it("covers every role and every capability", () => {
    for (const role of tenantRoles) {
      for (const capability of tenantCapabilities) {
        expect(tenantMatrix[role][capability]).toBeDefined();
      }
    }
  });

  it("allows only the Owner to initiate voice cloning", () => {
    expect(canInitiateVoiceCloning("owner")).toBe(true);
    expect(canInitiateVoiceCloning("manager")).toBe(false);
    expect(canInitiateVoiceCloning("agent")).toBe(false);
    expect(canInitiateVoiceCloning("viewer")).toBe(false);
  });

  it("lets a Manager connect a channel but never disconnect one", () => {
    expect(canDisconnectChannel("owner")).toBe(true);
    expect(canDisconnectChannel("manager")).toBe(false);
  });

  it("lets any operating staff pause, and only Owner or Manager resume", () => {
    expect(canPauseAgent("owner")).toBe(true);
    expect(canPauseAgent("manager")).toBe(true);
    expect(canPauseAgent("agent")).toBe(true);
    expect(canPauseAgent("viewer")).toBe(false);
    expect(canResumeAgent("owner")).toBe(true);
    expect(canResumeAgent("manager")).toBe(true);
    expect(canResumeAgent("agent")).toBe(false);
  });

  it("does not treat a readonly grade as write access", () => {
    expect(can("viewer", "seeAnalytics")).toBe(false);
    expect(canRead("viewer", "seeAnalytics")).toBe(true);
    expect(mintGrant("viewer", "seeAnalytics", "write", "otp")).toBeNull();
    expect(mintGrant("viewer", "seeAnalytics", "read", "otp")?.mode).toBe("read");
  });

  it("refuses a pause-only grant where resume requires full", () => {
    const pause = mintGrant("agent", "takeAgentLiveOrPause", "write", "otp");
    expect(pause?.scope).toBe("pause-only");
    expect(mintGrant("owner", "takeAgentLiveOrPause", "write", "otp")?.scope).toBe("full");
  });

  it("denies elevated capabilities on a recovered session", () => {
    for (const capability of recoveredDeniedCapabilities) {
      expect(mintGrant("owner", capability, "write", "recovered")).toBeNull();
    }
    expect(mintGrant("owner", "takeAgentLiveOrPause", "write", "recovered")?.mode).toBe("write");
    expect(mintGrant("owner", "exportConversationData", "write", "otp")).toBeNull();
    expect(mintGrant("owner", "exportConversationData", "write", "elevated")?.mode).toBe("write");
  });

  it("has at least one enforcement site for every capability", () => {
    for (const capability of tenantCapabilities) {
      expect(enforcementSites[capability].length).toBeGreaterThan(0);
    }
  });
});
