# SUBIZA — BUILD PROMPT 08

## Knowledge Base

> **"What Subiza knows about Salon Ubwiza — this is also its boundary. Anything not here doesn't get
> answered — it fetches you instead of guessing, which is the whole design."**
>
> The intellectual centre of this flow is a finding that inverts the obvious design: **citations raise
> trust even when they are irrelevant, and people who actually verify one trust the answer less
> afterwards.** So a citation cannot be a safety mechanism. The design demotes it to an **edit
> affordance** — and that decision has to be enforced in the type system, not the copy.

|                    |                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Prompt**         | 08 of the series — Knowledge base                                                            |
| **Corresponds to** | `Design/knowledge.html` · atlas Flow 10 · flow 1.7 in `Design/PROGRAMME.md`                  |
| **Builds on**      | Prompts 01–06 built; Prompt 07 written, building                                             |
| **Scope**          | Extends `PriceSurface`. **`PriceStep` is untouchable**                                       |
| **Apps**           | `apps/studio` · `packages/domain` · `packages/auth-tenant` · `packages/ui` · `packages/core` |
| **Panes**          | **6** — overview · prices · questions · gaps · sources · pronunciation                       |
| **Next prompt**    | 09 — Voice, cloning and consent (`Design/voice.html`)                                        |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next

`PROGRAMME.md` 1.7 follows 1.6. Prompts 01–06 are **built**; Prompt 07 (agent design) is written and
building — `agent-config.ts` is still the 40-line seed and `features/agent/` does not yet exist. The
prompts run one flow ahead of the build, which is the established rhythm.

Two things point here specifically. `knowledge.ts` is already a **94-line seed** carrying
`PRICE_CONFIDENCE_FLAG = 0.82` and a `PriceRow` whose `amount: null` comment reads _"Null means unread
(`?`). That service escalates until filled. **Never infer.**"_ — planted by Prompt 04. And Prompt 07
created a rule-row state, **"references knowledge that doesn't exist"**, which has nothing to reference
until this flow builds it.

## 0.2 Phases

```
  ┌─ PHASE A ─ CORRECT ───────────────────────────────────────────┐
  │  A1 Kill the ghost — for the THIRD time (§3.2)                 │
  │  A2 Make the ghost class impossible (§3.3) ← the systemic fix  │
  │  A3 Fix the pronunciation-pollution bug                        │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ DOMAIN ────────▼───────────────────────────────────┐
  │  Extend knowledge.ts: sources, gaps, conflicts, versions.      │
  │  THE ANSWER UNION — so a cited retrieval answer cannot be      │
  │  constructed. Types are the enforcement.                       │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ THE TWO LAYERS ▼───────────────────────────────────┐
  │  C1 prices (typed)   C2 questions (typed)                      │
  │  Layer 1. Read, never composed. Always wins.                   │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ LAYER 2 & CONFLICT ▼───────────────────────────────┐
  │  D1 sources   D2 conflict detection + the "ignored" card       │
  │  Nobody else in the category tells the owner what was ignored. │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ THE LOOPS ─────▼───────────────────────────────────┐
  │  E1 gaps mined from real calls   E2 pronunciation lexicon      │
  │  E3 the ask box, with the hedge                                │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE F ─ THE SEAM ──────▼───────────────────────────────────┐
  │  Rules cite knowledge. Deletion NARRATES, never blocks.        │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE G ─ PROOF ─────────▼───────────────────────────────────┐
  │  G1 no-JS  G2 citation-without-JS  G3 never-generate audit     │
  │  G4 conflict determinism  G5 rw@360  G6 adversarial            │
  └───────────────────────────────────────────────────────────────┘
```

## 0.3 Agents

| Agent                    | Owns                     | Must be told                                                                                |
| ------------------------ | ------------------------ | ------------------------------------------------------------------------------------------- |
| **Platform engineer**    | Phase A.                 | The ghost has appeared three prompts running. Fix the class, not just the instance.         |
| **Domain architect**     | Phase B.                 | The answer union is the enforcement. If a cited retrieval answer compiles, you have failed. |
| **Layer-1 engineer**     | Phase C.                 | A price is read, never composed. The prototype is missing states the domain already models. |
| **Conflict engineer**    | Phase D.                 | The model never arbitrates. Precedence is hard-coded.                                       |
| **Loops engineer**       | Phase E.                 | A gap is a pattern, not a proven number. Hedge in words, never in a badge.                  |
| **Adversarial reviewer** | G6. **Never an author.** | Try to construct a retrieval answer carrying a citation, and to make the model break a tie. |

## 0.4 Three rules

**Rule 1 — A price is read, never composed.** P2. Typed fields answer directly. `amount: null` means
unread, that service **escalates until filled**, and the system **never infers**. No rounding, no
plausible guess.

**Rule 2 — A citation is an edit affordance, not a badge.** §5. Its job is to make a wrong price
fixable in two taps. It is **not** evidence, and it must not be counted as a safety mechanism.

**Rule 3 — The model never arbitrates.** §6. When two sources disagree, precedence is hard-coded and
the owner is **told which source was ignored**.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A non-technical owner can see everything their agent knows, fix a wrong price in two taps from the
answer that quoted it, discover what customers asked that it couldn't answer, learn which of their own
sources was overridden and why, and teach it to say their business name correctly.

## 1.2 Definition of done — twenty-four criteria

| #   | Criterion                                                                                        | Proven by                               |
| --- | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| 1   | `dal.writeKnowledge` exists; `enforcementSites` names no ghost                                   | Registry audit                          |
| 2   | **`capabilities.test.ts` checks every `enforcementSites` entry against the real export surface** | A deliberate ghost fails CI             |
| 3   | The pronunciation-pollution bug is fixed                                                         | No sentence fragments in the lexicon    |
| 4   | A retrieval answer carrying a citation **does not compile**                                      | Deliberate violation fails `tsc`        |
| 5   | Typed data beats retrieved text, always, hard-coded                                              | Conflict test                           |
| 6   | The owner is shown **which source was ignored**, with both values                                | Conflict card audit                     |
| 7   | **Recency never beats structured**                                                               | A website updated yesterday still loses |
| 8   | `amount: null` renders `?` and that service escalates                                            | Functional test                         |
| 9   | No price is ever inferred, rounded or generated                                                  | **Never-generate audit — P2**           |
| 10  | The 0.82 flag is wired to something real                                                         | §8.2 — decide what it keys on           |
| 11  | `retrievalMode` is computed from the existing `prices.length > 40`, not a second threshold       | Grep                                    |
| 12  | The citation works **with JavaScript disabled**                                                  | `<a href>` + server-read `searchParams` |
| 13  | A hedge appears in **words** whenever the answer leaves the structured layer                     | Copy audit                              |
| 14  | A gap is presented as a pattern, never as a proven number                                        | Copy audit                              |
| 15  | Answering a gap **writes back** into prices or Q&A                                               | Round-trip test                         |
| 16  | Agent rules can cite knowledge rows                                                              | `knowledgeRefSchema` exists             |
| 17  | **Deletion narrates, never blocks** — citing rules are named _before_ the delete                 | Confirmation audit                      |
| 18  | The reverse marker exists — _"2 rules cite this"_ on the row                                     | Visual audit                            |
| 19  | Knowledge editing is `otp` strength, and that contrast is **documented**                         | `KNOWLEDGE_SURFACE_AUTH`                |
| 20  | An Agent (A7) can **suggest** without being able to write                                        | Scope test                              |
| 21  | Nine `knowledge.*` events emit server-side with the right capability                             | Audit rows                              |
| 22  | Six panes as route segments; `/agent/knowledge` stays the overview                               | No broken links                         |
| 23  | Atlas criterion 10.9 (versioned, revertible) is honoured despite its absence from the HTML table | §15                                     |
| 24  | The overview ships inside 200KB above the fold                                                   | Lighthouse, 3G                          |

## 1.3 Not in this phase

Voice and cloning (Prompt 09). Languages (Prompt 10). The document-upload path — **the design argues
against it**; see §9.2. Anything that lets the model arbitrate.

---

# PART 2 — CONTEXT ABSORPTION

| #   | Read                                                 | Extract                                                                                              |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | `Design/knowledge.html` — **both modes**             | 1,533 lines. Six panes, seven aside panes, eight spec sections. Line 1005 is a 64KB sprite — skip it |
| 2   | **Spec §02 and §03 especially**                      | The citation finding and the conflict rules. These are the flow                                      |
| 3   | `subiza-flow-atlas/flows/10-flow-knowledge-base.md`  | The authoritative sequence — **and note §15, it disagrees with the HTML in fourteen places**         |
| 4   | `packages/domain/src/knowledge.ts`                   | All 94 lines. The seed you extend                                                                    |
| 5   | `packages/domain/src/phone-channel.ts`, `channel.ts` | The house style                                                                                      |
| 6   | `packages/domain/src/transitions.ts`                 | **Line 137 — the pollution bug**                                                                     |
| 7   | `prompts/07-agent-design.md` §7.4                    | The rule shape that will carry `refs`                                                                |

## 2.1 The gate

1. What are the two layers, and which one always wins?
2. Why is a citation not a safety mechanism?
3. What does the product do when the website and the price table disagree?
4. What does `amount: null` mean, and what must never happen to it?
5. Why is knowledge editing `otp` strength when forwarding is `elevated`?

An agent that cannot answer #2 must not build Phase B.

---

# PART 3 — WHAT YOU INHERIT

## 3.1 The seed

`knowledge.ts` (94 lines) already has `PRICE_CONFIDENCE_FLAG = 0.82`, `priceRowSchema`, `qaPairSchema`,
`pronunciationEntrySchema`, `knowledgeSchema`, `emptyKnowledge()` and `unreadPrice()`. **Keep
`emptyKnowledge()` and `unreadPrice()` signatures intact — activation depends on them.**

Activation writes knowledge through `savePrices`, `seedFromTemplate` and `saveCorrection`. The console
route `/agent/knowledge` renders a **fourteen-line read-only `<ul>`** of price rows.

## 3.2 The ghost — for the third time

`enforcementSites.editKnowledgeBase` names **`dal.writeKnowledge`, which does not exist.**

This is the same defect found in Prompt 05 (`dal.changeForwarding`) and Prompt 07 (`dal.updatePersona`).
Add it, export it, and route every knowledge mutator through it exactly as `channels.ts` routes through
`dalConnect` / `dalDisconnect`.

## 3.3 The systemic fix — do this once, here

> **Strengthen `packages/core/src/capabilities.test.ts` so every `enforcementSites` entry is checked
> against the actual `auth-tenant` export surface**, rather than only for non-empty length.
>
> **Otherwise Prompt 09 inherits the same defect a fourth time.**

That is the highest-leverage thing in this prompt. Three consecutive flows have shipped a registry
naming a function nobody wrote. Make it a build failure.

## 3.4 Two more defects

**The pronunciation-pollution bug.** `transitions.ts:137` unconditionally appends a
`PronunciationEntry` whose `surface` **and** `spoken` are both the first 80 characters of the corrected
text — **for every correction.** This fills the lexicon with sentence fragments and makes criterion 10.7
(_>80% of tenants with ≥3 entries_) **falsely satisfiable.** Gate it on real proper-noun detection, or
drop the unconditional push and seed the lexicon from the template only.

**An Agent (A7) cannot write at all.** `requireGrant(ctx, 'editKnowledgeBase', 'write', 'full')`
hard-fails for that role. Add `requireKnowledgeWrite(ctx)` returning `'full' | 'suggest'`, and route
`'suggest'` into a **pending-suggestion list** on the document rather than a direct mutation. The gap
queue's _"Add it"_ is the natural first consumer.

---

# PART 4 — THE TWO LAYERS

> _"Two layers, and the difference is the point."_

|                | **Layer 1 — typed**                | **Layer 2 — retrieved**              |
| -------------- | ---------------------------------- | ------------------------------------ |
| What           | Prices, hours, Q&A pairs, policies | Text from a website or document      |
| How it answers | **Read verbatim. Never composed**  | Retrieved, then phrased by the model |
| Precedence     | **Always wins**                    | Loses to layer 1, always             |
| When absent    | `?` → **escalate**, never infer    | Refuse and escalate                  |
| Citation       | An **edit affordance** (§5)        | **A hedge in words** (§5.3)          |

**This is the design's claim about the market gap:** competitors force price lists into unstructured
PDFs and text blobs, _"which is exactly where hallucinated numbers come from."_

> _"Numbers fail differently."_ A wrong sentence is embarrassing. A wrong price is a transaction the
> business must either honour or renege on. That asymmetry is why prices are a typed field and not prose.

---

# PART 5 — THE CITATION FINDING

> **The intellectual centre of this flow. Atlas question 10.e asked whether per-answer citation is
> meaningful to a shop owner or an engineer's idea of transparency. The research has an answer, and it
> is not the flattering one.**

## 5.1 What the evidence says

From a study accepted to **AAAI-39**:

- **Citations significantly increased trust even when the citations were irrelevant.**
- **One citation and five citations produced comparable trust.**
- **Users who actually clicked through and verified a citation reported _lower_ trust afterwards.**
- Once verified, random citations were trusted **no more than no citation at all**.

> _Read plainly: a citation is a trust signal that most people never check. It makes an answer feel more
> reliable regardless of whether it is. That is close to the opposite of what a transparency feature is
> supposed to do, and it means **a citation cannot be counted as a safety mechanism.**_

## 5.2 So the design changed what a citation _is_

> **The citation is an edit affordance. Not a badge.** It is a button that jumps to the exact row and
> puts the cursor in it. **Its job is to make a wrong price fixable in two taps** — a use case the trust
> research doesn't cover and one that is unambiguously useful.

**And it must work with JavaScript disabled.** Render it as
`<a href="/agent/knowledge/prices?row=prc_1&row=prc_2#prc_1">`, have the prices pane read
`searchParams.row` to add the hit class **server-side**, and set `autoFocus` on the first matching
amount input. The prototype's 260ms/2400ms highlight decay is progressive enhancement **on top of** that
mechanism, never the mechanism itself.

## 5.3 And the design added what does work

> **A hedge, where hedging is honest.** Separate research found that **low-confidence, hedged language
> is one of the few things that reliably makes people push back on an AI answer — more so than a source
> link.** So when the ask box answers from outside the structured layer, **it says so in words** rather
> than decorating the answer with a source.

## 5.4 Make it a type, not a convention

Model the answer as a discriminated union **so that "a retrieval answer with a citation" cannot be
constructed**:

```
type KnowledgeAnswer =
  | { kind: 'structured'; text; original; cite: { layer, rowIds[], locator } }
  | { kind: 'retrieval';  text; hedge: string; sourceId }
  | { kind: 'refused';    text }
```

Export `answerFor(query, knowledge, agent)` from `packages/domain`. **The type is the enforcement of
the copy-audit criterion.** A convention gets forgotten; a union does not compile.

## 5.5 Be honest about what is untested

> _"No study exists on this specific format — 'from your price list, row 3' — shown to non-expert
> small-business owners. It remains a design bet. **The difference is that it is now a bet on
> editability, which is checkable, rather than on trust, which the evidence says would be misplaced.**"_

---

# PART 6 — WHEN TWO SOURCES DISAGREE

## 6.1 Why the model must not decide

> General models arbitrate badly. **On a benchmark built from genuinely conflicting evidence, the best
> model reached about 34% exact match**, and standard retrieval systems _"either arbitrarily choose an
> answer or use parametric knowledge to break ties."_ **There is no principled precedence rule inside
> the model, so the product must supply one.**

## 6.2 The three hard-coded rules

| Rule                                           | Consequence                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Typed data always beats retrieved text**     | Hard-coded. **The model never chooses between them**                                                     |
| **The owner is told which source was ignored** | With **both values shown**, and one tap to fix either side                                               |
| **Newer never beats structured**               | A website updated yesterday still loses to a price table edited last month. **Recency is not authority** |

## 6.3 The second row is the differentiator

> _"No product was found that does the second row. Telling a user which source was overridden appears to
> be **undocumented anywhere in the category.** It is also the difference between a system that quietly
> resolves a contradiction and one that hands an owner **a fact about their own business they didn't
> know — namely that their website is wrong.**"_

Conflict is a **first-class Source state**, not an edge case (§15). The card shows _Used_ / _Ignored_ /
_Why_, strikes through the ignored value, and offers **two resolution forms** — change the table, or fix
the source. Both are forms posting a specific value, not client mutations.

---

# PART 7 — THE SIX PANES

`.ktabs` — a horizontally-scrolling pill row, `role="group"` with `aria-pressed`, over six panes.
**Default: overview.**

| #   | Pane            | Label                    | Count |
| --- | --------------- | ------------------------ | ----- |
| 1   | `overview`      | Overview · _Incamake_    | —     |
| 2   | `prices`        | Prices · _Ibiciro_       | 14    |
| 3   | `questions`     | Questions · _Ibibazo_    | 9·3   |
| 4   | `gaps`          | Gaps · _Icyuho_          | 3     |
| 5   | `sources`       | Sources · _Inkomoko_     | 2     |
| 6   | `pronunciation` | Pronunciation · _Imvugo_ | 6     |

**Route them.** `app/(console)/agent/knowledge/[pane]/page.tsx` with `KNOWLEDGE_PANES` in the domain
package, `generateStaticParams()` over it, `isKnowledgePane()` in `features/knowledge/panes.ts`,
`notFound()` on an invalid segment, `PageProps<'/agent/knowledge/[pane]'>`, awaited params, and
`<Suspense><ViewTransition>`. **Keep `/agent/knowledge` itself as the overview so no existing link
breaks.**

The prototype's tabs are inert with JavaScript disabled and only the overview renders. **Routes fix
that** — the law requires every pane to work without JS.

**At 360px:** the price row reflows to two lines — name + delete on line 1, amount **left-aligned** on
line 2 — and **the delete button becomes permanently visible**, because hover does not exist on touch.
The pronunciation row does the same.

---

# PART 8 — PRICES

## 8.1 The prototype is behind the domain

> **The prototype renders _none_ of the hard states the domain already models:** no unread `?`, no 0.82
> confidence flag, no confirm affordance, no currency, no `retrievalMode`.

Build what the domain models, not what the prototype draws. The prototype is a three-column inline-
editable grid fronted by a lime wash asserting prices are typed numbers read verbatim. That wash is the
copy; the states are the work.

## 8.2 The 0.82 flag must key on something real

Research this before wiring it: **modern OCR and VLM pipelines do not reliably emit a usable per-field
confidence.** If the number is not trustworthy, the flag must key on something that is — extraction
agreement across two passes, a structural parse failure, an out-of-range magnitude, or a missing
currency token. **Decide, and write the decision into the named-assumption block.** A threshold keyed on
a fiction is worse than no threshold.

## 8.3 Rules

`amount: null` → renders `?` → **that service escalates until filled. Never infer.** No rounding, no
"from" price invented, no magnitude guessed.

`retrievalMode` is **already computed** as `prices.length > 40` in `confirmPrices`. **Wire the UI to
that flag — do not invent a second threshold.**

RWF has **no minor unit**. Format through the existing `packages/core` formatter.

**Extend `PriceTable`, do not fork it.** It already takes configurable field names and renders `?` for
null. Add `hit?: readonly string[]` for the citation highlight, an `onDelete` form slot, and a
search/paginate mode for the large-catalogue state.

---

# PART 9 — QUESTIONS

Q&A pairs — question, answer, `blank`. A template ships 6–10 **blank** pairs; a blank pair renders
dashed with a warn tag.

## 9.1 The argument against documents

> _"Question-and-answer beats a document."_

**This is a scope decision, not a preference.** The design argues that FAQ-pair retrieval beats
chunked-document RAG for a narrow domain — better retrieval, cheaper maintenance, and a failure mode the
owner can actually see and fix. **Do not add a document-upload path in this phase.** If the research
disagrees at a particular corpus size, record it in the named-assumption block rather than quietly
shipping uploads.

Each pair carries an `origin` provenance footer — `template | manual | correction | gap`.

---

# PART 10 — GAPS

> _"The agent knows what it couldn't do."_ Gaps are mined from **real calls**.

A gap is a question customers asked that the agent could not answer. It carries the **quoted
conversation occurrences** — `{ at, text, language }[]` — and `timesAsked`, with status
`open | answered | dismissed`.

**Answering a gap writes back** into prices or Q&A. That is the loop.

## 10.1 A pattern, not a proven number

> The aside refuses a claim: a gap count is **a pattern, not a proven number.** It tells the owner _this
> keeps coming up_; it does not assert _you lost N customers_. Keep that distinction in the copy — it is
> the same discipline as Home's _"we can prove a call went unanswered but not that a customer was lost."_

Two tonal variants: **warn** for repeated, **neutral** for once-asked.

---

# PART 11 — SOURCES

A source is a website or a document: `{ id, kind, label, url|filename, lastReadAt, status, itemCount }`
with status `ready | re-reading | stale | unreachable`, plus a **Re-read** form.

Conflict is a **Source state** (§6). And _"we say what we ignored"_ — the card names the overridden
source explicitly.

---

# PART 12 — PRONUNCIATION

`{ surface → spoken }`. A **required onboarding output, not an advanced setting**, because Kinyarwanda
is unsupported by mainstream commercial TTS.

> _"Mangling the business's own name"_ is the failure this exists to prevent. It is the first thing a
> caller hears and the thing an owner will notice fastest.

Fix the pollution bug first (§3.4) — otherwise the pane fills with sentence fragments and the success
criterion is satisfied by noise.

**The supplier question:** a pronunciation lexicon raises a vendor-portability question — respellings
tuned to one TTS engine may not transfer, and the lexicon is tenant data that must survive an engine
change. Record the position in the named-assumption block; it is a real dependency on the Prompt 09
voice decision.

Provide a **preview** control. Under `Fidelity.lite`, drop preview audio to text-only.

---

# PART 13 — THE SEAM: RULES CITE KNOWLEDGE

Prompt 07 ships a rule-row state — **"references knowledge that doesn't exist"** — with nothing to
reference. Resolve it here, **in `packages/domain`**:

- `knowledgeRefSchema { kind: 'price'|'qa'|'pronunciation'|'hours'|'source', id }`, where an id of `'*'`
  means the whole collection.
- Add `refs: knowledgeRefSchema.array().default([])` to `agentRuleSchema`.
- Export `ruleReferencesMissingKnowledge(rule, knowledge, agent)`, `resolveRuleRefs(...)`, and
  `impactOfDeleting(knowledge, agent, ref) → AgentRule[]`.
- Use the already-branded `asRuleId`, currently unused.
- **Do not add a thirteenth entry to `DOMAIN_DOCUMENTS` — this is a relation, not a document.**

## 13.1 Deletion narrates, it never blocks

When a price row or Q&A pair that a rule cites is deleted, **the confirmation names the citing rules
before the delete** — atlas §8: _"Warned before, not after."_ The rule row then renders the missing-
knowledge state on `/agent`.

**Show the reverse direction too** — a _"2 rules cite this"_ marker on the price row. Without it the
owner can only discover breakage from the other screen.

---

# PART 14 — DOMAIN, AUTH, EVENTS

**Extend `knowledge.ts` in place** — do not create a parallel file. Add `sourceSchema`, `gapSchema`,
`conflictSchema`, widen `knowledgeSchema` with `sources[]`, `gaps[]`, `conflicts[]`, plus version/draft
fields for criterion 10.9.

**`KNOWLEDGE_SURFACE_AUTH`** in a new `packages/auth-tenant/src/knowledge.ts`, shaped like
`PHONE_SURFACE_AUTH`: `surfaceAccepts: 'otp'` · `recovered: 'allowed'` · `agentRole: 'suggest-only'` ·
`deleteRequires: 'full'` · `activationRemainsOn: 'editKnowledgeBase'`.

> **State plainly that knowledge editing is daily work and therefore not an elevated capability.** That
> is a deliberate contrast with forwarding and channels, and it should be documented rather than left
> implicit.

**Nine `knowledge.*` events** as a const tuple plus a discriminated union, widening `TenantEvent`:
`source_added` · `ocr_run` · `ocr_reviewed` · `qa_added { origin }` · `pronunciation_added` ·
`ask_box_used { query, answered, citationPresent, hedgePresent }` · `gap_detected` · `gap_filled` ·
`conflict_detected` · `published`. **Emit from server actions only**, passing `'editKnowledgeBase'` so
the audit row attributes correctly.

**Five new `packages/ui` product components:** `AskBox` (form + answer bubble + citation/hedge slots) ·
`GapCard` (two tonal variants, quoted-conversation list, accept/dismiss forms) · `SourceRow` (four
states + Re-read form) · `ConflictCard` (Used / Ignored / Why, strike-through, two resolution forms) ·
`PronunciationTable` (word / respelling / preview, with the 640px reflow). Reuse `RowList`/`RowItem` for
the overview and `Banner` for every _why_ callout.

---

# PART 15 — RECONCILING THE ATLAS AND THE HTML

The atlas and the prototype disagree in **fourteen** places. Honour the reconciled facts:

| Take                                             | Not                   |
| ------------------------------------------------ | --------------------- |
| Closing time **19:00** (HTML **and** built code) | 18:00 (atlas)         |
| Conflict figures **15,000 vs 12,000**            | 5,000 vs 4,000        |
| Citation locator **"rows 1–2" on a button**      | "row 3" on an ⓘ badge |
| Gap window **a fortnight**                       | a week                |
| **Policies absent** from the overview            | present               |
| Conflict as a **first-class Source state**       | an edge case          |

**One exception — carry it forward despite its absence:** atlas criterion **10.9, versioned and
revertible**, is silently dropped from the HTML success table **while the prototype footer still
promises** _"Every change is versioned and revertible."_ The promise is in the UI; honour it. Reuse the
version machinery Prompt 07 builds rather than inventing a second one.

---

# PART 16 — STATES, i18n, PERFORMANCE

Every pane carries the eight states. Knowledge-specific ones: empty · populated · editing ·
**unconfirmed** · **flagged** · **conflicting** · **too-large (retrievalMode)** · **unread `?`**.

**i18n — an important nuance.** Every string exists in both languages as `data-rw` attributes.
**Harvest them; do not re-translate.** And note: the Kinyarwanda twin is materially **shorter** than the
English in many places here and materially **longer** in others (the never-line, the hedge, the gap
headers). **These are two authored strings, not a translation pair.** Treat `en` and `rw` as independent
copy and never assume equal length for layout. Prove all six panes at 360px in `rw`.

**Performance.** `/agent/knowledge` (overview) must ship inside **200KB above the fold** on a low-end
Android over 3G: the overview rows, the ask box, and nothing else. Sources, gaps with their quoted
conversations, and pronunciation previews are **separate route segments**. Use `fidelityFromHeaders` to
drop quoted conversations and preview audio to text-only in `lite`.

---

# PART 17 — VERIFICATION

| Audit                | Pass condition                                                          |
| -------------------- | ----------------------------------------------------------------------- |
| **Ghost class**      | A deliberate fake `enforcementSites` entry **fails CI**                 |
| Never-generate       | No code path produces a price the owner did not type. **P2, 100%**      |
| Answer union         | A cited retrieval answer does not compile                               |
| Conflict determinism | Typed always wins; recency never does; the model is never asked         |
| Ignored source       | Both values shown; the overridden source is named                       |
| Citation no-JS       | Works with JavaScript disabled, via `href` + server-read `searchParams` |
| Hedge                | Present in words whenever the answer leaves layer 1                     |
| Unread               | `?` renders; that service escalates; nothing is inferred                |
| `retrievalMode`      | Wired to `prices.length > 40`, not a new constant                       |
| Gap write-back       | Answering a gap updates prices or Q&A                                   |
| Seam                 | Deleting cited knowledge names the rules first; reverse marker present  |
| Suggest scope        | An Agent can suggest and cannot write                                   |
| Pollution            | Corrections no longer append sentence fragments                         |
| Events               | Nine emit server-side with `editKnowledgeBase`                          |
| Panes                | Six routes; `/agent/knowledge` still resolves                           |
| rw @ 360             | All six panes, both themes, no overflow                                 |
| Budget               | Overview ≤200KB above the fold                                          |

## 17.1 The adversarial pass

A **different agent from every author**. Try to: construct a `retrieval` answer carrying a citation ·
make the model break a tie between the website and the price table · get a price onto a call that the
owner never typed · delete a cited price row without the owner being told · satisfy criterion 10.7 with
polluted lexicon entries · write knowledge as an Agent role.

---

# PART 18 — DELIVERABLES & NEXT

1. `dal.writeKnowledge` **and** the `capabilities.test.ts` hardening that ends the ghost class
2. The pronunciation-pollution fix and the `suggest` scope
3. `knowledge.ts` extended — sources, gaps, conflicts, versions
4. **The `KnowledgeAnswer` union** and `answerFor()`
5. Six panes as routes, all no-JS, overview default
6. Prices with every domain state the prototype omits
7. Conflict detection and the _ignored source_ card
8. Gaps mined from calls, with write-back
9. The pronunciation lexicon, with the supplier question recorded
10. The rule↔knowledge seam, with narrating deletion both ways
11. Nine events, `KNOWLEDGE_SURFACE_AUTH`, `en`/`rw` parity
12. The adversarial report

**Prompt 09** — Voice, cloning and consent (`Design/voice.html`): two actors on two devices, one consent
record, and the revoke control rendered and locked on the owner's copy. It carries the biometric-consent
obligations under Law 058/2021 and depends on the `VOICE_BIOMETRIC_CHECK` flag Prompt 04 planted. Say
**next**.

---

# PART 19 — APPENDIX

## A — Two layers, one precedence

```
   THE CALLER ASKS: "How much for a haircut?"
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  LAYER 1 — TYPED                       │
        │  price row: { name, amount, currency } │
        │                                        │
        │  amount = 5000  ──► READ IT VERBATIM   │  never composed
        │  amount = null  ──► "?"                │  never inferred
        │                     ESCALATE           │  never guessed
        └────────────────┬───────────────────────┘
                         │ only if layer 1 has nothing
                         ▼
        ┌────────────────────────────────────────┐
        │  LAYER 2 — RETRIEVED                   │
        │  text from a website or document       │
        │  answered WITH A HEDGE, IN WORDS       │
        │  never with a citation badge           │
        └────────────────┬───────────────────────┘
                         │ nothing there either
                         ▼
                    REFUSE + FETCH A HUMAN          G13

   ═══ WHEN THE TWO DISAGREE ═══════════════════════════════
     typed ALWAYS wins .................. hard-coded
     the owner is TOLD what was ignored . both values shown
     newer never beats structured ....... recency ≠ authority

     the model is never asked. it scores ~34% on conflicting
     evidence, and "arbitrarily chooses or uses parametric
     knowledge to break ties".
```

## B — Why the citation is a button

```
   WHAT THE RESEARCH FOUND (AAAI-39)
   ┌──────────────────────────────────────────────────────────┐
   │  citations raised trust EVEN WHEN IRRELEVANT             │
   │  1 citation ≈ 5 citations, for trust                     │
   │  people who VERIFIED one trusted the answer LESS after   │
   │  once verified, a random citation ≈ no citation at all   │
   └──────────────────────────────┬───────────────────────────┘
                                  ▼
          a citation is a trust signal MOST PEOPLE NEVER CHECK.
          it makes an answer FEEL reliable regardless of whether
          it is. that is the opposite of a transparency feature.

          ⇒ A CITATION CANNOT BE COUNTED AS A SAFETY MECHANISM.
                                  │
              ┌───────────────────┴───────────────────┐
              ▼                                       ▼
   ┌────────────────────────┐          ┌────────────────────────────┐
   │ SO WE CHANGED WHAT IT  │          │ AND ADDED WHAT DOES WORK   │
   │ IS                     │          │                            │
   │                        │          │ a HEDGE, in words, when    │
   │ "from your price list, │          │ the answer leaves layer 1. │
   │  rows 1–2"             │          │                            │
   │        ↓ is a BUTTON   │          │ hedged language is one of  │
   │ jumps to the row,      │          │ the few things that makes  │
   │ puts the cursor in it. │          │ people PUSH BACK — more    │
   │                        │          │ than a source link does.   │
   │ job: a wrong price     │          │                            │
   │ fixable in TWO TAPS    │          └────────────────────────────┘
   └────────────────────────┘
              │
              ▼
   ENFORCED BY THE TYPE, NOT THE COPY:
     { kind:'structured', cite:{…} }   ← citation ONLY here
     { kind:'retrieval',  hedge:string } ← hedge, NO cite field
     { kind:'refused',    text }
   a cited retrieval answer DOES NOT COMPILE.
```

---

_Prompt 08 · Subiza · Knowledge Base_
_Built against `Design/knowledge.html`, atlas Flow 10, and the design's own cited research._
_Where the atlas and the prototype disagree, Part 15 rules._
