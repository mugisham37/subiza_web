# SUBIZA — BUILD PROMPT 03

## Authentication & Authorization

> **This is the first phase where a mistake is a breach, not a bug.**
>
> Prompts 01 and 02 built a design system and a marketing site. Getting those wrong costs a redesign.
> Getting this wrong hands someone a business's inbound customer calls, its customers' conversation
> data, and its prepaid balance. Rwanda's Law 058/2021 attaches 7–10 years and RWF 20–25 million to the
> worst version of that.
>
> **Read Part 5 before you write a line.** It is the security model everything else hangs from.

|                                  |                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Prompt**                       | 03 of the series — Authentication & Authorization                                                                       |
| **Corresponds to**               | `Design/auth.html` (flow 1.2 in `Design/PROGRAMME.md`, atlas Flow 05)                                                   |
| **Builds on**                    | Prompts 01 and 02 — the design system, the marketing site, the typed capability matrix                                  |
| **Apps**                         | `apps/site` (the auth screens live here), `apps/studio` (becomes reachable), `packages/auth-tenant`, `packages/core`    |
| **Ships**                        | 5 sign-up screens · sign-in · workspace chooser · 6 recovery paths · sessions · **and the capability matrix made real** |
| **Blocking external dependency** | **Sender-ID registration with MTN and Airtel — ~3 weeks each. Start it today.** See §15                                 |
| **Next prompt**                  | 04 — Guided activation (`Design/activation.html`)                                                                       |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 What is different about this phase

Two things.

**First, half of this prompt is invisible.** `Design/auth.html` shows nine screens. The other half of
the work — the Data Access Layer, the session model, tenant isolation, the audit log, the enforcement of
a 22×4 capability matrix that has been sitting typed-but-inert since Prompt 01 — has no design file
because it has no pixels. It is still the larger half, and it is the half that fails silently.

**Second, `auth.html` is a two-mode document.** `#m-proto` holds the live screens; `#m-spec` holds nine
numbered essay sections with control tables, state tables, success criteria, and an explicit record of
_where the designer went against the evidence and why_. **Read the spec mode.** It answers questions you
would otherwise re-litigate badly.

## 0.2 Phases

```
  ┌─ PHASE A ─ UNBLOCK & CORRECT ─────────────────────────────────┐
  │  A1 Start MTN + Airtel sender-ID registration (3 weeks each)  │
  │  A2 Fix the three inherited defects (§3.2)                    │
  │  A1 is paperwork — start it, then carry on. A2 gates Phase C. │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ THE SPINE ─────▼───────────────────────────────────┐
  │  B1 Data Access Layer + TenantContext + Grant types           │
  │  B2 Session store + cookie contract                           │
  │  B3 Schema: tenants, members, verifications, sessions, audit  │
  │  SEQUENTIAL, one agent. Everything else imports this.         │
  │  Gate: an illegal cross-tenant query must not COMPILE.        │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ AUTHENTICATION ▼───────────────────────────────────┐
  │  C1 OTP engine   C2 delivery ladder   C3 rate limiter         │
  │  C4 the 5 screens  C5 sign-in + chooser                       │
  │  C1–C3 parallel. C4–C5 after C1.                              │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ AUTHORIZATION ─▼───────────────────────────────────┐
  │  D1 capability enforcement at the DAL  D2 RLS backstop        │
  │  D3 audit wrapper  D4 the AI (A10) as a subject               │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ RECOVERY ──────▼───────────────────────────────────┐
  │  Six flows, one door. The constrained session. §12            │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE F ─ ADVERSARIAL ───▼───────────────────────────────────┐
  │  F1 cross-tenant  F2 OTP abuse  F3 enumeration  F4 no-JS      │
  │  F5 a11y  F6 recovery social-engineering  F7 red team         │
  │  F7 is a DIFFERENT agent from every author. Non-negotiable.   │
  └───────────────────────────────────────────────────────────────┘
```

## 0.3 Agents

| Agent                      | Owns                          | Must be told                                                            |
| -------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| **Platform engineer**      | B1–B3. The spine.             | A missing tenant scope must be a _compile_ error, not a review catch.   |
| **Auth engineer**          | C1–C3. OTP, delivery, limits. | Every rule in §8 traces to a named attack. None is optional.            |
| **Screen engineers** (×2)  | C4–C5, E.                     | The copy is the spec. Server-first; the form posts with JS off.         |
| **Authorization engineer** | D1–D4.                        | The DAL is the one authoritative layer. Not the proxy. Not a layout.    |
| **Recovery engineer**      | E.                            | Six flows, one door. Time is the control; evidence is only the trigger. |
| **Red team**               | F7. **Never an author.**      | Your job is to take over an account. Report how far you got.            |

## 0.4 Three rules

**Rule 1 — Fail closed.** Every ambiguity resolves to _denied_. A missing tenant context is an error, not
an empty filter. No capability check defaults to true.

**Rule 2 — The copy is compliance.** `auth.html` line 1176 makes a public promise: _"Nobody from Subiza
will ever call you and ask for a code."_ Your job is to make that **technically impossible**, not merely
forbidden. An OTP must not be readable, generatable or sendable from any admin surface, ever.

**Rule 3 — Never lock an account.** The phone number _is_ the account and it is **printed on the shop
front**. Any identity-keyed lockout is a denial-of-service that anyone can trigger against a business
whose phone Subiza answers. Throttle the credential and the request source. Never the identity.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A person with a Rwandan phone number can create a Subiza account in under two minutes, sign in again,
belong to more than one business, get back in when their phone is lost or their SIM is swapped — and
**every capability in the matrix is enforced at a single authoritative layer, with an audit trail, and
one tenant cannot reach another's data by any path.**

## 1.2 Definition of done — twenty-four criteria

| #   | Criterion                                                                   | Proven by                                                                              |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Sign-up completes in ≤2 minutes, median, on a mid-range Android over 3G     | Timed run on a real device                                                             |
| 2   | Every screen works with JavaScript disabled, including resend and fallbacks | Playwright `javaScriptEnabled: false`                                                  |
| 3   | **No screen reveals whether a number has an account before verification**   | Enumeration test: unknown vs known number produce byte-identical responses and timings |
| 4   | **No screen reveals a business name before a verified code**                | Same test, extended to the recycled-number path                                        |
| 5   | OTPs are stored as HMAC with a KMS pepper, never plaintext or bare hash     | Schema + code review + a test asserting no reversible storage                          |
| 6   | OTP codes come from a CSPRNG with rejection sampling; `000042` is valid     | Statistical test over 100k draws; leading-zero test                                    |
| 7   | Resend does **not** reset the verify-failure counter                        | Abuse test: 3 wrong → resend → 3 wrong → blocked                                       |
| 8   | Sends are restricted to allocated +250 MNO prefixes                         | Attempt a foreign number; refused before any spend                                     |
| 9   | A spend ceiling trips a circuit breaker and pages a human                   | Simulated pumping run                                                                  |
| 10  | Voice OTP is gated at 60s **and** ≥2 failed SMS                             | State test                                                                             |
| 11  | No account is ever locked by failed attempts                                | Sustained wrong-code attack leaves the owner able to get in                            |
| 12  | Session cookie is `__Host-` prefixed, never `Domain=.subiza.rw`             | Response header inspection                                                             |
| 13  | Pre-auth session is **deleted** and a fresh id minted on verification       | Session-fixation test                                                                  |
| 14  | Cross-origin handoff uses a signed, single-use, ≤60s token                  | Replay test fails                                                                      |
| 15  | **A cross-tenant query does not compile**                                   | Deliberate violation must fail `tsc`                                                   |
| 16  | **A cross-tenant request returns `notFound`, never `denied`**               | Response-parity test                                                                   |
| 17  | Postgres RLS blocks a cross-tenant read even if the app layer is bypassed   | Direct SQL test as the app role                                                        |
| 18  | A `readonly` grant cannot reach a mutation                                  | Deliberate violation must fail `tsc`                                                   |
| 19  | A scoped grant cannot satisfy a wider operation                             | `pause-only` must not satisfy `resume`                                                 |
| 20  | Role change and removal take effect within 60 seconds                       | Timed revocation test                                                                  |
| 21  | Every consequential write is audited in the same transaction                | Audit coverage test; no `UPDATE`/`DELETE` grant on the table                           |
| 22  | Every capability has at least one enforcement site                          | CI test enumerates the matrix and fails on an orphan                                   |
| 23  | **No number change is instant.** ≥72h, 7 days without Tier-A evidence       | Recovery timing test                                                                   |
| 24  | Every failure path ends at a reachable human                                | Manual walk of all 9 refusal screens                                                   |

## 1.3 Not in this phase

The activation wizard (Prompt 04) — sign-up ends at _"Your account exists"_ and hands off. The admin
console's screens. Real SMS in production (use a test provider until §15 clears). Passkeys — designed
for in §5.3, built later. Team invitations beyond the schema — Prompt 16.

---

# PART 2 — CONTEXT ABSORPTION

| #   | Read                                                             | Extract                                                                                                                            |
| --- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Design/auth.html` — **both modes**                              | All 1,596 lines. `#m-proto` for the screens; `#m-spec` §01–§09 for the reasoning, control tables, state table and success criteria |
| 2   | `subiza-flow-atlas/flows/05-flow-signup-and-account-creation.md` | The spec this implements                                                                                                           |
| 3   | `subiza-flow-atlas/flows/01-actors-roles-and-permissions.md`     | **The 22×4 matrix and the 9 impersonation rules**                                                                                  |
| 4   | `subiza-flow-atlas/flows/18-flow-team-and-permissions.md`        | Member lifecycle, the 60-second revocation requirement                                                                             |
| 5   | `subiza-flow-atlas/flows/21-admin-tenant-lifecycle.md`           | Suspension, and the second-approver rule                                                                                           |
| 6   | `subiza-flow-atlas/flows/25-flow-notifications.md`               | **N2, N5, N7 — what the product pushes to the handset. This defeats a recovery question. §12.4**                                   |
| 7   | `packages/core/src/capabilities.ts`                              | What is typed today, and what `can()` currently gets wrong                                                                         |
| 8   | `prompts/01-foundation-and-design-system.md` Part 5              | The Next 16 correction sheet. Still binding                                                                                        |
| 9   | `docs/09-legal-regulatory-ethics.md`                             | Consent, retention, breach notification duties                                                                                     |

## 2.1 The gate

1. Why does `auth.html` say there is no CAPTCHA, and what replaces it?
2. Why are there **two** consent checkboxes, and why would one be legally invalid?
3. Why does the language screen come **before** the terms screen?
4. What does _"the number is the account"_ cost you when the number is lost?
5. Name the one enforcement layer that is authoritative, and say why a layout is not.

An agent that cannot answer #5 must not write authorization code.

---

# PART 3 — WHAT YOU INHERIT

## 3.1 Already built — compose, do not rebuild

`packages/ui` — the full design system, including `PhoneField`, `OtpField`, `ChoiceCard`, `Banner`,
`Card`, `Toast`, `StateBoundary` and all eight state components.
`packages/core` — `ViewState<T>`, branded ids, `Fidelity`, formatters, `claims.ts`, `citations.ts`,
`pricing.ts`, `verifications.ts`, and **`capabilities.ts`** — the matrix, typed and unit-tested.
`apps/site` — the marketing site, with `/start` and `/signin` as **handoff stubs** carrying a disabled
phone field and no logic. You are replacing them.

## 3.2 Three inherited defects — fix in Phase A

**Defect 1 — `OtpField` wraps `input-otp`, which breaks the JS-disabled law.**

Prompt 01 specified `input-otp` as one of two permitted runtime dependencies. That was wrong, and this
phase corrects it. The library is a React client component: with JavaScript disabled the field does not
render a usable input, so the single most important form in the product fails the law that Prompt 01
itself set. The design's own markup — a plain `<input>` under six `aria-hidden` painted slots — satisfies
WCAG 2.2 SC 3.3.8 _and_ the no-JS rule, at zero bytes.

_Fix:_ replace with a server-rendered
`<input type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6"
enterkeyhint="done" name="code">` over six `aria-hidden` spans, styled by the existing `.otp` CSS. Paint
the slots with a ~20-line progressive-enhancement script. Drop `input-otp` from
`packages/ui/package.json` and from Prompt 01's permitted list. Remove the redundant `aria-label` so the
visible `<label for>` governs (SC 2.5.3). Extend `aria-describedby` to reference the error node as well
as the countdown, and set `aria-invalid` on failure.

**Defect 2 — `PhoneField` has two accessibility faults.** `autoComplete="tel"` should be
**`tel-national`** — with a fixed `+250` prefix, `tel` invites the browser to autofill a full
international number into a field that already carries the country code. And the inert
`<button className="cc">` is a keyboard trap and an empty promise to assistive technology: make it a
non-focusable `<span aria-hidden="true">` with the country code in the label text, or a real `<select>`.

**Defect 3 — the handoff stub invents a `1 / 5` label.** `auth.html` has no such text; progress is five
`aria-hidden` 3px marks (`.prog`), decoration only, never announced. Match the design.

---

# PART 4 — THE LAW, AS IT APPLIES HERE

Everything from Prompt 01 Part 3 binds: the eight states, 360/560/860/1080, 48×48 targets, WCAG 2.2 AA
plus 2.4.13, the performance budget, motion tokens, reduced-motion with no exemptions, lime never as
text, **and every component except the theme switch working with JavaScript disabled.**

Four additions specific to authentication.

**4.1 — G22 outranks every security control.** _"The platform never makes a business less reachable than
it was before Subiza."_ No authentication state, no rate limit, no suspension and **no recovery state**
may ever degrade, freeze or interrupt inbound calls and messages. If everything fails, calls fall back
to the owner's own line. This is why §0.4 Rule 3 exists.

**4.2 — G9 is unconditional.** The kill switch — pause the AI — stays available to every role in every
state, including during a recovery hold.

**4.3 — Success criterion 5.8 is 100%, not best-effort.** Every failure path ends at a reachable human.
No refusal screen may be terminal.

**4.4 — The audience is trust-sensitive and socially engineered.** Handset sharing is common. Vishing is
the live threat. This is why the enumeration leak in §7.1 matters more here than it would elsewhere.

---

# PART 5 — THE SECURITY MODEL

> Read this before writing code. Everything downstream is an application of it.

## 5.1 SMS OTP is a _restricted_ authenticator

NIST SP 800-63B-4 §3.2.9 now classes PSTN-delivered codes as **restricted** — permitted, but only with a
documented risk acceptance, a non-restricted alternative offered, user notification, and a migration
roadmap.

In this market SMS is the only viable channel. You do not get to reject it. You compensate for it.

## 5.2 The compensation — authentication strength tiers

**This is the central new idea of this phase, and it is a change to `packages/core/capabilities.ts`.**

The matrix is role-only today. Add an orthogonal **authentication-strength** dimension, so that a
capability requires both a role grant _and_ a sufficient auth strength:

| Strength      | How it is reached                                                                           | What it authorises                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **otp**       | A verified SMS/WhatsApp/voice code                                                          | Read the inbox. Reply. Pause the AI. Ordinary daily work                                                                    |
| **elevated**  | A second signal — an account PIN, a passkey, or a re-verification within the last 5 minutes | **Change the forwarding number. Change billing. Add or promote a member. Export data. Delete data. Initiate voice cloning** |
| **recovered** | A completed recovery                                                                        | A _reduced_ set for 14 days. §12.6                                                                                          |

A single SMS code is enough to read an inbox. It is **not** enough to walk off with a business line, its
prepaid balance, or its customers' personal data. This is the concrete, implementable answer to NIST's
restricted-authenticator status, and it is a typing-and-enforcement change, not a product redesign.

## 5.3 The non-restricted alternative

NIST requires one be _offered_. Design the passkey path now — the schema, the capability tier, the
settings surface — and build it in a later phase. Recording it here is what makes the risk acceptance
honest.

## 5.4 The threat model, named

| Threat                                    | Control                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Account enumeration → vishing target list | §7.1 unified flow. Never disclose existence or business name pre-verification                    |
| SMS pumping / IRSF toll fraud             | +250 prefix restriction, spend ceiling with circuit breaker, send-vs-verify ratio monitor        |
| OTP brute force                           | 5 attempts per code, 10 per number per hour, **resend does not reset the counter**               |
| Denial-of-service against a business line | **Never lock an identity.** Throttle credential and source only                                  |
| SIM swap                                  | MoMo micro-payment evidence (§12.5), 72h minimum hold, notification to the original number       |
| Number recycling                          | §12.3 — the interstitial the design is missing                                                   |
| Session fixation                          | Delete the pre-auth record; mint a fresh id                                                      |
| Cross-subdomain session theft             | `__Host-` prefix; never `Domain=.subiza.rw`                                                      |
| Help-desk social engineering              | No role may shorten a cooldown. Two staff actors for a number change. OTPs unreadable from admin |
| Cross-tenant data access                  | DAL chokepoint + `TenantContext` + composite FKs + RLS backstop                                  |
| Prompt injection against the AI           | A10 holds grants; the dispatcher never offers a tool it lacks a grant for                        |

---

# PART 6 — THE SCREENS

## 6.1 The frame

Two-pane: `.authmain` (the form, 440px measure, vertically centred) beside `.authaside` (a contextual
essay pane that swaps per screen). At ≤980px it collapses to one column and the aside moves **below** the
form with a top hairline. At ≤640px padding tightens to 20/16/24 and the resend countdown chip hides —
the disabled state alone carries the meaning.

`.authhead` — `.blogo` left, a step `Tag` right whose text is computed: _Creating an account_ /
_Signing in_ / _Getting back in_ (with Kinyarwanda twins).
`.authfoot` — one line: _Personal data stored in Rwanda · Privacy notice · ibanga@subiza.rw_.
`.prog` — five 3px marks, three states (neutral / `.done` / `.now`), `aria-hidden`, hidden entirely on
sign-in and recovery. Colour-only transition at 400ms — compositor-safe.

## 6.2 Sign-up — five screens

| #   | Screen                           | Contents                                                                                                                                   |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Phone number**                 | One `PhoneField`, +250 fixed, `tel-national`. Rwandan MNO prefix validation server-side                                                    |
| 2   | **Enter the code**               | Six painted slots over one input. Resend with a server-authoritative countdown. The delivery ladder (§8.4). _Can't get a code?_ → recovery |
| 3   | **Your name, and your business** | Name, business name, business type. Business type drives the activation template in Prompt 04 — carry it forward                           |
| 4   | **Which language**               | Four languages. **Kinyarwanda is the default.** Before the terms, deliberately — §6.5                                                      |
| 5   | **Before we start**              | **Two checkboxes.** One required (the contract), one optional (marketing). §14                                                             |
| —   | **Your account exists**          | `.donemark` / `.receipt`, then hand off to activation                                                                                      |

**Five entry points, four of which change screen 1:** landing · demo call · referral link · colleague
invite · field sales. A visitor arriving from a demo call already gave a number — do not ask twice
(SC 3.3.7 Redundant Entry). An invited colleague joins an existing tenant and skips screens 3–4.

## 6.3 Sign-in

**Welcome back** → if the person belongs to one business, straight in; if several, the **workspace
chooser**. Same phone field, same code screen. See §7.1 — sign-in and sign-up are the _same_ flow.

## 6.4 Every screen, every state

`auth.html` spec §08 carries a complete state table. Reproduce it, and hold every screen to the eight
states plus these auth-specific ones: _code sent_ · _resend cooling down_ · _wrong code_ · _code expired_
· _too many attempts_ · _number not Rwandan_ · _delivery failed_ · _rate limited_ · _recycled number_.

## 6.5 Why language comes before the terms

Because the terms must be read in a language the person actually reads. Presenting consent in English to
someone who selected Kinyarwanda two screens later would make the consent worthless. Keep the order.

---

# PART 7 — THE UNIFIED FLOW

## 7.1 The enumeration leak, and the fix

`auth.html` line 890 shows a banner: _"0788 000 111 already belongs to Salon Ubwiza."_

**That must not ship.** It discloses, to an unauthenticated visitor, both that an account exists and the
business's name — producing exactly the `{number → business}` target list an attacker needs for the
vishing attack the design itself promises to defend against fifty lines later.

**The fix — unify `/start` and `/signin` into one flow:**

> One phone field. One _Send me a code_ button. **Always send.** Branch only _after_ verification:
> existing tenant with one workspace → straight in · existing tenant with several → the chooser ·
> no tenant → continue to name and business.

This removes the leak, removes the wrong-door problem entirely, and is already implied by the design's
own note that _a verified OTP creates a session, not an account_. Keep both URLs for marketing links;
render the same view. `HandoffView.tsx` already takes a `mode` prop — collapse it.

**Response parity is a test, not an intention.** An unknown and a known number must produce
byte-identical responses _and_ indistinguishable timings. Personalisation happens after verification.

---

# PART 8 — THE OTP ENGINE

## 8.1 Generation

CSPRNG with **rejection sampling** — never `Math.random()`, never a timestamp, never a counter, never
`value % 1000000` on a raw 32-bit draw (modulo bias). Store zero-padded as a **string** so `000042`
remains valid. Six digits, single-use, short expiry.

## 8.2 Storage

**HMAC-SHA256(code, pepper)** with the pepper in a KMS and never in the database. Constant-time compare.
Never plaintext; never a bare SHA-256 — a six-digit space is exhaustible offline in microseconds.

## 8.3 The counters

| Key                            | Limit                                                                    |
| ------------------------------ | ------------------------------------------------------------------------ |
| `send:num:{e164}`              | 1 per 30s, then windows at 15m / 1h / 24h                                |
| `send:ip:{ip}`                 | soft 30/h, hard 100/h; ×10 for known CGNAT ASNs                          |
| `send:dev:{cookie}`            | 5/h, 15/day — a first-party random device cookie, **not** fingerprinting |
| `verify:code:{verificationId}` | 5 attempts, then burn the code                                           |
| `verify:num:{e164}`            | **10 per rolling hour, maintained independently of code lifetime**       |

> **The last row is the one everyone gets wrong.** If a resend resets the failure counter, _three wrong,
> resend, three wrong, resend_ is an unbounded brute force wearing a cooldown as a disguise.

State lives in a **shared store** (Redis/Upstash or Postgres token buckets), never in memory — `proxy.ts`
is Node-runtime-only and multiple instances make in-memory counters useless. Read the client IP from
`(await headers()).get('x-forwarded-for')`, taking only the trusted-proxy hop, and treat it as a **weak**
signal because of CGNAT.

## 8.4 The delivery ladder

**SMS → WhatsApp at 30s → voice call at 60s _and_ ≥2 failed SMS**, whichever is later. Voice only to a
number already sent an SMS this episode; max 2 voice calls per number per 24h. Voice needs its **own,
tighter** spend cap — voice termination rates dwarf SMS and IRSF is voice-native.

**Every countdown is server-authoritative.** Emit remaining seconds into the initial HTML, and emit
`disabled` only when the server knows the cooldown is live. The design's client-side `disabled` dead-ends
a JS-disabled user at exactly the moment they need the fallback. The server must accept the POST
regardless and re-render with _"not yet — N seconds left."_

## 8.5 Anti-abuse without a CAPTCHA

The design is right to refuse one: a CAPTCHA requires JavaScript, costs bytes, burns CPU and battery on a
sub-$120 Tecno on 2G, and is an accessibility tax. Fingerprinting is worse — it also lacks a clean legal
basis under Law 058/2021.

Replace with: **+250 allocated-prefix restriction** (the primary anti-pumping control, and free) ·
**send-versus-verify ratio monitoring** (target >60%/day; alert below 40% over any rolling hour with >50
sends; compute per IP /24, per device, per prefix **and** globally — a healthy global ratio hides a
poisoned segment) · **a hard hourly and daily RWF spend ceiling** at ~2× the trailing-7-day p95, tripping
a circuit breaker that stops SMS, falls back to WhatsApp-only, and pages a human · honeypot and timing
checks · progressive friction.

## 8.6 Two UI rules

**Never auto-submit on the sixth digit.** On a slow connection a mid-correction user briefly holds six
characters, and auto-submit converts that into a false _wrong code_. Require an explicit Continue —
better for screen-reader and switch users too.

**Never** use `type="number"` (spinners, dropped leading zeros, ignored `maxlength`), never suppress
`autocomplete`, never block paste. Each independently fails SC 3.3.8, and each is a routine "hardening"
mistake.

## 8.7 Regulatory note

The RURA 08:00–20:00 CAT bulk-SMS window and opt-out-keyword rules govern **marketing**. An OTP is
transactional and user-initiated and must send 24/7. **Write this distinction in a code comment**, or a
compliance-minded engineer will eventually break night-time sign-ins.

---

# PART 9 — SESSIONS

## 9.1 Opaque session ids, not stateless JWTs

Atlas Flow 18 requires revocation within **60 seconds**, and removal to be immediate. A 15-minute JWT
gives a demoted Manager a 15-minute window to disconnect a channel — the atlas's named worst failure —
or to export conversation data, and gives a removed Agent continued access to regulated personal data.

Every JWT mitigation (denylist, token version, introspection) re-introduces the database read anyway. Use
an **opaque session id** and re-read membership per request, memoised with React `cache()` for one render
pass.

## 9.2 The cookie contract

`Set-Cookie: __Host-subiza_session=…; Secure; HttpOnly; SameSite=Lax; Path=/`

**Never `Domain=.subiza.rw`.** That hands the session to every subdomain forever. The `__Host-` prefix
makes the browser enforce the absence of a `Domain` attribute — which is the point.

Use **differently-named** cookies pre- and post-authentication.

## 9.3 Session fixation

On successful verification, **delete the pre-auth record server-side** — do not merely re-key it
(CVE-2022-24895 is exactly that bug, rated HIGH) — then mint a fresh ≥128-bit identifier.

## 9.4 Crossing origins

`subiza.rw` (where the screens live) and `app.subiza.rw` (the console) are separate origins with separate
sessions, deliberately. The handoff is a **signed, single-use, ≤60-second token** exchanged for a fresh
`__Host-` cookie on the destination origin. Never a shared-domain cookie. Replay must fail.

## 9.5 Which business am I acting as

One human may belong to several businesses. The session carries the active `TenantId`. **Switching must
invalidate cached authorization** — memoised grants are per-render and must not survive a switch. Never
put a verification id or session id in a URL: logs, `Referer`, history and the address bar all leak it.

---

# PART 10 — AUTHORIZATION

## 10.1 The Data Access Layer is the one authoritative layer

Session resolution, membership read, capability decision, `Grant` minting, the tenant-scoped transaction
and the audit write all happen **in the DAL**, and nothing above it holds a database handle.

It is the only chokepoint every path crosses: pages, Server Actions, Route Handlers, cron, webhooks, the
AI tool dispatcher, and impersonated staff sessions.

## 10.2 Why not the other places

**`proxy.ts` does an optimistic cookie-presence redirect and nothing else.** It never reads the database
and never decides a capability. CVE-2025-29927 showed middleware execution can be skipped with a spoofed
header (CVSS 9.1); `apps/studio/proxy.ts`'s own matcher already excludes every path containing a dot; it
runs on prefetches, so a DB read there is a performance fault; and it cannot see the resource being
acted on.

**No layout may gate access.** Layouts do not re-render on client navigation, so a revoked role is never
re-checked. A layout does not control whether child segments render or appear in the RSC payload. And
**Server Actions never traverse layouts at all.**

**Every Server Action is a public POST endpoint and must re-authorize from zero.** Next supplies the
Origin/Host CSRF check, encrypted action ids and encrypted closures; it supplies **no authorization**.
Zod validation is not authorization — a well-formed payload can still name a row in another tenant. Set
`serverActions.allowedOrigins`, and still add an explicit CSRF token on auth endpoints: the built-in
check is defence in depth, not a substitute.

## 10.3 Types that make the matrix real

**The `scope` field must never be a bare string.** Each scoped capability gets its own string-literal
union, and the resulting `Grant` must be **structurally incompatible** with the grant a wider operation
requires: `Grant<'takeAgentLiveOrPause', 'pause-only', 'write'>` must not satisfy `resumeAgent`'s
`Grant<…, 'full', 'write'>`. The atlas makes the pause/resume asymmetry a product commitment, and string
comparison across 22 capabilities will drift.

**A `readonly` grade must be structurally incapable of reaching a mutation.** Today `can()` returns true
for readonly — that is a live bug. Encode read/write as a phantom parameter on the `Grant` so a Viewer's
grant cannot be passed to a write.

## 10.4 The three defended rules

Visible in the data, covered by tests, and now enforced:

- **Only the Owner initiates voice cloning.** Never a Manager. It creates a legal artefact naming a third
  party and processes biometric data.
- **A Manager connects a channel but never disconnects one.** Connecting is recoverable; disconnecting
  silently stops customer messages reaching the business.
- **Any staff member may pause the AI; only Owner or Manager may resume.** G9 is universal; restarting is
  a configuration decision.

## 10.5 The AI is a subject, not part of the system

Actor **A10** holds grants like any principal. A caller instructing the agent to act outside scope must
fail **because the agent holds no grant for that capability** — never because a prompt told it not to.
The tool dispatcher enforces the capability set, and the model is **never offered a tool it lacks a grant
for**.

Retrieval is authorization-first: **filter before retrieve**, one vector namespace per tenant, no
unscoped search function exported, fail closed when no tenant context is present. Post-filtering is
unacceptable even when it appears to work — foreign content that reaches the ranker has already
influenced ranking, reranking, logs and the token budget.

---

# PART 11 — TENANT ISOLATION

## 11.1 Make it a compile error

`TenantContext` must be **un-constructible outside the DAL** (a `unique symbol` brand field). Every
repository function takes it as its **first** parameter. The raw database driver is importable from
exactly **one** module, enforced by a `dependency-cruiser` rule alongside the existing
no-admin-auth-in-tenant / no-tenant-auth-in-admin rules.

A missing tenant scope must fail `tsc`, not code review.

## 11.2 Make it a constraint violation

**Every child table's foreign key is composite on `(tenant_id, parent_id)`**, which requires a unique
`(tenant_id, id)` on every parent. This turns a cross-tenant join into a database constraint violation
rather than a reviewable mistake — and structurally kills the `findUnique({ where: { id } })` class of
leak.

## 11.3 Make it a database backstop

**Postgres RLS is mandatory**, with `SET LOCAL app.tenant_id` inside the same transaction, and an
application role that is **neither the table owner nor `BYPASSRLS`**. Table owners bypass RLS by default;
connecting as the owner is the standard way teams silently defeat their own policies. `SET LOCAL` rather
than `SET`, because pooled connections otherwise leak tenant context between checkouts.

## 11.4 Never confirm existence

**A cross-tenant request returns `notFound`, never `denied`.** A denied response confirms the object
exists and leaks which businesses are Subiza customers. The two must be indistinguishable to the caller
and distinguishable only in the audit log.

## 11.5 Caches leak too

Cache keys and `cacheTag` values are stored **in plain text**. Never put a phone number, caller name,
member name or token in one. Tag on ids only — `t:${tenantId}:conversations`. Any `use cache` function
takes `tenantId` as an explicit argument and stays unexported behind a session-resolving getter.

---

# PART 12 — RECOVERY

> _"The number **is** the account, so there's no email and no password to fall back on."_ — `auth.html`

## 12.1 The governing principle

**Time is the security control. Evidence is only the trigger. The support desk is the actual attack
surface.**

## 12.2 Six flows, one door

The design models three. There are six, and each needs a different path.

| #   | Situation                                   | Path                                                        |
| --- | ------------------------------------------- | ----------------------------------------------------------- |
| a   | Code not arriving, number still controlled  | Automated — the delivery ladder (§8.4). Not recovery at all |
| b   | Number temporarily unavailable              | Automated — WhatsApp or voice fallback                      |
| c   | Number permanently lost or changed          | **Human review. ≥72h. §12.5**                               |
| d   | **Number recycled to someone else**         | **The interstitial the design is missing. §12.3**           |
| e   | Account compromised — _"this wasn't me"_    | **Missing entirely. Must be reachable without signing in**  |
| f   | Owner left the business; ownership disputed | Human review, two staff actors, commercial evidence         |

## 12.3 The recycled-number interstitial

MTN Rwanda recycles a SIM after **90 days of inactivity**. A stranger can therefore receive a valid OTP
for a live business account — a Law 058/2021 breach with a 48-hour RURA notification duty.

Detect it (dormancy signals, carrier `last-changed` where available, a sharp behavioural break) and show
an interstitial that **never names the business**, offers a _this isn't my account_ path, and routes to
human review. The new holder must not see a single row of the previous owner's data.

## 12.4 The recovery question is already compromised

The design proposes _"one fact only you would know."_

**It cannot be a gating factor.** Notifications N2, N5 and N7 — the weekly WhatsApp report especially —
push exactly those facts (last customer, last top-up, balance, greeting) **to the handset**. An attacker
holding the SIM already has them.

Demote it to a **corroborating tiebreak**. Never a gate.

**Security questions are banned outright.** OWASP states there is no acceptable use in secure software,
and the 2025 help-desk incident literature found knowledge-based questions failed in nearly every case.

## 12.5 Evidence, ranked

> **The strongest available evidence is a live MoMo micro-payment from the wallet that has historically
> paid for the account** — because it requires the **wallet PIN**, not the SIM, and because **MTN blocks
> the wallet for 72 hours after a SIM swap**, a SIM-swap attacker structurally cannot produce it.

That single mechanism is worth more than any document. Behind it: RDB certificate matching the registered
business · the forwarding code still active on the line · a second team member vouching · prior call
records · a physical visit.

## 12.6 The security rules

- **No recovery that changes the bound number is ever instant.** Minimum **72 hours**; **7 days** without
  Tier-A evidence.
- **No role may shorten a cooldown** — not Support L2, not Trust & Safety, not Super Admin. Lengthening
  only, enforced as a code invariant, because the help-desk override is the documented attack path.
- **Executing a number change requires two staff actors** — Super Admin plus a second approver, mirroring
  the existing second-approver rule for credit adjustments.
- **An OTP must never be readable, generatable or sendable from any admin surface.** Make the public
  promise technically true.
- Notify **the original number and every team member**, on every recovery attempt.
- **A recovered session is never a full-privilege owner session.** For the 14-day reversal window, deny:
  export, delete, retention changes, DSAR, team changes, voice cloning, channel disconnection, plan
  change, and any change to the recovery configuration itself. It also **may not read conversations that
  predate the recovery**, and may not bulk-export at all. This is what makes a takeover worth little for
  14 days.
- **A refusal discloses category, never specifics** — never which fact was wrong, never the correct
  value, never attempts remaining, never a hint at what would have worked.
- **Never lock an account** in response to recovery attempts. Per OWASP that converts recovery into a
  denial-of-service against a business's phone line, which here is worse than the takeover it prevents.
- **Inbound calls and messages are never frozen, degraded or interrupted by any recovery state.** G22.
- **The kill switch stays available** in every recovery state. G9.
- **Never reveal the business name before a verified code** — including on the recycled-number
  interstitial. This is the one enumeration leak that actually costs something in a phone-only product.

---

# PART 13 — AUDIT

Every consequential write **and every denied write** is audited **inside the same transaction as the
mutation**, through a single wrapper — so forgetting is hard rather than merely discouraged.

Shape: who · what · when · before · after · tenant · actor type (human / AI / staff / impersonated) ·
reason where one is required.

The application database role holds **`INSERT` and `SELECT` on `audit_events` and nothing else** — no
`UPDATE`, no `DELETE`. Retention **7 years**. The log is not deletable.

Impersonation is not built in this phase, but the schema must carry dual identity (actor + on-behalf-of)
from the start, because retrofitting it means rewriting every row.

---

# PART 14 — CONSENT

**Two checkboxes, never one.** One required — the contract, the basis on which the service operates. One
optional — marketing. Bundling them makes the consent **legally invalid** under Law 058/2021, because
consent must be freely given and specific; a person who must accept marketing to use the product has not
freely consented to marketing.

Store a consent **record**, not a boolean: what text version, which language, when, from what IP, and by
which action. The language matters — that is why screen 4 precedes screen 5 (§6.5).

Recording consent and voice-cloning consent are **separate decisions asked at separate moments** (G12).
Nothing here consents to voice cloning; that is Prompt 09.

Every consent must have its own revoke path, and revocation must be as easy as granting.

---

# PART 15 — THE BLOCKING EXTERNAL DEPENDENCY

> **Start this today. It is paperwork, it takes about three weeks per carrier, and no amount of
> engineering shortens it.**

Alphanumeric sender IDs must be registered **separately with MTN and with Airtel**. Until that clears,
codes arrive from a numeric shortcode or a random number, which looks exactly like the vishing the
product warns about — and materially depresses the sign-up completion rate you are trying to measure.

While it is pending: build against a test provider, keep the delivery ladder configurable, and make the
sender ID a config value rather than a constant.

Also confirm, in writing: real SMS latency and failure rates on MTN and Airtel · whether RURA requires
sender-ID registration in addition to the carriers · the WhatsApp OTP template approval path.

---

# PART 16 — STATES, i18n AND THE SMALL SCREEN

The eight states plus the auth-specific states in §6.4. Every refusal screen names a way to reach a human.

`auth.html` carries **131 translated nodes** — a complete Kinyarwanda twin for every string. Transcribe
it into the catalogues; do not re-translate. Kinyarwanda runs 15–25% longer: prove every screen at 360px
in `rw` before calling it done. The step `Tag`, the countdown chip and the two consent labels are the
highest-risk strings.

At 360 the aside becomes an afterword below the button, the countdown chip disappears, and `min-height`
is released so the page is only as tall as its content.

---

# PART 17 — VERIFICATION

| Audit                    | Pass condition                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------- |
| Enumeration              | Known vs unknown number: byte-identical responses **and** indistinguishable timings |
| Business-name leak       | Never present pre-verification, including the recycled path                         |
| OTP brute force          | 3 wrong → resend → 3 wrong → blocked. Counter survives resend                       |
| OTP storage              | No reversible storage anywhere; pepper not in the database                          |
| Pumping                  | Foreign number refused before spend; ceiling trips the breaker                      |
| Lockout                  | Sustained wrong-code attack leaves the owner able to get in                         |
| Session fixation         | Pre-auth id is gone after verification                                              |
| Cross-origin             | Handoff token replays fail; no `Domain=` cookie anywhere                            |
| **Cross-tenant compile** | A deliberate unscoped query **must fail `tsc`**                                     |
| **Cross-tenant runtime** | Returns `notFound`, never `denied`                                                  |
| **RLS**                  | Direct SQL as the app role cannot read another tenant                               |
| **Readonly**             | A Viewer grant passed to a write **must fail `tsc`**                                |
| **Scope**                | `pause-only` must not satisfy `resume`                                              |
| Revocation               | Role change effective within 60s                                                    |
| Capability coverage      | Every matrix row has ≥1 enforcement site; CI fails on an orphan                     |
| Audit                    | Every consequential write logged in-transaction; no `UPDATE`/`DELETE` grant         |
| Recovery timing          | No number change under 72h; 7 days without Tier-A                                   |
| Cooldown invariant       | No role can shorten one                                                             |
| Admin OTP access         | No admin surface can read, generate or send a code                                  |
| No-JS                    | Every screen, including resend and fallbacks                                        |
| a11y                     | Zero axe violations; OTP passes SC 3.3.8; focus ring on every surface               |
| Expansion                | rw at 360, both themes, no overflow                                                 |
| Human reachable          | All 9 refusal screens name a route to a person                                      |

## 17.1 The red team

A **different agent from every author**, told plainly: _take over an account._ Give it the running app,
the schema and the source. Specific attempts: enumerate numbers → business names · brute force an OTP
across resends · pump SMS spend · reach tenant B's conversation from tenant A's session · use a
`readonly` grant to mutate · use a `pause-only` grant to resume · replay a handoff token · social-engineer
the recovery path with facts from the weekly report · keep a session alive after removal.

**Report how far it got, not whether it succeeded.** Partial progress is the finding.

---

# PART 18 — DELIVERABLES & NEXT

1. Three inherited defects fixed (§3.2), including `input-otp` removed from `packages/ui`
2. `packages/auth-tenant` — real: session store, cookie contract, verification lifecycle, DAL
3. `packages/core/capabilities.ts` — auth-strength dimension, `Grant` types, `readonly` bug fixed
4. Schema: tenants · members · verifications · sessions · consent records · recovery requests · audit
5. Nine screens in `apps/site`, two locales, all states, no-JS
6. The OTP engine, delivery ladder and rate limiter
7. Postgres RLS policies and composite FKs
8. The audit wrapper
9. Six recovery flows, the constrained session, the recycled-number interstitial
10. The adversarial suite, green, **plus the red-team report**
11. Sender-ID registration **filed** with both carriers

**Prompt 04** — Guided activation (`Design/activation.html`): the nine steps, the inversion that puts
first value before any channel connection, the trust ladder, and the part-done checklist. It is the flow
the atlas says the company lives or dies on. Say **next**.

---

# PART 19 — APPENDIX

## A — One door, six outcomes

```
                    ┌──────────────────────────────┐
                    │   ONE PHONE FIELD            │   /start and /signin
                    │   "Send me a code"           │   render the SAME view
                    │   ALWAYS SENDS               │
                    └──────────────┬───────────────┘
                                   │   no disclosure here. ever.
                                   ▼
                    ┌──────────────────────────────┐
                    │   SIX SLOTS, ONE INPUT       │   plain <input>, no library
                    │   explicit Continue          │   never auto-submit
                    └──────────────┬───────────────┘
                                   │
              ╭────────────────────┼────────────────────╮
              ▼                    ▼                    ▼
      no tenant            one tenant           several tenants
      → name/business      → straight in        → workspace chooser
      → language
      → consent ×2         ── all three mint a FRESH session id ──
      → account exists        pre-auth record DELETED, not re-keyed
                              __Host- cookie, no Domain attribute

   Branch AFTER verification — never before. That single rule removes
   the {number → business} vishing list the design accidentally built.
```

## B — Where a capability is decided

```
   proxy.ts        cookie present?  →  redirect        ← NOT authorization
      │                                                   CVE-2025-29927
      ▼
   layout.tsx      renders chrome                       ← NOT authorization
      │                                                   never re-renders on nav
      ▼                                                   Server Actions skip it
   page.tsx        thin. awaits params.
      │
      ▼
   ╔═══════════════════════════════════════════════════════════╗
   ║  DATA ACCESS LAYER          ← THE ONE AUTHORITATIVE LAYER ║
   ║                                                           ║
   ║   session → membership → capability → Grant<cap,scope,rw> ║
   ║                              │                            ║
   ║                              ▼                            ║
   ║   TenantContext  (un-constructible outside this module)   ║
   ║                              │                            ║
   ║                              ▼                            ║
   ║   repository(ctx, …)  every fn takes ctx FIRST            ║
   ║                              │                            ║
   ║                              ▼                            ║
   ║   transaction: SET LOCAL app.tenant_id                    ║
   ║                + the mutation                             ║
   ║                + the audit row    ← same transaction      ║
   ╚═══════════════════════════════╤═══════════════════════════╝
                                   ▼
   Postgres RLS                 ← independent backstop.
   composite FK (tenant_id, id) ← cross-tenant join = constraint violation

   Server Actions enter at the DAL too — they are public POST endpoints
   and re-authorize from zero, every time.
```

## C — Recovery: time is the control

```
   "Can't get a code?"
          │
          ├─ (a) code not arriving ────► delivery ladder. NOT recovery.
          ├─ (b) number unavailable ───► WhatsApp / voice fallback
          │
          ├─ (c) number lost/changed ──┐
          ├─ (d) number recycled ──────┤
          ├─ (e) "this wasn't me" ─────┤──► HUMAN REVIEW
          └─ (f) ownership disputed ───┘         │
                                                 ▼
                              ┌──────────────────────────────────┐
                              │  EVIDENCE (the trigger)          │
                              │   1. live MoMo micro-payment ★   │
                              │      needs the PIN, not the SIM  │
                              │      — and MTN blocks the wallet │
                              │        72h after a SIM swap, so  │
                              │        a swap attacker CANNOT    │
                              │        produce it                │
                              │   2. RDB certificate             │
                              │   3. forwarding code still live  │
                              │   4. team member vouches         │
                              │   ✗ "a fact only you would know" │
                              │     — the weekly report already  │
                              │       pushed it to the handset   │
                              └──────────────┬───────────────────┘
                                             ▼
                              ┌──────────────────────────────────┐
                              │  TIME (the control)              │
                              │   ≥72h · 7 days without Tier-A   │
                              │   NO ROLE MAY SHORTEN IT         │
                              │   two staff actors to execute    │
                              │   notify original number + team  │
                              └──────────────┬───────────────────┘
                                             ▼
                              ┌──────────────────────────────────┐
                              │  RECOVERED SESSION ≠ OWNER       │
                              │  14-day reversal window:         │
                              │   no export · no delete · no DSAR│
                              │   no team change · no cloning    │
                              │   no channel disconnect          │
                              │   no reading pre-recovery convos │
                              └──────────────────────────────────┘

   Throughout: the phone keeps ringing. G22 is never suspended.
```

---

_Prompt 03 · Subiza · Authentication & Authorization_
_Built against `Design/auth.html`, atlas Flows 01, 05, 18, 19, 21, 25, and docs 09 and 13._
_Where this document and the prototype disagree about security, this document wins._
