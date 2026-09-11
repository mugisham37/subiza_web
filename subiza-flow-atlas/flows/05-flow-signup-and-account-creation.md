# 05 — Flow: Signup & Account Creation

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-05 |
| **Actor** | A5 Owner |
| **Entry points** | Landing page · demo call · field sales · referral link · WhatsApp ad |
| **Exit states** | Account created → Flow 06 · Abandoned (resumable) |
| **Depends on** | Nothing |
| **Blocks** | Everything |
| **Frequency** | Once per business |
| **Criticality** | Critical |
| **Target duration** | **Under 2 minutes** |

---

## 1. Purpose

Get a business owner from "I am interested" to "I have an account" with the least possible friction, while collecting only what is genuinely needed and establishing the legal basis to process data at all.

**What breaks if this is wrong:** every downstream flow. A signup that asks for a company registration number, an email address the owner does not check, or a credit card, loses the customer before the product has said a word.

---

## 2. Overview

```
   Landing / demo / referral
            │
            ▼
   ┌─────────────────────┐
   │ 1. Phone number     │   just the number — nothing else
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 2. OTP              │   6 digits, SMS, auto-read where possible
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 3. Your name +      │   two fields
   │    business name    │
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 4. Language         │   Kinyarwanda default
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 5. Terms + privacy  │   one screen, plain language
   └──────────┬──────────┘
              ▼
        ACCOUNT EXISTS  ──────►  Flow 06 Guided Activation
```

Five screens. No email. No password. No card.

---

## 3. Preconditions

- The person has a phone that receives SMS.
- Nothing else.

---

## 4. Detailed flow

### Step 1 — Phone number

| | |
|---|---|
| **Sees** | One field, pre-filled with +250, a large keypad-friendly input, and one line: *"We'll send you a code. This is also how your customers will reach you."* |
| **Does** | Types their number |
| **System** | Validates format for Rwanda (and neighbouring codes for later markets). Checks against existing accounts. Rate-limits by IP and by number |
| **Can fail** | Invalid format → inline correction, never a modal. Already registered → "You already have an account" + sign-in path. Rate limit hit → "Try again in a few minutes," never a raw error |

**Why phone-first and not email:** the owner's phone number is the identity that matters in this market, is what MoMo billing uses, is what customers already have, and does not require the owner to remember a password. Email is optional and asked for later only if they want reports by email.

### Step 2 — OTP

| | |
|---|---|
| **Sees** | Six boxes, the number it was sent to, a countdown to resend, and *"Didn't get it? Get a call instead"* |
| **Does** | Types or auto-fills the code |
| **System** | Verifies. Creates a session. Does **not** yet create the account record — that happens after step 5, so an abandoned OTP leaves no orphan |
| **Can fail** | Wrong code → three attempts, then a 60-second cooldown, then voice fallback. Not received → resend after 30s, voice call after 60s. Repeated failure → offer WhatsApp delivery |

**Voice OTP is not optional.** SMS delivery in this market is imperfect, and a signup that dead-ends on an undelivered SMS is a lost customer with no way to tell us.

### Step 3 — Your name and business name

| | |
|---|---|
| **Sees** | Two fields: *"What's your name?"* and *"What's your business called?"* — with the second explained: *"This is what your AI will say when it answers"* |
| **Does** | Types both |
| **System** | Stores. Uses the business name immediately in the next screen's copy so the value is instantly visible |
| **Can fail** | Empty → inline. Very long → soft limit with a character count, not a hard block |

**Why the business name is asked here and not later:** it is the first piece of personalisation, and it makes the very next screen feel like theirs. It also pre-fills the WhatsApp display name later ([Flow 08](08-flow-messaging-channel-connection.md)), where a mismatch with the legal name is a common rejection cause.

### Step 4 — Language

| | |
|---|---|
| **Sees** | Four large tappable options: Ikinyarwanda · English · Français · Kiswahili. Kinyarwanda pre-selected. One line: *"You can change this any time."* |
| **Does** | Taps one, or accepts the default |
| **System** | Sets the interface language, and seeds the agent's default language ([Flow 12](12-flow-language-and-switching.md)) |
| **Can fail** | Cannot |

This screen exists early because of a documented failure in comparable products: users in this region drop out when an app assumes a language they read less comfortably. Offering the choice before any real content is shown removes that.

### Step 5 — Terms and privacy

| | |
|---|---|
| **Sees** | A short, plain-language summary in the chosen language: what we do with conversation data, where it is stored (Rwanda), how long we keep it, that they can delete it. Full documents behind a link. One checkbox |
| **Does** | Reads or skims, ticks, taps *Create my account* |
| **System** | Creates the tenant, the owner user, and the initial consent records (terms + data-processing agreement, per [Flow 01 §7](01-actors-roles-and-permissions.md)) with timestamp and version. Provisions the workspace. Emits `tenant.created` |
| **Can fail** | Unchecked → the button stays disabled with the reason visible. Provisioning failure → a retry state, never a lost signup |

**Consent scope discipline (G12):** this screen covers only the owner's relationship with Subiza. It does **not** cover call recording, and it does **not** cover voice cloning. Those are separate consents, from different people, asked at the moment they become relevant. Bundling them here would be both worse UX and legally weaker.

---

## 5. Screens and states

| Screen | States |
|---|---|
| Phone entry | Empty · valid · invalid · already registered · rate-limited |
| OTP | Waiting · entering · wrong · expired · resent · voice-fallback offered |
| Name | Empty · partial · complete |
| Language | Default selected · changed |
| Terms | Unaccepted · accepted · creating · failed |
| Post-create | Handoff to Flow 06 |

---

## 6. Decisions and branches

| Decision | Branches |
|---|---|
| Number already registered? | Yes → sign in. No → continue |
| Arrived via referral link? | Yes → attribute, and show *"[Business] recommended Subiza"* — social proof at the highest-anxiety moment. No → standard |
| Arrived from a demo call? | Yes → carry the demo conversation into the account so their first Inbox item is the call they just made. No → standard |
| Assisted signup by field sales? | Yes → specialist tagged to the tenant, appears in Onboarding Ops ([Flow 21](21-admin-tenant-lifecycle.md)). No → self-serve |
| SMS undelivered twice? | Offer voice OTP, then WhatsApp OTP |

**The demo-call branch is worth building early.** A prospect who has already spoken to a Subiza agent and then signs up arrives with the aha moment already behind them — and their first screen shows a transcript of their own conversation.

---

## 7. Platform constraints

| Constraint | Effect here |
|---|---|
| P4 — OTP is the only way to verify number control | Accepted; voice fallback mandatory |
| G18 — never require a card | No payment step. Credit is added later ([Flow 17](17-flow-billing-and-mobile-money.md)) |
| W16 — opt-in is the business's obligation | Terms explain the tenant's own responsibility for messaging opt-in |
| Law 058/2021 Arts. 29–31 | Subiza must be registered as controller and processor before processing begins — a platform prerequisite, not a per-tenant step |

---

## 8. Edge cases and failures

| Case | Behaviour |
|---|---|
| Loses connection mid-signup | Session persisted server-side; returning to the URL resumes at the same step |
| Abandons after OTP | No account created; the number is remembered for 30 days so a return does not restart from zero |
| Abandons after account creation | Account exists in `pending_activation`; resume links sent at 1h, 24h, 72h by SMS then WhatsApp; after day 30 it enters the human-contact queue |
| Two people sign up for the same business | Second is offered *"Ask [name] to invite you"* rather than creating a duplicate |
| Signs up with a number they intend to use as the business line | Detected at [Flow 07](07-flow-phone-connection.md) and handled there — the two are allowed to be the same |
| Under-16 signup | Not detectable at signup; handled by policy and terms. Flagged as an open question |
| Shared or family phone | The account belongs to the number. Ownership transfer is a support flow ([Flow 21](21-admin-tenant-lifecycle.md)) |

---

## 9. Retention rationale

| Decision | Reason |
|---|---|
| Five screens, no email, no password, no card | Every removed field is removed because it is genuinely unnecessary — not to hit a step count. Research shows cutting *meaningful* fields reduces conversion; clarity matters more than count |
| Language chosen before any content | Removes the "this app isn't for me" reaction documented in comparable East African products |
| Business name asked at step 3 | Personalises step 4 onward immediately; the product feels like theirs within 90 seconds |
| Terms in plain language, in their language | Consent that is understood is both more ethical and more legally defensible |
| Resume links for 30 days | Beyond 30 days automated reactivation converts under 5% — so day 30 triggers a human, not another SMS |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 5.1 | Signup completes in under two minutes | Median time, first screen → account created | < 120s |
| 5.2 | High completion once started | Completed ÷ started | > 75% |
| 5.3 | OTP is not the drop-off point | Drop-off at OTP step | < 10% |
| 5.4 | Voice OTP fallback works | Successful voice OTP deliveries ÷ requested | > 95% |
| 5.5 | No card, no email, no password required anywhere | Manual audit | Pass |
| 5.6 | Works on a mid-range Android over 3G | Automated performance test | FMP < 3s |
| 5.7 | Every screen available in four languages | Translation coverage check | 100% |
| 5.8 | Abandoned signups are resumable for 30 days | Functional test at 1h/24h/72h/30d | Pass |
| 5.9 | Consent records are created with version and timestamp | Schema validation | Pass |
| 5.10 | Referral and demo-call attribution survives to the tenant record | Functional test | Pass |

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `signup.started` | entry point, referrer, device, network type |
| `signup.step_viewed` | step, language |
| `signup.step_completed` | step, duration |
| `signup.otp_requested` | channel (sms/voice/whatsapp), attempt |
| `signup.otp_failed` | reason |
| `signup.abandoned` | last step, duration |
| `signup.resumed` | hours since abandonment, prompt channel |
| `tenant.created` | business name, language, entry point, referral, assisted-by |

Per-step drop-off is the primary optimisation surface for this flow and must be visible in the admin console from day one.

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 5.a | Is a passwordless, phone-only account acceptable to owners, or does the absence of a password feel insecure to them? | Auth model |
| 5.b | Should the demo call be reachable before signup, given it costs real telephony minutes on unqualified traffic? | Cost, [Flow 03 §6](03-master-flow-map.md) |
| 5.c | How do we handle a business whose owner does not personally hold the phone (a manager signs up)? | Ownership model |
| 5.d | Is Kinyarwanda the right default, or should we detect from device locale? | Localisation |
| 5.e | Do we need any age gate given Law 058/2021 Art. 9 on under-16s? | Legal |

---

*Next: [06 — Guided Activation](06-flow-guided-activation.md)*
