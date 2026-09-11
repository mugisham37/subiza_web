# 17 — Flow: Billing & Mobile Money

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-17 |
| **Actor** | A5 Owner only |
| **Entry points** | Credit section · low-balance alert · a blocked action · the monthly statement |
| **Exit states** | Topped up · plan changed · lapsed (agent paused, calls still reach the owner) |
| **Depends on** | 05 |
| **Blocks** | Paid usage |
| **Frequency** | Monthly, or on top-up |
| **Criticality** | High |

---

## 1. Purpose

Let a Rwandan SME pay for Subiza the way they pay for everything else — mobile money, prepaid, in Rwandan francs, with no surprises — and make sure running out of credit never leaves their business less reachable than it was before.

**What breaks if this is wrong:** involuntary churn. A business that wants the product but cannot pay for it conveniently, or that gets an unexpected bill, is lost for reasons unrelated to whether the product works.

---

## 2. The design position: prepaid credit, MoMo-native

| Decision | Reason |
|---|---|
| **Prepaid credit, not post-paid subscription** | It is how Rwandan SMEs already buy airtime and data. It removes credit risk for us and removes bill anxiety for them |
| **Mobile money, never a card** | 5.8 million active MoMo users and 578,000 merchants in Rwanda; card penetration is marginal. A card field anywhere in the product is a conversion wall (G18) |
| **Priced and displayed in RWF** | USD pricing transfers our FX risk to the customer and reads as foreign |
| **Voice metered, messages bundled** | Follows the cost structure: voice minutes dominate marginal cost; messaging is an order of magnitude cheaper |
| **A hard spend cap the owner controls** | The category's cautionary tale sold small businesses expensive contracts they could not exit. Never a surprise bill |
| **No seats** | A three-person business has no seats |

---

## 3. Overview

```
   ┌──────────────────────────────────────────────────────────┐
   │  CREDIT                              14,200 RWF           │
   │  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  about 11 days at your usual rate    │
   │                                                           │
   │  [ Top up with MoMo ]                                     │
   │                                                           │
   │  This month:  213 minutes · 1,840 messages                │
   │  Plan: Ubucuruzi — 20,000 RWF/month                       │
   └──────────────────────────────────────────────────────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  TOP UP          │  │  CHANGE PLAN     │
        │  amount → MoMo   │  │  compare · switch│
        │  prompt on phone │  │  effective next  │
        │  → confirmed     │  │  cycle           │
        └──────────────────┘  └──────────────────┘

   IF CREDIT RUNS OUT:
        grace period → agent pauses → CALLS STILL RING THE OWNER
```

---

## 4. Detailed flow

### 4.1 Top up

| | |
|---|---|
| **Sees** | Balance, an estimate in **days remaining at their usual rate** (more useful than an abstract number), and four preset amounts plus a custom field |
| **Does** | Taps an amount, confirms the MoMo number (pre-filled with the account number) |
| **System** | Initiates a collection through a licensed aggregator. **Never handles funds directly** — this keeps Subiza outside payment-service-provider licensing |
| **Then sees** | *"Check your phone. Enter your MoMo PIN."* with a live status: pending → confirmed → balance updated |
| **Can fail** | Insufficient MoMo balance → clear message, retry with a smaller amount. Timeout → status stays pending with a "check again" action, never a silent failure. Wrong number → correction path |

**"About 11 days" rather than "14,200 RWF" is the important detail.** A balance in francs requires the owner to do arithmetic about their own usage. Days remaining is the answer to the question they are actually asking.

### 4.2 Warnings before, never after

| Threshold | What happens |
|---|---|
| **20% remaining** | Header balance turns amber. In-app prompt |
| **5% or ~2 days** | WhatsApp message: *"Your Subiza credit is running low — about 2 days left. Top up to keep answering calls."* |
| **Zero** | **Grace period** (length to be set — see open questions), during which the agent keeps working |
| **Grace expired** | Agent pauses. Owner notified. **Calls fall back to their own line** |

**Three warnings before anything stops.** Involuntary churn from a lapsed balance is the most avoidable kind, and it is entirely a design problem.

### 4.3 What "paused for credit" actually means

This is the most important behaviour in the flow:

| Still works | Stops |
|---|---|
| **Calls ring the owner's phone as before** | The AI answering |
| Reading past conversations | New AI conversations |
| The app, settings, everything | Messaging automation |
| Topping up (obviously) | |

**Forwarding is not removed.** Subiza simply declines the call, so the carrier's no-answer forwarding falls through to the owner exactly as it did before Subiza existed. The business is never worse off (G22). This is tested as an acceptance criterion.

### 4.4 Plans and usage

Plans are bundles of included voice minutes and messages, with transparent overage and a spend cap the owner sets. The usage screen shows what was consumed and, alongside it, the value delivered ([Flow 16](16-flow-analytics-and-retention.md)) — because a bill shown next to "134 enquiries recovered" is a different document from a bill shown alone.

Plan changes take effect at the next cycle. Downgrades are never blocked or made harder than upgrades.

### 4.5 The monthly statement

Delivered on WhatsApp and in-app:

```
   September with Subiza

   You paid          20,000 RWF
   Subiza answered   134 conversations
   Of those          89 you would have missed
   Bookings taken    38

   [ See details ]   [ Top up ]
```

Cost and value in the same message, always in that order.

---

## 5. Screens, states, decisions

| Screen | States |
|---|---|
| Credit | Healthy · low (amber) · critical (red) · zero (grace) · lapsed |
| Top up | Amount selection · initiating · **pending on phone** · confirmed · failed · timed out |
| Plan | Current · comparing · changing · scheduled change |
| Usage | Current period · history · approaching cap · cap reached |
| Statement | Generated · sent · viewed |

| Decision | Branches |
|---|---|
| Balance low? | Amber → warn → WhatsApp → grace → pause |
| Top-up confirmed? | Credit applied · pending · failed with reason |
| Spend cap reached? | Notify and pause AI, with an override available |
| Plan change direction? | Upgrade immediate option · downgrade next cycle · both equally easy |
| Lapsed? | Agent paused · **calls still reach the owner** |

---

## 6. Platform constraints

| Constraint | Effect |
|---|---|
| Payment aggregator, not direct funds handling | Avoids BNR payment-service-provider licensing; the aggregator carries that obligation |
| **W19 — WhatsApp service messages billable from 1 Oct 2026** | Billing notifications are utility-category messages and count against the 1,000 free per WABA per month. Must be in the cost model |
| **W6 — 24-hour window** | Billing messages are business-initiated and need an approved utility template |
| MoMo collection latency | Confirmation is asynchronous; the UI must handle a genuinely pending state rather than assuming instant settlement |
| G22 — never less reachable | The lapsed behaviour is a hard product requirement, not a courtesy |
| VAT and Digital Services Tax on digital services, effective FY2026/27 | Pricing display and invoicing must reflect the correct treatment once confirmed with the revenue authority |

---

## 7. Edge cases and failures

| Case | Behaviour |
|---|---|
| MoMo confirmed but our webhook never arrives | Reconciliation job; the owner sees "pending" with a check action, never a lost payment. Support can apply credit manually with a reason and an audit entry |
| Double payment | Detected by idempotency key; the second is credited, not charged twice |
| Pays from a different MoMo number | Allowed, matched by reference. Recorded |
| Balance goes negative from an in-flight call | Absorbed. We never cut a call in progress for a few francs |
| Owner sets a spend cap and hits it mid-day | Agent pauses, owner notified with a one-tap override |
| Currency or price change | 30 days' notice; existing credit honoured at the old rate |
| Aggregator outage | Top-up unavailable with an honest message; **grace period automatically extended** so an outage on our side never pauses a customer's agent |
| Refund request | Manual, through support, with a threshold-based approval and an audit entry ([Flow 21](21-admin-tenant-lifecycle.md)) |

---

## 8. Retention rationale

| Decision | Reason |
|---|---|
| Prepaid MoMo | Matches how the market already pays; removes the card wall entirely |
| Days remaining, not francs | Answers the question the owner is actually asking |
| Three warnings before anything stops | Involuntary churn is the most avoidable churn |
| Lapse never kills the line | The business must never be worse off for having tried us |
| Cost and value in one message | A bill alone invites cancellation; a bill next to "89 recovered" invites renewal |
| Downgrade as easy as upgrade | Dark patterns buy a month and cost a reputation, in a market where reputation travels fast |
| Spend cap the owner controls | The direct answer to the category's history of surprise costs |
| Grace extended during our outages | Never punish a customer for our failure |

---

## 9. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 17.1 | Top-up completes in under 60 seconds | Median initiation → confirmed | < 60s |
| 17.2 | Top-up succeeds | Confirmed ÷ initiated | > 95% |
| 17.3 | No card is required anywhere | Manual audit | Pass |
| 17.4 | Three warnings before pause | Functional test | 100% |
| 17.5 | **Lapsed credit never blocks calls reaching the owner** | End-to-end test at zero balance | Pass |
| 17.6 | Pending payments are always reconciled | Unreconciled after 24h | 0 |
| 17.7 | Value shown alongside cost | Statement audit | 100% |
| 17.8 | Downgrade path has the same number of taps as upgrade | UI audit | Pass |
| 17.9 | Spend cap is respected | Functional test | Pass |
| 17.10 | Aggregator outage extends grace automatically | Fault-injection test | Pass |
| 17.11 | All amounts in RWF, correctly formatted | Localisation audit | Pass |

---

## 10. Instrumentation

| Event | Properties |
|---|---|
| `billing.balance_warning` | threshold, days remaining, channel |
| `billing.topup_initiated` / `pending` / `confirmed` / `failed` | amount, method, duration, failure reason |
| `billing.grace_entered` / `grace_extended` / `lapsed` | days, reason |
| `billing.agent_paused_for_credit` | balance, hours in grace |
| `billing.plan_changed` | from, to, direction |
| `billing.spend_cap_hit` | cap, overridden? |
| `billing.statement_sent` / `viewed` | period |
| `billing.refund` | amount, reason, approver |

**`billing.lapsed` without a preceding top-up attempt is a churn signal, not a payment problem** — it usually means intent to leave, and it should reach a human ([Flow 16 §6](16-flow-analytics-and-retention.md)).

---

## 11. Open questions

| # | Question | Blocks |
|---|---|---|
| 17.a | What is the MoMo collection fee schedule, and does it change viable price points? | Pricing |
| 17.b | How long should the grace period be — 24h, 72h, a week? Longer is kinder and costs real money | Lapse policy |
| 17.c | Should the free allowance cover activation and the first week, or only activation? | Trial design |
| 17.d | Is Airtel Money needed at launch, or is MTN MoMo sufficient at 66% market share? | Payment coverage |
| 17.e | Do owners prefer monthly plans or pure pay-as-you-go credit? | Plan structure |
| 17.f | How are VAT and the Digital Services Tax applied to a prepaid credit model? | Compliance, pricing |

---

*Next: [18 — Team & Permissions](18-flow-team-and-permissions.md)*
