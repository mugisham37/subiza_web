import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const BANNED = [
  /\binvalid\b/i,
  /\billegal\b/i,
  /\bincorrect\b/i,
  /\bfailed to\b/i,
  /\byou must\b/i,
  /\byou forgot\b/i,
  /\bplease ensure\b/i,
  /\boops\b/i,
  /\bwhoops\b/i,
  /\bsomething went wrong\b/i,
];

const ALLOWED_QUOTES = /Invalid MMI code/;

function walk(value: unknown, path: string, hits: string[]): void {
  if (typeof value === "string") {
    if (ALLOWED_QUOTES.test(value)) return;
    for (const rule of BANNED) {
      if (rule.test(value)) hits.push(`${path}: ${value}`);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      walk(child, `${path}.${key}`, hits);
    }
  }
}

describe("blameless phone copy", () => {
  it("keeps a non-user grammatical subject — banned phrases stay out of the catalogue", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const hits: string[] = [];
    for (const file of ["en.json", "rw.json"]) {
      const json = JSON.parse(readFileSync(resolve(root, "apps/studio/messages", file), "utf8")) as {
        phone?: unknown;
        phoneAside?: unknown;
      };
      walk(json.phone, `${file}.phone`, hits);
      walk(json.phoneAside, `${file}.phoneAside`, hits);
    }
    expect(hits).toEqual([]);
  });
});
