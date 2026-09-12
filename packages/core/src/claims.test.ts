import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { claims } from "./claims";
import { pricingTiers } from "./pricing";

const ROOT = join(import.meta.dirname, "../../..");
const catalogues = [
  join(ROOT, "apps/site/messages/en.json"),
  join(ROOT, "apps/site/messages/rw.json"),
];

const FIGURES = [
  "20,000",
  "20000",
  "45,000",
  "45000",
  "90,000",
  "90000",
  "150,000",
  "150000",
  "650,000",
  "650000",
  "278,060",
  "278060",
];

const FORBIDDEN = [
  /first Kinyarwanda/i,
  /the first .*voice AI/i,
  /\bleading\b/i,
  /webhook/i,
  /same-day WhatsApp/i,
  /cloned voice/i,
  /we set up call forwarding for you/i,
  /we register your WhatsApp/i,
];

describe("claims registry", () => {
  it("marks every pricing figure", () => {
    for (const tier of pricingTiers) {
      expect(tier.provisional).toBe(true);
    }
    expect(claims.ubucuruziPrice.value).toBe(pricingTiers[1]?.rwf);
    expect(claims.ikigoPrice.value).toBe(pricingTiers[2]?.rwf);
    expect(claims.ikigoPlusPrice.value).toBe(pricingTiers[3]?.rwf);
  });

  it("fails when a catalogue hardcodes a registered figure", () => {
    for (const path of catalogues) {
      const text = readFileSync(path, "utf8");
      for (const figure of FIGURES) {
        expect(text.includes(figure), `${path} contains ${figure}`).toBe(false);
      }
    }
  });

  it("fails when a catalogue uses a forbidden claim", () => {
    for (const path of catalogues) {
      const text = readFileSync(path, "utf8");
      for (const pattern of FORBIDDEN) {
        expect(text, `${path} matches ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
