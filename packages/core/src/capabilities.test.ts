import { describe, expect, it } from "vitest";
import {
  canDisconnectChannel,
  canInitiateVoiceCloning,
  canPauseAgent,
  canResumeAgent,
  tenantCapabilities,
  tenantMatrix,
  tenantRoles,
} from "./capabilities";

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
});
