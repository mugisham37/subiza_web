import { describe, expect, it } from "vitest";
import { emptyAgentConfig } from "./agent-config";
import { canVisit, deriveStep, emptyCursor, stepSatisfied } from "./cursor";
import { emptyGoLive } from "./go-live";
import { emptyKnowledge, unreadPrice } from "./knowledge";
import { emptyPhoneChannel } from "./phone-channel";
import { canFireActivated, emptyTestCall } from "./test-call";
import { applyCorrection, unreadableBecomesUnknown } from "./transitions";
import { emptyVoiceSelection } from "./voice";
import { salonWeek } from "./week-grid";

describe("activation seam", () => {
  it("derives the first unsatisfied step and never skips escalation", () => {
    const docs = {
      agent: null,
      knowledge: null,
      voice: null,
      testCall: null,
      escalation: null,
      phone: null,
      channels: null,
      goLive: null,
    };
    expect(deriveStep(docs, [])).toBe("business");
    expect(stepSatisfied("escalation", docs, ["escalation"])).toBe(false);
    expect(canVisit("scope", docs, ["escalation"])).toBe(false);
  });

  it("requires both call completed and transcript viewed before activation", () => {
    const call = emptyTestCall();
    call.id = "tst_1";
    call.status = "ended";
    call.endedAt = 1;
    call.turns = [
      {
        id: "trn_1",
        speaker: "ai",
        text: "Muraho",
        translation: null,
        atSeconds: 1,
        interim: false,
        asrConfidence: 0.9,
        sourceKind: null,
        sourceLabel: null,
        vote: null,
        correctedText: null,
      },
    ];
    expect(canFireActivated(call)).toBe(false);
    call.transcriptViewedAt = 2;
    expect(canFireActivated(call)).toBe(true);
  });

  it("turns an unreadable price into ? and escalates that service", () => {
    const row = unreadableBecomesUnknown({
      id: "prc_1",
      name: "Braids",
      amount: 15000,
      currency: "RWF",
      confidence: 0.2,
      confirmed: false,
      escalateIfUnknown: false,
    });
    expect(row.amount).toBeNull();
    expect(row.escalateIfUnknown).toBe(true);
    expect(unreadPrice("Braids", 0).amount).toBeNull();
  });

  it("fans a correction into hours and pronunciation", () => {
    const agent = emptyAgentConfig(salonWeek());
    const knowledge = emptyKnowledge();
    const result = applyCorrection({
      turn: {
        id: "trn_2",
        speaker: "ai",
        text: "Turafunga saa mbiri z'ijoro ku wa gatandatu.",
        translation: "We close at 8pm on Saturday.",
        atSeconds: 19,
        interim: false,
        asrConfidence: 0.4,
        sourceKind: "hours",
        sourceLabel: "Saturday",
        vote: "down",
        correctedText: null,
      },
      correctedText: "Ku wa gatandatu dufunga saa kumi n'ebyiri z'umugoroba.",
      knowledge,
      agent,
    });
    expect(result.targets).toContain("pronunciation");
    expect(result.agent.needsConflictCheck).toBe(true);
    expect(emptyCursor().skipSet).toEqual([]);
    expect(emptyVoiceSelection("rw").cloneOffered).toBe(false);
    expect(emptyGoLive().rung).toBe("sandbox");
    expect(emptyPhoneChannel("250788456123").openingHoursForwardPolicy).toBe("ring-through");
  });
});
