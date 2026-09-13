import { describe, expect, it } from "vitest";
import { HUMAN_HANDOFF_AT_MS, RESUME_NUDGE_AT_MS, dueResumeAction } from "./resume";

describe("resume nudges", () => {
  it("sends SMS at 1h, WhatsApp at 24h and 72h, then a human at day 30", () => {
    const start = 0;
    expect(dueResumeAction(start, 3_599_000, 0)).toBeNull();
    expect(dueResumeAction(start, RESUME_NUDGE_AT_MS[0], 0)).toBe("sms");
    expect(dueResumeAction(start, RESUME_NUDGE_AT_MS[1], 1)).toBe("whatsapp");
    expect(dueResumeAction(start, RESUME_NUDGE_AT_MS[2], 2)).toBe("whatsapp");
    expect(dueResumeAction(start, RESUME_NUDGE_AT_MS[2], 3)).toBeNull();
    expect(dueResumeAction(start, HUMAN_HANDOFF_AT_MS, 3)).toBe("human");
  });
});
