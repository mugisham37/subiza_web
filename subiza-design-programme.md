# Subiza — Design Programme

The map. It exists so the design work stays bounded and actually finishes.

**Method** (set by the founder): one stakeholder at a time, one flow at a time. For each flow — analyse it, research what must functionally be in it, research current design practice for that kind of surface, check it against the project context, then design it. When a flow is done it is reported done, and nothing else starts until the word *next*.

**Source of truth:** `subiza-flows/` (the Flow Atlas, 26 documents). Nothing gets designed that the atlas has not specified, and nothing gets designed that the platform constraints in atlas Flow 04 forbid.

---

## Status key

`○` not started `◐` in progress `●` done, delivered `—` deferred, with a reason

---

## D0 — Foundations

| # | Deliverable | Status |
|---|---|---|
| D0.1 | **Design system** — tokens, type, motion, components, responsive law, accessibility | ● |

---

## Stakeholder 1 — A5, the business owner *(the paying customer; the console)*

Ordered by the customer's own journey, not by our convenience.

| # | Flow | Atlas ref | Status |
|---|---|---|---|
| 1.1 | **Landing page + public routes** — home, how it works, pricing, about, contact, legal, sign-up handoff | 05 | ● |
| 1.2 | Sign-up, sign-in, account recovery | 05 | ○ |
| 1.3 | Guided activation — the inversion: first value before any channel | 06 | ○ |
| 1.4 | Phone connection — the forwarding-code flow | 07 | ○ |
| 1.5 | Messaging channel connection — WhatsApp, Instagram, Telegram | 08 | ○ |
| 1.6 | Agent design — Simple ↔ Advanced on the same agent | 09 | ○ |
| 1.7 | Knowledge base — including price tables as a first-class input | 10 | ○ |
| 1.8 | Voice, cloning and consent | 11 | ○ |
| 1.9 | Language | 12 | ○ |
| 1.10 | Test & go-live | 13 | ○ |
| 1.11 | **Home** — the feed, the three zones | 02 | ○ |
| 1.12 | Conversations — the unified voice + chat inbox | 14 | ○ |
| 1.13 | Escalation and the rota | 15 | ○ |
| 1.14 | Results — analytics and the weekly report | 16 | ○ |
| 1.15 | Credit and MoMo billing | 17 | ○ |
| 1.16 | Team and permissions | 18 | ○ |
| 1.17 | Compliance and data rights | 19 | ○ |
| 1.18 | Notifications — preferences and the WhatsApp surfaces | 25 | ○ |

## Stakeholder 2 — A9, platform staff *(the admin console)*

| # | Flow | Atlas ref | Status |
|---|---|---|---|
| 2.1 | Operations home | 20 | ○ |
| 2.2 | Tenant lifecycle | 21 | ○ |
| 2.3 | AI operations | 22 | ○ |
| 2.4 | Trust, safety and quality | 23 | ○ |

## Stakeholder 3 — A6/A7, manager and agent *(the shared console, reduced)*

| # | Flow | Atlas ref | Status |
|---|---|---|---|
| 3.1 | Agent workspace — inbox-first, escalation-first | 14, 15 | ○ |
| 3.2 | Mobile-only agent surface | 14 | ○ |

## Stakeholder 4 — A3, the voice owner *(one screen, no account)*

| # | Flow | Atlas ref | Status |
|---|---|---|---|
| 4.1 | Voice consent — grant, decline, revoke | 11 | ○ |

## Stakeholder 5 — A1/A2/A4, caller, messager, data subject *(no UI, or one page)*

| # | Flow | Atlas ref | Status |
|---|---|---|---|
| 5.1 | Data-rights portal | 19 | ○ |
| 5.2 | Caller-facing surfaces — SMS follow-ups, callback confirmations | 24, 25 | ○ |

---

## Cross-cutting, applied inside every flow rather than designed separately

- Every screen carries all eight states from atlas Flow 24 §6.
- Every screen is designed at 360 first, and any component that cannot survive the trip is **redesigned**, not reflowed.
- Every screen exists in four languages; Kinyarwanda runs 15–25% longer than English and layouts are proven against it.
- Every screen has a light and a dark form built from separate tokens, never an inverted hex.

## Deliberately not designed

| Thing | Why |
|---|---|
| A native mobile app | The console is a responsive web app. Atlas G13. |
| An email client | WhatsApp is the notification channel. Atlas Flow 25 §2. |
| A marketplace or template gallery | Not in the atlas. Scope discipline. |
| Anything the platforms forbid | Atlas Flow 04, the F1–F14 forbidden list. |
