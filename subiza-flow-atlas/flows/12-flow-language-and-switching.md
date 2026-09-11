# 12 — Flow: Language & Switching

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-12 |
| **Actors** | A5 Owner (configures) · **A1 Caller / A2 Messager (experiences)** |
| **Entry points** | Signup step 4 · My Agent → Languages · runtime, every conversation |
| **Exit states** | Language set for the conversation · switched mid-conversation · escalated on failure |
| **Depends on** | 09 |
| **Blocks** | Serving non-English callers — i.e. almost all of them |
| **Frequency** | Configured once; executed every conversation |
| **Criticality** | Critical |

---

## 1. Purpose

Make sure a caller is understood and answered in the language they actually speak — including when they mix two languages in one sentence, which in Kigali is the normal case rather than the exception.

**What breaks if this is wrong:** the product's entire differentiation. Anyone can build an English AI receptionist. The reason Subiza exists is that nobody answers the phone in Kinyarwanda.

---

## 2. The design position: choice first, detection second

The research contains a clear warning. Automatic language detection is unreliable for closely related languages, and vendors document real mid-conversation misfires — one reports roughly **4% of calls unexpectedly switching language around the eighth turn**. At scale that is hundreds of broken conversations a month. Another vendor's documentation recommends avoiding auto-detection entirely in favour of routing to language-specific agents.

At the same time, Rwandan speech genuinely code-switches. A caller will say *"Ese muhari? How much for braids?"* in one breath. A system that forces a single language per conversation is wrong about the market; a system that trusts detection alone is wrong about the technology.

**Subiza's position:**

```
   The caller's language is DECIDED in the first 3 seconds,
   by the caller, with three ways to decide it —
   and detection ASSISTS that decision rather than replacing it.

   Then switching is ALLOWED but BOUNDED and OBSERVABLE.
```

---

## 3. Overview

```
   CALL CONNECTS
        │
        ▼
   ┌──────────────────────────────────────────────────┐
   │  GREETING in the business's primary language      │
   │  + AI disclosure                                  │
   │  "Muraho, ni Salon Ubwiza. Ndi umufasha           │
   │   w'ikoranabuhanga. Nabafasha nte?"               │
   └───────────────────────┬──────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   caller speaks      caller presses     caller says
   Kinyarwanda        a key (DTMF)       "English please"
        │                  │                  │
        ▼                  ▼                  ▼
   detection agrees   explicit choice    explicit request
   → continue         → switch           → switch
        │                  │                  │
        └──────────────────┴──────────────────┘
                           ▼
              CONVERSATION LANGUAGE SET
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  MID-CONVERSATION                     │
        │  code-switching within a sentence     │
        │     → understood, answered in the     │
        │       dominant language               │
        │  a genuine full switch                │
        │     → allowed, logged, bounded        │
        │  repeated detection flapping          │
        │     → LOCK to current, log a warning  │
        └──────────────────────────────────────┘
```

---

## 4. Configuration (what the owner sets)

### Step 1 — Which languages?

| | |
|---|---|
| **Sees** | Four toggles with honest quality labels: **Ikinyarwanda** *(your main language)* · **English** · **Français** · **Kiswahili**. Each shows the current quality level — *Good* / *Improving* / *Not yet available for voice* |
| **Does** | Enables the ones their customers use |
| **System** | Loads the greeting, the deflection phrases and the escalation phrases for each; checks voice availability per language ([Flow 11](11-flow-voice-and-cloning.md)) |
| **Can fail** | A language with no adequate voice → offered for **chat only**, with the limitation stated plainly rather than hidden |

**The honest quality label is a deliberate trust decision.** If Kinyarwanda voice quality is not yet where it should be, we say so and let the owner decide, rather than shipping something embarrassing and letting their customers discover it.

### Step 2 — Which is primary?

The language the greeting uses. Defaults to Kinyarwanda. This is the language a caller hears before any detection has happened, so it should be the one most customers speak.

### Step 3 — How should switching work?

Three options, phrased as behaviour rather than as settings:

| Option | Behaviour | When to choose it |
|---|---|---|
| **Follow the customer** *(default)* | Detect and switch whenever the caller changes language | Mixed customer base |
| **Ask at the start, then stay** | Offer a choice in the greeting, then hold it for the whole call | Where detection is unreliable, or for calls involving numbers and bookings where a mid-call switch is disruptive |
| **Always [chosen language]** | Never switch | Single-language businesses |

**"Ask at the start, then stay" is the safety valve.** It maps to the vendor capability of restricting detection to the first turns, and it is the correct choice for any business whose calls involve prices, dates or addresses — the content most damaged by a spurious switch.

### Step 4 — Per-language greeting and key phrases

Auto-translated from the primary, then editable. Because a machine translation of *"Muraho, ni Salon Ubwiza"* is not always what a business would say in French, every translated string is shown for review with a *"sounds right?"* confirmation.

---

## 5. Runtime behaviour

### 5.1 The first three seconds

The greeting plays in the primary language and includes the AI disclosure. Then three signals can set the conversation language, in priority order:

| Priority | Signal | Weight |
|---|---|---|
| **1** | An explicit request — *"English please," "Mu Cyongereza"* | Absolute. Always obeyed |
| **2** | A keypad press, when the DTMF option is enabled | Absolute |
| **3** | Detection on the caller's first utterance | Advisory — applied only above a confidence threshold |

If detection is below threshold, the agent stays in the primary language and, on a second low-confidence turn, asks: *"Ushaka ko tuvugana mu Kinyarwanda cyangwa mu Cyongereza?"* — a single, natural question rather than a menu.

### 5.2 Code-switching within a sentence

The normal Kigali case: *"Ndashaka kubona appointment kuwa gatandatu."*

**This is not a language switch and must not be treated as one.** The agent identifies the dominant language of the utterance, understands the whole thing, and answers in the dominant language. Switching the entire conversation because a caller used one English word is exactly the failure mode the research documents.

### 5.3 A genuine switch

When a caller changes language for a whole turn and sustains it, the conversation switches — and the switch is logged, visible in the transcript, and counted.

### 5.4 Flap protection

If detection proposes more than two switches in one conversation, the agent **locks to the current language** for the remainder and emits a warning event. Repeated locking for a tenant is a signal that their detection settings or their language quality need attention, and it surfaces in AI Operations ([Flow 22](22-admin-ai-operations.md)).

### 5.5 When understanding fails

Two failed attempts in the current language triggers, in order: try the other enabled language once; then offer the keypad; then escalate to a human ([Flow 15](15-flow-escalation-and-handover.md)). **Never a third failed attempt in the same language** — that is the point at which callers hang up.

---

## 6. Messaging channels

Simpler, because text is easier than speech and there is time to be careful.

| Aspect | Behaviour |
|---|---|
| Detection | On the message text, with much higher reliability than on audio |
| Voice notes | Transcribed first, then treated as text. **Wideband audio means recognition is materially better than on calls** — voice notes are the best-quality speech input the product receives |
| Reply language | Matches the customer's last message |
| Reply format | For a voice note, reply with **both text and a synthesised voice note** in the same language |
| Mixed-language threads | Follow the most recent message |

---

## 7. Screens, states, decisions

| Screen | States |
|---|---|
| Language settings | Configuring · saved · a language unavailable for voice |
| Per-language phrases | Auto-translated · reviewed · edited |
| Switching mode | Follow / ask-then-stay / fixed |
| Transcript | Language markers per turn; switches highlighted |
| Quality panel | Per-language: understanding rate, switch count, failure rate |

| Decision | Branches |
|---|---|
| Explicit request? | Always obeyed |
| Keypad pressed? | Always obeyed |
| Detection confident? | Yes → apply · No → stay and ask |
| Code-switch or real switch? | Dominant-language answer · full switch |
| More than two switches? | Lock + warn |
| Two failures in a language? | Try the other · keypad · escalate |

---

## 8. Platform constraints

| Constraint | Effect |
|---|---|
| **L1 — detection unreliable, ~4% spurious mid-call switches documented** | Choice before detection; flap protection; ask-then-stay available |
| **L2 — restricting detection to early turns trades safety for flexibility** | Offered as the "ask at the start, then stay" mode |
| **L3 — separate prompts per language drift apart** | One configuration, translated views. Never separate agents per language |
| **V4 — Kinyarwanda unsupported in commercial TTS** | Honest per-language quality labels; pronunciation dictionary mandatory |
| **8 kHz narrowband on calls** | Recognition on calls is materially worse than on voice notes; thresholds are tuned per channel, not globally |

---

## 9. Edge cases and failures

| Case | Behaviour |
|---|---|
| Caller speaks a language the business has not enabled | Agent apologises in the primary language and escalates. Frequency is logged — *"5 callers spoke Swahili this month"* becomes a suggestion to enable it |
| Two people on one call speaking different languages | Follows the dominant speaker; if it flaps, locks and escalates |
| Very heavy accent within an enabled language | Handled as an understanding failure, not a language failure — trying a different language would make it worse |
| Numbers and dates in a second language | Common in Kigali (English numerals in Kinyarwanda speech). Normalised before reasoning, so *"Saturday saa tatu"* resolves correctly |
| Business name in the "wrong" language | The pronunciation dictionary overrides for all languages |
| Kinyarwanda voice not yet available | Chat-only for Kinyarwanda, calls answered in the next-best enabled language with an explicit apology. Stated in settings, never discovered by a customer |

---

## 10. Retention rationale

| Decision | Reason |
|---|---|
| Choice before detection | Detection failures are visible to the *customer*, which is the worst place for a failure to be visible |
| Code-switching handled as normal | Matches how Kigali actually speaks. Treating it as an error would make the product feel foreign |
| Flap protection | One frustrating call can end a subscription; a locked language is always better than a confused one |
| Honest quality labels | An owner who knows the limitation forgives it. One who discovers it via a customer complaint does not |
| Two strikes then escalate | Callers abandon after roughly two failures. The third attempt has negative value |
| "5 callers spoke Swahili" as a suggestion | Evidence-based expansion prompts drawn from the owner's own traffic |

---

## 11. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 12.1 | Explicit language requests are always honoured | Functional test across all four languages | 100% |
| 12.2 | Code-switched utterances do not trigger a full switch | Test set of mixed-language utterances | > 95% correct |
| 12.3 | Spurious mid-conversation switches are rare | Switches not preceded by a caller switch | < 1% of conversations |
| 12.4 | Flap protection engages | More than two proposed switches → lock | 100% |
| 12.5 | No third consecutive failed attempt in one language | Runtime audit | 100% |
| 12.6 | Voice-note replies are sent as both text and audio | Functional test | 100% |
| 12.7 | Per-language quality is visible to the owner | UI audit | Pass |
| 12.8 | Unavailable languages are never silently substituted | Copy and functional audit | Pass |
| 12.9 | Understanding rate per language is measured on real traffic | Instrumentation present from day one | Pass |

---

## 12. Instrumentation

| Event | Properties |
|---|---|
| `language.conversation_started` | primary, channel |
| `language.set` | language, method (explicit / DTMF / detection), confidence |
| `language.switch` | from, to, turn number, trigger |
| `language.codeswitch_detected` | dominant language, secondary |
| `language.flap_locked` | switch count, locked language |
| `language.detection_low_confidence` | turn, score |
| `language.understanding_failed` | language, attempt, action taken |
| `language.unsupported_requested` | language, count per tenant |

**`language.switch` with trigger = detection and no preceding caller switch is the spurious-switch metric.** It is the single most important quality number in this flow and belongs on the AI Operations dashboard.

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 12.a | What is the real Kinyarwanda understanding rate on 8 kHz telephone audio? Unknown until measured — see the project documentation's Phase 0 | Everything in this flow |
| 12.b | What proportion of Rwandan business calls actually code-switch, and how heavily? | Threshold tuning |
| 12.c | Is a DTMF language menu acceptable to callers, or does it feel like the IVR systems people hate? | Fallback design |
| 12.d | Should the greeting itself be bilingual for mixed customer bases, or does that sound clumsy? | Greeting design |
| 12.e | How should the agent handle a caller who switches language because it failed to understand — a switch, or an understanding failure? | Runtime logic |

---

*Next: [13 — Test & Go-Live](13-flow-test-and-go-live.md)*
