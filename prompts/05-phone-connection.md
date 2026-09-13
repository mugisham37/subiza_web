# SUBIZA — BUILD PROMPT 05

## Phone Connection

> **This is the one flow where Subiza is a coach, not an actor.**
>
> The owner dials a GSM code on their own handset. We cannot send it for them (**P1**). We cannot read
> whether it worked (**P2**). It fails for carrier-side reasons they did not cause. And registering our
> number **silently destroys their voicemail**.
>
> Everything difficult about this flow follows from those four facts. The product's answer — a
> server-placed verification call — appears to be **genuinely absent from this entire product category.**

|                    |                                                                                  |
| ------------------ | -------------------------------------------------------------------------------- |
| **Prompt**         | 05 of the series — Phone Connection                                              |
| **Corresponds to** | `Design/phone.html` · atlas Flow 07 · flow 1.4 in `Design/PROGRAMME.md`          |
| **Builds on**      | Prompts 01–04, all built                                                         |
| **Scope**          | **Extends `PhoneSurface` only.** `PhoneStep` (activation w8) must not be touched |
| **Apps**           | `apps/studio` · `packages/domain` · `packages/auth-tenant` · `packages/ui`       |
| **Next prompt**    | 06 — Messaging channel connection (`Design/channels.html`)                       |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next

Verified three ways. `PROGRAMME.md` orders stakeholder 1 by the customer's journey and 1.4 follows the
now-built 1.3. `apps/studio/src/features/phone/PhoneSurface.tsx` exists as a stub explicitly awaiting
this flow. And `phone.html` specifies nine screens where activation shipped one.

Prompts 01–04 are all **written and built**: the marketing site, the auth door, the DAL and the
nine-step activation wizard are live. This is the first prompt that _extends_ built code rather than
creating a surface from nothing — which makes Part 3 the most important section in it.

## 0.2 Phases

```
  ┌─ PHASE A ─ TRUTH & DOMAIN ────────────────────────────────────┐
  │  A1 Fix the four inherited defects (§3.2) — the fake           │
  │     verification most of all                                   │
  │  A2 Extend phoneChannelSchema additively (§13)                 │
  │  SEQUENTIAL. Nothing may be built on a lie.                    │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ THE LOOPBACK ──▼───────────────────────────────────┐
  │  The real verification call. Six outcomes. The state machine.  │
  │  YOUR STRONGEST AGENT. This is the differentiator and it is    │
  │  currently fiction.                                            │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ THE SURFACE ───▼───────────────────────────────────┐
  │  C1 s1 path  C2 s2 scope  C3 s3 code  C4 s4/s5 verify+result   │
  │  C5 s6 repair ladder  C6 s7 done  C7 s8 path B  C8 s9 lost     │
  │  C1-C3 parallel; C4 after B; C5-C9 after C4.                   │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ HEALTH ────────▼───────────────────────────────────┐
  │  Re-verification clock, silent-failure detection, G19 tile     │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ PROOF ─────────▼───────────────────────────────────┐
  │  E1 no-JS  E2 a11y  E3 blameless-copy lint  E4 rw@360          │
  │  E5 six outcomes reachable  E6 seam audit  E7 adversarial      │
  └───────────────────────────────────────────────────────────────┘
```

## 0.3 Agents

| Agent                     | Owns                     | Must be told                                                                           |
| ------------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| **Truth engineer**        | A1.                      | `verifyForwarding` currently lies. Everything downstream inherits that lie.            |
| **Domain architect**      | A2, §13.                 | Additive only. Activation must keep working, untouched.                                |
| **Telephony engineer**    | Phase B.                 | The proof is the loop closing on our own trunk. Not audio. Not AMD. Not a query API.   |
| **Screen engineers** (×3) | Phase C.                 | Copy is the primary action. On iOS the dial button is **removed**, not disabled.       |
| **Health engineer**       | Phase D.                 | Silent failure is the dangerous one. But do not ring someone at 02:00.                 |
| **Copy auditor**          | E3.                      | Every failure sentence needs a non-user grammatical subject. Here that is also _true_. |
| **Adversarial reviewer**  | E7. **Never an author.** | Try to make the Surface claim a forward is active without an observed call.            |

## 0.4 Three rules

**Rule 1 — Never claim an observation you did not make.** _"We watched where the call landed"_ is
allowed. _"We checked your forwarding settings"_ is not — it implies a query API that does not exist.
_"We connected your phone"_ is forbidden by **F7**.

**Rule 2 — The owner never caused this.** MMI rejection is the dominant failure mode and it comes from
the handset or the switch. Copy that implies a typo is both unkind and **factually wrong**.

**Rule 3 — Extend, never replace.** `PhoneStep` is activation's w8 and is frozen. Anything both surfaces
need becomes a component in `packages/ui` or a function in `packages/domain` — never a prop threaded
from the Surface into the Step.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A business owner can connect their existing number to Subiza, have it **observed working** rather than
assumed, repair it when the carrier rejects the code, choose a new Subiza number instead when their line
simply cannot forward, and be told within days — not months — if it silently stops.

## 1.2 Definition of done — twenty-four criteria

| #   | Criterion                                                                                   | Proven by                                               |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | `verifyForwarding` places a **real** call and can fail                                      | Delete the unconditional stamp; failure paths reachable |
| 2   | `PhoneStep` is byte-identical after this phase                                              | `git diff` on the Step is empty                         |
| 3   | `PhoneSurface` is a real component in `features/phone`, not a re-export                     | Import graph                                            |
| 4   | No phone domain shape exists outside `packages/domain/phone-channel.ts`                     | Lint rule + deliberate violation fails                  |
| 5   | `ForwardingCodeCard` imports `forwardingCode` from domain; the duplicate builder is gone    | Grep for a second USSD builder                          |
| 6   | Per-condition deactivation codes are **derived**, not stored as free strings                | `deactivationCodeFor()` exists and is used              |
| 7   | "Everything I miss" renders as **three codes in sequence** with per-code progress           | Visual + domain array                                   |
| 8   | The voicemail disclosure renders **before** the code, above the string, with `*#61#` inline | Order assertion                                         |
| 9   | **Six** verification outcomes are implemented and individually reachable                    | `forceState` walk                                       |
| 10  | `inconclusive` never renders as failure                                                     | Simulate a webhook drop                                 |
| 11  | A fast loopback (<8s) is surfaced as a **G22 violation**, not a pass                        | Simulate `**21` registration                            |
| 12  | Recurring checks **reject** the loopback (SIP 486); only activation answers it              | Call-record audit                                       |
| 13  | Caller-ID survival is recorded from the inbound leg's `callerNumber`                        | Field populated from observation                        |
| 14  | On iOS the dial button is **absent**, replaced by three numbered steps                      | Platform render test                                    |
| 15  | `#` is percent-encoded as `%23` in every `tel:` href                                        | Grep                                                    |
| 16  | The repair ladder is linear, cheapest-first, with one conditional branch                    | Order assertion                                         |
| 17  | Every failure screen names a human, a window and an action                                  | Manual walk of all failure states                       |
| 18  | Every failure sentence has a **non-user** grammatical subject                               | Lint rule over the message catalogue                    |
| 19  | `dal.changeForwarding` exists and the Surface writes through it                             | `enforcementSites` no longer names a missing function   |
| 20  | The auth-strength decision is **made and written down**, not left unreachable               | `CONTEXT` note + code                                   |
| 21  | Nine atlas §12 events emit from server actions                                              | Event test with JS off                                  |
| 22  | The re-verification clock never rings the owner outside waking hours                        | Schedule test                                           |
| 23  | Every screen works with JavaScript disabled                                                 | Playwright `javaScriptEnabled: false`                   |
| 24  | `CARRIER_FORWARDING` is still `false` and every carrier claim is gated on it                | Flag audit                                              |

## 1.3 Not in this phase

Messaging channels (Prompt 06). Flipping `CARRIER_FORWARDING` — that needs a live-SIM test on MTN and
Airtel, which is fieldwork, not code. Any dependency on SIP Diversion headers or AMD verdicts: **Africa's
Talking exposes neither**, so those go behind an interface and stay unimplemented.

---

# PART 2 — CONTEXT ABSORPTION

| #   | Read                                                  | Extract                                                                                      |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | `Design/phone.html` — **both modes**                  | All 1,628 lines. Nine screens `s1`–`s9`, nine aside panes, and eight spec sections           |
| 2   | `subiza-flow-atlas/flows/07-flow-phone-connection.md` | The authoritative sequence, §10 success criteria, §12 instrumentation                        |
| 3   | `prompts/04-guided-activation.md` Part 4              | The Step/Surface contract you are bound by                                                   |
| 4   | `packages/domain/src/phone-channel.ts`                | 63 lines. What exists, and what must be added additively                                     |
| 5   | `packages/auth-tenant/src/activation.ts`              | `verifyForwarding` (the fiction) and `requestTestCall`/`advanceTestCall` (the model to copy) |
| 6   | `docs/07-telephony-and-networking.md`                 | What the platform can dial and at what cost                                                  |
| 7   | `docs/13-open-questions-and-validation.md`            | **Q2 is still open.** Every carrier claim stays gated                                        |

## 2.1 The gate

1. What exactly proves a forward is active, and why is it not audio?
2. What does registering `**61` overwrite, and when must the owner be told?
3. Why is the dial button _removed_ on iPhone rather than disabled?
4. Which two verification outcomes must never be styled as errors, and why?
5. What does a loopback in under 8 seconds mean, and why is it urgent?

An agent that cannot answer #1 must not write Phase B.

---

# PART 3 — WHAT PROMPT 04 ACTUALLY SHIPPED

> **Read this before writing anything.** Prompt 04 shipped the phone _step_, not the phone _flow_, and
> four things it left behind are not merely incomplete — they are wrong.

## 3.1 What is genuinely there

`packages/domain/src/phone-channel.ts` — 63 lines: a 6-field `PhoneChannel` with a 3-field nested
`verification`, two pure code builders (`forwardingCode`, `telHref`), and a named policy constant
`OPENING_HOURS_FORWARD_POLICY = "ring-through"` — which correctly resolves the assumption Prompt 04 was
asked to name.

## 3.2 The four defects — fix in Phase A

**Defect 1 — the verification call is a fiction.** `verifyForwarding` stamps
`verifiedAt: Date.now(), callerIdSurvived: true, pickupSeconds: 20` **unconditionally**. There is no
call, no state machine and no failure branch, and the event it emits hardcodes `network: "mtn",
attempts: 1`. Every screen downstream currently renders a lie. **This is the single most important fix
in the phase.**

**Defect 2 — the Step/Surface contract is declared but not physically true.** Both
`features/phone/PhoneStep.tsx` and `PhoneSurface.tsx` are one-line re-export shims: the Step actually
lives inside the 706-line `ActivateView.tsx`, and the "Surface" is `ConnectionsSurface` from
`views/console/ReadOnlySurfaces.tsx`. Make the contract real — the route must import from
`features/phone`, and `ConnectionsSurface` must _compose_ `<PhoneSurface />` rather than own phone markup.

**Defect 3 — `ForwardingCodeCard` duplicates the USSD builder.** It derives the code itself instead of
importing `forwardingCode` from domain, and never derives the per-condition deactivation code. Delete
`buildCode()` and `telHref()` from the component; take `code` and `telHref` as props derived by the
caller from `@subiza/domain`. Keep the deprecated `number` alias alive — `apps/site` still uses it in two
places — but migrate both callers in the same pass.

**Defect 4 — the capability is unreachable.** `enforcementSites.setupCallForwarding` names
`dal.changeForwarding`, **which does not exist**. And `setupCallForwarding` is an `elevated`-strength
capability with no step-up path built anywhere; the activation step sidesteps it by using
`completeSignupAndActivation`.

_Decide explicitly and write the decision down:_ either **(a)** build a step-up that re-mints the session
at `elevated` before a Surface-initiated forwarding change — the matrix's intent — or **(b)** accept
`otp` for the Surface by having `dal.changeForwarding` mint via `grant()` and check scope manually. **Do
not silently leave the capability unreachable.** Keep the activation Step on
`completeSignupAndActivation` so it stays untouched.

## 3.3 Instrumentation

Of atlas Flow 07 §12's nine events, **one** exists. See §15.

---

# PART 4 — THE LAW

Everything from Prompts 01, 03 and 04 binds. Six rules govern this flow specifically.

**P1 — we cannot set call forwarding.** No control may claim to turn forwarding on or off. The canonical
wording is already written: _"Only the handset holding the SIM can do this. No website — including ours —
can send this command for you."_

**P2 — we cannot query forwarding status.** A verification **call** is the only observation mechanism.
CAMARA's Call Forwarding Signal API sits at v0.4.0 "Initial / Incubating", and African Open Gateway
deployments are South African, covering number verification and SIM swap — not this. **Never render a
"forwarding is on" state that was not produced by an observed call.**

**F7 — never claim we set up forwarding.** Applies to every string, every event name, every `aria-label`
and every notification. _"We checked"_ is allowed. _"We connected"_ is not.

**G22 — never less reachable than before.** Credit exhausted: forwarding stays, Subiza **declines**, the
carrier falls through, the owner's phone rings. Platform outage: the same. **Never a dead line.**

**G19 — every external connection can break silently.** Visible health plus one-click repair. Silent
removal of the forward is what the atlas calls _"the worst possible failure"_.

**`CARRIER_FORWARDING = false`.** Until doc 13 Q2 is answered in writing on live SIMs, every assertion
about MTN and Airtel behaviour — codes honoured, caller ID surviving, who pays — stays in the softened
register the flag selects. **Do not flip it in this prompt.**

---

# PART 5 — THE CODE, FIELD BY FIELD

From **3GPP TS 22.030 §6.5.2** (MMI grammar) and **TS 22.082** (service behaviour).

```
   **  61  * 250788456123 * 11 * 20 #
   ─┬  ─┬    ──────┬─────   ─┬   ─┬
    │   │          │         │    └── SIC — no-reply timer, seconds. 5–30 in steps of 5
    │   │          │         └─────── SIB — basic service group. 11 = voice telephony
    │   │          └───────────────── SIA — the forwarded-to number.
    │   │                             THE ONLY PART THAT BELONGS TO THE TENANT
    │   └──────────────────────────── SC — service code
    │                                 21 unconditional · 61 no reply
    │                                 67 busy · 62 unreachable
    │                                 002 all · 004 all conditional
    └──────────────────────────────── registration: store the destination AND enable it
```

| Condition           | Register          | Deactivate | Interrogate |
| ------------------- | ----------------- | ---------- | ----------- |
| No reply (CFNRy)    | `**61*<n>*11*20#` | `##61#`    | `*#61#`     |
| Busy (CFB)          | `**67*<n>#`       | `##67#`    | `*#67#`     |
| Unreachable (CFNRc) | `**62*<n>#`       | `##62#`    | `*#62#`     |
| Unconditional (CFU) | `**21*<n>#`       | `##21#`    | `*#21#`     |
| All forwarding      | —                 | `##002#`   | —           |

**The timer is fixed at 20 seconds and never exposed.** The 3GPP range is 5–30, but every additional
variable in the string is another thing a handset or switch can reject, and **MMI rejection is the
dominant failure mode.** A perfectly tuned ring time is worth far less than a code that registers first
time.

> **A correction to the design's own explainer.** `phone.html` states that SIB is _"optional in isolation,
> structurally required here"_ because the fields are positional. **That is not what TS 22.030 §6.5.2
> says** — the grammar explicitly permits `*SIA**SIC#`, skipping SIB with a doubled separator. Keep
> sending `*11*` anyway (it is what every carrier document shows, and consistency beats cleverness here),
> but **fix the explainer copy** — and note that `*SIA**SIC#` is therefore a legitimate extra rung on the
> repair ladder.

## 5.1 `tel:` behaviour — why copy leads

| Platform             | What actually happens                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Android / Chrome** | Opens the dialler **pre-filled**. Never auto-dials. `#` **must** be percent-encoded as `%23` — unencoded it is a URI fragment delimiter and risks being stripped before the intent is built. An Android 14 regression in this area is still open                                                                                                      |
| **iOS / Safari**     | **Fails silently.** Apple's URL Scheme Reference states the Phone app will not dial a `tel:` URL containing `*` or `#`; `canOpenURL` and `open()` both report success; percent-encoding does not help. A 2026 developer-forum thread reports two iPhones on identical iOS versions behaving differently, with Apple again confirming a bug and no fix |

So: **copy is the primary action on both platforms.** On Android the `tel:` button stays as an honestly
labelled convenience. **On iPhone it is removed — not disabled — and replaced by three numbered steps:
copy, open Phone, paste.** A button that silently does nothing is worse than no button.

_Why no platform auto-dials:_ a 2012 exploit let a crafted `tel:` link — deliverable by web page, SMS, QR
code or NFC tag — push a factory-reset USSD code into Samsung's dialler with no confirmation. Every
"the user must tap call" behaviour descends from that.

---

# PART 6 — THE NINE SCREENS

`phone.html` has **nine** screens, not eight — `s5` is a five-way result switchboard with no heading of
its own.

```
   s1 path choice ──► s2 scope ──► s3 the code ──► s4 verifying ──► s5 RESULT
        │                                                              │
        └──► s8 new number (path B)                    ┌───────────────┼──────────────┐
                                                       ▼               ▼              ▼
                                                   s7 done       s6 repair      (retry s4)
   s9 forwarding lost — entered from OUTSIDE the wizard, by the health monitor
```

Progress is a **four-mark** bar driven by `STEPMAP = {s1:1, s2:2, s3:3, s4:4, s5:4, s6:3, s7:4, s8:2,
s9:3}`, hidden on `s9`.

**Build each as a route** under `/connections/phone`, so the flow is resumable and works with JavaScript
disabled — the same discipline as the activation wizard. Note `typedRoutes`: new paths need adding to the
generated route type, or the existing `as never` cast pattern.

## 6.1 s1 — How should customers reach Subiza?

Two paths, **A checked by default**.

**Path A — Keep my number** _(recommended)_. _"Your customers keep calling the number they already know.
Subiza picks up only what you'd have missed."_ Cost: **five minutes**.

**Path B — Get a new Subiza number.** _"A separate line just for Subiza. It takes a few days, because the
regulator needs your business documents first."_ Cost: **three to seven days**.

The aside carries the better argument, and it is a product insight rather than a convenience one:

> **"Conditional forwarding means every call Subiza handles is, by definition, a call the business would
> otherwise have lost. That's the number that renews the subscription — and it falls out of the setup
> choice rather than being estimated."**

## 6.2 s2 — Which calls should Subiza pick up?

Three options, **option 1 checked**.

| Option                                | Codes                                      | Copy                                                                                                                  |
| ------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Everything I miss** _(recommended)_ | `**61` + `**67` + `**62` — **three codes** | _"No answer, line busy, or phone off. That's three codes dialled one after another — we walk you through all three."_ |
| Only when I don't answer              | `**61` only                                | _"One code only. If your phone is busy or off, calls go wherever they went before — usually your voicemail."_         |
| (third option per the prototype)      | —                                          | —                                                                                                                     |

**"Everything I miss" is three codes, not one.** Model it as an **ordered array** in domain —
`forwardingCodes(channel)` returning `{condition, code, deactivate}[]` — so the per-code progress label
(_"Code 1 of 3 — when you don't answer"_) reads off an index rather than view logic.

## 6.3 s3 — Dial this on your phone

The voicemail disclosure (§10) renders **first**. Then the code card, with only the tenant's own number
highlighted. Copy button primary. Platform branch per §5.1. The **undo code is shown here**, not hidden
until later — see §10.2.

## 6.4 s4 / s5 — Verifying, and the result

Part 7 and Part 8.

## 6.5 s6 — Let's try it another way

Part 9.

## 6.6 s7 — That's done

The connection summary: which conditions are registered, the deactivation codes, the cost disclosure
(§10.3), and the G22 sentence.

## 6.7 s8 — A new number takes a few days

Part 11.

## 6.8 s9 — Forwarding lost

Part 12. Entered by the health monitor, not by the wizard.

---

# PART 7 — VERIFICATION: THE LOOPBACK

> **The heart of this flow, and currently fiction.**

## 7.1 The mechanism

When the owner registers `**61*<subizaNumber>*11*20#`, we place an outbound call from a Rwandan
verification line to the owner's MSISDN. If CFNRy is active on the HLR, the MSC diverts at T+20s and **a
new inbound INVITE lands on our own Subiza DID.**

**The proof is the loop closing on our own trunk.** Not audio. Not answering-machine detection. Not a
query API.

Because we control both endpoints, this is a controlled experiment:

**Caller ID, free.** Whichever number appears as `callerNumber` on the inbound leg tells us exactly what
the carrier does to CLI — our verification DID present ⇒ caller ID survives; the owner's MSISDN present ⇒
the carrier substitutes the diverting party.

**Condition discrimination, by latency.** ~1–5s ⇒ unconditional (`**21`). ~20–25s ⇒ no-reply (`**61`).

## 7.2 The cost insight that changes the design

> **Reject the loopback with SIP 486 instead of answering it.**

GSM billing starts at **answer**. A signalling-only check costs the owner nothing on their MTN bill and
costs us near-zero. A weekly _answered_ check bills **the customer's own airtime** for our monitoring —
roughly **RWF 3,000–5,200/year**.

**Answering is acceptable only for the one-time activation check**, where end-to-end media proof has
value the owner is present to receive. Every recurring check rejects.

## 7.3 Constraints on the mechanism

**The verification call must ring the handset for the full no-reply timer before CFNRy fires.** There is
no such thing as a silent no-reply verification. This constrains every scheduling decision (§12).

**Do not build on SIP 181.** It is optional, rarely emitted, and documented to kill calls on carriers
that expect a response to it.

**Africa's Talking exposes no SIP headers and no alerting timestamp.** Any design depending on reading a
Diversion header, a 180 Ringing time, or an AMD verdict is **not buildable on the Phase 1 stack**. Put it
behind an interface and leave it unimplemented.

**AMD is the wrong primary instrument and the right secondary one** — it classifies what answered the
_outbound_ leg only when **no** loopback occurred.

## 7.4 How to build it

Model it on the existing `requestTestCall` / `advanceTestCall` state machine in `activation.ts`: an
in-flight lock, spend accounting through `recordSpend` / `canSendVoice`, a rate-limited outcome carrying
`retryAfterMs`, and a `forceState` parameter so all outcomes are reachable without JS.

Emit `phone.verification_attempted` before and `phone.verification_result` after.

**Implement the 60-second propagation retry in the domain transition, not the view:** a first
non-diverted result schedules exactly **one** automatic retry before failure is reported to the user.
Express it as a pure function of `(attempts, lastAttemptAt, now)` so it is testable.

**Do not use SSE for the result.** It requires JavaScript (breaking the law), pins the radio in a
high-power RRC state on exactly the device class we target, and dies on the radio-state transition that
the verification call itself causes. Poll, or deliver the result by SMS/WhatsApp.

**The pending screen must never blank, reset or spin indefinitely** through the 2G voice/data blackout.
The last server-known step stays rendered with its elapsed time. G6 has to hold through a radio outage,
not just a slow network.

---

# PART 8 — THE SIX OUTCOMES

The design names four. **There are six**, and the two extra ones are where the design would have failed
its own users.

| #   | Outcome                   | What happened                                                        | Tone                        | Next action                           |
| --- | ------------------------- | -------------------------------------------------------------------- | --------------------------- | ------------------------------------- |
| 1   | **diverted**              | Loopback landed on our trunk at ~20–25s                              | Success                     | Continue to s7                        |
| 2   | **owner-answered**        | They picked up instead of letting it ring                            | **Neutral**                 | _"Let it ring out this time"_ — retry |
| 3   | **not-diverted**          | Rang out, no loopback                                                | Failure                     | s6 repair ladder                      |
| 4   | **diverted-no-caller-id** | Loopback landed, but `callerNumber` was the owner's MSISDN           | **Pass with a caveat**      | Continue; record the limitation       |
| 5   | **diverted-elsewhere** ★  | Something else answered — carrier voicemail still owns the condition | Failure                     | s6, with the voicemail branch         |
| 6   | **inconclusive** ★        | **Our own webhook failed**                                           | **Our fault, said plainly** | Retry — _never_ s6                    |

★ = missing from the design. Add both.

**`inconclusive` must never render as `not-diverted`.** Reporting our own webhook failure as _"the call
didn't divert"_ sends a non-technical owner into the troubleshooting tree for a fault that is ours — and
G20 requires a defined failure state for **our** failure, distinct from the carrier's.

**`owner-answered` and `diverted-no-caller-id` must never use error tone or red.** The first is a neutral
retry; the second is a pass with a caveat. Styling either as failure is a factual lie about what happened.

## 8.1 The urgent one

> **A loopback in under 8 seconds with no alerting means the owner registered `**21` — unconditional —
> and their own phone has stopped ringing.**

That is a **live G22 violation**. Surface it immediately with the `##21#` undo code. **Do not file it as
a pass because a loopback was observed.**

---

# PART 9 — THE REPAIR LADDER

## 9.1 Ordering

Ordered by **cost to the user**, not by probability. Cheapest first, non-destructive first, each rung
strictly wider in scope than the last.

**A linear ladder with one conditional branch (prepaid) — not a decision tree.** Tree traversal requires
the user to self-diagnose, and they cannot see carrier state.

| Rung | Action                                                              | Why here                                                                                                                                                            |
| ---- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | The **shorter form** — `**61*<n>#`, dropping SIB and the timer      | Fewest variables to reject. §5's correction makes `*SIA**SIC#` a legitimate variant too                                                                             |
| 2    | **Interrogate** — `*#61#` — to see what is already registered       | Non-destructive. Often reveals the voicemail conflict                                                                                                               |
| 3    | **Erase all** — `##002#` — then retry                               | Destructive but reversible; clears a conflicting registration                                                                                                       |
| 4    | **A human calls back**, within fifteen minutes, Mon–Sat 08:00–19:00 | The rescue is cheap next to a lost customer                                                                                                                         |
| —    | **Conditional branch: some lines simply can't**                     | Prepaid plans exist that do not permit forwarding. When that is the answer, **say it**, and Path B becomes the route — rather than a fifth attempt at the same code |

## 9.2 The terminal rung

> A dead end that offers a named human, a booked time, and a **working alternative** is honest. One that
> offers sympathy is abandonment.

The terminal screen converts _"we cannot fix this"_ into _"here is the route that works today."_ Email
addresses do not satisfy the reachable-human requirement. The callback must carry full context so the
owner never re-explains.

**State G22 explicitly on every failure and terminal screen** — the owner's own phone still rings, their
number is untouched, nobody was lost. That sentence is what converts a dead end from loss into stasis.

## 9.3 The assisted call

A plain form POST recording `assistedRequestedAt` and emitting `phone.assisted_requested` with the rung
it was requested from. Success criterion: **>95% answered within one business hour.**

---

# PART 10 — THE VOICEMAIL DISCLOSURE

## 10.1 What actually happens

Carrier voicemail is implemented with **exactly this mechanism** — conditional forwarding to the
voicemail platform's number. **A line holds one destination per condition**, so registering ours
overwrites theirs, with no warning from the network and no separate confirmation.

> _"Nobody in this category warns about it. We warn before they dial, and we offer `*#61#` so they can
> see what's registered first. Discovering a week later that voicemail quietly stopped working — and
> correctly blaming us for it — is a far more expensive outcome than a sentence of honest friction."_

**The disclosure renders BEFORE the code is dialled and ABOVE the string, with `*#61#` offered inline.**
This is the one consequence that is not _explanation_ and therefore **not subject to progressive
disclosure**.

## 10.2 The undo code, up front

`##002#` on the connected screen, in Settings, and in the connection summary, with the per-condition
codes `##61#` / `##67#` / `##62#` alongside. **Reversibility reduces hesitation; hiding the exit
increases it** — and the pre-commitment literature on "cancel anytime" supports showing it early.

## 10.3 The cost disclosure

The forwarded-leg tariff is **still unknown and must not be invented**. The correct and complete position
is the one already written: the diverting subscriber pays, we have not measured MTN's and Airtel's rate,
and it will appear the moment we have.

**Register it as a claim** in `packages/core/src/claims.ts` with mark `red` or an explicit unknown, so
the promise is enforced by the claims registry the same way pricing figures are. The atlas calls an
undisclosed carrier charge _"a serious trust breach."_

---

# PART 11 — PATH B: A NEW NUMBER

Three to seven days, because the regulator needs the business documents first. The aside is _"Honest
about waiting."_

Model a `provisioning` sub-object on `PhoneChannel` with its own states, and emit
`number.provisioning_state_changed`. The owner's existing number is **untouched** throughout — say so.

This is also the **terminal branch of the repair ladder** (§9.1). A line that cannot forward is not a
failure; it is a different route.

---

# PART 12 — HEALTH & RE-VERIFICATION

> _"The silent failure is the dangerous one."_ The atlas calls silent removal **"the worst possible
> failure."**

A forward stops working silently on: SIM swap, handset change, carrier reset, someone dialling `##002#`,
network migration. There is **no query API** to detect any of it.

**Store `nextCheckAt` on the document. Expose a pure `isReverificationDue(channel, now)` in domain.**
Success criterion **7.5: 100% detection within 7 days.**

## 12.1 The design flaw to fix

A weekly re-verification _"at a quiet hour"_ **must ring the owner's handset for 20 seconds** to fire
CFNRy. At 02:00 that wakes them, weekly.

Schedule inside waking hours, reject the loopback with SIP 486 (§7.2) so it costs them nothing, and
accept a ring they may notice — a brief silent-then-stopped ring is a far smaller cost than being woken.

## 12.2 Surfacing it

Render the phone connection as `ChannelTile kind='ph'` with status **derived**: `working` when
`verifiedAt` is recent, `action` when skipped or never verified, `err` when `forwardingLostAt` is set.
That is the G19 requirement, and the tile already has an `action` slot for one-click re-dial.

Wrap the Surface in `StateBoundary<PhoneChannel>` with the full eight-state copy. `/connections`
currently renders raw JSX with no loading, offline, denied, rate-limited or error state — **G6 and G20
are both unmet there today.**

---

# PART 13 — DOMAIN EXTENSIONS

**Additive only.** Every new field `.optional()` or defaulted in `emptyPhoneChannel`, so activation keeps
working untouched.

| Add                                                                            | Shape                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `path`                                                                         | `'forwarding' \| 'new-number'`                                                  |
| `network` + `networkCorrectedManually`                                         | `'mtn' \| 'airtel' \| 'unknown'` + boolean                                      |
| `conditions`                                                                   | ordered `ForwardCondition[]` — keep scalar `condition` for back-compat          |
| `verification`                                                                 | richer: `attempts`, `lastAttemptAt`, `outcome`, `lastVerifiedAt`, `nextCheckAt` |
| `voicemailConflictAcknowledgedAt` · `assistedRequestedAt` · `forwardingLostAt` | timestamps                                                                      |
| `provisioning`                                                                 | sub-object for Path B                                                           |

**New pure functions in `phone-channel.ts`:** `deactivationCodeFor(condition)` returning
`##61#`/`##67#`/`##62#`/`##21#` · `CLEAR_ALL_FORWARDING = '##002#'` · `INTERROGATE_CODE_FOR(condition)` ·
`forwardingCodes(channel)` returning the ordered `{condition, code, deactivate}[]` · the verification
outcome enum + a reducer mapping outcome → next `PhoneChannel` · `isReverificationDue(channel, now)`.

**A carrier-prefix map** belongs in `packages/core/src/format.ts` beside the existing `ALLOCATED_RW_MNO`
— there is none today. It must degrade to `unknown` and be overridable by a plain `<select>` for the
no-JS path. Surface it as _"You're on MTN · detected from your number's prefix · Not right?"_

---

# PART 14 — EVENTS

Add nine variants to `packages/domain/src/events.ts`, with the property sets named in atlas §12:

`phone.path_chosen` · `phone.network_detected` · `phone.code_shown` · `phone.verification_attempted` ·
`phone.verification_result` · `phone.caller_id_preserved` · `phone.assisted_requested` ·
`phone.forwarding_lost_detected` · `number.provisioning_state_changed`

**Parameterise the hardcoded capability in `emit()`** so `phone.*` rows audit against
`setupCallForwarding` rather than `completeSignupAndActivation`.

All nine emit from **server actions, not client handlers**, so they survive the JS-disabled path.

---

# PART 15 — COPY LAW

**Every failure sentence must have a non-user grammatical subject.** Here external attribution is not a
kindness — it is **literally true**, which is rare and should be stated as fact.

**Lint-ban in this Surface's catalogue:** _invalid_ · _illegal_ · _incorrect_ · _failed to_ · _you must_
· _you forgot_ · _please ensure_ · _oops_ · _whoops_ · _something went wrong_.

The canonical stance is already written and should survive verbatim:

> _"Your phone said Invalid MMI code. That message comes from the handset or the network, not from us,
> and it does not mean you typed it wrong."_

Add `w`-prefixed message blocks for the new screens to **both** `apps/studio/messages/en.json` and
`rw.json` in parity. `phone.html` supplies Kinyarwanda for every string via `data-rw`. **Never let an
English default in `@subiza/ui` be the rendered string on an `rw` console.**

> **One claims-registry correction:** GSMA puts Rwandan **smartphone** penetration at ~22% (2023). The
> 38% figure circulating in the project is **internet** penetration. Fix it wherever it appears.

---

# PART 16 — VERIFICATION

| Audit                  | Pass condition                                                        |
| ---------------------- | --------------------------------------------------------------------- |
| Fake verification gone | `verifyForwarding` can fail; no unconditional stamp                   |
| Step untouched         | `git diff` on `PhoneStep.tsx` and its source is empty                 |
| Seam physically true   | Route imports from `features/phone`; `ConnectionsSurface` composes it |
| Domain boundary        | No phone shape outside `phone-channel.ts`; violation fails lint       |
| Six outcomes           | Each individually reachable via `forceState`                          |
| `inconclusive`         | Never renders as `not-diverted`                                       |
| G22 violation          | `**21` registration surfaces immediately with `##21#`                 |
| Billing                | Recurring checks reject with 486; only activation answers             |
| iOS                    | Dial button **absent**, three numbered steps present                  |
| `%23`                  | Every `tel:` href percent-encodes `#`                                 |
| Voicemail              | Disclosure renders before the code, above the string, `*#61#` inline  |
| Three codes            | "Everything I miss" shows per-code progress off the domain array      |
| Ladder                 | Linear, cheapest-first, one conditional branch                        |
| Blameless              | Lint passes over the whole catalogue                                  |
| Human                  | Every failure screen names a person, a window, an action              |
| Capability             | `dal.changeForwarding` exists; strength decision written down         |
| Events                 | Nine emit server-side with JS off                                     |
| Re-verification        | Never schedules outside waking hours                                  |
| No-JS                  | All nine screens                                                      |
| rw @ 360               | No overflow, both themes                                              |
| Flag                   | `CARRIER_FORWARDING` still `false`; claims gated                      |

## 16.1 The adversarial pass

A **different agent from every author**. Try to: make the Surface show "connected" without an observed
call · get `inconclusive` to render as the carrier's fault · register `**21` and have it pass · trigger a
recurring check that answers and bills the owner · reach a failure screen with no human on it · write a
phone field outside `packages/domain` · break activation's w8 by extending the schema.

---

# PART 17 — DELIVERABLES & NEXT

1. The four Phase-A defects fixed — the fake verification first
2. `phoneChannelSchema` extended additively, with the six new pure functions
3. The real loopback verification state machine, six outcomes, 60-second retry
4. Nine screens as routes under `/connections/phone`, all no-JS
5. The repair ladder with its conditional prepaid branch and terminal route
6. The voicemail disclosure, the undo codes, the gated cost claim
7. Path B provisioning
8. The re-verification clock, `ChannelTile` health, `StateBoundary` on `/connections`
9. `dal.changeForwarding` + the written auth-strength decision
10. Nine events; the blameless-copy lint rule; `en`/`rw` parity
11. The tests that do not exist today — four outcomes, three-code sequence, deactivation derivation, the
    60-second retry, skip-then-verify, the capability denial path
12. The adversarial report

**Prompt 06** — Messaging channel connection (`Design/channels.html`): the hub, Meta's handoff and its
5–15 day queue, Instagram's one-private-reply-per-comment limit, Telegram in one tap, and the six-state
WhatsApp sub-flow. Say **next**.

---

# PART 18 — APPENDIX

## A — Why the loopback proves it

```
   OWNER'S HANDSET                 CARRIER (HLR/MSC)              SUBIZA
        │                               │                           │
        │  dials **61*<subiza>*11*20#   │                           │
        ├──────────────────────────────►│  CFNRy registered         │
        │                               │  (silently replacing      │
        │                               │   whatever was there —    │
        │                               │   usually voicemail)      │
        │                               │                           │
        │                               │◄──────────────────────────┤ outbound call
        │◄──────────────────────────────┤  rings the owner          │ from verification DID
        │                               │                           │
        │   ── rings 20s, unanswered ── │                           │
        │                               │                           │
        │                               ├──────────────────────────►│ ★ INBOUND INVITE
        │                               │   diverts to our DID       │   lands on OUR trunk
        │                               │                           │
                                                                    │
   ══ THE PROOF IS THE LOOP CLOSING ON OUR OWN TRUNK ══             │
      not audio · not AMD · not a query API                         │
                                                                    │
   latency  ~1-5s   ⇒ **21 UNCONDITIONAL ⇒ G22 VIOLATION, undo now  │
            ~20-25s ⇒ **61 no-reply      ⇒ correct                  │
   callerNumber = our DID      ⇒ caller ID survives                 │
   callerNumber = owner MSISDN ⇒ carrier substituted the diverter   │
                                                                    │
   REJECT with SIP 486 on recurring checks — GSM bills at ANSWER.   │
   Answering a weekly check spends ~RWF 3,000-5,200/yr of THEIR     │
   airtime on OUR monitoring.                                       ▼
```

## B — Six outcomes, not four

```
                        ┌──────────── s4 VERIFYING ────────────┐
                        │  "Let it ring out. Don't pick up."   │
                        └──────────────────┬───────────────────┘
                                           ▼
        ┌──────────┬──────────┬────────────┼────────────┬──────────────┐
        ▼          ▼          ▼            ▼            ▼              ▼
   ① diverted  ② owner-   ③ not-      ④ diverted-  ⑤ diverted-   ⑥ inconclusive ★
              answered    diverted    no-caller-id   elsewhere ★
        │          │          │            │            │              │
     SUCCESS    NEUTRAL    FAILURE    PASS + CAVEAT   FAILURE      OUR FAULT
        │       not red       │         not red      voicemail        │
        │          │          │            │       still owns it      │
        ▼          ▼          ▼            ▼            ▼              ▼
      s7 done   retry s4   s6 repair   s7 + note   s6 + voicemail  retry — NEVER s6
                                                      branch

   ★ = absent from the design. ⑥ conflated with ③ would send the owner
       into troubleshooting for OUR webhook failure. G20 forbids it.
```

## C — The repair ladder

```
   cheapest ─────────────────────────────────────────────► most expensive
   non-destructive ───────────────────────────────────────► destructive

   ① shorter form      **61*<n>#        no SIB, no timer — fewest rejections
        │                                (TS 22.030 also permits *SIA**SIC#)
        ▼
   ② interrogate       *#61#            NON-DESTRUCTIVE. often reveals the
        │                                voicemail conflict
        ▼
   ③ erase all         ##002#           destructive but reversible
        │                                clears a conflicting registration
        ▼
   ④ a human calls     ≤15 min          Mon-Sat 08:00-19:00, full context
        │              >95% within 1h    carried — they never re-explain
        ▼
   ⑤ SOME LINES SIMPLY CAN'T  ──────►  PATH B: a new Subiza number
      prepaid plans that bar forwarding
      say it plainly — do not offer a fifth attempt at the same code

   Every rung states G22: your own phone still rings. Your number is
   untouched. Nobody was lost.
```

---

_Prompt 05 · Subiza · Phone Connection_
_Built against `Design/phone.html`, atlas Flow 07, 3GPP TS 22.030 / 22.082, and docs 07 and 13._
_Where this document and the prototype disagree, this document wins — including on SIB._
