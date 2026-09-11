# 08 — Flow: Messaging Channel Connection

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-08 |
| **Actor** | A5 Owner, A6 Manager (connect only) |
| **Entry points** | Home checklist · Connections · a repair alert |
| **Exit states** | Connected · Pending review · Blocked · Not connected · Disconnected |
| **Depends on** | 05, 06 |
| **Blocks** | Live messaging on that channel |
| **Frequency** | Once per channel, plus repair |
| **Criticality** | High |
| **Target duration** | Telegram 3 min · WhatsApp 10 min active + days of waiting · Instagram 5 min |

---

## 1. Purpose

Connect each messaging channel the business uses, honestly representing what each platform requires, how long it takes, and what it will and will not allow.

**What breaks if this is wrong:** WhatsApp is the highest-value channel in this market and the most fragile. A connection flow that hides the waiting, the verification, or the platform's limits produces a customer who feels misled in week two.

---

## 2. Overview

```
   CONNECTIONS
        │
        ├──► ✈ TELEGRAM        3 min, instant, free, no review
        │      owner talks to BotFather · pastes token · done
        │
        ├──► 💬 WHATSAPP        10 min active, then 5–15 business days
        │      pre-flight questions
        │           ▼
        │      Meta Embedded Signup (8 screens, Meta-hosted)
        │           ▼
        │      display name review  ─── async, can be rejected
        │           ▼
        │      business verification ─── 5–15 business days
        │           ▼
        │      tenant adds their own Meta payment method
        │           ▼
        │      CONNECTED (tier 250 msgs/24h, rising)
        │
        ├──► 📷 INSTAGRAM       5 min, plus our App Review (already held)
        │      professional account check ─► convert if needed
        │           ▼
        │      Instagram OAuth · scopes · consent
        │           ▼
        │      CONNECTED
        │
        ├──► 💬 MESSENGER       shares Instagram infrastructure
        ├──► ✉ SMS              sender ID registration, ~3 weeks
        └──► 🌐 WEB CHAT        instant, copy a snippet
```

**Order of encouragement is deliberate:** Telegram first (to prove the messaging core works with zero friction), then WhatsApp (highest value, longest wait — start the clock early), then the rest.

---

## 3. Preconditions

- Activated tenant ([Flow 06](06-flow-guided-activation.md)). Channels are never in the critical path to first value.
- For WhatsApp: business verification documents ready, collected once ([Flow 04 §9](04-platform-constraints.md)).
- For Instagram: a professional account, or willingness to convert.

---

## 4. WhatsApp — detailed flow

### Step 0 — Pre-flight (the step nobody else has)

Before launching Meta's popup, three questions that prevent the two most common failures in the category:

| Question | Why | Branch |
|---|---|---|
| *"Which number do you want customers to message?"* | Sets expectations | — |
| **"Do you already use this number on WhatsApp or WhatsApp Business?"** | Constraint **W2**: a number active on the consumer or Business app cannot be registered for the Cloud API unless removed first, or Coexistence is used | Yes → explain the two routes clearly. No → straight through |
| *"Is your business registered with RDB?"* | Business verification needs documents | Yes → prepare upload. No → explain that WhatsApp needs it and offer the other channels meanwhile |

**Asking these first is the whole trick.** The most-cited failure in every competing WhatsApp product is a user launching Meta's flow, hitting the "number already in use" wall inside a popup they do not control, and giving up. Two questions beforehand turn a dead end into a branch.

### Step 1 — Choose the route (if the number is already on WhatsApp)

| Route | What it means | Trade-offs shown to the owner |
|---|---|---|
| **Move the number** | Delete it from the WhatsApp Business app, then register for the API | Clean, full capability. But past chats stay on the phone and the app stops working for that number |
| **Coexistence** | Keep using the WhatsApp Business app *and* the API on the same number | Keeps their app. But: one-time history sync only (6 months, 1:1 chats, media only from the last 14 days), the app must stay open for ~24 hours during the sync, throughput capped at 20 messages/second, and groups, broadcast lists and disappearing messages are invisible to Subiza |
| **Use a different number** | A second SIM or a new number for the API | Simplest technically, but customers must be told |

We present all three in plain language with the trade-offs visible, because each is right for a different business and guessing on their behalf produces regret.

**Coexistence carries a hard warning up front:** *"This takes about a day and you must keep WhatsApp open on your phone the whole time. If it's interrupted, we have to start over."* The one-time-only nature of the sync means an interrupted attempt is genuinely costly, and hiding that would be indefensible.

### Step 2 — Meta Embedded Signup

| | |
|---|---|
| **Sees** | Our screen explains what is about to happen and what they will need, then Meta's own popup takes over for eight screens (login, terms, product selection, app authorisation, business portfolio, WABA, phone + OTP, display name) |
| **Does** | Works through Meta's flow. **They must personally receive and enter the OTP** — we cannot do it (W1) |
| **System** | Pre-fills business name and phone number to shorten Meta's flow. Listens for the completion message. Exchanges the returned code **within its 30-second lifetime** (W5). Subscribes webhooks. Records WABA ID and phone number ID |
| **Can fail** | Abandoned mid-popup → we capture the screen they left on and resume with a targeted explanation. Code exchange missed the window → re-launch with a plain explanation. Number rejected → back to step 1's routes. 2FA PIN from a previous provider blocks migration (W17) → reset instructions |

### Step 3 — Display name review

| | |
|---|---|
| **Sees** | *"Meta is reviewing the name customers will see. Until it's approved they'll see your phone number instead. This usually takes a day or two."* Plus the submitted name and an edit option |
| **System** | Polls status; notifies on change |
| **Can fail** | Rejected (generic terms, mismatch with the legal name, emojis, numbers) → the reason, plain-language guidance, and resubmission. **Never blocks go-live** — messaging works under the phone number |

### Step 4 — Business verification

| | |
|---|---|
| **Sees** | The unified business verification ([Flow 04 §9](04-platform-constraints.md)) — documents collected once, reused across Meta, CPaaS and our own KYC. A status tracker with an honest range: *"Meta usually takes 5–15 working days."* |
| **System** | Submits, tracks, notifies. Surfaces the tenant in Onboarding Ops if stalled |
| **Can fail** | Rejection resets the clock; reason shown with specific guidance |

### Step 5 — Payment method

| | |
|---|---|
| **Sees** | *"Meta charges a small fee for some messages and bills you directly. You'll need to add a payment method in your Meta account."* Step-by-step guidance |
| **Does** | Adds it in Meta Business Manager |
| **System** | Detects completion |
| **Can fail** | Owner has no card → **this is a real conversion wall in this market** and is flagged as open question 8.b. Becoming a Meta Solution Partner would let us absorb this |

### Step 6 — Connected, with limits made visible

The Connections screen then shows what the platform actually permits, rather than pretending it is unlimited:

```
   💬 WhatsApp        ● Connected
      Number          +250 78x xxx xxx
      Display name    "Salon Ubwiza"  ✅ approved
      Quality         ● Green
      Daily limit     250 business-initiated messages
                      (rises automatically with good quality)
      Replies         Free within 24 hours of a customer message
```

**Showing the tier and quality rating is a deliberate choice.** These are platform-controlled and can degrade automatically; a tenant who discovers their limit by failing to send has been failed by us, not by Meta.

---

## 5. Instagram — detailed flow

| Step | What happens |
|---|---|
| 1 | **Professional account check.** Personal accounts cannot be connected at all (I1). If personal, we guide the conversion — free, reversible, does not change how the profile looks publicly |
| 2 | Instagram OAuth. Consent screen lists the scopes: read basic profile, manage messages, manage comments |
| 3 | Token exchanged for a long-lived token (~60 days), scheduled for proactive refresh |
| 4 | Optional: enable **comment-to-DM**. Explained honestly — an automated public reply, then a private message, **one per comment, ever** (I5) |
| 5 | Connected, with the 24-hour window and the absence of any template mechanism explained plainly |

**The Instagram window explanation is important and must not be soft-pedalled.** Unlike WhatsApp, there is no paid way to reach a customer after 24 hours (I4). The product therefore offers, when a window is closing on an unresolved conversation, to move the customer to WhatsApp or SMS — otherwise the conversation dies silently and the business never knows.

---

## 6. Telegram — detailed flow

| Step | What happens |
|---|---|
| 1 | *"Telegram needs you to create a bot. It takes two minutes."* |
| 2 | A copy-ready block: open Telegram → message **@BotFather** → send `/newbot` → choose a name → choose a username ending in `bot`. Plus a 30-second video in Kinyarwanda |
| 3 | Owner pastes the returned token into one field |
| 4 | We validate the token immediately, show the bot's name and picture back as confirmation, set the webhook with a secret token |
| 5 | Optionally connect a **Telegram Business** account, explaining that they control which chats the bot can see, and that they can pause it per chat at any time (T2) |

**T1 is unavoidable** — no API lets us create a bot on someone's behalf. The mitigation is making a copy-paste task feel small: exact text to send, a video, and instant validation so success is obvious.

**T3 requires a designed state:** a Business Bot can be paused or disconnected per chat silently, with no webhook. We infer it from send failures and surface it per conversation rather than letting messages vanish.

---

## 7. SMS and web chat

| Channel | Flow |
|---|---|
| **SMS** | Sender ID registration per carrier (MTN and Airtel separately), roughly three weeks, requiring a procuration letter and registration certificate. Local aggregator only — routing Rwandan SMS through a global API costs roughly 80× more. Includes mandatory opt-out keyword handling (STOP/CANCEL/END/UNSUBSCRIBE, English and Kinyarwanda) and **suppression-list management, which Subiza must provide because tenants will not build it** |
| **Web chat** | Instant. Copy a snippet, or a link for businesses with no website. The only channel with no external gatekeeper |

---

## 8. Screens and states

| Screen | States |
|---|---|
| Connections list | Per channel: working · action needed · not connected · unavailable |
| WhatsApp pre-flight | Questions · routed |
| WhatsApp route choice | Move · coexistence · different number |
| Embedded Signup | Launching · in Meta's popup · returned · abandoned at screen N · exchange failed |
| Display name | Pending · approved · rejected |
| Business verification | Not started · submitted · in review · approved · rejected |
| Payment method | Needed · added |
| Instagram | Personal (blocked) · converting · OAuth · connected |
| Telegram | Instructions · token entry · validating · invalid · connected |
| Any channel | Healthy · token expiring · disconnected · rate-limited · quality degraded · suspended |

---

## 9. Platform constraints

Every constraint from [Flow 04 §2–5](04-platform-constraints.md) applies here. The ones that visibly shape screens:

| Constraint | Screen consequence |
|---|---|
| W1 owner must enter the OTP | Guided handoff with abandonment detection |
| W2 number already on WhatsApp | Pre-flight question, three routes |
| W3 Coexistence limits | Warning before starting; 20 msg/s cap shown |
| W4 display name review | Pending/rejected state that never blocks |
| W8 no general-purpose bots | Agent scope enforced by construction; explained in the connection summary |
| W10–W13 verification, tiers, quality | Honest waiting states; tier and quality visible |
| W14 tenant's own payment method | Its own guided step |
| I1 professional account | Detected and guided |
| I4 no template equivalent | Window-closing migration offer |
| I5 one private reply per comment | Idempotent, never retried |
| T1 BotFather | Guided copy-paste with validation |
| T3 silent per-chat pause | Inferred and surfaced |
| X1 revocation is not pushed | Reactive detection; a visible disconnected state within 5 minutes |

---

## 10. Edge cases and failures

| Case | Behaviour |
|---|---|
| Abandons Meta's popup | We know which screen; resume with a targeted explanation rather than restarting blind |
| Coexistence sync interrupted | Cannot be retried — must fully offboard and re-onboard. Warned up front; if it happens, a clear recovery path and a support hand |
| Display name rejected three times | Escalated to Onboarding Ops with naming guidance |
| Business verification rejected | Reason, guidance, resubmission; tenant flagged for assistance |
| Token expires or is revoked | Detected on the next failure; channel marked disconnected within 5 minutes; one-click reconnect; other channels unaffected |
| WhatsApp quality drops to red | Owner alerted **before** the 7-day grace expires, with the specific cause and remedy |
| WABA banned | Immediate alert, plain explanation, appeal guidance, other channels keep working |
| Instagram account switched back to personal | Detected on failure; guided re-conversion |
| Owner connects a channel their customers do not use | Analytics show zero traffic; we suggest disconnecting rather than letting it sit as clutter |

---

## 11. Retention rationale

| Decision | Reason |
|---|---|
| Pre-flight questions before Meta's popup | Turns the category's most common dead end into a branch |
| Telegram encouraged first | Zero friction, instant success, proves the messaging core before the hard channel |
| Channels are never in the critical path | Meta verification of 5–15 days cannot be allowed to delay first value |
| Honest waiting states | Under-promising on external queues protects trust when they inevitably take two weeks |
| Platform limits made visible | A tenant who learns their limit by failing has been failed by us |
| One-click reconnect, prominently | Silent disconnection is this product's worst failure; recovery must be trivial |
| Trade-offs shown, not decided for them | Move vs coexistence vs new number is a genuine business judgement |

---

## 12. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 8.1 | Telegram connects in one session | Connected ÷ started | > 90% |
| 8.2 | WhatsApp active-time is short | Owner-time excluding waiting | < 10 min |
| 8.3 | Pre-flight prevents dead ends | Tenants hitting W2 inside Meta's popup | < 5% |
| 8.4 | Waiting is honest | Copy audit: no "instant" claims for any Meta path | Pass |
| 8.5 | Disconnection detected fast | Time from first auth failure to visible state | < 5 min |
| 8.6 | Reconnect is one click | Manual audit | Pass |
| 8.7 | Quality degradation is pre-warned | Alerts sent before the grace period expires | 100% |
| 8.8 | Instagram window closure never loses a customer silently | Migration offer shown before expiry | 100% |
| 8.9 | Instagram private replies are never retried | Idempotency test | Pass |
| 8.10 | Business verification documents collected once | Upload count across Meta + CPaaS + internal | 1 |
| 8.11 | Every platform error becomes plain language in four languages | Error-copy audit | 100% |

---

## 13. Instrumentation

| Event | Properties |
|---|---|
| `channel.connect_started` / `connected` / `abandoned` | channel, step, duration |
| `whatsapp.preflight_answered` | already-on-whatsapp?, registered? |
| `whatsapp.route_chosen` | move / coexistence / different number |
| `whatsapp.embedded_signup_abandoned` | Meta screen name, error id |
| `whatsapp.display_name_status` | pending / approved / rejected + reason |
| `whatsapp.verification_status` | state, days elapsed |
| `whatsapp.quality_changed` | old, new, tier |
| `channel.disconnected` | channel, cause, detection latency |
| `channel.reconnected` | channel, downtime |
| `instagram.window_migration_offered` / `accepted` | — |

---

## 14. Open questions

| # | Question | Blocks |
|---|---|---|
| 8.a | Does Coexistence work reliably enough in practice to offer, or should we require a clean number? | Route options |
| 8.b | How many Rwandan SMEs can add a payment method to Meta? If few, **Solution Partner status becomes a business priority, not a nicety** | WhatsApp conversion |
| 8.c | Are marketing templates genuinely unavailable for Rwandan WABAs? | Expectations, future features |
| 8.d | Is the BotFather step tolerable for a non-technical owner, or should Telegram be deferred? | Channel scope |
| 8.e | Is Instagram worth building for Rwanda at 456,000 users, or is it an expansion-market feature? | Roadmap |
| 8.f | Does the three-week SMS sender-ID registration justify SMS in v1? | Channel scope |

---

*Next: [09 — Agent Design & Scripts](09-flow-agent-design-and-scripts.md)*
