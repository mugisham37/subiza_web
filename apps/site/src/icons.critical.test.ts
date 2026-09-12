import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CRITICAL_ICON_COUNT, CRITICAL_ICON_NAMES } from "@subiza/ui";
import { describe, expect, it } from "vitest";

describe("critical sprite", () => {
  it("stays at eight above-the-fold symbols", () => {
    expect(CRITICAL_ICON_NAMES).toHaveLength(CRITICAL_ICON_COUNT);
    const svg = readFileSync(
      join(import.meta.dirname, "../../../packages/ui/src/icons/sprite-critical.svg"),
      "utf8",
    );
    expect([...svg.matchAll(/<symbol /g)]).toHaveLength(CRITICAL_ICON_COUNT);
  });
});
