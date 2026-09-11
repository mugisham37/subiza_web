# 15 — Flow: Escalation & Human Handover

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-15 |
| **Actors** | A1 Caller / A2 Messager → A10 AI → A7 Agent / A5 Owner |
| **Entry points** | Runtime, any turn · caller request · owner takeover from the Inbox |
| **Exit states** | Warm transfer · ring-and-brief · message-and-promise · silent takeover · resolved without escalation |
| **Depends on** | 09 rules, 18 team |
| **Blocks** | Trust, and go-live (an agent with no escalation target cannot go live) |
| **Frequency** | Every conversation the agent cannot resolve — target 25–30% |
| **Criticality** | Critical |

---

## 1. Purpose

Get a customer to a human when the AI should not be handling them — quickly, with context, and without the customer ever feeling abandoned.

**What breaks if this is wrong:** everything the product is for. An AI that traps a frustrated customer in a loop is worse than a phone that rings out, because at least a ringing phone does not pretend to help. Escalation is not the failure path. **It is the feature that makes the rest safe to deploy.**

---

## 2. The design position

Three principles, each derived from a specific finding.

**Escalation is a first-class product primitive, not an error handler.** It has its own rules, its own routing, its own SLA and its own analytics. A leading competitor refuses to offer escalation at all if no human routing target is configured — Subiza goes further and refuses to let the agent go *live* without one.

**The caller is never left in a loop.** If no human is available, the agent takes a message and states a specific callback time. That is always better than a machine that will not let go.

**The handover experience is designed for the human receiving it, not just for the customer.** A7 the staff member is the actor most able to quietly kill adoption from inside. If escalation dumps a cold, contextless call on Aline at the clinic front desk, she will stop trusting it and start working around it.

---

## 3. Overview

```
   ANY TURN
      │
      ├─ retrieval confidence below threshold ──────┐
      ├─ caller says "a person" / "umuntu" ─────────┤
      ├─ frustration detected ──────────────────────┤
      ├─ owner-defined trigger fires ───────────────┤   ESCALATE
      ├─ 3rd failed understanding attempt ──────────┤
      ├─ high-value intent (big booking) ───────────┤
      └─ out-of-policy request ─────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  WHO IS AVAILABLE?     │
              │  hours · rota · rules  │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   ┌──────────┐   ┌──────────────┐   ┌────────────────────┐
   │  WARM    │   │  RING &      │   │  MESSAGE &         │
   │ TRANSFER │   │  BRIEF       │   │  PROMISE           │
   │          │   │              │   │                    │
   │ AI stays,│   │ hold, ring   │   │ nobody available:  │
   │ briefs,  │   │ human, play  │   │ capture the need,  │
   │ bridges  │   │ summary,     │   │ promise a specific │
   │          │   │ connect      │   │ callback window,   │
   │          │   │              │   │ notify the owner   │
   └──────────┘   └──────────────┘   └────────────────────┘
        │                 │                 │
        └─────────────────┴─────────────────┘
                          ▼
              LOGGED · TIMED · MEASURED
```

On chat channels there is a fourth mode: **silent takeover** — a human continues the thread and the customer sees a natural continuation, not a jarring "an agent has joined."

---

## 4. Triggers

Configured in [Flow 09](09-flow-agent-design-and-scripts.md) under "Get a person when," with sensible template defaults.

| Trigger | Type | Default | Notes |
|---|---|---|---|
| **Low retrieval confidence** | System | On, threshold "balanced" | The core safety property (G13). Below threshold the agent escalates rather than generating |
| **"I want a person"** | System | **On, mandatory, not removable** | Must always work, on every channel, at any point |
| **Frustration detected** | System | On | Repetition, raised voice, negative sentiment |
| **Third failed understanding** | System | On, fixed | Two strikes, then a human. A third attempt has negative value |
| **Sensitive intent** | Owner | Template default: complaints, refunds | |
| **High-value intent** | Owner | Template default: bookings over N people | |
| **Named customer** | Owner | Off | "If Marie Kabera calls, get me" |
| **Out of policy** | System | On | Anything the rule set forbids the agent from handling |
| **Out of scope** | System | **On, mandatory** | Required by the WhatsApp general-purpose-assistant prohibition (W8) |

**Two triggers cannot be switched off**: the explicit human request, and out-of-scope deflection. The first is an ethical floor; the second is a platform policy requirement.

---

## 5. The three voice modes

### 5.1 Warm transfer (best, needs availability)

| Step | What happens |
|---|---|
| 1 | Agent tells the caller: *"Reka mbahamagarire umuntu. Mumbabarire akanya gato."* |
| 2 | Agent places a call to the escalation target while holding the caller |
| 3 | Human answers and hears a **one-sentence spoken brief**: *"Marie Kabera is asking about a booking for eight people on Saturday. Connecting you now."* |
| 4 | Bridge. Agent leaves |
| 5 | Full context appears in the human's Inbox simultaneously |

**Step 3 is what makes it warm.** Without the brief this is a blind transfer, and the human starts the conversation confused while the customer repeats themselves — the exact experience escalation exists to prevent.

### 5.2 Ring and brief (human is reachable but not immediately)

Caller is told an honest wait, hears hold audio with periodic reassurance, and the agent rings targets in the configured order. If someone answers, they get the brief then the bridge. **A hard cap of 45 seconds** — beyond that we move to mode three rather than testing the caller's patience.

### 5.3 Message and promise (nobody available)

The most common mode outside business hours, and the one that must be excellent.

| Step | What happens |
|---|---|
| 1 | *"Ntabwo mbona umuntu ubu. Reka mfate ubutumwa bwanyu."* |
| 2 | Captures name, number, what they need, and urgency — structured, confirmed by read-back |
| 3 | **States a specific callback window**: *"Bazabahamagara mbere ya saa tatu z'ejo."* Not "soon." Not "as soon as possible" |
| 4 | Owner notified immediately by push and WhatsApp |
| 5 | The item appears at the top of "needs you" with the promised deadline visible |
| 6 | **If the deadline approaches unmet, the owner is reminded** |

**Step 6 is the part nobody builds and it is the whole point.** A promise the business does not keep is worse than no promise. The product made the commitment on the owner's behalf, so the product is responsible for making sure it is kept.

---

## 6. Chat escalation

| Aspect | Behaviour |
|---|---|
| Trigger | Same set |
| Notification | Push and WhatsApp to the assigned human |
| Handover | **Silent** — the human continues the thread |
| Customer sees | A natural continuation. Optionally, if the owner prefers, *"Claudine here now"* |
| Window awareness | If a 24-hour window is closing, the human is told how long they have ([Flow 08](08-flow-messaging-channel-connection.md)) |
| Instagram Human Agent tag | Applied **only** when a real person takes over (I3), extending the window to 7 days. The AI can never apply it |
| Return to AI | The human can hand back, and the AI resumes with full context |

---

## 7. Routing

| Setting | Options |
|---|---|
| **Primary target** | A phone number, a team member, or a role |
| **Order** | Try in sequence, or all at once |
| **By time** | Different targets in and out of hours |
| **By type** | Bookings to one person, complaints to another |
| **By language** | Route a French caller to a French speaker |
| **Fallback** | Always message-and-promise. **Never nothing** |

Configured in [Flow 18](18-flow-team-and-permissions.md). The default for a one-person business is simple: everything goes to the owner, and out of hours it goes to message-and-promise.

---

## 8. Screens, states, decisions

| Screen | States |
|---|---|
| Escalation rules | Configured · defaults · mandatory rules locked |
| Live escalation (owner view) | Ringing · connected · missed · message taken |
| Notification | Sent · seen · acted on · expired |
| Inbox item | Awaiting human · in progress · resolved · **promise overdue** |
| Human takeover | Available · in progress · handed back |

| Decision | Branches |
|---|---|
| Trigger fired? | Escalate · continue |
| Human available? | Warm transfer · ring and brief · message and promise |
| Answered within 45s? | Bridge · fall through to message |
| Chat or voice? | Silent takeover · spoken transfer |
| Human hands back? | AI resumes with context · conversation closes |
| Promise deadline near? | Remind the owner |

---

## 9. Platform constraints

| Constraint | Effect |
|---|---|
| **I3 — Human Agent tag must be applied by a real human** | Enforced in the product: the tag is only available on a human takeover, never to the AI |
| **W8 — human escalation path required for business AI on WhatsApp** | Escalation is not optional on WhatsApp; it is a condition of being allowed to operate there |
| **M3 — Messenger Handover Protocol needs a manual Page-admin assignment** | Only relevant if the tenant runs another tool on the same Page; then it becomes a guided manual step |
| Voice transfer capability | Depends on the telephony path ([Flow 07](07-flow-phone-connection.md)); where warm transfer is not supported by the provider, ring-and-brief is the fallback |
| G22 — never less reachable | If escalation infrastructure fails entirely, the call falls back to the owner's own line |

---

## 10. Edge cases and failures

| Case | Behaviour |
|---|---|
| Escalation target's phone is off | Next in sequence, then message-and-promise |
| Everyone is busy | Message-and-promise. Never a queue with hold music and no end |
| Caller hangs up during transfer | Logged as an abandoned escalation with the reason; owner notified with the callback details captured so far |
| Human answers but cannot help | Can hand back to the AI, or escalate to the owner |
| Escalation loops (human hands back, AI escalates again) | **Loop breaker after two cycles** → message-and-promise |
| Promise deadline missed | Owner reminded at the deadline; if still unmet, the customer is sent a proactive apology and a new time — **the product does not let a broken promise sit silently** |
| Frustration falsely detected | Escalating unnecessarily is a mild failure; not escalating is a severe one. Threshold biased toward escalation |
| Caller asks for a person during the greeting | Immediate. No qualification, no "let me try to help first" |
| Voice-note escalation | Transcribed, summarised, notified as text with the audio attached |

**The row about a caller asking for a person during the greeting deserves emphasis.** Products that try one round of AI help before honouring the request are the reason people distrust automated phone systems. Subiza honours it immediately, every time.

---

## 11. Retention rationale

| Decision | Reason |
|---|---|
| Escalation as a primitive, not an error path | It is what makes the owner willing to go live at all |
| Cannot go live without a target | An agent that cannot fetch a human should not answer customers |
| Spoken one-sentence brief | Makes the receiving human's experience good, which protects adoption from the inside |
| Specific callback times, never "soon" | A precise promise is keepable and checkable; a vague one is neither |
| Deadline reminders | The product made the promise; the product ensures it is kept |
| "I want a person" always honoured immediately | The ethical floor, and the thing that makes callers tolerate AI at all |
| Bias toward escalating | A false escalation costs a minute. A missed one costs a customer |
| Loop breaker | Two cycles is the limit of a caller's patience |

---

## 12. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 15.1 | Every escalation reaches a human or becomes a logged promise | Escalations with a terminal state | 100% |
| 15.2 | Explicit human requests are honoured immediately | Turns between request and escalation | ≤ 1, always |
| 15.3 | Warm transfer includes a spoken brief | Audit of transfer recordings | 100% |
| 15.4 | Ring-and-brief capped | Hold time before falling through | ≤ 45s |
| 15.5 | Promises state a specific time | Copy audit of message-and-promise | 100% |
| 15.6 | Promises are kept | Callbacks made within the promised window | > 90% |
| 15.7 | Overdue promises trigger a reminder and a customer apology | Functional test | 100% |
| 15.8 | Containment rate | Conversations resolved without escalation | 70–80% |
| 15.9 | No escalation loops | Conversations with >2 handover cycles | 0 |
| 15.10 | Human Agent tag never applied by the AI | Code audit + functional test | Pass |
| 15.11 | Handover is fast | Trigger to human notified | < 5s |
| 15.12 | Receiving human always has context | Audit: every handover carries a summary | 100% |

**15.8 needs care.** Containment that is too *high* is as much a warning as one that is too low — it can mean the agent is answering things it should be escalating. The target is a band, and both edges are investigated.

---

## 13. Instrumentation

| Event | Properties |
|---|---|
| `escalation.triggered` | trigger type, turn number, confidence, channel |
| `escalation.mode` | warm / ring / message / silent |
| `escalation.target_attempted` | target, sequence position, answered? |
| `escalation.connected` | seconds to connect, brief played? |
| `escalation.abandoned` | stage, caller hung up? |
| `escalation.message_taken` | promised window, fields captured |
| `escalation.promise_kept` / `promise_overdue` | hours late |
| `escalation.handed_back` | to AI, cycle count |
| `escalation.loop_broken` | cycles |
| `containment.rate` | daily per tenant |

---

## 14. Open questions

| # | Question | Blocks |
|---|---|---|
| 15.a | Does the telephony provider support warm transfer with a spoken brief, or is ring-and-brief the practical ceiling? | Mode availability |
| 15.b | What is the right frustration threshold for Kinyarwanda speech? Sentiment models are weakest in low-resource languages | Trigger tuning |
| 15.c | Is 45 seconds the right hold cap for this market, where callers may be more patient with a person but less with a machine? | Caller experience |
| 15.d | Should the customer be told a human is being fetched, or just experience it? | Transparency vs smoothness |
| 15.e | How do we handle escalation for a one-person business that is genuinely unreachable most of the day? | The most common tenant shape |

---

*Next: [16 — Analytics & the Retention Loop](16-flow-analytics-and-retention.md)*
