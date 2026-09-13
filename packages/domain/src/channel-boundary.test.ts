import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".next") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(full);
  }
  return acc;
}

describe("channel domain boundary", () => {
  it("does not declare a second MessagingChannels shape outside channel.ts", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const files = [
      ...walk(join(root, "apps/studio/src")),
      ...walk(join(root, "packages/auth-tenant/src")),
      ...walk(join(root, "packages/ui/src")),
    ];
    const hits: string[] = [];
    for (const file of files) {
      if (file.endsWith("channel.ts")) continue;
      const text = readFileSync(file, "utf8");
      if (/type MessagingChannels\s*=/.test(text) || /interface MessagingChannels/.test(text)) {
        hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });

  it("never ships Embedded Signup v2", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const files = walk(join(root, "apps/studio/src")).concat(walk(join(root, "packages")));
    const hits: string[] = [];
    for (const file of files) {
      if (file.includes("node_modules") || file.includes("channel-boundary.test")) continue;
      const text = readFileSync(file, "utf8");
      if (/embedded[_-]?signup[^.\n]{0,40}v2/i.test(text) || /v2 embedded signup/i.test(text)) {
        hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });
});
