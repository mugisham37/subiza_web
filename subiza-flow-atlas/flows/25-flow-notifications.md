# 25 — Flow: Notifications

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-25 |
| **Actors** | A5 Owner · A6 Manager · A7 Agent · A3 Voice Owner |
| **Entry points** | Any event worth interrupting someone for |
| **Exit states** | Delivered · opened · acted on · suppressed · unsubscribed |
| **Depends on** | 14 |
| **Blocks** | Retention, and escalation working at all |
| **Frequency** | Continuous, tightly capped |
| **Criticality** | High |

---

## 1. Purpose

Bring the right person back at the right moment, without becoming noise they mute.

**What breaks if this is wrong:** two opposite failures, both fatal. Too few and escalations go unanswered and the habit never forms. Too many and the owner mutes Subiza — after which escalations *also* go unanswered, and now we cannot reach them at all.

---

## 2. The design position

**WhatsApp is the primary channel, not push.** In this market it reaches the owner where they already are, costs almost nothing in data, works on a wider range of devices than a web push subscription, and — uniquely — **the notification is itself an instance of the product working**. A WhatsApp message from Subiza saying "I answered a customer for you" demonstrates the value in the act of reporting it.

**Every notification names a specific real event and deep-links to it.** Never "check your dashboard." Generic re-engagement prompts train people to ignore the sender.

**Frequency is capped hard, per type and overall.** The cap is a product feature, not a limitation.

---

## 3. The notification set

Everything the platform will ever send, in one table. Anything not on this list does not get sent.

| # | Notification | To | Channel | Urgency | Cap |
|---|---|---|---|---|---|
| **N1** | **Escalation — a customer needs you now** | Rota target | **Call**, then WhatsApp, then push | **Immediate** | Uncapped — this is the product working |
| N2 | A message was taken with a promised callback | Owner | WhatsApp + push | Immediate | Uncapped |
| **N3** | **Promised callback is due soon** | Owner | WhatsApp | Timed | Once per promise |
| N4 | First live conversation handled | Owner | WhatsApp + push | Immediate | Once, ever |
| N5 | **Weekly report** | Owner | **WhatsApp** | Scheduled | 1/week |
| N6 | Monthly statement | Owner | WhatsApp | Scheduled | 1/month |
| N7 | Credit low (20%, then 5%) | Owner | In-app, then WhatsApp | Timed | 2 per cycle |
| N8 | Credit exhausted, agent paused | Owner | WhatsApp + push | Immediate | 1 |
| **N9** | **Channel disconnected** | Owner | WhatsApp + push | Immediate | 1 per incident |
| N10 | WhatsApp quality degraded | Owner | WhatsApp | Same day | 1 per change |
| N11 | Verification approved or rejected | Owner | WhatsApp | Same day | 1 per event |
| N12 | Forwarding appears to have stopped | Owner | WhatsApp + push | Same day | 1 per detection |
| N13 | Activation resume prompt | Owner | SMS/WhatsApp | 1h, 24h, 72h | 3 total, then human |
| N14 | Knowledge gap found | Owner | In-app; WhatsApp weekly at most | Low | Bundled into N5 |
| N15 | Trust-ladder upgrade suggestion | Owner | In-app | Low | Once per rung, dismissible |
| N16 | Team invitation | Invitee | SMS/WhatsApp | Immediate | 1 + 1 reminder |
| N17 | Voice consent request | **Voice owner** | SMS/WhatsApp | Immediate | 1 + 1 reminder |
| N18 | Voice consent granted, declined or revoked | Owner | WhatsApp | Immediate | 1 |
| N19 | Data-rights request received | DPO | Internal | Immediate | Uncapped |
| N20 | Platform incident affecting this tenant | Owner | WhatsApp | Immediate | 1 per incident |

**Global cap: 3 non-urgent notifications per owner per week**, plus urgent ones (N1, N2, N8, N9, N12, N20) which are never capped because each represents something actually broken or a customer actually waiting.

---

## 4. Escalation notification — the one that must never fail

N1 is the only notification the product genuinely cannot afford to lose, because a customer is on the line or waiting.

```
   ESCALATION TRIGGERED
        │
        ▼
   1. CALL the rota target        ← a call, not a message
        │  no answer in 20s
        ▼
   2. WhatsApp with full context
        │  not read in 60s
        ▼
   3. Push notification
        │  not opened in 2 min
        ▼
   4. Next person on the rota — repeat
        │  nobody
        ▼
   5. MESSAGE AND PROMISE
        the customer gets a specific callback time
        the owner gets a high-priority item
```

**A call first, not a message.** The owner is running a shop; their phone is in their pocket. A ringing phone gets attention; a WhatsApp notification competes with everything else in their tray.

The WhatsApp version carries enough that they can act without opening the app at all:

```
   Marie Kabera is asking about a booking
   for 8 people on Saturday morning.
   Subiza couldn't confirm — it's outside
   your usual slots.

   Call her: +250 78x xxx xxx
   See the conversation: [link]
```

**The phone number is in the message.** An owner on a bad connection can act on this without loading anything.

---

## 5. The weekly report

The single most important retention mechanic in the product, specified in [Flow 16 §5](16-flow-analytics-and-retention.md). Key properties: under 60 words, on WhatsApp, Monday morning in the tenant's timezone, in their language, carrying the one number and one supporting fact, with a single link — and honest when the week was quiet.

---

## 6. Rules

### 6.1 Content

| Rule | Reason |
|---|---|
| Name a specific real event | Generic prompts train people to ignore the sender |
| Deep-link to that exact thing | Never to a dashboard |
| Enough context to act without opening the app | Bad connections, expensive data |
| The owner's language | Always |
| Under 60 words | It is a message, not a report |
| No emoji unless the owner uses them | Reads as unserious to some business owners |

### 6.2 Timing

| Rule | Reason |
|---|---|
| Urgent: immediately, any hour | A customer is waiting |
| Non-urgent: 08:00–20:00 local only | Basic respect, and mirrors the SMS sending-window guidance |
| Weekly: Monday morning | Start of the business week |
| Never two non-urgent in one hour | Bundle instead |
| Respect the owner's own business hours where known | An owner closed on Sunday does not need Sunday prompts |

### 6.3 Control

| Rule | Reason |
|---|---|
| Every non-urgent type is individually switchable off | Granular control beats an all-or-nothing mute |
| Escalations cannot be switched off — **but the rota can be changed** | Turning off "a customer needs you" is a request to route it elsewhere, not to ignore it |
| Unsubscribe honoured immediately, no dark patterns | |
| Preferences are per person, not per tenant | Aline and Claudine want different things |

---

## 7. Platform constraints

| Constraint | Effect |
|---|---|
| **W6 — 24-hour window** | Every business-initiated notification needs an **approved utility template**. Templates must be created and approved before launch; a rejected template means a channel we cannot use |
| **W19 — service messages billable from 1 Oct 2026** | 1,000 free per WABA per month. At roughly 8–12 notifications per tenant per month, this is comfortably inside — **but it must be in the cost model and monitored** |
| **W18 — marketing templates possibly unavailable in Rwanda** | Every notification must be genuinely a **utility** message about the tenant's own service. They all are, but categorisation must be correct or templates will be rejected |
| **W12/W13 — messaging tiers and quality** | Our own notification volume counts against the tenant's WABA limits and quality rating. **A tenant's notification volume must never degrade their customer-facing messaging capacity** |
| SMS via a local aggregator | Never a global API — roughly 80× the cost. Includes mandatory opt-out keyword handling in English and Kinyarwanda |
| G14 low bandwidth | Text only. No images, no rich media, no charts pushed to WhatsApp |

**The row about tier consumption deserves emphasis.** If our own notifications eat into a tenant's daily messaging limit or damage their quality rating, we have harmed the thing they pay us for. Notification volume per tenant is monitored against their tier headroom.

---

## 8. Edge cases and failures

| Case | Behaviour |
|---|---|
| WhatsApp not connected | SMS fallback, then push, then in-app |
| All channels fail for an escalation | Escalation continues down the rota; the owner sees it in-app; the customer still gets a promise |
| Owner has muted everything | Escalations still route to the rota; if they are the only target and unreachable, message-and-promise engages and the owner sees a high-priority item |
| Notification storm (many escalations at once) | Bundled: *"3 customers need you"* with a link to the list |
| Template rejected by Meta | Fall back to SMS; alert the platform team; the notification is not lost |
| Owner in a different timezone | Respected |
| Duplicate notifications | Idempotency key per event |
| Owner replies to a notification on WhatsApp | **Treated as a message to support**, routed to a ticket — not silently discarded. People will reply, and a reply into a void is a bad experience |
| Voice owner never opens a consent request | One reminder at 24h, expires at 7 days, the owner is told |

---

## 9. Retention rationale

| Decision | Reason |
|---|---|
| WhatsApp primary | Reaches them where they are; costs almost nothing; the notification demonstrates the product |
| A call first for escalations | A customer is waiting. A ringing phone beats a notification tray |
| Full context in the message | Actionable on a bad connection without loading anything |
| Hard frequency caps | The mute button is the churn event we cannot see |
| Specific event, specific link | Generic prompts destroy sender credibility |
| Individually switchable | Granular control prevents the all-or-nothing mute |
| Replies route to support | People reply. Ignoring them is a bad experience and a wasted signal |
| Honest quiet weeks | Manufactured enthusiasm is how a weekly message becomes noise |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 25.1 | Escalation notifications reach a human or become a promise | Terminal state | 100% |
| 25.2 | Escalation reaches the first target quickly | Trigger to first ring | < 10s |
| 25.3 | Weekly report delivered | Sent ÷ eligible | > 98% |
| 25.4 | Weekly report opened | Open rate | > 60% |
| 25.5 | Notifications drive action | Sessions attributed to a notification | > 40% |
| 25.6 | Frequency caps respected | Non-urgent per owner per week | ≤ 3 |
| 25.7 | Mute rate stays low | Owners disabling all non-urgent | < 10% |
| 25.8 | Every notification deep-links to a specific item | Audit | 100% |
| 25.9 | Notification volume never degrades a tenant's WhatsApp tier | Monitored per tenant | 0 incidents |
| 25.10 | Quiet hours respected for non-urgent | Delivery-time audit | 100% |
| 25.11 | All notifications available in four languages | Translation audit | 100% |
| 25.12 | Replies to notifications reach support | Functional test | Pass |

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `notification.queued` / `sent` / `delivered` / `failed` | type, channel, tenant, recipient role |
| `notification.opened` / `link_followed` | type, minutes to open |
| `notification.escalation_chain` | step reached, seconds, resolved? |
| `notification.suppressed` | reason (cap / quiet hours / preference) |
| `notification.bundled` | count, types |
| `notification.preference_changed` | type, on/off |
| `notification.all_muted` | tenant, days since signup |
| `notification.reply_received` | type, routed to support? |

**`notification.all_muted` is a churn signal** and should raise a task ([Flow 16 §6](16-flow-analytics-and-retention.md)). An owner who mutes everything has usually decided something before they say it.

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 25.a | Will Meta approve our notification templates as utility messages in Rwanda? Rejection removes the primary channel | Delivery strategy |
| 25.b | Is calling the owner for an escalation welcome, or intrusive when they are with a customer? | N1 design |
| 25.c | Is three non-urgent per week the right cap for this market? | Frequency |
| 25.d | Do owners prefer SMS to WhatsApp for anything, given data costs? | Channel priority |
| 25.e | Should escalation notifications go to a group chat where a business already coordinates on WhatsApp? | Team notification |
| 25.f | What is the actual notification volume per tenant per month, and does it stay inside the free WhatsApp allowance at scale? | Cost model |

---

*Next: [26 — Success Criteria & Acceptance Tests](26-success-criteria-index.md)*
