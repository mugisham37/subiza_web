import { describe, expect, it } from "vitest";
import { cooldownHours, executeNumberChange, lengthenCooldown, openRecovery } from "./recovery";

describe("recovery timing", () => {
  it("never executes a number change under 72 hours", () => {
    const row = openRecovery({ e164: "+250788111000", kind: "changed", evidenceTier: "a" });
    expect(row.cooldownHours).toBe(72);
    expect(() =>
      executeNumberChange({ id: row.id, actor: "superAdmin", second: "approver", now: Date.now() + 71 * 3600000 }),
    ).toThrow(/hold/);
  });

  it("holds seven days without Tier-A evidence", () => {
    expect(cooldownHours("none")).toBe(168);
    expect(cooldownHours("b")).toBe(168);
  });

  it("forbids shortening a cooldown", () => {
    const row = openRecovery({ e164: "+250788111001", kind: "lost", evidenceTier: "a" });
    expect(() => lengthenCooldown(row.id, 24)).toThrow(/cooldown-immutable/);
    expect(lengthenCooldown(row.id, 96).cooldownHours).toBe(96);
  });
});
