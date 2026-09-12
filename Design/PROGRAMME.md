# Subiza — Design Programme

The map. It exists so the design work stays bounded and actually finishes.

**Method** (set by the founder): one stakeholder at a time, one flow at a time. For each flow — analyse it, research what must functionally be in it, research current design practice for that kind of surface, check it against the project context, then design it. When a flow is done it is reported done, and nothing else starts until the word _next_.

**Source of truth:** `subiza-flows/` (the Flow Atlas, 26 documents). Nothing gets designed that the atlas has not specified, and nothing gets designed that the platform constraints in atlas Flow 04 forbid.

---

## Status key

`○` not started `◐` in progress `●` done, delivered `—` deferred, with a reason

---

## D0 — Foundations

| #    | Deliverable                                                                                            | Status |
| ---- | ------------------------------------------------------------------------------------------------------ | ------ |
| D0.1 | **Design system** — tokens, type, motion, components, responsive law, accessibility                    | ●      |
| D0.2 | _v1.1 correction_ — the OTP field rebuilt as one input behind six painted slots, per WCAG 2.2 SC 3.3.8 | ●      |
| D0.3 | _v1.2 correction_ — the dial-code card leads with Copy; tap-to-dial demoted to an Android convenience  | ●      |

---

## Stakeholder 1 — A5, the business owner _(the paying customer; the console)_

Ordered by the customer's own journey, not by our convenience.

| #    | Flow                                                                                                                                                                                                                                                                    | Atlas ref  | Status |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| 1.1  | **Landing page + public routes** — home, how it works, pricing, about, contact, legal, sign-up handoff                                                                                                                                                                  | 05         | ●      |
| 1.2  | **Sign-up, sign-in, account recovery** — five screens, delivery fallbacks, granular consent, three recovery paths                                                                                                                                                       | 05, 18, 21 | ●      |
| 1.3  | **Guided activation** — the inversion: nine steps, the test call, the trust ladder, the part-done checklist                                                                                                                                                             | 06         | ●      |
| 1.4  | **Phone connection** — network detection, per-handset code card, server-side verification, repair                                                                                                                                                                       | 07         | ●      |
| 1.5  | **Messaging channel connection** — the hub, Meta's handoff and waiting, Instagram's limits, Telegram in one tap                                                                                                                                                         | 08         | ●      |
| 1.6  | **Agent design** — rules not prompts, one config in two views, enforcement badges, contradiction check                                                                                                                                                                  | 09         | ●      |
| 1.7  | **Knowledge base** — prices as typed data not prose, citation as an edit affordance, gaps mined from real calls, pronunciation lexicon                                                                                                                                  | 10         | ●      |
| 1.8  | **Voice, cloning and consent** — two actors on two devices, one consent record; the revoke control rendered and locked on the owner's copy                                                                                                                              | 11         | ●      |
| 1.9  | **Language** — two quality labels per language, not one; a fourth rung for what has never been measured; code-switching rendered as speech, not as an event                                                                                                             | 12         | ●      |
| 1.10 | **Test & go-live** — the pause completes before a single question is asked; two personas run three times because best-of-one flatters; a readiness check that reports observed behaviour, not field-presence                                                            | 13         | ●      |
| 1.11 | **Home** — the feed, the three zones; the app shell drawn for the first time; the number restated as an observation because we can prove a call went unanswered but not that a customer was lost                                                                        | 02         | ●      |
| 1.12 | **Conversations** — one list where channel is metadata, not structure; seven kinds of citation, the seventh being the one that admits we cannot account for a sentence; the closed window blocked before she types, not after she sends                                 | 14         | ●      |
| 1.13 | **Escalation and the rota** — half the file is the staff member's screen, including what the agent already promised so she doesn't contradict it; no free-text field anywhere, so a vague promise cannot be typed; and the apology the product sends when it breaks one | 15         | ●      |
| 1.14 | **Results** — the headline is a button that opens all 31, because auditability is the number's only defence; the exclusions get their own screen; no money figure unless she supplies the multiplier herself; and zero traffic is a forwarding check, not a quiet week  | 16         | ●      |
| 1.15 | Credit and MoMo billing                                                                                                                                                                                                                                                 | 17         | ○      |
| 1.16 | Team and permissions                                                                                                                                                                                                                                                    | 18         | ○      |
| 1.17 | Compliance and data rights                                                                                                                                                                                                                                              | 19         | ○      |
| 1.18 | Notifications — preferences and the WhatsApp surfaces                                                                                                                                                                                                                   | 25         | ○      |

## Stakeholder 2 — A9, platform staff _(the admin console)_

| #   | Flow                      | Atlas ref | Status |
| --- | ------------------------- | --------- | ------ |
| 2.1 | Operations home           | 20        | ○      |
| 2.2 | Tenant lifecycle          | 21        | ○      |
| 2.3 | AI operations             | 22        | ○      |
| 2.4 | Trust, safety and quality | 23        | ○      |

## Stakeholder 3 — A6/A7, manager and agent _(the shared console, reduced)_

| #   | Flow                                            | Atlas ref | Status |
| --- | ----------------------------------------------- | --------- | ------ |
| 3.1 | Agent workspace — inbox-first, escalation-first | 14, 15    | ○      |
| 3.2 | Mobile-only agent surface                       | 14        | ○      |

## Stakeholder 4 — A3, the voice owner _(one screen, no account)_

| #   | Flow                                   | Atlas ref | Status |
| --- | -------------------------------------- | --------- | ------ |
| 4.1 | Voice consent — grant, decline, revoke | 11        | ○      |

## Stakeholder 5 — A1/A2/A4, caller, messager, data subject _(no UI, or one page)_

| #   | Flow                                                            | Atlas ref | Status |
| --- | --------------------------------------------------------------- | --------- | ------ |
| 5.1 | Data-rights portal                                              | 19        | ○      |
| 5.2 | Caller-facing surfaces — SMS follow-ups, callback confirmations | 24, 25    | ○      |

---

## Cross-cutting, applied inside every flow rather than designed separately

- Every screen carries all eight states from atlas Flow 24 §6.
- Every screen is designed at 360 first, and any component that cannot survive the trip is **redesigned**, not reflowed.
- Every screen exists in four languages; Kinyarwanda runs 15–25% longer than English and layouts are proven against it.
- Every screen has a light and a dark form built from separate tokens, never an inverted hex.

## Deliberately not designed

| Thing                             | Why                                                     |
| --------------------------------- | ------------------------------------------------------- |
| A native mobile app               | The console is a responsive web app. Atlas G13.         |
| An email client                   | WhatsApp is the notification channel. Atlas Flow 25 §2. |
| A marketplace or template gallery | Not in the atlas. Scope discipline.                     |
| Anything the platforms forbid     | Atlas Flow 04, the F1–F14 forbidden list.               |
