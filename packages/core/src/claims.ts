export type ClaimMark = "green" | "amber" | "red";

export type Claim = {
  value: number | string;
  unit: string;
  source: string;
  sourceUrl?: string;
  mark: ClaimMark;
  asOf: string;
};

export const DEMO_TEL_E164 = "+250788782492";
export const DEMO_TEL_DISPLAY = "0788 782 492";
export const DEMO_WHATSAPP = "https://wa.me/250788782492";
export const CONTACT_EMAIL = "muraho@subiza.rw";
export const DPO_EMAIL = "ibanga@subiza.rw";
export const SITE_ORIGIN = "https://subiza.rw";

export const claims = {
  receptionistWage: {
    value: 150_000,
    unit: "RWF/month",
    source: "Kigali receptionist wage band midpoint, docs/03 and docs/11",
    mark: "green",
    asOf: "2026-01-01",
  },
  supportRepWage: {
    value: 650_000,
    unit: "RWF/month",
    source: "Kigali support-rep wage, docs/03 and docs/11",
    mark: "green",
    asOf: "2026-01-01",
  },
  subizaFrom: {
    value: 20_000,
    unit: "RWF/month",
    source: "packages/core pricing.ts — Ubucuruzi pilot price",
    mark: "amber",
    asOf: "2026-01-01",
  },
  geragezaPrice: {
    value: 0,
    unit: "RWF/month",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ubucuruziPrice: {
    value: 20_000,
    unit: "RWF/month",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ikigoPrice: {
    value: 45_000,
    unit: "RWF/month",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ikigoPlusPrice: {
    value: 90_000,
    unit: "RWF/month",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  demoPerDay: {
    value: 2,
    unit: "calls per number per day",
    source: "Public demo commitment, Prompt 02 §8.6",
    mark: "green",
    asOf: "2026-09-01",
  },
  demoRetentionHours: {
    value: 24,
    unit: "hours",
    source: "Public demo commitment, Prompt 02 §8.6",
    mark: "green",
    asOf: "2026-09-01",
  },
  onboardingMinutes: {
    value: 45,
    unit: "minutes",
    source: "docs/04 — activation is about 45 minutes, not 15",
    mark: "amber",
    asOf: "2026-01-01",
  },
  metaVerificationMin: {
    value: 5,
    unit: "working days",
    source: "Meta Business Verification",
    sourceUrl: "https://www.facebook.com/business/help",
    mark: "green",
    asOf: "2026-01-01",
  },
  metaVerificationMax: {
    value: 15,
    unit: "working days",
    source: "Meta Business Verification",
    sourceUrl: "https://www.facebook.com/business/help",
    mark: "green",
    asOf: "2026-01-01",
  },
  dataRightsDays: {
    value: 30,
    unit: "days",
    source: "Law N° 058/2021 Article 24",
    mark: "green",
    asOf: "2021-10-15",
  },
  forwardingRingSeconds: {
    value: 20,
    unit: "seconds",
    source: "GSM no-reply forwarding default used in **61*",
    mark: "green",
    asOf: "1993-01-01",
  },
  creditWarnLow: {
    value: 20,
    unit: "percent",
    source: "Product credit policy, docs/11",
    mark: "green",
    asOf: "2026-01-01",
  },
  creditWarnCritical: {
    value: 5,
    unit: "percent",
    source: "Product credit policy, docs/11",
    mark: "green",
    asOf: "2026-01-01",
  },
  forwardedLegTariff: {
    value: "unknown",
    unit: "RWF per diverted minute",
    source: "docs/13 Q2 — MTN and Airtel Rwanda forwarded-leg rates are unmeasured. Do not invent them.",
    mark: "red",
    asOf: "2026-09-13",
  },
  smartphonePenetrationRw: {
    value: 22,
    unit: "percent of connections that are smartphones, GSMA 2023",
    source: "GSMA Mobile Economy / smartphone share of connections — not household ownership, not internet penetration",
    mark: "amber",
    asOf: "2023-01-01",
  },
  forwardingSince: {
    value: 1993,
    unit: "year",
    source: "3GPP TS 22.082 Call Forwarding supplementary services",
    sourceUrl: "https://www.3gpp.org/specifications-technologies/specifications-by-series",
    mark: "green",
    asOf: "1993-01-01",
  },
  rwandaEnterprises: {
    value: 278_060,
    unit: "enterprises",
    source: "NISR / RDB enterprise census cited in docs/01",
    mark: "amber",
    asOf: "2024-01-01",
  },
  smeSharePercent: {
    value: 80,
    unit: "percent",
    source: "docs/01 — one to three employees",
    mark: "amber",
    asOf: "2024-01-01",
  },
  whatsappReachMillions: {
    value: 4,
    unit: "million people in Rwanda",
    source: "Industry reach estimate — modelled, not a census",
    mark: "red",
    asOf: "2025-01-01",
  },
  voiceReachMillions: {
    value: 14,
    unit: "million people in Rwanda",
    source: "Industry reach estimate — modelled, not a census",
    mark: "red",
    asOf: "2025-01-01",
  },
  instagramReach: {
    value: 456_000,
    unit: "accounts",
    source: "Industry reach estimate — modelled, not a census",
    mark: "red",
    asOf: "2025-01-01",
  },
  transcriptRetentionMonths: {
    value: 12,
    unit: "months",
    source: "Default retention, privacy notice",
    mark: "green",
    asOf: "2026-01-01",
  },
  recordingRetentionDays: {
    value: 90,
    unit: "days",
    source: "Default when the owner switches recordings on",
    mark: "green",
    asOf: "2026-01-01",
  },
  geragezaMinutes: {
    value: 30,
    unit: "voice minutes",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  geragezaMessages: {
    value: 100,
    unit: "messages",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ubucuruziMinutes: {
    value: 300,
    unit: "voice minutes",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ubucuruziMessages: {
    value: 1_000,
    unit: "messages",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ikigoMinutes: {
    value: 800,
    unit: "voice minutes",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ikigoMessages: {
    value: 3_000,
    unit: "messages",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ikigoPlusMinutes: {
    value: 2_000,
    unit: "voice minutes",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  ikigoPlusMessages: {
    value: 10_000,
    unit: "messages",
    source: "packages/core pricing.ts",
    mark: "amber",
    asOf: "2026-01-01",
  },
  usdUbucuruzi: {
    value: 14,
    unit: "USD approximation",
    source: "Dated FX snapshot in pricing.ts",
    mark: "amber",
    asOf: "2026-09-01",
  },
  usdIkigo: {
    value: 31,
    unit: "USD approximation",
    source: "Dated FX snapshot in pricing.ts",
    mark: "amber",
    asOf: "2026-09-01",
  },
  usdIkigoPlus: {
    value: 61,
    unit: "USD approximation",
    source: "Dated FX snapshot in pricing.ts",
    mark: "amber",
    asOf: "2026-09-01",
  },
  contactHoursStart: {
    value: "08:00",
    unit: "time",
    source: "Published human hours, Prompt 02 §10",
    mark: "green",
    asOf: "2026-09-01",
  },
  contactHoursEnd: {
    value: "19:00",
    unit: "time",
    source: "Published human hours, Prompt 02 §10",
    mark: "green",
    asOf: "2026-09-01",
  },
  thursdayWaReplySeconds: {
    value: 90,
    unit: "seconds",
    source: "Illustrated Thursday row — not a measured SLA",
    mark: "red",
    asOf: "2026-09-01",
  },
} as const satisfies Record<string, Claim>;

export type ClaimId = keyof typeof claims;

export const uniquenessClaim =
  "No company was found that operates a turnkey, self-serve, SME-priced product answering live phone calls in Kinyarwanda.";
