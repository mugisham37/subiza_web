export type Citation = {
  id: string;
  label: string;
  url: string;
};

export const citations = {
  law058: {
    id: "law058",
    label: "Law N° 058/2021 of 15/10/2021 relating to the protection of personal data and privacy",
    url: "https://www.risa.gov.rw/",
  },
  art50: {
    id: "art50",
    label: "Law N° 058/2021 Article 50 — data residency",
    url: "https://www.risa.gov.rw/",
  },
  art24: {
    id: "art24",
    label: "Law N° 058/2021 Article 24 — response within 30 days",
    url: "https://www.risa.gov.rw/",
  },
  gsmForwarding: {
    id: "gsmForwarding",
    label: "3GPP TS 22.082 — Call Forwarding supplementary services (1993)",
    url: "https://www.3gpp.org/specifications-technologies/specifications-by-series",
  },
  metaVerification: {
    id: "metaVerification",
    label: "Meta Business Verification timeline",
    url: "https://www.facebook.com/business/help",
  },
  uniqueness: {
    id: "uniqueness",
    label: "docs/03 §6.1 — permitted uniqueness claim",
    url: "/en/about",
  },
} as const satisfies Record<string, Citation>;

export type CitationId = keyof typeof citations;
