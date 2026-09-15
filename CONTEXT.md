# CONTEXT.md — Phase 1 absorption gate

Written after reading the Tier 1 sources in order. This file is the briefing
every later session must survive challenge against. Internal engine names
**Ijwi** and **Ubwenge** never appear in UI copy.

---

## 1. Who is Claudine, what device is she on, and what does her data cost her?

Claudine is actor **A5**, the paying customer: she runs a salon in Remera with
three staff and a paper booking book. Her goal is to stop losing bookings to an
unanswered phone. She is afraid the AI will sound like a robot and embarrass
her, that the product will be complicated, and that she will be charged for
something she did not use.

She is on a **mobile browser**, typically a mid-range Android (Tecno / Itel /
Infinix class), often one-handed while doing something else. She pays for data
**by the megabyte**. In this market household smartphone ownership sits around
34%, rural internet usage around 19%, and data can cost up to **60% of monthly
income** for the poorest households. That is why G14 is not a performance
preference — it is who gets to use the product.

## 2. G1, G9, G13, G14, G22 — and which most constrains a component library?

- **G1** — One next action. A stuck screen shows exactly one recommended step.
- **G9** — The kill switch is always visible. Pause the AI from any screen.
- **G13** — The system says “I don’t know” rather than guessing. Below
  confidence, it escalates.
- **G14** — Mobile-first, low-bandwidth. Mid-range Android over 3G. Every
  kilobyte is a user-facing cost.
- **G22** — The platform never makes a business less reachable than it was
  before Subiza. Total failure falls back to the owner’s own line.

The three that bind a **component library** hardest are **G6, G14 and G16**
(no blank screens; bytes are a cost; icons/numbers/status over paragraphs).
Of the five named above, **G14** constrains the library most: it is why there
is no animation runtime, no chart library, no icon font, and why every
component except the theme and motion switches must work with JavaScript off.

## 3. Why is lime forbidden as a text colour, and which token solves it?

`--signal` (#C6F24E) is **1.2:1 on ground**. It is a fill, by design. White on
lime is 1.4:1. If a surface is lime, the thing on it is near-black
(`--signal-ink`). The only green allowed to be text is **`--signal-text`**
(#3D5C10 light / #A8D65C dark), at 7.3:1. This is enforced by token design,
not by review.

## 4. Why does this system draw with hairlines instead of shadows?

A soft shadow relies on the display resolving a ~4% alpha gradient. On the TN
and low-end IPS panels this product is mostly read on — often at low brightness
to save battery — that gradient collapses and the card loses its edge. A 1px
hairline at 9% alpha (`--rule`) survives every panel, every brightness and
every angle. Shadows appear on exactly one of four elevation levels: only
things genuinely floating over content the user was just looking at (menus,
toasts, modals). Everything else is `--e-0` / `--e-1`: none.

## 5. Why is the OTP field one input rather than six?

Six separate inputs fail **WCAG 2.2 SC 3.3.8 Accessible Authentication**. That
criterion requires that a cognitive function test not be required and that the
user can **paste** their credential. A six-input field breaks paste, breaks
iOS/Android SMS autofill, produces six tab stops, and is named as a failure
example in the SC 3.3.8 Understanding document. The passing implementation is
one `<input>` (transparent, `inputmode="numeric"`, `autocomplete="one-time-code"`)
over six painted `aria-hidden` slots. The caret is forced to the end so a
pasted code cannot silently become eight digits.

## 6. The six components that are redesigned, not reflowed

| Wide | Small | Why not reflow |
|---|---|---|
| Sidebar rail, 7 items, journey order | Bottom tab bar, 4 + More, frequency order, shortened labels, dot not count | A hamburger hides the product. The thumb arc is at the bottom. |
| Data table | Row list — avatar, two lines, one right-hand value | A horizontally scrolling table on a phone hides the columns that matter. |
| Centred modal | Bottom sheet with a decorative drag handle | A centred dialog at 360 is a full-screen takeover with actions out of thumb reach. |
| Button row | Full-width stack, primary first | Two 44px targets side by side at 360 sit in the mis-tap zone. |
| Live call card, 2 actions | One action — “Take the call” — history line dropped | When a customer is on the line there is only one decision. |
| Three-up stat grid | Two-up, key stat spans both columns | A stat card below ~200px cannot hold a 2.35rem number and its comparison. |

## 7. Three things `Design/design-system.html` explicitly forbids installing

1. **A chart library** (Chart.js, Recharts, Tremor). Charts are hand-written SVG.
2. **An icon font** (Font Awesome, Solar). One Lucide SVG sprite, ISC, stroke 1.75.
3. **An animation runtime** (GSAP, Motion, Lenis, Lottie). CSS tokens and React
   `<ViewTransition>` only. The HTML’s principle 5: “No chart library, no icon
   font, no animation runtime, no UI framework CSS.”

Also rejected on licence or aesthetic grounds: Inter, Space Grotesk, unDraw,
Storyset, Humaaans, Open Peeps, and any CC BY asset that would force visible
attribution on a commercial console.

---

## Extra briefings that later phases will need

**Activation** is not signup and is not “connected WhatsApp”. It is: a real or
simulated customer interaction was handled by the AI, and the owner watched it
and judged the answer good.

**Origins.** Studio (`app.subiza.rw`) and Admin are separate origins with
separate auth. Compile-time separation is the security control. Recommendation:
a second apex for admin (`subiza-ops.rw`) rather than `admin.subiza.rw`.

**Capability matrix (atlas is source of truth).** 21 tenant capabilities × 4
roles (Owner / Manager / Agent / Viewer) and 15 admin capabilities × 9 staff
roles. Prompt 01’s “22 × 4 / 16 × 9” counts are wrong. Three hard rules: only
the Owner initiates voice cloning; a Manager may connect a channel but never
disconnect one; any staff member may pause the AI, only Owner or Manager may
resume.

**Languages.** `rw`, `en`, `fr`, `sw`. Kinyarwanda is first-class, not a
fallback. Kinyarwanda runs 15–25% longer than English.

**Justified extras not in Prompt §6.1.** `zod` (server-only; runtime boundaries
in §8.4) and `web-vitals` (instrumentation in §19.3). Neither enters the
`apps/site` first-load graph.

**Theme keys.** `subiza-theme` and `subiza-motion` in `localStorage`, inside
`try/catch`. The HTML showcase used `subiza-ds-theme`; the product does not.

**Phone connection — auth strength (Prompt 05 §3.2 defect 4).** Decision **(b)**:
`dal.changeForwarding` exists. Surface-initiated first-time registration
accepts an `otp` session (`can(role)` + manual audit). Changing the forwarded-to
destination after a verified forward still requires `elevated`. Activation w8
stays on `completeSignupAndActivation`. Written down in
`packages/auth-tenant/src/phone.ts` as `PHONE_SURFACE_AUTH`.

**Messaging channels — Prompt 06.** `packages/domain/src/channel.ts` is the
document. Routes live at `/connections/messaging/[channel]/[step]` so they do
not collide with `/connections/phone`. Connect requires `elevated` on entry
(`CHANNEL_SURFACE_AUTH`); disconnect is owner-only (`elevated` + scope `full`).
A recovered session is refused. Embedded Signup is v4 only.

**Escalate to the founder — BSP tier.** Until a Solution Partner BSP is
confirmed, `BSP_TIER` stays `tech-provider-pending`. Screen `wa8` states the
card wall plainly and offers the other channels. Tech Provider puts an
international card in front of the highest-value channel in this market.

**Escalate to the founder — training prohibition.** WhatsApp Business Solution
Data, including anonymous, aggregate, or derived forms, may not train any model
except a fine-tune for the individual tenant's exclusive use. `canTrainOn("whatsapp")`
is `false` and `trainingCorpusFor("whatsapp")` returns nothing. This constrains
the language moat. The section survives termination.

**Phone connection — what proves a forward.** The loop closing on our own
trunk, not audio, not AMD, not a query API. `CARRIER_FORWARDING` stays `false`
until docs/13 Q2 is answered on live SIMs. Recurring checks reject with SIP 486;
only the one-time activation check answers. Re-verification is scheduled inside
08:00–19:00 Africa/Kigali, never at 02:00.

**Agent design — Prompt 07.** Advanced ships in v1 as a *view* (`?view=`), not a
persisted mode. `packages/domain/src/agent-config.ts` is the document. Routes
live at `/agent/behaviour/[step]`. Writes require `configureAgentPersona`
(`AGENT_SURFACE_AUTH`); recovered sessions are refused. `guaranteed` is earned
only by a named mechanism (typed-field-lookup, tool-absent, every-turn-trigger,
required-step-before-commit). Containment, not immunity. The contradiction check
is non-blocking; publish-anyway is audited. Restore snapshots the current state
first. Versions live on `TenantBundle`, not as a thirteenth domain document.
Kinyarwanda checks run dual-run until a test-call week settles accuracy.
`needsConflictCheck` is read and cleared on publish. Hours editing uses
`docs.agent.hours` and `weekGridFromForm` — never a hard-coded salon week.

### Adversarial report (Prompt 07 G7)

Tried as a reviewer, not an author:

1. **Delete a locked rule by posting the mutator.** `deleteRule(ctx, "rul_disclosure")`
   and `rul_out_of_scope` throw `notFound` and leave both ids in the array. The
   UI omits the delete button; the server action is the real lock.
2. **Earn `guaranteed` with no mechanism.** `addRule` always writes `enf: "soft"`
   and `mechanism: null`. `badgeTone` maps `enf: "hard"` without a named
   mechanism to `soft`. "Be warm" and "Always be right" cannot wear a guarantee.
3. **Round-trip a rule away.** Simple and Advanced filter the same `rules[]` by
   `cat` vs `stage`. No second array. The count beside the switch is
   `agent.rules.length`, computed.
4. **Restore and lose the current state.** `restoreAgentVersion` pushes the
   current snapshot before applying the old one. A revert is itself revertible.
5. **Edit during a live call.** `requestTestCall` copies `inFlightAgent`. Later
   publishes replace `liveAgent` only. The in-flight snapshot is unchanged.
6. **Raw conflict object on screen.** The conflict screen quotes `ruleText` and
   offers three named resolutions. No JSON dump.

Next: Prompt 08 — Knowledge base.
