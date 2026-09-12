import { describe, expect, it } from "vitest";
import { mintGrant, assertResumeGrant, assertWriteGrant } from "@subiza/core";
import { getTenant } from "./dal";

describe("compile-time isolation", () => {
  it("rejects an unscoped repository call", () => {
    // @ts-expect-error TenantContext is required — a bare id must not compile
    expect(() => getTenant("tnt_other")).toThrow();
  });

  it("rejects a readonly grant at a write site", () => {
    const grant = mintGrant("viewer", "seeAnalytics", "read", "otp");
    if (grant) {
      // @ts-expect-error a read grant is structurally unable to satisfy a write
      assertWriteGrant(grant);
    }
    expect(mintGrant("viewer", "seeAnalytics", "write", "otp")).toBeNull();
  });

  it("rejects a pause-only grant where resume requires full", () => {
    const grant = mintGrant("agent", "takeAgentLiveOrPause", "write", "otp");
    if (grant && grant.scope === "pause-only") {
      // @ts-expect-error pause-only is not full
      assertResumeGrant(grant);
    }
    expect(grant?.scope).toBe("pause-only");
  });
});
