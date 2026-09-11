# 10 — Flow: Knowledge Base

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-10 |
| **Actor** | A5 Owner, A6 Manager, A7 Agent (suggest only) |
| **Entry points** | Activation step 3 · My Agent → Knowledge · a correction from a transcript · a gap detected by the agent |
| **Exit states** | Published · Draft · Reverted |
| **Depends on** | 06 |
| **Blocks** | Answer quality |
| **Frequency** | Once at setup, then continuously |
| **Criticality** | Critical |

---

## 1. Purpose

Give the agent the facts about the business — prices, services, hours, location, policies, common questions — in a form it can answer from **reliably**, and let the owner see, correct and trust what it knows.

**What breaks if this is wrong:** the agent quotes a wrong price to a customer. That is the single most damaging thing this product can do to a small business, and it is the failure that gets a subscription cancelled the same day.

---

## 2. The design position: structure beats documents

Every product in this category ingests knowledge as **unstructured text** — crawl a URL, upload a PDF, paste some paragraphs — and then retrieves and generates from it. The teardown found **no competitor treating a price list or service menu as structured data**.

That is precisely backwards for this market and this risk profile:

| | Unstructured | Structured |
|---|---|---|
| A price | Text the model reads and re-states, and may re-state wrongly | A typed field, read directly, never generated |
| Editing | Re-upload the whole document | Change one cell |
| Trust | "I hope it read that right" | "That is what it will say" |
| What the owner actually has | A website (they usually do not) | **A laminated price list** (they do) |

**Subiza therefore has two knowledge layers**, and the distinction is the point:

```
   ┌────────────────────────────────────────────────────────────┐
   │  STRUCTURED  —  answered directly, never generated          │
   │                                                             │
   │   Prices        service · price · currency · notes          │
   │   Services      name · duration · description               │
   │   Hours         per day, exceptions, holidays               │
   │   Location      address · landmarks · directions            │
   │   Contacts      numbers · who does what                     │
   │   Policies      deposit · cancellation · delivery           │
   └────────────────────────────────────────────────────────────┘
   ┌────────────────────────────────────────────────────────────┐
   │  UNSTRUCTURED  —  retrieved and summarised, with citation    │
   │                                                             │
   │   FAQ pairs · documents · website content · notes           │
   └────────────────────────────────────────────────────────────┘
```

A question that can be answered from the structured layer **always** is. Generation is the fallback, not the default.

---

## 3. Overview

```
   ADD KNOWLEDGE
        │
        ├─► 📷 Photograph a price list   ── OCR ──► confirm table ──► STRUCTURED
        ├─► ✍️  Type prices and services  ────────────────────────► STRUCTURED
        ├─► 📄 Upload a document          ── extract ──► review ──► UNSTRUCTURED
        ├─► 🌐 Import a website / IG bio  ── crawl ───► review ──► UNSTRUCTURED
        ├─► ❓ Add a question & answer    ────────────────────────► UNSTRUCTURED
        └─► 🗣 Pronunciation dictionary   ────────────────────────► SPEECH
                                    │
                                    ▼
                          REVIEW WHAT IT KNOWS
                          "Ask it something" test box
                                    │
                                    ▼
                               PUBLISH  (versioned)
```

---

## 4. Detailed flow

### 4.1 Photograph the price list — the primary path

| | |
|---|---|
| **Sees** | Camera view with a framing guide and one line: *"Lay it flat. Good light. We'll read the prices."* |
| **Does** | Photographs. Can add more pages |
| **System** | OCR → row extraction → maps to service / price / currency / notes. Detects RWF and normalises formats |
| **Then sees** | **The confirmation table** — every extracted row, editable, with low-confidence cells highlighted amber and a running count: *"We found 14 services. Check them."* |
| **Does** | Corrects, deletes junk rows, adds anything missed |
| **Can fail** | Blurry → guided retake. Handwritten → partial extraction, remainder typed. Unreadable → falls back to typing with no dead end |

**The confirmation table is not a formality — it is the trust-building step.** The owner sees exactly what the agent now believes, in a form they can correct. It is also the first time they understand the mental model: *it says what I told it.*

### 4.2 Type it

A simple repeating row editor: service, price, note. Optimised for thumb entry on a phone — a large "+" and no nested menus. Used when there is no printed list, or to correct OCR.

### 4.3 Documents and website import

| | |
|---|---|
| **Sees** | Upload (PDF, image, Word) or a URL field. For social: *"Paste your Instagram or Facebook page and we'll read your bio and posts"* |
| **System** | Extracts text, chunks it, indexes it, and shows a **source card**: what was found, how many items, when it was last read |
| **Can fail** | Locked PDF → ask for an unlocked copy. Site unreachable → explain. Scanned document → OCR path |

**Sources are re-readable.** Website sources show *"last read 3 days ago"* with a refresh action, because a business that changes its prices on its website and not in Subiza has created exactly the failure this flow exists to prevent.

### 4.4 Question and answer pairs

The most direct path, and the one that captures what lives only in the owner's head:

> **Q:** Do you do braids for children?
> **A:** Yes, from age 5. It takes about an hour and costs 4,000 RWF.

The template pre-seeds six to ten of these per business type with blank answers, so the owner fills gaps rather than inventing questions. **This is also where corrections from transcripts land** ([Flow 14](14-flow-daily-operations-inbox.md)): a 👎 on an answer with "it should have said…" writes a new Q&A pair here automatically.

### 4.5 The pronunciation dictionary — required, not advanced

| | |
|---|---|
| **Sees** | A two-column table: *the word* → *how to say it*, with a ▶ preview per row. Pre-seeded from the template with common local place names |
| **Does** | Adds their business name, neighbourhood, product names, staff names |
| **System** | Applies alias substitution at synthesis time; previews immediately |
| **Can fail** | Preview still wrong → try a different spelling; escalate to support for a phoneme-level fix |

**Why this is mandatory rather than advanced:** Kinyarwanda is not a supported language in mainstream commercial text-to-speech. Business names, place names and personal names will be mispronounced by default, using English or French phonetic approximations. An agent that mangles the name of the business it represents is embarrassing in a way that no other quality issue is — so this sits in the main flow with a preview, not behind a settings menu.

---

## 5. Review — "what does it know?"

A single screen answering the question owners actually ask:

```
   WHAT SUBIZA KNOWS ABOUT SALON UBWIZA

   💰 Prices           14 services          ✅ up to date
   🕐 Hours            Mon–Sat 8:00–18:00   ✅
   📍 Location         Remera, near…        ✅
   📋 Policies         2 rules              ⚠ no cancellation policy
   ❓ Questions        9 answered · 3 blank  ⚠
   🗣 Pronunciation    6 words              ✅
   📄 Documents        1 · read 3 days ago

   ┌─────────────────────────────────────────────┐
   │  Ask it something                     [Ask] │
   │  "How much for braids?"                     │
   │  → "Braids are 5,000 francs and take        │
   │     about two hours."                       │
   │     ⓘ from your price list, row 3           │
   └─────────────────────────────────────────────┘
```

**The inline ask box is the most valuable element on this screen.** It closes the loop between editing knowledge and knowing what changed, in one action, without a phone call. And the citation line — *from your price list, row 3* — is the transparency that the teardown found essentially absent across the whole category.

### 5.1 Gaps the system finds for you

The agent knows what it could not answer. Those become suggestions:

> ⚠ **Three customers this week asked about parking. You haven't told Subiza about parking.** [Add an answer]

This is the strongest re-engagement mechanic in the product, because it is a specific, evidenced, two-minute task derived from the owner's own customers rather than a generic nudge.

---

## 6. Screens, states, decisions

| Screen | States |
|---|---|
| Add knowledge | Choosing source |
| Camera | Framing · captured · extracting · confirm table · failed |
| Price table | Empty · populated · low-confidence rows · edited |
| Document source | Uploading · extracting · ready · stale · failed |
| Website source | Fetching · ready · unreachable · stale |
| Q&A list | Answered · blank (from template) · suggested (from gaps) |
| Pronunciation | Seeded · edited · previewing |
| Review | Complete · gaps flagged |
| Ask box | Idle · answering · answered with citation |
| Publish | Draft · published · version history |

| Decision | Branches |
|---|---|
| Which source? | Photo (default) · type · document · website · Q&A |
| OCR usable? | Confirm · edit · discard and type |
| Structured or unstructured? | Prices, hours, policies → structured. Everything else → indexed |
| Publish now or draft? | Immediate · save and test first |
| Website changed? | Re-read · ignore · disconnect |

---

## 7. Platform constraints

| Constraint | Effect |
|---|---|
| **V4 — Kinyarwanda unsupported in commercial TTS** | The pronunciation dictionary is a required step, in the main flow, with previews |
| G13 — refuse rather than guess | Knowledge gaps produce escalation, not invention. The confidence gate lives in the reasoning layer but is *visible* here as "3 questions your customers asked that Subiza couldn't answer" |
| Retrieval boundary defines agent scope (W8) | Knowledge **is** the scope. Nothing outside it is answerable, which is how the general-purpose-assistant prohibition is enforced structurally |
| Low bandwidth (G14) | Photo upload is compressed client-side before sending; a failed upload resumes rather than restarting |

---

## 8. Edge cases and failures

| Case | Behaviour |
|---|---|
| No written price list at all | Skip. The agent answers everything else and escalates pricing. Still fully usable |
| Prices change weekly | A "prices change often" flag makes the price table the first item on Home for quick editing |
| Two sources disagree (website says 4,000, price table says 5,000) | **Conflict detected and surfaced.** Structured always wins, and the owner is told which source is being ignored and why |
| Website updated externally | Staleness shown; scheduled re-read; owner notified of material changes |
| Very large catalogue (500+ items) | Structured table paginates; the long tail moves to retrieval; search added to the editor |
| Owner deletes all knowledge | Agent falls back to hours, location and escalation. Warned before, not after |
| Uploaded document contains someone's personal data | Flagged, and the retention and data-rights implications explained ([Flow 19](19-flow-compliance-and-data-rights.md)) |
| OCR reads a price wrong and the owner does not notice | Mitigated by low-confidence highlighting, the ask box, and per-answer citations in every transcript |

---

## 9. Retention rationale

| Decision | Reason |
|---|---|
| Photograph first | Matches what a Rwandan SME physically has. Typing a price list on a phone is a wall |
| Structured prices | Eliminates the highest-consequence hallucination class, and is a genuine category gap |
| Confirmation table | Builds the "it says what I told it" mental model at the moment of maximum attention |
| Inline ask box | Closes the edit → verify loop without a phone call |
| Citations on every answer | Transparency almost nobody in the category offers, and it is what makes owners comfortable going fully live |
| Gap suggestions from real customer questions | A specific, evidenced, two-minute task — the highest-quality re-engagement trigger available |
| Versioning and revert | Removes the fear of editing |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 10.1 | Price list captured by photo | Tenants whose prices came from OCR | > 60% |
| 10.2 | OCR is usable | Extractions accepted with ≤3 edits | > 70% |
| 10.3 | Prices are never generated | Code audit + adversarial test: agent asked for an unlisted price | 100% escalate |
| 10.4 | Every answer is traceable | Citation present on every knowledge-derived answer | 100% |
| 10.5 | The ask box reflects edits immediately | Functional test | < 5s |
| 10.6 | Conflicts between sources are surfaced | Seeded-conflict test | 100% detected |
| 10.7 | Pronunciation dictionary is populated at activation | Tenants with ≥3 entries after activation | > 80% |
| 10.8 | Gap suggestions are acted on | Suggestions accepted ÷ shown | > 30% |
| 10.9 | Knowledge is versioned and revertible | Functional test | Pass |
| 10.10 | Photo upload works on 3G | Automated test, 2 MB photo | < 30s |

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `knowledge.source_added` | type, item count |
| `knowledge.ocr_run` | pages, rows found, confidence distribution |
| `knowledge.ocr_reviewed` | rows edited, rows deleted, accepted? |
| `knowledge.qa_added` | origin (template / manual / correction / gap suggestion) |
| `knowledge.pronunciation_added` | word, previewed? |
| `knowledge.ask_box_used` | query, answered?, citation present? |
| `knowledge.gap_detected` / `gap_filled` | question, times asked |
| `knowledge.conflict_detected` | sources, resolution |
| `knowledge.published` | version, item counts |

**`knowledge.gap_detected` is a product-quality signal, not just a tenant one.** A question many tenants of the same business type cannot answer is a template improvement waiting to be made.

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 10.a | Does OCR work reliably on laminated, glare-prone price lists in shop lighting on a mid-range camera? | The primary path |
| 10.b | How well does OCR handle Kinyarwanda service names? | Extraction quality |
| 10.c | Do owners keep prices up to date, or does the knowledge base rot after month one? | Long-term quality — a strong candidate for a monthly prompt |
| 10.d | Should the agent be allowed to answer *anything* not in the knowledge base, even generic pleasantries? | Scope boundary |
| 10.e | Is per-answer citation meaningful to a shop owner, or is it an engineer's idea of transparency? | Test in pilot |

---

*Next: [11 — Voice Selection & Cloning](11-flow-voice-and-cloning.md)*
