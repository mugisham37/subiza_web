# SUBIZA — BUILD PROMPT 02

## The Landing Page & Every Public Route

> **Phase 1 built the system. This phase builds the first thing a human being sees.**
>
> It is also the phase with the most ways to do real damage — a marketing page can make a claim the
> company cannot legally support, publish a number nobody measured, or promise a capability a platform
> forbids. Part 12 exists because of that. Read it before you write copy, not after.

|                    |                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Prompt**         | 02 of the series — Landing page & public routes                                     |
| **Corresponds to** | `Design/landing.html` (flow 1.1 in `Design/PROGRAMME.md`)                           |
| **Builds on**      | Prompt 01 — the monorepo, `packages/ui`, `packages/core`, tokens, the eight states  |
| **App**            | `apps/site` only. Do not touch `apps/studio` or `apps/admin`.                       |
| **Ships**          | 10 real routes, ~14 home sections, the live demo-call widget, full SEO, two locales |
| **Next prompt**    | 03 — Sign-up, sign-in, account recovery (`Design/auth.html`)                        |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Your role

Conductor again. Same discipline as Prompt 01: decompose, parallelise only across genuine independence,
gate each phase on an artefact, own the integration and the final audit yourself.

What is different this time: **copy is a deliverable, not a filler.** `Design/landing.html` contains
some of the best writing in this project — honest, specific, and hard-won. The most likely way to fail
this phase is to treat that copy as placeholder and paraphrase it into marketing mush. Several sentences
in that file are load-bearing legal compliance (Part 12). Losing them is a defect.

```
  ┌─ PHASE A ─ ABSORB & AUDIT ────────────────────────────────────┐
  │  A1 Read the source + the law    A2 Audit Phase 1's 3 debts   │
  │  Gate: the debts are fixed before the first section is built. │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ FOUNDATION ────▼───────────────────────────────────┐
  │  B1 claims registry + pricing constants  (packages/core)      │
  │  B2 route skeleton + metadata + sitemap  (apps/site)          │
  │  B3 message catalogues, rw + en, from data-rw                 │
  │  B1 and B3 in parallel; B2 after B1 (metadata cites claims).  │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ THE SECTION KIT ▼──────────────────────────────────┐
  │  Section shell, tonal variants, the 6 new components.         │
  │  SEQUENTIAL — every section depends on this.                  │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ SURFACES ──────▼───────────────────────────────────┐
  │  D1 hero + demo        D2 home sections     D3 pricing        │
  │  D4 how/about/contact  D5 legal + security  D6 error routes   │
  │  PARALLEL. D1 is the hardest — give it your strongest agent.  │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ PROOF ─────────▼───────────────────────────────────┐
  │  E1 no-JS   E2 a11y   E3 perf on 3G   E4 rw@360   E5 claims   │
  │  E6 SEO/hreflang        E7 adversarial review                 │
  └───────────────────────────────────────────────────────────────┘
```

## 0.2 The agents to deploy

| Agent                      | Owns                                               | Must be told                                                                            |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Auditor**                | A2. The three Phase 1 debts.                       | Fix them first. They are cheap now and expensive after ten sections exist.              |
| **Claims engineer**        | B1. `claims.ts`, `pricing.ts`, `verifications.ts`. | A number without a source is a defect. Your module is how that becomes a build failure. |
| **Copy engineer**          | B3. Message catalogues from `data-rw`.             | You are _transcribing_, not writing. The Kinyarwanda already exists in the HTML.        |
| **Demo engineer**          | D1. Hero + the call widget.                        | Eight states, server-first, works with JS off. This is the conversion path.             |
| **Section engineers** (×3) | D2–D5.                                             | Compose from `packages/ui`. If you need a new component, justify it.                    |
| **SEO engineer**           | B2, E6.                                            | 2026 has retired half the structured data you remember. Verify, do not assume.          |
| **Accessibility engineer** | E2.                                                | Same bar as Phase 1. WCAG 2.2 AA + 2.4.13.                                              |
| **Performance auditor**    | E3.                                                | Measure against `next build && next start`. Dev numbers are meaningless here.           |
| **Adversarial reviewer**   | E7.                                                | Hunt for an unsourced number, a forbidden claim, and a section that dead-ends.          |

## 0.3 The three rules for this phase

**Rule 1 — The copy is the specification.** Port it. Where you improve it, improve _precision_, never
_confidence_. This page's entire competitive advantage is that it says the inconvenient thing.

**Rule 2 — The design may exceed the HTML; the claims may not.** You are explicitly invited to make this
page more polished and more production-grade than the prototype. You are explicitly forbidden from making
it more confident.

**Rule 3 — Every visitor state is a designed state.** Including: JavaScript off, 2G, a mistyped URL, a
rate-limited demo, a failed call, and a screen reader. The prototype handles none of these.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What this phase ships

The complete public face of Subiza at `subiza.rw`: ten real server-rendered routes in two locales, a
working demo-call widget with all of its failure states, honest and sourced claims, full SEO and sharing,
and a page that works on a low-end Android over 3G with JavaScript disabled.

## 1.2 Definition of done — twenty criteria

| #   | Criterion                                                                    | Proven by                                                         |
| --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Ten routes exist as real file-system segments, each its own document         | Route list in §6, all returning 200                               |
| 2   | Every route renders fully with JavaScript disabled, including navigation     | Playwright `javaScriptEnabled: false` across all routes           |
| 3   | A mistyped URL returns a real 404 with an explanation and a route out        | `global-not-found.tsx`; must not serve home with a 200            |
| 4   | A server error renders the designed 500, never a raw code                    | `error.tsx` with `{ error, retry }`                               |
| 5   | The demo widget implements all eight of its states                           | §8.4 table, each state reachable and screenshotted                |
| 6   | The demo is rate-limited **server-side** and cannot call an arbitrary number | Abuse test: 3rd request in a day from one number is refused       |
| 7   | No numeric claim appears without a registry entry                            | `claims.test.ts` greps catalogues and fails on an orphan number   |
| 8   | Tier prices cannot render without the pilot banner                           | Component coupling + e2e assertion                                |
| 9   | No forbidden claim appears anywhere                                          | §12 checklist, grep-based test                                    |
| 10  | Every legal document link resolves to a real document                        | Link crawler over `/legal`, footer, and in-copy links             |
| 11  | The public data-rights form exists and needs no account                      | `/data-request` reachable, submits, no auth                       |
| 12  | Two site locales ship; `fr` and `sw` do **not**                              | `/fr` and `/sw` return 404 until translated                       |
| 13  | `hreflang` is bidirectional and self-referencing                             | SEO audit                                                         |
| 14  | Per-locale metadata, canonical, OG image                                     | View source in both locales                                       |
| 15  | Above-the-fold ≤200KB, total ≤500KB, per route                               | Lighthouse on `next build && next start`, 3G throttle             |
| 16  | LCP ≤4s on 3G                                                                | Same run, recorded in CI                                          |
| 17  | Scroll reveals default to **visible** and never hide content                 | Disable JS and `@supports` — content still readable               |
| 18  | Kinyarwanda at 360px does not overflow on any section                        | rw × 360 × both themes screenshot audit                           |
| 19  | Zero axe violations, both locales, both themes                               | `@axe-core/playwright`                                            |
| 20  | Theme and motion switches are present and work                               | They exist in `packages/ui` and were never wired to a public page |

## 1.3 Not in this phase

Sign-up and sign-in **screens** (Prompt 03) — `/start` and `/signin` are handoff routes here, nothing
more. No blog, no careers, no press kit, no changelog, no reseller page. No real analytics vendor
integration beyond the first-party endpoint. No CMS.

---

# PART 2 — CONTEXT ABSORPTION

## 2.1 Read in this order

| #   | File                                                             | Extract                                                                                                       |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | `CONTEXT.md` (repo root)                                         | What Phase 1 established. If it is missing, Phase 1 was not finished.                                         |
| 2   | `prompts/01-foundation-and-design-system.md`                     | **Parts 3, 5 and 9 especially.** The law has not changed. The Next 16 correction sheet still applies in full. |
| 3   | `Design/landing.html`                                            | **All 1,766 lines.** Every section, every string, every `data-rw`. This is the specification.                 |
| 4   | `subiza-flow-atlas/flows/04-platform-constraints.md`             | **F1–F14.** The claims you are forbidden to make.                                                             |
| 5   | `subiza-flow-atlas/flows/05-flow-signup-and-account-creation.md` | Where `/start` hands off, and what must not be asked twice.                                                   |
| 6   | `docs/11-business-model-and-economics.md`                        | §6 — the tiers, and the instruction about publishing them.                                                    |
| 7   | `docs/03-competitive-landscape.md`                               | §3.1 and §6.1 — the trust floor and the only permitted uniqueness claim.                                      |
| 8   | `docs/13-open-questions-and-validation.md`                       | **Which claims are still unverified.** Two of them are on the page today.                                     |
| 9   | `subiza-flow-atlas/flows/19-flow-compliance-and-data-rights.md`  | §5.1 — the public data-rights route is mandatory.                                                             |
| 10  | `packages/ui/src/index.ts`                                       | What you already have. Do not rebuild any of it.                                                              |

## 2.2 The gate

Before any agent writes a section, it must answer:

1. Name three claims F1–F14 forbid, and quote the sentence in `landing.html` that currently satisfies each.
2. Which two claims on the page are **unverified** according to `docs/13`?
3. Why may the page not say "the first Kinyarwanda voice AI"?
4. What is the single permitted form of the uniqueness claim?
5. What happens today, in the prototype, if JavaScript does not run?

An agent that cannot answer #2 and #5 must not write copy.

---

# PART 3 — WHAT PHASE 1 LEFT YOU

## 3.1 Compose from these — do not rebuild

`packages/ui` exports, all ready:

**Atoms** — `Button` `ButtonLink` `Chip` `Tag` `StatusDot` `Field` `Input` `Textarea` `InputWrap`
`Toggle` `Skeleton` `Meter` `Eyebrow` `Label` `Hint` `VisuallyHidden` `Icon`

**Molecules** — `PhoneField` `OtpField` `ChoiceCard` `Card` `CardHeader` `CardBody` `CardFooter`
`CardLink` `Stat` `StatGrid` `Banner` `Toast` `Empty` `EmptyArt` `RowList` `RowItem` `Dropdown`
`Table` `ResponsiveRecords` `CodeBlock` `Sparkline` `Bars` `Ring`

**Organisms** — `AppShell` `Sheet` `Drawer` `ThemeSwitch` `MotionSwitch` `StateBoundary`

**Product** — `LiveCallCard` `Waveform` `Transcript` `ChannelTile` `ForwardingCodeCard`
`EscalationLadder` `CreditCard` `WhatsAppBubble` `PhoneFrame`

**States** — all eight, plus `StateBoundary`

`packages/core` — `ViewState<T>` · branded ids · `Fidelity` · capability matrix · RWF/date formatters

**The landing page is almost entirely a recomposition of these.** The transcript demo is
`LiveCallCard` + `Waveform` + `Transcript`. The channels section is four `ChannelTile`s. The
before/after is two `RowList`s. The weekly-report artefact is `WhatsAppBubble`. If an agent proposes a
new component, make it prove the existing one cannot be composed into the shape.

## 3.2 Three debts Phase 1 left — fix these FIRST

These are cheap now and expensive after ten sections exist. Phase A does not end until all three are closed.

**Debt 1 — the sprite is inlined whole.** `apps/site/src/app/[lang]/layout.tsx` reads
`packages/ui/src/icons/sprite.svg` and injects it into every document. That file is **~63KB of the
200KB above-the-fold budget**, on every route, mostly for symbols the route never uses.

_Fix:_ split the sprite at build time into (a) an **inline above-fold subset** of ~8 symbols
(`i-phone-call`, `i-check`, `i-arrow-right`, `i-info`, `i-shield`, `i-menu`, `i-x`, `i-chevron-down`)
emitted into the document, and (b) an external `sprite.svg` fetched after LCP for everything below.
Add a CI assertion pinning the inline subset's symbol count so it cannot silently grow back to 176.

**Debt 2 — metadata is static and English-only.** The layout exports
`metadata = { title: "Subiza", description: "The system that answers." }`. Every locale ships identical
head tags, there is no `metadataBase`, no `alternates`, no Open Graph.

_Fix:_ **delete the static `metadata` export** — you cannot export both `metadata` and
`generateMetadata` from the same segment; it is a build error. Replace per §15.

**Debt 3 — four locales are routed, two exist.** `generateStaticParams` builds `rw`, `en`, `fr`, `sw`,
but `fr.json` and `sw.json` are stubs. Shipping them is thin machine-translated duplication — Google's
named _scaled content abuse_ pattern — and a `/fr` page asserting `hreflang="fr"` while serving
non-French is a direct mismatch signal.

_Fix:_ per §14. Two **site** locales, four **agent** languages. They are different things and the site
must say so.

---

# PART 4 — THE LAW, AS IT APPLIES TO A PUBLIC PAGE

Everything in Prompt 01 Part 3 still binds: the eight states, 360/560/860/1080, the redesign register,
48×48 targets, WCAG 2.2 AA + 2.4.13, the performance budget, the licence test, no stock illustration,
motion tokens and the 300ms ceiling, reduced-motion with no exemptions, lime never as text.

A public page adds five obligations the console does not have.

**4.1 — It is read by people who do not trust you yet.** The category was poisoned. Air.ai sold
$25,000–$100,000 licences to small businesses through resellers making aggressive earnings claims; the
FTC settled in March 2026 with its principals **permanently banned from marketing business
opportunities**. Your buyer may have met that. Structural answer, never a slogan: transparent pricing,
no upfront fee, no minimum term, a working free path, a named human who answers, and a published list of
what you cannot yet prove. **Do not mention Air.ai.** Answer it by being its opposite.

**4.2 — It is read by a crawler and by WhatsApp.** WhatsApp is the dominant share surface in this market
and it executes no JavaScript. A link pasted into WhatsApp must render a title, a description and an
image from the server-side HTML, or the most common distribution path shows a bare URL.

**4.3 — It is read with JavaScript off more often than you think.** Slow 3G, a failed script, a data
saver, a locked-down browser. The prototype fails completely here: `.route{display:none}` plus a
client-side hash router means **seven of eight surfaces are unreachable**, and the mobile drawer is
inert, so a phone visitor gets a homepage with no navigation at all.

**4.4 — Every number on it is a statement the company is accountable for.** See Part 11 and Part 12.

**4.5 — It is the slowest page you will ship to the most constrained device.** A console user has
already decided to be there. A landing-page visitor has not, and leaves. The Harare field study puts
the abandonment point at ~15s _total_ load; the emulator/reality gap is roughly 3s reported vs 12s
actual on a low-end Android on a real network.

---

# PART 5 — WHAT IS MISSING FROM THE HTML

> The founder was right: sections are missing. The cause is structural — **a one-file hash router forced
> every surface into one document, so anything needing its own page, its own data or its own state got
> dropped rather than designed.**

## 5.1 MUST HAVE NOW

| #   | Gap                                                                  | Why it cannot wait                                                                                                                                                                                                                                                                                                                    |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **A security & data-residency page**                                 | Law 058/2021 Art. 50 residency is the strongest trust lever available in this market, and it is currently compressed into one FAQ answer. It deserves a page: residency, NCSA registration, who at Subiza can see a tenant's conversations, retention defaults, sub-processors, breach notification, and the self-hosting trajectory. |
| 2   | **Four real legal documents**                                        | Terms, Privacy, DPA and Voice-consent policy all point at `#/legal` — four dead links **on the legal page itself**, repeated in the footer. You cannot take mobile money with a decorative Terms link.                                                                                                                                |
| 3   | **The public data-rights form**                                      | Atlas Flow 19 §5.1 calls it _"the primary route… no login, linked from the website and every disclosure."_ Callers whose data Subiza holds are not Subiza's customers and currently have nowhere to go but a `mailto:`.                                                                                                               |
| 4   | **404 and 500**                                                      | `ROUTES[h] \|\| 'r-home'` serves the homepage with a **200** for every mistyped URL. That is an SEO defect and a lie to the visitor.                                                                                                                                                                                                  |
| 5   | **A no-JS path for every route**                                     | §4.3. This hits exactly the user the product exists for.                                                                                                                                                                                                                                                                              |
| 6   | **SEO and sharing metadata**                                         | One `<title>` for eight surfaces. No description, no OG image, no canonical, no hreflang.                                                                                                                                                                                                                                             |
| 7   | **Use-case segmentation**                                            | Pricing already segments by business type — salon/shop/trader, clinic/restaurant/workshop, hotel/school/logistics — but nothing shows a salon owner a salon's agent. Highest-conversion addition available, and it needs no new product capability.                                                                                   |
| 8   | **The demo's seven other states**                                    | Rate-limited, failed, carrier-rejected, no-answer, non-Rwandan number, agent-down, offline. It has exactly one outcome today.                                                                                                                                                                                                         |
| 9   | **A third CTA**                                                      | Only two exist — _call now_ and _create an account_. Nothing for the majority who are interested but not ready. In a market where WhatsApp is the channel, there is no WhatsApp capture.                                                                                                                                              |
| 10  | **CTAs on `/how`, `/about`, `/legal`**                               | Three pages of peak-intent reading that dead-end. The sticky CTA is gated to the homepage below 560px.                                                                                                                                                                                                                                |
| 11  | **Label the fabricated customers**                                   | The before/after rows and the transcript card carry named people and real-format Rwandan numbers, **fifty lines below the band that disavows invented proof**. Label them as illustrations.                                                                                                                                           |
| 12  | **Fix three pricing self-contradictions**                            | Seats charged in the tier list and disavowed in the table below; webhooks sold against principle P3; multi-location sold with no supporting capability.                                                                                                                                                                               |
| 13  | **Remove the bare voice-cloning bullet**                             | `Your own cloned voice` as a tier entitlement is exactly what F9 exists to prevent.                                                                                                                                                                                                                                                   |
| 14  | **Skip link, `aria-live`, `<noscript>`, rendered validation errors** | All verified absent, on a site claiming WCAG 2.2 AA.                                                                                                                                                                                                                                                                                  |
| 15  | **Analytics**                                                        | None exists, so the demo-call funnel — the entire conversion path — is unmeasurable. Use a no-cookie first-party approach, which also removes the need for a consent banner.                                                                                                                                                          |

## 5.2 SHOULD HAVE

Sources for the headline statistics (four figures and three USD conversions carry none, on a page whose
differentiator is candour) · an honest pilot-proof block with a way to **apply to the pilot** · a team
block with faces, RDB registration number and a street address (the stated moat is _"sold by people the
SME can meet"_) · a comparison that is not price-only (hours covered, Kinyarwanda, concurrency, sick
days, ramp time, cost to stop, and **doing nothing** — the real competitor) · SMS, Messenger, web chat,
USSD and WhatsApp voice notes in the channels section · an accessibility statement · a status page ·
`security.txt` · the theme switch, which exists in `packages/ui` and was never wired to a public page ·
a real human escalation path on `/contact` (the single number listed is also the AI demo) · fix
_"since the 1990s"_ vs _"since 1993"_.

## 5.3 LATER — correctly deferred

Changelog · careers · press kit · blog · reseller page (keep unmarketed until Phase 3 per doc 04 §3.4).

---

# PART 6 — ROUTE MAP

All under `apps/site/src/app/[lang]/`. Real file-system segments. **Never a client route table.**

```
/[lang]                      home — the full narrative arc (§9)
/[lang]/how                  how it works — the four steps, expanded
/[lang]/pricing              tiers + the pilot contract + pricing FAQ (§11)
/[lang]/security             ★ NEW — data residency, access, retention, sub-processors
/[lang]/about                the observation, the belief, the place, the name, the team
/[lang]/contact              WhatsApp · phone · email · a real form
/[lang]/legal                index of the four documents
/[lang]/legal/terms          ★ NEW — real document
/[lang]/legal/privacy        ★ NEW — real document, DPO contact, Art. 50
/[lang]/legal/dpa            ★ NEW — real document
/[lang]/legal/voice-consent  ★ NEW — real document
/[lang]/data-request         ★ public, no account — atlas Flow 19 §5.1 (stub exists)
/[lang]/consent/[token]      ★ public, no account — stub exists, Prompt 09 fills it
/[lang]/start                handoff to sign-up (Prompt 03 builds the screens)
/[lang]/signin               handoff to sign-in (Prompt 03)
/[lang]/design-system        Phase 1's showcase — keep, add `robots: noindex`

app/global-not-found.tsx     the real 404
app/[lang]/error.tsx         the designed 500 — signature is { error, retry }
app/sitemap.ts   app/robots.ts   app/[lang]/opengraph-image.tsx
```

**Rendering model.** Stay on the default model — **do not enable `cacheComponents`** in this phase.
Full static prerendering is achievable without it: `generateStaticParams` over the site locales, and
**read no `searchParams` anywhere** — not in a page, not in a layout, not in `generateMetadata`. That
single rule is the difference between a CDN-prerendered document and an origin round trip, and on a 3G
profile the round trip alone is a quarter of the LCP budget.

Consequence: the demo's success state must be a **separate static route reached by `redirect()`**, not
`?sent=1`.

`page.tsx` stays thin — `await props.params`, hand off to a view in `src/views/`. Use
`next/root-params` (`import { lang } from 'next/root-params'`) in deep server components instead of
threading the param down. `typedRoutes` gives you `PageProps<'/[lang]/pricing'>` free.

---

# PART 7 — PAGE ARCHITECTURE

## 7.1 Sections as data, not as bespoke components

Do not write fourteen bespoke page components. Define a typed `Section` union and an **ordered array**
in the route file, rendered through one shared `Section` shell that owns the eyebrow / h2 / lede rhythm
and the tonal variant.

Why: reordering becomes a one-line change (and you _will_ reorder — §9.1 moves the honesty band), an
A/B variant is a different array, and the rhythm cannot drift between sections because one component
owns it.

## 7.2 The three tonal variants

From the prototype: `default` (on `--ground`) · `tint` (on `--surface-2`) · `ink` (the inverted
`--panel` region). They alternate to give the page rhythm.

**The `ink` variant is the `--panel` token set, not dark mode.** It uses `--panel`, `--panel-ink`,
`--panel-ink-2`, `--panel-rule`, so it is correct in _both_ themes with no conditional logic. This is
exactly why Prompt 01 §9.4 insisted on `@theme inline`.

## 7.3 The container

`.sc` → max-width 1160px with 40px gutters, giving 1080px of content — the law's top breakpoint.
`.sc-n` → 820px for prose. Gutters step 40 → 24 → **20 at 360**.

## 7.4 New CSS lives in `apps/site`, not `packages/ui`

The ~290 lines of public-site CSS (`.sc .hdr .hero .tryit .blk .stickycta .mnav .ftr` …) are marketing
chrome, not design system. They belong in `apps/site/src/views/`, the same way the showcase's `docs.css`
does. Only genuinely reusable product components graduate to `packages/ui` — see §13.

---

# PART 8 — THE HERO AND THE DEMO

> _"The whole page exists to get you here."_ — comment in `landing.html`

## 8.1 What makes this hero unusual, and right

2026 consensus has converged on the hero being the product surface itself rather than a screenshot.
**Subiza does this better than nearly anyone, because its demo is a real phone call rather than a
click-through.** Do not replace it with a video or an animated mock. Protect it.

## 8.2 Anatomy

Two-column at ≥860; stacked at 360 with the demo **below** the CTAs.

**Left:** eyebrow (`Kigali · answering in Kinyarwanda`) · `h1` with the `<em>` marked word · lede ·
two CTAs (`Hear it now` primary, `How it works` secondary) · a four-item trust strip (_You keep your
number · No card, ever · Paid with MoMo · Off again with one code_).

The `h1` is **the highest-risk string on the site** — two lines in English, one longer string in
Kinyarwanda. Prove it at 360 in `rw` before anything else.

**Right — the demo widget**, two tabs:

- **Call Subiza** — the dial number as a large `tel:` link, four suggested things to try, and the abuse
  note. **This path requires no JavaScript at all** and must remain the primary CTA everywhere: hero,
  sticky bar, footer, final CTA.
- **We call you** — name + Rwandan phone number, submit, we ring you.

## 8.3 The demo is server-first

**Not a client state machine.** A route handler that validates, rate-limits, does carrier lookup, places
the call, and `redirect()`s to a static result route. A client component may _upgrade_ that to in-place
`<ViewTransition>` swaps — but the server path is the real one, and it is what makes every state work
with JS off.

Model it with `ViewState<T>` from `packages/core` and render through the existing eight state components.

## 8.4 All eight demo states

| State            | What the visitor sees                                                  | Notes                                                                                                         |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **idle**         | The form                                                               | Single phone field. Drop the name field — one field converts better and we do not need a name to ring a phone |
| **submitting**   | `Button` with `aria-busy`, label retained                              | Width must not jump                                                                                           |
| **ringing**      | `LiveCallCard` + `Waveform` + _"Pick up"_                              | The one place the waveform earns its place on this page                                                       |
| **answered**     | Success + _"So — how did that sound?"_ + the two onward CTAs           | The prototype's only state                                                                                    |
| **rate-limited** | `Banner` warn + when to try again **in minutes** + the `tel:` fallback | The page promises _two demos per number per day_. That is a commitment a client check cannot keep             |
| **failed**       | `Banner` risk + plain language + the `tel:` fallback                   | Never a carrier code. Apologise once                                                                          |
| **not-rwandan**  | Inline validation + the `tel:` number                                  | Rendered error text, announced — not just `aria-invalid`                                                      |
| **offline**      | `Banner` + the `tel:` number                                           | The phone still works when the data does not                                                                  |

**The `tel:` link must be present in the same viewport in every failure state.** The fallback is not a
fallback — on this page it is the better path.

## 8.5 Security — this is an outbound-call trigger

As specified, the widget lets **any visitor make Subiza phone any number they type**. That is an abuse
vector and it brushes F12 (no outbound campaigns).

Mandatory, all server-side: rate limit keyed on **number + IP** · an idempotency key so a double-submit
places one call · Rwandan-number validation · a bot check that is not a CAPTCHA (honeypot + timing) ·
the 24-hour deletion promise honoured in the handler, not the copy · structured logging for abuse review.

> _"Render-time gating is not a security boundary, because requests can be sent without going through
> the UI."_ The page publicly promises _two per number per day_ and _deleted after 24 hours_. Those are
> commitments only the server can keep.

## 8.6 Copy to preserve exactly

The abuse note — _"This is Subiza's own demo agent, not yours. Yours is a different agent with your
hours, your prices and your voice"_ — and the consent note — _"Two demos per number per day. Your number
is used for this call only and is deleted after 24 hours unless you create an account. It is never sold,
shared or added to a marketing list."_

**One correction:** the prototype says _"about fifteen minutes after you sign up."_ Doc 04 says onboarding
is **~45 minutes**. Fix it, and put the duration in the claims registry so it cannot drift between this
page and the activation flow.

---

# PART 9 — THE HOME PAGE, SECTION BY SECTION

## 9.1 The arc — with one structural change

| #   | Section                              | Tone    | Change from the prototype                                                                                                                                                                   |
| --- | ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero + demo                          | default | Single-field form; all eight states                                                                                                                                                         |
| 2   | **Honesty band**                     | default | **MOVED UP from position 3.** This is where a logo wall would go — and where Subiza cannot have one. It is the most valuable section on the page; stop burying it                           |
| 3   | What your customer hears             | ink     | Label the transcript as an illustration                                                                                                                                                     |
| 4   | The same Thursday, twice             | tint    | Label the rows as illustrations; fix the bar scale                                                                                                                                          |
| 5   | **Who it is for**                    | default | **NEW** — use-case segmentation. §5.1 gap 7                                                                                                                                                 |
| 6   | No engineer. No new phone. One code. | default | Keep. Fix _"since the 1990s"_ / _"since 1993"_                                                                                                                                              |
| 7   | Phone first. Messages next.          | tint    | Add SMS, Messenger, web chat, USSD, voice notes                                                                                                                                             |
| 8   | Kinyarwanda isn't an afterthought    | default | Keep. This is the moat, stated plainly                                                                                                                                                      |
| 9   | Compared with the person you'd hire  | tint    | Fix the scale bug; add the non-price dimensions                                                                                                                                             |
| 10  | **The weekly report**                | default | **NEW** — render `WhatsAppBubble` as a real artefact. Doc 11 §8.3 calls it the second-most-effective sales asset, it uses only Subiza's own instruments, and it costs zero KB beyond markup |
| 11  | **Subiza is wrong for you if…**      | default | **NEW** — disqualification. Counter-intuitively the strongest trust device available to a pilot-stage company                                                                               |
| 12  | Fair questions (FAQ)                 | default | Keep as native `<details>`. Already JS-free                                                                                                                                                 |
| 13  | **Pilot proof + apply**              | tint    | **NEW** — _"we're in pilot"_ appears four times with no way to join it                                                                                                                      |
| 14  | Final CTA                            | ink     | Add the third, low-commitment CTA                                                                                                                                                           |

## 9.2 The honesty band — the most important section

Two columns: **"You can check this today"** (four verifiable claims, each checkable against the live
demo number) and **"We can't show you this yet"** (four honest absences — long-running customers, final
prices, instant WhatsApp, outbound calling).

Preserve the framing verbatim: _"Plenty of AI companies open with a wall of customer logos they don't
have. We're not doing that. Talk to the agent yourself — that's the only proof worth anything at this
stage."_

Every item in the left column must be **checkable in ninety seconds on the demo number**. If one is not,
it belongs in the right column.

## 9.3 The transcript demo

`LiveCallCard` + `Waveform` + `Transcript`, all from `packages/ui`. The conversation shows the agent
hitting its limit and fetching a human — `tmark`: _"Fetched a person — outside its limits."_

The closing line is the thesis of the entire product and must not be softened:

> _"Notice what it did **not** do: it did not invent an answer. When Subiza doesn't know, it says so and
> fetches you. A confident wrong answer costs your business more than an admitted gap ever will."_

Original language stays the primary line, translation beneath. **Label the card as an illustration.**

## 9.4 The comparison — fix the scale bug

The prototype sets `--w:100%` on **both** the RWF 150,000 and RWF 650,000 rows. That is a data-modelling
bug, not a CSS one.

Represent tiers as typed data with an explicit `anchorMax` and compute widths from real values:
650,000 → 100% · 150,000 → **23%** · 20,000 → **3%**. One hand-written SVG or a CSS bar set on a
**single axis**. No chart library.

Anchor on **Rwandan wages, never competitor pricing.** Naming ManyChat, Dialzara or Genesys invites a
features fight Subiza does not need and makes the page answerable for third parties' prices.

## 9.5 The sticky CTA

`position: sticky; bottom: 0`, height reserved via `padding-block-end` on `main`. A ~20-line inline
script hides it while the hero CTA is visible. **If the script never runs, the bar is always present** —
an acceptable degradation, and the correct direction to fail.

Extend it beyond the homepage and beyond 560px. On mobile it resolves to the `tel:` link.

---

# PART 10 — THE SUB-ROUTES

**`/how`** — the four steps expanded: choose when Subiza picks up · dial the code on the phone holding
the SIM · we call to verify it actually worked · tell it about your business. Reuse
`ForwardingCodeCard` from `packages/ui`. Add a CTA at the end.

**`/security`** _(new)_ — residency under Art. 50, NCSA registration, who at Subiza can access a
tenant's conversations (break-glass only, alerted, reviewed), retention defaults, recordings off by
default, sub-processors, breach notification, the self-hosting trajectory, and `security.txt`. **Write
the residency claim per §12.3 — it is currently stated more strongly than the company can support.**

**`/about`** — _the thing we kept noticing_ · _what we believe_ · _where we are_ · _on the name_ —
keep all four; the naming section is genuinely good. Add faces, RDB registration number, a street
address. The stated moat is _"sold by people the SME can meet."_ A page with no people undercuts it.

**`/contact`** — WhatsApp, phone, email, and a real form that posts to a Server Action. State human
hours honestly (Mon–Sat 08:00–19:00) **and** the out-of-hours path. A 24-hour answering product whose
own contact number is only staffed in office hours needs to say what happens at 21:00.

**`/legal`** — an index of four **real** documents at four real routes. The DPO contact is a legal
requirement and must sit alongside a real privacy notice. Delete the unsourced _60 days_; Art. 24 is
**30 days**.

**`/data-request`** — no account, no login. Identity verification, request type, and a stated response
window. Linked from the footer, `/legal`, `/security`, and every privacy disclosure.

**`/start`, `/signin`** — handoff only. Carry forward anything already collected so Prompt 03 never asks
twice (SC 3.3.7 Redundant Entry).

---

# PART 11 — PRICING, AND THE HONESTY MACHINERY

## 11.1 The tension, and how it is resolved

Doc 11 §6 gives a complete price list — **Gerageza 0 / Ubucuruzi 20,000 / Ikigo 45,000 / Ikigo+ 90,000
RWF per month** — and then instructs: _"do not publish a price list until Phase 1 has measured actual
minutes consumed per business per month."_ Doc 12 repeats it as risk C1; Doc 13 as blocking question B1.

**The prototype already resolved this well** and its resolution must be preserved: publish the four
tiers, wrapped in a warn banner (_"Read this first: these are pilot prices"_), a 2026 honour commitment,
one month's notice of any change, and unused credit kept. That wrapper is not decoration — **it is the
only thing that makes publishing the list defensible at all.**

## 11.2 Enforce it structurally, not editorially

Export a single `<PricingTiers>` from `packages/ui` that **renders the banner internally and has no prop
to suppress it.** Add an e2e assertion that any route containing a tier price also contains the banner
text. The coupling should fail CI, not review.

## 11.3 Pricing as typed data

Put it in `packages/core` as one constant: id, RWF, included minutes and messages, optional USD
approximation, and `provisional: true` as a **non-optional** field until Doc 13 B1 is answered. Nothing
in `apps/site` may hardcode `20,000`, `45,000`, `90,000`. Format every price through the existing RWF
formatter — RWF has **no minor unit**.

Price in RWF. USD equivalents only in the `en` locale, always prefixed `≈`, from a dated rate.

**Never seat-based.** Doc 11 §6.1 principle 5: _"A three-person business has no seats."_ Delete the rota
caps — they contradict the principle _and_ the page's own _"People on your team | Free"_ row.

## 11.4 The claims registry — the machine-checked version of the honesty thesis

`packages/core/src/claims.ts` maps every public number to
`{ value, unit, source, sourceUrl, mark: 'green' | 'amber' | 'red', asOf }`.

- 🟢 **verified** — a published, citable figure. _RWF 150,000 receptionist and RWF 650,000 support rep
  are both verified._
- 🟡 **dated or proxy** — real but ageing, or a proxy measure. Needs an `asOf`.
- 🔴 **estimated or modelled** — may appear **only** with a linguistic hedge (_roughly_, _about_, _we
  estimate_) or not at all. _WhatsApp ~4 million is red._

Then add a test that greps the compiled message catalogues for numeric literals matching known figures
and **fails when one appears without a registry entry.** Unsourced number becomes a build failure.

Pair it with a `Citations` array mapping each external claim (Law 058/2021, MTN/Airtel forwarding
documentation, Meta's verification timeline, the reach figures) to its source URL, rendered inline and
surfaced on `/legal`.

## 11.5 The loss model is not a fact

Doc 01 §5.1's RWF 512,000/month figure calls itself _"a model, not a measurement"_, and Doc 13 lists all
five inputs as unvalidated. It may appear **only** as an interactive calculator fed by the visitor's own
numbers, labelled as their estimate, with assumptions visible and editable. Never as a headline.

---

# PART 12 — FORBIDDEN CLAIMS

> Read this before writing copy. Each row is a sentence the company cannot defend.

## 12.1 Platform constraints — atlas F1–F14

| Never say                                           | Because                                                                                                                                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| We set up call forwarding for you                   | **F7.** The owner must dial the GSM code themselves. The prototype's _"We can't dial it for you… any company telling you otherwise is describing something else"_ satisfies this — **keep it verbatim** |
| WhatsApp live today / same-day                      | **F8.** Meta's business verification is 5–15 working days and nobody can shorten it                                                                                                                     |
| We register your WhatsApp number                    | **F1/F2.** They must personally receive and enter an OTP                                                                                                                                                |
| Subiza learns from your past WhatsApp conversations | **F1**                                                                                                                                                                                                  |
| Outbound calling campaigns                          | **F12.** Not built, not planned                                                                                                                                                                         |
| WhatsApp marketing broadcast (Rwanda)               | **F13** until W18 is verified                                                                                                                                                                           |
| Message an Instagram user after 24h                 | **F6.** No template escape hatch exists on Instagram                                                                                                                                                    |
| A general-purpose assistant                         | Meta banned general-purpose AI chatbots on WhatsApp from 15 Jan 2026                                                                                                                                    |
| Your own cloned voice _(as a bare tier bullet)_     | **F9.** Cloning may never be marketed without the consent mechanism visible. Art. 3(2) treats voiceprints as sensitive biometric data                                                                   |
| Any payment card option                             | **F14.** MoMo only. Keep _"We never ask for a payment card, which means there is nothing to leak"_                                                                                                      |
| Integrations and webhooks                           | Product principle **P3** — _"never need an engineer… rules out anything requiring an API key, a webhook URL, or a developer."_ Doc 04 §5.4: not a developer platform                                    |

## 12.2 Competitive claims

**Never write _first_, _only_, _leading_, or _"the first Kinyarwanda voice AI."_** Proto has Kinyarwanda
voice AI in production in Rwanda today (Mbaza/MINALOC, BNR Intumwa, 591+ institutions, $1.8M Gates
funding), and Intron Health ships a trilingual English–Kinyarwanda–French model. The claim is publicly
falsifiable in one search, on a page whose entire value is candour.

**The single permitted form**, from doc 03 §6.1:

> _"No company was found that operates a turnkey, self-serve, SME-priced product answering live phone
> calls in Kinyarwanda."_

## 12.3 The two unverified claims currently on the page

**Data residency.** _"Personal data is stored in Rwanda, as Article 50 of Law N° 058/2021 requires"_ is
stated unconditionally while Doc 13 Q4 is **unresolved**, and Phase 1 runs on foreign managed APIs —
which Doc 09 §2.3 says constitutes a cross-border transfer. Art. 60 exposure is **7–10 years plus RWF
20–25 million**. Ship softened wording; counsel signs off the strong version.

**Carrier forwarding.** _"Works on MTN and Airtel"_ — Doc 13 Q2 is open and described as answerable in
one day. Doc 07 §5.3 also requires that any carrier charge for the forwarded leg _"must be disclosed
honestly"_, and the page omits it entirely — conspicuous on a page whose thesis is saying the
inconvenient thing.

**Mechanism:** gate both behind a build-time flag in `verifications.ts`. Softened wording is the default;
the strong wording becomes reachable only when the flag flips, and the flag's comment names the document
that must be updated first.

## 12.4 Targets are not observations

Answer rate >99%, containment >70%, <800ms turn latency, >20 missed calls recovered per month are
**doc 04 §8 targets**. Kinyarwanda word error rate on 8kHz telephone audio has **no published figure at
all**. No numeric accuracy, speed or outcome claim may appear anywhere.

## 12.5 No borrowed proof

No customer logos, no counts, no testimonials, no _trusted by_. Ten design partners is the Phase 1
target. The page's own commitment — _"we don't have thousands of customers or a wall of enterprise logos,
and we're not going to borrow either"_ — must hold, and that includes **labelling the illustrated
customers as illustrations**.

## 12.6 The promise under every promise

**G22:** _"The platform never makes a business less reachable than it was before Subiza."_ Every failure
story on this page — out of credit, servers down, bad network — must end with **the owner's own phone
ringing.**

---

# PART 13 — NEW COMPONENTS

Only these six are genuinely new. Everything else composes from `packages/ui`.

| Component                   | Home              | Notes                                                                                                                                                                                                                                     |
| --------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SiteHeader` / `SiteFooter` | `apps/site`       | Sticky header with a `.stuck` state. **The language switcher must be real `<a href>` elements**, not `<button data-lang>` — crawlability, the JS-disabled law, and Google's _"add hyperlinks so users can manually select"_ all demand it |
| `Section`                   | `apps/site`       | The shell: eyebrow / h2 / lede rhythm + `default \| tint \| ink`                                                                                                                                                                          |
| `DemoCall`                  | `apps/site`       | The widget. Server action + eight states. §8                                                                                                                                                                                              |
| `ComparisonBars`            | `apps/site`       | Single-axis, computed widths, hand-written SVG                                                                                                                                                                                            |
| `PricingTiers`              | **`packages/ui`** | Graduates because the banner coupling must be enforceable. §11.2                                                                                                                                                                          |
| `FaqList`                   | `apps/site`       | Native `<details>`/`<summary>` from a typed array. CSS-only icon rotation. Reuse for the 360px tier redesign so progressive disclosure is one pattern                                                                                     |

---

# PART 14 — LANGUAGES

## 14.1 Two site locales, four agent languages

These are different things and the site must say so. The **agent** speaks Kinyarwanda, English, French
and Swahili. The **website** ships **`rw` and `en`** only; French and Swahili arrive with those markets.

The prototype's disabled-with-badge menu (`Français — 2027`, `Kiswahili — Kenya`) is the right product
answer. Mirror it in routing: **`/fr` and `/sw` must 404 until the copy is genuinely translated.**
Shipping four locales of unreviewed machine translation is structurally indistinguishable from Google's
named _scaled content abuse_, and a `/fr` page asserting `hreflang="fr"` while serving non-French is a
direct mismatch signal.

Update `generateStaticParams` to the site locales. Keep `packages/i18n`'s four — the console will use them.

## 14.2 Porting the copy

`landing.html` carries **341 `data-rw` and 26 `data-rw-html` attributes** — a complete Kinyarwanda
translation already written. That maps 1:1 to message keys. You are transcribing, not translating.

Three cautions: nine `data-rw-html` values contain unescaped double quotes and are malformed — fix on
the way in. Use `t.rich()` for messages with embedded markup; **never concatenate translated fragments**
— Kinyarwanda morphology will break it. Keep the tier names (Gerageza, Ubucuruzi, Ikigo, Ikigo+) **out**
of the catalogue as language-invariant proper nouns; translate only the gloss.

## 14.3 Routing rules

The bare root may redirect once — **307/302, never 301**, carrying `Vary: Accept-Language` (and `Cookie`
if consulted). `/rw` and `/en` must resolve **200 for every user agent with no detection applied**;
Google prohibits bouncing someone off the locale they asked for.

## 14.4 Expansion at 360

Kinyarwanda runs **15–25% longer**. Already-present risks: `.btn{white-space:nowrap}`,
`.chan .cmeta span{white-space:nowrap;text-overflow:ellipsis}`, the four `.tier` columns, and
`.deftbl td:first-child{white-space:nowrap}`. Budget extra width on every tier card and comparison label.

---

# PART 15 — SEO, SHARING AND STRUCTURED DATA

> **2026 has retired much of what you remember. Verify before shipping.**

## 15.1 Metadata

Delete the static `metadata` export, then add `generateMetadata` with async params. Set **`metadataBase`**
(`new URL('https://subiza.rw')`) or every relative metadata URL is a build error.

**`generateMetadata` must never touch a request-time API** — no `cookies()`, no `headers()`, no uncached
fetch. Doing so defers metadata to request time, forfeits the CDN prerender the 3G budget depends on, and
triggers streaming metadata, which appends tags to `<body>` for any bot not on the `htmlLimitedBots`
list. **WhatsApp executes no JavaScript** — this is the share surface that matters most here.

## 15.2 hreflang

Must be **self-referencing and bidirectional** or Google discards the whole set — _"each language version
must list itself as well as all other language versions"_, and _"if two pages don't both point to each
other, the tags will be ignored."_ A one-way set is worth exactly zero, not partial credit.

Include `x-default`. **Never set a cross-locale canonical** — `/rw`'s canonical is `/rw`, not `/en`.
Pointing every locale at one canonical de-indexes the others and would erase the Kinyarwanda page that
`CONTEXT.md` calls _first-class, not a fallback_.

## 15.3 Structured data — what still earns anything

| Type                  | Verdict                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Organization`        | **Ship.** Name, logo, address, contact                                                                                                                                                        |
| `WebSite`             | **Ship the site-name half only.** `potentialAction`/`SearchAction` died 21 Nov 2024                                                                                                           |
| `BreadcrumbList`      | **Ship** on `/legal/*`                                                                                                                                                                        |
| `FAQPage`             | **Do not ship.** Retired from Google Search 7 May 2026, docs deleted 15 June 2026. Earns nothing and costs 2–4KB. **Keep the FAQ prose** — that is what AI Overviews extract                  |
| `SoftwareApplication` | **Do not ship.** Requires `offers` + `aggregateRating`/`review`. Subiza is pre-launch with no reviews, and inventing a rating is a spam-policy violation that contradicts the page's own copy |

Inject JSON-LD from a Server Component. No library.

## 15.4 OG images

`ImageResponse` has two hard limits that will waste a day if discovered late: **it cannot read woff2**
(only ttf/otf — so vendor a `.ttf` of Bricolage Grotesque), and it supports **flexbox only** — no grid,
no dependable inline SVG. The OG card therefore cannot reuse the sprite. Draw with explicitly-sized flex
divs, or go type-only. Per-locale images.

## 15.5 robots and sitemap

`sitemap.ts` and `robots.ts` as file conventions. **Do not `Disallow` `/consent/[token]` or
`/data-request`** — `Disallow` blocks crawling, which prevents Google from ever reading a `noindex`, and
a disallowed URL can still be indexed URL-only from an external link. Use per-route
`metadata.robots = { index: false, follow: false }`, leave them crawlable, and keep them out of the
sitemap. Same treatment for `/design-system`.

---

# PART 16 — MOTION

Tier 0 remains the default: CSS transitions on motion tokens, React `<ViewTransition>` for route changes.
GSAP, Motion, Lenis and every other runtime remain banned by lint.

**Tier 1 — scroll-driven reveals — is unlocked for `apps/site` only**, and only under both guards:

```
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) { … }
}
```

## 16.1 The `.rv` bug you must not port

The prototype's reveal class sets `opacity: 0` and relies on JavaScript to restore it. **If the script
is slow or fails, the page is blank below the fold** — the exact opposite of what a 2G-first site should
do.

**Author the final, visible state as the default.** Add the animation only inside the nested guards
above. Two reasons: `animation-timeline` is not Baseline (Firefox unshipped), and the design system's
global `animation-duration: .01ms !important` reset **does not stop a scroll-progress timeline**, because
that timeline is not time-driven.

Scroll-driven and view-transition animations may touch **only `transform` and `opacity`**. A scroll
timeline runs on every scroll frame, so the compositor-only rule matters more here than anywhere else.

---

# PART 17 — PERFORMANCE

## 17.1 Measure correctly

`experimental.inlineCss` **is not available in development.** Every byte and timing measurement runs
against `next build && next start`. Dev numbers for this app are meaningless.

Watch inlineCss's cost as well as its benefit: it duplicates CSS once in `<style>` and again in the RSC
payload. Keep per-route critical CSS under ~40KB and **audit the inlined size per route in CI**, or the
fix becomes the bottleneck.

## 17.2 Fonts

`next/font` self-hosts at build — **drop the prototype's `fonts.googleapis.com` preconnect and
stylesheet.** Keeping them adds two dead origins (~900ms of RTT on 3G) and creates a third-party data
transfer under Law 058/2021.

**Never disable `adjustFontFallback`**, and never put a non-generated family before the `… Fallback`
entry in a stack. The generated fallback carries `size-adjust`, `ascent-override` and `descent-override`
computed from the real font; without it, a display face at hero scale differing from Arial by 6–8%
reflows the headline and shoves every block below it — **a 0.10–0.25 CLS event from one property,
against a 0.1 budget.** Subset to Latin plus the diacritics the two site languages need. Drop the italic
axis.

## 17.3 Fidelity

Wire `Fidelity` to the `Save-Data` header and the `Sec-CH-Prefers-Reduced-Data` client hint in a server
component at layout level; pass it down. At `lite`: `Waveform` renders 8 static bars instead of 24
animated ones, the contact map becomes text, and the smallest font subset loads.

## 17.4 Gates

Per-route above-fold ≤200KB and total ≤500KB, asserted in `turbo` — **fail the build, do not warn.**
Lighthouse CI on a Moto-G-class profile with 3G throttle. Send LCP, INP and CLS to a first-party
endpoint with a coarse geo tag so the Rwanda p75 is visible separately.

Set the regional alert at **3s LCP**, not the 4s ceiling — the emulator gap is roughly 3s reported vs 12s
actual, and CI alone is necessary but not sufficient. Run a manual acceptance pass on two or three real
low-end Androids on real MTN and Airtel connections before each release.

---

# PART 18 — STATES FOR A PUBLIC PAGE

The eight-state law applies here too. Which ones a marketing site actually needs:

| State            | Where                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Loading**      | Only inside the demo widget. The page itself is static — a skeleton would be a bug                    |
| **Empty**        | Not applicable                                                                                        |
| **Offline**      | Demo widget + a global banner. The `tel:` number still works                                          |
| **Partial**      | Pilot-proof numbers unavailable → say so, do not hide the section                                     |
| **Denied**       | `/consent/[token]` with a bad or expired token                                                        |
| **Not found**    | **The real 404.** What happened, and where to go instead                                              |
| **Rate limited** | The demo. When to try again, **in minutes**                                                           |
| **Server error** | The designed 500. Apologise once, say we know, offer support. **Never a code as the primary message** |

Plus two that are unique to a public page: **JavaScript disabled** (every route must work) and **2G /
lite fidelity**.

---

# PART 19 — VERIFICATION

| Audit            | Tool                                               | Pass condition                                                                          |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| No-JS            | Playwright `javaScriptEnabled: false`, every route | Every route renders; nav works; demo posts                                              |
| 404 / 500        | Request a nonsense URL; force a throw              | Real 404 status; designed 500 with `retry`                                              |
| Demo abuse       | Script 3 submissions for one number in a day       | Third is refused server-side, with the rate-limited state rendered                      |
| Claims           | `claims.test.ts`                                   | No numeric literal in a catalogue without a registry entry                              |
| Forbidden claims | Grep test over catalogues                          | Zero hits for _first_ / _only_ / _leading_ / _webhook_ / _card_ / same-day WhatsApp     |
| Pricing coupling | e2e                                                | Every route with a tier price also contains the banner text                             |
| Legal links      | Link crawler                                       | Zero dead links from `/legal`, the footer, and in-copy                                  |
| SEO              | Audit both locales                                 | `metadataBase`, self-referencing bidirectional hreflang, per-locale canonical, OG image |
| Locales          | Route test                                         | `/rw` and `/en` are 200; `/fr` and `/sw` are 404                                        |
| a11y             | `@axe-core/playwright`, 2 locales × 2 themes       | Zero violations; skip link present; errors announced                                    |
| Targets          | Custom assertion                                   | Every interactive box ≥48×48, ≥8px apart                                                |
| Expansion        | rw × 360 × 2 themes                                | No horizontal overflow, no clipped text                                                 |
| Reveals          | Disable JS **and** `@supports`                     | All content visible                                                                     |
| Budget           | Lighthouse, `next build && next start`, 3G         | ≤200KB above fold, ≤500KB total, LCP ≤4s                                                |
| Banned deps      | `pnpm why`                                         | Nothing resolves                                                                        |

## 19.1 The adversarial pass

Deploy a reviewer whose only job is to falsify "done". Hunt specifically for: a number with no registry
entry · a forbidden claim survived a rewrite · a fabricated customer still unlabelled · a page that
dead-ends with no CTA · a `searchParams` read that broke static prerendering · a `dark:` colour utility ·
a hardcoded RWF string · a reveal that hides content · a legal link still pointing at `/legal` · the
demo's `tel:` fallback missing from a failure state.

## 19.2 The final grep

```
searchParams · FAQPage · SoftwareApplication · SearchAction · framer-motion · gsap · lenis
"first" · "only" · "leading" · webhook · 20,000 · 45,000 · 90,000 · fonts.googleapis.com
```

Each appears zero times, or only inside a lint rule, a test, or the claims registry.

---

# PART 20 — DELIVERABLES & NEXT

1. Three Phase 1 debts closed (§3.2)
2. `packages/core/src/claims.ts`, `pricing.ts`, `verifications.ts`, `citations.ts`
3. `packages/ui` gains `PricingTiers`
4. Ten routes + 404 + 500 + sitemap + robots + OG images
5. `rw` and `en` catalogues, complete, ported from `data-rw`
6. The demo widget, server-first, eight states, rate-limited
7. Four real legal documents
8. `/security` and `/data-request`
9. The audit suite green, with the new tests from §19

**Prompt 03** — Sign-up, sign-in and account recovery (`Design/auth.html`): five screens, the one-input
OTP in anger, delivery fallbacks, granular consent, and three recovery paths. Say **next**.

---

# PART 21 — APPENDIX

## A — The home arc and what each section does

```
 1  HERO + DEMO        "Nobody misses a call again."      → hear it in 90 seconds
 2  HONESTY BAND       can prove / can't prove yet        → where a logo wall would be
 3  WHAT THEY HEAR     transcript, agent hits its limit   → it fetches a human
 4  SAME THURSDAY      4 lost  vs  3 handled + 1 handed   → the cost of not answering
 5  WHO IT'S FOR    ★  salon / clinic / hotel             → "this is me"
 6  ONE CODE           no engineer, no new phone          → removes the install fear
 7  CHANNELS           phone now · WhatsApp queued        → honest about Meta's clock
 8  KINYARWANDA        built first, not translated        → the moat, stated plainly
 9  COMPARISON         650k · 150k · from 20k             → anchored on wages, not rivals
10  WEEKLY REPORT   ★  the WhatsApp bubble                → the renewal number, shown
11  WRONG FOR YOU   ★  disqualification                   → trust through refusal
12  FAQ                seven real objections              → native <details>, JS-free
13  PILOT PROOF     ★  + apply to the pilot               → the missing next step
14  FINAL CTA          call · account · WhatsApp ★        → three commitment levels

                        ★ = new in this phase
```

## B — The demo, server-first

```
        ┌──────────── TAB 1: CALL SUBIZA ────────────┐
        │  <a href="tel:+250788782492">              │  ← zero JS. always works.
        │  never fails, never rate-limited           │     present in EVERY failure
        └────────────────────────────────────────────┘     state of tab 2.

        ┌──────────── TAB 2: WE CALL YOU ────────────┐
        │  <form action={placeDemoCall}>             │  ← Server Action
        │    one field: Rwandan phone number         │
        └──────────────────┬─────────────────────────┘
                           ▼
              ┌─── SERVER ONLY ────────────────┐
              │  validate · normalise          │
              │  rate limit  (number + IP)     │  "two per number per day"
              │  idempotency key               │   is a SERVER promise
              │  honeypot + timing bot check   │
              │  place call · log for abuse    │
              │  schedule 24h deletion         │
              └──────────────┬─────────────────┘
                             ▼  redirect() to a STATIC result route
                                (never ?sent=1 — searchParams kills prerender)
    ┌─────────┬──────────┬─────────┬──────────┬─────────┬──────────┬─────────┐
    ▼         ▼          ▼         ▼          ▼         ▼          ▼
  idle    submitting  ringing  answered  rate-ltd   failed   not-RW / offline
  form    aria-busy   LiveCall  success   Banner    Banner    inline error
                      + Wave    + CTAs     warn      risk      + tel:
                                          ╰──────────┴──────────╯
                                        tel: link in the SAME VIEWPORT
```

## C — How a claim reaches the page

```
   docs/ + flow atlas          ← the source of truth
          │
          ▼
   packages/core/src/claims.ts
     { value, unit, source, sourceUrl, mark, asOf }
          │
     🟢 verified ──────────► may be stated plainly
     🟡 dated/proxy ───────► must carry its asOf
     🔴 modelled ──────────► hedge ("roughly", "about") or DO NOT SHIP
          │
          ▼
   messages/{rw,en}.json      ← copy references the claim
          │
          ▼
   claims.test.ts             ← greps catalogues for numeric literals
          │                      orphan number = BUILD FAILURE
          ▼
       the page

   verifications.ts gates two strings behind a flag:
     DATA_RESIDENCY_CLAIM   blocked until doc 13 Q4 has counsel's position
     CARRIER_FORWARDING     blocked until doc 13 Q2 is actually tested
   Softened wording is the DEFAULT. The flag's comment names the
   document that must change first.
```

---

_Prompt 02 · Subiza · Landing Page & Public Routes_
_Built against `Design/landing.html`, the Subiza Flow Atlas v1.0, and docs 01–13._
_Where this document and the prototype disagree about a claim, this document wins._
