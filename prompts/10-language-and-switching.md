# SUBIZA — BUILD PROMPT 10

## Language and Switching

> **"The flow where the product's whole differentiation lives, and the one where the owner configures
> something she will never hear."**
>
> Anyone can build an English AI receptionist. The reason Subiza exists is that nobody answers the
> phone in Kinyarwanda. And yet **five of this flow's nine success criteria are pure runtime
> criteria** — the model either does them or it does not, and no amount of React changes that. The
> prototype's job is therefore not to _claim_ them. It is to render their evidence surfaces and their
> locked controls **honestly**, including the evidence that says we do not yet know.
>
> This is the first flow in the series whose principal deliverable is a **confession**.

|                    |                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **Prompt**         | 10 of the series — Language and switching                                                          |
| **Corresponds to** | `Design/language.html` (2,081 lines) · atlas Flow 12 · flow 1.9 in `Design/PROGRAMME.md`           |
| **Builds on**      | Prompts 01–06 built; 07 building (`features/agent/` now exists); 08–09 written                     |
| **Scope**          | A new `features/language/` surface. **One configuration, translated views — never a second agent** |
| **Apps**           | `apps/studio` · `packages/domain` · `packages/i18n` · `packages/core` · `packages/ui`              |
| **Screens**        | **9** — l1 … l9, all owner-side, all in the console                                                |
| **Blocked by**     | Atlas 12.a — the real Kinyarwanda understanding rate on 8 kHz audio. **Unanswered**                |
| **Next prompt**    | 11 — Test and go-live (`Design/golive.html`)                                                       |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next

`PROGRAMME.md` 1.9 follows 1.8, and maps to atlas Flow 12 and `Design/language.html`. The build has
moved: `apps/studio/src/features/agent/` now exists with `BehaviourSurface.tsx`, `actions.ts`,
`load.ts` and `steps.ts`, and `packages/domain/src/agent-config.ts` has grown from a 40-line seed to a
fully built configuration module. **Prompt 07 is landing.** The prompts run one flow ahead.

Three things point here specifically:

1. **`packages/i18n/src/index.ts` already declares the four locales** — `rw`, `en`, `fr`, `sw`, with
   `defaultLocale = "rw"` — and four message catalogues exist. The _interface_ speaks four languages.
   **The agent does not.** This flow builds the second half.
2. **`agent-config.ts` already ships `spokenSeconds()`, `GREETING_MAX_SECONDS` and
   `greetingTooLong()`** — the exact mechanism l4 needs for its `≈ 4.2s spoken` stamp. Prompt 07 built
   the tool; this flow is what it was for. §3.3 and §3.4 explain why both are currently wrong.
3. **`enforcementSites.changeLanguageSettings` names `dal.changeLanguage`, which does not exist.**
   Prompt 09 §3.3 wrote: _"Otherwise Prompt 10 inherits it a fifth time."_ It did (§3.1).

## 0.2 The defining fact — read this before anything else

```
   NINE SUCCESS CRITERIA                     WHO SATISFIES THEM
   ─────────────────────                     ──────────────────
   12.1  explicit requests honoured          RUNTIME  ← design makes it VISIBLE and UNCONFIGURABLE
   12.2  code-switch ≠ full switch           MODEL, Phase 3  ← design renders what right looks like
   12.3  spurious switches < 1%              RUNTIME  ← design gives it the headline
   12.4  flap protection engages             RUNTIME  ← design renders the lock and its one remedy
   12.5  no third failed attempt             RUNTIME  ← design makes the ladder read-only
   12.6  voice-note replies both forms       PARTLY   ← design states it as fixed, not a setting
   12.7  per-language quality visible        FULLY    ← THIS IS THE DELIVERABLE
   12.8  no silent substitution              FULLY
   12.9  measured on real traffic day one    PARTLY   ← "measuring since · N calls", even at zero

   Five of nine are pure runtime. For those, do NOT build a UI that
   asserts the behaviour. Build the surface that would EXPOSE it failing.
```

If you find yourself writing a component that claims a language is understood well, stop. **The only
honest thing this flow can ship about model quality is a measurement, or the absence of one.**

## 0.3 Phases

```
  ┌─ PHASE A ─ CORRECT ───────────────────────────────────────────────┐
  │  A1  Kill the ghost — the FIFTH time (§3.1)                        │
  │  A2  The systemic fix. It has not landed in five prompts. DO IT.   │
  │  A3  spokenSeconds is language-blind (§3.3)                        │
  │  A4  GREETING_MAX_SECONDS: 6 in code, 5 in the design (§3.4)       │
  │  A5  The pronunciation-pollution bug — third prompt running (§3.5) │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE B ─ THE TRANSLATION BOUNDARY ─▼────────────────────────────┐
  │  Decide what is translated and what is ONE configuration.          │
  │  AgentRule.en/.rw is NOT a translation layer — §4.3.               │
  │  ← THE DOMAIN CENTRE. Get this wrong and L3 is violated forever.   │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE C ─ THE LABELS ─────▼──────────────────────────────────────┐
  │  Two marks per language, four rungs. "Not yet measured" is the     │
  │  SHIPPING STATE, not an edge case. §6                              │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE D ─ THE BOARD & THE MODES ▼────────────────────────────────┐
  │  l1, l2, l3. Two locked rows. No detection dial. Read-only ladder. │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE E ─ THE TRANSLATED VIEW ▼──────────────────────────────────┐
  │  l4. Target first, source beneath — the INVERSE of the transcript. │
  │  Amber until confirmed. Length in spoken seconds. §9.4             │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE F ─ THE EVIDENCE ───▼──────────────────────────────────────┐
  │  l5, l6, l7, l8. Empty state designed FIRST. The thirty-call floor.│
  │  A mixed sentence gets NO switch marker. §7 §8                     │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE G ─ PROOF ──────────▼──────────────────────────────────────┐
  │  G1 no-number-under-thirty   G2 no-agent-per-language   G3 no-JS   │
  │  G4 locked-rows              G5 rw@360                 G6 adversarial │
  └───────────────────────────────────────────────────────────────────┘
```

## 0.4 Agents

| Agent                    | Owns                     | Must be told                                                                                            |
| ------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Platform engineer**    | Phase A                  | Five prompts have named a function nobody wrote. The test is twenty lines. Write it this time.          |
| **Domain architect**     | Phase B. **Start here.** | Rules are never translated. Spoken phrases always are. `en`/`rw` on a rule is a dual-run artefact.      |
| **Honesty engineer**     | Phase C, §6              | You are shipping a label that says we do not know. That is the feature, not a placeholder.              |
| **Settings engineer**    | Phase D                  | Two rows are locked. There is no threshold slider. The ladder does not configure.                       |
| **Translation engineer** | Phase E                  | Target language leads. This inverts the transcript component **on purpose** — do not "fix" it.          |
| **Evidence engineer**    | Phase F                  | Under thirty calls the number is **removed**, not greyed. Empty is designed first.                      |
| **Adversarial reviewer** | G6. **Never an author.** | Try to create a per-language agent, to see a percentage from six calls, to turn off "explicit request". |

## 0.5 Four rules

**Rule 1 — The caller decides, in the first three seconds. Detection assists; it never replaces.**
An explicit request is absolute. A keypad press is absolute. Detection is advisory and only above
threshold. The first two render as **locked rows**, in the same visual grammar as the locked withdrawal
control in Prompt 09. (§5)

**Rule 2 — One configuration, translated views. Never an agent per language.** There is no
"create a French agent" control anywhere in this flow, and there never will be. Three months after you
create a second agent, one of them knows the new price and the other does not. (§4)

**Rule 3 — Under thirty calls, show a sentence, not a number.** _"A percentage computed from six calls
is noise wearing the costume of a fact, and a shop owner who reads 83% on a screen will believe it."_
Remove the meter. Do not grey it. Do not show it with a confidence caveat. (§8.2)

**Rule 4 — Mixing languages is not an event.** A mixed utterance is **one turn**, two language chips, a
dotted underline under the foreign span, **and no switch marker above it.** Drawing normal speech as an
event tells somebody the way they talk is a mistake. (§7)

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A shop owner turns on the languages her customers actually speak, sees an honest two-part quality label
for each — one for the phone, one for messages — chooses in plain words what the agent should do when a
caller has not asked, reviews a machine translation of what her agent says in each language and stamps
it "that's how we'd say it", and then, on a separate page, watches the one number that tells her whether
her setting is right: **how often the agent changed language when nobody asked it to.** And when there
are not enough calls to say anything, she is told so in a sentence rather than shown a figure we
invented.

## 1.2 Definition of done — twenty-eight criteria

| #   | Criterion                                                                           | Proven by                            |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------ |
| 1   | `dal.changeLanguage` exists; `enforcementSites` names no ghost                      | Registry audit                       |
| 2   | **`capabilities.test.ts` fails CI on a deliberate ghost** — the fifth attempt       | Insert one; CI must go red           |
| 3   | `spokenSeconds` is language-aware; Kinyarwanda is not measured at English rate      | Unit test — §3.3                     |
| 4   | One greeting-length constant, agreeing with the design                              | Grep — §3.4                          |
| 5   | The pronunciation-pollution bug is fixed                                            | No sentence fragments in the lexicon |
| 6   | **No control anywhere creates a language-specific agent**                           | DOM + route audit — L3               |
| 7   | Rules, prices, hours and limits are **not** per-language in the schema              | Schema audit — §4.2                  |
| 8   | Spoken phrases **are** per-language, for all four locales                           | Schema audit                         |
| 9   | Every language carries **two** marks — phone and message                            | Visual audit — §6.1                  |
| 10  | **A fourth label, `not-yet-measured`, exists and is Kinyarwanda-on-calls' default** | Schema + default test — §6.2         |
| 11  | No percentage is shown for Kinyarwanda call understanding before Phase 0            | Copy audit                           |
| 12  | The words "excellent" and "native" appear nowhere in this flow                      | Grep — §6.4                          |
| 13  | No green tick on a language whose voice does not exist                              | Visual audit                         |
| 14  | **There is no detection-sensitivity control of any kind**                           | DOM audit — §5.3                     |
| 15  | "When the caller asks" and "When they press a key" are **rendered and locked**      | DOM audit — §5.2                     |
| 16  | The keypad is offered **only after a misunderstanding**, never in the greeting      | Ladder audit — §5.4                  |
| 17  | Each switching mode states **what it costs you**, in words                          | Copy audit                           |
| 18  | The understanding ladder is **read-only** and says why                              | DOM audit — §10                      |
| 19  | l4 renders **target language first**, source beneath                                | Visual audit — §9.4                  |
| 20  | Every translated string carries an amber dot until confirmed                        | State test                           |
| 21  | String length is stamped in **spoken seconds**, never characters                    | Visual audit                         |
| 22  | **Under thirty calls the number is removed and replaced by a sentence**             | Threshold test — §8.2                |
| 23  | The page states **when measuring began and on how many calls**, even at zero        | Visual audit — SC 12.9               |
| 24  | A mixed-language turn renders with **no switch marker**                             | DOM audit — §7                       |
| 25  | Every switch marker carries its trigger: `asked` · `keypad` · `detected`            | DOM audit                            |
| 26  | Only `detected` is counted as a possible mistake                                    | Metric test                          |
| 27  | Switches following a failure are counted in **their own row**, labelled unanswered  | Visual audit — 12.e                  |
| 28  | l5's **empty state is designed first** and worded as ignorance, not zero            | Review                               |

## 1.3 Not in this phase

The agent's rules, tone and greeting **text** belong to Flow 09 and shipped in `agent.html` — this
surface shows a translated view and **deep-links to the source**. The pronunciation dictionary is Flow
10, shipped in `knowledge.html`; language links to it and does not reimplement it. Voice selection,
availability and cloning are Flow 11 (Prompt 09); **this flow consumes voice availability to draw the
chat-only state and nothing more.** The full conversation inbox is Flow 14 and is not yet designed — so
l6 and l7 show **three-to-five turn excerpts**, reached from evidence rows, and carry **no filters, no
search and no reply affordance**. Escalation is Flow 15: the ladder on l3 ends by handing over and
stops. Analytics is Flow 16. The fleet-wide view of flap-locking is Flow 22, in the admin console.

---

# PART 2 — CONTEXT ABSORPTION

| #   | Read                                                           | Extract                                                                         |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | `Design/language.html` **in full** — 2,081 lines               | l1–l9, every state, the essay §01–§10, the 15 inline `<h3>` notes               |
| 2   | `subiza-flow-atlas/flows/12-flow-language-and-switching.md`    | SC 12.1–12.9, constraints L1–L3 + V4, the runtime ladder in §5                  |
| 3   | `subiza-flow-atlas/flows/24-flow-errors-and-degradation.md` §6 | The eight cross-cutting states                                                  |
| 4   | `packages/domain/src/agent-config.ts` **all of it**            | `spokenSeconds`, `GREETING_MAX_SECONDS`, `ruleText`, `KINYARWANDA_CHECK_POLICY` |
| 5   | `packages/i18n/src/index.ts` + `messages/*.json`               | The four locales already exist. **This is UI i18n, not agent language**         |
| 6   | `prompts/07-agent-design.md`                                   | What l4 is a view _of_. The dual-run policy                                     |
| 7   | `prompts/09-voice-cloning-and-consent.md` §8.10                | The locked-control grammar l3's two rows reuse                                  |
| 8   | `packages/core/src/capabilities.ts` + `grants.ts`              | `changeLanguageSettings`, and the contradiction in §12.3                        |
| 9   | `Design/design-system.html` §22–26                             | The eight states, responsive, a11y, performance                                 |
| 10  | `subiza/node_modules/next/dist/docs/`                          | **Next 16.3.5 ≠ your training data**                                            |

## 2.1 The gate

Before writing one line, produce a file listing:

- the nine screens with their line ranges and their full state lists;
- the four-language × two-channel label matrix, with the sentence that sits under each;
- every string on l4, with its spoken-seconds figure;
- every row on l5, and which of them is a rate and which is a count;
- every place the HTML contradicts the atlas, **and the two places it contradicts itself** (§13).

If you cannot produce this, you have not read enough.

---

# PART 3 — WHAT YOU INHERIT

## 3.1 The ghost — for the fifth time

`packages/core/src/grants.ts` still declares:

```
completeSignupAndActivation: ['dal.createTenant']     ← the DAL exports createAccount
configureAgentPersona:       ['dal.updatePersona']    ← does not exist
editKnowledgeBase:           ['dal.writeKnowledge']   ← does not exist
selectLibraryVoice:          ['dal.selectVoice']      ← does not exist
changeLanguageSettings:      ['dal.changeLanguage']   ← does not exist  ◀ THIS FLOW
```

The DAL exports fifteen functions. `enforcementSites` names twenty-five. And
`capabilities.test.ts` still reads, verbatim:

```
it('has at least one enforcement site for every capability', () => {
  for (const capability of tenantCapabilities) {
    expect(enforcementSites[capability].length).toBeGreaterThan(0)    ← counts strings
  }
})
```

**It counts strings.** A capability whose enforcement site resolves to nothing is a capability enforced
nowhere, and the test that is supposed to catch that cannot, because it never dereferences the name.

## 3.2 Do the systemic fix. It is the fifth request.

Prompts 08 §3.3 and 09 §3.3 both prescribed it. It has not landed. **Phase A2 is not optional and it is
not a nice-to-have.** Harden `capabilities.test.ts` to resolve every `enforcementSites` entry against
the DAL's real export surface:

1. Import the DAL's module namespace.
2. For every capability, for every named site, strip the `dal.` prefix and assert the export exists and
   is a function.
3. Insert a deliberate ghost — `dal.definitelyNotAFunction` — and confirm CI goes red.
4. Remove it. Add `dal.changeLanguage`, and fix the four inherited ghosts while you are in the file.

This is roughly twenty lines. It has now cost five flows, and the cost is not the twenty lines — it is
that **five capabilities in a security matrix are currently decorative and nobody would know.**

## 3.3 `spokenSeconds` is language-blind, and l4 depends on it

`agent-config.ts` ships:

```
WORDS_PER_SECOND = 2.6
spokenSeconds(text) = round((words / WORDS_PER_SECOND) * 10) / 10
```

One constant, four languages. l4 stamps every string with `≈ 4.2s spoken`, and l4's whole warning
mechanism — _"That greeting is long to say. It takes 7.4 seconds."_ — rests on that figure being true.

**It is not true across languages, and the design says so on the same screen:**

> _"Kinyarwanda runs 15–25% longer than English, so check the other one too."_

A word-count model is also the wrong model for agglutinative morphology: Kinyarwanda packs into single
orthographic words what English spreads across several, so a word count **understates** Kinyarwanda
duration twice over — fewer words, each longer.

Make `spokenSeconds(text, locale)` language-aware. Prefer a syllable or character-class estimate over a
word count for `rw` and `sw`. **And state in a comment that the constant is an estimate awaiting
measurement** — the honest position this whole flow takes about everything else applies here too.

## 3.4 The greeting limit disagrees with itself

| Source             | Says                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `agent-config.ts`  | `GREETING_MAX_SECONDS = 6`                                        |
| `language.html` l4 | _"**Under five seconds is the mark.**"_ and flags a 7.4s greeting |

**The design wins — five seconds.** The reasoning is on the screen and it is about the caller, not the
copywriter: _"Callers start talking before it finishes, and the agent loses their opening."_

Change the constant in one place; do not add a second. If Prompt 07's surface renders a warning at 6s
and this one at 5s, an owner will see a greeting called fine on one page and too long on another.

## 3.5 The pronunciation-pollution bug — third prompt running

`packages/domain/src/transitions.ts` still ends `applyCorrection` with an unconditional append of a
pronunciation entry whose `surface` and `spoken` are both the first 80 characters of the correction.
Flagged in Prompt 08, again in Prompt 09, still present.

This flow links to that lexicon from l1 and from l4's footer (V4 makes the dictionary mandatory for
Kinyarwanda). **Linking to a polluted lexicon from the flow whose entire claim is that we speak
Kinyarwanda properly is the worst possible place for it to surface.** Fix it in Phase A.

---

# PART 4 — WHAT IS TRANSLATED, AND WHAT IS ONE CONFIGURATION

**This is the domain centre. Get it wrong and constraint L3 is violated permanently.**

## 4.1 The constraint

> **L3 — separate prompts per language drift apart.** One configuration, translated views. **Never
> separate agents per language.**
>
> _"Most products let you create an agent per language. Three months later they have drifted: one knows
> the new price, the other doesn't."_

## 4.2 The three tiers

```
   ┌─ TIER 1 · ONE CONFIGURATION ────────────────────────────────────┐
   │  rules · prices · hours · limits · tools · escalation · manner   │
   │  tone · answerLength · confidence · afterHours                   │
   │                                                                   │
   │  NOT per-language. Not now, not ever. There is no schema shape    │
   │  that would permit a French price to differ from a Kinyarwanda    │
   │  one, because there is no such thing as a French price.           │
   └───────────────────────────────────────────────────────────────────┘
                                   │
   ┌─ TIER 2 · TRANSLATED VIEWS ───▼─────────────────────────────────┐
   │  the greeting · the can't-help line · the didn't-catch-that line │
   │  and every other SPOKEN phrase                                    │
   │                                                                   │
   │  Per-language, for all four locales. Machine-translated from the  │
   │  primary, then reviewed. Each carries its own review state and    │
   │  its own spoken-seconds figure.                                   │
   └───────────────────────────────────────────────────────────────────┘
                                   │
   ┌─ TIER 3 · PER-LANGUAGE OPERATIONAL STATE ▼──────────────────────┐
   │  enabled · voice-available · call label · message label          │
   │  measuredSince · callCount                                        │
   │                                                                   │
   │  Per-language facts ABOUT a language, not content IN it.          │
   └───────────────────────────────────────────────────────────────────┘
```

**The test for which tier a field belongs to:** if two values could be simultaneously true and
different without one of them being stale, it is Tier 2 or 3. If a difference between them would be a
_bug_ — a price that differs by language, a rule that applies in French and not in Kinyarwanda — it is
Tier 1, and it must be structurally impossible to make it per-language.

## 4.3 `AgentRule.en` / `.rw` is **not** a translation layer — do not extend it

Prompt 07 shipped a rule schema carrying both `en` and `rw`:

```
agentRuleSchema = { id, cat, stage, enf, on, lock, en, rw, mechanism, knowledgeRef }
ruleText(rule, locale: 'en' | 'rw')
KINYARWANDA_CHECK_POLICY = 'dual-run'
```

The obvious move is to widen those two fields to four and call it the translation layer. **Do not.**
Read the comment Prompt 07 left in the file:

> _"Kinyarwanda contradiction-check accuracy is unmeasured. Until a dual test-call week settles it,
> rules authored in Kinyarwanda are stored as written, and the check runs on both the original and an
> English rendering. Disagreement is a finding, never a silent resolve."_

`en`/`rw` exists so the **contradiction detector can run twice** and disagree with itself — it is a
dual-run artefact for an unmeasured checker. It is not a user-facing translation, it is not reviewed on
l4, and it has no review state. `detectContradictions` already depends on exactly two renderings.
Widening it to four would multiply the dual-run into a quad-run, change what "disagreement" means, and
silently alter a safety mechanism in a flow that has nothing to do with it.

**A rule is never shown to a caller.** It shapes behaviour; it is not spoken. So it does not belong in
Tier 2 at all.

## 4.4 The shape to build

`agentConfigSchema` currently holds `greeting: z.string()` and `persona: z.string()` — **single
strings.** There is no per-language phrase storage anywhere in the domain today, which means l4 has
nothing to render. Build it:

| Add              | Shape                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `SPOKEN_PHRASES` | A closed tuple — `greeting`, `cannotHelp`, `didNotCatch`. **Closed, so it cannot grow casually** |
| `PhraseSet`      | `Record<Locale, { text, source: 'authored' \| 'machine', reviewedAt, reviewedBy }>`              |
| `LanguageConfig` | `Record<Locale, { enabled, isPrimary, callLabel, messageLabel, measuredSince, callCount }>`      |
| `SwitchingMode`  | `'follow' \| 'ask-then-stay' \| 'fixed'` — with `fixed` carrying its locale                      |
| `QualityLabel`   | Four rungs — §6.2                                                                                |

Two invariants worth enforcing in the schema rather than the UI:

1. **Exactly one primary.** Turning off the primary is refused _inline_ on l1 — a named state in the
   design, not a toast.
2. **A phrase set is complete for every enabled locale.** Enabling a language with no phrases is what
   produces a silent substitution, which SC 12.8 forbids.

---

# PART 5 — CHOICE FIRST, DETECTION SECOND

## 5.1 The evidence, and why it is not a preference

> Automatic language detection is unreliable for closely related and heavily mixed languages, and **the
> failure is customer-visible.** One vendor documents roughly **4% of calls unexpectedly switching
> language around the eighth turn**; another recommends avoiding auto-detection altogether in favour of
> routing to language-specific agents — **which is the cure that causes the disease the atlas forbids at
> L3.** The design's own estimate: _"across the industry it happens on roughly one call in twenty."_

That last clause is the whole argument for this flow's shape. The obvious fix for unreliable detection
is an agent per language. That fix creates drift. **So the design cannot take the industry's way out,
and must instead make detection's failures visible and bounded.**

The position, and every screen follows from it:

> **The caller decides, in the first three seconds, by one of three means — and detection assists that
> decision rather than replacing it.** An explicit request is absolute. A keypad press is absolute.
> Detection is advisory and only above threshold.
>
> _"Detection is unreliable technology. When it fails, the person who finds out is the customer — which
> is the worst possible place for a failure to appear."_

## 5.2 The two locked rows

l3 opens with a section headed **"Always obeyed"** containing two rows, each badged `not a setting`:

```
   ┌─ Always obeyed ─────────────────────────────────────────────────┐
   │                                                                   │
   │  When the caller asks                          🔒 not a setting   │
   │  "English please", "Mu Cyongereza" — at any point in the call,    │
   │  and nothing overrides it.                                        │
   │                                                                   │
   │  When they press a key                         🔒 not a setting   │
   │  Only after we've misunderstood. We never open the call with      │
   │  "press 1 for English".                                           │
   │                                                                   │
   │  Neither of those can be changed or turned off. The only real     │
   │  choice is what the agent does when the caller hasn't asked.      │
   └───────────────────────────────────────────────────────────────────┘
```

> _"There is no control to switch that off, because **a caller who asks twice and is answered otherwise
> is a caller who has learned they're not talking to a person.** So the first two rows are locked — the
> same grammar as the locked withdrawal control on the voice owner's record."_

**Reuse Prompt 09's locked-control treatment exactly.** Same component, same `aria-disabled` +
`aria-describedby` pattern, same "present and does not press" semantics. This is now a house grammar
appearing in two flows; make it a shared component rather than a second implementation.

## 5.3 There is no detection dial

> _"We could have shipped a detection-sensitivity slider. We didn't, because **nobody knows how often
> Rwandan business callers mix languages** — so there is no threshold we could honestly recommend.
> Shipping a slider would be asking the owner to tune a number neither of us understands."_

Atlas question 12.b is unanswered. **DoD 14 tests for the absence of the control**, because this is the
kind of thing a well-meaning engineer adds back in a later sprint as "giving the user control".

The only control is the three modes, and **each one states its cost in plain words:**

| Mode                                | Behaviour                                                                   | **What it costs you**                                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Follow the customer** _(default)_ | If the caller changes language partway through, the agent changes with them | _"Now and then it switches when the caller didn't want it to. That's why we count those, and why you can see the number."_                         |
| **Ask at the start, then stay**     | It settles the language in the opening turns, then holds it for the rest    | _"Prices, dates and times said mid-call stay in one language. If a caller genuinely wants to change, they have to ask — and asking always works."_ |
| **Always [language]**               | It never changes on its own — only if the caller asks                       | _"An English-only caller has to ask before they're understood."_                                                                                   |

The `What it costs you` line is **required on every mode**. A settings screen that lists options without
their costs is asking someone to choose blind.

## 5.4 The keypad correction — atlas 12.c, answered

The atlas puts DTMF in the greeting as an option: _"caller presses a key (DTMF)"_ as one of three
first-three-seconds signals, and step 3 offers _"the DTMF option"_ as a configurable.

**The design moves it and makes it unconfigurable.** The keypad appears **only after a misunderstanding**
— rung 3 of the read-only ladder — and never in the greeting:

> l3: _"Only after we've misunderstood. **We never open the call with 'press 1 for English'.**"_
>
> Essay §09 on 12.c: _"Is a keypad menu acceptable, or does it feel like the IVR people hate? — Why the
> keypad appears only after a misunderstanding, never in the greeting."_

This is a real behavioural change, not a copy tweak: it removes a branch from the first three seconds
and adds one to the failure ladder. **Rule 1 still holds** — a keypad press, whenever it happens, is
absolute — but it can no longer happen before anything has gone wrong.

---

# PART 6 — WHAT WE ARE ALLOWED TO SAY ABOUT A LANGUAGE

## 6.1 Two labels per language, not one

The atlas asks for honest per-language quality labels and gives three. **Two changes were necessary.**

First: **every language needs two labels.**

> A phone line carries roughly **300–3,400 Hz**; a voice note carries considerably more. The same
> language can be good in messages and hard work on a call — and atlas §8 says thresholds are tuned
> **per channel, not globally**. _"A single badge per language would be a lie."_

So every row carries a **phone mark** and a **message mark**, each lit or struck through, each telling
its own truth. They are never merged, never averaged, and never collapsed into a single "quality"
figure — not on l1, not on l5, not in the schema.

> _"The voice note beats the phone call. This surprises people... So the same customer, saying the same
> thing, is understood better in a message than on the phone."_

## 6.2 The fourth rung — and it is the shipping state

> Second: **a fourth rung is required: `Not yet measured`.** Before Phase 0, **none of the three atlas
> labels is true for Kinyarwanda on a telephone line.** _"This is not an edge case — it is the shipping
> state."_

```
   good  ·  improving  ·  chat-only  ·  NOT YET MEASURED
                                        ▲
                        the DEFAULT for Kinyarwanda-on-calls
```

> _"Showing 'good' for Kinyarwanda before anyone has measured it is **making a promise to a customer who
> isn't ours.**"_

Build all four as a closed union with `not-yet-measured` as the default for a language × channel pair
with no measurement. Do not model it as `null` or as an optional — an absent label renders as absent,
and this label must **render as a statement**.

## 6.3 The label matrix, as it ships

| Language         | On calls             | In messages | The line underneath                                                                                                                                                     |
| ---------------- | -------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ikinyarwanda** | **Not yet measured** | Good        | _"We have never measured Kinyarwanda on a telephone line, because nobody has — that figure isn't published anywhere, for any speech system."_                           |
| **English**      | Good, with a caveat  | Good        | _"Strong for English generally. But Rwandan-accented English is a known weak spot in every speech system, and nobody publishes a figure for it — so we measure yours."_ |
| **Français**     | Good                 | Good        | Telephone-line quality still measured on the tenant's own calls, like every language here.                                                                              |
| **Kiswahili**    | Improving            | Good        | _"Better resourced than Kinyarwanda, not as strong as French."_                                                                                                         |

Kinyarwanda is badged `primary` and carries _"Your main language — the greeting is said in this."_

## 6.4 Forbidden on this screen

| Forbidden                                                            | Why                                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| Any percentage for Kinyarwanda call understanding **before Phase 0** | There is no such measurement. §6.5                        |
| The words **"excellent"** or **"native"**                            | Unfalsifiable, and both overclaim                         |
| A **green tick** on a language whose voice does not exist            | The chat-only state must read as a limitation, not a pass |
| Merging the two channel marks into one                               | §6.1 — it would be a lie                                  |

Add these to the claims registry Prompt 02 established, so the grep runs in CI rather than in review.

## 6.5 The gate, and G13 turned inward

> **Atlas 12.a blocks everything in this flow, and it is unanswered.** The real Kinyarwanda
> understanding rate on 8 kHz telephone audio is unknown. The project documentation is blunt: **no
> reliable published WER figure exists for any candidate model on telephone audio, and _"that absence is
> itself the finding."_** The only quantified expectation is a hedged range — narrowband degradation
> informally cited at **1.5–3× relative** — and the only hard Kinyarwanda number in the corpus is a
> cautionary one from a deliberately undersized fine-tune. **Phase 0 exists to produce one honest
> number.**

The design carries that three ways rather than working around it:

1. Kinyarwanda's call state **defaults to "Not yet measured"**, and that is the screen's shipping state.
2. **l5 ships with its empty state designed first**, worded as ignorance rather than as zero.
3. l2 says it in one sentence a shop owner can read: **nobody has published this number for any speech
   system, including ours.**

> That is **G13 — say "I don't know" rather than guess — applied to the product's own capability rather
> than to a caller's question.**

That sentence is the most important one in this prompt. Every global rule in the atlas about honesty
was written about what the _agent_ says to a _caller_. This flow is where the product turns the same
rule on itself, in front of the person paying for it. When you are tempted to soften a label, or to show
a provisional figure "just so the page isn't empty", this is the paragraph to re-read.

---

# PART 7 — CODE-SWITCHING IS NOT AN EVENT

## 7.1 The normal case

> _"Ndashaka kubona **appointment** kuwa gatandatu."_ — one sentence in two languages, and **in Kigali it
> is the normal case rather than the exception.**

The atlas is explicit: **this is not a language switch and must not be treated as one.** The agent
identifies the dominant language, understands the whole utterance, and answers in the dominant language.

## 7.2 The rendering carries the whole argument

```
   JB  Caller   [RW + EN]  Clear   0:09
       Ndashaka kubona appointment kuwa gatandatu.
                       ‾‾‾‾‾‾‾‾‾‾‾  ← dotted underline on the foreign span

   ↑ TWO language chips on ONE turn
   ↑ NO switch marker above it

   ─────────────────────────────────────────────────────────────

   ── Kinyarwanda → English · turn 4 · [asked] ──   ← a marker, for a
   JB  Caller   [EN]   0:22                            SUSTAINED change,
       Sorry, can we do this in English?               carrying its trigger
```

> _"**Drawing normal speech as an event tells somebody the way they talk is a mistake.**"_

A switch marker is reserved for a **sustained** change, and it carries the trigger that caused it:
`asked` · `keypad` · `detected`. **Only the third can be a mistake, and only the third is counted as
one** (DoD 26).

## 7.3 What this design cannot promise — say so

> SC 12.2 asks for >95% of code-switched utterances not triggering a full switch. **Handling
> code-switching is stage K5 of the Kinyarwanda programme, scheduled for Phase 3 — it is roadmap, not
> shipped.** The screens render the correct behaviour and the evidence row for it ships in an unmeasured
> state. **The design can show what right looks like; it cannot make the model do it.**

So l5's row _"Mixed sentences answered without switching"_ is a **count of observed behaviour**, not a
claim of capability. Do not render it as a pass/fail against 95%. Do not put a target beside it. It says
what happened on the tenant's own calls, and that is all it says.

---

# PART 8 — THE NUMBER THAT MATTERS, AND THE NUMBER WE REFUSE TO SHOW

## 8.1 The headline

Atlas §12 names it: **`language.switch` with `trigger = detection` and no preceding caller switch.**
That is the spurious-switch rate, and it is the single most important quality figure in this flow.

It gets the headline on l5, **in words rather than jargon**:

```
   ┌──────────────────────────────────────────────────────────────┐
   │  Switches the caller didn't ask for                           │
   │                                                                │
   │       0                                                        │
   │                                                                │
   │  Out of 41 calls since 3 March. This is the number that        │
   │  matters most on this page: when the agent changes language    │
   │  and the caller didn't want it, the caller hears it — and      │
   │  that's the worst place for a mistake to show up.              │
   │                                                                │
   │  Target: under 1% of calls                                     │
   └──────────────────────────────────────────────────────────────┘
```

> _"**The target is printed on screen, because a target you can't see isn't one.**"_

## 8.2 The refusal — and the contradiction to resolve

> _"**Below thirty calls the meter is removed and replaced with a sentence** — not greyed out and not
> shown at low confidence. A percentage computed from six calls is noise wearing the costume of a fact,
> and a shop owner who reads 83% on a screen will believe it."_

The thin state, verbatim:

> **"Not enough calls yet to say anything."**
> _"We have 6 calls in Kinyarwanda and 1 in English. Under thirty, any rate we showed you would be
> noise — so we show you this instead of a number we made up."_

Three build requirements:

1. **Removed, not disabled.** The meter element is absent from the DOM below threshold. A greyed meter
   still communicates a shape; an absent one communicates nothing, which is correct.
2. **The denominator always shows.** _"Measuring since 3 March · 41 calls"_ renders even at zero,
   because **"a number with no denominator is not evidence."** This is how SC 12.9 is satisfied from day
   one.
3. **Per-language, not just overall.** l5 shows _"Français — 3 calls"_ where the other rows show
   percentages, with: _"French has had three calls. We don't compute a percentage from three — that
   would be playing with numbers."_

> ### ⚠ The design contradicts itself. Resolve it, do not average it.
>
> | Where  | Says                                                                                       |
> | ------ | ------------------------------------------------------------------------------------------ |
> | **l1** | _"We'll show you the number from your own calls as soon as we have **twenty** of them."_   |
> | **l5** | _"Under **thirty**, any rate we showed you would be noise."_ — and essay §05 argues for 30 |
>
> **Take thirty.** Essay §05 reasons about it explicitly; l1's "twenty" appears once, in passing, in a
> body sentence. Put it in **one exported constant** — `MIN_CALLS_FOR_RATE = 30` — and have l1's
> sentence interpolate it. Two thresholds in two places is how an owner ends up being told at 22 calls
> that we will show her a number, and then at 22 calls being shown a sentence instead.

## 8.3 Two things counted separately, on purpose

**Times and numbers get their own row**, and this is not fussiness:

> _"**'Saturday saa tatu'** — the day in English, the hour in Kinyarwanda — is how people actually speak
> here. **When the agent gets that wrong, a booking goes in wrong, and an overall percentage would hide
> it.** Right on 38 of 41."_

An aggregate understanding rate averages a misheard greeting with a misheard appointment time. Only one
of those costs the business money. Keep it separate in the metric, in the schema and on the screen.

**Switches following a failure get their own row, labelled as unanswered:**

> _"Switched right after we missed something — **We don't yet know whether that's a preference or a
> repair. We count it separately until we do.**"_

Atlas question 12.e asks exactly this and is open. **The screen does not answer it.** Do not classify
these rows into either bucket; do not fold them into the spurious-switch headline. A row that says "we
count this and we don't know what it means" is a legitimate thing to ship, and it is the second place
this flow applies G13 to itself.

## 8.4 The full row set on l5

| Row                                              | Kind      | Note                                                               |
| ------------------------------------------------ | --------- | ------------------------------------------------------------------ |
| **Switches the caller didn't ask for**           | Headline  | Target under 1% printed beside it                                  |
| How well it hears each language, **on calls**    | Rate/lang | `88%` · `94%` · `3 calls` — never a rate under threshold           |
| How well it hears each language, **in messages** | Rate/lang | `96%` · `98%` — _"The difference is the sound, not the language."_ |
| Mixed sentences answered without switching       | Count     | No target — §7.3                                                   |
| Switches the caller asked for                    | Count     | _"Always obeyed, and never switchable off"_                        |
| Calls locked to one language                     | Count     | _"After three proposed switches the agent stops trying"_           |
| Switched right after we missed something         | Count     | **Labelled unanswered** — §8.3                                     |
| Times and numbers                                | Count     | `Right on 38 of 41` — §8.3                                         |

---

# PART 9 — THE NINE SCREENS

All nine live in `apps/studio`, inside the console shell, under a new `/agent/languages` segment.
Create `apps/studio/src/features/language/`.

| ID     | Screen                   | States                                                                                                                                                                  |
| ------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **l1** | The board                | four configured · one chat-only · one unmeasured · primary marked · **turning off the primary refused inline** · unsaved · saving · queued offline · suggestion present |
| **l2** | What the label means     | good · improving · chat-only · unmeasured — **one sheet per state**, reached from the badge                                                                             |
| **l3** | How it switches          | follow · ask-then-stay · fixed · **the two locked rows** · the ladder, read-only · keypad shown                                                                         |
| **l4** | What it says             | untranslated · machine-translated unreviewed · confirmed · edited · **too long to say**                                                                                 |
| **l5** | Is it understanding them | no calls yet · **too thin to say** · measured · a language with too few calls · falling                                                                                 |
| **l6** | A call worth looking at  | mixed sentence, no switch · a switch the caller asked for · **a switch nobody asked for**                                                                               |
| **l7** | Locked                   | locked on this call · recurring for this tenant · resolved by changing mode                                                                                             |
| **l8** | A language not turned on | suggested with evidence · acted · **dismissed for the month**                                                                                                           |
| **l9** | Messages and voice notes | measured · the three fixed behaviours                                                                                                                                   |

## 9.1 l1 — the board

Header: _"Each language has two states: on the phone, and in messages. **They are not the same** — a
call carries much less sound than a voice note, and we tell you which is which."_

Each row: the language in its own name (`Ikinyarwanda`, `English`, `Français`, `Kiswahili`), the
`primary` badge on one, **two channel marks**, and the explanatory line from §6.3.

Below the rows, three navigation cards carrying live status rather than labels:

| Card                                       | Status line                          |
| ------------------------------------------ | ------------------------------------ |
| **How it decides which language to speak** | _Right now: it follows the customer_ |
| **What it says in each language**          | _3 lines not reviewed yet_           |
| **Is it understanding them?**              | _Measuring since 3 March · 41 calls_ |

The save bar carries a sentence the owner needs and would not guess:

> **"Changes apply to the next call. A call happening now is not affected."**

`turning off the primary refused inline` is a named state. **Refuse it where the control is** — not in a
toast, not in a modal. Every other setting on this page saves optimistically; this one cannot, because
an agent with no primary language has no greeting.

## 9.2 l2 — one sheet per label

Reached by tapping a badge. Four sheets, one per rung. The Kinyarwanda-on-calls sheet, in full:

```
   Kinyarwanda, on the phone
   Here's what that label means, and what we don't yet know.

   ┌──────────────────────────────────────────────────────┐
   │  Not yet measured · Kinyarwanda on the phone          │
   │                                                        │
   │  what it means      We don't yet know how well it      │
   │                     works on a telephone line.         │
   │  measured when      Not yet                            │
   │  on how many calls  None                               │
   │  if it's wrong      The agent doesn't guess. It tries   │
   │                     twice, then fetches you.           │
   └──────────────────────────────────────────────────────┘

   A phone call carries about half the sound a voice note does. No
   speech system anywhere publishes how it performs on Kinyarwanda
   over a telephone line. Not one. So we don't claim it until we've
   measured it on your own calls.
```

**`if it's wrong` is the row that makes the sheet useful.** A label that says "we don't know" and stops
there is alarming. A label that says "we don't know, and here is what happens when we're wrong" is
honest _and_ reassuring, and it is the same ladder l3 renders.

## 9.3 l3 — how it decides

§5.2 (the two locked rows), §5.3 (the three modes with their costs), §10 (the read-only ladder). Header:
_"The caller decides, in the first three seconds. What follows is about what happens after that."_

## 9.4 l4 — the translated view

Header: _"These were machine-translated from your Kinyarwanda. **A machine doesn't know how your
business talks** — so each line waits for you to say it sounds right."_
Sub-header: _"Translated from Kinyarwanda — your primary language"_

> ### The inversion — do not "fix" it
>
> **Each line shows the target language first, with the Kinyarwanda source quiet beneath it.**
>
> _"This deliberately inverts the transcript component, where the original always leads and the
> translation sits under it; **there the record is what was actually said, here the draft is what needs
> approving.**"_
>
> A reviewer coming from `conversations.html` will read this as a bug. It is not. Put a comment in the
> component saying so, or someone will align them in six months and quietly break the review task.

Each string row:

```
   The greeting                                      ≈ 4.2s spoken
   ┌──────────────────────────────────────────────────────────────┐
   │  Hello, this is Salon Ubwiza. I'm an assistant, not a person.  │   ← TARGET, leads
   │  How can I help?                                               │
   │                                                                 │
   │  Muraho, ni Salon Ubwiza. Ndi umufasha w'ikoranabuhanga.       │   ← source, quiet
   │  Nabafasha nte?                                                 │
   │                                                                 │
   │  [ ▶ Hear it ]  [ Yes, that's how we'd say it ]  [ Change it ] │
   │  ● machine-translated                                           │
   └──────────────────────────────────────────────────────────────────┘
```

Three strings ship: **the greeting** (≈4.2s), **when it can't help** (≈2.8s), **when it didn't catch
that** (≈2.1s). The amber dot persists until a person confirms. _"A machine doesn't know your business
says 'murakaza neza' rather than 'mwaramutse'."_

**The too-long state**, which is why §3.3 and §3.4 are Phase A:

> **"That greeting is long to say."** _"It takes 7.4 seconds. Callers start talking before it finishes,
> and the agent loses their opening. **Under five seconds is the mark.** Kinyarwanda runs 15–25% longer
> than English, so check the other one too."_

The footer is L3, stated to the person who would otherwise ask for a French agent:

> **"This is one configuration, seen in another language."** _"This is not a second agent. The rules,
> the prices and the limits are the same in every language — only the wording differs here. To change
> what it says in Kinyarwanda, **edit the agent's behaviour.**"_ ← deep-links to Flow 09

## 9.5 l5 — the evidence page

§8 in full. Header: _"**You can't listen to every call, and you can't judge Kinyarwanda recognition by
ear.** That's what this page is for."_

That sentence is the page's justification and should not be cut. The owner is not being given a
dashboard because dashboards are nice; she is being given one because the thing being measured is
**inaudible to her.** She cannot evaluate Kinyarwanda ASR by listening, and neither can we.

**Design the empty state first** (DoD 28). It is the state this page ships in.

## 9.6 l6 — a call worth looking at

Three excerpts, each three-to-five turns, reached from an evidence row. Header: _"This is how people
speak in Kigali. **It isn't a mistake, and it isn't a reason to change the whole conversation.**"_

Each excerpt carries a header line: `Saturday 11:04 · +250 78• ••• 214 · 47 seconds` — **the number is
masked**, as everywhere else in the product.

| Excerpt                           | What it teaches                                               |
| --------------------------------- | ------------------------------------------------------------- |
| **Mixed sentence, no switch**     | _"No language switch happened here."_ §7.2                    |
| **A switch the caller asked for** | Marker: `Kinyarwanda → English · turn 4 · asked`              |
| **A switch nobody asked for**     | Marker: `... · detected` + the failure explanation, and a fix |

The third carries the remedy inline:

> **"The caller never changed language."** _"The agent changed it, and nothing the caller said justified
> that. This is the failure mode: around one call in twenty in the industry, and the caller hears every
> one. If it happens often, move the switching mode to 'Ask at the start, then stay'."_
> → **[ Change the switching mode ]**

**No filters, no search, no reply affordance** — Flow 14 is not designed yet (§1.3).

## 9.7 l7 — locked

Header: _"On one call it proposed changing language three times. After the third it stops — **one
language that might be wrong beats a conversation that keeps moving.**"_

```
   Switch 1 · turn 3   [detected]
   Switch 2 · turn 5   [detected]
   ────────────────────────────────
   Locked to Kinyarwanda · turn 7
   ────────────────────────────────
   S  Agent  RW  1:04
      Reka mbahamagarire Aline — arabafasha neza kurusha.
```

**Read the timeline carefully before building it.** Two switches _happened_; the **third proposal** was
refused, and the refusal is the lock. So the timeline shows two switch markers and then a lock — **it
never shows a third switch marker**, because the third switch never occurred. An implementation that
renders three markers has misread the mechanism.

The recurring state, and its single remedy:

> **"This happened twice this month."** _"Two calls out of 41. **When this happens often it means
> detection isn't working well on your customers — not that your agent is broken.** There's one fix:
> move the switching mode to 'Ask at the start, then stay'."_

And the closing line, which is the point of the whole screen:

> **"The caller never learned anything had stopped. They heard one language, then a person."**

## 9.8 l8 — a language not turned on

Header: _"Five callers spoke Swahili. Not many. **But five people called your business and couldn't be
helped in their own language.**"_ · `This month · 5 calls out of 41`

Three quoted utterances **with their outcomes** — the evidence, not a pitch:

| What they said                   | What happened                                                      |
| -------------------------------- | ------------------------------------------------------------------ |
| _"Habari, mnafungua saa ngapi?"_ | Monday 09:12 · the agent apologised in Kinyarwanda and fetched you |
| _"Bei ya kusuka ni ngapi?"_      | Wednesday 14:40 · **the caller hung up**                           |
| _"Naweza kuja leo?"_             | Saturday 10:03 · the agent fetched you                             |

Then _"What turning on Swahili would mean"_, carrying **the same honest label as everywhere else**:
_"In messages: it works well. On calls: still improving — better resourced than Kinyarwanda, not as
strong as French. You'd get the same honest label as every other language, and it moves as we measure."_

Controls: **Turn on Swahili** · **Not now** → _"If you don't, we won't ask again this month. **We'll
only mention it if the number doubles.**"_

> _"We don't say 'turn on Swahili'. We say five people called and spoke Swahili, and we show what they
> said and what happened. The decision is yours... **A suggestion built from your own traffic is advice;
> the same suggestion repeated is a sales pitch.**"_

Build the dismissal as a real, persisted, month-scoped suppression with a doubling trigger. A "dismiss"
that re-fires next week is the sales pitch.

## 9.9 l9 — messages and voice notes

Header: _"Messages are easier than calls, and there's time to be careful. That's why the quality labels
differ."_

Three **fixed behaviours**, badged as such — not settings:

| Behaviour                                                       | Why                                                                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A voice note is the best sound we ever get**                  | _"It carries about twice the sound a phone call does. A Kinyarwanda customer is understood better in a voice note than on the phone — which is the opposite of what people expect."_ |
| **It replies in the language of their last message**            | _"No detection guesswork. If they change, it changes."_                                                                                                                              |
| **To a voice note, it replies with both text and a voice note** | _"In the same language. **People use voice notes for a reason, and we don't answer them in a way they didn't choose.**"_ · `fixed`                                                   |

Then the message-channel rates — `Ikinyarwanda 96%` · `English 98%` — with the comparison stated:

> _"Compare with 88% and 94% on calls. **The difference is the sound, not the language.**"_

That line is the payoff of §6.1. It is also the sentence that stops an owner concluding her customers
speak badly.

---

# PART 10 — THE LADDER

Four rungs on l3, **read-only**, badged `fixed`:

```
   1  It asks once
      "Mbabarira, ntabwo numvise neza. Wabisubiramo?"

   2  It tries your other language, once
      Once only. Changing language on someone with a strong accent
      makes it worse, not better.

   3  It offers the keypad
      [1] Kinyarwanda   [2] English

   4  It fetches you
      Never a third try in the same language. That's where callers
      hang up.                                            🔒 fixed

   "This ladder isn't configurable. It's what stops a call being
    lost to a language problem."
```

Three things to get right:

1. **Rung 2's reason is a correction of an intuition**, and it must stay on screen: trying another
   language on a heavily accented speaker makes it _worse_. Atlas §9 agrees — a heavy accent is _"an
   understanding failure, not a language failure."_ An engineer trimming copy will cut this line first;
   it is the one that stops the ladder looking arbitrary.
2. **Rung 3 is the only place the keypad appears** (§5.4).
3. **Rung 4 satisfies SC 12.5** — never a third attempt in the same language. The ladder ends by handing
   over to Flow 15 and **stops there**; escalation is not designed in this flow.

---

# PART 11 — DOMAIN, AUTH, EVENTS

## 11.1 Domain

New file `packages/domain/src/language.ts`:

| Export                  | Carries                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `AGENT_LOCALES`         | `['rw','en','fr','sw']` — **re-export or align with `packages/i18n`, never redeclare** |
| `QUALITY_LABELS`        | `['good','improving','chat-only','not-yet-measured']` — §6.2                           |
| `CHANNELS`              | `['call','message']` — the two marks are structural, not presentational                |
| `SWITCHING_MODES`       | `['follow','ask-then-stay','fixed']`                                                   |
| `SWITCH_TRIGGERS`       | `['asked','keypad','detected']` — only `detected` is countable as a mistake            |
| `SPOKEN_PHRASES`        | `['greeting','cannotHelp','didNotCatch']` — closed                                     |
| `MIN_CALLS_FOR_RATE`    | `30` — **one constant, used by l1's sentence and l5's threshold** (§8.2)               |
| `FLAP_LOCK_THRESHOLD`   | `3` proposals → lock (§9.7)                                                            |
| `languageConfigSchema`  | Tier 3 state per locale                                                                |
| `phraseSetSchema`       | Tier 2 content per locale, with review state                                           |
| `languageMetricsSchema` | The l5 row set (§8.4), rates and counts kept distinct                                  |

Add `LanguageConfig` to `DOMAIN_DOCUMENTS`.

**`packages/i18n` is the interface's languages. `language.ts` is the agent's.** They happen to be the
same four today. Do not merge them: the UI could ship a fifth interface locale without the agent
speaking it, and the agent could gain a language the console is not translated into.

## 11.2 Auth

- `dal.changeLanguage(ctx: TenantContext)` — the ghost, made real (§3.1).
- Capability: `changeLanguageSettings` already exists and is graded. Leave the grades; see §11.3.
- **l5 is evidence, not settings.** Gate it on `seeAnalytics`, not on `changeLanguageSettings`, so that
  a role who may look but not touch can reach it. That split is what makes a partial `denied` state
  meaningful rather than a whole-surface block.

## 11.3 The permission contradiction — the design essay is wrong here

> **Design essay §07:** _"Permission denied is **a manager** who may configure the agent but not the
> languages, reached from Flow 18."_
>
> **`packages/core/src/capabilities.ts`:** `manager.changeLanguageSettings: FULL`
>
> **Atlas Flow 01 §permissions table, line 212:** `| Change language settings | ✅ | ✅ | — | — |`
> — owner ✅, **manager ✅**, agent —, viewer —.

**The capability matrix wins.** It was locked in Prompt 01, it derives from atlas Flow 01, and the atlas
and the code agree with each other. The essay's example is a slip.

But the `denied` state still needs a real occupant, and it has two: **Agent (A7)** and **Viewer**, both
`NONE`. So render it correctly:

| Role        | l1 · l3 · l4 (settings)        | l5 (evidence)                 |
| ----------- | ------------------------------ | ----------------------------- |
| Owner       | Full                           | Full                          |
| **Manager** | **Full** — not the denied case | Full                          |
| Agent       | `denied`, naming who can       | `seeAnalytics: scoped('own')` |
| Viewer      | `denied`                       | Per `seeAnalytics`            |

`DeniedState` already takes `requiredCapability` and `whoCan` — use them, so the screen says _who_ to
ask rather than just refusing.

## 11.4 Events

| Event                               | Properties                      |
| ----------------------------------- | ------------------------------- |
| `language.conversation_started`     | primary, channel                |
| `language.set`                      | language, method, confidence    |
| `language.switch`                   | from, to, turn, **trigger**     |
| `language.codeswitch_detected`      | dominant, secondary             |
| `language.flap_locked`              | switch count, locked language   |
| `language.detection_low_confidence` | turn, score                     |
| `language.understanding_failed`     | language, attempt, action taken |
| `language.unsupported_requested`    | language, count per tenant      |

> **`language.switch` with `trigger = detection` and no preceding caller switch is the spurious-switch
> metric.** It is the single most important quality number in this flow and belongs on the AI Operations
> dashboard (Flow 22).

`trigger` is a required, closed enum. If it were optional, an untriggered switch would default into
ambiguity, and the one number that matters would silently absorb switches nobody classified.

---

# PART 12 — RECONCILING THE ATLAS AND THE HTML

The design is newer and wins. Every divergence:

| #   | Atlas says                                                     | HTML says                                                               | Ruling                          |
| --- | -------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| 1   | Three quality labels                                           | **Four** — `not yet measured` added                                     | **HTML** — §6.2                 |
| 2   | One label per language                                         | **Two** — phone and message                                             | **HTML** — §6.1                 |
| 3   | DTMF is a first-three-seconds option, configurable             | Keypad appears **only after a misunderstanding**, never in the greeting | **HTML** — §5.4                 |
| 4   | Five screens in §7                                             | **Nine**                                                                | **HTML**                        |
| 5   | Detection threshold implied as tunable                         | **No detection control of any kind**                                    | **HTML** — §5.3                 |
| 6   | SC 12.2 stated as achievable                                   | Model capability is **Phase 3 roadmap**; the row ships unmeasured       | **HTML** — §7.3                 |
| 7   | Per-language understanding shown as a rate                     | **No rate under 30 calls** — a sentence instead                         | **HTML** — §8.2                 |
| 8   | 12.e (switch after failure) left open                          | Counted in **its own row, labelled unanswered**                         | **HTML** — §8.3                 |
| 9   | _(design internal)_ l1 says 20 calls                           | l5 and essay §05 say **30**                                             | **Thirty**, one constant — §8.2 |
| 10  | _(design internal)_ essay names **manager** as the denied role | Matrix and atlas Flow 01 both grant manager `FULL`                      | **The matrix** — §11.3          |
| 11  | `GREETING_MAX_SECONDS = 6` in built code                       | _"Under five seconds is the mark"_                                      | **Five** — §3.4                 |

Where the atlas is **not** superseded it still binds: SC 12.1–12.9, constraints L1–L3 and V4, the
runtime ladder in §5.5, and the platform prohibitions F1–F14.

---

# PART 13 — STATES, RESPONSIVE, i18n, PERFORMANCE

## 13.1 The eight states, as this flow uses them

| State         | On this flow                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------- |
| `empty`       | **The honest resting state of l5, and it is designed first, not last**                        |
| `partial`     | **The state this whole flow lives in** — metrics for two languages, too few calls for a third |
| `loading`     | The label-preserving spinner                                                                  |
| `offline`     | **Queues a setting change and says so in the save bar** rather than losing it                 |
| `denied`      | Agent or Viewer on the settings screens — §11.3                                               |
| `notFound`    | **Does not arise** — a settings surface with no addressable records                           |
| `rateLimited` | **Does not arise** — no user-triggered fetches                                                |
| `error`       | A failed save, which **must never leave the owner believing a change landed**                 |

Two of these deserve care. `partial` is not an edge case here — it is the normal condition, so build the
partial rendering as the default path and treat "all four languages measured" as the rare case. And the
failed save must reconcile the optimistic UI: the save bar is the one place in this flow where getting
it wrong means an owner walks away believing her agent will behave differently than it will.

## 13.2 Responsive

360px base. The two-channel marks are the pressure point: two badges plus a language name plus an
explanatory line, in Kinyarwanda, at 360px. Stack the marks under the name rather than shrinking them —
a struck-through mark that is too small to read as struck-through is worse than no mark.

l5's row set is a data table; it goes in an `overflow-x: auto` container at narrow widths, with the
language name as a sticky first column. l6 and l7's transcript excerpts reuse the existing `Transcript`
component and its established narrow behaviour.

## 13.3 i18n

This flow is **doubly translated** and it is easy to confuse the two layers:

- The **console** is in the owner's language (`packages/i18n`).
- The **content** on l4 is in the _agent's_ target language, and must render correctly regardless of the
  console's language. An owner reading the console in Kinyarwanda reviews the English greeting.

So l4 needs explicit `lang` attributes per string block — the target string is `lang="en"` inside a page
that may be `lang="rw"`. Without it, a screen reader reads English with Kinyarwanda phonetics, and the
review task becomes impossible for exactly the users who most need it.

Kinyarwanda runs 15–25% longer. The mode cards on l3, each carrying a `What it costs you` sentence, are
the worst-case block on this surface at 360px. Test in `rw` first (G5).

## 13.4 Performance

- No chart library. l5's rates are text and hand-written SVG, per the standing law.
- The audio previews on l4 (`Hear it`) are `preload="none"`.
- l6 and l7 are excerpts, not conversations — bounded at five turns, so there is no virtualisation
  question and there must not be an infinite scroll.
- The whole surface is server-rendered. **The only interactive island is the mode selection and the
  phrase review**, both of which work as plain form POSTs with JS disabled (G3).

---

# PART 14 — RESEARCH MANDATES

| §    | Question                                                                                                        | Blocks                                          |
| ---- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 14.1 | **Atlas 12.a** — the real Kinyarwanda understanding rate on 8 kHz telephone audio. Phase 0 exists to produce it | Everything. Why the fourth label exists         |
| 14.2 | **Atlas 12.b** — how heavily Rwandan business calls actually code-switch                                        | Why there is no threshold control (§5.3)        |
| 14.3 | A defensible `spokenSeconds` estimator for Kinyarwanda and Swahili morphology                                   | l4's stamp and its too-long warning (§3.3)      |
| 14.4 | Machine-translation quality **rw → fr/sw** specifically, not just rw → en                                       | Whether l4's drafts are usable for fr and sw    |
| 14.5 | Whether per-utterance dominant-language detection is available from the chosen ASR at all                       | §7 — the rendering assumes the model reports it |
| 14.6 | Rwandan-accented English WER — the design asserts it is a known weak spot with no published figure              | l1's English caveat line                        |

**14.1 is the gate.** Do not let its absence stop the build — every screen here is designed to be
correct under any answer, which is the point of the fourth label. **And do not let it tempt anyone into
assuming one.**

---

# PART 15 — VERIFICATION & GATES

| ID     | Gate                                             | Method                                                                          |
| ------ | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| **G1** | No rate is ever rendered below 30 calls          | Seed 29 calls, assert the meter is absent from the DOM; seed 30, assert present |
| **G2** | No route or control creates a per-language agent | Route + DOM audit                                                               |
| **G3** | l1, l3, l4 work with JavaScript disabled         | Form POST test                                                                  |
| **G4** | The two "always obeyed" rows cannot be toggled   | DOM audit + POST a forged toggle; it must be refused server-side                |
| **G5** | Kinyarwanda at 360px                             | Visual test of l3's mode cards and l1's two-mark rows                           |
| **G6** | Adversarial                                      | Below                                                                           |

## 15.1 The adversarial pass

The reviewer is **never an author**. Each must fail safely:

1. Create a French-specific agent, by URL, by form replay, by any route.
2. Turn off "when the caller asks" by POSTing a forged setting.
3. Make l5 render a percentage from six calls.
4. Turn off the primary language.
5. Enable a language with no phrase set and no voice, and see whether a caller could reach it.
6. Find a detection-sensitivity control anywhere in the flow.
7. Find the word "excellent" or "native" in any string in this flow.
8. Find a Kinyarwanda call-understanding percentage rendered before a measurement exists.
9. Make a mixed-language turn render a switch marker.
10. Make l7 render three switch markers before the lock.
11. Dismiss the Swahili suggestion and see whether it returns inside the month.
12. Reach l1's write controls as an Agent (A7).

---

# PART 16 — DELIVERABLES

```
packages/domain/src/
  language.ts ..................... new — §11.1
  language.test.ts ................ thresholds, label defaults, tier boundaries
  agent-config.ts ................. spokenSeconds(text, locale); GREETING_MAX_SECONDS → 5
  transitions.ts .................. the pronunciation-pollution fix
packages/core/src/
  grants.ts ....................... dal.changeLanguage + the four inherited ghosts
  capabilities.test.ts ............ THE EXPORT-SURFACE CHECK. Fifth request. §3.2
  claims.ts ....................... "excellent", "native", pre-Phase-0 rw rates
packages/auth-tenant/src/
  dal.ts .......................... changeLanguage
packages/ui/src/product/
  LockedRow.tsx ................... shared with Prompt 09's revoke control — §5.2
  ChannelMarks.tsx ................ the two-mark pair — §6.1
  QualityBadge.tsx ................ four rungs, opens l2's sheet
  TranslatedString.tsx ............ target-first, amber until confirmed — §9.4
  EvidenceRow.tsx ................. rate vs count, with the threshold behaviour
apps/studio/src/features/language/
  LanguageSurface.tsx ............. l1
  labels/ · switching/ · phrases/ · evidence/ ... l2 … l9
apps/studio/src/app/(console)/agent/languages/
  ................................. the route segment, with sub-segments per pane
```

## 16.1 What Prompt 11 covers

**Prompt 11 — Test and go-live** (`Design/golive.html`, atlas Flow 13, programme 1.10): the pause
completes before a single question is asked; **two personas run three times because best-of-one
flatters**; and a readiness check that reports **observed behaviour, not field-presence**. It inherits
this flow's per-language quality labels — a readiness check that says a language is ready when its label
says `not yet measured` would be exactly the field-presence lie that flow exists to refuse.

**One prompt, one flow. Nothing else starts until the word _next_.**

---

# PART 17 — APPENDIX

## A — The translation boundary

```
   ONE CONFIGURATION                    TRANSLATED VIEWS
   ─────────────────                    ────────────────
   rules          ✗ never               greeting           ✓ per locale
   prices         ✗ never               can't-help line    ✓ per locale
   hours          ✗ never               didn't-catch line  ✓ per locale
   limits         ✗ never
   tools          ✗ never               each carries: text · source · reviewedAt
   escalation     ✗ never               each stamped in SPOKEN SECONDS
   tone/manner    ✗ never               each amber until a person confirms

   ┌────────────────────────────────────────────────────────────┐
   │  THE TEST                                                   │
   │  Could two values be simultaneously true and different,     │
   │  without one being stale?                                   │
   │     yes → translated view                                   │
   │     no  → one configuration, and make per-language          │
   │           STRUCTURALLY IMPOSSIBLE                           │
   └────────────────────────────────────────────────────────────┘

   AgentRule.en / .rw is NOT this boundary. It is the dual-run
   artefact for an unmeasured contradiction checker (Prompt 07).
   A rule is never spoken to a caller. Do not widen it to four.
```

## B — Why four labels and not three

```
              ON CALLS              IN MESSAGES
              ────────              ───────────
   rw    ▓ not yet measured    ●  good
   en    ● good (caveat)       ●  good
   fr    ● good                ●  good
   sw    ◐ improving           ●  good

   The atlas gives: good · improving · chat-only.
   Before Phase 0, NONE of those three is true for rw on a phone line.

   A missing measurement is not "improving".
   It is not "good".
   It is not "chat-only" — messages work fine.

   So the fourth rung exists because the other three would each be
   a specific false statement. And it is the SHIPPING STATE, not an
   edge case:

   "Showing 'good' for Kinyarwanda before anyone has measured it is
    making a promise to a customer who isn't ours."

   G13 — say "I don't know" rather than guess — turned on the
   product's own capability, in front of the person paying for it.
```

## C — The one number, and the floor beneath it

```
   language.switch  WHERE trigger = 'detected'
                    AND   no preceding caller switch
                                │
                                ▼
                "Switches the caller didn't ask for"
                     target: under 1% of calls
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
         ≥ 30 calls                          < 30 calls
              │                                   │
              ▼                                   ▼
      show the number                    REMOVE THE METER
      show the denominator               show a sentence
      show the target                    show the denominator anyway

                                "We have 6 calls in Kinyarwanda
                                 and 1 in English. Under thirty,
                                 any rate we showed you would be
                                 noise — so we show you this
                                 instead of a number we made up."

   Not greyed. Not shown with a confidence caveat. REMOVED.
   A greyed meter still communicates a shape.
```

## D — The switch that is not a switch

```
   ONE TURN, TWO LANGUAGES — the normal Kigali case
   ┌──────────────────────────────────────────────────────┐
   │  JB  Caller  [RW][EN]  Clear  0:09                    │
   │      Ndashaka kubona appointment kuwa gatandatu.      │
   │                      ┈┈┈┈┈┈┈┈┈┈┈                      │
   │                                                        │
   │      ← no marker above. none. this is speech.         │
   └──────────────────────────────────────────────────────┘

   A SUSTAINED CHANGE — a marker, carrying its cause
   ══ Kinyarwanda → English · turn 4 · [asked]    ══  obeyed
   ══ Kinyarwanda → English · turn 4 · [keypad]   ══  obeyed
   ══ Kinyarwanda → English · turn 4 · [detected] ══  ← the only
                                                        one that
                                                        can be a
                                                        mistake,
                                                        and the only
                                                        one counted
                                                        as one

   "Drawing normal speech as an event tells somebody the way
    they talk is a mistake."
```
