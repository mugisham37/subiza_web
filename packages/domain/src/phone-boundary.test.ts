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

describe("phone domain boundary", () => {
  it("does not declare a second PhoneChannel shape outside phone-channel.ts", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const files = [
      ...walk(join(root, "apps/studio/src")),
      ...walk(join(root, "packages/auth-tenant/src")),
      ...walk(join(root, "packages/ui/src")),
    ];
    const hits: string[] = [];
    for (const file of files) {
      if (file.endsWith("phone-channel.ts")) continue;
      const text = readFileSync(file, "utf8");
      if (/type PhoneChannel\s*=/.test(text) || /interface PhoneChannel/.test(text)) {
        hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });
});
