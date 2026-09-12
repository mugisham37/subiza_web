# SUBIZA — BUILD PROMPT 04

## Guided Activation

> **"This is the flow the company lives or dies on. Everything else is either upstream of it or
> downstream of it."** — atlas Flow 06, criticality: **Existential**
>
> And it is not a wizard. It is a **guided write-path across seven domain documents that seven later
> prompts each own a full editor for.** Get that seam wrong and Prompts 05–11 spend their budget
> reconciling duplicated state instead of building. **Read Part 4 before anything else.**

|                    |                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Prompt**         | 04 of the series — Guided Activation                                                   |
| **Corresponds to** | `Design/activation.html` · atlas Flow 06 · flow 1.3 in `Design/PROGRAMME.md`           |
| **Orchestrates**   | Flows 07, 09, 10, 11, 13 (and touches 12, 15). **Flow 08 is deliberately excluded**    |
| **Prerequisite**   | **Prompt 03 must be built first.** This is the first authenticated surface             |
| **Apps**           | `apps/studio` — the console comes alive here. Plus a **new** `packages/domain`         |
| **Target**         | First value **under 10 minutes**. Fully live **under 45**. _Never stated to the owner_ |
| **Next prompt**    | 05 — Phone connection (`Design/phone.html`)                                            |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next — the check, not the assumption

`Design/PROGRAMME.md` orders stakeholder 1's work by _the customer's own journey_: 1.1 landing → 1.2
sign-up → **1.3 guided activation** → 1.4 phone → 1.5 channels → … Prompts 02 and 03 covered 1.1 and 1.2.
The atlas agrees: Flow 06's entry point is _"immediately after Flow 05"_, and its dependency list is
exactly `05`.

Nothing else is reachable first. Phone connection (1.4), agent design (1.6), knowledge (1.7) and voice
(1.8) are all _inside_ activation before they are standalone surfaces — an owner meets them here first.
Home (1.11) renders the part-done checklist activation produces. **1.3 is next, and it is also the
gateway that unlocks 1.4 through 1.11.**

## 0.2 Phases

```
  ┌─ PHASE A ─ THE SEAM ──────────────────────────────────────────┐
  │  packages/domain: 11 document schemas, validators, transitions │
  │  The Step/Surface contract. The six business templates.        │
  │  SEQUENTIAL, one agent. Nothing else may start.                │
  │  Gate: Prompts 05-11 can be described as "add a Surface".      │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ THE SHELL ─────▼───────────────────────────────────┐
  │  WizardShell (extracted from Prompt 03's auth shell)           │
  │  Route-per-step, server actions, resume, the skip-set          │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ MAKE IT YOURS ─▼───────────────────────────────────┐
  │  C1 w1 business type   C2 w2 hours   C3 w3 prices   C4 w4 voice│
  │  PARALLEL. Each is a thin Step over a Phase-A feature module.  │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ ★ HEAR IT WORK ▼───────────────────────────────────┐
  │  w5 the test call · three routes · w6 the correction loop      │
  │  YOUR STRONGEST AGENT. This screen is the company's conversion │
  │  event and it is specified in TWO files that must be merged.   │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ CONNECT IT ────▼───────────────────────────────────┐
  │  E1 w7 escalation (the ONLY blocking step)                     │
  │  E2 w8 phone forwarding    E3 w9 go-live scope                 │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE F ─ PART FOUR ─────▼───────────────────────────────────┐
  │  w10 the Home checklist + the read-only console surfaces       │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE G ─ PROOF ─────────▼───────────────────────────────────┐
  │  G1 no-JS  G2 a11y  G3 3G  G4 rw@360  G5 abuse  G6 seam audit  │
  │  G7 adversarial — a DIFFERENT agent from every author          │
  └───────────────────────────────────────────────────────────────┘
```

## 0.3 Agents

| Agent                      | Owns                     | Must be told                                                                                                |
| -------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Domain architect**       | Phase A.                 | Your output is what stops Prompts 05–11 from diverging. Nothing else matters as much.                       |
| **Shell engineer**         | Phase B.                 | Extract, don't re-invent. Prompt 03's auth shell is literally the same CSS.                                 |
| **Step engineers** (×4)    | Phase C.                 | A Step is a _thin mount_ over a feature module. If you are writing domain logic, you are in the wrong file. |
| **Call engineer**          | Phase D.                 | Two design files specify this screen. Merge them. Three fallbacks, independently implemented.               |
| **Connect engineers** (×2) | Phase E.                 | Exactly one step blocks. Know which, and why.                                                               |
| **Adversarial reviewer**   | G7. **Never an author.** | Try to burn a tenant's credit, fire `tenant.activated` falsely, and reach step 9 without step 7.            |

## 0.4 Three rules

**Rule 1 — Activation owns no domain state.** Only a cursor and a skip-set — and even the cursor should
be _derived_ from which documents have content. Every step writes to a document a later prompt owns.

**Rule 2 — Never state a duration to the owner.** The 10- and 45-minute targets are internal. A
meta-analysis of 32 experiments found progress indicators **hurt** completion when an overall duration
is stated for anything over five minutes. Nine marks show position, never a countdown.

**Rule 3 — The inversion is non-negotiable.** No external dependency may be placed before step 5.
WhatsApp, Instagram, Telegram, voice cloning and credit all belong to Part Four. Any of them in the
critical path pushes first value past one session and destroys the flow's reason to exist.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 The definition of activation

> **Activation is: a customer interaction — real or simulated — was handled by the AI, and the business
> owner watched it happen and judged the answer good.**

Not _signed up_. Not _connected WhatsApp_. Not _finished the checklist_.

**Therefore `tenant.activated` requires TWO server-observed conditions — the test call completed AND the
transcript was viewed.** Firing on call completion alone corrupts the company's single most important
metric. Its content-independence is absolute: a tenant who thumbs-down every turn is still activated.

## 1.2 Definition of done — twenty-six criteria

| #   | Criterion                                                                                | Proven by                                                 |
| --- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `packages/domain` holds all 11 schemas; no step declares its own shape                   | Import graph; `dependency-cruiser`                        |
| 2   | Every feature exports both a `<Step>` and a `<Surface>` over one module                  | Contract test per feature                                 |
| 3   | A step reaching a domain shape not in `packages/domain` fails lint                       | Deliberate violation fails CI                             |
| 4   | Nine steps, each its own route, each resumable from a cold device                        | Resume test across devices                                |
| 5   | Every step works with JavaScript disabled, including the photo upload                    | Playwright `javaScriptEnabled: false`                     |
| 6   | No duration is ever shown to the owner                                                   | Grep the catalogues for "minute"                          |
| 7   | Progress is 9 `aria-hidden` marks, no numbers, no countdown                              | Markup assertion                                          |
| 8   | **Exactly one step blocks: w7 escalation**                                               | Functional test — every other step is skippable           |
| 9   | Steps 1, 2, 4 are skippable _because a template pre-filled them_                         | The default IS the skip                                   |
| 10  | **The test-call destination is never an input field**                                    | Grep: no phone input on w5; resolves from `TenantContext` |
| 11  | One in-flight test call per tenant, enforced by concurrency not RPM                      | Concurrency test                                          |
| 12  | Spend ceiling is denominated in **RWF**, not minutes                                     | Config assertion                                          |
| 13  | Answering-machine detection is implemented                                               | Voicemail pickup does not burn a full call                |
| 14  | Three test-call routes, independently implemented                                        | Kill route 1 → route 2 works; kill 2 → route 3 works      |
| 15  | Route 3 works from a **feature phone with no data**                                      | Manual test                                               |
| 16  | No confidence number, bar or meter appears while the call is live                        | Visual audit                                              |
| 17  | Interim transcript is `aria-live="off"`; finalised turns in `role="log"`                 | a11y audit                                                |
| 18  | Nothing plays audio on its own; a rejected `play()` reveals guidance                     | Manual test                                               |
| 19  | **`tenant.activated` fires once, in-transaction, from the DAL, on transcript-viewed**    | Event test; cannot fire from a client                     |
| 20  | Corrections write straight to knowledge/rules/pronunciation and affect the **next** call | Round-trip test                                           |
| 21  | An unreadable price becomes `?` and the agent escalates that service                     | Functional test                                           |
| 22  | Nothing uploads until an on-device quality check passes                                  | Network audit on a blurry photo                           |
| 23  | Home arrives part-done with exactly one item highlighted                                 | Visual + markup assertion                                 |
| 24  | Every console section activation links to renders something (G6)                         | Link crawl                                                |
| 25  | The kill switch is present from the moment the rung ≠ sandbox                            | Reachability audit                                        |
| 26  | Twelve atlas §11 events emit from server actions, not client handlers                    | Event test with JS off                                    |

## 1.3 Not in this phase

**Flow 08 channels** — a Home checklist row only. **Flow 12 language** — set at signup, only _read_
here. Voice **cloning** — Part Four, Prompt 09. The full editors for agent, knowledge, voice, phone and
go-live — Prompts 05–11. The `(console)` sections ship as **read-only summary surfaces** over the same
documents, which those prompts later replace with editors on the same route and the same data.

---

# PART 2 — CONTEXT ABSORPTION

| #   | Read                                                   | Extract                                                                                                                                                                                      |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Design/activation.html` — **both modes**              | All 1,959 lines. `#m-proto` w1–w10 and the ten `.asidepane` rationale cards; `#m-spec` §01–§09                                                                                               |
| 2   | `subiza-flow-atlas/flows/06-flow-guided-activation.md` | The authoritative step list, §4's _sees → does → system does → can fail_, §10 success criteria, §11 instrumentation                                                                          |
| 3   | **`Design/golive.html` §t1–t8, x1–x3**                 | **The test call is specified TWICE.** golive's version is more complete — three routes fully drawn, a teleprompter, a rate-limit screen with real copy, a platform-outage screen. Merge them |
| 4   | `prompts/03-authentication-and-authorization.md`       | The DAL, `Grant`, `TenantContext`, auth-strength tiers, the audit wrapper. All of it binds                                                                                                   |
| 5   | `Design/{phone,agent,knowledge,voice,golive}.html`     | **Skim only.** Enough to know what the later Surface will need from your schema                                                                                                              |
| 6   | `docs/07-telephony-and-networking.md`                  | What the platform can actually dial, and at what cost                                                                                                                                        |
| 7   | `packages/core/src/capabilities.ts`                    | The capabilities activation uses. **No new one is needed**                                                                                                                                   |

## 2.1 The gate

1. What two conditions must both hold before `tenant.activated` may fire?
2. Which single step blocks, and what is the argument for it blocking?
3. Why is the channel connection fourth-from-last rather than first?
4. Why does the wizard never tell the owner how long it will take?
5. What does activation own, and what does it merely write to?

An agent that cannot answer #5 must not write code in Phase A.

---

# PART 3 — WHAT YOU INHERIT

## 3.1 Prerequisite

**Prompt 03 must be built before this one starts.** Activation is the first authenticated surface: every
server action here re-authorizes from zero through the DAL, every mutation is audited in-transaction, and
`TenantContext` must already be un-constructible outside the DAL. If auth is not built, Phase A can
proceed (it is pure schema) but Phase B cannot.

## 3.2 Compose, do not rebuild

`packages/ui` gives you `ForwardingCodeCard`, `EscalationLadder`, `LiveCallCard`, `Waveform`,
`Transcript`, `ChannelTile`, `PhoneField`, `ChoiceCard`, `Banner`, `Card`, `Stat`, `RowList`, `Toggle`,
`StateBoundary` and all eight state components.
`packages/core` gives you `ViewState<T>`, branded ids, `Fidelity`, formatters and `capabilities.ts`.

## 3.3 Two components to generalise

**`ForwardingCodeCard`** → props `{ condition: 'no-reply' | 'busy' | 'unreachable' | 'unconditional',
subizaNumber, timerSeconds, platform: 'android' | 'ios' | 'unknown', deactivationCode }`. Copy stays the
primary action. On iOS, **replace** the tap-to-dial button with three numbered steps rather than
relabelling it — tap-to-dial links fail _silently_ there. Percent-encode `#` as `%23` in any `tel:` href.
Prompt 05 then adds screens, not components.

**`packages/fixtures`** currently holds a demo tenant id and two `ViewState`s. It must gain **six
business-type templates plus a generic one**, each a complete draft: persona, greeting, 3 visible rules +
2 locked rules, 6–10 blank-answer Q&A pairs, a suggested voice, a starter pronunciation dictionary, and a
typical week grid. They must be **data, not prose** — the template-peek disclosure renders the object
directly.

## 3.4 One flag to add now

Add `VOICE_BIOMETRIC_CHECK = false` to `packages/core/src/verifications.ts`, beside the existing
`DATA_RESIDENCY_CLAIM` and `CARRIER_FORWARDING` gates, so Prompt 09 flips a flag rather than introducing
a gate.

---

# PART 4 — THE SEAM

> **The central architectural decision of this phase. Everything in Prompts 05–11 depends on it.**

## 4.1 The insight

Activation is **not** a flow containing reduced copies of flows 07–13. It is a **guided write-path across
seven domain documents that the later flows each own an editor for.** Every step maps one-to-one onto a
document a dedicated design file already specifies in full:

| Step                   | Writes to                           | Later editor                                                         |
| ---------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| w1 business type       | seeds `AgentConfig` + `Knowledge`   | `agent.html` → Prompt 07                                             |
| w2 hours + after-hours | `AgentConfig.hours` / `.afterHours` | `agent.html` step 6 → Prompt 07                                      |
| w3 prices              | typed `PriceRow[]` in `Knowledge`   | `knowledge.html` pane `p-price` → Prompt 08                          |
| w4 voice               | `VoiceSelection`                    | `voice.html` screen `v1` **minus cloning** → Prompt 09               |
| w5–w6 test call        | `TestCall` + corrections fan out    | `golive.html` `t1`–`t6` **minus the persona suite `t7`** → Prompt 11 |
| w7 escalation          | `EscalationRota`                    | Flow 15 → Prompt 14                                                  |
| w8 phone               | `PhoneChannel`                      | `phone.html` **Path A only** → Prompt 05                             |
| w9 go-live scope       | `GoLive.rung`                       | `golive.html` `g3` → Prompt 11                                       |

`voice.html` says it in words: _"Upstream, in activation.html step 4; v1 is the return path."_ The seam
was designed. Your job is to honour it.

**Flow 08 (channels) is not embedded at all** — it appears only as a Home checklist row.
**Flow 12 (language) is not embedded** — it is set at signup and only _read_ by the voice picker.

## 4.2 `packages/domain` — the new package

Holds the **eleven document schemas**, their zod validators, and their pure transition functions.
Depends on `packages/core` and nothing else. Prompts 05–11 import from it rather than declaring their own
shapes. **This is the artefact that makes the seam physically safe.**

Suggested documents: `AgentConfig` · `Knowledge` (with `PriceRow[]`, `QaPair[]`, `PronunciationEntry[]`)
· `VoiceSelection` · `TestCall` · `EscalationRota` · `PhoneChannel` · `GoLive` · `ActivationCursor` ·
`BusinessTemplate` · `WeekGrid` · `ChecklistState`.

## 4.3 The Step / Surface contract

Each feature module exports **two mounts over one module**:

```
apps/studio/src/features/knowledge/
   ├── PriceStep.tsx      ← the compact wizard mount    (Prompt 04 builds)
   ├── PriceSurface.tsx   ← the full editor mount       (Prompt 08 extends)
   └── PriceTable.tsx     ← the shared component BOTH render
```

**Prompts 05–11 add screens beside the Surface. They never touch the Step.** That single rule is what
prevents divergence.

## 4.4 Five shared components

`PriceTable` · `VoiceLibrary` · `CallStage` · `ReviewTurn` · `LadderOption`. Each is rendered by both a
Step and a Surface. Build them once, here.

## 4.5 Read-only console surfaces

Ship `/agent`, `/agent/knowledge`, `/agent/voice` and `/connections` as **read-only summaries** backed by
the same documents. Prompts 05–11 replace the read-only body with an editor **on the same route and the
same data** — extend, not migrate. This also satisfies G6 for every link activation emits.

**Do not ship a checklist row whose button leads nowhere.** Until Prompt 06, the WhatsApp row links to
`/connections`, where the tile carries its honest state and what it needs. A named next action that
dead-ends is a worse G1 violation than a less prominent one.

## 4.6 Authorization

Every activation mutation goes through a DAL-minted `Grant`, re-authorizing from zero. The existing
capabilities already cover it: `completeSignupAndActivation`, `configureAgentPersona`,
`editKnowledgeBase`, `selectLibraryVoice`, `setupCallForwarding`, `runTestConversation`,
`takeAgentLiveOrPause`, `configureEscalationRules`. **No new capability is needed** — which is itself
evidence the seam was designed for.

---

# PART 5 — THE LAW, AS IT APPLIES HERE

Everything from Prompt 01 Part 3 and Prompt 03 Parts 4 and 10 binds. Five rules bite hardest here.

**G2 — value before configuration.** The inversion. §0.4 Rule 3.

**G3 + G7 — nothing blocking that need not block; skip and resume always.** Exactly one step blocks.
Steps 1, 2 and 4 satisfy skippability _through template defaults_ — **a pre-filled default IS the skip.**

**G4 — every step says why.** Made literal: ten `.asidepane` rationale cards, one per step, ~150 words
each. They must **not** all ship on step 1 — that alone would breach the above-the-fold budget.

**G5 — no product tours.** Not anywhere in this flow.

**G22 — never less reachable than before.** The forwarding code is **not touched** by a sandbox test.
The sandbox pill and the _"Nobody is affected"_ copy must be **literally true**.

**G9 — the kill switch.** Place it in the console shell from the moment `GoLive.rung !== 'sandbox'`,
even though Prompt 11 owns the recovery flow behind it. Until then it routes to a minimal _"pause
completed, here is where calls are going now"_ confirmation. One tap from any screen, never in a menu.

---

# PART 6 — THE NINE STEPS

```
  PART ONE — MAKE IT YOURS                              (internal target: 6 min)
   w1  What does [Business] do?      6 tiles → loads a template
   w2  When are you open?            week grid + 3 after-hours options
   w3  What do you charge?           photo / type / import → typed price rows
   w4  How should it sound?          4 voices, each says YOUR greeting

  ★★★ PART TWO — HEAR IT WORK ★★★                       (internal target: 3 min)
   w5  Subiza calls YOUR phone now.  you are the customer. ask it something
   w6  Read it. Fix anything wrong.  corrections write straight through

            ── tenant.activated fires HERE, on transcript-viewed ──

  PART THREE — CONNECT IT                               (internal target: 10 min)
   w7  Who should it fetch?          ← THE ONLY BLOCKING STEP
   w8  Connect your phone            forwarding code + verification call
   w9  How much should it handle?    trust ladder, narrowest rung recommended

  PART FOUR — LATER, WHEN READY      a CHECKLIST ON HOME, never a wizard
   ○ WhatsApp   ○ Instagram   ○ Clone your voice
   ○ More knowledge   ○ Invite your team   ○ Add languages
```

**Nine steps. Six take under a minute.** Part Four is not part of this wizard.

## 6.1 Wizard mechanics from the prototype

Order `w1…w10`. Part tag in the header, lime (`tag-ok`) **only in part two**. Progress: **nine**
`aria-hidden` marks, three states, no numbers. Advance adds a loading state for ~520ms with the label
retained so the button never changes width. **Back links exist only on w2, w3, w4** — from w5 onward
there is no walking backwards. Autofocus the first real control after ~80ms with `preventScroll`.

A resume banner — _"We kept your place. You'd got as far as your prices. Nothing was lost — carry on
from there."_ — appears only when resuming.

---

# PART 7 — PART ONE: MAKE IT YOURS

## 7.1 w1 — What does [Business] do?

Six large tiles: **Shop · Salon or barber · Restaurant or bar · Clinic or pharmacy · Services and
repairs · Something else.** _(The aside "Six options, not three" belongs to this step and refers to
these tiles.)_ "Something else" opens a free-text field and loads a generic template — **never a dead
end**.

The business name is **inherited from signup**, not asked again (SC 3.3.7). It interpolates into the
heading as rich text, not string concatenation: English reads _What does **Salon Ubwiza** do?_,
Kinyarwanda puts the name first. Use `t.rich()`.

A `<details>` disclosure previews what the template loaded — rendered from the template **object**.

## 7.2 w2 — When are you open?

A seven-row week grid plus **three** after-hours options (not six). Prove the grid at 360px; it is the
densest control in the wizard.

## 7.3 w3 — What do you charge?

> **"A price is a field, not a paragraph."**

Three tabs: **photograph · type · import**. The typed `PriceRow` is the atlas's real innovation — a price
is a **typed field with a value and a currency, answered directly, never generated**.

**The OCR contract.** Output goes into a structured table with **per-row confidence**; only low-confidence
rows are flagged (threshold ~80–85%). Printed lists read at ~85%; handwritten ranges 46–95%. An
unreadable price becomes **`?`**, and the agent **escalates that service** until it is filled in. It
never rounds and never infers. **The confirmation table is compulsory, not optional.** Past ~40 rows the
system switches to retrieval.

**Nothing uploads until an on-device sharpness/glare/framing check passes.** Data can cost 60% of monthly
income; spending it on a photo already known to be unreadable is a small theft. Compress on-device, chunk,
resume from the last chunk, run in the background — **the wizard never blocks on the network.**

**The no-JS floor:** `<input type="file" accept="image/*" capture="environment">` inside a plain form
POST, with the three quality messages rendered server-side after upload. The client enhancement adds the
on-device canvas check so a bad photo never leaves the phone. **Same messages, two places, one copy
source.**

## 7.4 w4 — How should it sound?

Four library voices. **Each preview says the owner's actual greeting with their actual business name** —
not a demo sentence. _"Hearing 'Muraho, ni Salon Ubwiza' in a natural voice costs us nothing and does
real work — it is the first moment the product stops being an idea."_

**Nothing plays on its own** (WCAG 1.4.2, and autoplay is blocked on first visit anyway). **A rejected
`play()` promise must reveal the "Hearing nothing?" guidance** — a silent failure reads as a broken
product. Audio is **never preloaded**, on any connection, ever: native `<audio controls preload="none">`
with an accessible label and a transcript beside it.

**The owner's own cloned voice is not offered here.** It needs separate consent, a spoken verification and
30–60s of audio — all of which belong to Part Four and Prompt 09. Link to it; do not start it.

A starter **pronunciation dictionary** ships with every template, because Kinyarwanda is unsupported by
mainstream commercial TTS. It is a **required onboarding output, not an advanced setting.**

---

# PART 8 — ★ THE TEST CALL ★

> The company's entire conversion event. Give this your strongest agent.

## 8.1 It is specified twice — merge them

`activation.html` w5–w6 draws it as step 5. **`golive.html` t1–t8 and x1–x3 draws a more complete
version** — all three routes rendered, a teleprompter that follows the owner onto the call, a rate-limit
screen with real copy, and a platform-outage screen. `activation.html` alone is **missing** the browser
route, the carrier-failure state, the ring timer and every abuse state.

Build the merged version. Prompt 11 later adds only the persona suite (`t7`).

## 8.2 The abuse control that matters

> **The destination number is NEVER an input field.**

It resolves **server-side inside the DAL** from `TenantContext` to the tenant's OTP-verified +250 number.
An authenticated outbound-call trigger with a free-text number is an outbound-campaign machine, brushing
F12 — and render-time gating is not a security boundary, because requests can be sent without going
through the UI.

Changing that verified number is an **`elevated`**-strength operation under Prompt 03 §5.2, never `otp` —
it is the same class of change as the forwarding number and billing.

**Other limits:** one in-flight call per tenant, enforced by **token-bucket admission on in-flight
concurrency, not requests-per-minute** — RPM tells you nothing about occupied slots, which is what the
carrier and the GPU pool actually meter. The spend ceiling is denominated in **RWF computed from the live
carrier rate**, not minutes: the same 30 minutes costs ~RWF 1,500 on Africa's Talking and ~$16.58 on
Twilio, and a provider switch must not silently multiply exposure.

**Implement answering-machine detection.** It is absent from both design files and is the single biggest
silent credit burn — roughly 30% of answered outbound calls in 2026 are voicemail or OS call-screening
bots.

**Rate-limit copy gives minutes, not "later."** _"You can call again in 8 minutes."_

## 8.3 Three routes, independently implemented

> **"This step is not allowed to fail."**

| #   | Route                       | Notes                                                                                                                                                               |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **We call you**             | The default. Outbound to the verified number                                                                                                                        |
| 2   | **Test it in your browser** | **Genuine browser audio capture**, not a re-run of route 1. Native `RTCPeerConnection` + `getUserMedia` — **no WebRTC SDK**, the budget forbids it (~2–3KB of glue) |
| 3   | **You call us**             | A **real provisioned inbound number** that works from a **feature phone with no data**                                                                              |

Route 3 is the floor: it must work with **zero JavaScript**, and the transcript arrives as a normal page
render. The outbound route plus live transcript is the **enhancement**. That is how the >95% success
criterion and the JS-disabled law are satisfied together rather than traded off.

## 8.4 During the call

**No confidence number, percentage, bar or meter — anywhere, while the call is live.** Confidence
displays without an available action produce anxiety and overtrust. Confidence is used _after_ the call
only, to decide which turns get flagged, where it becomes _"Heard you less clearly"_ beside an editable
fix box.

**Interim ASR text appears immediately in a lighter style and is REPLACED by the final text, never
appended.**

**The accessibility defect to fix on the way in:** `golive.html` puts `aria-live="polite"` on a
word-by-word streaming transcript. That is a defect, not a feature — screen readers re-announce the whole
changed element, and at ~150ms per word it is unusable. **Finalised turns go into a `role="log"`
container, appended one whole turn at a time; interim text sits in an `aria-live="off"` visual layer.**

Ring timer, live duration, and the sandbox pill. The `.vote` circles are drawn at 30px and the pause
button at 32px — **enlarge or extend the hit area to 48×48.**

## 8.5 States

`ready` · `ringing` · `live` · `ended` · `no-answer` · `voicemail-detected` · `carrier-failed` ·
`rate-limited` · `platform-outage` · `offline`. **Every one carries a primary action and at least one
alternate route** — criterion 6.9 requires this at 100%, audited.

---

# PART 9 — w6: THE CORRECTION LOOP

> _"This is where the product teaches its own mind."_

The owner reads the transcript, flags what is wrong, and fixes it inline. **Corrections write directly to
the knowledge base, the rule set or the pronunciation dictionary and take effect on the very next test
call. Never a feedback queue.** That immediacy is what teaches the mental model, and it is why this loop
lives in activation rather than in settings.

Implement it as **one domain command** — `applyCorrection({ turnId, correctedText })` — that fans out to
`Knowledge` (a `QaPair` or a `PriceRow`), `AgentConfig.hours`, and `PronunciationEntry[]`. The fix box
explicitly does two of the three at once. When it adds a rule it sets `AgentConfig.needsConflictCheck`,
so Prompt 07's contradiction linter has a trigger.

Each turn offers _"Why did it say that?"_ with a source chip linking to the row it came from.

**Record the facts Prompt 11 will need, at the moment they occur:** `TestCall.durationSeconds`,
`pricesQuoted[]`, `transcriptViewedAt`, `PhoneChannel.verification.{verifiedAt, callerIdSurvived}`, and
the price-row count. Without them, `golive.html` cannot write _"a 54-second call"_ or _"it quoted 3 of
them on your test call"_, and falls back to the inventory phrasing it explicitly forbids.

---

# PART 10 — PART THREE: CONNECT IT

## 10.1 w7 — Who should it fetch? **(the only blocking step)**

**An agent that cannot fetch a human is not allowed to answer customers.** That is the argument, and it
is a functional test (criterion 6.13).

Phone field prefilled from the tenant. Plus a no-answer fallback with its own options. Reuse
`EscalationLadder`.

## 10.2 w8 — Connect your phone

**We cannot set call forwarding (P1) and cannot query forwarding status (P2).** So this step is guidance
plus an **active verification call** placed ~30 seconds after the owner dials — and that verification is
the delight moment:

> _"We just called your number. Subiza picked up after 20 seconds, exactly as it should."_

Reuse the generalised `ForwardingCodeCard`. Copy is the primary action. Tap-to-dial is an **Android-only
convenience that never auto-dials**; iPhone gets explicit copy-and-paste steps.

**Resolve the apparent contradiction in the asides.** _"The one step that can't be skipped"_ refers to the
verification being real rather than assumed; _"And it's skippable"_ is the product truth — an owner may
proceed to a sandbox-only agent. Skipping leaves the tenant at the sandbox rung with an honest note and a
checklist item.

**State an assumption Prompt 04 must name:** no design file resolves what happens to a forwarded call
_during_ opening hours when a time-blind `**61` registration meets an after-hours rung. Decide and write
it down — decline, voicemail, or ring through.

## 10.3 w9 — How much should it handle?

The trust ladder. **The recommended rung is the narrowest — "Only when I'm closed" — because it is the
decision with no downside.** Widening is something the owner reaches for later from the status pill.
**Narrowing must be one tap**, because reversibility is what makes widening safe to try. **We do not nag
anyone to widen.**

---

# PART 11 — PART FOUR: THE HOME CHECKLIST

Not a wizard. A checklist on Home, skippable, resumable, never blocking.

**It arrives part-done, with every tick genuinely earned** — endowed progress raised completion from 19%
to 34% in the Nunes & Drèze field experiment. **Exactly one item is highlighted.**

**WhatsApp goes first precisely because it cannot be finished today** — Meta's verification is 5–15
business days. It is the item worth _starting_ today. Its button links to `/connections`, where the tile
states honestly what it needs (§4.5).

---

# PART 12 — WIZARD ARCHITECTURE

**Route per step.** `apps/studio/src/app/(activate)/activate/[step]/page.tsx`, a server action per step,
React `<ViewTransition>` between them. Nine screens plus ten aside panes cannot fit the 200KB above-fold
budget as one bundle, and per-step RSC payloads give resume for free.

**Activation is NOT inside the `(console)` AppShell.** It is its own route group with no nav — the same
shape as auth. Extract Prompt 03's auth shell (`.auth`, `.authmain`, `.authaside`, `.authhead`,
`.authfoot`, `.prog`) into a shared `WizardShell`; `activation.html` reuses it verbatim, and its own CSS
block is literally labelled _"shell, SIGN-IN & RECOVERY"_.

**State is server-persisted after every step.** The cursor is **derived** from which documents have
content; only the skip-set needs storing. No client-only wizard state — the JS-disabled law forbids it.

**Every step action is idempotent**, so a double-submit cannot duplicate a price row or place two calls.
Validate server-side with zod, return field-level errors through `useActionState`, announce them
accessibly, and `redirect()` to the next step.

**Guard a step the owner has not reached**, and make an unreachable step a type error via `typedRoutes`.

**Real-time for w5:** stream from a Route Handler, reconnect on drop, and fall back to route 3's plain
page render when JavaScript is unavailable.

---

# PART 13 — RESUME & ABANDONMENT

Progress saves per step, server-side; Home resumes at the exact step. Resume prompts at **1h, 24h and
72h** — SMS then WhatsApp, **three total** — then **day 30 hands the tenant to a human**, because
automated reactivation past 30 days converts under 5%.

Resume must work from a **cold device**, not just a returning browser.

---

# PART 14 — THE ACTIVATION EVENT

Emit the **twelve atlas §11 events from server actions, not client handlers**, so they survive the
JS-disabled path.

**`tenant.activated` fires exactly once per tenant, from the DAL, in-transaction, never from a client,
and requires BOTH the call completed AND the transcript viewed.** It fires on `transcriptViewedAt`, not
on call completion — the flow map is explicit that it needs both.

It is content-independent: a tenant who thumbs-down every turn is still activated. That is what makes the
metric honest rather than flattering.

---

# PART 15 — STATES, i18n, PERFORMANCE

The eight states everywhere, plus the ten test-call states in §8.5. Every terminal state carries a
primary action and an alternate route.

Every string in `activation.html` carries a Kinyarwanda twin in `data-rw`. **Transcribe; do not
re-translate.** Prove every step at 360px in `rw` — the week grid and the price table are the highest
risk. Use `t.rich()` for the business-name interpolation; never concatenate.

The ten aside panes must **not** all ship on step 1. Load each with its step. Under `Fidelity.lite`:
drop the waveform to static bars, never preload audio, and keep route 3 fully available — a 2G owner must
still be able to activate.

---

# PART 16 — VERIFICATION

| Audit            | Pass condition                                                                     |
| ---------------- | ---------------------------------------------------------------------------------- |
| Seam             | Prompts 05–11 can be described as "add a Surface"; no step declares a domain shape |
| No-JS            | All nine steps, including photo upload and route 3                                 |
| Blocking         | Only w7 blocks; all others skippable                                               |
| Destination      | No phone input on w5; grep proves it                                               |
| Concurrency      | Two simultaneous calls for one tenant impossible                                   |
| Spend            | Ceiling in RWF; breaker trips                                                      |
| Voicemail        | AMD stops the burn                                                                 |
| Routes           | Kill 1 → 2 works; kill 2 → 3 works; 3 works on a feature phone                     |
| Confidence       | No number, bar or meter during a live call                                         |
| Transcript a11y  | `role="log"` finalised; interim `aria-live="off"`                                  |
| Audio            | Nothing autoplays; rejected `play()` shows guidance; no preload                    |
| Activation event | Fires once, in-transaction, only after transcript-viewed; not from a client        |
| Corrections      | Affect the very next call                                                          |
| OCR              | Unreadable → `?` → that service escalates                                          |
| Upload           | Blurry photo never leaves the device                                               |
| Duration         | No minute count anywhere in the catalogues                                         |
| Checklist        | Part-done, exactly one highlighted, no dead-end buttons                            |
| Kill switch      | Reachable from every console screen once live                                      |
| Budget           | ≤200KB above fold per step; LCP ≤4s on 3G                                          |
| rw @ 360         | No overflow on any step, both themes                                               |

## 16.1 The adversarial pass

A **different agent from every author**. Try to: burn a tenant's credit in a loop · place a call to a
number that is not the verified one · fire `tenant.activated` without viewing a transcript · reach w9
without completing w7 · double-submit a step into duplicate state · resume into another tenant's draft ·
get a price into the knowledge base that the owner never confirmed.

---

# PART 17 — DELIVERABLES & NEXT

1. **`packages/domain`** — 11 schemas, validators, transitions
2. The **Step/Surface contract** and the five shared components
3. Six business templates + a generic one, as data in `packages/fixtures`
4. `WizardShell` extracted from the auth shell
5. Nine steps as nine routes, resumable, server-persisted, no-JS
6. The merged test call — three routes, ten states, AMD, RWF ceiling
7. The correction loop writing through to knowledge / rules / pronunciation
8. `GeneralisedForwardingCodeCard` + the verification call
9. The Home checklist, part-done, one highlight
10. Read-only console surfaces at `/agent`, `/agent/knowledge`, `/agent/voice`, `/connections`
11. Twelve server-side events; `tenant.activated` correct by construction
12. The adversarial report

**Prompt 05** — Phone connection (`Design/phone.html`): path A/B, the four forwarding scopes, network
detection, the iPhone three-step form, voicemail-replacement warnings, four verification outcomes, the
troubleshooting ladder, and weekly re-verification. It mounts a `Surface` beside the `Step` you built
here. Say **next**.

---

# PART 18 — APPENDIX

## A — The seam, drawn

```
   ACTIVATION (Prompt 04)              THE DOCUMENTS              LATER EDITORS
   owns: a cursor + a skip-set         packages/domain            (Prompts 05-11)

   w1 business type ──┐
   w2 hours ──────────┼──────────────► AgentConfig ─────────────► agent.html    (07)
                      │                                            Simple/Advanced
   w3 prices ─────────┼──────────────► Knowledge ───────────────► knowledge.html (08)
                      │                 PriceRow[]                 full editor
                      │                 QaPair[]
                      │                 PronunciationEntry[]
   w4 voice ──────────┼──────────────► VoiceSelection ──────────► voice.html    (09)
                      │                                            + cloning
   w5 test call ──────┼──────────────► TestCall ────────────────► golive.html   (11)
   w6 corrections ────┘                 fans back into Knowledge   + persona suite
                                        AgentConfig, Pronunciation
   w7 escalation ────────────────────► EscalationRota ──────────► flow 15       (14)
   w8 phone ─────────────────────────► PhoneChannel ────────────► phone.html    (05)
   w9 go-live scope ─────────────────► GoLive.rung ─────────────► golive.html   (11)

   NOT EMBEDDED:  flow 08 channels → a Home checklist row only
                  flow 12 language → set at signup, only READ here

   ═══ each feature exports <Step> and <Surface> over ONE module ═══
   ═══ prompts 05-11 add screens beside the Surface.              ═══
   ═══ they never touch the Step.                                 ═══
```

## B — The inversion

```
   EVERYONE ELSE
   ┌──────────────┐   ┌───────────┐   ┌──────────────┐
   │ connect the  │──►│ configure │──►│ hope they    │
   │ hard thing   │   │           │   │ stay         │
   └──────────────┘   └───────────┘   └──────────────┘
    Meta: 5-15 days
    carrier KYC, OTP
    GSM codes           ▲
                        └── most people never get past here

   SUBIZA
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │ configure    │──►│ ★ HEAR IT    │──►│ connect      │
   │ 2 min,       │   │   WORK ★     │   │              │
   │ templated    │   │              │   │              │
   └──────────────┘   └──────────────┘   └──────────────┘
                        ▲
                        └── activation happens HERE,
                            before anything external is touched

   "Asking a shop owner to dial a forwarding code before they have any
    evidence the product works is asking for faith. Asking after they
    have heard it quote their own prices in Kinyarwanda is asking for
    a small favour."
```

## C — The test call cannot fail

```
                        ┌─────────────────────────────┐
                        │  destination = TenantContext │  never an input.
                        │  .verifiedNumber             │  never a free-text field.
                        └──────────────┬──────────────┘
                                       ▼
          ROUTE 1 ─ we call you ─────────────────────► ringing → live → ended
            │  outbound, AMD on, RWF ceiling,              │
            │  one in-flight per tenant                    │
            │                                              │
            ├─ no answer / voicemail / carrier fail ──┐    │
            ▼                                          │    │
          ROUTE 2 ─ test in your browser               │    │
            │  native RTCPeerConnection + getUserMedia │    │
            │  NO WebRTC SDK (budget forbids it)       │    │
            │                                          │    │
            ├─ no mic / no permission / no JS ─────────┤    │
            ▼                                          │    │
          ROUTE 3 ─ you call us  ◄────────────────────┘    │
               a REAL provisioned inbound number            │
               works from a feature phone, zero data,       │
               zero JavaScript. transcript arrives as a     │
               normal page render.          ────────────────┤
                                                            ▼
                                          ┌──────────────────────────────┐
                                          │  w6 READ THE TRANSCRIPT      │
                                          │  fix anything wrong →        │
                                          │  writes straight through     │
                                          └──────────────┬───────────────┘
                                                         ▼
                                       ══ tenant.activated ══
                                       call completed  AND  transcript viewed
                                       in-transaction, from the DAL, once.
                                       content-independent.
```

---

_Prompt 04 · Subiza · Guided Activation_
_Built against `Design/activation.html`, `Design/golive.html`, atlas Flow 06, and docs 06 and 07._
_Where this document and either prototype disagree, this document wins._
