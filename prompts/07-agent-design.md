# SUBIZA — BUILD PROMPT 07

## Agent Design

> **Let a shop owner tell the AI how to behave — without writing a prompt, learning a flow builder, or
> knowing what a language model is.**
>
> This flow contains the sharpest objection in the whole programme, aimed at its own central idea, and
> the design answers it honestly enough to **concede part of it**. Read Part 2 before scoping.
>
> The most important idea here: a rule is either **enforced** or it is **requested**, and the product
> must never confuse the two. **A badge that lies is worse than no badge.**

|                    |                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Prompt**         | 07 of the series — Agent design                                                              |
| **Corresponds to** | `Design/agent.html` · atlas Flow 09 · flow 1.6 in `Design/PROGRAMME.md`                      |
| **Builds on**      | Prompts 01–06, all built                                                                     |
| **Scope**          | Extends the **Surface** only. Every activation Step is untouchable                           |
| **Apps**           | `apps/studio` · `packages/domain` · `packages/auth-tenant` · `packages/fixtures`             |
| **Screens**        | **3** — `b1` behaviour (Simple ⇄ Advanced) · `b2` contradiction check · `b3` version history |
| **Next prompt**    | 08 — Knowledge base (`Design/knowledge.html`)                                                |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next

`PROGRAMME.md` 1.6 follows the now-built 1.5. Prompt 06 shipped: `packages/domain/src/channel.ts`
exists with boundary tests, `features/channels/` is built, and the routes landed at
`(messaging)/connections/messaging/[channel]` — the path recommended to avoid the collision with
`/connections/phone`. **Prompts 01–06 are all written and built.**

And this flow has a socket waiting for it. `agentConfigSchema` already carries **`needsConflictCheck`**,
written `true` in exactly one place — `transitions.ts:98`, when a transcript correction edits opening
hours — **and nothing anywhere reads or clears it.** Prompt 04 planted the trigger for this flow's
contradiction check. Prompt 07 picks it up.

## 0.2 Phases

```
  ┌─ PHASE A ─ DECIDE & CORRECT ──────────────────────────────────┐
  │  A1 The Advanced-in-v1 decision (§2) — scope, not code         │
  │  A2 Fix the four inherited defects (§4.2)                      │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ DOMAIN ────────▼───────────────────────────────────┐
  │  Grow agent-config.ts from 40 lines to the house style.        │
  │  Rule categories, strengths, stages, tools, conflicts,         │
  │  versions, and every pure derivation.                          │
  │  SEQUENTIAL. Everything imports it.                            │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ THE SIMPLE VIEW ▼──────────────────────────────────┐
  │  b1. Persona, greeting, manner, the three rule lists.          │
  │  THIS IS THE PRODUCT. It must be complete on its own.          │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ ENFORCEMENT ───▼───────────────────────────────────┐
  │  D1 the three badges   D2 tool scoping   D3 the structural     │
  │  mechanisms that make "guaranteed" true                        │
  │  A badge without a mechanism behind it is a defect.            │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ CHECK & HISTORY ▼──────────────────────────────────┐
  │  E1 b2 contradiction check   E2 b3 version history + diff      │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE F ─ ADVANCED (IF SHIPPING) ▼───────────────────────────┐
  │  Stage grouping + per-stage tool visibility. Gated on A1.      │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE G ─ PROOF ─────────▼───────────────────────────────────┐
  │  G1 no-JS  G2 round-trip  G3 badge audit  G4 locked rules      │
  │  G5 concurrency  G6 rw@360  G7 adversarial                     │
  └───────────────────────────────────────────────────────────────┘
```

## 0.3 Agents

| Agent                    | Owns                     | Must be told                                                                              |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------------------------- |
| **Domain architect**     | Phase B.                 | `phone-channel.ts` and `channel.ts` are the house style. Copy the skeleton exactly.       |
| **Simple-view engineer** | Phase C.                 | The Simple view is the whole product. If it needs Advanced to be useful, you have failed. |
| **Enforcement engineer** | Phase D.                 | Every `guaranteed` badge needs a structural mechanism you can point at.                   |
| **Check engineer**       | Phase E.                 | The check must never block publishing. Resolution is the owner's decision.                |
| **Adversarial reviewer** | G7. **Never an author.** | Try to delete a locked rule via the server action, and to break the round trip.           |

## 0.4 Three rules

**Rule 1 — A badge that lies is worse than no badge.** A rule may carry `guaranteed` **only** when a
structural mechanism exists behind it. The counter-example to avoid is Botpress's _"the model will
decide when to use these tools based on your instructions"_ — that is a guideline wearing a guarantee's
clothes.

**Rule 2 — Containment, never immunity.** The badge scope is _"guaranteed for this rule"_, never _"the
agent cannot be manipulated"_. Least-privilege is a baseline control, not a prompt-injection cure, and
overclaiming here would make the entire honesty mechanism worthless.

**Rule 3 — Advanced adds visibility, never capability.** Every rule stays editable in Simple. **Nobody
may be required to enter Advanced to do anything.** That is what stops the simple view from rotting into
a demo.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A non-technical owner can change how their agent behaves, see which of their rules are genuinely
enforced versus merely requested, be warned when two rules disagree, publish anyway if they judge that
right, and undo any of it — including the undo.

## 1.2 Definition of done — twenty-two criteria

| #   | Criterion                                                                                        | Proven by                                                        |
| --- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | The Advanced-in-v1 decision is **made and recorded**, not defaulted                              | Named-assumption block comment                                   |
| 2   | `agent-config.ts` follows the `phone-channel.ts` house style                                     | Structural review                                                |
| 3   | No agent domain shape exists outside `packages/domain`                                           | `agent-boundary.test.ts`, copied from `channel-boundary.test.ts` |
| 4   | `needsConflictCheck` is **read and cleared** by the publish path                                 | It is no longer write-only                                       |
| 5   | Every `guaranteed` badge has a named structural mechanism                                        | **Code audit — criterion 9.5, 100%**                             |
| 6   | `Be warm` and `Always be right` are labelled **guideline**, honestly                             | Badge audit                                                      |
| 7   | **Two locked rules cannot be deleted by any exported mutator**                                   | Server-action test, independent of the UI                        |
| 8   | The contradiction check **does not block publishing**                                            | "Publish anyway" is a primary button                             |
| 9   | A publish-with-conflict is **recorded as an audit event**                                        | G21                                                              |
| 10  | The check refuses to auto-resolve and offers exactly **three** resolutions                       | Screen audit                                                     |
| 11  | **Restore saves the current state first** — a revert is itself revertible                        | Criterion 9.6                                                    |
| 12  | A revert within 24h emits an instrumented signal carrying `msSincePublish`                       | Event test                                                       |
| 13  | Simple ⇄ Advanced round-trips losslessly on a **full** configuration                             | Criterion 9.4                                                    |
| 14  | The rule count beside the switch is **computed, never hard-coded**                               | Grep                                                             |
| 15  | Only **active** rules count toward the 25 warning                                                | A switched-off rule genuinely reduces it                         |
| 16  | Greeting length is measured in **spoken seconds**, warns above 6s                                | ~2.6 words/second                                                |
| 17  | The confidence setting exists as Relaxed / Balanced / Careful                                    | G13 made visible                                                 |
| 18  | **Mid-call edits never affect a call in progress**                                               | Criterion 9.7, concurrency test                                  |
| 19  | The Kinyarwanda check runs on **both** original and English rendering; disagreement is a finding | Dual-run audit                                                   |
| 20  | Every control works with JavaScript disabled                                                     | Playwright — toggles, edits, publish, restore                    |
| 21  | `dal.updatePersona` exists; `enforcementSites` names no ghost                                    | Registry audit                                                   |
| 22  | Emits pass the capability explicitly — never the activation default                              | Audit-row inspection                                             |

## 1.3 Not in this phase

The knowledge base editor (Prompt 08) — rules may _reference_ knowledge, and a rule referencing
knowledge that does not exist is a **state**, not a feature to build here. Voice (Prompt 09). Languages
(Prompt 10). The test-and-go-live persona suite (Prompt 11).

---

# PART 2 — THE SCOPE DECISION

> **The design argues against its own central idea, and partly loses. Make this call in Phase A.**

## 2.1 The objection, stated properly

Jakob Nielsen, writing in 2026 about AI agent interfaces specifically, **rejects Simple/Advanced toggles
as a category.** Two arguments: they _"fracture codebases and documentation"_, and they assume a
population of power users that mostly does not exist — most people are **perpetual intermediates**,
occasional power users rather than people who graduate to expert mode and stay there. His prescription
is one unified design where controls keep fixed spatial positions and only what is expanded changes.

That is the most credentialed critique available of exactly what the atlas proposes, and **it would be
dishonest to design past it.**

## 2.2 The three responses

| Response                                         | The argument                                                                                                                                                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **There is no second configuration to fracture** | The same eleven rules, in the same words, with the same identities, re-presented. Simple groups them by category; Advanced groups them by moment in the conversation. **Nothing exists in one view that does not exist in the other** |
| **Advanced adds no capability**                  | It adds _visibility_ — which tools each stage can reach. Every rule stays editable in Simple. Nobody has to move to Advanced to do anything, which is what stops the simple view from rotting into a demo                             |
| **It is a view, not a mode**                     | No confirmation dialog, no "are you sure", no preference that persists and quietly becomes an identity. **The rule count is printed beside the switch specifically so the losslessness is visible rather than promised**              |

## 2.3 The concession

> **"He may still be right about who uses it."** Atlas question 9.b already asks whether Advanced should
> ship in v1 at all. _"The honest answer after this research is: **probably not.** Ship Simple,
> instrument `agent.mode_toggled`, and let the first customer who asks for stages tell us it's needed.
> Designing it now is cheap; shipping it now is a bet on a user who may not exist."_

**Decide explicitly in Phase A and record it in a named-assumption block comment.** If Advanced does not
ship, Phase F is deferred — but the **domain model still carries stages and tools**, because the Simple
view's `guaranteed` badges depend on per-stage tool scoping being real underneath. The model ships; the
view is the question.

---

# PART 3 — CONTEXT ABSORPTION

| #   | Read                                                          | Extract                                                                                     |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | `Design/agent.html` — **both modes**                          | 1,580 lines. Three screens `b1`/`b2`/`b3`, four aside panes, nine spec sections             |
| 2   | **Spec §01–§03 especially**                                   | The objection, the corrected rationale, and the enforcement table. These carry the evidence |
| 3   | `subiza-flow-atlas/flows/09-flow-agent-design-and-scripts.md` | The authoritative sequence, §10 criteria, §11 instrumentation                               |
| 4   | `packages/domain/src/phone-channel.ts` and `channel.ts`       | **The house style.** Note the named-assumption block at `phone-channel.ts:71–84`            |
| 5   | `packages/domain/src/agent-config.ts`                         | All 40 lines. What exists, and what must grow                                               |
| 6   | `packages/auth-tenant/src/{phone.ts,channels.ts}`             | The mutator house style you are copying                                                     |
| 7   | `prompts/04-guided-activation.md` Part 4                      | The Step/Surface contract you are bound by                                                  |

## 3.1 The gate

1. What is the difference between a `guaranteed` and a `guideline` rule, mechanically?
2. Which two rules can never be deleted, and **whose** account is at risk if one is?
3. Why must the contradiction check not block publishing?
4. Why is greeting length measured in seconds rather than characters?
5. What is written to `needsConflictCheck` today, and what reads it?

An agent that cannot answer #1 must not build Phase D.

---

# PART 4 — WHAT YOU INHERIT

## 4.1 The socket

`agentConfigSchema` today: `templateKind` · `otherDescription` · `persona` · `greeting` ·
`rules: Array<{id, text, locked}>` · `hours` · `afterHours` · `hoursConfirmedAt` · `needsConflictCheck`.

**Activation writes it in only four places** — `seedFromTemplate` (whole-document seed), `saveHours`,
`skipStep("hours")` (timestamp only), and `saveCorrection`. **Persona, greeting and rules are written
once at seed time and never edited again.** This flow is where they become editable.

## 4.2 Four inherited defects — fix in Phase A

**Defect 1 — `dal.updatePersona` does not exist.** `enforcementSites` names a ghost, exactly as
`dal.changeForwarding` did before Prompt 05. Add it as a thin
`requireGrant(ctx, 'configureAgentPersona', 'write', 'full')` + `writeAudit` gate, shaped like
`connectChannel` / `disconnectChannel`.

**Defect 2 — `emit()` defaults to the wrong capability.** The default is
`completeSignupAndActivation`, which would write the **wrong audit capability on every agent row.** Pass
`'configureAgentPersona'` explicitly on every emit.

**Defect 3 — a real bug: `ActivateView.tsx:206` calls `salonWeek()` unconditionally**, so a clinic is
shown salon opening-hours defaults. Fix it, and if hours editing needs a form-to-`WeekGrid` conversion,
put it in `packages/domain` rather than repeating the hand-built cast in `features/activation/actions.ts`.

**Defect 4 — the template locks are on the wrong rules.** `packages/fixtures/src/templates.ts` must lock
**the AI disclosure** and **the out-of-scope deflection** on every template, keeping _"Never invent a
price"_ and _"Fetch a person when unsure"_ as **unlocked-but-guaranteed**. Keep `rules.min(5)` satisfied.

**Also inherited:** `/(console)/agent/page.tsx` is still a 10-line read-only stub rendering
`AgentSurface` from `ReadOnlySurfaces.tsx` — a Banner plus one bare `<p>` per rule.
`features/business/TypeSurface.tsx` is a one-line re-export of that stub, and **there is no
`HoursSurface` at all.**

---

# PART 5 — THE EVIDENCE BASE

> **The design corrected its own rationale after research. Build on the corrected version.**

| Claim                                                          | What the evidence says                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structured rules beat prose **because of the format**          | **Not supported.** Across 10–160 simultaneous rules in markdown, plain text, prose and tables, markdown's advantage was ≤2.1 points for most models and **negative for one**. _"The same format is the best performer for one model and the worst for another."_ **Formatting is not the win** |
| Long rule sets degrade                                         | **Strongly supported, with a number.** Perfect-response rate **collapses to zero by 80 rules**, for every model and every format tested. The atlas's warning at **25** is conservative and defensible; Intercom caps its own guidance at 100 active items                                      |
| Negative instructions are less reliable than positive reframes | **Supported.** A model told to avoid a topic mentioned it **33% → 36%** of the time — the instruction measurably **backfired**. So _"give the price only from the list"_ genuinely does beat _"never invent prices"_                                                                           |
| Contradictions produce inconsistency rather than errors        | **Supported, and worse than assumed.** GPT-4o answered without acknowledging a contradiction **97.5%** of the time; the best model surfaced it in **45%**. There is also a **recency bias — later rules quietly win**, degrading satisfaction of earlier ones by **15–25 points**              |

**So the real case for structured rules is three things, none of them formatting:**

1. They can be **individually switched off**, which keeps the active count low and makes a misbehaving
   agent **bisectable**.
2. They can be **checked against each other before publishing**, which the model itself will not do.
3. Some of them **stop being text at all and become structure** — which is Part 6.

Two direct build consequences: the rule-count warning threshold is **25 active rules**, and rule copy
throughout should prefer **positive reframes** over `never` phrasings wherever a positive form exists.

---

# PART 6 — ENFORCED, NOT REQUESTED

> _"The most important idea in this flow, and the reason two badges appear on every rule."_

## 6.1 Three badges

| Badge                           | Internal | Meaning                                               |
| ------------------------------- | -------- | ----------------------------------------------------- |
| **Guaranteed** _(ntibihinduka)_ | `hard`   | A structural mechanism makes this true. Not a request |
| **Guideline**                   | `soft`   | Instructed to the model. May be violated. **Say so**  |
| **Always on**                   | `lock`   | Locked, unremovable. §6.3                             |

Each carries an icon, a colour treatment, a `title` tooltip and Kinyarwanda strings. The `guaranteed`
badge uses `--signal-soft` fill with `--signal-text` for its label — **the only green permitted as text.**

## 6.2 What makes a badge true

| Rule                                            | How it is **actually** enforced                                                                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| _Give the price only from the price list_       | A **typed field lookup** in the structured price table. Never generation                                                               |
| _Never quote for a bridal party_                | In the booking stage the **pricing tool is absent** when the party-size condition holds. Not an instruction — **a missing capability** |
| _Get a person when the customer is upset_       | An **escalation trigger evaluated every turn**, outside the model's discretion                                                         |
| _Always confirm a booking by repeating it back_ | A **required step in the booking action** before it commits                                                                            |

And honestly, in the same table: **`Be warm` and `Always be right` are guidelines.** The design labels
them so. **Do not upgrade a guideline to make the screen look stronger.**

## 6.3 The two locked rules

Unremovable, **enforced in the product rather than in policy:**

1. **The AI disclosure** — becoming law in several markets, and simply the right way to answer somebody's
   phone.
2. **The out-of-scope deflection** — because WhatsApp's terms prohibit general-purpose assistants. _"An
   owner must not be able to configure an agent that answers arbitrary questions, since that would put
   **their own** WhatsApp account at risk, not ours."_

Locked rows render no delete button, a disabled toggle and a readonly input — **and the server action
must reject deletion independently of the UI.**

## 6.4 Tool scoping

Per-stage on/off pills with a `toolwhy` micro-caption naming **the rule that removed the tool**
(_"bridal rule"_) or the fact that **no such tool exists** (_"no such tool"_).

The copy deliberately says **containment**, never immunity. See §0.4 Rule 2.

---

# PART 7 — `b1`: THE SIMPLE VIEW

**Heading:** _"How your agent behaves"_
**Sub:** _"Not a script and not a long instruction — a set of short rules. Each one can be edited,
switched off or deleted on its own, which is what makes it possible to work out which rule caused
something."_

That sub-line is the whole thesis: **bisectability**.

## 7.1 The switch

`Simple ⇄ Advanced`, with the live count beside it: **"11 rules either way — only the grouping
changes."** **Computed, never hard-coded** — it is the visible proof of losslessness.

## 7.2 Identity

**Who it is** — the persona.
**What it says when it answers** — the greeting, with the business name interpolated. Rendered with a
live length readout in **spoken seconds** (`3.4s`), a warning above **6s** (_"That's a long greeting"_),
and a **Hear it** control.

> Greeting length is measured in spoken seconds (~**2.6 words/second**), never characters, **because the
> failure mode is callers interrupting, which is a time phenomenon.**

## 7.3 How it speaks

| Setting                        | Helper copy                                              | Options                          |
| ------------------------------ | -------------------------------------------------------- | -------------------------------- |
| **Manner**                     | _How it sounds, not what it says_                        | Warm · Neutral · Formal          |
| **Answer length**              | _Long spoken answers get interrupted_                    | Short · Normal · Detailed        |
| **Use the customer's name**    | _Only possible when the caller's number reaches us_      | Yes · No                         |
| **How sure before it answers** | _When it isn't sure it fetches you rather than guessing_ | **Relaxed · Balanced · Careful** |

**The last one is G13 made visible** — the confidence gate as an owner-controlled setting, in words a
salon owner can reason about rather than a threshold number.

## 7.4 The three rule lists

> **Correction to the atlas.** The atlas describes five free-text rule categories. **The design ships
> three**, verified in the source: `cat` takes exactly `always` | `never` | `escalate`.
>
> _"How to speak"_ is **not** a rule category — it is the segmented-settings group in §7.3.
> _"Out of scope"_ is **not** a category either — it ships as **locked rule id 8 inside `never`**.
> Build the three. Do not invent the other two.

Each with a live count: **Always do** (4) · **Never do** (4) · **Get a person when** (3).

**The rule record carries both grouping keys at all times** — this is what makes the round trip true
rather than promised:

```
{ id, cat: 'always'|'never'|'escalate',
      stage: 'greeting'|'answer'|'booking'|'message'|'always',
      enf: 'hard'|'soft'|'lock', on, lock, en, rw }
```

There is **one flat array**. Simple filters on `cat`; Advanced filters on `stage`; one `ruleHTML()`
renders both.

Each rule row is its own record with an id, and carries: active / switched off · its badge · locked ·
conflicting · **references knowledge that doesn't exist**.

**Every control is a form.** A toggle is `<form action={toggleRuleAction}>` with a hidden id and a
submit. Delete is its own form. Category reassignment is a `<select>` inside a form. **No client
component, no `onChange`.** React is reserved for the `<ViewTransition>` wrapper.

---

# PART 8 — `b2`: THE CONTRADICTION CHECK

**Heading:** _"Two of your rules disagree"_

**Runs on Publish.** Reads and clears `needsConflictCheck`.

**It does not block.** _"Publish anyway"_ is a **first-class primary button**, and the override is
recorded as an audit event (G21).

> The spec is explicit that **resolution is a business decision the product refuses to make.** Blocking
> would substitute a technical judgement for the owner's.

**It quotes both rules verbatim, refuses to auto-resolve, and offers exactly three resolutions.**

**Precision target: >90% on a seeded conflict set** (criterion 9.3). Given an n-rule set has n²/2 pairs,
check incrementally and cache by rule-pair hash rather than re-running the whole matrix on every edit.

**States:** clean · conflicts listed with three resolutions · published anyway, recorded.

---

# PART 9 — `b3`: VERSION HISTORY

**Heading:** _"Every change can be undone"_

Modelled on **Dialogflow CX**: timestamped author rows, a **plain-English add/remove diff with an
unchanged count**, and Restore buttons.

## 9.1 The detail worth stealing

> **Restore-over-unsaved saves the current state first.** Criterion 9.6: _"every publish is revertible,
> and every revert is revertible."_ Implement as: snapshot current → push as a new version → apply the
> restored one.
>
> **This is the difference between a safety net and a trapdoor.**

## 9.2 The diff is the hard part

Not a JSON patch. A non-technical owner needs _"you added a rule about colour treatments and changed
your closing time"_ — `diffVersions(a, b)` returning `{ added, removed, unchangedCount }`.

## 9.3 A revert within a day is a signal

Emit `agent.reverted` carrying **`msSincePublish`**. A revert inside 24h is an instrumented alert signal
— something shipped that made the agent worse.

## 9.4 Where versions live

**Versions are tenant state, not a thirteenth domain document** — add an `agentVersion` history store to
`TenantBundle` and `emptyBundle()`. `DOMAIN_DOCUMENTS` stays at 12.

**States:** current · previous · diff · restore · restore-over-unsaved saves first.

---

# PART 10 — KINYARWANDA

> Atlas question 9.d asks whether the contradiction check can run in Kinyarwanda with acceptable
> accuracy. **The honest answer is that nobody knows.**

Instruction-following degrades for lower-resourced languages as a general finding, and there is a matched
academic study for Basque — but **no Kinyarwanda-specific figure exists publicly**, and the closest
Swahili paper was inaccessible. **This is a genuine gap in the literature rather than a risk somebody has
already measured.**

**The design response is not to guess:**

> Write the same ten rules in Kinyarwanda and in English, run both against the same set of test calls,
> and compare the agent's behaviour. **That is a week of work and it settles a question no paper can
> answer for us.**

**Until it is settled:** rules authored in Kinyarwanda are **stored as written**, and the contradiction
check runs on **both the original and an English rendering**, with **any disagreement between the two
treated as a finding rather than silently resolved.**

Record that in the named-assumption block. The product must not pretend to a confidence it lacks.

---

# PART 11 — THE DOMAIN DOCUMENT

Grow `packages/domain/src/agent-config.ts` **in place**, following the `phone-channel.ts` skeleton.

**Const tuples → derived types:** `RULE_CATEGORIES = ['always','never','escalate']` *(three, not five —
§7.4)* · `AGENT_STAGES = ['greeting','answer','booking','message','always']` *(the fifth is **Always
available**, where escalation rules live because they interrupt — the atlas's "Hand to a person" stage
does not exist)* · `RULE_ENFORCEMENT = ['hard','soft','lock']` · `TONES` · `ANSWER_LENGTHS` ·
`CONFIDENCE_LEVELS = ['relaxed','balanced','careful']` · `AGENT_TOOLS`.

**Private nested zod sub-schemas** with `.default()` on every field: `mannerSchema`, `stageSchema`,
`conflictSchema`, `versionSchema`. Then the extended `agentConfigSchema`, the `z.infer` type,
`emptyAgentConfig` extended in place, and a **new `normalizeAgentConfig(raw)`** using the
safeParse → fallback → merge → safeParse ladder.

**Steps:** `AGENT_STEPS = ['behaviour','conflict','history'] as const` plus
`AGENT_STEPMAP as const satisfies Record<AgentStep, number>`, and a `deriveAgentStep(config)` honouring
an explicit `surfaceStep` override first.

**Pure derivations — in domain, nothing in the app:** `rulesByCategory` · `enabledRules` ·
`toolsForStage(config, stage)` returning `{ available, withheld, reason }` · `detectContradictions(rules)`
returning conflict records with three resolutions · `spokenSeconds(text)` + `GREETING_MAX_SECONDS` ·
`diffVersions(a, b)` · `agentTileStatus(config)` · `ruleCountWarning(config)`.

**The named-assumption block** (in the `OPENING_HOURS_FORWARD_POLICY` style) covering: (a) whether
Advanced ships in v1; (b) the Kinyarwanda dual-run policy; (c) that tool scoping is **containment, not
prevention**.

**`packages/domain/src/agent-boundary.test.ts`**, copying `channel-boundary.test.ts` verbatim in
structure: no second declaration of `AgentConfig` / `AgentRule` / `AgentStage` outside
`agent-config.ts`, **plus a case asserting the two locked rule ids cannot be removed by any exported
mutator.**

---

# PART 12 — AUTH, EVENTS, ROUTES

**`packages/auth-tenant/src/agent.ts`**, mirroring `phone.ts`: an exported **`AGENT_SURFACE_AUTH`**
decision object, a private `deny(ctx, 'configureAgentPersona', reason)` writing the denied audit row,
`requireAgentWrite(ctx)`, `agentOf(ctx)` / `writeAgent(ctx, next)` accessors, and a
`changeAgent(ctx, patch)` patch-merger that every named mutator delegates to.

**Events** — add `AGENT_EVENTS` and `agentEventSchema` as a fourth `z.discriminatedUnion('name', …)`,
widening `TenantEvent`. Minimum set: `agent.mode_toggled` _(the instrument that settles the Advanced
question)_ · `agent.rule_added` · `agent.rule_edited` · `agent.rule_disabled` · `agent.rule_deleted` ·
`agent.greeting_edited` · `agent.manner_changed` · `agent.contradiction_check_run` ·
`agent.contradiction_resolved` · `agent.published_with_conflict` · `agent.published` ·
`agent.reverted { msSincePublish }`.

**Routes** — `app/(agent)/agent/behaviour/[step]/page.tsx` with `dynamic='force-dynamic'`,
`dynamicParams=true`, `generateStaticParams()` from `AGENT_STEPS`,
`PageProps<'/agent/behaviour/[step]'>`, awaited `params`/`searchParams`, `notFound()` on a failed guard,
and `<Suspense><ViewTransition>` — the exact shape of the phone route.

**Feature** — `apps/studio/src/features/agent/` as the four-file set: `steps.ts`, `load.ts`,
`actions.ts`, `BehaviourSurface.tsx`.

**Replace the body of `AgentSurface`** in `ReadOnlySurfaces.tsx` (or repoint it), **keeping the export
name** so `features/business/TypeSurface.tsx` keeps resolving.

**Render hours from `docs.agent.hours`** — do not repeat the `salonWeek()` bug (§4.2 Defect 3).

---

# PART 13 — STATES, i18n, PERFORMANCE

**The states table, verbatim from the spec:**

| Screen              | States                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Behaviour, Simple   | Template-loaded · edited · draft with unpublished changes · published · conflicts found · too many rules                            |
| Behaviour, Advanced | The same configuration, grouped by stage, with each stage's **available and withheld** tools                                        |
| A rule row          | Active · switched off · guaranteed · guideline · locked and unremovable · conflicting · **references knowledge that doesn't exist** |
| Greeting            | Editing · previewing · **too long, measured in spoken seconds**                                                                     |
| Contradiction check | Clean · conflicts listed with three resolutions · published anyway, recorded                                                        |
| Version history     | Current · previous · diff · restore · **restore-over-unsaved saves first**                                                          |

**Concurrency — criterion 9.7:** changes apply to the **next** conversation, never one in progress. The
persistent footer promises this to the owner. **Publishing must snapshot-and-version rather than mutate
live call state.**

**i18n** — add `agent` and `agentAside` namespaces to **both** `en.json` and `rw.json`. The console
namespace's existing keys stay for the nav label but stop being the page body. **The `rw` file is not
optional.** Prove every screen at 360px in `rw`.

**Performance** — keep the Advanced stage view and the version-history diff **off the first paint** of
`/agent`. They are separate `AGENT_STEPS` (or `<details>`-gated) so the behaviour screen alone stays
inside the 200KB above-fold budget on a low-end Android over 3G.

---

# PART 14 — VERIFICATION

| Audit                | Pass condition                                                           |
| -------------------- | ------------------------------------------------------------------------ |
| Badge honesty        | Every `guaranteed` traces to a named mechanism — **100%, criterion 9.5** |
| Guideline honesty    | `Be warm` and `Always be right` are labelled guideline                   |
| Locked rules         | Deletion rejected by the **server action**, not just hidden in the UI    |
| Round trip           | Full configuration survives Simple → Advanced → Simple                   |
| Rule count           | Computed; switching a rule off reduces the active count                  |
| Check                | Non-blocking; three resolutions; no auto-resolve; override audited       |
| Restore              | Current state saved first; the revert is revertible                      |
| Revert signal        | `agent.reverted` carries `msSincePublish`                                |
| Greeting             | Seconds not characters; warns above 6s                                   |
| Concurrency          | Publish during a live call does not change that call                     |
| Kinyarwanda          | Check runs on both renderings; disagreement surfaces as a finding        |
| `needsConflictCheck` | Read and cleared — no longer write-only                                  |
| Ghost                | `dal.updatePersona` exists                                               |
| Audit capability     | Rows carry `configureAgentPersona`, not the activation default           |
| Boundary             | `agent-boundary.test.ts` passes; a deliberate violation fails            |
| No-JS                | Toggle, edit, add, delete, publish, resolve, restore                     |
| Budget               | ≤200KB above fold on `/agent`                                            |
| rw @ 360             | No overflow, both themes                                                 |

## 14.1 The adversarial pass

A **different agent from every author**. Try to: delete a locked rule by posting the server action
directly · publish a configuration that loses a rule across the round trip · earn a `guaranteed` badge
with no mechanism behind it · restore a version and lose the state that was current · edit rules during a
live call and change it · get a raw conflict object onto the screen.

---

# PART 15 — DELIVERABLES & NEXT

1. The Advanced-in-v1 decision, recorded in a named-assumption block
2. Four inherited defects fixed (§4.2) — including the `salonWeek()` bug and the template locks
3. `agent-config.ts` grown to house style, with every pure derivation
4. `agent-boundary.test.ts`, including the locked-rule case
5. `packages/auth-tenant/src/agent.ts` + `AGENT_SURFACE_AUTH` + `dal.updatePersona`
6. `b1` Simple view — persona, greeting, manner, three rule lists, three badges
7. Tool scoping with `toolwhy` captions _(model ships even if the Advanced view does not)_
8. `b2` the contradiction check — non-blocking, three resolutions, audited override
9. `b3` version history — Dialogflow-CX-modelled, restore-saves-first, `msSincePublish`
10. Twelve agent events; `en`/`rw` parity
11. The adversarial report

**Prompt 08** — Knowledge base (`Design/knowledge.html`): prices as typed data not prose, citation as an
edit affordance, gaps mined from real calls, and the pronunciation lexicon. It mounts a Surface beside
the `PriceStep` activation already built — and it is where the _"references knowledge that doesn't
exist"_ rule state finally resolves. Say **next**.

---

# PART 16 — APPENDIX

## A — Enforced vs requested

```
   THE OWNER WRITES:  "Give the price only from the price list"
                                    │
              ┌─────────────────────┴─────────────────────┐
              ▼                                           ▼
     ┌──────────────────┐                      ┌──────────────────────┐
     │  WHAT MOST DO    │                      │  WHAT SUBIZA DOES    │
     │                  │                      │                      │
     │  paste it into   │                      │  typed field lookup  │
     │  the prompt and  │                      │  in the price table. │
     │  hope            │                      │  Generation is not   │
     │                  │                      │  on the code path.   │
     │  Botpress: "the  │                      │                      │
     │  model will      │                      │  → badge: GUARANTEED │
     │  decide … based  │                      │                      │
     │  on your         │                      └──────────────────────┘
     │  instructions"   │
     │                  │      "Be warm"  ────► no mechanism exists
     │  → a guideline   │                       → badge: GUIDELINE
     │    wearing a     │                         and we SAY so
     │    guarantee's   │
     │    clothes       │      ═══════════════════════════════════
     └──────────────────┘      A BADGE THAT LIES IS WORSE THAN
                               NO BADGE.  (criterion 9.5, 100%)

   THE FOUR MECHANISMS THAT EARN "GUARANTEED":
     typed field lookup  ·  a tool ABSENT from the stage
     an every-turn trigger outside the model's discretion
     a required step before an action commits

   And the scope of the claim is always "guaranteed for this rule",
   never "the agent cannot be manipulated".  CONTAINMENT, NOT IMMUNITY.
```

## B — One configuration, two projections

```
                    ┌───────────────────────────────┐
                    │   ONE RULE ARRAY — 11 rules   │
                    │   same words, same ids        │
                    └───────────────┬───────────────┘
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
         ┌───────────────────────┐     ┌───────────────────────┐
         │  SIMPLE               │     │  ADVANCED             │
         │  grouped by CATEGORY  │     │  grouped by MOMENT    │
         │                       │     │                       │
         │  always do         4  │     │  Greeting             │
         │  never do          4  │     │  Answer a question    │
         │  get a person when 3  │     │  Take a booking       │
         │                       │     │  Take a message       │
         │  (out-of-scope is a   │     │  Always available  ←  │
         │   LOCKED rule inside  │     │   escalation lives    │
         │   "never do", not a   │     │   here: it interrupts │
         │   category)           │     │   └ tools: available  │
         │  EVERY rule editable  │     │      and WITHHELD,    │
         │  here. Nobody must    │     │      with the rule    │
         │  enter Advanced to    │     │      that removed it  │
         │  do anything.         │     │                       │
         └───────────────────────┘     └───────────────────────┘
                     └──────────────┬──────────────┘
                                    ▼
                 "11 rules either way — only the grouping changes"
                  ↑ COMPUTED, never hard-coded.
                    the losslessness is VISIBLE, not promised.

   Nielsen: Simple/Advanced toggles fracture things and assume power
   users who don't exist — most people are perpetual intermediates.
   Answer: nothing to fracture (one array), no capability added
   (visibility only), and it's a view not a mode (no dialog, no
   persisted preference).
   CONCESSION: he may be right about WHO USES IT. Ship Simple,
   instrument agent.mode_toggled, let a real customer ask for stages.
```

## C — Publish, check, revert

```
   EDIT ──► needsConflictCheck = true        ← planted by Prompt 04 at
     │       (today: written, never read)      transitions.ts:98
     ▼
   PUBLISH ──► CONTRADICTION CHECK
                  │
         ┌────────┴────────┐
         ▼                 ▼
      CLEAN          TWO RULES DISAGREE
         │                 │  both quoted verbatim
         │                 │  NO auto-resolution
         │                 │  exactly three resolutions
         │                 │
         │            ┌────┴──────────────┐
         │            ▼                   ▼
         │      resolve one         PUBLISH ANYWAY
         │            │             a primary button.
         │            │             recorded as an
         │            │             audit event (G21).
         │            │             resolution is a
         │            │             BUSINESS decision
         │            │             we refuse to make.
         └────────────┴───────────────────┘
                      ▼
                 VERSION PUSHED
                      │
                      ▼
                 ┌─────────────────────────────────────┐
                 │  RESTORE an older version?          │
                 │                                     │
                 │  1. snapshot CURRENT → push as a    │
                 │     new version          ← the      │
                 │  2. THEN apply the restored one     │
                 │                                     │
                 │  so every revert is itself          │
                 │  revertible. (criterion 9.6)        │
                 │  Stolen from Dialogflow CX. It is   │
                 │  the difference between a safety    │
                 │  net and a trapdoor.                │
                 └─────────────────────────────────────┘
                      │
                      ▼  revert < 24h?
                 emit agent.reverted { msSincePublish }
                 → an alert signal: something shipped
                   that made the agent worse.

   Throughout: changes apply to the NEXT conversation.
   A call in progress is never touched. (criterion 9.7)
```

---

_Prompt 07 · Subiza · Agent Design_
_Built against `Design/agent.html`, atlas Flow 09, and the design's own corrected research._
_Where this document and the prototype disagree, this document wins._
