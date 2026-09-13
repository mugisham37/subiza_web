import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const FIGURES = [/\b180\b/, /\b24\b/, /\b250\b/, /\b1,?000\b/, /\b30\b/];
const INSTANT = /\binstant(?:ly)?\b/i;
const QUOTE =
  "when such technologies are the primary (rather than incidental or ancillary) functionality being made available for use";

function walk(value: unknown, path: string, visit: (path: string, text: string) => void): void {
  if (typeof value === "string") {
    visit(path, value);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) visit && walk(child, `${path}.${key}`, visit);
  }
}

describe("messaging channel catalogue", () => {
  it("keeps platform figures in domain constants and quotes the AI clause", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const figureHits: string[] = [];
    const instantHits: string[] = [];
    let quote = false;
    for (const file of ["en.json", "rw.json"]) {
      const json = JSON.parse(readFileSync(resolve(root, "apps/studio/messages", file), "utf8")) as {
        channel?: Record<string, string>;
        channelAside?: Record<string, string>;
      };
      walk(json.channel, `${file}.channel`, (path, text) => {
        if (path.includes(".wa") || path.includes(".ig") || path.includes(".brk") || /\.wa\d|\.ig\d/.test(path)) {
          if (INSTANT.test(text)) instantHits.push(`${path}: ${text}`);
        }
        const leaf = path.split(".").pop() ?? "";
        if (/^(wa|ig|brk)/.test(leaf) || leaf.startsWith("wa") || leaf.startsWith("ig") || leaf.startsWith("brk")) {
          for (const rule of FIGURES) {
            if (rule.test(text) && !text.includes("{")) figureHits.push(`${path}: ${text}`);
          }
        }
        if (text.includes(QUOTE)) quote = true;
      });
      walk(json.channelAside, `${file}.channelAside`, (path, text) => {
        if (/\.wa|\.ig|\.brk/.test(path) && INSTANT.test(text)) instantHits.push(`${path}: ${text}`);
      });
    }
    expect(figureHits).toEqual([]);
    expect(instantHits).toEqual([]);
    expect(quote).toBe(true);
  });
});
