import { CARRIER_FORWARDING } from "@subiza/core";
import { describe, expect, it } from "vitest";
import {
  CLEAR_ALL_FORWARDING,
  G22_LOOPBACK_MS,
  PROPAGATION_RETRY_MS,
  REPAIR_LADDER,
  applyVerificationOutcome,
  codeForCondition,
  deactivationCodeFor,
  dispositionForCheck,
  emptyPhoneChannel,
  forwardingCode,
  forwardingCodes,
  interrogateCodeFor,
  isReverificationDue,
  isWakingHour,
  nextReverificationAt,
  observationForForce,
  outcomeFromObservation,
  phoneTileStatus,
  propagationRetry,
  scopeFromChoice,
  shorterForwardingCode,
  skippedSibForwardingCode,
  telHref,
  codeForRepairRung,
} from "./phone-channel";

describe("forwarding codes", () => {
  it("builds the default no-reply string with SIB and a fixed 20s timer", () => {
    const channel = emptyPhoneChannel("250788456123");
    expect(forwardingCode(channel)).toBe("**61*250788456123*11*20#");
  });

  it("returns three codes for everything-I-miss, derived deactivation included", () => {
    const channel = {
      ...emptyPhoneChannel("250788456123"),
      conditions: scopeFromChoice("miss"),
    };
    const rows = forwardingCodes(channel);
    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.condition)).toEqual(["no-reply", "busy", "unreachable"]);
    expect(rows[0]?.code).toBe("**61*250788456123*11*20#");
    expect(rows[1]?.code).toBe("**67*250788456123#");
    expect(rows[2]?.code).toBe("**62*250788456123#");
    expect(rows.map((row) => row.deactivate)).toEqual(["##61#", "##67#", "##62#"]);
  });

  it("derives per-condition deactivation and interrogate codes", () => {
    expect(deactivationCodeFor("no-reply")).toBe("##61#");
    expect(deactivationCodeFor("busy")).toBe("##67#");
    expect(deactivationCodeFor("unreachable")).toBe("##62#");
    expect(deactivationCodeFor("unconditional")).toBe("##21#");
    expect(interrogateCodeFor("no-reply")).toBe("*#61#");
    expect(CLEAR_ALL_FORWARDING).toBe("##002#");
    expect(shorterForwardingCode(emptyPhoneChannel("250788456123"))).toBe("**61*250788456123#");
    expect(skippedSibForwardingCode(emptyPhoneChannel("250788456123"))).toBe("**61*250788456123**20#");
    expect(codeForCondition("unconditional", "250788456123")).toBe("**21*250788456123#");
    const channel = emptyPhoneChannel("250788456123");
    expect(codeForRepairRung(channel, 1)).toBe("**61*250788456123#");
    expect(codeForRepairRung(channel, 2)).toBe("*#61#");
    expect(codeForRepairRung(channel, 3)).toBe("##002#");
    expect(codeForRepairRung(channel, 0)).toBe("**61*250788456123*11*20#");
  });

  it("percent-encodes # as %23 in every tel: href", () => {
    const href = telHref("**61*250788456123*11*20#");
    expect(href.startsWith("tel:")).toBe(true);
    expect(href.includes("#")).toBe(false);
    expect(href).toContain("%23");
  });
});

describe("loopback outcomes", () => {
  it("treats a loopback under 8s as a G22 unconditional registration", () => {
    expect(
      outcomeFromObservation(
        { inboundAt: 1, callerNumber: "250788456123", loopbackMs: 3_000, answeredBy: "us" },
        "250788456123",
      ),
    ).toBe("unconditional");
    expect(G22_LOOPBACK_MS).toBe(8_000);
  });

  it("records caller-id loss when the inbound leg shows the owner's MSISDN", () => {
    expect(
      outcomeFromObservation(
        { inboundAt: 1, callerNumber: "+250788000111", loopbackMs: 21_000, answeredBy: "us" },
        "250788456123",
      ),
    ).toBe("diverted-no-caller-id");
  });

  it("never maps our webhook failure onto not-diverted", () => {
    expect(
      outcomeFromObservation(
        { inboundAt: null, callerNumber: null, loopbackMs: null, answeredBy: "unknown" },
        "250788456123",
      ),
    ).toBe("inconclusive");
    expect(observationForForce("inconclusive", "250788456123", "+250788000111", 1).answeredBy).toBe("unknown");
  });

  it("reaches each of the six outcomes plus G22 via force observations", () => {
    const did = "250788456123";
    const owner = "+250788000111";
    expect(outcomeFromObservation(observationForForce("diverted", did, owner, 1), did)).toBe("diverted");
    expect(outcomeFromObservation(observationForForce("owner-answered", did, owner, 1), did)).toBe("owner-answered");
    expect(outcomeFromObservation(observationForForce("not-diverted", did, owner, 1), did)).toBe("not-diverted");
    expect(outcomeFromObservation(observationForForce("diverted-no-caller-id", did, owner, 1), did)).toBe(
      "diverted-no-caller-id",
    );
    expect(outcomeFromObservation(observationForForce("diverted-elsewhere", did, owner, 1), did)).toBe(
      "diverted-elsewhere",
    );
    expect(outcomeFromObservation(observationForForce("inconclusive", did, owner, 1), did)).toBe("inconclusive");
    expect(outcomeFromObservation(observationForForce("unconditional", did, owner, 1), did)).toBe("unconditional");
  });

  it("rejects the loopback on recurring checks and answers only activation", () => {
    expect(dispositionForCheck("recurring")).toBe("reject-486");
    expect(dispositionForCheck("activation")).toBe("answer");
  });
});

describe("propagation retry", () => {
  it("schedules exactly one automatic retry 60s after the first not-diverted", () => {
    const first = Date.now();
    expect(
      propagationRetry({ attempts: 1, lastAttemptAt: first, lastOutcome: "not-diverted", now: first + 1_000 }),
    ).toEqual({ action: "wait", waitMs: PROPAGATION_RETRY_MS - 1_000 });
    expect(
      propagationRetry({
        attempts: 1,
        lastAttemptAt: first,
        lastOutcome: "not-diverted",
        now: first + PROPAGATION_RETRY_MS,
      }),
    ).toEqual({ action: "retry", waitMs: 0 });
    expect(
      propagationRetry({
        attempts: 2,
        lastAttemptAt: first,
        lastOutcome: "not-diverted",
        now: first + PROPAGATION_RETRY_MS,
      }),
    ).toEqual({ action: "report" });
    expect(
      propagationRetry({ attempts: 1, lastAttemptAt: first, lastOutcome: "inconclusive", now: first + PROPAGATION_RETRY_MS }),
    ).toEqual({ action: "report" });
  });
});

describe("re-verification clock", () => {
  it("never schedules the next check outside waking hours", () => {
    const twoAm = Date.parse("2026-09-14T00:00:00.000Z");
    const next = nextReverificationAt(twoAm);
    expect(isWakingHour(next)).toBe(true);
    expect(next - twoAm).toBeGreaterThanOrEqual(7 * 86_400_000);
  });

  it("is due when nextCheckAt has passed, and the tile turns action then err", () => {
    const now = Date.now();
    const due = {
      ...emptyPhoneChannel("250788456123"),
      verification: {
        ...emptyPhoneChannel("250788456123").verification,
        verifiedAt: now - 8 * 86_400_000,
        lastVerifiedAt: now - 8 * 86_400_000,
        nextCheckAt: now - 1_000,
      },
    };
    expect(isReverificationDue(due, now)).toBe(true);
    expect(phoneTileStatus(due, now)).toBe("action");
    expect(phoneTileStatus({ ...due, forwardingLostAt: now }, now)).toBe("err");
    expect(phoneTileStatus(emptyPhoneChannel("250788456123"), now)).toBe("action");
  });

  it("stamps caller-id survival from the inbound observation", () => {
    const now = 1_700_000_000_000;
    const channel = applyVerificationOutcome(
      emptyPhoneChannel("250788456123"),
      "diverted",
      observationForForce("diverted", "250788456123", "+250788000111", now),
      now,
    );
    expect(channel.verification.callerIdSurvived).toBe(true);
    expect(channel.verification.callerNumber).toBe("250788456123");
    const lost = applyVerificationOutcome(
      emptyPhoneChannel("250788456123"),
      "diverted-no-caller-id",
      observationForForce("diverted-no-caller-id", "250788456123", "+250788000111", now),
      now,
    );
    expect(lost.verification.callerIdSurvived).toBe(false);
  });
});

describe("carrier flag", () => {
  it("stays false until docs/13 Q2 is answered on live SIMs", () => {
    expect(CARRIER_FORWARDING).toBe(false);
  });
});

describe("repair ladder", () => {
  it("is linear, cheapest-first, with prepaid as the single conditional branch", () => {
    expect(REPAIR_LADDER).toEqual(["shorter", "interrogate", "erase", "human", "prepaid"]);
  });
});
