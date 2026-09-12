import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ICON_NAMES } from "./icon-names.ts";
import { CRITICAL_ICON_NAMES } from "../src/icons/critical.ts";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "../src/icons");

function findLucideIcon(name: string): string {
  const file = `${name}.svg`;
  try {
    return require.resolve(`lucide-static/icons/${file}`);
  } catch {
    throw new Error(`lucide-static is missing ${file}`);
  }
}

function normalise(svg: string, id: string): string {
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? "0 0 24 24";
  const inner = svg
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\swidth="[^"]*"/g, "")
    .replace(/\sheight="[^"]*"/g, "")
    .replace(/stroke-width="2"/g, 'stroke-width="1.75"')
    .trim();
  return `<symbol id="i-${id}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${inner}</symbol>`;
}

const symbols = ICON_NAMES.map((name) => {
  const raw = readFileSync(findLucideIcon(name), "utf8");
  return normalise(raw, name);
});

const critical = CRITICAL_ICON_NAMES.map((name) => {
  const raw = readFileSync(findLucideIcon(name), "utf8");
  return normalise(raw, name);
});

mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "sprite.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>\n`,
);
writeFileSync(
  join(outDir, "sprite-critical.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${critical.join("")}</svg>\n`,
);

const union = ICON_NAMES.map((name) => `  | "${name}"`).join("\n");
writeFileSync(
  join(outDir, "names.generated.ts"),
  `export const ICON_NAMES = ${JSON.stringify(ICON_NAMES, null, 2)} as const;\n\nexport type IconName =\n${union};\n`,
);

if (ICON_NAMES.length !== 176) {
  throw new Error(`Expected 176 icons, got ${ICON_NAMES.length}`);
}

console.log(`Wrote ${ICON_NAMES.length} symbols`);
