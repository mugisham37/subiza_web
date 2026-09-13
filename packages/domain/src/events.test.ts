import { describe, expect, it } from "vitest";
import { ACTIVATION_EVENTS, PHONE_EVENTS, activationEventSchema, phoneEventSchema } from "./events";
import { DOMAIN_DOCUMENTS } from "./index";

describe("instrumentation", () => {
  it("names every atlas §11 event and holds twelve documents", () => {
    expect(DOMAIN_DOCUMENTS).toHaveLength(12);
    expect(ACTIVATION_EVENTS).toContain("tenant.activated");
    const parsed = activationEventSchema.safeParse({
      name: "tenant.activated",
      timeSinceSignupMs: 1,
      stepsCompleted: 6,
      corrections: 0,
    });
    expect(parsed.success).toBe(true);
  });

  it("names every atlas Flow 07 §12 event", () => {
    expect(PHONE_EVENTS).toEqual([
      "phone.path_chosen",
      "phone.network_detected",
      "phone.code_shown",
      "phone.verification_attempted",
      "phone.verification_result",
      "phone.caller_id_preserved",
      "phone.assisted_requested",
      "phone.forwarding_lost_detected",
      "number.provisioning_state_changed",
    ]);
    expect(
      phoneEventSchema.safeParse({ name: "phone.verification_result", outcome: "inconclusive" }).success,
    ).toBe(true);
  });
});
