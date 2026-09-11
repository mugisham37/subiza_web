# 03 — Master Flow Map

*Part of the [Subiza Flow Atlas](../README.md)*

---

## 1. What this document does

It shows every flow in the system, how they connect, which ones are on the critical path, and what happens when one of them fails. It is the map you look at when you need to know *where you are* rather than *what to do next*.

Three views, each answering a different question:

1. **The lifecycle view** — what happens to a business, from first hearing about Subiza to renewing in month twelve.
2. **The dependency view** — which flows must work before which other flows can.
3. **The runtime view** — what happens during a single live conversation, which is where the product actually earns its money.

---

## 2. The lifecycle view

```
   DISCOVER            ACTIVATE                    OPERATE                 RETAIN
   ────────            ────────                    ───────                 ──────

   Landing page        05 Signup                   14 Inbox                16 Weekly report
   Demo call      ──►  (phone + OTP)          ──►  daily loop        ──►   on WhatsApp
   Referral            2 min                       15 Escalation           "31 calls you
   Field sales             │                       24 Degradation          would have missed"
                           ▼                            ▲                       │
                      06 GUIDED ACTIVATION              │                       ▼
                      ┌──────────────────────┐          │                  17 Top up credit
                      │ business type        │          │                       │
                      │ 09 agent (template)  │          │                       ▼
                      │ 10 knowledge (photo) │          │                  Expand:
                      │ 11 voice             │          │                  08 more channels
                      │ ★ SANDBOX TEST ★     │◄─ FIRST  │                  18 add team
                      │   the agent answers  │   VALUE  │                  09 refine agent
                      │ 07 phone connection  │          │                       │
                      │ 13 go live (staged)  │          │                       ▼
                      └──────────┬───────────┘          │                  Renew ─┐
                                 │                      │                         │
                                 └──────────────────────┴─────────────────────────┘
                                        first real customer handled
```

**The single most important property of this map:** ★ FIRST VALUE ★ sits **before** phone connection, not after it. The owner hears their agent answer a question in a sandbox before being asked to dial a forwarding code or hand over a real number.

This inverts the order every competitor uses, and it is deliberate. Connecting a real channel is the highest-friction, highest-anxiety, most failure-prone step in the entire product — Meta verification queues of 5–15 business days, carrier KYC, OTP delivery failures, forwarding codes. Asking someone to cross that before they have any evidence the product works is how you lose them. Asking after, when they have already heard it answer a question in their own voice about their own prices, is a different conversation entirely.

---

## 3. The dependency view

```
                          05 SIGNUP
                             │
                             ▼
                    ┌────────────────┐
                    │ 06 ACTIVATION  │  ◄─── orchestrates everything below
                    └───┬────┬───┬───┘
          ┌─────────────┘    │   └──────────────┐
          ▼                  ▼                  ▼
    09 AGENT ────────► 10 KNOWLEDGE       11 VOICE ─────► 12 LANGUAGE
    behaviour          prices, FAQs       library or          which, and
    persona, rules     pronunciation      cloned (A3 consent) how it switches
          │                  │                  │                  │
          └──────────────────┴────────┬─────────┴──────────────────┘
                                      ▼
                              13 TEST & GO-LIVE
                              sandbox → staged trust
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              07 PHONE          08 CHANNELS        (already live
              forwarding or     WhatsApp, IG,       in sandbox)
              dedicated number  Telegram, SMS
                    │                 │
                    └────────┬────────┘
                             ▼
                       ══════════════
                        LIVE TRAFFIC
                       ══════════════
                             │
        ┌────────────┬───────┴───────┬────────────┬────────────┐
        ▼            ▼               ▼            ▼            ▼
   14 INBOX    15 ESCALATION   16 ANALYTICS  24 ERRORS   25 NOTIFICATIONS
        │            │               │            │            │
        └────────────┴───────┬───────┴────────────┴────────────┘
                             ▼
              17 BILLING · 18 TEAM · 19 COMPLIANCE
                             │
                             ▼
              20-23 ADMIN CONSOLE  (observes and supports all of the above)
```

### 3.1 The dependency table

| Flow | Hard dependencies | Can run without | Blocks |
|---|---|---|---|
| 05 Signup | none | — | everything |
| 06 Activation | 05 | — | first value |
| 07 Phone | 06, 13 | knowledge, channels | live calls |
| 08 Channels | 06 | phone | live messages |
| 09 Agent | 06 | knowledge | 13 |
| 10 Knowledge | 06 | voice | quality answers |
| 11 Voice | 06 | knowledge | calls sounding right |
| 12 Language | 09 | — | non-English callers |
| 13 Test & go-live | 09, and at least one of 10/11 | channels **(runs in sandbox)** | live traffic |
| 14 Inbox | live traffic **or sandbox data** | — | 15, 16 |
| 15 Escalation | 14, 18 | — | trust |
| 16 Analytics | 14 | — | renewal |
| 17 Billing | 05 | — | paid usage |
| 18 Team | 05 | — | 15 routing |
| 19 Compliance | 05 | — | legal operation |
| 20–23 Admin | tenants exist | — | support, safety |
| 24 Errors | all | — | — |
| 25 Notifications | 14 | — | retention |

**Note the bolded exceptions.** Flow 13 runs in sandbox without any channel connected, and Flow 14 has content from sandbox conversations before a single real customer arrives. Those two exceptions are what allow first value to precede connection. Everything else in the ordering follows from protecting them.

---

## 4. The runtime view — one live conversation

The flows above are how the product is *set up*. This is what happens when it *works*, and it is the loop that runs thousands of times a day.

```
   CALLER dials the business's usual number
        │
        │ (a) owner answers within 20s ──────► ordinary human call, Subiza uninvolved
        │
        ▼ (b) busy · no answer · phone off
   CARRIER forwards to Subiza  [**61# / **67# / **62#]
        │
        ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  RUNTIME LOOP                                                 │
   │                                                               │
   │  1. Answer within one ring                                    │
   │  2. Greet · DISCLOSE AI · offer language        [Flow 12]     │
   │  3. Listen ──► transcribe ──► detect end of turn              │
   │  4. Understand ──► retrieve from knowledge      [Flow 10]     │
   │  5. Gate:  confident enough?                                  │
   │        ├── no  ──────────────────────► ESCALATE  [Flow 15]    │
   │        └── yes ──► answer or act                              │
   │  6. Act: book · capture lead · take order · send follow-up    │
   │  7. Speak the reply  (target: first syllable < 800ms)         │
   │  8. Loop until resolved, escalated, or ended                  │
   │                                                               │
   │  At any point:  caller says "a person" ──► ESCALATE           │
   │  At any point:  owner taps pause ──────► HUMAN TAKES OVER     │
   │  At any point:  something fails ───────► DEGRADE  [Flow 24]   │
   └──────────────────────────────┬───────────────────────────────┘
                                  ▼
   AFTER THE CALL
        ├── structured summary written to the Inbox      [Flow 14]
        ├── promised follow-up sent on WhatsApp          [Flow 25]
        ├── booking written to the calendar
        ├── recording + transcript stored under policy   [Flow 19]
        ├── owner notified if it needs them              [Flow 25]
        └── counted toward "calls you would have missed" [Flow 16]
```

**Step 2 and step 5 are the two non-negotiable steps.** Step 2 because disclosure is a legal obligation and a trust decision. Step 5 because a system that guesses a price is worse than one that says "let me get someone" — and that single gate prevents the majority of the damage an AI can do to a small business's reputation.

---

## 5. The critical path

If you build only what is on this path, you have a product. Everything else is improvement.

```
  05 Signup  ──►  06 Activation  ──►  09 Agent  ──►  10 Knowledge
       │
       └──►  11 Voice  ──►  13 Sandbox test  ──►  ★ FIRST VALUE ★
                                    │
                                    ▼
                            07 Phone connection
                                    │
                                    ▼
                              LIVE TRAFFIC
                                    │
                         14 Inbox  ──►  16 Weekly report
                                    │
                                    ▼
                              17 Top up  ──►  RENEWAL
```

Eleven flows. Two loops — the daily inbox loop and the weekly value loop. Everything in the atlas that is not on this list exists to make this list survive contact with reality.

---

## 6. Entry points — every way a person arrives

| Entry point | Who | Lands on | Flow |
|---|---|---|---|
| Landing page → Sign up | Prospect | Signup | 05 |
| **Demo call — "call this number and talk to a Subiza agent"** | Prospect | A live demo, then signup | 05 |
| Field sales, assisted setup | Prospect | Signup with a specialist | 05, 21 |
| Referral link from an existing customer | Prospect | Signup with referral attribution | 05 |
| Team invitation | Manager / Agent | Accept invite → role-appropriate home | 18 |
| Direct login | Returning owner | Home, in current lifecycle state | — |
| Push or WhatsApp notification | Owner | Deep link to the specific conversation | 25 |
| **Weekly report on WhatsApp** | Owner | Results | 16 |
| Low-credit warning | Owner | Top up | 17 |
| Channel-broken alert | Owner | Connections, that channel | 08, 24 |
| Escalated conversation | Agent | That conversation | 15 |
| Public data-rights form | Data subject | Request form (no login) | 19 |
| Admin login | Platform staff | Operations home | 20 |
| Support ticket | Platform staff | Tenant detail | 21 |

**The demo call is the strongest entry point available and should be built early.** It delivers the aha moment before signup exists — the prospect dials a number, talks to a Subiza agent configured for a generic salon or shop, and hangs up already knowing what they are buying. No competitor in the SME receptionist category surfaces this as a prominent, one-click feature.

---

## 7. Exit points — every way a person leaves

Designing exits is as important as designing entries, because an unhandled exit is a churn event nobody logged.

| Exit | Trigger | What must happen |
|---|---|---|
| **Abandoned signup** | Leaves mid-activation | Progress saved. Resume link by SMS/WhatsApp after 1h, 24h, 72h. After day 30, a human contacts them — automated reactivation past that point converts under 5% |
| **Ran out of credit** | Balance hits zero | Grace period, then agent pauses **but calls still forward to the owner's own line**. Never a dead line (G22) |
| **Paused the agent** | Owner chooses | Confirm, ask one optional question (why), offer after-hours-only as an alternative to full pause |
| **Channel disconnected** | Token revoked or expired | Immediate visible alert, one-click reconnect, other channels unaffected |
| **Deleted the account** | Owner chooses | Confirm, export offered, retention countdown explained, forwarding-removal instructions provided |
| **Suspended by us** | Policy or non-payment | Clear reason, appeal path, data retained through the appeal window |
| **Silent churn** | Stops opening the app, traffic drops | Detected as a churn signal → intervention, not an email |

The row that matters most is **credit exhaustion**. The correct behaviour is not to stop answering — it is to stop *AI-answering* and let calls ring through to the owner exactly as they did before Subiza existed. The business must never be worse off for having used us.

---

## 8. Where flows fail into each other

| When this fails | Control passes to | The user experiences |
|---|---|---|
| Speech recognition cannot understand | 15 Escalation | "Let me get someone to help you" |
| Knowledge has no confident answer | 15 Escalation | Same — never a guess |
| No human available to escalate to | 14 Inbox, via message-and-promise | "Someone will call you before 11 tomorrow" |
| Channel token expired | 24 Degradation + 08 | Owner sees a repair banner; other channels keep working |
| Booking integration down | 15 Escalation | "A person will confirm your booking shortly" |
| Model provider outage | 24 Degradation | Fast-path answers only; everything else escalates |
| Credit exhausted | 17 Billing | Agent pauses; calls forward to the owner |
| Whole platform down | 24 Degradation | Calls ring the owner's own phone, as before Subiza |

---

## 9. The three loops that create retention

```
   DAILY LOOP                WEEKLY LOOP                 MONTHLY LOOP
   ──────────                ───────────                 ────────────

   notification         ──►  WhatsApp report        ──►  credit runs low
        │                    "31 you would have          │
        ▼                     missed this week"          ▼
   open the app                    │                 top up by MoMo
        │                          ▼                     │
        ▼                    open Results                ▼
   handle what needs               │                 see the month's value
   attention                       ▼                     │
        │                    feel the value              ▼
        ▼                          │                 renew, or expand
   close the app                   ▼                 (add a channel,
   (under 2 min)             adjust something        add a team member)
```

**Loop one builds habit. Loop two builds belief. Loop three builds revenue.** A product with only loop one is a chore. With only loop two, a report nobody acts on. All three, in that order, is a business.

---

## 10. Flow criticality

| Criticality | Flows | If broken |
|---|---|---|
| **Existential** | 06 Activation, 13 Test & go-live, 07 Phone | No customers, or customers who never activate |
| **Critical** | 05, 09, 10, 14, 15, 24 | Product does not work or is not trusted |
| **High** | 08, 11, 12, 16, 17, 25 | Value delivered but not felt; growth blocked |
| **Important** | 18, 19, 20, 21, 23 | Operationally or legally exposed |
| **Supporting** | 22, 26 | Quality degrades slowly |

Build order follows criticality, with one exception: **19 Compliance is built with the critical set, not the important set**, because consent capture and data residency cannot be retrofitted onto data already collected.

---

## 11. Success criteria

| # | Criterion | Test |
|---|---|---|
| 3.1 | Every flow has at least one documented entry and one documented exit | Audit against §6 and §7 |
| 3.2 | No flow can dead-end without a next action | Manual traversal of every terminal state |
| 3.3 | First value is reachable without connecting any external channel | Complete activation in sandbox with no WhatsApp, no phone |
| 3.4 | Every failure in §8 hands control to a named flow, never to silence | Fault-injection test per row |
| 3.5 | Abandoned signups are resumable for at least 30 days | Functional test at 1h, 24h, 72h, 30d |
| 3.6 | Credit exhaustion never makes a business less reachable than before Subiza | End-to-end test: zero balance, call still reaches the owner |
| 3.7 | The critical path (§5) is completable end to end by a first-time user unaided | Usability test, ≥60% completion |

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 3.a | Should the demo call be pre-signup, in-signup, or both? Pre-signup is stronger but costs real telephony minutes on unqualified traffic | 05, sales strategy |
| 3.b | How long should the credit grace period be before the agent pauses? | 17 |
| 3.c | Does the weekly report belong on WhatsApp, SMS, or both? WhatsApp is richer; SMS reaches feature phones | 16, 25 |
| 3.d | Is there a viable flow for a business with no smartphone at all — USSD-only configuration? Roughly two thirds of Rwandan households do not own a smartphone | Market reach |
| 3.e | Should sandbox conversations count toward the "calls you would have missed" number? They are not real, but they are the first evidence of value | 16, honesty |

---

*Next: [04 — Platform Constraints & Design Boundaries](04-platform-constraints.md)*
