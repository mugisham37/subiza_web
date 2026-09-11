import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "../../..");

function tokens(from: string): Map<string, string> {
  const decls = from.matchAll(/--([a-z0-9-]+)\s*:\s*([^;}]+)/gi);
  const map = new Map<string, string>();
  for (const match of decls) {
    const name = `--${match[1]}`;
    const value = match[2]?.replace(/\s+/g, " ").trim();
    if (name && value) map.set(`${name}:${value}`, value);
  }
  return map;
}

describe("token fidelity", () => {
  it("keeps every HTML custom property at its authored value", () => {
    const html = readFileSync(join(ROOT, "Design/design-system.html"), "utf8");
    const css = readFileSync(
      join(ROOT, "packages/ui/src/tokens/tokens.css"),
      "utf8",
    );
    const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
    const cut = style.indexOf("/* ═══ Base");
    const htmlTokens = tokens(style.slice(0, cut === -1 ? undefined : cut));
    const ported = tokens(css);

    for (const key of htmlTokens.keys()) {
      expect(ported.has(key), `missing ${key}`).toBe(true);
    }
  });
});
