# 13 — Flow: Test & Go-Live

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-13 |
| **Actor** | A5 Owner, A6 Manager |
| **Entry points** | Activation Part Two and Part Three · My Agent → Test · after any configuration change |
| **Exit states** | Sandbox tested · Live (scoped) · Live (full) · Paused |
| **Depends on** | 09, and at least one of 10 / 11 |
| **Blocks** | Live traffic |
| **Frequency** | Continuous — every change should be tested |
| **Criticality** | **Existential** |

---

## 1. Purpose

Let an owner satisfy themselves that the agent is good enough to talk to their customers — and then let them increase its responsibility one step at a time, at their own pace.

**What breaks if this is wrong:** either the owner never goes live (no revenue) or they go live too early, a customer has a bad experience, and they switch it off permanently (no second chance).

---

## 2. The design position: a trust ladder, not a switch

The evidence across human-in-the-loop AI deployment converges on a staged model: sandbox, then a narrow live scope, then autonomy, with visibility and a kill switch throughout. It works because it lets the owner make a series of small, reversible decisions instead of one large, frightening one.

```
   ┌──────────────────────────────────────────────────────────────┐
   │  RUNG 1  ·  SANDBOX                                          │
   │  Nobody real is affected. Test as often as you like.         │
   │  ★ This is where activation happens ★                        │
   └────────────────────────────┬─────────────────────────────────┘
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  RUNG 2  ·  AFTER-HOURS ONLY            ← recommended start  │
   │  Only calls that arrive when you're closed.                  │
   │  These are calls nobody was answering anyway.                │
   └────────────────────────────┬─────────────────────────────────┘
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  RUNG 3  ·  WHEN YOU DON'T ANSWER                            │
   │  Busy, no answer, phone off. You still take what you can.    │
   └────────────────────────────┬─────────────────────────────────┘
                                ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  RUNG 4  ·  EVERYTHING                                       │
   │  Subiza answers first, every time.                           │
   └──────────────────────────────────────────────────────────────┘

   At every rung:  full transcripts · one-tap pause · human always reachable
   Movement is BOTH WAYS and takes one tap.
```

**Rung 2 is the recommended starting point and it is the reason people say yes.** Letting an AI answer calls that currently ring out is a decision with no downside — the alternative is nobody answering at all. Letting it answer calls the owner would have taken is a decision with a downside. Starting at rung 2 removes the risk from the decision entirely.

---

## 3. Testing — three depths

### 3.1 Depth 1 — "Call me now" (the primary test)

| | |
|---|---|
| **Sees** | A large button: **📞 Call me now**, plus three suggested questions drawn from the tenant's own price table and template |
| **Does** | Answers their phone and talks to their agent |
| **System** | Places an outbound call to the verified number, runs the **full production pipeline**, and streams a **live transcript to the screen as they speak** |
| **Fallbacks** | Browser-based talk → an inbound number to dial. Three routes, because this test cannot be allowed to fail |

**This is the category's most obvious missing feature.** Every practitioner guide recommends real-call testing before going live; no competitor surfaces it as a prominent, named, one-click action. It is cheap to build and it is where belief is created.

Testing over a real GSM connection is also the *honest* test: 8 kHz narrowband audio, real latency, real network conditions. A browser demo would sound better and prove less.

### 3.2 Depth 2 — Try a customer

Five pre-written test personas, one tap each, that run a simulated conversation and grade the result:

| Persona | What it exercises |
|---|---|
| **The simple question** | "How much for braids?" — the happy path |
| **The mumbler** | Poor audio, hesitation, background noise — recognition robustness |
| **The off-topic caller** | "Do you sell airtime?" — out-of-scope deflection, and the general-purpose-assistant prohibition |
| **The upset customer** | "I waited an hour last time" — escalation triggers |
| **The tricky booking** | "Eight people, Saturday morning, and one is a child" — rules, tools, escalation thresholds |

Each returns pass or fail with the transcript and a one-line reason. Advanced products in this category ship persona-driven simulation with rubric grading; **nobody has brought it down to the SME tier.** Five named, one-tap personas is that idea made usable by someone who runs a shop.

### 3.3 Depth 3 — Regression testing (mostly for us)

Every conversation — real or test — can be saved as a test case with an expected outcome. The set runs automatically before any model, prompt or knowledge change reaches a tenant ([Flow 22](22-admin-ai-operations.md)). Owners rarely touch this; the value is that **their real failures become permanent guards** against the same failure recurring.

---

## 4. Going live

### Step 1 — The readiness check

Before offering go-live, the system checks and shows:

```
   READY TO GO LIVE?

   ✅  Your agent has answered a test call
   ✅  It knows your prices (14 services)
   ✅  It knows your opening hours
   ✅  It has a voice
   ✅  It knows who to fetch when it can't help
   ⚠️  3 questions have no answer yet          [Add answers]
   ⚠️  Your phone isn't forwarding yet          [Set it up]

   [ Go live — after hours only ]
```

**Warnings do not block.** Only two things block: no escalation target, and no completed test call. Everything else is advisory, because an agent that knows prices and hours is already useful, and blocking on completeness is how products never launch.

### Step 2 — Choose the rung

Three cards with the middle one recommended, each stating exactly what will happen in plain terms.

### Step 3 — Confirmation with the safety net visible

```
   Subiza is now answering your calls after 18:00.

   • You'll see every conversation in your app
   • You can pause it at any time — the ⏸ button, top right
   • If Subiza can't help, it will call you on +250 78x xxx xxx
   • Nothing changes about how you use your phone
```

**Naming the exits in the confirmation is deliberate.** A user who can see how to stop is far more willing to start.

### Step 4 — The first live conversation

The first real conversation triggers an immediate notification — *"Subiza just answered a customer for you. Have a look."* — deep-linking to the transcript. This is the second activation moment: the first time it works on someone who is not them.

---

## 5. Moving up and down the ladder

| | |
|---|---|
| **Where** | The agent status pill in the header, on every screen |
| **Up** | One tap, with a one-line description of what changes |
| **Down** | One tap, no friction, no "are you sure you want to lose value?" dark pattern |
| **Pause** | Always one tap, from anywhere, including from inside a live conversation |
| **Prompted up** | After two good weeks at a rung: *"Subiza has handled 34 calls with no problems. Want it to answer when you're busy too?"* — evidence-based, never nagging, dismissible permanently |

The upgrade prompt fires on **evidence, not on a timer**. "34 calls, no problems" is a reason. "You've been a customer for two weeks" is not.

---

## 6. Screens, states, decisions

| Screen | States |
|---|---|
| Test panel | Ready · calling · in progress with live transcript · completed · failed → fallbacks |
| Persona tests | Idle · running · passed · failed with transcript |
| Readiness check | Blocked · warnings · ready |
| Go-live | Choosing rung · confirming · live |
| Status pill | Sandbox · after-hours · unanswered · all · **paused** |
| Upgrade prompt | Eligible · shown · accepted · dismissed · permanently dismissed |

| Decision | Branches |
|---|---|
| Test call received? | Yes · no → browser · no → inbound number |
| Agent good enough? | Yes → go live · No → correct and retest |
| Blocking issues? | No escalation target or no test call → **blocked**. Everything else → warn |
| Which rung? | After-hours *(recommended)* · unanswered · all |
| Two good weeks? | Offer the next rung, once, dismissible |

---

## 7. Platform constraints

| Constraint | Effect |
|---|---|
| **P1/P2 — forwarding is manual and verified by test call** | Going live at rungs 2–4 depends on forwarding being set and verified ([Flow 07](07-flow-phone-connection.md)). Sandbox does not |
| **W8 — no general-purpose assistants** | The "off-topic caller" persona test exists partly to prove out-of-scope deflection works, which is a policy requirement and not just a quality one |
| G22 — never less reachable than before | Pausing or credit exhaustion returns calls to the owner's own line, never to a dead line |
| Sandbox needs no external connection | Which is what allows first value to precede connection ([Flow 06](06-flow-guided-activation.md)) |

---

## 8. Edge cases and failures

| Case | Behaviour |
|---|---|
| Test call never arrives | Browser test, then an inbound number to dial. Never a dead end |
| Owner tests once and never goes live | Home shows one next action; day 3, 7 and 14 prompts; day 30 a human gets in touch |
| Goes live and immediately pauses after one bad call | **The most important recovery moment in the product.** We ask one question — what went wrong — and route it straight into a correction, then offer a retest. Never a survey |
| Goes live with no forwarding | Only sandbox is possible; the readiness check says exactly this and links to setup |
| Agent live but zero traffic | Home shows "ready and listening" plus the sample conversation. Silence must never read as broken |
| Configuration changed while live | Applies to the next conversation. The owner is offered a retest, not forced into one |
| Owner sets rung 4 immediately | Allowed. The recommendation is a default, not a gate |
| Credit runs out while live | Agent pauses; calls fall back to the owner; the owner is told before, not after ([Flow 17](17-flow-billing-and-mobile-money.md)) |

---

## 9. Retention rationale

| Decision | Reason |
|---|---|
| Sandbox before any connection | Removes every external dependency from the path to belief |
| Real phone call, not a browser widget | Honest demonstration on the real medium; the thing the category is missing |
| Live transcript during the test | Proves understanding in real time and introduces the Inbox early |
| After-hours as the recommended rung | A decision with no downside is an easy yes |
| Exits named in the go-live confirmation | Visible reversibility reduces hesitation more than any reassurance |
| Both-directions movement, one tap | An owner who can retreat safely will advance sooner |
| Evidence-based upgrade prompts | "34 calls, no problems" earns the next rung; a timer does not |
| Failures become regression tests | The same mistake cannot happen twice, and the owner can see that |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 13.1 | Test call succeeds including fallbacks | Completed ÷ attempted | > 95% |
| 13.2 | Owners test before going live | Go-lives preceded by ≥1 test | 100% (enforced) |
| 13.3 | Agent cannot go live without an escalation target | Functional test | Pass |
| 13.4 | Test → live conversion | Tenants live within 7 days of first test | > 70% |
| 13.5 | Ladder is used | Tenants starting at rung 2 or 3 rather than 4 | > 60% |
| 13.6 | Ladder progression | Tenants reaching rung 3+ within 30 days | > 50% |
| 13.7 | Pause is reachable in one tap from any screen | Manual audit | Pass |
| 13.8 | Pause after a bad call triggers a recovery, not a survey | Functional test | Pass |
| 13.9 | Persona tests run in under 60 seconds each | Performance test | Pass |
| 13.10 | Live transcript appears within 2s of speech | Latency test | Pass |

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `test.call_requested` / `completed` / `failed` | method, duration, turns, latency p50/p95 |
| `test.persona_run` | persona, passed?, reason |
| `test.correction_made` | target |
| `golive.readiness_checked` | blockers, warnings |
| `golive.rung_set` | rung, previous rung |
| `golive.first_live_conversation` | hours since go-live |
| `agent.paused` / `resumed` | who, reason if given, rung |
| `golive.upgrade_prompt_shown` / `accepted` / `dismissed` | rung, evidence cited |

**`agent.paused` within 24 hours of a first go-live is the single highest-priority churn signal in the product** and should page a human on the pilot cohort.

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 13.a | Is after-hours-only too cautious for week one — does it under-demonstrate value? | Default rung |
| 13.b | Do five personas cover the real failure space, or do we need vertical-specific ones? | Test depth |
| 13.c | Should a very poor test result *block* go-live, or only warn? Blocking protects the customer's customers; warning respects their judgement | Gating policy |
| 13.d | How long at a rung before the upgrade prompt — two weeks, or a call count? | Progression |
| 13.e | Should owners be able to schedule go-live for a future date? | Scope |

---

*Next: [14 — Daily Operations: the Inbox](14-flow-daily-operations-inbox.md)*
