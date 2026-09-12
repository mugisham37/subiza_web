export type PricingTierId = "gerageza" | "ubucuruzi" | "ikigo" | "ikigo-plus";

export type PricingTier = {
  id: PricingTierId;
  name: string;
  /** Language-invariant proper noun. Do not translate. */
  properName: "Gerageza" | "Ubucuruzi" | "Ikigo" | "Ikigo+";
  rwf: number;
  usdApprox: number | null;
  voiceMinutes: number;
  messages: number;
  featured: boolean;
  cta: "start" | "contact";
  /** Non-optional until docs/13 B1 is answered. */
  provisional: true;
};

export const PILOT_YEAR = 2026;
export const PRICING_NOTICE_MONTHS = 1;
export const USD_RATE_AS_OF = "2026-09-01";

export const pricingTiers = [
  {
    id: "gerageza",
    name: "Try",
    properName: "Gerageza",
    rwf: 0,
    usdApprox: null,
    voiceMinutes: 30,
    messages: 100,
    featured: false,
    cta: "start",
    provisional: true,
  },
  {
    id: "ubucuruzi",
    name: "Business",
    properName: "Ubucuruzi",
    rwf: 20_000,
    usdApprox: 14,
    voiceMinutes: 300,
    messages: 1_000,
    featured: true,
    cta: "start",
    provisional: true,
  },
  {
    id: "ikigo",
    name: "Company",
    properName: "Ikigo",
    rwf: 45_000,
    usdApprox: 31,
    voiceMinutes: 800,
    messages: 3_000,
    featured: false,
    cta: "start",
    provisional: true,
  },
  {
    id: "ikigo-plus",
    name: "Larger",
    properName: "Ikigo+",
    rwf: 90_000,
    usdApprox: 61,
    voiceMinutes: 2_000,
    messages: 10_000,
    featured: false,
    cta: "contact",
    provisional: true,
  },
] as const satisfies readonly PricingTier[];

export const comparisonWages = {
  supportRepRwf: 650_000,
  receptionistRwf: 150_000,
  subizaFromRwf: 20_000,
  anchorMaxRwf: 650_000,
} as const;

export function barWidthPercent(value: number, anchorMax = comparisonWages.anchorMaxRwf): number {
  return Math.max(3, Math.round((value / anchorMax) * 100));
}
