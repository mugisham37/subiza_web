import { afterEach, describe, expect, it } from "vitest";
import { peekLastOtpForTests } from "./delivery";
import { sendCode, verifyCode } from "./engine";
import { numberFailCount } from "./rates";
import { getStore, resetStore } from "./store";

afterEach(() => {
  resetStore();
});

const base = {
  ip: "10.0.0.1",
  device: "dev-1",
  locale: "rw",
  entry: "landing" as const,
};

describe("unified send + verify", () => {
  it("always sends and never discloses whether the number has an account", () => {
    const known = sendCode({ ...base, phone: "0788 000 111" });
    const unknown = sendCode({ ...base, phone: "0788 123 456", device: "dev-2" });
    expect(known.ok).toBe(true);
    expect(unknown.ok).toBe(true);
    if (known.ok && unknown.ok) {
      expect(known.preauth.step).toBe("code");
      expect(unknown.preauth.step).toBe("code");
      expect(JSON.stringify({ via: known.via, retry: known.retryAfterSec })).toBe(
        JSON.stringify({ via: unknown.via, retry: unknown.retryAfterSec }),
      );
    }
  });

  it("refuses a foreign number before any spend", () => {
    const result = sendCode({ ...base, phone: "+1 202 555 0100" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("not-rwandan");
  });

  it("keeps the verify-failure counter across resend", () => {
    const first = sendCode({ ...base, phone: "0788 555 000" });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    for (let i = 0; i < 3; i += 1) {
      expect(verifyCode(first.preauth.id, "111111").ok).toBe(false);
    }
    getStore().buckets.delete("send:num:+250788555000:30");
    const again = sendCode({
      ...base,
      phone: "0788 555 000",
      preauthId: first.preauth.id,
    });
    expect(again.ok).toBe(true);
    if (!again.ok) return;
    expect(numberFailCount("+250788555000")).toBe(3);
    for (let i = 0; i < 3; i += 1) {
      expect(verifyCode(again.preauth.id, "222222").ok).toBe(false);
    }
    const blocked = verifyCode(again.preauth.id, "333333");
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.reason).toBe("throttled");
  });

  it("accepts a leading-zero code and then branches after verification", () => {
    const sent = sendCode({ ...base, phone: "0788 123 999" });
    expect(sent.ok).toBe(true);
    if (!sent.ok) return;
    const code = peekLastOtpForTests();
    const verified = verifyCode(sent.preauth.id, code);
    expect(verified.ok).toBe(true);
    if (verified.ok) expect(verified.branch).toBe("signup");
  });

  it("sends to a known number without naming a business, then offers the chooser", () => {
    const sent = sendCode({ ...base, phone: "0788 000 111" });
    expect(sent.ok).toBe(true);
    if (!sent.ok) return;
    const verified = verifyCode(sent.preauth.id, peekLastOtpForTests());
    expect(verified.ok).toBe(true);
    if (verified.ok) expect(verified.branch).toBe("many");
  });
});
