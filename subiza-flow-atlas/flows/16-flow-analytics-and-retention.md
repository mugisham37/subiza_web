# 16 — Flow: Analytics & the Retention Loop

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-16 |
| **Actor** | A5 Owner, A6 Manager, A8 Viewer |
| **Entry points** | Home zone 3 · Results · **the weekly WhatsApp report** · a low-credit prompt |
| **Exit states** | Value seen · action taken · churn signal raised |
| **Depends on** | 14 |
| **Blocks** | Renewal |
| **Frequency** | Weekly (pushed), monthly (billing), on demand |
| **Criticality** | High — **this is where the subscription renews** |

---

## 1. Purpose

Make the value visible. An owner who cannot see what Subiza did for them will cancel it the first month money is tight, regardless of how well it worked.

**What breaks if this is wrong:** silent churn. The product works, the owner never notices, and they cancel while describing it as "not really doing much."

---

## 2. The one number

Every analytics feature in this flow exists to support a single number:

> ## **31 calls you would have missed**

Not "conversations handled." Not "engagement." Not "AI resolution rate." **Calls that would have gone unanswered before Subiza existed, and were answered.**

It works because:

- It is **counterfactual** — it names something that would not have happened otherwise.
- It is **verifiable** — the owner can open any one of those 31 and read what was said.
- It is **emotionally correct** — it maps exactly onto the fear that made them buy.
- It **cannot be shown by a competitor selling "AI-powered engagement."**
- It is **produced as a side-effect of the setup choice.** Conditional forwarding means every Subiza-handled call is definitionally one the business missed ([Flow 07](07-flow-phone-connection.md)).

### How it is calculated — and honestly

| Counted | Reason |
|---|---|
| Calls arriving outside stated opening hours | Nobody was there |
| Calls that arrived while the owner's line was busy | They could not have taken it |
| Calls that rang unanswered before forwarding triggered | They did not take it |
| Messages received outside hours and answered within minutes | Same logic |

| **Not** counted | Reason |
|---|---|
| Sandbox and test conversations | Not real |
| Calls at rung 4 that the owner might have answered | Unprovable, so excluded |
| Duplicate contacts from the same person within an hour | One missed customer, not three |

**The exclusions matter more than the inclusions.** A number the owner can poke a hole in is worse than a smaller number they trust. If they ever catch us inflating it, every other number in the product becomes suspect.

---

## 3. Overview

```
   ┌─────────────────────────────────────────────────────────┐
   │  DAILY   Home zone 3                                     │
   │          "47 answered · 31 you would have missed"        │
   └────────────────────────┬────────────────────────────────┘
                            ▼
   ┌─────────────────────────────────────────────────────────┐
   │  WEEKLY  ★ WhatsApp message from Subiza ★                │
   │                                                          │
   │   "Muraho Claudine. This week Subiza answered 47         │
   │    calls and messages. 31 of them came when you          │
   │    were closed or busy — those would have been           │
   │    missed. 9 became bookings.                            │
   │    Most asked: braid prices."                            │
   │                                                          │
   │    [ See details ]                                       │
   └────────────────────────┬────────────────────────────────┘
                            ▼
   ┌─────────────────────────────────────────────────────────┐
   │  MONTHLY  Value statement, alongside billing             │
   │           "You paid 20,000 RWF. Subiza recovered 134     │
   │            enquiries and 38 bookings."                   │
   └────────────────────────┬────────────────────────────────┘
                            ▼
                   RENEW  ·  EXPAND  ·  or CHURN SIGNAL
```

**The weekly report is delivered on WhatsApp, not by email.** It reaches the owner where they already are, costs them no data to open, and doubles as proof the product works — the notification is itself an instance of the thing they are paying for.

---

## 4. The Results screen

Four sections, in order of what an owner cares about.

### 4.1 What Subiza did for you

```
   THIS WEEK                              [ week ▾ ]

   47   conversations answered
   31   you would have missed          ← the number
    9   bookings taken
    6   messages passed to you
    2   needed you and you handled them

   Busiest:  Saturday 09:00–10:00
   Quietest: Tuesday afternoon
```

### 4.2 What your customers asked

Ranked intents with counts, and — critically — **what could not be answered**:

```
   Braid prices              18
   Opening hours             11
   Booking                    9
   Location                   5
   Parking                    3   ⚠ Subiza couldn't answer this
   Delivery                   2   ⚠ Subiza couldn't answer this

   [ Teach Subiza about parking ]
```

**This is the most valuable screen in the product for the business itself.** No Rwandan SME has ever had a ranked list of what their customers ask. It is genuinely new information about their own business, and the unanswered rows convert directly into two-minute improvement tasks drawn from real customer demand.

### 4.3 How well it worked

Presented as plain statements rather than metrics:

| Shown | Underlying |
|---|---|
| *"Subiza handled 8 out of 10 on its own"* | Containment rate |
| *"It understood callers well"* / *"Some callers were hard to understand"* | Understanding rate |
| *"It answered in about a second"* | Latency (only shown when it degrades) |
| *"2 customers asked for a person and got one"* | Escalation success |

**Bad news is shown too, with a fix attached.** *"3 callers spoke Swahili and Subiza couldn't help them. Want to add Swahili?"* Hiding weakness produces an owner who discovers it from a customer complaint.

### 4.4 What you could do next

At most three suggestions, each derived from the tenant's own data, each a small concrete task:

- *"Parking was asked 3 times and Subiza couldn't answer."* → add knowledge
- *"You've had 12 WhatsApp messages this week. Connect WhatsApp so Subiza answers those too."* → connect a channel
- *"Subiza has handled 34 calls with no problems. Let it answer when you're busy too?"* → move up the trust ladder

---

## 5. The weekly WhatsApp report — the retention mechanic

| Aspect | Decision |
|---|---|
| **Channel** | WhatsApp primary; SMS fallback for feature phones; in-app always |
| **When** | Monday morning, in the tenant's timezone. Configurable |
| **Length** | Under 60 words. It is a message, not a newsletter |
| **Language** | The owner's chosen language |
| **Content** | The number, one supporting fact, one thing customers asked, one link |
| **Frequency cap** | One per week. Never more, regardless of how much happened |
| **Off switch** | Present and honoured, one tap, no dark pattern |
| **First send** | End of the first week, even if the numbers are small — early proof matters more than impressive proof |

**If the week was quiet, the message says so honestly** and offers something useful: *"Quiet week — 4 conversations. Your busiest day is usually Saturday."* Inventing enthusiasm about a slow week is how a message becomes noise the owner mutes.

---

## 6. Churn signals

The analytics layer is also our early-warning system. Signals, in order of predictive strength:

| Signal | Meaning | Response |
|---|---|---|
| **Agent paused and not resumed within 48h** | Something went wrong | **Human contact**, not an email |
| **Traffic drops sharply** | They may have removed forwarding and reverted to manual | Verify forwarding; contact |
| **Stopped opening the app** (>10 days) | Habit broken | Re-engagement with a specific finding from their own data |
| **Never activated** (day 7 / 14 / 30) | Stalled | Escalating prompts, then a human at day 30 |
| **Credit lapsed without top-up** | Payment friction or churn intent | Grace period, then contact |
| **Containment falling** | Quality degrading | Investigate as a product issue first, not a customer issue |
| **Escalations unanswered** | The owner has disengaged | Contact |
| **Repeated 👎 without corrections** | Unhappy but not fixing | Offer help |

Each signal creates a task in Onboarding Ops or Support ([Flow 21](21-admin-tenant-lifecycle.md)) with the evidence attached. **Automated win-back messaging is not a substitute for a person** in a market this relationship-driven and at this customer count.

---

## 7. Screens, states, decisions

| Screen | States |
|---|---|
| Home zone 3 | Populated · first week (partial) · no traffic yet |
| Results | This week · last week · month · custom range · empty |
| Intents | Ranked · with unanswered flagged · no data yet |
| Quality | Good · degraded with explanation |
| Suggestions | 0–3 shown · acted on · dismissed |
| Weekly report | Scheduled · sent · opened · link followed · unsubscribed |
| Monthly statement | With billing |

| Decision | Branches |
|---|---|
| Enough data? | Show · "still gathering" (never a broken empty chart) |
| Quiet week? | Honest message with something useful |
| Quality degraded? | Show it with a fix |
| Churn signal? | Automated prompt · human contact |
| Suggestion relevant? | Show at most three, ranked by value |

---

## 8. Platform constraints

| Constraint | Effect |
|---|---|
| **W6 — WhatsApp 24-hour window** | The weekly report is business-initiated and therefore needs an **approved utility template**. Must be created and approved before launch |
| **W19 — service messages billable from 1 Oct 2026** | 1,000 free per WABA per month; the weekly report is one message per tenant per week, comfortably inside — but it must be in the cost model |
| **W18 — marketing templates possibly unavailable in Rwanda** | The report must be genuinely a **utility** message (an account update about their own service), not marketing. It is, but the template categorisation must be right or it will be rejected |
| G14 low bandwidth | Reports are text, not images. No charts pushed to WhatsApp |
| G16 icons and numbers over paragraphs | Results uses large numbers and plain statements, not dense tables |

---

## 9. Edge cases and failures

| Case | Behaviour |
|---|---|
| First week, tiny numbers | Report sent anyway, framed as a start: *"Your first week: 6 conversations, 4 you'd have missed."* |
| Zero conversations | No report claiming success. Instead: *"No calls came through this week. Let's check your forwarding is still on."* — because zero traffic often means broken forwarding, not a quiet week |
| Owner disputes the number | Every counted conversation is listed and openable. The number is auditable by construction |
| Traffic spike from one repeat caller | Deduplicated within an hour; a single persistent caller does not inflate the number |
| Agent performing badly | Shown honestly with a fix. Never hidden behind a good headline number |
| Owner never opens the report | Counted as a churn signal after three unopened weeks |
| Tenant on rung 4 (all calls) | The counterfactual is weaker. We show "answered when you were busy or closed" separately from total, and are explicit about which is which |

---

## 10. Retention rationale

| Decision | Reason |
|---|---|
| One number, everywhere | A single memorable figure beats a dashboard nobody opens |
| Counterfactual framing | Names something that would not otherwise have happened |
| Conservative counting | A number they can poke a hole in poisons every other number |
| Delivered on WhatsApp | Reaches them where they are; costs no data; the notification is itself proof of the product |
| Under 60 words | A message, not a report. Opened, not saved for later |
| Bad news shown with a fix | Trust survives honesty; it does not survive being surprised by a customer complaint |
| Suggestions from their own data | Specific, evidenced, two-minute tasks — the highest-quality re-engagement available |
| Intent ranking as a business insight | Genuinely new information about their own business, which no competitor gives them |
| Human contact on strong churn signals | At this customer count and in this market, a person outperforms a sequence |

---

## 11. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 16.1 | The number is visible on Home every visit | UI audit | 100% |
| 16.2 | Weekly report delivered | Sent ÷ eligible tenants | > 98% |
| 16.3 | Report is opened | Open rate | > 60% |
| 16.4 | Report drives a visit | Sessions attributed to the report | > 35% |
| 16.5 | The number is auditable | Every counted conversation is listed and openable | 100% |
| 16.6 | The number is not inflated | Manual audit of a sample against the exclusion rules | 100% correct |
| 16.7 | Suggestions are acted on | Accepted ÷ shown | > 25% |
| 16.8 | Quality problems are surfaced, not hidden | Audit: degraded weeks show the degradation | 100% |
| 16.9 | Zero-traffic weeks trigger a forwarding check | Functional test | Pass |
| 16.10 | Churn signals produce a task within 24h | Ops audit | > 95% |
| 16.11 | Unsubscribe is honoured immediately | Functional test | Pass |
| 16.12 | Report renders correctly in all four languages | Translation audit | Pass |

---

## 12. Instrumentation

| Event | Properties |
|---|---|
| `report.generated` | tenant, period, headline number, components |
| `report.sent` / `delivered` / `opened` / `link_followed` | channel, language |
| `report.unsubscribed` | after how many reports |
| `results.viewed` | period, sections viewed |
| `results.suggestion_shown` / `accepted` / `dismissed` | suggestion type |
| `intent.unanswered` | intent, count, tenant |
| `churn_signal.raised` | signal type, evidence, task created? |
| `value.recovered_count` | daily per tenant, with the component breakdown |

**`intent.unanswered` aggregated across tenants of the same business type is a product signal, not just a tenant one** — a question many salons cannot answer is a template improvement waiting to be made ([Flow 22](22-admin-ai-operations.md)).

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 16.a | Is "calls you would have missed" the right framing in Kinyarwanda, or does a direct translation lose the counterfactual force? | The core message |
| 16.b | Should the number be conversations or estimated revenue? Revenue is more persuasive but requires an average-transaction-value assumption we cannot verify | Headline metric |
| 16.c | Is Monday morning right, or does it compete with the start-of-week rush? | Timing |
| 16.d | Do owners want intent rankings, or is it an analyst's idea of value? | Feature investment |
| 16.e | At rung 4, is the counterfactual defensible at all, or should the number change shape? | Honesty |
| 16.f | Will the weekly report template be approved by Meta as a utility message in Rwanda? | Delivery channel |

---

*Next: [17 — Billing & Mobile Money](17-flow-billing-and-mobile-money.md)*
