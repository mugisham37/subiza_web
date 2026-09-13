# SUBIZA — BUILD PROMPT 06

## Messaging Channel Connection

> **This is the only flow where an external party owns the majority of the screens, owns the clock, and
> gives back almost no telemetry.**
>
> The design's whole strategy is to move every failure Meta would deliver _inside its own popup_ onto a
> Subiza screen _before_ the popup opens.
>
> **Two platform deadlines fall inside the next 32 days. Read Part 2 first.**

|                    |                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Prompt**         | 06 of the series — Messaging channel connection                                         |
| **Corresponds to** | `Design/channels.html` · atlas Flow 08 · flow 1.5 in `Design/PROGRAMME.md`              |
| **Builds on**      | Prompts 01–05, all built                                                                |
| **Scope**          | Creates `packages/domain/src/channel.ts` and the whole Surface. **No Step to preserve** |
| **Apps**           | `apps/studio` · `packages/domain` · `packages/auth-tenant` · `packages/ui`              |
| **Screens**        | **15** — `hub`, `tg1`–`tg2`, `wa1`–`wa9`, `ig1`–`ig2`, `brk`                            |
| **Next prompt**    | 07 — Agent design (`Design/agent.html`)                                                 |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next, and why it differs

`PROGRAMME.md` 1.5 follows the now-built 1.4. Prompts 01–05 are all **written and built** —
`phone-channel.ts` reached 450 lines and `(phone)/connections/phone/[step]` is live.

Two things make this one unlike Prompt 05:

**There is no Step to preserve.** Prompt 04 _deliberately excluded_ channels from activation — flow 08
appears there only as a Home checklist row. So `packages/domain/src/channel.ts` does not exist, and this
prompt creates the domain document **and** the Surface from nothing. `phone-channel.ts` is your model.

**Almost nothing here is under our control.** Meta owns the popup, the queue, the verification, the
pricing and the rules. The engineering problem is _modelling someone else's state machine with no read
access to it_.

## 0.2 Phases

```
  ┌─ PHASE A ─ THE CLOCK ─────────────────────────────────────────┐
  │  A1 Confirm BSP tier (§7) — COMMERCIAL, blocks the whole path  │
  │  A2 Build Embedded Signup v4 ONLY. v2 dies 15 Oct.             │
  │  A3 Surface the 1 Oct service-billing change                   │
  │  A1 is a decision, not code. Start it today.                   │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ DOMAIN ────────▼───────────────────────────────────┐
  │  packages/domain/src/channel.ts — the Prompt 05-class document │
  │  Every platform number as a named constant. No figure in copy. │
  │  SEQUENTIAL. Everything imports it.                            │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ EASY FIRST ────▼───────────────────────────────────┐
  │  C1 the hub   C2 Telegram (tg1, tg2)                           │
  │  Telegram is the proof-of-life. Ship it working before Meta.   │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ WHATSAPP ──────▼───────────────────────────────────┐
  │  wa1 pre-flight · wa2 routes · wa3 coexistence · wa4 handoff   │
  │  wa5 abandon · wa6 waiting · wa7 name · wa8 payment · wa9 done │
  │  NINE SCREENS. Your strongest agent. The 30-second TTL is the  │
  │  hardest technical constraint in the product.                  │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ INSTAGRAM + REPAIR ▼───────────────────────────────┐
  │  ig1 personal→professional · ig2 limits · brk one-tap repair   │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE F ─ PLUMBING ──────▼───────────────────────────────────┐
  │  Webhooks, idempotency, token lifecycle, health, isolation     │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE G ─ PROOF ─────────▼───────────────────────────────────┐
  │  G1 no-JS  G2 a11y  G3 isolation  G4 idempotency  G5 rw@360    │
  │  G6 copy audit (no "instant")  G7 adversarial                  │
  └───────────────────────────────────────────────────────────────┘
```

## 0.3 Agents

| Agent                    | Owns                       | Must be told                                                                                    |
| ------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------- |
| **Commercial lead**      | A1. The BSP tier decision. | This is not code. It decides whether the highest-value channel in the market is open or closed. |
| **Domain architect**     | Phase B.                   | Every platform number is a named constant. A figure typed into copy is a defect.                |
| **Telegram engineer**    | Phase C.                   | This one actually works end to end. Make it the proof.                                          |
| **WhatsApp engineer**    | Phase D.                   | Nine screens. The code lives 30 seconds. Never retry an expired exchange.                       |
| **Instagram engineer**   | Phase E.                   | Refusing the human-agent tag obliges you to ship the migration offer.                           |
| **Plumbing engineer**    | Phase F.                   | "Not idempotent, so we make it so." Write-ahead claim before the send.                          |
| **Adversarial reviewer** | G7. **Never an author.**   | Try to send a second private reply, and to break one channel by breaking another.               |

## 0.4 Three rules

**Rule 1 — Move Meta's failures forward.** Every constraint the owner would hit inside Meta's popup gets
stated on a Subiza screen _before_ the popup opens. That is the entire design thesis.

**Rule 2 — Never claim knowledge you do not have.** Meta pushes no revocation notice. Detection is
reactive. The banner says _"since 14:20"_, never _"detected instantly"_.

**Rule 3 — One channel down never touches the others.** Per-channel credentials, health, queues and
circuit breakers. A broken Instagram renders one error row while the hub, the phone and WhatsApp render
normally — **and the banner says so.**

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A business owner can connect Telegram in two minutes, start WhatsApp's 5–15 working-day clock on day
one knowing exactly what is coming, convert an Instagram personal account and see its real limits before
being surprised by them — and when any channel silently dies, find out within five minutes and fix it in
one click.

## 1.2 Definition of done — twenty-six criteria

| #   | Criterion                                                                                | Proven by                                                  |
| --- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | `packages/domain/src/channel.ts` exists, registered in `index.ts` and `DOMAIN_DOCUMENTS` | Import graph                                               |
| 2   | **No platform figure is typed into copy** — all are named domain constants               | Grep for `180`, `24`, `250`, `1000`, `30` in the catalogue |
| 3   | Embedded Signup is **v4**; no v2 code exists                                             | Grep                                                       |
| 4   | The 30-second code exchanges server-side immediately, with no page navigation between    | Code path audit                                            |
| 5   | An expired exchange is **never retried** — it shows a plain explanation and a relaunch   | Failure path test                                          |
| 6   | Embedded Signup is **never** modelled as resumable                                       | No resume pointer into Meta's flow exists                  |
| 7   | The `CANCEL` event's `current_step` is captured and narrated                             | _"You got as far as verifying the number"_                 |
| 8   | All five coexistence limits render **before** the tap                                    | Copy audit                                                 |
| 9   | Coexistence unavailability is detected **immediately**, never mid-sync                   | Simulated unavailable region                               |
| 10  | **No "instant" claim appears on any Meta path**                                          | Copy audit (criterion 8.4)                                 |
| 11  | Meta's AI-ban clause is quoted **verbatim**, not paraphrased                             | Copy audit                                                 |
| 12  | **No WhatsApp conversation data trains any cross-tenant model**                          | Architecture audit — §6.2                                  |
| 13  | A private reply persists a claim **before** the send, unique on `(tenantId, commentId)`  | DB constraint + ambiguous-outcome test                     |
| 14  | An ambiguous private-reply outcome resolves to **do-not-resend**                         | Timeout test                                               |
| 15  | `HUMAN_AGENT` is **unreachable from the agent code path**                                | Type-level test                                            |
| 16  | An Instagram window never closes on an unresolved conversation without a migration offer | Criterion 8.8, 100%                                        |
| 17  | Disconnection is visible within **5 minutes**, reconnect is **one click**                | Timed test                                                 |
| 18  | Health banners never imply instant knowledge                                             | Copy audit                                                 |
| 19  | Breaking one channel leaves the others rendering normally, and says so                   | Isolation test                                             |
| 20  | The onboarding throttle is a **server-side counter with a truthful queue position**      | Load test                                                  |
| 21  | Webhooks verify `X-Hub-Signature-256` against the **raw** body                           | Tamper test                                                |
| 22  | Webhooks enqueue and return 200 within 3s; no model call inside the cycle                | Timing test                                                |
| 23  | Deduplication is on the platform message id; ordering is by **timestamp**, not arrival   | Replay + out-of-order test                                 |
| 24  | Every platform error becomes plain language in all locales                               | Criterion 8.11, 100%                                       |
| 25  | Everything except the Meta popup works with JavaScript disabled                          | Playwright, with the popup exception documented            |
| 26  | `/connections/messaging/...` does not collide with the existing `/connections/phone`     | Build passes                                               |

## 1.3 Not in this phase

Web chat and SMS — they appear on the hub as honest _"Not connected"_ / _"Later"_ rows and go nowhere.
The conversations inbox (Prompt 13). Template message composition. Any WhatsApp marketing broadcast
(**F13**, barred in Rwanda).

---

# PART 2 — THE CLOCK

> **Two Meta deadlines fall inside the next 32 days. Both change what you build, not just when.**

| Date            | Change                                                                                      | What it forces                                                                                                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1 Oct 2026**  | **Service messages become billable.** Only **1,000 free per number per month, non-rolling** | Every free-form AI reply inside the 24-hour window past #1,000 costs the Rest-of-Africa utility rate plus BSP markup. **For a user whose data can cost 60% of monthly income, an invisible per-reply charge is a trust-destroying event.** It must be surfaced in the console _before_ it starts |
| **15 Oct 2026** | **Embedded Signup v2 is switched off**                                                      | **Build v4 only.** Any v2 code shipped now is dead on arrival                                                                                                                                                                                                                                    |

Also confirmed and material:

**The onboarding throttle is ours, not the tenant's.** 10 new business customers per rolling 7 days
until Subiza completes Business Verification + App Review + Access Verification, then 200. Every attempt
burns a slot from a **shared pool**. At pilot scale that is a hard ceiling of ~10 WhatsApp connections a
week. Build it as a server-side counter with a queue and a truthful _"you are number N in line"_ screen.

**A competitive fact worth escalating beyond this prompt:** **Meta Business Agent launched globally on
3 June 2026.** Meta now ships a version of Subiza's product inside WhatsApp itself. That does not change
this build, but it changes the strategy conversation.

---

# PART 3 — CONTEXT ABSORPTION

| #   | Read                                                              | Extract                                                                                                          |
| --- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | `Design/channels.html` — **both modes**                           | 1,686 lines. 15 screens, 8 aside panes, 9 spec sections. Line 981 is a 65KB sprite — skip it                     |
| 2   | `subiza-flow-atlas/flows/08-flow-messaging-channel-connection.md` | The authoritative sequence, §10 criteria, §13 instrumentation                                                    |
| 3   | `subiza-flow-atlas/flows/04-platform-constraints.md`              | Every **W-**, **I-**, **M-** and **T-**numbered constraint                                                       |
| 4   | `packages/domain/src/phone-channel.ts`                            | **450 lines. The model you are copying.** Note the `OPENING_HOURS_FORWARD_POLICY` named-assumption comment style |
| 5   | `apps/studio/src/features/phone/{actions,load,steps}.ts`          | The four-file feature pattern to mirror                                                                          |
| 6   | `docs/08-messaging-channels.md`                                   | The technical shape of each integration                                                                          |
| 7   | `prompts/05-phone-connection.md` Part 3                           | How an inherited-defect audit reads. You will write one for Prompt 07                                            |

## 3.1 The gate

1. What exactly did Meta ban in January 2026, and why is Subiza on the permitted side?
2. What is the _other_ prohibition in that same clause, and why is it an architecture problem?
3. How long does the Embedded Signup code live, and what must never happen after it expires?
4. Why can a private reply never be retried?
5. Which BSP tier decision determines whether WhatsApp is reachable by a Kigali salon at all?

An agent that cannot answer #2 must not design the data model.

---

# PART 4 — WHAT YOU INHERIT

## 4.1 Reuse

`packages/ui` — the full design system including `ChannelTile`. `packages/core` — `ViewState<T>`, branded
ids, `Fidelity`, formatters, `claims` (pull `metaVerificationMin/Max` from here, do not redeclare),
`capabilities`. `packages/auth-tenant` — the DAL, `TenantContext`, the audit wrapper, `emit()`.

## 4.2 `ChannelTile` needs extending

| Gap                | Add                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Two missing kinds  | `sms` (icon `mails`) and `web` (icon `globe`) — both already in the sprite                                                                                                      |
| **A fifth status** | **`waiting`** — "waiting on a third party". Map to a **neutral** tone with an hourglass, **not `warn`** — amber wrongly implies the owner must act during a 5–15-day Meta queue |
| No timestamp slot  | `since` — for _"Disconnected since 14:20"_                                                                                                                                      |
| Bespoke buttons    | `cta` — so the hub does not carry five hand-built `Button` constructions                                                                                                        |

Note the hub rows in the design are `.chanrow` — an **interactive `<button>`** with a hover lift — not
`.chan`, a static `<article>`. Decide deliberately whether to extend `ChannelTile` to an interactive
variant or add a sibling; do not silently render a non-interactive tile where the design has a control.

## 4.3 The route collision — read before scaffolding

**`/connections/phone/*` already exists** under the `(phone)` route group. A sibling `[channel]` dynamic
segment at the same level **will collide with the literal `phone`**.

Use **`/connections/messaging/[channel]/[step]`**, or fold phone into a shared group. Decide once, in
Phase B, before any route file exists.

---

# PART 5 — THE PLATFORM PROHIBITIONS

All of Prompts 01/03/04/05's law binds. These bite hardest here, and each is now verified against live
sources.

| #       | Prohibition                                     | Verified detail                                                                                                                                                                                                 |
| ------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F1**  | We cannot register a business's WhatsApp number | The popup creates the number on the SME's own WABA in the SME's own session. **No API path exists**                                                                                                             |
| **F2**  | They must personally receive and enter the OTP  | SMS by default, or voice with a 6-digit PIN for landlines. The page must survive the owner walking away for three minutes — **and must not hold a live 30-second code while they do**                           |
| **F3**  | No general-purpose AI assistant on WhatsApp     | In force since 15 Jan 2026. **Subiza is on the permitted side** — see Part 6                                                                                                                                    |
| **F4**  | No messaging an Instagram user outside 24 hours | **No template. No escape hatch of any kind.** Sends fail with error `10/2534022`                                                                                                                                |
| **F5**  | The AI must never apply `HUMAN_AGENT`           | Meta prohibits automated use **and actively detects it**; penalty is account suspension. **A genuine human on the rota MAY use it** — and it is the only way a shop closed over the weekend answers a Monday DM |
| **F6**  | One private reply per comment, ever             | Within **7 calendar days** of `created_time`. A second attempt returns `100/2534025` and **is not retryable** — the comment is permanently spent                                                                |
| **F8**  | No same-day WhatsApp go-live                    | **3–15 business days**, and **each resubmission resets the clock**. Kinyarwanda/French documents may need officially stamped English translations first                                                         |
| **F13** | No WhatsApp marketing broadcast in Rwanda       | Until W18 is verified                                                                                                                                                                                           |

**One correction to the project's own numbers:** the messaging-tier ladder is
**250 / 2,000 / 10,000 / 100,000 / unlimited** — not 1K. Fix it wherever it appears.

**A platform requirement the atlas treats as a feature:** WhatsApp's Business Messaging Policy requires
automation inside the 24-hour window to be accompanied by _"prompt, clear, and direct escalation paths"_
to a human. **Subiza's escalation rota is a platform compliance requirement, not a product nicety.**

---

# PART 6 — THE AI BAN, READ PROPERLY

## 6.1 Why Subiza is legal

The clause, verbatim from the WhatsApp Business Solution Terms:

> _"Providers and developers of artificial intelligence… are strictly prohibited from accessing or using
> the WhatsApp Business Solution… for the purposes of providing, delivering, offering, selling, or
> otherwise making available such technologies when such technologies are the **primary (rather than
> incidental or ancillary)** functionality being made available for use."_

| Banned                                                                                                         | Not banned                                                                                                            |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| WhatsApp as a distribution channel for a general-purpose assistant — a chatbot people talk to for its own sake | A business whose product is haircuts, using an agent to answer questions about **its own** hours, prices and bookings |

The terms explicitly permit a business to _"retain an AI Provider as your Third Party Service
Provider"_ — that is Subiza's path, and Meta confirmed to press that business customer-service bots are
unaffected. **Rwanda is not in the EEA/Brazil carve-out** (where Meta charges AI providers per message
instead of blocking them), so Subiza relies **entirely** on the TPSP reading.

**Quote Meta's own words on the connected screen.** A tenant who has half-heard about a ban and gets no
answer will assume the worst — and the honest answer here is genuinely reassuring, which makes hiding it
doubly foolish.

_One nuance for internal honesty: the widely-cited 15 January 2026 enforcement date is well corroborated
in independent reporting but does not appear verbatim in the terms text._

## 6.2 The prohibition that is **not** in the atlas

> **Business Solution Data — "including any anonymous, aggregate, or derived forms" — may NOT be used to
> create, develop, train or improve any AI model.** The only exception is a fine-tune _"for your
> exclusive use"_ — meaning the individual tenant's. **"This Section survives termination."** Penalty:
> account termination and revoked access.

**So Subiza may not pool WhatsApp conversation data across tenants to improve its Kinyarwanda model,
even anonymised.**

That is a hard architectural constraint on the company's stated language moat, it is absent from the
flow atlas, and it must be enforced in the data layer — not in a policy document. Tag WhatsApp-sourced
data at ingestion and make cross-tenant training paths structurally unable to read it.

**Escalate this to the founder.** It touches strategy, not just this flow.

---

# PART 7 — THE PAYMENT WALL

> **The single most consequential commercial finding in this flow, and it is a partner-tier decision
> rather than a design one.**

Meta bills **the business**, not the software vendor. In a market with almost no card penetration, that
is a wall in front of the highest-value channel — and it collides head-on with **F14/G18**, the promise
that Subiza never requires a card.

| Tier                 | Billing relationship                                                                                                                          | What it means for a Kigali salon                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Tech Provider**    | _"Clients onboarded by Tech Providers must provide their own payment method after onboarding is complete. Meta will then bill these clients"_ | **Every owner needs an international card. Most do not have one. The channel is effectively closed to them** |
| **Solution Partner** | Holds a credit line with Meta; can consolidate billing and invoice clients directly                                                           | **We pay Meta, the owner pays us by MoMo, and no card is ever needed**                                       |

**Building directly as a Tech Provider puts a card wall in front of the highest-value channel in the
market. Building on a BSP that already holds Solution Partner status removes it entirely.**

Confirm the tier distinction directly with whichever BSP is evaluated — the source is a partner's
documentation rather than Meta's own partner pages — but the direction is clear and the stakes justify
checking properly. **This is Phase A1 and it is not code.**

**Until that is resolved**, screen `wa8` states plainly that a card is needed, **refuses to minimise it**
(_"we won't pretend it's a small thing"_), and always offers the dignified exit: _"I don't have a card —
let me use the other channels."_

---

# PART 8 — THE HUB

**Heading:** _"Where do your customers message you?"_
**Sub:** _"None of these are needed for Subiza to answer your phone — that already works. Connect only
the ones your customers actually use, whenever suits you."_

That sub-line is G4 and G7 stated in two sentences: nothing here is on the critical path, and the phone
already answers.

**Five rows, in this deliberate order:**

| #   | Channel               | Detail                                                        | Status                                                                                                    |
| --- | --------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | **Telegram**          | _Two minutes. No review, no waiting, nothing to pay_          | **Start here** _(the only lime tag on the page)_                                                          |
| 2   | **WhatsApp Business** | _Ten minutes of your time, then Meta takes 5–15 working days_ | **Start it today** _(amber — a different kind of recommendation: start the clock, don't expect a result)_ |
| 3   | **Instagram**         | _Five minutes. Needs a professional account_                  | Not connected                                                                                             |
| 4   | **Web chat**          | _Instant. Copy a snippet, or just take a link_                | Not connected _(goes nowhere this phase)_                                                                 |
| 5   | **SMS**               | _Three weeks. MTN and Airtel register sender IDs separately_  | **Later** _(dashed, greyed)_                                                                              |

**The ordering rationale is on the page and must survive:**

> _"The order matters. Telegram first because it proves the messaging side works with zero friction;
> WhatsApp next because it's the most valuable and the slowest, so its clock should start early."_

The phone connection stays at the top of the real console hub — the copy leans on _"that already works"_.

At 360px the status tag drops to its own line.

---

# PART 9 — TELEGRAM

The easy one, and therefore the proof-of-life. Two screens: `tg1` (managed, one tap) and `tg2` (_"the
older way — two minutes"_ — BotFather, paste a token).

Record which was used: `telegram.bot_created { mode: 'managed' | 'botfather' }`.

**A silent failure specific to Telegram:** a Business Bot can be paused **per chat** with no notification
at all. That belongs in the health model (§12).

---

# PART 10 — WHATSAPP: NINE SCREENS

## 10.1 `wa1` — Three questions before we start

A pre-flight that screens out three different wasted journeys.

**"The second question is the whole trick"** and **"The third prevents a pointless wait"** — reproduce
both arguments on the aside. Each question exists to move a Meta failure forward.

`.qcard .qa` buttons are drawn at min-height 42 — **raise to 48**.

## 10.2 `wa2` / `wa3` — Three ways forward, and coexistence

> _"Three ways forward, and none of them is right for everyone."_ — and the aside **"We don't choose for
> you."** Present the trade-off; do not pick.

**"The bad news is at the top."** Front-load the constraints.

**Coexistence is one-shot and not retryable.** 24 hours to complete; on failure the number must be
**fully offboarded and the whole signup redone**. All five limits render **before** the tap — this is an
audited criterion:

`COEX_HISTORY_DAYS = 180` (3 phases) · `COEX_WINDOW_HOURS = 24` · `COEX_MEDIA_DAYS = 14` ·
groups + status + calls **never** · `COEX_THROUGHPUT_MPS = 20`

**Coexistence availability in Rwanda is unconfirmed** — Meta shipped Nigeria and South Africa in April
2026, country by country. Detect unavailability and say so **immediately**: _"we'll tell you immediately
and move you to one of the other two routes — you won't discover it halfway through."_

## 10.3 `wa4` — Meta takes over from here

**The 30-second code TTL is the hardest technical constraint in the product.** The exchangeable token
code is single-use and dies in 30 seconds. It goes **straight from the popup callback to a Subiza server
action** — no user-mediated hop, no confirmation screen, no page navigation between receipt and
exchange. **It must never be retried after a timeout.** A missed exchange gets _"a plain explanation and
a relaunch, never a raw error."_

**Pre-fill everything.** Business name, category, address and number can be injected, which _"can
significantly reduce the number of screens"_ — so Meta's screens become confirmation taps. **"We pre-fill
first."**

**Embedded Signup cannot be resumed.** No provider can resume mid-window; it restarts from the beginning
for everyone. **Never persist a resume pointer into Meta's flow.** `current_step` is display-only
narrative.

The `.platstrip` states F1/F2 in the product's own voice and must survive verbatim:

> _"We cannot receive that code for you — nobody can, and any product claiming otherwise is describing
> something else."_

**The popup is a genuine no-JS exception.** It is Meta's window, Meta's DOM, English-only and unskinnable.
Everything _around_ it must still work without JavaScript, and the no-JS path degrades to an honest
explanation plus an alternative (_Telegram now, WhatsApp when you have a browser that can open it_) —
**never a blank or broken screen.** Document the exception explicitly; do not let it erode the law
elsewhere.

## 10.4 `wa5` — We'll start it again

The abandonment path. The `CANCEL` event carries `current_step`, `error_code` and `session_id` — so the
copy can say _"you got as far as verifying the number"_. Since resuming is impossible, spend the effort
on **preparation**: have the phone in hand, the SMS takes a minute.

## 10.5 `wa6` — The 5–15 day wait

**This screen deliberately has no primary action** — only a secondary _"Back to connections"_ — because
there is genuinely nothing the owner can do. **The screen says so instead of inventing a button.** That
is G1 honoured, not violated.

The `banner-ok` is **mandatory, not decorative**: _"Your phone is being answered today. Telegram works."_

**"We can't see inside that window."** Model the wait as an opaque interval with a wide, honest range.
Notify on WhatsApp/SMS, never email (G17). Never nag.

## 10.6 `wa7` — The display name

Meta's rules, what is pre-filled, and what gets rejected and why. Hold rejection causes as a domain
constant.

## 10.7 `wa8` — The payment wall

Part 7.

## 10.8 `wa9` — Connected

**Print Meta's real limits rather than letting them be discovered by failure.** The 24-hour window,
template categories, the corrected tier ladder, quality rating, and the **1,000-free-service-messages**
allowance with its 1 Oct billing change.

**"Showing the limits is a decision."** Reproduce the argument.

Quote the AI-ban clause verbatim here (§6.1).

---

# PART 11 — INSTAGRAM

## 11.1 `ig1` — Your Instagram is a personal account

No software can read DMs on a personal account. Conversion is **owner-performed in the Instagram app**;
we can only instruct and re-check. The CTA is _"I've switched — check again"_ — **a poll, not a submit**
— so _still personal_ is a first-class state.

**No Facebook Page is required.** Use the Instagram API with Instagram Login, scopes
`instagram_business_basic` + `instagram_business_manage_messages`. **Do not reintroduce a Page step**;
the older Messenger-Platform route is explicitly rejected.

## 11.2 `ig2` — What Instagram allows, and what it doesn't

**Instagram is the strictest of the three.** The 24-hour window cannot be extended by payment — _"No such
thing exists."_ There is no template. `ACCOUNT_UPDATE`, `CONFIRMED_EVENT_UPDATE` and `CUSTOMER_FEEDBACK`
are explicitly unavailable on the IG Messaging API.

**So Subiza structurally cannot re-open an Instagram conversation.**

## 11.3 The obligation that follows

Subiza refuses to let the AI use `HUMAN_AGENT` (**F5**). That refusal creates a duty:

> **An Instagram window may never close on an unresolved conversation without a migration offer to
> WhatsApp or SMS. 100%, criterion 8.8. Refusing the tag without shipping the migration offer makes the
> product worse than a cheating competitor.**

Enforce F5 **structurally**: the tag must not be _expressible_ in the outbound-message type for
agent-authored sends. The human-reply code path may set it; the agent path cannot reach it.

## 11.4 Private replies are not idempotent

A second send to the same comment returns a **hard error, not a no-op**, and the comment is permanently
spent.

**Persist a write-ahead claim keyed on `(tenantId, commentId)`, DB-unique-constrained, written BEFORE
the call and consulted before any retry path runs.** Ambiguous outcomes — timeout, unknown — resolve to
**do-not-resend**. Criterion 8.9: _"enforced by our own state, not the platform's."_

Emit `instagram.private_reply_recorded { commentId }` so the rule is observable.

Instagram access tokens last **60 days** — proactive refresh ahead of expiry, with _"token expiring"_ as
a **distinct visible state** alongside _"disconnected, detected reactively"_.

---

# PART 12 — `brk` — SILENT DISCONNECTION

> _"Silent disconnection is the worst failure here."_

**Neither Meta nor Instagram pushes a revocation notice.** Detection is reactive, from the first failed
send. Visible within **5 minutes** (criterion 8.5). Reconnect in exactly **one click** (8.6) — a single
full-width primary button, no confirmation, no settings detour.

**Never display a timestamp implying we knew earlier than we did.** _"Disconnected since 14:20."_

**What makes each channel die silently:** token expiry · revocation · WABA ban · quality-rating collapse
· a Telegram Business Bot paused per-chat with no notification · a page unlinked.

**The false-positive problem:** distinguish _quiet because nobody wrote_ from _broken_. A health check
must not burn quota or money — decide what is cheaply checkable per channel and how often.

**Channel isolation is a tested rule, not an assumption.** Per-channel status, circuit breakers and error
boundaries. A broken Instagram renders one error row while everything else renders normally, **and the
banner says the other channels are unaffected.**

---

# PART 13 — THE DOMAIN DOCUMENT

Create `packages/domain/src/channel.ts` in the `phone-channel.ts` house style: const tuples with derived
types, per-channel step tuples mapping 1:1 onto the screen ids (`wa1`–`wa9`, `tg1`–`tg2`, `ig1`–`ig2`,
`brk`), a step map `as const satisfies Record<Step, number>`, nested zod sub-schemas with `.default()` on
every field, an aggregate schema plus `z.infer`, paired `emptyChannels()` / `normalizeChannels()`, and
pure derivations (`deriveChannelStep`, `channelTileStatus`) returning literal unions.

Register with `export * from "./channel"` **and** add `MessagingChannels` to the `DOMAIN_DOCUMENTS`
tuple. Add `channels` to `TenantBundle`, `emptyBundle()`, `documentsOf()` and `TenantDocuments` so every
existing loader picks it up unchanged.

**Every platform number is a named constant.** `COEX_HISTORY_DAYS` · `COEX_PHASES` ·
`COEX_WINDOW_HOURS` · `COEX_MEDIA_DAYS` · `COEX_THROUGHPUT_MPS` · `COEX_RETRYABLE = false` ·
`COEX_RWANDA_CONFIRMED = false` · `CODE_TTL_SECONDS = 30` · `EMBEDDED_SIGNUP_SCREENS` ·
`WA_TIER_LADDER = [250, 2000, 10000, 100000]` · `WA_FREE_SERVICE_PER_NUMBER = 1000` ·
`WA_SERVICE_BILLABLE_FROM = '2026-10-01'` · `WA_QUALITY_GRACE_DAYS` · `DISPLAY_NAME_REJECT_CAUSES` ·
`IG_WINDOW_HOURS` · `IG_PRIVATE_REPLY_PER_COMMENT = 1` · `IG_HUMAN_AGENT_TAG_PERMITTED = false` ·
`IG_TOKEN_DAYS = 60` · `DISCONNECT_VISIBLE_MS = 300000`.

Pull 5 and 15 working days from `claims.metaVerificationMin/Max` rather than redeclaring them.

**Add a named-assumption block comment** in the `OPENING_HOURS_FORWARD_POLICY` style covering the two
unresolved judgements: Embedded Signup cannot be resumed, and coexistence availability in Rwanda is
unconfirmed.

---

# PART 14 — PLUMBING

**Signature verification.** `X-Hub-Signature-256` against the **raw** body. The common failure is a
framework that has already parsed JSON — get the raw body correctly in a Next 16 Route Handler, or the
check passes on the wrong bytes.

**The handshake.** `hub.mode` / `hub.challenge` / `hub.verify_token`.

**Enqueue, then 200, within 3 seconds. No model call inside the webhook cycle.**

**Idempotency.** Meta retries for ~7 days and delivers **out of order**. Deduplicate on the platform's
own message id. **Order conversation state by timestamp, never by arrival.**

**Tokens.** Meta tokens expire around 60 days. Refresh proactively; treat refresh failure as **probable
revocation** — mark disconnected and alert — rather than retrying silently. Encrypt at rest, never log,
and **never put a token, phone number or member name in a cache key or `cacheTag`** (they are stored in
plain text).

**The 24-hour window as a UI concern.** Compute server-authoritatively per conversation, surface
remaining time, and **block the composer before the user types rather than failing the send.** When the
window has closed: WhatsApp has templates; **Instagram has nothing** — so the honest fallback is the
migration offer (§11.3).

---

# PART 15 — AUTHORIZATION & EVENTS

Create `packages/auth-tenant/src/channels.ts` in the `phone.ts` house style: every mutator
`(ctx, …) => document`, a local write gate, a `deny()` that writes an audit row with outcome `denied`
then throws an error carrying code `notFound`, reads and writes through the bundle, and `emit()` for
every instrumentation row. Route through `dal.connectChannel` / `dal.disconnectChannel` so the
`enforcementSites` registry stays satisfied.

**Export a named `CHANNEL_SURFACE_AUTH` constant recording the decision explicitly**, as
`PHONE_SURFACE_AUTH` does. Because `connectDisconnectChannel` sits on **both** `elevatedCapabilities`
and `recoveredDeniedCapabilities`, the decision differs from Prompt 05's:

- **Connect** requires `elevated` — step up **on entry to the sub-flow**, not at the last click.
- **Disconnect** requires `elevated` **plus scope `full`** — owner only. _(A Manager may connect but
  never disconnect: connecting is recoverable; disconnecting silently stops customer messages.)_
- A **recovered** session is refused outright, with a `DeniedState` naming who can.
- **Read-only hub visibility** is governed by `canRead`, so a Manager, Agent or Viewer still sees
  channel health (G19/G22).

**Events.** Extend `events.ts` with `CHANNEL_EVENTS` and a `z.discriminatedUnion('name', …)`, and widen
`TenantEvent`. Carry the atlas §13 rows plus:
`whatsapp.embedded_signup_abandoned { metaScreen, errorCode, sessionId }` ·
`telegram.bot_created { mode }` · `instagram.private_reply_recorded { commentId }`.

---

# PART 16 — VERIFICATION

| Audit            | Pass condition                                                        |
| ---------------- | --------------------------------------------------------------------- |
| Domain constants | No platform figure typed into any message catalogue                   |
| ES version       | v4 only; zero v2 references                                           |
| 30s TTL          | Exchange is immediate and server-side; expiry never retried           |
| Resumability     | No resume pointer into Meta's flow exists                             |
| Coexistence      | Five limits render before the tap; unavailability fails fast          |
| "Instant"        | Zero occurrences on any Meta path                                     |
| AI ban           | Clause quoted verbatim                                                |
| **Training**     | No cross-tenant path can read WhatsApp-sourced data                   |
| Private reply    | Claim written before send; unique constraint; timeout ⇒ do-not-resend |
| `HUMAN_AGENT`    | Unreachable from the agent path — a type error, not a convention      |
| Migration offer  | No IG window closes unresolved without one                            |
| Health           | Visible ≤5 min; reconnect one click; no implied instant knowledge     |
| Isolation        | Break one channel; others render; banner says so                      |
| Throttle         | Server-side counter; truthful queue position                          |
| Webhooks         | Raw-body signature; 200 in <3s; dedupe by id; order by timestamp      |
| Errors           | No raw platform code reaches a screen, in any locale                  |
| No-JS            | Everything except the Meta popup; popup path degrades honestly        |
| Routes           | No collision with `/connections/phone`                                |
| Targets          | `.qcard .qa` raised to 48                                             |
| rw @ 360         | No overflow, both themes                                              |

## 16.1 The adversarial pass

A **different agent from every author**. Try to: send a second private reply to a spent comment · set
`HUMAN_AGENT` from an agent-authored message · retry an expired Embedded Signup code · break Instagram
and observe WhatsApp break too · get a raw Meta error code onto a screen · exceed the onboarding throttle
without a queue · read WhatsApp conversation data from a cross-tenant training path.

---

# PART 17 — DELIVERABLES & NEXT

1. The BSP tier decision, made and recorded (§7)
2. `packages/domain/src/channel.ts` with every platform constant and the named-assumption block
3. `packages/auth-tenant/src/channels.ts` + `CHANNEL_SURFACE_AUTH`
4. 15 screens under `/connections/messaging/[channel]/[step]`, all no-JS except the popup
5. The rewritten hub — five tiles, deliberate order, out of `ReadOnlySurfaces.tsx`
6. `ChannelTile` extended: `sms`, `web`, `waiting`, `since`, `cta`
7. The webhook pipeline: raw-body signature, enqueue-then-200, dedupe, timestamp ordering
8. The private-reply claim table and its unique constraint
9. Token lifecycle + reactive disconnection + per-channel isolation
10. The 1 Oct service-billing surface
11. Channel events; `en`/`rw` catalogue parity
12. The adversarial report

**Two items to escalate to the founder, not to the build:** the **BSP tier** decision (§7), and the
**cross-tenant training prohibition** (§6.2), which constrains the company's stated language moat.

**Prompt 07** — Agent design (`Design/agent.html`): rules not prompts, one configuration in two views,
enforcement badges, and the contradiction check. It mounts a `Surface` beside the `Step` that activation
already built. Say **next**.

---

# PART 18 — APPENDIX

## A — The hub's deliberate order

```
  ┌────────────────────────────────────────────────────────────────┐
  │ "None of these are needed for Subiza to answer your phone —    │
  │  that already works."                        ← G4 + G7, line 1 │
  └────────────────────────────────────────────────────────────────┘

  1 TELEGRAM        2 min · no review · nothing to pay   [Start here]  ← lime
       ↑ proves the messaging side works, with zero friction

  2 WHATSAPP        10 min of you, then Meta 5-15 days   [Start today] ← amber
       ↑ most valuable AND slowest → start the clock on day one
         "start it" is a different recommendation from "finish it"

  3 INSTAGRAM       5 min · needs a professional account
  4 WEB CHAT        instant · copy a snippet
  5 SMS             3 weeks · MTN + Airtel register separately  [Later]

  ═══ nothing here is on the critical path to first value ═══
      the phone answered on day one. this page waits.
```

## B — The WhatsApp path, and where Meta owns it

```
   SUBIZA OWNS                    │  META OWNS
   ───────────────────────────────┼──────────────────────────────────
   wa1  three questions           │
        └ screens out 3 wasted    │
          journeys BEFORE Meta    │
   wa2  three routes              │
   wa3  coexistence, 5 limits     │
        └ ONE-SHOT, 24h, not      │
          retryable. shown        │
          BEFORE the tap          │
                                  │
   wa4  handoff ─────────────────►│  THE POPUP
        pre-fill everything       │   · Meta's DOM, English-only
        "we cannot receive that   │   · cannot be resumed, ever
         code for you"            │   · the owner holds the SIM
                                  │   · CODE LIVES 30 SECONDS
        ◄─────────────────────────┤  CANCEL{current_step,error,session}
   wa5  "we'll start it again"    │
        names where they stopped  │
                                  │
                                  │  ░░ 3-15 BUSINESS DAYS ░░
   wa6  the wait ────────────────►│  ░░ resubmission RESETS ░░
        NO primary action.        │  ░░ we cannot see inside ░░
        "your phone is being      │
         answered today.          │
         Telegram works."         │
        ◄─────────────────────────┤
   wa7  display name              │
   wa8  payment wall ─── card? ───┤  Meta bills the BUSINESS
        Solution Partner tier     │  Tech Provider tier = card wall
        removes this entirely     │
   wa9  connected                 │
        prints Meta's real limits │
        quotes the AI clause      │
        verbatim                  │
```

## C — Instagram: the refusal and the duty

```
   Meta offers a way to re-open a closed window:  HUMAN_AGENT tag
                                                   24h → 7 days
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │  THE API WOULD ACCEPT IT FROM OUR BOT.  │
        │  META'S POLICY RESERVES IT FOR HUMANS.  │
        │  Meta actively detects misuse.          │
        │  Penalty: account suspension.           │
        └───────────────────┬─────────────────────┘
                            ▼
        ┌─────────────────────────────────────────┐
        │  WE REFUSE IT — STRUCTURALLY.           │
        │  The tag is not EXPRESSIBLE in the      │
        │  agent-authored message type.           │
        │  A human on the rota may still use it.  │
        └───────────────────┬─────────────────────┘
                            ▼
        ┌─────────────────────────────────────────┐
        │  THEREFORE WE OWE THE MIGRATION OFFER.  │
        │  An IG window may never close on an     │
        │  unresolved conversation without        │
        │  offering WhatsApp or SMS. 100%.        │
        │                                         │
        │  "Refusing the tag without shipping the │
        │   migration offer makes the product     │
        │   worse than a cheating competitor."    │
        └─────────────────────────────────────────┘

   And the comment reply is exactly-once, forever:
      claim row on (tenantId, commentId) ── written BEFORE the send
      unique constraint                  ── the DB refuses the second
      timeout / unknown                  ── resolves to DO-NOT-RESEND
```

---

_Prompt 06 · Subiza · Messaging Channel Connection_
_Built against `Design/channels.html`, atlas Flows 04 and 08, and live platform sources observed 13 September 2026._
_Platform facts decay. Re-verify anything dated before building on it._
