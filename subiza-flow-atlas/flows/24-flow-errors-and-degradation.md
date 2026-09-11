# 24 — Flow: Errors, Degradation & Edge Cases

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-24 |
| **Actors** | All |
| **Entry points** | Any failure, anywhere |
| **Exit states** | Recovered · degraded but working · handed to a human · fallen back to the owner's own line |
| **Depends on** | Everything |
| **Blocks** | Nothing — this flow exists so nothing else blocks |
| **Frequency** | Continuous |
| **Criticality** | Critical |

---

## 1. Purpose

Define what happens when something breaks — which is constantly, in a system that depends on carriers, platform APIs, model providers, mobile networks and mobile money.

**What breaks if this is wrong:** the failure becomes the customer's problem. In a phone call there is no error page and no retry button. There is a caller, and either something sensible happens or they hang up.

---

## 2. The three laws of failure

Every rule below derives from these.

> **Law 1 — Subiza must never make a business less reachable than it was before.**
> Whatever fails, calls fall back to the owner's own line. This is the product's foundational promise and it outranks every other consideration.

> **Law 2 — Degrade, do not die.**
> A reduced service is better than none. Fast-path answers with no model. A different voice. A message taken instead of a booking made. Silence is the only unacceptable outcome.

> **Law 3 — Never guess to avoid an error.**
> When the system does not know, it says so and fetches a human. A confident wrong answer is worse than an admitted failure, because it damages the business rather than only frustrating the caller.

---

## 3. The degradation ladder

```
   FULL SERVICE
        │  speech recognition fails
        ▼
   DTMF + fast-path answers  ("Press 1 for hours, 2 to leave a message")
        │  language model fails
        ▼
   Fast-path answers only    (hours, location, "someone will call you")
        │  retrieval fails
        ▼
   Message taking only
        │  everything AI fails
        ▼
   Immediate escalation to a human
        │  no human available
        ▼
   Take a message, promise a specific callback
        │  platform is down entirely
        ▼
   ══ CALLS RING THE OWNER'S OWN PHONE, AS BEFORE SUBIZA ══
```

Each rung is a designed state with its own greeting and behaviour — not an error path that happens to be less broken.

---

## 4. Failure catalogue

### 4.1 Runtime — during a live conversation

| Failure | Behaviour | Caller experiences |
|---|---|---|
| Speech recognition unavailable | Managed fallback if authorised → DTMF menu | *"Ndumva nabi. Kanda 1 ku masaha, 2 gusiga ubutumwa."* |
| Recognition working but confidence collapses | Two attempts, then the other language, then DTMF, then escalate | Never a third failed attempt |
| Speech synthesis unavailable | **Fallback voice.** A different voice beats silence | A different-sounding assistant |
| Language model slow (>2s) | Filler acknowledgement, then fast-path if it does not arrive | *"Reka mbirebe…"* then an answer or an escalation |
| Language model unavailable | Fast-path answers only; everything else escalates | Hours and location answered; anything else goes to a person |
| Retrieval unavailable | **Refuse and escalate. Never generate** | *"Reka mbahamagarire umuntu."* |
| Booking integration down | Capture the intent, promise human confirmation | *"Umuntu azabemeza ako kanya."* |
| Escalation target unreachable | Message-and-promise with a specific time | A concrete callback commitment |
| Media stream drops | Reconnect; if impossible, log incomplete and notify the owner immediately | Call ends; the owner knows within seconds |
| Caller silent for 15s | One prompt, then take a message and end gracefully | Not left hanging |
| **Credit exhausted** | Agent declines; the carrier's forwarding falls through | **Their phone rings** |
| Platform outage | Same | **Their phone rings** |

**The row that matters most is the last two.** Forwarding is not removed on failure — Subiza simply declines the call, and the carrier does what it did before. Tested as an acceptance criterion, not assumed.

### 4.2 Channel failures

| Failure | Detection | Behaviour |
|---|---|---|
| Token expired or revoked | **Reactive — on the next failed call.** Platforms do not push revocation notices (X1) | Channel marked disconnected within 5 minutes; visible banner; one-click reconnect; **other channels unaffected** |
| WhatsApp quality degraded | Meta webhook | Owner alerted **before** the grace period expires, with the specific cause and remedy |
| WABA banned | Meta webhook | Immediate alert, plain explanation, appeal guidance; other channels keep working |
| 24-hour window closed | State tracked | Free-form composition disabled **with an explanation before the owner types**, alternatives offered |
| Instagram window closing on an unresolved conversation | Countdown | Offer to migrate the customer to WhatsApp or SMS ([Flow 08](08-flow-messaging-channel-connection.md)) |
| Telegram bot paused per chat | Inferred from send failures (T3) | Per-chat state shown; the owner is told what happened |
| Rate limit hit | Platform response | Queue and pace; never drop; show the queue |
| Webhook flood or duplicates | Idempotency on the platform's message ID | Deduplicated silently |
| Webhooks arriving out of order | Timestamp-ordered state (X4) | No visible effect |

### 4.3 Setup and configuration failures

| Failure | Behaviour |
|---|---|
| OTP not delivered | Resend → voice call → WhatsApp. Three routes |
| Test call not received | Browser test → inbound number. Three routes |
| Forwarding verification fails | Auto-retry once after 60s (propagation), then troubleshoot, then assisted call |
| **Forwarding silently removed later** | Weekly verification detects it; amber state with the code to re-dial |
| OCR unusable | Guided retake → type instead. Never a dead end |
| Meta signup abandoned mid-popup | Resume from the known screen with a targeted explanation |
| Coexistence sync interrupted | Cannot be retried — full offboard and re-onboard. **Warned before starting**; support hand if it happens |
| Voice verification fails | Retry → 24h cooldown → human review |
| MoMo payment pending indefinitely | Reconciliation job; visible pending state with a check action; manual credit with audit if needed |

### 4.4 Data and platform failures

| Failure | Behaviour |
|---|---|
| Database unavailable | Conversation continues from in-memory session state where possible; writes queued; if impossible, escalate the call |
| Object storage unavailable | Transcript kept, recording lost, **the gap disclosed** rather than shown as a broken player |
| Cross-border authorisation lapsed | Affected processing **stops**. Fails closed ([Flow 23](23-admin-trust-safety-and-quality.md)) |
| Model provider outage | Provider abstraction fails over; if none available, degrade down the ladder |
| Aggregator outage | Top-up unavailable with an honest message; **grace extended automatically** so our outage never pauses a customer |

---

## 5. Error communication

### 5.1 To the caller

| Rule | Reason |
|---|---|
| Never say "error," "system," "API" or anything technical | They are a customer of a salon, not of a software platform |
| Always offer a path — a human, a message, a callback | Never a dead end |
| Apologise once, briefly, then act | Repeated apology wastes the seconds before they hang up |
| In their language | Failure messages are translated as carefully as greetings |

### 5.2 To the business owner

| Rule | Reason |
|---|---|
| Say what happened, what it means for their business, and what to do | "Webhook 401" means nothing; "WhatsApp disconnected — your customers' messages aren't reaching Subiza" means everything |
| One action, prominent | Not a list of possibilities |
| In their language | All four |
| Never blame them | Even when it is their configuration, the framing is "here's how to fix it" |
| Tell them when it is our fault, plainly | Trust survives honest failure; it does not survive evasion |

### 5.3 To us

Structured, correlated by conversation ID, with the full trace attached, alerting per [Flow 20](20-admin-console-and-operations.md).

---

## 6. Every screen's error states

A checklist applied to every screen in the product:

| State | Required behaviour |
|---|---|
| **Loading** | A skeleton or an honest message. Never an unexplained spinner over 3 seconds |
| **Empty** | Explain what goes here, why it is empty, offer one action (G6) |
| **Offline** | Show it. Queue actions. Retry when connectivity returns |
| **Partial data** | Show what loaded, say what did not |
| **Permission denied** | Explain why and who can do it — never a bare "forbidden" |
| **Not found** | Explain what happened to it and where to go instead |
| **Rate limited** | Say when to try again, in minutes |
| **Server error** | Apologise, say we know, offer support. **Never an error code as the primary message** |

---

## 7. Offline and poor connectivity

A first-class case in a market where rural internet usage is 19%, a third of mobile internet is on 2G or EDGE, and data can cost a meaningful share of monthly income.

| Situation | Behaviour |
|---|---|
| Connection lost mid-form | State preserved locally; submitted on reconnect |
| Connection lost mid-activation | Resume at the exact step |
| Slow connection | Progressive loading; text first, media on demand; **never preload audio** |
| Very slow (2G) | A lightweight mode: text only, no images, minimal payload |
| Fully offline | Cached conversation list readable; actions queued with a visible pending state |

**The conversation runtime is unaffected by the owner's connectivity.** The AI answering the phone runs on our infrastructure; if the owner's phone is offline, calls are still answered. Only their *visibility* into it is delayed — a distinction worth stating in the product so an owner on a bad connection does not assume the service is down.

---

## 8. Success criteria

| # | Criterion | Test | Target |
|---|---|---|---|
| 24.1 | **Every failure mode has a defined, tested behaviour** | Fault injection per row of §4 | 100% |
| 24.2 | **Platform failure never blocks calls reaching the owner** | End-to-end test with the platform down | Pass |
| 24.3 | Credit exhaustion never blocks calls reaching the owner | End-to-end test at zero balance | Pass |
| 24.4 | The system never generates an answer when retrieval fails | Adversarial test | 100% escalate |
| 24.5 | No third consecutive failed understanding attempt | Runtime audit | 100% |
| 24.6 | Channel disconnection is detected within 5 minutes | Fault injection per channel | Pass |
| 24.7 | One channel failing never affects another | Isolation test | Pass |
| 24.8 | No technical language reaches a caller or an owner | Copy audit, four languages | 100% |
| 24.9 | Every screen has all eight states from §6 | Screenshot audit | 100% |
| 24.10 | Webhook handlers are idempotent and order-tolerant | Replay test | Pass |
| 24.11 | Forwarding loss is detected within 7 days | Scheduled verification test | Pass |
| 24.12 | Our outage extends the billing grace period automatically | Fault injection | Pass |
| 24.13 | Offline actions queue and complete on reconnect | Network test | Pass |

**24.1 is the flow's defining criterion.** A failure mode without a tested behaviour is a failure mode whose behaviour will be discovered by a customer.

---

## 9. Instrumentation

| Event | Properties |
|---|---|
| `failure.occurred` | component, type, conversation, tenant, recoverable? |
| `degradation.entered` / `exited` | rung, cause, duration |
| `fallback.to_owner_line` | cause, tenant |
| `channel.disconnected` | channel, cause, detection latency |
| `error.shown_to_owner` | screen, error type, action taken |
| `error.shown_to_caller` | conversation, type, outcome |
| `offline.queued_action` / `completed` | action, queue duration |
| `recovery.succeeded` / `failed` | component, attempts |

**`fallback.to_owner_line` is the most important reliability metric in the platform.** It counts the times Law 1 saved a business from us.

---

## 10. Open questions

| # | Question | Blocks |
|---|---|---|
| 24.a | Does declining a call reliably cause the carrier's no-answer forwarding to fall through to the owner, on both MTN and Airtel? **Law 1 depends entirely on this** | The foundational promise |
| 24.b | How long should the caller wait before a filler acknowledgement — and does it help or irritate in Kinyarwanda conversational norms? | Latency masking |
| 24.c | Is a DTMF fallback acceptable to callers, or does it feel like the IVR systems people dislike? | Degradation design |
| 24.d | What is the right silence timeout before ending a call gracefully? | Runtime |
| 24.e | Should tenants see a public status page? | Transparency |

---

*Next: [25 — Notifications](25-flow-notifications.md)*
