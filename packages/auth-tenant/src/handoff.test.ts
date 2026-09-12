import { describe, expect, it } from "vitest";
import { asTenantId } from "@subiza/core";
import { consumeHandoff, issueHandoff } from "./handoff";

describe("cross-origin handoff", () => {
  it("is single-use and rejects replay", () => {
    const token = issueHandoff("sess_1", asTenantId("tnt_1"));
    expect(consumeHandoff(token)?.sessionId).toBe("sess_1");
    expect(consumeHandoff(token)).toBeNull();
  });

  it("rejects a forged token", () => {
    expect(consumeHandoff("forged.token")).toBeNull();
  });
});
