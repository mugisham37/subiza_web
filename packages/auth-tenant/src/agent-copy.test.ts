import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const FIGURES = [/\b25\b/, /\b6s\b/, /\b2\.6\b/];
const INSTANT = /\binstant(?:ly)?\b/i;

function walk(value: unknown, path: string, visit: (path: string, text: string) => void): void {
  if (typeof value === "string") {
    visit(path, value);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`, visit);
  }
}

describe("agent catalogue", () => {
  it("keeps thresholds in domain constants and avoids instant claims", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const figureHits: string[] = [];
    const instantHits: string[] = [];
    for (const file of ["en.json", "rw.json"]) {
      const json = JSON.parse(readFileSync(resolve(root, "apps/studio/messages", file), "utf8")) as {
        agent?: Record<string, string>;
        agentAside?: Record<string, string>;
      };
      walk(json.agent, `${file}.agent`, (path, text) => {
        if (INSTANT.test(text)) instantHits.push(`${path}: ${text}`);
        for (const rule of FIGURES) {
          if (rule.test(text) && !text.includes("{")) figureHits.push(`${path}: ${text}`);
        }
      });
      walk(json.agentAside, `${file}.agentAside`, (path, text) => {
        if (INSTANT.test(text)) instantHits.push(`${path}: ${text}`);
      });
    }
    expect(figureHits).toEqual([]);
    expect(instantHits).toEqual([]);
  });
});
