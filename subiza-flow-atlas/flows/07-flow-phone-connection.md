# 07 — Flow: Phone Connection

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-07 |
| **Actor** | A5 Owner (+ the carrier, and A11 CPaaS) |
| **Entry points** | Activation step 8 · Connections · Home next-action |
| **Exit states** | Forwarding verified · Dedicated number live · Skipped (sandbox) · Blocked |
| **Depends on** | 05, 06 |
| **Blocks** | Live calls |
| **Frequency** | Once, plus repair |
| **Criticality** | **Existential** |
| **Target duration** | 5 minutes |

---

## 1. Purpose

Get real customer calls to reach the AI, without the business changing the number their customers already know.

**What breaks if this is wrong:** the product never touches a real customer. This is also the step with the most external dependency and the least control, which is why it is designed as *guidance plus verification* rather than as an action we perform.

---

## 2. Overview

```
                    "How should customers reach Subiza?"
                                  │
            ┌─────────────────────┴─────────────────────┐
            ▼                                           ▼
   ┌──────────────────────┐                  ┌──────────────────────┐
   │ KEEP MY NUMBER       │  ← recommended   │ GET A NEW NUMBER     │
   │ (call forwarding)    │                  │ (we provision one)   │
   └──────────┬───────────┘                  └──────────┬───────────┘
              ▼                                         ▼
   detect network from prefix                  business verification
              ▼                                         ▼
   show the exact GSM code                     regulatory KYC bundle
   as a tap-to-dial link                                ▼
              ▼                                  number assigned
   owner dials it on their phone                        ▼
              ▼                                   test call
   ★ WE PLACE A VERIFICATION CALL ★                     ▼
              ▼                                      LIVE
   "We just called your number.
    Subiza answered. It's working."
              ▼
            LIVE
```

---

## 3. Preconditions

- Account exists; agent configured enough to answer ([Flow 06](06-flow-guided-activation.md) Parts One–Two).
- An escalation target is set — we refuse to go live without one.
- For the new-number path: business verification started ([Flow 04 §9](04-platform-constraints.md)).

---

## 4. Detailed flow — Path A: keep my number (recommended)

### Step 1 — Choose the path

| | |
|---|---|
| **Sees** | Two cards. **Keep my number** carries the recommendation and one line: *"Your customers keep calling the number they already know. Subiza picks up only what you miss."* **Get a new number** explains: *"A separate line just for Subiza. Takes a few days to set up."* |
| **Does** | Taps one |
| **System** | Branches |

**Why forwarding is recommended:** it requires no porting, no regulatory bundle, no waiting, and no change to printed cards, shop signs or word of mouth. It also produces a better product — because conditional forwarding means every call Subiza handles is, by definition, a call the business would have lost. That is the value metric ([Flow 16](16-flow-analytics-and-retention.md)) generated as a side-effect of the setup choice.

### Step 2 — Choose what to forward

| | |
|---|---|
| **Sees** | Three options, matching the go-live scope from activation: **When I don't answer** *(recommended)* · **When my phone is off or unreachable** · **All calls, always** — each with one line of plain explanation |
| **Does** | Picks |
| **System** | Selects the corresponding GSM supplementary-service code |

| Choice | Code | Deactivate |
|---|---|---|
| When I don't answer | `**61*<subiza number>#` | `##61#` |
| Busy | `**67*<subiza number>#` | `##67#` |
| Unreachable / off | `**62*<subiza number>#` | `##62#` |
| All calls | `**21*<subiza number>#` | `##21#` |

Most businesses want **no-answer plus busy plus unreachable** — the "catch what I miss" set. The product offers that as one option and dials the three codes in sequence.

### Step 3 — Dial the code

| | |
|---|---|
| **Sees** | The exact code, large, with the Subiza number already inserted. A **tap-to-dial** button. A photograph of what the phone shows when it works. Network detected from the number prefix and named: *"You're on MTN"* |
| **Does** | Taps the button — which opens their dialler with the code pre-entered — and presses call. Their phone shows a network confirmation |
| **System** | Nothing. **We cannot do this step.** It is a carrier-side action on their handset |
| **Can fail** | Wrong network detected → a manual switcher. Code rejected by the network → alternate code formats and a support path. Owner does not understand → a 20-second video in Kinyarwanda, and a "call me and I'll walk you through it" button that pages Onboarding Ops |

**This is the single most awkward moment in the product**, and the research confirms there is no way around it: there is no API to set call forwarding on an arbitrary GSM handset, and the emerging network API for even *querying* forwarding status is early-stage and carrier-dependent, not available in this market. So the design goal is not automation — it is making a 15-second manual action feel trivial and immediately rewarded.

### Step 4 — Verification (the delight moment)

| | |
|---|---|
| **Sees** | *"Let's check it worked."* A button: **Test it now**. Then a live status: *Calling your number… Ringing… Subiza answered.* Finally: **✅ It's working. Your customers' missed calls now reach Subiza.** |
| **Does** | Taps, and does **not** answer their phone (instructed clearly: *"Let it ring — don't pick up"*) |
| **System** | Places a call to the owner's number from a verification line. If forwarding is active on no-answer, the call lands on the Subiza platform after the ring timeout. We observe where it lands and confirm. We also capture whether **caller ID survived the forward** and record it on the tenant |
| **Can fail** | Call answered by the owner → "You picked up — that's fine, that's what should happen. Let it ring next time." Call did not divert → troubleshooting branch. Diverted but caller ID lost → still a pass, with personalisation disabled and a note |

**Verification is not optional and not a formality.** It converts an act of faith into an observed fact, in the same session. It is also the only reliable way we can know forwarding is active.

### Step 5 — Confirm and finish

| | |
|---|---|
| **Sees** | A summary: which calls forward, to what, how to turn it off (`##61#` etc.), and one line: *"You can undo this at any time. Here's the code."* |
| **Does** | Continues |
| **System** | Marks the phone channel connected; records the code set and the deactivation codes for later display |

**Showing the undo code is deliberate.** A user who knows how to reverse a change is far more willing to make it. Hiding the exit does not increase retention; it increases hesitation.

---

## 5. Detailed flow — Path B: a new Subiza number

| Step | What happens |
|---|---|
| 1 | Explain honestly: *"A new number takes a few days because the regulator needs your business documents."* No false speed |
| 2 | **Business verification** — the unified document collection from [Flow 04 §9](04-platform-constraints.md): RDB certificate, owner ID, address. Collected once and reused for Meta and CPaaS |
| 3 | Choose from available numbers (area, memorability) where the provider allows selection |
| 4 | **Pending state** — a screen with a status object, an expected timeframe, and a reminder that everything else in Subiza works meanwhile |
| 5 | Number assigned → test call → live |

**Path B is honest about waiting.** CPaaS number provisioning is programmatic but gated on regulatory KYC approval, which is not instant in this region and often involves manual liaison. Promising "instant" and delivering "four days" is how trust is lost in week one.

---

## 6. Screens and states

| Screen | States |
|---|---|
| Path choice | Fresh · forwarding chosen · new number chosen |
| Forward scope | Choosing · selected |
| Dial the code | Code shown · network mis-detected · dialled · unclear |
| Verification | Ready · calling · ringing · answered by Subiza ✅ · answered by owner · not diverted ❌ · diverted without caller ID ⚠ |
| Troubleshooting | Alternate codes · manual network choice · assisted-call request |
| New number | Explaining · verification pending · documents rejected · number selection · assigned |
| Connected | Healthy · degraded · forwarding appears removed |

---

## 7. Decisions and branches

| Decision | Branches |
|---|---|
| Keep number or new? | Forwarding · provisioning |
| Which network? | MTN · Airtel · detected wrong → manual |
| Which forwarding type? | No-answer · busy · unreachable · all · the recommended set of three |
| Verification result? | Diverted ✅ · owner answered → retry · not diverted → troubleshoot · no caller ID → pass with a flag |
| Owner stuck? | Video · assisted call → Onboarding Ops queue |
| Documents rejected (Path B)? | Reason shown, resubmission, support |

---

## 8. Platform constraints

| Constraint | Effect |
|---|---|
| **P1** — we cannot set forwarding | The entire flow is guidance + verification. Never claim we set it up (F7) |
| **P2** — verification only by test call | Step 4 is an active test, by design |
| **P3** — provisioning gated on KYC | Path B has an honest multi-day pending state |
| **4.a (unverified)** — do MTN/Airtel Rwanda honour these codes? | Until tested, the flow carries a "code not accepted" branch and an assisted path |
| **4.b (unverified)** — does caller ID survive, and who pays for the forwarded leg? | Caller-ID loss is handled as a graceful degradation. **Forwarding-leg cost must be disclosed to the owner as soon as it is known** — discovering an unexpected carrier charge would be a serious trust breach |

---

## 9. Edge cases and failures

| Case | Behaviour |
|---|---|
| Code accepted but verification fails | Wait 60 seconds (network propagation) and retry once automatically before reporting failure |
| Owner has already forwarded to a voicemail service | Detected as "diverted elsewhere"; explain the conflict and offer to replace |
| Business uses a landline or PBX | Different mechanism entirely; routed to assisted setup |
| Owner's phone number is the same as the account number | Allowed and common. Handled explicitly rather than treated as an error |
| Forwarding silently removed later (SIM swap, network reset) | **Detected by periodic verification calls** (weekly, off-peak) and surfaced as an amber Connections state with the code to re-dial |
| Credit exhausted | Forwarding stays, but Subiza declines the call so it rings back to the owner. **Never a dead line** (G22) |
| Platform outage | Same: calls fall back to the owner's own phone |
| Owner wants to stop using Subiza | Deactivation codes shown in Settings, permanently, not hidden |

**The periodic re-verification is important.** Forwarding is state held on the carrier's switch, not by us, and it can disappear without any signal. A weekly silent check is cheap and prevents the worst possible failure: a business that thinks it is covered and is not.

---

## 10. Retention rationale

| Decision | Reason |
|---|---|
| Forwarding over porting | No number change means no lost customers, no printed material wasted, no regulatory wait. The conversion difference is enormous |
| Conditional over unconditional, recommended | Preserves the owner's agency; every handled call is provably a recovered one |
| Verification in-session | Converts faith into fact and produces a moment of visible success |
| Undo code shown up front | Reversibility reduces hesitation |
| Assisted-call escape hatch | This is the step most likely to defeat a non-technical owner, and a human rescue here is cheap relative to a lost customer |
| Honest waiting on Path B | Under-promising on a multi-day regulatory process protects trust |

---

## 11. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 7.1 | Forwarding set up and verified in one session | Verified ÷ started | > 80% |
| 7.2 | Median time | Path choice → verified | < 5 min |
| 7.3 | Verification is reliable | False negatives on the verification call | < 2% |
| 7.4 | Assisted rescue is available and used | Assisted requests answered within one business hour | > 95% |
| 7.5 | Forwarding loss is detected | Silent removal detected within 7 days | 100% |
| 7.6 | Credit exhaustion never kills the line | End-to-end test at zero balance: call reaches the owner | Pass |
| 7.7 | Deactivation codes are always findable | Present in Settings and in the connection summary | Pass |
| 7.8 | Caller-ID outcome is recorded per tenant | Field populated after verification | 100% |
| 7.9 | Path B states the real timeframe, never "instant" | Copy audit | Pass |

---

## 12. Instrumentation

| Event | Properties |
|---|---|
| `phone.path_chosen` | forwarding / new number |
| `phone.network_detected` | network, corrected manually? |
| `phone.code_shown` | code type, network |
| `phone.verification_attempted` | attempt number |
| `phone.verification_result` | diverted / owner answered / not diverted / no caller ID |
| `phone.caller_id_preserved` | boolean |
| `phone.assisted_requested` | step |
| `phone.forwarding_lost_detected` | days since last verified |
| `number.provisioning_state_changed` | state, days elapsed |

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 7.a | Do MTN and Airtel Rwanda honour `**61*`, `**67*`, `**62*` and `**21*` today? | The entire go-to-market |
| 7.b | Does caller ID survive the forward on each network? | Personalisation, CRM matching |
| 7.c | Who pays for the forwarded leg, and how much? | Honest pricing |
| 7.d | Can forwarding be set from a carrier self-care portal, enabling us to guide it there instead of by USSD? | Step 3 friction |
| 7.e | What is the real ring timeout before no-answer forwarding triggers, and is it adjustable? | Caller experience |
| 7.f | Is weekly re-verification too frequent (cost) or too infrequent (risk)? | Operations |

---

*Next: [08 — Messaging Channel Connection](08-flow-messaging-channel-connection.md)*
