# 09 — Flow: Agent Design & Scripts

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-09 |
| **Actor** | A5 Owner, A6 Manager |
| **Entry points** | Activation step 1 (template) · My Agent → Behaviour · a correction from a transcript |
| **Exit states** | Saved as draft · Published live · Reverted |
| **Depends on** | 06 |
| **Blocks** | 13 Test & go-live |
| **Frequency** | Once at setup, then continuously in small edits |
| **Criticality** | Critical |

---

## 1. Purpose

Let a shop owner tell the AI how to behave — who it is, what it does, what it must never do, and when to fetch a human — without writing a prompt, learning a flow builder, or understanding what a language model is.

**What breaks if this is wrong:** the agent misbehaves in front of real customers, and the owner has no idea why or how to fix it. That is the failure that ends a subscription in week two.

---

## 2. The design position

The competitor research found a consistent pattern and a consistent gap.

**The pattern:** every serious product offers a simple mode (one prompt) and a complex mode (a visual flow builder), and every one of them documents the same failure — a single free-text prompt drifts and becomes unreliable past roughly a thousand words or five tools. Retell's own documentation warns of this and recommends graduating.

**The gap:** every product forces that choice **at agent creation and treats it as permanent**. A business that starts simple and grows must rebuild from scratch. And one reviewer of a leading platform asked directly for "a basic mode and an advanced mode" — nobody has shipped it as a toggle on one agent.

**Subiza's position: one agent, two views of the same configuration.**

```
   ┌─────────────────────────────────────────────────────────────┐
   │              ONE UNDERLYING CONFIGURATION                    │
   │   identity · rules · stages · tools · escalation · hours     │
   └──────────────┬──────────────────────────┬───────────────────┘
                  │                          │
      ┌───────────▼──────────┐   ┌───────────▼──────────────────┐
      │  SIMPLE VIEW         │   │  ADVANCED VIEW               │
      │  (default)           │◄─►│  (toggle, never forced)      │
      │                      │   │                              │
      │  structured form:    │   │  named conversation stages:  │
      │  who it is           │   │   Greeting                   │
      │  how it speaks       │   │   Answer a question          │
      │  always do           │   │   Take a booking             │
      │  never do            │   │   Take a message             │
      │  get a person when   │   │   Hand to a person           │
      │  opening hours       │   │  each with its own rules     │
      │                      │   │  and its own available tools │
      └──────────────────────┘   └──────────────────────────────┘
              switching between them loses nothing
```

The stages in Advanced are **named things a shop owner recognises**, not nodes on a canvas. There is no wiring, no edges, no arrows to draw. It is the same configuration, grouped by moment in the conversation instead of by category.

---

## 3. Overview

```
   Template loaded (from business type)
            │
            ▼
   ┌────────────────────────────────┐
   │  1. Who is it?                  │  name · greeting · tone
   ├────────────────────────────────┤
   │  2. How should it speak?        │  length · warmth · formality
   ├────────────────────────────────┤
   │  3. Always do                   │  structured rules
   ├────────────────────────────────┤
   │  4. Never do                    │  structured rules
   ├────────────────────────────────┤
   │  5. Get a person when           │  escalation triggers
   ├────────────────────────────────┤
   │  6. Opening hours & after hours │
   └───────────────┬────────────────┘
                   ▼
        ⚠ CONTRADICTION CHECK
          "Rule 3 and rule 7 conflict"
                   ▼
              PUBLISH  ──►  Flow 13 test
```

---

## 4. Detailed flow

### Step 1 — Who is it?

| | |
|---|---|
| **Sees** | Pre-filled from the template. Agent name (default: the business name). Greeting, editable, with a **▶ hear it** button. Three tone options as words, not sliders: Warm and friendly · Professional · Brief and efficient |
| **Does** | Adjusts, listens |
| **System** | Regenerates the greeting preview in the selected voice on every change |
| **Can fail** | Greeting too long → soft warning with a spoken-duration estimate: *"That takes 11 seconds to say. Customers usually hang up. Shorter?"* |

**Duration, not character count.** A shop owner does not think in characters. They think in "how long before I get to talk."

### Step 2 — How should it speak?

Three controls, each phrased as an outcome:

| Control | Options | Effect |
|---|---|---|
| Answer length | Short (1 sentence) · Normal (2) · Detailed (3–4) | Response constraints. Short is the default — long spoken answers are unpleasant, expensive, and invite interruption |
| Warmth | Warm · Neutral · Formal | Persona |
| Use the customer's name | Yes when known · No | Only meaningful when caller ID survives forwarding ([Flow 07](07-flow-phone-connection.md)); the option is hidden when it does not, rather than offered and quietly ignored |

### Steps 3–5 — Rules, in categories

**This is where Subiza departs from prose prompting.**

Rules are entered as **short statements in named categories**, not as one free-text box. Each rule is a row that can be edited, disabled or deleted individually.

| Category | Placeholder examples (pre-filled by template) |
|---|---|
| **Always do** | Confirm a booking by repeating it back · Give the price only from the price list · Say the address when someone asks where we are |
| **Never do** | Promise a discount · Discuss other salons · Give medical advice |
| **Get a person when** | The customer sounds upset · A booking is for more than 5 people · Anyone asks for the owner by name · The customer asks twice and I still cannot help |

Why categories rather than one box:

1. **Positive framing beats banlists.** "Give the price only from the price list" is more reliable than "never invent prices" — negative instructions can prime the very behaviour they forbid. The category structure nudges toward the positive form, and the placeholder text models it.
2. **Rules can be individually disabled**, which makes debugging tractable. "The agent keeps mentioning delivery" → find the rule, switch it off, test. One free-text prompt cannot be bisected.
3. **Rules map to enforcement, not just instruction** — see §5.
4. **Rules can be checked against each other** — see step 7.

### Step 6 — Hours and after-hours

Pre-filled from activation. Adds per-day exceptions, public holidays, and the after-hours behaviour (answer and take a message · answer and book for the next open day · take a message only).

### Step 7 — The contradiction check

| | |
|---|---|
| **Sees** | On publish, if conflicts exist: *"Two of your rules disagree. 'Always give the price' and 'Never quote for weddings' — which wins when someone asks about a wedding?"* with both rules shown and a resolution choice |
| **Does** | Resolves, or publishes anyway with an acknowledgement |
| **System** | Analyses the rule set for contradictions, redundancy, ambiguity and impossibility before publishing |

**A leading competitor ships exactly this** — an assistant that reviews submitted guidance for clarity, ambiguity, redundancy and contradictions before it goes live — and it prevents the single most common self-inflicted failure in prose-configured agents. Contradictory rules do not produce an error; they produce an agent that behaves inconsistently and an owner who concludes the AI is unreliable.

---

## 5. Rules that are enforced, not merely requested

The most important engineering point in this flow: **some rules become structure, not text.**

| Rule type | How it is enforced |
|---|---|
| "Give the price only from the price list" | The agent reads prices from the **structured price table** ([Flow 10](10-flow-knowledge-base.md)). It is a typed field lookup, never generation. The rule is a guarantee |
| "Never quote for bridal parties" | In the Take a booking stage, the pricing tool is **not available** when the party-size condition is met. Not an instruction — an absent capability |
| "Get a person when the customer is upset" | An escalation trigger evaluated every turn, outside the model's discretion |
| "Never discuss competitors" | Scope enforcement at the retrieval boundary: nothing about competitors exists in the knowledge base, and out-of-scope queries are deflected |
| "Always confirm a booking by repeating it back" | A required step in the booking action before commit |
| "Be warm" | Genuinely prompt-level. Some things are style, and style is probabilistic |

**Tool scoping is the mechanism that makes rules real.** An agent that *cannot* quote a price in a given stage will not quote one, regardless of what a caller says to it. That is a different guarantee from an agent that has been asked not to — and it is also the defence against prompt injection ([Flow 01 §3 A10](01-actors-roles-and-permissions.md)).

---

## 6. Advanced view

Toggled from Behaviour, never forced, and reversible without loss.

```
   ADVANCED — conversation stages

   ┌─ Greeting ──────────────────────────────────┐
   │  Says: "Muraho, ni Salon Ubwiza…"            │
   │  Tools: none                                 │
   │  Then: → Answer a question                   │
   └──────────────────────────────────────────────┘
   ┌─ Answer a question ─────────────────────────┐
   │  Rules: prices from the list only            │
   │  Tools: ✅ look up price  ✅ opening hours    │
   │         ❌ create booking                     │
   │  Escalate if: not confident · asked twice    │
   └──────────────────────────────────────────────┘
   ┌─ Take a booking ────────────────────────────┐
   │  Rules: confirm by repeating back            │
   │  Tools: ✅ check availability ✅ create       │
   │         ❌ price  (bridal rule active)        │
   └──────────────────────────────────────────────┘
   ┌─ Always available ──────────────────────────┐
   │  "I want a person"  → Hand to a person       │
   │  "What are your hours?" → answer, return     │
   └──────────────────────────────────────────────┘
```

The **Always available** block is the interrupt handler — the mechanism that lets a caller ask an off-script question or demand a human from any point without derailing the conversation. Leading flow-based products implement this as "global nodes"; Subiza exposes it as one plainly-named block rather than a graph concept.

---

## 7. Screens, states, decisions

| Screen | States |
|---|---|
| Behaviour (Simple) | Template-loaded · edited · draft · published · conflicts found |
| Behaviour (Advanced) | Same configuration, stage view |
| Rule row | Active · disabled · conflicting · unenforceable (flagged) |
| Greeting | Editing · previewing · too long |
| Contradiction check | Clean · conflicts listed · acknowledged |
| Version history | Current · previous versions · diff · restore |

| Decision | Branches |
|---|---|
| Simple or Advanced? | Toggle, any time, no loss |
| Publish with conflicts? | Resolve · publish with acknowledgement |
| Rule enforceable structurally? | Becomes a constraint · stays prompt-level, and is **labelled as such** |
| Changes affect a live agent? | Publish immediately · schedule · test first (recommended) |

---

## 8. Platform constraints

| Constraint | Effect |
|---|---|
| **W8 — no general-purpose assistants on WhatsApp** | The out-of-scope deflection rule is **mandatory and not removable**. An owner cannot configure an agent that answers arbitrary questions. This is enforced in the product, not left to policy |
| G13 — refuse rather than guess | The confidence threshold is a first-class setting, expressed as *"How sure should it be before answering?"* with three plain options |
| V4 — Kinyarwanda pronunciation | Rules referencing specific names prompt an offer to add them to the pronunciation dictionary |
| Documented single-prompt drift | Why rules are structured and the Advanced view exists at all |

---

## 9. Edge cases and failures

| Case | Behaviour |
|---|---|
| Owner writes a rule the system cannot enforce ("always be right") | Accepted, but labelled *"This is a guideline, not a guarantee"* — honest about what is probabilistic |
| Rules contradict each other | Contradiction check at publish |
| Too many rules (>25) | Warning: rule sets past a certain size behave less predictably. Suggest consolidation |
| Rule references knowledge that does not exist | Flagged: *"You mention a delivery fee but there's no delivery price in your price list"* |
| Publishes something that breaks the agent | Version history with one-tap revert; every publish is a restorable version |
| Manager edits while a call is in progress | Changes apply to the **next** conversation, never mid-call |
| Template rules deleted entirely | Allowed, except the mandatory disclosure and out-of-scope rules |

---

## 10. Retention rationale

| Decision | Reason |
|---|---|
| Templates pre-fill everything | Blank-page abandonment is a documented cause of drop-off |
| Categorised rules, not a prompt box | Debuggable, individually reversible, and closer to how an owner thinks about their business |
| Contradiction check before publish | Prevents the failure that makes owners conclude the AI is unreliable |
| Tool scoping over instruction | Turns hopes into guarantees, which is what earns the right to go fully live |
| Advanced as a toggle, not a fork | Nobody has to rebuild when they outgrow simple — the only product in the category where this is true |
| Version history and one-tap revert | Removes the fear of editing, which is what keeps owners tuning their agent instead of abandoning it |

---

## 11. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 9.1 | An owner can change agent behaviour without help | Task test: "make it stop offering delivery" | > 80% success |
| 9.2 | Templates need few edits to be usable | Rules edited at activation | ≤ 3 median |
| 9.3 | Contradiction check catches real conflicts | Precision on a seeded conflict set | > 90% |
| 9.4 | Simple ↔ Advanced round-trips without loss | Functional test with a full configuration | Pass |
| 9.5 | Structurally-enforceable rules are enforced structurally | Audit: price rules never rely on prompting alone | 100% |
| 9.6 | Every publish is revertible | Functional test | Pass |
| 9.7 | Mid-call edits never affect the call in progress | Concurrency test | Pass |
| 9.8 | The out-of-scope rule cannot be removed | Functional test | Pass |
| 9.9 | Rules are editable in all four languages | Translation and input test | Pass |

---

## 12. Instrumentation

| Event | Properties |
|---|---|
| `agent.template_loaded` | business type, rule count |
| `agent.rule_added` / `edited` / `disabled` / `deleted` | category, enforceable? |
| `agent.contradiction_detected` | rule pair, resolved? |
| `agent.published` | version, rule count, changed fields |
| `agent.reverted` | from version, to version, hours live |
| `agent.mode_toggled` | simple → advanced or back |
| `agent.greeting_previewed` | duration seconds |

**Reversion within 24 hours of a publish is a quality signal worth alerting on** — it usually means a change broke something and the owner noticed before we did.

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 9.a | Do owners understand "rules" as a concept, or do they expect to write a script the AI reads aloud? | Core metaphor |
| 9.b | Should Advanced ship in v1 at all, or only when a customer asks? | Scope |
| 9.c | How many rules before behaviour degrades measurably? Needs empirical testing | The >25 warning threshold |
| 9.d | Can the contradiction check run in Kinyarwanda with acceptable accuracy? | Localisation |
| 9.e | Should owners be able to write free-text instructions at all, as an escape hatch? Power without the safety of structure | Flexibility vs reliability |

---

*Next: [10 — Knowledge Base](10-flow-knowledge-base.md)*
