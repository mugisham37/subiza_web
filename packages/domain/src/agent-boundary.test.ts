import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LOCKED_RULE_IDS, canDeleteRule, emptyAgentConfig, removeRule } from "./agent-config";
import { salonWeek } from "./week-grid";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".next") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(full);
  }
  return acc;
}

describe("agent domain boundary", () => {
  it("does not declare a second AgentConfig, AgentRule or AgentStage shape outside agent-config.ts", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const files = [
      ...walk(join(root, "apps/studio/src")),
      ...walk(join(root, "packages/auth-tenant/src")),
      ...walk(join(root, "packages/ui/src")),
    ];
    const hits: string[] = [];
    for (const file of files) {
      if (file.endsWith("agent-config.ts")) continue;
      const text = readFileSync(file, "utf8");
      if (
        /type AgentConfig\s*=/.test(text) ||
        /interface AgentConfig/.test(text) ||
        /type AgentRule\s*=/.test(text) ||
        /interface AgentRule/.test(text) ||
        /type AgentStage\s*=/.test(text)
      ) {
        hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });

  it("cannot remove the two locked rule ids via the exported mutator", () => {
    const config = emptyAgentConfig(salonWeek());
    const locked = LOCKED_RULE_IDS.map((id) => ({
      id,
      cat: "never" as const,
      stage: "always" as const,
      enf: "lock" as const,
      on: true,
      lock: true,
      en: id,
      rw: id,
      text: id,
      mechanism: null,
      knowledgeRef: null,
    }));
    const next = { ...config, rules: locked };
    for (const id of LOCKED_RULE_IDS) {
      expect(canDeleteRule(next.rules.find((row) => row.id === id)!)).toBe(false);
      expect(removeRule(next, id).rules.map((row) => row.id)).toContain(id);
    }
  });
});
