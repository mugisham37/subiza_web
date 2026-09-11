# 06 — Flow: Guided Activation

*Part of the [Subiza Flow Atlas](../README.md)*

---

> **This is the flow the company lives or dies on.** Everything else is either upstream of it or downstream of it.

---

| | |
|---|---|
| **Flow ID** | F-06 |
| **Actor** | A5 Owner |
| **Entry points** | Immediately after [Flow 05](05-flow-signup-and-account-creation.md) · resume link · Home checklist |
| **Exit states** | **Activated** (agent answered, owner witnessed) · Live · Paused mid-way (resumable) · Abandoned |
| **Depends on** | 05 |
| **Orchestrates** | 07, 08, 09, 10, 11, 12, 13 |
| **Frequency** | Once per business, resumable across sessions |
| **Criticality** | **Existential** |
| **Target duration** | **First value in under 10 minutes. Fully live in under 45.** |

---

## 1. Purpose

Take a business owner from an empty account to the moment they hear their own AI agent answer a question about their own business, in their own language — and then, and only then, help them connect it to the real world.

**What breaks if this is wrong:** everything. A confusing activation does not produce a support ticket in this market; it produces silence and a customer who never returns.

### 1.1 The definition of activation

Activation is **not** "signed up," "connected WhatsApp," or "completed the checklist."

> **Activation is: a customer interaction — real or simulated — was handled by the AI, and the business owner watched it happen and judged the answer good.**

That is the moment belief is created. Every design decision below is reverse-engineered from getting there fast.

### 1.2 The inversion

Every comparable product asks for the channel connection first, because it is technically the enabling step. Subiza asks for it **fourth from last**, because it is emotionally the hardest step and it is riddled with external failure — Meta verification queues of 5–15 business days, carrier KYC, OTP failures, GSM codes.

```
   EVERYONE ELSE:   connect the hard thing  ──►  configure  ──►  hope they stay
   SUBIZA:          configure (2 min, templated)  ──►  ★ HEAR IT WORK ★  ──►  connect
```

Asking a shop owner to dial a forwarding code before they have any evidence the product works is asking for faith. Asking after they have heard it quote their own prices in Kinyarwanda is asking for a small favour.

---

## 2. Overview

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │  PART ONE — MAKE IT YOURS          (target: 6 minutes)               │
  │                                                                       │
  │   1  What kind of business?      ──► loads a template                │
  │   2  When are you open?          ──► hours + after-hours behaviour   │
  │   3  What do you charge?         ──► photograph the price list       │
  │   4  How should it sound?        ──► pick a voice, hear it           │
  └──────────────────────────────┬───────────────────────────────────────┘
                                 ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │  ★★★  PART TWO — HEAR IT WORK   (target: 3 minutes)  ★★★            │
  │                                                                       │
  │   5  Subiza calls YOUR phone right now.                              │
  │      You are the customer. Ask it something.                         │
  │                                                                       │
  │            ── THIS IS ACTIVATION ──                                  │
  │                                                                       │
  │   6  Read the transcript. Fix anything wrong. Try again.             │
  └──────────────────────────────┬───────────────────────────────────────┘
                                 ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │  PART THREE — CONNECT IT           (target: 10 minutes)              │
  │                                                                       │
  │   7  Who should it fetch when it can't help?                         │
  │   8  Connect your phone      ──► forwarding code + verification      │
  │   9  Go live — but how much?  ──► after-hours only / all calls       │
  └──────────────────────────────┬───────────────────────────────────────┘
                                 ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │  PART FOUR — LATER, WHEN READY     (checklist on Home, not a wizard) │
  │                                                                       │
  │   ○ Connect WhatsApp        ○ Add more knowledge                     │
  │   ○ Connect Instagram       ○ Invite your team                       │
  │   ○ Clone your own voice    ○ Add languages                          │
  └──────────────────────────────────────────────────────────────────────┘
```

**Nine steps in the wizard. Six of them take under a minute.** Everything genuinely optional is in Part Four, which is a checklist on Home, not a wizard — skippable, resumable, and never blocking.

---

## 3. Preconditions

- Account exists ([Flow 05](05-flow-signup-and-account-creation.md)).
- The owner has their phone with them — required for step 5, and stated up front.
- **No external account, no card, no number connected, nothing else.**

---

## 4. Detailed flow

### PART ONE — Make it yours

#### Step 1 — What kind of business?

| | |
|---|---|
| **Sees** | Six large tiles with icons: Shop · Salon or barber · Restaurant or bar · Clinic or pharmacy · Services and repairs · Something else. Heading: *"What does [Business Name] do?"* |
| **Does** | Taps one |
| **System** | Loads the matching template: a persona, a greeting, a starter rule set, six to ten typical questions with placeholder answers, a suggested voice, and a starter pronunciation dictionary. Emits `activation.business_type_selected` |
| **Can fail** | "Something else" → a text field, and a generic template. Never a dead end |

**Why this is step one:** templates are the difference between a five-minute setup and a blank-page abandonment. The research is unambiguous that they are the largest single accelerator for non-technical users. Six branches is within the 2–5-option guidance for persona branching without causing decision paralysis; "Something else" is the safety valve.

**What a template actually contains** — this is not cosmetic:

```
   SALON TEMPLATE
   ├── Persona      warm, brief, uses the customer's name
   ├── Greeting     "Muraho, ni [Business]. Nabafasha nte?"
   ├── Rules        always confirm bookings by repeating them back
   │                never quote for bridal parties — fetch a person
   │                never give hair or skin medical advice
   ├── Questions    Are you open now? · How much for braids? ·
   │                Can I book Saturday? · Where are you? ·
   │                Do you do relaxers? · How long does it take?
   ├── Voice        warm female, Kinyarwanda
   └── Pronunciation  Remera · Nyabugogo · common product names
```

#### Step 2 — When are you open?

| | |
|---|---|
| **Sees** | A week grid pre-filled with typical hours for that business type. Below it: *"What should Subiza do when you're closed?"* with three options — Answer and take a message · Answer and book for the next open day · Just take a message |
| **Does** | Adjusts hours, picks after-hours behaviour |
| **System** | Sets the hours model and the out-of-hours policy |
| **Can fail** | Irregular hours → "It varies" option that defers to a message-taking default |

**Why hours are step two:** because the highest-value thing Subiza does for a Rwandan SME is answer at 21:00 on a Sunday. Establishing that boundary early frames the entire product correctly, and it feeds the "calls you would have missed" calculation ([Flow 16](16-flow-analytics-and-retention.md)) that later renews the subscription.

#### Step 3 — What do you charge?

| | |
|---|---|
| **Sees** | Three tabs: **📷 Photograph your price list** (default and prominent) · ✍️ Type it · 🌐 Import from a website or Instagram. Under the camera option: *"Most businesses have a printed list. Take a picture of it."* |
| **Does** | Photographs their laminated price list |
| **System** | OCR extracts rows into a **structured price table** — service, price, currency, notes. Shows the extracted table for confirmation, with every row editable |
| **Can fail** | Poor photo → guided retake with framing help. Partial extraction → the recognised rows are kept and the rest can be typed. No price list at all → skip; the agent answers everything except price and fetches a human for pricing |

**This step contains one of the atlas's real innovations.** The competitor research found that **no product in this category treats structured price tables as a first-class input** — everyone forces a price list into a PDF or a text blob, which is precisely where hallucinated numbers come from. In Subiza a price is a typed field: read directly, never generated. And the input method matches the market — a Rwandan SME has a laminated price list, not a website.

**The confirmation screen matters as much as the extraction.** The owner sees exactly what the AI now believes, in a table they can correct. That transparency is the first deposit in the trust account.

#### Step 4 — How should it sound?

| | |
|---|---|
| **Sees** | Four to six voices, each with a play button, labelled by language and warmth rather than by model name. The template's suggestion is pre-selected. A link: *"Or use your own voice"* → defers to [Flow 11](11-flow-voice-and-cloning.md), not inline |
| **Does** | Taps play on two or three, picks one |
| **System** | Sets the voice; generates a preview saying the actual greeting with the actual business name |
| **Can fail** | No audio (silent phone, no permission) → a visible prompt to unmute; never a silent failure that reads as broken |

**The preview says their business name.** Hearing "Muraho, ni Salon Ubwiza" in a natural voice is a small moment of delight that costs nothing and does real work.

**Voice cloning is deliberately not here.** It requires a separate named consent from the voice owner, a spoken verification, and 30–60 seconds of clean audio. Putting it in the critical path would add minutes and a legal artefact to a flow that must stay under ten. It sits in Part Four.

---

### PART TWO — Hear it work ★

#### Step 5 — The test call

**The single most important screen in the product.**

| | |
|---|---|
| **Sees** | A large button: **📞 Call me now**. Above it: *"Subiza will ring your phone in a few seconds. Pretend you're a customer. Ask it anything."* Below it, three suggested questions drawn from their own template and their own price table: *"Try asking: How much for braids? · Are you open on Sunday? · Can I book for Saturday?"* |
| **Does** | Taps. Answers their phone. Talks to their own agent |
| **System** | Places an outbound call to the verified signup number. Runs the full production pipeline — same speech recognition, same reasoning, same voice, same knowledge. Streams a **live transcript to the screen while the call is in progress**, so the owner sees the words appear as they speak them |
| **Can fail** | Call not received → retry, then offer a web-based test where they talk through the browser, then offer an inbound test number to dial. **Three fallbacks, because this step cannot be allowed to fail** |

**Why an outbound call to their own phone, not a browser widget:** because the product is a *phone* product. Hearing it over a real GSM connection, with real 8 kHz narrowband audio and real latency, is the honest demonstration. A browser demo over wideband audio would sound better and prove less. The competitor research found that **no product in this category surfaces a one-click "call my phone right now" as a prominent, named feature** — despite every practitioner guide recommending real-call testing. It is cheap to build and it is the whole ballgame.

**The live transcript on screen is doing three jobs at once:** it proves the AI understood (the owner watches their Kinyarwanda appear as text), it introduces the Inbox before the Inbox exists, and it makes the "why did it say that" trace feel natural later.

#### Step 6 — Fix and retry

| | |
|---|---|
| **Sees** | The transcript, turn by turn. Beside each AI turn: 👍 / 👎, and a **"Why did it say that?"** expander showing which price row or FAQ it used. If they tap 👎: *"What should it have said?"* with a text box |
| **Does** | Reads. Corrects one or two things. Taps **Try again** |
| **System** | Corrections write directly to the knowledge base or the rule set — not to a feedback queue. The next test call reflects them immediately |
| **Can fail** | Nothing correctable → the flow continues. The step is skippable |

**This is where the product teaches its own mental model.** In ninety seconds the owner learns: it answers from what I told it, I can see why, I can fix it, and the fix takes effect immediately. That understanding is what makes them comfortable letting it talk to real customers — and it is why the correction loop is here, in activation, rather than buried in a settings screen they will never open.

> **★ ACTIVATION IS RECORDED HERE.** `tenant.activated` fires when a test call completes and the owner has viewed the transcript. Everything before this is setup; everything after is adoption.

---

### PART THREE — Connect it

#### Step 7 — Who does it fetch?

| | |
|---|---|
| **Sees** | *"When Subiza can't help, who should it get?"* — a number field pre-filled with the owner's own, plus *"and if nobody answers?"* with two options: take a message and tell the customer when we'll call back · keep trying another number |
| **Does** | Confirms or changes |
| **System** | Sets escalation routing ([Flow 15](15-flow-escalation-and-handover.md)) |
| **Can fail** | No number given → we refuse to proceed and explain why |

**We refuse to let an agent go live with no escalation target.** A well-designed comparable product does the same: if no human routing target is configured, it will not offer escalation at all. Ours goes further — an agent that cannot fetch a human is not allowed to answer customers.

#### Step 8 — Connect your phone

Delegated in full to [Flow 07](07-flow-phone-connection.md). In summary, as the owner experiences it:

| | |
|---|---|
| **Sees** | Two options: **Keep my number** (recommended, with a one-line explanation: *"Your customers keep calling the same number. Subiza only picks up what you miss."*) · **Get a new Subiza number** |
| **Does** | Chooses "keep my number" → sees the exact GSM forwarding code for their network as a **tap-to-dial link**, with a photograph of what the phone screen looks like |
| **System** | Detects network from the number prefix, shows the right code, then **places a verification call** and reports the result live: *"We just called your number. Subiza answered. It's working."* |
| **Can fail** | Extensively — see [Flow 07](07-flow-phone-connection.md). The step is skippable: the agent stays in sandbox, fully usable, and Home shows one next action to finish it |

#### Step 9 — How much should it handle?

| | |
|---|---|
| **Sees** | Three options as a ladder, with the middle one recommended: **Only when I'm closed** *(recommended to start)* · **Only when I don't answer** · **All calls** |
| **Does** | Picks one |
| **System** | Sets the live scope. Sets the agent status pill accordingly |
| **Can fail** | Cannot |

**This is the trust ladder, and it is the reason people say yes.** The owner is not being asked to hand their customers to a machine. They are being asked to let it pick up the calls that currently ring out — which is a decision with no downside, because the alternative is nobody answering at all. They escalate their own trust later, on their own schedule, from the agent status pill.

---

### PART FOUR — Later

Not a wizard. A checklist on Home, shown as **already partially complete** (Parts One to Three are ticked), with exactly one highlighted next action.

| Item | Flow | Why it is deferred |
|---|---|---|
| Connect WhatsApp | [08](08-flow-messaging-channel-connection.md) | Requires Meta verification of 5–15 business days. Would make first value unreachable in one session |
| Connect Instagram | [08](08-flow-messaging-channel-connection.md) | Requires a professional account and App Review |
| Connect Telegram | [08](08-flow-messaging-channel-connection.md) | Requires the awkward BotFather step |
| Use your own voice | [11](11-flow-voice-and-cloning.md) | Requires separate consent, spoken verification, 30–60s of audio |
| Add more knowledge | [10](10-flow-knowledge-base.md) | The price list alone is enough to be useful |
| Add languages | [12](12-flow-language-and-switching.md) | One language works; more is better |
| Invite your team | [18](18-flow-team-and-permissions.md) | Only matters once there is volume |
| Add credit | [17](17-flow-billing-and-mobile-money.md) | The free allowance covers activation and the first days |

---

## 5. Screens and states

| Screen | States |
|---|---|
| Business type | Fresh · selected · "something else" |
| Hours | Template-filled · edited · "it varies" |
| Prices | Camera · uploading · extracting · confirm table · edited · skipped · failed |
| Voice | Playing · selected · no audio |
| **Test call** | Ready · ringing · **in progress with live transcript** · completed · failed → web fallback → inbound fallback |
| Transcript review | Reviewing · correcting · retrying · done |
| Escalation | Prefilled · edited · refused (empty) |
| Phone connection | Choosing · code shown · verifying · verified · failed · skipped |
| Go-live scope | Choosing · set |
| Checklist | Partially complete, one action highlighted |

---

## 6. Decisions and branches

| Decision | Branches |
|---|---|
| Business type | Six templates + generic |
| Price list available? | Photo → OCR · type · import · skip (agent escalates all pricing) |
| Own voice or library? | Library now (default) · own voice deferred to Part Four |
| Test call received? | Yes → transcript · No → web test · Still no → inbound test number |
| Agent answered well? | Yes → continue · No → correct and retry (unlimited) |
| Keep number or new number? | Forwarding flow · provisioning flow |
| Forwarding verified? | Yes → go live · No → troubleshoot · Skip → stay in sandbox, Home shows the action |
| Go-live scope | After-hours · unanswered · all |

---

## 7. Platform constraints

| Constraint | Effect here |
|---|---|
| W10, W11 — Meta verification 5–15 days; our onboarding capped at 10 tenants/7 days initially | WhatsApp cannot be in the critical path. It is Part Four. **The 10/week cap also limits our own growth and must be an admin alert** |
| P1, P2 — we cannot set forwarding; we can only verify by test call | Step 8 is guidance plus verification, and the verification doubles as a delight moment |
| V4 — Kinyarwanda is unsupported in mainstream commercial TTS | The template ships a starter pronunciation dictionary; step 6 corrections feed it |
| I1 — Instagram needs a professional account | Deferred to Part Four with a guided conversion |
| T1 — we cannot create a Telegram bot | Deferred to Part Four |
| W14 — tenants must add their own Meta payment method | Deferred; explained when it arrives |

---

## 8. Edge cases and failures

| Case | Behaviour |
|---|---|
| **Test call fails entirely** | Three fallbacks: outbound → browser test → inbound number to dial. This step is never allowed to be the reason someone leaves |
| Owner is not near their phone | Detected by a non-answered test call; offer the browser test and a reminder to try the phone test later, with Home carrying it as the next action |
| No price list, no website, nothing written down | Template questions with blank answers; the agent answers hours and location and escalates everything else. Still activates |
| OCR extracts nonsense | Confirmation table is fully editable; if it is unusable, one tap clears it and switches to typing |
| Abandons mid-wizard | Progress saved per step. Resume link at 1h, 24h, 72h. Home resumes at the exact step |
| Abandons *after* activation but before connecting | The most recoverable state — they have already believed. Resume messaging references the test call: *"Your agent answered you well. Two minutes to let it answer your customers."* |
| Completes everything but never gets a real call | Home shows *"Your agent is ready and listening"* with the sample conversation and a re-test action. Never a blank screen |
| Business type has no template | Generic template plus a support flag in Onboarding Ops |
| Very long price list (100+ items) | OCR paginates; the agent uses retrieval rather than the structured table for the long tail |

---

## 9. Retention rationale

| Decision | Reason |
|---|---|
| **First value before any external connection** | The pre-connection problem is the defining challenge of configuration-heavy products. Sandbox-first is the documented answer, and it removes every external dependency from the path to belief |
| Template first | Blank-canvas paralysis is a real abandonment cause. Templates are the largest single accelerator for non-technical users |
| Photograph the price list | Matches what a Rwandan SME actually has. Typing a price list on a phone is a wall |
| Test call over browser demo | Honest demonstration on the real medium, and the category's most obvious missing feature |
| Correction loop inside activation | Teaches the mental model at the moment of maximum attention |
| **After-hours-only as the recommended default** | The trust ladder. A decision with no downside is an easy yes; full autonomy is a decision with a downside |
| Checklist shown partially complete | Goal-gradient effect; the owner arrives at Home already three-quarters done rather than facing an empty list |
| Everything external deferred to Part Four | Meta verification alone would put activation two weeks away |
| No product tour anywhere | Tours are measurably unhelpful and slow users down |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 6.1 | **Time to first value** | Signup start → test call completed and transcript viewed | **< 10 min median** |
| 6.2 | **Activation rate** | Tenants reaching `tenant.activated` ÷ signups | **> 60%** |
| 6.3 | Time to fully live | Signup → forwarding verified and scope set | < 45 min median |
| 6.4 | Test call success | Completed test calls ÷ attempted, including fallbacks | > 95% |
| 6.5 | Correction loop used | Tenants making ≥1 correction at step 6 | > 40% (evidence of engagement, not failure) |
| 6.6 | Price extraction usable | OCR results accepted with ≤3 edits | > 70% |
| 6.7 | Unaided completion | Parts One–Three completed with no human help | > 60% |
| 6.8 | Resumability | Abandoned activations resumed within 72h | > 30% |
| 6.9 | No dead ends | Every failure state offers a next action | Manual audit, 100% |
| 6.10 | Wizard is skippable | Every Part Three step can be skipped without blocking | Functional test |
| 6.11 | Works on 3G, mid-range Android | Automated test of the full flow | Pass |
| 6.12 | Fully completable in Kinyarwanda | Native-speaker walkthrough | Pass |
| 6.13 | Agent cannot go live without an escalation target | Functional test | Pass |

**6.1 and 6.2 are the company's two most important numbers.** They belong on the admin console home dashboard from the first tenant.

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `activation.started` | tenant, language, entry point |
| `activation.step_viewed` / `step_completed` / `step_skipped` | step, duration |
| `activation.template_selected` | business type |
| `activation.price_extraction` | method, rows extracted, rows edited, accepted |
| `activation.voice_previewed` / `voice_selected` | voice, language |
| `activation.test_call_requested` | channel (outbound/web/inbound), attempt |
| `activation.test_call_completed` | duration, turns, latency p50/p95, ASR confidence |
| **`tenant.activated`** | time since signup, steps completed, corrections made |
| `activation.correction_made` | target (knowledge / rule / pronunciation) |
| `activation.forwarding_verified` | network, attempts, method |
| `activation.golive_scope_set` | scope |
| `activation.abandoned` | last step, duration, completed steps |

Per-step drop-off and time-to-first-value must be visible per cohort, per business type and per language. If one template converts materially worse than the others, that is a fixable product problem and we must be able to see it.

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 6.a | Is nine wizard steps too many? Evidence says clarity matters more than count, but this needs testing with real Rwandan SME owners | Flow length |
| 6.b | Do owners actually photograph a price list successfully on a mid-range camera in shop lighting? | Step 3 viability |
| 6.c | Should the test call be outbound (we call them) or inbound (they call us)? Outbound is lower friction; inbound proves the real path | Step 5 |
| 6.d | Is "only when I'm closed" the right default, or does it under-demonstrate value in week one? | Step 9, activation quality |
| 6.e | How many owners have no written price list at all — and does that break the flow or just narrow it? | Step 3 fallback |
| 6.f | Should activation require *any* credit, or is the free allowance enough through go-live? | 17 |
| 6.g | Does the six-way business-type split match how Rwandan SMEs actually describe themselves? | Step 1 taxonomy |

---

*Next: [07 — Phone Connection](07-flow-phone-connection.md)*
