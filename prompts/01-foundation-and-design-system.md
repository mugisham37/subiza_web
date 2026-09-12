# SUBIZA — BUILD PROMPT 01
## Foundation & Design System

> **You are being handed a finished specification and asked to lay the foundation of a production
> application on top of it. Nothing in this document is a suggestion. Where it says MUST, a reviewer
> will check. Where it says NEVER, a lint rule will enforce it.**

| | |
|---|---|
| **Prompt** | 01 of a series — Foundation & Design System |
| **Corresponds to** | `Design/design-system.html` (D0.1 in `Design/PROGRAMME.md`) |
| **Repo root** | `/home/moses/Desktop/Coding/Development/subiza` |
| **Existing scaffold** | `subiza/` — stock `create-next-app`, Next **16.3.5**, React **19.2.8**, Tailwind **4.3.3**, TypeScript **5.9.3** |
| **Writes code** | Yes — this is a build phase, not a design phase |
| **Ships UI screens** | No — this phase ships the *system*, plus one living showcase route that proves it |
| **Next prompt** | 02 — Landing page & public routes (`Design/landing.html`) |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Your role

You are the **conductor**. You do not write all of this yourself in one pass. You decompose it,
deploy specialist agents in parallel where the work is genuinely independent, gate each phase on a
verifiable artefact, and personally own the integration and the final audit.

The work has a natural dependency order. Respect it — parallelising across a dependency edge produces
two agents guessing at the same interface and a day lost reconciling them.

```
  ┌─ PHASE A ─ ABSORB ────────────────────────────────────────────┐
  │  Every agent reads before any agent writes.                   │
  │  Gate: a written CONTEXT.md that survives challenge.          │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE B ─ GROUND TRUTH ──▼───────────────────────────────────┐
  │  B1 Next.js 16 correction sheet   (read node_modules docs)    │
  │  B2 Browser-floor measurement     (decides Tailwind in/out)   │
  │  These two run in PARALLEL. Both gate everything after.       │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE C ─ SKELETON ──────▼───────────────────────────────────┐
  │  Monorepo, workspaces, configs, lint boundaries, CI.          │
  │  SEQUENTIAL — one agent. Everything imports this.             │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE D ─ FOUNDATIONS ───▼───────────────────────────────────┐
  │  D1 tokens.css + @theme inline    D2 theme + motion switches  │
  │  D3 icon sprite pipeline          D4 fonts                    │
  │  PARALLEL. All four land in packages/ui.                      │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE E ─ COMPONENTS ────▼───────────────────────────────────┐
  │  E1 atoms   E2 molecules   E3 organisms   E4 product objects  │
  │  PARALLEL BY LAYER, but E2 waits on E1, E3 waits on E2.       │
  │  Within a layer, one agent per component group.               │
  └───────────────────────────┬───────────────────────────────────┘
                              │
  ┌─ PHASE F ─ PROOF ─────────▼───────────────────────────────────┐
  │  F1 showcase route   F2 a11y audit   F3 perf audit            │
  │  F4 no-JS audit      F5 four-language 360px audit             │
  │  PARALLEL. Each produces a pass/fail report, not an opinion.  │
  └───────────────────────────────────────────────────────────────┘
```

## 0.2 The agents to deploy

Deploy these as distinct roles with distinct system framing. Do not let one agent wear two hats — the
auditor must not be the author, or the audit is worthless.

| Agent | Owns | Must be told |
|---|---|---|
| **Researcher** | Phase B. Reads `node_modules/next/dist/docs/`, measures the browser floor. | Your training data on Next.js is stale. The installed docs outrank your memory, always. |
| **Architect** | Phase C. Monorepo, configs, boundaries, CI gates. | Compile-time separation is a security control, not a preference. |
| **Token engineer** | D1, D2. `tokens.css`, `@theme inline`, theme + motion switches. | Transcribe values. Do not "improve", round, or normalise a single hex. |
| **Asset engineer** | D3, D4. Sprite pipeline, font self-hosting. | No icon package. No stock illustration. Licences are checked, not assumed. |
| **Component engineers** (×4) | Phase E, one per layer. | The HTML is the spec. Improve the *implementation*, never the *decision*. |
| **Accessibility engineer** | F2, and reviews every component in E. | WCAG 2.2 AA in full, plus 2.4.13 treated as required. |
| **Performance auditor** | F3, F5. | The budget is an accessibility criterion here, not a score. |
| **Adversarial reviewer** | Final gate. Tries to *break* the claim that Phase 1 is done. | Assume the other agents were optimistic. Find where. |

## 0.3 The two rules that govern every decision

**Rule 1 — The HTML is the specification, not a mockup.** `Design/design-system.html` is 1,875 lines of
hand-authored, reasoned, token-bound CSS. Every value in it has an argument attached, and most of those
arguments are written down inside the file in `.why` blocks. Read them. When you are tempted to change
something, find the `.why` first. You are porting a *finished* system into React — you are not
redesigning it.

**Rule 2 — You may improve the implementation, never the decision.** The design system says buttons are
pills, radius means three different things, shadows appear on exactly one of four elevation levels, and
the spring easing is used on exactly one element. Those are decisions; they are fixed. *How* you express
them in React, TypeScript and CSS is implementation; that is yours, and it should be excellent.

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What Phase 1 ships

A monorepo containing a **complete, typed, accessible, themeable, four-language-ready component library**
ported from `Design/design-system.html`, plus the application skeletons that will host every later
surface, plus one route that renders the entire system as living proof.

## 1.2 Definition of done

Phase 1 is done when **all sixteen** of these are true. Not fifteen.

| # | Criterion | How it is proven |
|---|---|---|
| 1 | The monorepo builds clean | `pnpm turbo build` exits 0 across all three apps |
| 2 | TypeScript is strict and silent | `tsc --noEmit` exits 0 with the strict flag set of §8.5 |
| 3 | Every token from the HTML exists, in both themes, at its exact value | Automated diff: extract `--*` from `design-system.html` and from `tokens.css`; the sets and values must match exactly |
| 4 | Theme switches light / dark / system with no flash | Manual check in both OS settings + Playwright screenshot at first paint |
| 5 | Dark mode is authored, never inverted | Grep: no `filter: invert`, no `hsl(from ...)` colour derivation in the dark blocks |
| 6 | Every component in the inventory (§13) exists and is typed | Checklist in §13, each box ticked with a file path |
| 7 | All eight states exist as a typed union and a boundary component | `ViewState<T>` compiles; `StateBoundary` renders all eight |
| 8 | The showcase route renders every component in both themes | `/design-system` in `apps/site` |
| 9 | Everything except the theme and motion switches works with JS disabled | Playwright project with `javaScriptEnabled: false` passes |
| 10 | Focus is visible on every interactive element, on every surface, in both themes | Manual tab-through of the showcase + axe run |
| 11 | Touch targets are ≥48×48 with ≥8px separation | Automated: query every interactive element's box, assert |
| 12 | Reduced motion stops **everything**, including the waveform and the live dot | Playwright with `reducedMotion: 'reduce'`, assert zero running animations |
| 13 | Above-the-fold weight ≤200KB on the showcase route | Lighthouse on throttled 3G, recorded in CI |
| 14 | No banned dependency is installed anywhere | `pnpm why` for each banned package returns nothing; lint rule active |
| 15 | The icon sprite has 176 symbols at stroke 1.75, and `IconName` is a generated union | Count assertion + a deliberate typo must fail `tsc` |
| 16 | Layer boundaries are mechanically enforced | A deliberate illegal import must fail lint in CI |

## 1.3 What Phase 1 explicitly does NOT ship

Do not build these. They belong to later prompts and building them now means building them wrong.

- Any marketing page (Prompt 02), any auth screen (Prompt 03), any console screen (Prompts 04+).
- Any real data fetching, API client, database, or auth implementation. Use **typed fixtures** only.
- The admin console's screens — `apps/admin` is created as a skeleton with a layout and nothing else.
- Any business logic. The permission matrix is *typed* in Phase 1 (§8.6) but not *enforced* against real
  sessions until Prompt 03.

---

# PART 2 — CONTEXT ABSORPTION

## 2.1 The mandate

**Every agent reads Tier 1 before writing a line.** Component engineers additionally read Tier 2. This is
not optional and it is not a skim. The single most expensive failure mode available to you is an agent
who inferred the design system from its name and built a generic dashboard kit.

## 2.2 Tier 1 — everyone, in this order

| Order | File | Extract |
|---|---|---|
| 1 | `README.md` | What Subiza is; the sub-brand table (§1); the capability map (§4); the strategic thesis (§6). **Note: `Ijwi` and `Ubwenge` are internal engine names and must NEVER appear in UI.** |
| 2 | `subiza-flow-atlas/README.md` | **§4 — the global rules G1–G22.** These bind every screen you will ever build here. Memorise them. Also §3 Q1: the definition of activation. |
| 3 | `Design/PROGRAMME.md` | What is designed, what is not, and the four cross-cutting laws at the bottom. |
| 4 | `Design/design-system.html` | **All 1,875 lines.** Read the `.why` blocks — they carry the reasoning. Sections 22–26 (`#states`, `#responsive`, `#a11y`, `#perf`, `#credits`) are the law and are reproduced in this prompt, but read them at source anyway. |
| 5 | `subiza-flow-atlas/flows/04-platform-constraints.md` | The F1–F14 forbidden list. You will not build against a capability that does not exist. |
| 6 | `subiza-flow-atlas/flows/02-information-architecture.md` | The route tree you are creating skeletons for. |

## 2.3 Tier 2 — component engineers

| File | Why |
|---|---|
| `Design/home.html` | The **app shell** appears here for the first time — nav rail, topbar, mobile tab bar. Your `AppShell` organism must match it. |
| `Design/conversations.html` | The most complex list/detail surface. Your row list, transcript and filter chips must survive it. |
| `Design/landing.html` | The public surface. Note the `data-rw` bilingual attribute pattern — you are replacing that with real i18n, not copying it. |
| `Design/auth.html` | The OTP field in situ. |
| `subiza-flow-atlas/flows/24-flow-errors-and-degradation.md` | **§6 — the eight states.** The authority for §17 of this prompt. |

## 2.4 Tier 3 — the ground truth that outranks your memory

```
subiza/node_modules/next/dist/docs/        ← 400+ files. THE authority on Next.js 16.
subiza/AGENTS.md                           ← regenerated by `next dev`. Never delete its block.
subiza/node_modules/tailwindcss/            ← the installed v4.3.3, not the v3 you remember
```

`AGENTS.md` says it plainly: *"This is NOT the Next.js you know. This version has breaking changes —
APIs, conventions, and file structure may all differ from your training data."* Part 6 of this document
is the correction sheet, derived by reading those docs. Trust it over your instincts, and when it is
silent, read the docs rather than guessing.

## 2.5 The gate

Phase A ends when you have written `CONTEXT.md` at the repo root answering, in your own words and without
looking anything up again:

1. Who is Claudine, what device is she on, and what does her data cost her?
2. What are G1, G9, G13, G14 and G22, and which one most constrains a *component library*?
3. Why is the lime forbidden as a text colour, and which token exists to solve that?
4. Why does this system draw with hairlines instead of shadows?
5. Why is the OTP field one input rather than six?
6. What are the six components that are *redesigned* rather than reflowed on a small screen?
7. Name three things `Design/design-system.html` explicitly forbids you from installing.

If an agent cannot answer #7 correctly, it has not read the file, and it must not be allowed to write code.

---

# PART 3 — THE NON-NEGOTIABLE LAW

Everything in this part is lifted from the project's own documents. It is reproduced here so that no
agent has an excuse. Violating any of it is a defect, regardless of how good the result looks.

## 3.1 The global rules (Flow Atlas README §4)

**Structure** — G1 One next action. G2 Value before configuration. G3 Nothing blocking that need not
block. G4 Every step says why. G5 No product tours. G6 No blank screens. G7 Skip and resume, always.
G8 Templates over blank boxes.

**Trust** — G9 The kill switch is always visible. G10 Every AI conversation is readable. G11 AI is
disclosed to the caller. G12 Consent is asked in context, never bundled. G13 The system says "I don't
know" rather than guessing.

**Market** — G14 Mobile-first, low-bandwidth. G15 Language switchable anywhere, any time. G16 Icons,
numbers and status colour over paragraphs. G17 WhatsApp is an interface, not only a channel. G18 Never
require a card.

**Engineering** — G19 Every external connection can break silently. G20 Every flow has a defined failure
state. G21 Every consequential action is auditable. G22 The platform never makes a business less
reachable than it was before Subiza.

**The three that bind a component library hardest: G6, G14, G16.** No blank screens means every list,
table and panel you build ships an empty state as part of the component, not as an afterthought.
Mobile-first low-bandwidth means bytes are a user-facing cost. Icons-and-numbers-over-paragraphs means
your status components carry shape and word, not just colour.

## 3.2 The eight states

> *"Every screen has all eight of these, and a screenshot audit proves it."* — Flow 24
>
> *"Nothing in this system is considered designed until all eight exist. The states are not variants of
> the screen — they are the screen, seven-eighths of the time that anything is wrong."*

| # | State | Required behaviour | Component |
|---|---|---|---|
| 1 | **Loading** | A skeleton shaped like the real content. Never an unexplained spinner past 3 seconds — after that, words | `.sk` |
| 2 | **Empty** | What goes here, why it is empty, and **one** action. Bespoke art, never a generic shrug | `.empty` |
| 3 | **Offline** | Say it. Queue the action. Show it as pending. Send on reconnect | `.toast` + pending tag |
| 4 | **Partial** | Show what loaded, say plainly what did not — a missing recording is a stated gap, not a broken player | `.banner-info` |
| 5 | **Permission denied** | Why, and who *can* do it. Never a bare "forbidden" | `.empty` + role |
| 6 | **Not found** | What happened to it, and where to go instead | `.empty` |
| 7 | **Rate limited** | When to try again, in minutes | `.banner-warn` |
| 8 | **Server error** | Apologise once, say we know, offer support. **Never a code as the primary message** | `.banner-risk` |

## 3.3 Responsive law

Base design width is **360px** — the modal Android width in this market. Everything wider is an
enhancement.

| Breakpoint | What changes |
|---|---|
| **360 — base** | Single column. Bottom tab bar. Bottom sheets. Buttons full-width and stacked. 20px gutter. Tables are lists |
| **560** | Buttons return to a row. Stat cards go two-up. 24px gutter. Sheets can become centred dialogs |
| **860** | The rail replaces the tab bar. Two-column layouts appear. The doc drawer becomes persistent |
| **1080** | Full gutters, three-column stat grids, the conversation list and detail sit side by side |

### The redesign register — six components that stop being themselves

These are **redesigned, not reflowed.** Building them as one component with responsive padding is the
single most likely way to fail this phase.

| Wide form | Small form | Why not just reflow it |
|---|---|---|
| Sidebar rail, 7 items | **Bottom tab bar, 4 + More**, frequency-ordered, shortened labels, dot instead of count | A hamburger hides the product. The thumb arc is at the bottom, not the top-left corner |
| Data table | **Row list** — avatar, two lines of text, one right-hand value | A horizontally scrolling table on a phone hides the columns that matter and is unusable one-handed |
| Centred modal | **Bottom sheet** with a drag handle, entering from the bottom | A centred dialog at 360 is a full-screen takeover with wasted margins and its actions out of thumb reach |
| Button row | **Full-width stack**, primary first | Two 44px targets side by side at 360 sit inside the mis-tap zone |
| Live call card, 2 actions | **One action** — "Take the call" — with the history line dropped | When a customer is on the line there is only one decision. The rest is furniture |
| Three-up stat grid | **Two-up**, with the key stat spanning both columns | A stat card below ~200px cannot hold a 2.35rem number and its comparison line |

**Container queries, not only media queries.** The stat card, the channel tile and the conversation row
query *their own slot*, not the window — so the same component is correct in a 264px sidebar and on a
900px page without anyone passing it a size prop. The ~5% of browsers without `container-type` get the
wide form, which is never broken, only less clever. **No feature is behind that query.**

**Touch targets are 48×48 CSS pixels with at least 8px between them** — above the WCAG 2.2 minimum of 24
and above the common 44 guidance, because this interface is used one-handed while doing something else.
Where a glyph is visually smaller, the hit area is padded to 48 regardless.

## 3.4 Accessibility law

Target: **WCAG 2.2 AA in full**, with **2.4.13 Focus Appearance treated as required** rather than
AAA-optional.

| Criterion | How this system meets it |
|---|---|
| 1.4.3 Contrast (AA) | Every text token measured. Lightest is 4.8:1. Lime is forbidden as text by token design, not by review |
| 1.4.11 Non-text contrast | Hairlines carry no meaning alone — every bordered control also differs in fill or shape |
| 1.4.1 Use of colour | Status is shape + word + colour, in that order. Remove the colour and everything still reads |
| 2.4.7 / 2.4.13 Focus | Dual-tone ring, 2px perimeter, ≥3:1 on every surface in both themes |
| 2.5.8 Target size | 48×48 minimum with 8px separation |
| 2.5.7 Dragging | Nothing requires a drag. The sheet's handle is decorative; the sheet closes by tap |
| 3.3.7 Redundant entry | The phone number entered at signup is never asked for again |
| 2.3.3 Animation from interactions | `prefers-reduced-motion` stops every loop, waveform and live dot included |
| 1.3.1 Info & relationships | Labels are real `<label>`s; status uses `role="status"`; the transcript is an ordered list in the DOM |
| 4.1.3 Status messages | Toasts and live-call state announce via `aria-live="polite"` without stealing focus |

> **One accessibility requirement here is not in WCAG at all.** Around a third of mobile internet in this
> market runs on 2G or EDGE, and rural usage sits near 19%. A screen that is perfectly conformant but
> needs 900KB to render is inaccessible to the people this product exists for. **The performance budget
> below is treated as an accessibility criterion, not a nice-to-have.**

## 3.5 Performance law

| Metric | Budget | Held by |
|---|---|---|
| LCP | ≤2.5s on 4G · ≤4s on 3G | No hero image. The largest paint is text |
| INP | ≤200ms | No layout-animating transitions; **no per-frame JS anywhere** |
| CLS | ≤0.1 | Skeletons match final dimensions; `font-display:swap` with a metric-matched fallback |
| Above the fold | **≤200KB** | Inline critical CSS, one sprite, two variable fonts subset to Latin |
| Total page | **≤500KB typical, 1MB ceiling** | **No chart library, no icon font, no animation runtime, no UI framework CSS** |
| JavaScript | As little as the feature needs | **Every component except the theme switch works with JS disabled** |

> **There is a 2G mode, and it is a designed state.** Below a measured threshold the console drops to text
> only: no avatars, no sparklines, no waveform, no audio preloading — ever. Audio is **never** preloaded
> regardless of connection, because a 40-second call recording is a meaningful fraction of a daily bundle
> and nobody asked for it to be downloaded.

## 3.6 Licence law

Nothing shipped requires attribution in the product UI. That was the deciding factor twice: **Font
Awesome Free and the Solar icon set were rejected on CC BY 4.0 alone**, because visible attribution would
have to follow every screen of a commercial console. Storyset's free tier failed the same test.

**Apply this test to every asset and dependency you consider.** ISC, MIT, Apache-2.0 and OFL-1.1 pass.
CC BY does not.

| Asset | Source | Licence |
|---|---|---|
| Icons (176 in the sprite) | Lucide | **ISC** — no UI notice |
| Bricolage Grotesque · Plus Jakarta Sans · JetBrains Mono | Google Fonts | OFL 1.1 — self-hostable, no UI notice |
| Empty-state art, waveform, ring, bars, dial-code card | **Original** | Subiza |
| Channel marks | Third-party trademarks | Nominative use only. Never restyled, never implying endorsement |

---

# PART 4 — THE CENTRAL TENSION, AND HOW IT IS RESOLVED

## 4.1 State the conflict honestly

The founder's brief asked for a rich dependency set: shadcn components installed broadly, GSAP, Framer
Motion, animation and effects libraries, components pulled from many sources and retuned.

The design system's own performance budget says, verbatim:

> **"No chart library, no icon font, no animation runtime, no UI framework CSS."**
> **"Every component on this page except the theme switch works with JS disabled."**

These cannot both be satisfied. The conflict was researched and resolved with the founder, and the
resolution is **the design system wins** — because the budget is downstream of G14, and G14 is downstream
of the fact that data costs up to 60% of monthly income for the poorest households in this market. The
budget is not a performance preference. It is who gets to use the product.

## 4.2 The measured cost of the alternative

These are real gzipped sizes, measured during research, against a **200KB above-the-fold budget**:

| Package | Cost (gzip) | % of above-fold budget | Verdict |
|---|---|---|---|
| `gsap` core | 27.4KB | 13.7% | **BANNED** |
| `gsap` + ScrollTrigger | 46.0KB | **23.0%** | **BANNED** |
| `framer-motion` (old name) | 62.3KB | 31.2% | **BANNED** |
| `motion` (barrel import) | 45.6KB | 22.8% | **BANNED** |
| `motion` tree-shaken component | 34.0KB | 17.0% | **BANNED** |
| `LazyMotion` + `domAnimation` | 19.6KB | 9.8% | Admin origin only, async-loaded, §14.5 |
| `lenis` | 5.5KB | 2.7% | **BANNED — for frames, not bytes** |
| `recharts` (shadcn Chart) | 144KB | **72.0%** | **BANNED** |
| `lucide-react` | grows per icon | — | **BANNED — defeats the sprite** |
| React `<ViewTransition>` | **0KB** | 0% | **The default. Ships with React.** |
| CSS transitions on tokens | **0KB** | 0% | **The default.** |

Lenis is banned on a stronger ground than bytes: it moves scrolling from the compositor thread to the
main thread. On a 2GB Mali/Adreno Android, that converts every hydration long task into visible scroll
stutter. The INP row of the budget says it is held by *"no per-frame JS anywhere"* — which independently
disqualifies Lenis, ScrollTrigger, Motion's `layout`/`layoutId` props, and any `requestAnimationFrame`
loop, before bytes are discussed at all.

## 4.3 Why this is not a downgrade

Everything those libraries were bought for now ships natively:

| What you wanted a library for | What the platform gives you, at 0KB |
|---|---|
| Page/route transitions | React `<ViewTransition>` — works in Next 16.3.5 with **no config flag** |
| Shared-element morphs | View Transitions named groups (`view-transition-name`) |
| Scroll-triggered reveals | CSS scroll-driven animations (`animation-timeline: view()`) |
| Enter/exit animation of removed nodes | `@starting-style` + `transition-behavior: allow-discrete` |
| Modal / dialog | Native `<dialog>` + `showModal()` — browser-managed focus trap, better than any library wrapper for WCAG |
| Popover / dropdown / tooltip | The `popover` attribute + `popovertarget`, positioned with `anchor()` behind `@supports` |
| Accordion / disclosure | `<details>` / `<summary>` with `name=` for exclusivity — works with JS off |
| Carousel | CSS `scroll-snap` (Baseline, ~95%) |
| Charts | Hand-written SVG Server Components — **under 2KB total** vs Recharts at 144KB |
| Long list performance | `content-visibility: auto` + `contain-intrinsic-size` — the single largest low-end Android win available |

## 4.4 The resolution, stated as policy

> **The component library for this project is `Design/*.html`.**
> It is 254KB of hand-authored, reasoned, token-bound CSS across 12 finished pages. That is not a mockup —
> it is a design system that has already been built once. Your job is to port it, not to re-source it.

**shadcn/ui and Radix are read, not installed.** Open their source. Take their ARIA wiring, their
keyboard handling, their focus-management patterns — that knowledge is genuinely valuable and hard-won.
Then implement it against Subiza's markup and Subiza's tokens. Do not take their palette (`--background`
/ `--foreground` collide semantically with `--ground` / `--surface` / `--ink`), their `cva` + `clsx` +
`tailwind-merge` + `tw-animate-css` install chain, or their Chart component.

**The two exceptions that are installed** are justified individually in §7.1.

---

# PART 5 — NEXT.JS 16 CORRECTION SHEET

> Derived by reading `subiza/node_modules/next/dist/docs/` — 400+ files, the authoritative source for
> this install. **Your training data predates most of this.** Every row below is a trap that produces
> either a silent bug or a failed build.

## 5.1 The traps

| Your instinct says | Next 16.3.5 actually requires | Consequence if wrong |
|---|---|---|
| `middleware.ts`, edge runtime | **`proxy.ts`**, `export function proxy()`, **Node.js runtime only** — an `export const runtime` inside it **throws** | Auth layer silently never runs |
| `params` / `searchParams` are objects | **Promises. Always.** `await props.params`. The Next 15 sync shim is **fully removed** | Runtime error |
| `cookies()` / `headers()` / `draftMode()` sync | **`await cookies()`**, `await headers()` | Runtime error |
| `error.tsx` gets `reset` | **`{ error, retry }`** — `retry` stable since 16.3.0, re-fetches inside a Transition and preserves outer client state. `reset` only clears error state | Error recovery does not re-fetch |
| Add a `webpack` key to `next.config` | **Turbopack is the default for `dev` AND `build`.** A `webpack` key makes `next build` **FAIL by design** | Build fails |
| `revalidateTag('tag')` | **`revalidateTag(tag, profile)`** — two arguments. Use `'max'` for stale-while-revalidate, or `updateTag(tag)` in a Server Action for read-your-own-writes | Type error or wrong cache behaviour |
| `next lint` | **Removed.** So is the `eslint` key in `next.config`. Use the ESLint CLI with flat config | Command not found |
| `forwardRef` for DOM handles | **React 19 takes `ref` as a plain prop.** `forwardRef` is unnecessary | Needless wrapper, worse types |
| `experimental.ppr` / `dynamicIO` / `useCache` | **All gone.** One top-level **`cacheComponents: true`** replaces them | Config error |
| `export const dynamic` / `revalidate` / `fetchCache` | **Removed under `cacheComponents`** — they error | Build error |
| `<Image priority>` | **Deprecated.** Use `loading="eager"` + `fetchPriority="high"` on the one LCP image | Deprecation warning, and you probably have no raster hero anyway |
| Hand-write route prop types | **`typedRoutes` is stable.** `PageProps<'/route'>`, `LayoutProps<'/(app)'>`, `RouteContext<'/api/[id]'>` are **globally available generated types** | Missed type safety across four locales |
| Parallel route slots are optional | **Every slot needs a `default.tsx`**, including the implicit `children` slot | Build fails |
| Tailwind's `dark:` variant handles both | v4.3.3's default `dark` variant is **`@media (prefers-color-scheme: dark)` only** | `[data-theme=dark]` silently does nothing |

## 5.2 Things that are new and that you should actually use

- **`next/root-params`** — read the locale anywhere without prop-drilling: `import { lang } from 'next/root-params'; const l = await lang()`. Root param names must be valid JS identifiers, so `[lang]`, never `[lang-code]`.
- **`experimental.inlineCss: true`** — removes the render-blocking CSS round trip. The docs name exactly our case: first-time visitors on high-latency networks with small hand-authored CSS. **Set it on `apps/site` only** (first-time visitors, LCP-critical); leave it off on `studio`/`admin`, whose users return daily and benefit from a cached stylesheet. Same flag, opposite correct answers.
- **`useLinkStatus`** — pending nav state. The docs warn it introduces layout shift if it toggles an element's presence; render a fixed-size element and animate opacity instead, or it breaks the CLS ≤0.1 budget.
- **`next dev` writes to `.next/dev`, `next build` to `.next`** — they can run concurrently. Consequence: in `next.config.*`, `process.argv` no longer contains `'dev'` during `next dev`. Check `process.env.NODE_ENV === 'development'`.
- **The Next.js MCP server at `/_next/mcp`** while `next dev` runs — use it for compile checks without full builds.

## 5.3 Rules for this repo

1. **NEVER create `middleware.ts`.** Only `proxy.ts`, and always with a `matcher` — without one it runs on `_next/static`, `_next/image` and `public/`, which can block CSS, JS and images.
2. **NEVER read the theme cookie with `cookies()` in the root layout.** It opts the whole app out of static prerendering. Use the inline `<head>` script + `suppressHydrationWarning` pattern of §10.2.
3. **NEVER assume `global-error.tsx` inherits your theme or global CSS.** It renders its own document. Re-import the tokens and re-apply `data-theme` inside it, or users see an unthemed flash at the worst possible moment.
4. **Do NOT enable `cacheComponents: true` in Phase 1.** It changes the mental model substantially (dynamic by default, mandatory Suspense boundaries, removal of `dynamic`/`revalidate`/`fetchCache`). Build on the default model, measure on a real low-end Android, then adopt it deliberately in a later phase.
5. **NEVER delete the `<!-- BEGIN:nextjs-agent-rules -->` block from `AGENTS.md`.** `next dev` re-adds it; removing it only produces a permanently dirty tree. Commit it with your work.

---

# PART 6 — DEPENDENCY MANIFEST

## 6.1 Install — runtime

Short list. Every entry is justified. If you want to add a runtime dependency that is not here, you must
write the justification against the 200KB budget first and get it approved.

| Package | Why it earns its bytes |
|---|---|
| `next` 16.3.5, `react` / `react-dom` 19.2.8 | Already installed. Do not upgrade in this phase. |
| `next-intl` | Four locales. Chosen over Paraglide because our JS-disabled law makes this an RSC-first app, and `getTranslations` on the server ships **zero** catalogue to the client. Paraglide's tree-shaking only wins where client components exist — and ours barely do. |
| `@radix-ui/react-slot` (~1.8KB) | `asChild` polymorphism on `Button`/`ButtonLink`. The only Radix package installed. |
| ~~`input-otp`~~ **SUPERSEDED** | **Do not install.** Prompt 03 §3.2 reverses this: `input-otp` is a client component, so with JavaScript disabled the most important form in the product does not render — breaking this document's own law. Use a plain server-rendered `<input>` under six `aria-hidden` painted spans instead. Zero bytes, same SC 3.3.8 compliance. |
| `class-variance-authority` | Variant declaration for components with real variant matrices (`Button`, `Tag`, `Banner`). |

## 6.2 Install — dev only

`typescript` · `@types/*` · `eslint` 9 + `eslint-config-next` · `eslint-plugin-boundaries` ·
`dependency-cruiser` · `prettier` · `husky` + `lint-staged` · `vitest` + `@testing-library/react` ·
`@playwright/test` + `@axe-core/playwright` · `lucide-static` (sprite generation at build time — **never
shipped**) · `turbo` · `pnpm` workspaces.

## 6.3 Write yourself — do not install

| Instead of | Write | Size |
|---|---|---|
| `clsx` / `classnames` / `tailwind-merge` / `cn` | `packages/ui/src/lib/cx.ts` — an eight-line filter-and-join | ~150 bytes |
| `recharts` / `chart.js` / `tremor` | Hand-written SVG Server Components for the 7-bar week, the coverage ring, the sparkline | <2KB total |
| `lucide-react` | Build-time SVG sprite (§11) | 0 runtime bytes |
| `sonner` / toast libraries | The `.toast` component from the HTML, server-rendered | 0 |
| `zustand` / `redux` | RSC + URL search params. Server state is the server's. One `useSyncExternalStore` for the single live socket, later. | 0 |
| `react-hook-form` | `<form action={serverFn}>` + `useActionState` + `useFormStatus` | 0 |

## 6.4 BANNED — enforced by lint, not by review

```
framer-motion · motion · motion-one · animejs · gsap · @gsap/react · lenis
recharts · chart.js · d3 · tremor
lucide-react · react-icons · @heroicons/react · @fortawesome/*
@radix-ui/*  (except react-slot)  · @base-ui/react · @mui/* · antd · daisyui
bootstrap · normalize.css
```

Add this to the ESLint flat config as `no-restricted-imports` **and** to `dependency-cruiser` as a
forbidden rule, in every workspace. Three lines of config make the design law unforgeable by any future
contributor or agent session. That is the point — a rule enforced only by review decays the first time
someone is in a hurry.

## 6.5 Read the source, do not install

shadcn/ui · Radix UI · Base UI · React Aria · Material Design 3 (touch targets and motion sections only —
**reject its colour and elevation models outright**).

These are libraries of *knowledge*. Open them when you need to know how a combobox handles
`aria-activedescendant`, or what keyboard contract a menu owes. Then write ours.

---

# PART 7 — REPOSITORY ARCHITECTURE

## 7.1 Why a monorepo, and why three apps

The Flow Atlas is explicit: Studio and Admin are **separate origins with separate auth and separate
sessions**, *"because a bug that leaks admin capability into the tenant app is the kind of failure that
ends a company."*

Route groups plus host-sniffing in `proxy.ts` does not satisfy that. Next's own documentation says proxy
*"should not be used as a full session management or authorization solution"*, CVE-2025-29927 demonstrated
the layer is bypassable with a crafted header, and a single build means admin code sits in the same module
graph as public code. **Compile-time separation is the only real guarantee** — and it independently
protects the 200KB budget, because the marketing site then *physically cannot* import console JavaScript.

> **Recommendation to the founder:** register a second apex domain for the admin console
> (`subiza-ops.rw` or similar) rather than `admin.subiza.rw`. It defeats cookie-domain tricks, sibling
> subdomain takeover, and shared wildcard-certificate exposure in one move. It is the cheapest insurance
> available given the framing above.

## 7.2 The tree

```
subiza/
├── apps/
│   ├── site/                    subiza.rw — marketing, voice consent, data rights
│   │   ├── src/app/
│   │   │   ├── [lang]/
│   │   │   │   ├── layout.tsx           root layout, theme + motion scripts, fonts
│   │   │   │   ├── page.tsx             (Prompt 02)
│   │   │   │   ├── design-system/       ★ THE SHOWCASE — Phase 1 deliverable
│   │   │   │   ├── consent/[token]/     (Prompt 12) no account
│   │   │   │   └── data-request/        (Prompt 11) no account
│   │   │   ├── global-error.tsx         MUST re-import tokens + theme script
│   │   │   └── global-not-found.tsx
│   │   ├── proxy.ts                     locale negotiation only
│   │   └── next.config.ts               experimental.inlineCss: TRUE
│   │
│   ├── studio/                  app.subiza.rw — the business console
│   │   ├── src/app/
│   │   │   ├── (auth)/                  sign-in, sign-up, recovery   (Prompt 03)
│   │   │   └── (console)/
│   │   │       ├── layout.tsx           AppShell: rail | topbar | tabbar
│   │   │       ├── page.tsx             Home — the feed              (Prompt 12)
│   │   │       ├── conversations/       + /[id]                      (Prompt 13)
│   │   │       ├── agent/               behaviour|knowledge|voice|languages
│   │   │       ├── connections/         + /[channel]
│   │   │       ├── results/             ← NEVER "analytics"
│   │   │       ├── credit/
│   │   │       └── settings/
│   │   ├── proxy.ts                     session gate + locale
│   │   └── next.config.ts               inlineCss: FALSE
│   │
│   └── admin/                   separate origin — Phase 1 ships a shell only
│       └── src/app/(admin)/     operations, tenants, onboarding-ops, …
│
├── packages/
│   ├── ui/                      ★ THE DESIGN SYSTEM — Phase 1's main deliverable
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── tokens.css           VERBATIM from design-system.html
│   │   │   │   ├── theme.css            @theme inline aliases + @custom-variant
│   │   │   │   └── base.css             reset, focus ring, reduced-motion
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   ├── product/                 Subiza's own instruments (§13.4)
│   │   │   ├── states/                  StateBoundary + the eight states
│   │   │   ├── icons/
│   │   │   │   ├── sprite.svg           generated, 176 symbols
│   │   │   │   ├── names.generated.ts   IconName union, generated
│   │   │   │   └── Icon.tsx
│   │   │   └── lib/cx.ts
│   │   └── scripts/build-sprite.ts
│   │
│   ├── core/                    framework-free
│   │   ├── view-state.ts        ViewState<T> — the eight states
│   │   ├── ids.ts               branded TenantId, ConversationId…
│   │   ├── capabilities.ts      the 22×4 matrix, typed
│   │   └── format.ts            RWF, dates, durations, phone numbers
│   │
│   ├── i18n/                    next-intl config + message catalogues
│   ├── auth-tenant/             ← NEVER imported by apps/admin
│   ├── auth-staff/              ← NEVER imported by apps/site or apps/studio
│   ├── fixtures/                typed sample data. Dev + test only.
│   └── config/                  shared eslint / ts / prettier
│
├── turbo.json · pnpm-workspace.yaml · CONTEXT.md
```

**Note:** `packages/auth-tenant` and `packages/auth-staff` are separate packages and must not appear in
each other's dependents. The dependency graph is the primary control; the lint rule is the second; code
review is a distant third.

## 7.3 The layer ladder — reconciling Atomic Design with the App Router

The founder asked for atoms → molecules → organisms. That instinct is right, but Atomic Design's five
tiers only own three of themselves in a Next.js app, because **Next already owns the top two names**:

- Atomic's **"templates"** *is* Next's `layout.tsx`. (And `template.tsx` is a reserved Next filename that
  re-mounts on every navigation — **never** use it for atomic-design reasons.)
- Atomic's **"pages"** *is* Next's `page.tsx`.

So the real ladder has four rungs, and the composition body between a route and the design system needs
its own name — `views/` — because both FSD's `_pages` and Atomic's `pages` collide with Next:

```
  route     apps/*/src/app/**/page.tsx        thin. reads params, calls a view.
    │                                          NO markup beyond <Suspense> and the view.
    ▼
  view      apps/*/src/views/<Name>View.tsx    composition. knows the product.
    │                                          arranges organisms. owns the eight states.
    ▼
  feature   apps/*/src/features/<domain>/      domain logic, server actions, schemas
    │
    ▼
  ui        packages/ui/{atoms,molecules,organisms,product}
                                               domain-FREE. knows tokens, not Subiza.
```

### Import law

| Layer | May import | May NEVER import |
|---|---|---|
| `route` | view, feature, ui, core | another app's anything |
| `view` | feature, ui, core, i18n | route |
| `feature` | ui, core, i18n | route, view, another feature |
| `organism` | molecule, atom, core, icons | feature, view, route, i18n messages |
| `molecule` | atom, core, icons | organism, feature, view, route |
| `atom` | core, icons, `lib/cx` | **anything above it. An atom that imports a molecule is a defect.** |

> **The test for an atom:** could it ship in a different product, unchanged, if the tokens changed? If it
> says "conversation", "tenant" or "escalation" anywhere, it is not an atom. It is a product component
> and belongs in `packages/ui/src/product/`.

### Enforcement

Configure `eslint-plugin-boundaries` with one element type per rung and a rule set mirroring the table
above (fast, runs in the editor). Configure `dependency-cruiser` for the same rules plus cycle detection
and cross-package violations (thorough, runs in CI). **Then write a test that proves the enforcement
works:** commit a deliberately illegal import on a branch, confirm CI fails, revert. An unverified lint
rule is a comment.

Write the four-rung ladder into `AGENTS.md` so every future agent session builds the same shape.

## 7.4 Scaffold migration

The existing `subiza/` app becomes `apps/studio`. Do this **before the second screen exists** —
retrofitting a monorepo after ten screens is a week you will not get back.

1. `git init` at the repo root if absent, and commit the current state first.
2. Move `subiza/*` → `apps/studio/`. Create `apps/site`, `apps/admin`, `packages/*`.
3. Create `pnpm-workspace.yaml` and `turbo.json`.
4. **Delete `apps/studio/src/app/globals.css`** and `apps/studio/public/*.svg` (the Vercel/Next demo art).
5. Update `tsconfig.json`: `target` ES2017 → **ES2022**, `allowJs` true → **false**, plus the strict flags
   in §8.5. Verify `next build` still typechecks — the Next scaffold ships `allowJs: true` defensively.
6. Keep `AGENTS.md` and its generated block. Add the four-rung ladder and the banned-dependency list to it.

---

# PART 8 — TYPES, STATE AND THE PERMISSION MATRIX

## 8.1 `ViewState<T>` — the eight states as a type

Build this **before the first data-bearing component**. The requirement is that every screen carries all
eight states; if the union exists first, the requirement is satisfied by construction. If it arrives
later, satisfying it means touching every view.

A discriminated union over the eight states of §3.2, carrying exactly the data each state needs and
nothing more:

- `loading` — no payload
- `empty` — no payload; the *component* owns the copy and the single action
- `ready` — `{ data: T }`
- `partial` — `{ data: T; missing: string[] }` — *what* is missing, in plain language
- `offline` — `{ queued: number }`
- `denied` — `{ requiredCapability: Capability; whoCan: RoleId[] }` — never a bare "forbidden"
- `notFound` — `{ what: string; goInstead: { href: string; label: string } }`
- `rateLimited` — `{ retryAfterMinutes: number }`
- `error` — `{ digest?: string }` — the digest is for support, **never** the primary message

`StateBoundary<T>` in `packages/ui/src/states/` consumes the union and renders the correct component. It
takes a `renderReady` prop and nothing else is optional — a caller cannot forget a state, because the
exhaustive `switch` will not compile if a case is missing. That is the whole point of using a union here.

## 8.2 Fidelity — the 2G mode

The 2G mode is a **designed state** and it is *orthogonal* to the eight states, not a ninth one. Model it
as `Fidelity = 'full' | 'lite'`, set server-side from the `Save-Data` header and a measured connection
threshold, provided via context.

At `lite`: no avatars, no sparklines, no waveform, no `<ViewTransition>` wrappers, transitions capped at
`--t-micro` colour changes only. **Audio is never preloaded at any fidelity.**

## 8.3 Branded IDs

`TenantId`, `ConversationId`, `MemberId`, `ChannelId`, `VoiceId` as branded string types in
`packages/core/src/ids.ts`. This is a multi-tenant product where passing the wrong ID to the wrong query
is a data-leak class of bug; the compiler should refuse it. Branding costs nothing at runtime.

## 8.4 Runtime validation

Use **zod** where a runtime boundary exists (server action inputs, fixture parsing, env vars). Prefer
`z.infer` over hand-written duplicate types. Keep zod **server-side**; if a schema ever needs to reach the
client, that is a signal the validation belongs in a server action instead.

## 8.5 TypeScript strictness

Beyond `strict: true`, enable — on an empty codebase these are free; on a sixty-screen codebase each one
is a dedicated PR:

`noUncheckedIndexedAccess` · `exactOptionalPropertyTypes` · `verbatimModuleSyntax` ·
`noImplicitOverride` · `noFallthroughCasesInSwitch` · `noPropertyAccessFromIndexSignature` ·
`useUnknownInCatchVariables` · `forceConsistentCasingInFileNames`

Type every route with the generated helpers from day one:
`export default async function Page(props: PageProps<'/conversations/[id]'>)`. Enable `typedRoutes` so
every locale route is checked. Wire `next typegen && tsc --noEmit` as the CI typecheck step.

## 8.6 The capability matrix, typed

`packages/core/src/capabilities.ts` encodes the Flow Atlas permission model as **data, not conditionals**:
22 business capabilities × 4 tenant roles (Owner A5, Manager A6, Agent A7, Viewer A8), and separately 16
admin capabilities × 9 staff roles.

Grades are not boolean — the atlas specifies four: `full` · `scoped` (with a discriminator such as
`'connect only'`, `'pause only'`, `'assigned + escalated'`, `'own'`) · `readonly` · `none`.

Declare it with `satisfies Record<RoleId, readonly Capability[]>` so that adding a 23rd capability or a
fifth role **fails the build** until the matrix is filled in. That turns a permissions spreadsheet into a
compiler obligation.

Three rules the atlas defends explicitly, which must be visible in the data and covered by a unit test:

- **Only the Owner may initiate voice cloning** — never a Manager. It creates a legal artefact naming a
  third party and processes biometric data under Law 058/2021.
- **A Manager may connect a channel but never disconnect one.** Connecting is recoverable; disconnecting
  silently stops customer messages reaching the business — the worst failure this product has.
- **Any staff member may pause the AI; only Owner or Manager may resume.** The kill switch (G9) is
  universal; restarting is a configuration decision.

Phase 1 ships the matrix *typed and tested*. Enforcement against real sessions arrives with Prompt 03.

---

# PART 9 — TOKEN ARCHITECTURE

## 9.1 The prime directive

> **Transcribe. Do not translate.**
>
> `packages/ui/src/tokens/tokens.css` is a **verbatim copy** of the three token blocks from
> `Design/design-system.html` (lines 13–139). Not a reinterpretation. Not "cleaned up". Not converted to
> `oklch`. Not rounded. Every hex, every `rgba()`, every `clamp()` expression exactly as authored.
>
> Then write an automated test that extracts every `--*` declaration from both files and asserts the sets
> and values are identical. That test is the reason this system stays trustworthy for the next two years.

Every value below has a reason, and most reasons are written in the `.why` blocks of the source file.

## 9.2 Light theme — `:root`

**Ground & surface**
```
--ground:#FAF9F4       warm paper. never pure white
--surface:#FFFFFF
--surface-2:#F2F1EA    sunken: inputs, wells, code
--surface-3:#EAE9E0    hover on surface-2
--overlay:rgba(20,21,15,.42)
```

**Ink** — the contrast ratio of each against `--ground` is recorded, and `--ink-3` is the floor:
```
--ink:#14150F      17.4:1
--ink-2:#4A4C42     8.3:1
--ink-3:#6E7063     4.8:1  ← the floor. NOTHING lighter carries text.
--ink-inv:#FAF9F4
```

**Hairlines** — this system draws with lines, not shadows:
```
--rule:rgba(20,21,15,.09)  --rule-2:rgba(20,21,15,.16)  --rule-3:rgba(20,21,15,.28)
```

**Signal — the lime. A FILL. NEVER A TEXT COLOUR.**
```
--signal:#C6F24E       1.2:1 on ground — unusable as text, BY DESIGN
--signal-hi:#D3F86B    hover
--signal-lo:#B3E033    pressed
--signal-ink:#14150F   14.2:1 on signal — what sits ON the lime
--signal-soft:#EEF9CE  the wash: selected rows, soft callouts
--signal-edge:#D6E9A0
--signal-text:#3D5C10  7.3:1 — the ONLY green allowed to be text
```
> White on lime is 1.4:1. If a surface is lime, the thing on it is near-black. There is no exception.

**Panel — the deep surface. Inverted regions, not dark mode:**
```
--panel:#1C2A12  --panel-2:#26361A  --panel-ink:#FFFFFF  (15.1:1)
--panel-ink-2:#B9C7A6  --panel-rule:rgba(255,255,255,.14)
```

**Status**
```
--ok:#3D5C10    --ok-fill:#C6F24E    --ok-soft:#EEF9CE   --ok-edge:#D6E9A0
--warn:#7A5300  --warn-fill:#F0B840  --warn-soft:#FCF0D6 --warn-edge:#EFD9A4
--risk:#A6311D  --risk-fill:#C4442E  --risk-soft:#FBE7E2 --risk-edge:#F0C4B9
--info:#2C4A6B  --info-fill:#5B87B8  --info-soft:#E4EDF6 --info-edge:#C0D5E8
--live:#C4442E   the on-air dot. red because a call is live
```

**Type**
```
--f-display:'Bricolage Grotesque','Bricolage Grotesque Fallback',Georgia,serif
--f-body:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif
--f-mono:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace

--t-d1:clamp(2.6rem,1.6rem + 4.4vw,4.75rem)
--t-d2:clamp(2.1rem,1.45rem + 2.9vw,3.5rem)
--t-h1:clamp(1.7rem,1.3rem + 1.8vw,2.5rem)
--t-h2:clamp(1.35rem,1.15rem + .9vw,1.75rem)
--t-h3:1.125rem   --t-h4:1rem      --t-body-l:1.0625rem
--t-body:.9375rem --t-body-s:.875rem --t-cap:.8125rem --t-label:.6875rem
```

**Space — 4px base, fourteen steps.** *"Nothing in the product uses a value that is not on this scale —
not one `padding:15px` anywhere."*
```
--s-1:2   --s-2:4   --s-3:6   --s-4:8   --s-5:12  --s-6:16  --s-7:20
--s-8:24  --s-9:32  --s-10:40 --s-11:56 --s-12:72 --s-13:96 --s-14:128   (px)
```
Applied: chip/tag `--s-2/--s-4` · input/button horizontal `--s-5` · inside a card `--s-7` · between cards
in a grid `--s-5` (tight — the hairline already separates) · heading to body `--s-5` · between
sub-sections `--s-11` · between top-level sections `--s-13`, dropping to 64px below 560 · page gutter
40 → 24 → **20 at 360**.

**Radius — three steps, each meaning something different.** *"Uniform rounding is the fastest way to make
an interface look generated."*
```
--r-sm:4px    DATA     inputs, chips, tags, table cells. Things holding literal values stay sharp.
--r-md:12px   OBJECTS  cards, banners, sheets, modals. Things you pick up and move.
--r-lg:24px   MOMENTS  the hero, the live call card, media. RESERVED. If everything is 24, nothing is.
--r-pill:999px          not a fourth step but a shape: buttons, chips, meters read as pressable.
```

**Elevation — four levels, three with no shadow.** An element earns a shadow only if it is *genuinely
floating over* content the user was just looking at — true of menus, toasts and modals, and of nothing
else.
```
--e-0:none
--e-1:none                                   hairline only — THE DEFAULT
--e-2:0 1px 2px rgba(20,21,15,.05)           raised, still grounded
--e-3:0 6px 16px -4px rgba(20,21,15,.10),0 2px 4px rgba(20,21,15,.05)      menus
--e-4:0 24px 48px -12px rgba(20,21,15,.20),0 8px 16px -8px rgba(20,21,15,.10)  modal
```
> **Why lines beat shadows here.** A soft shadow relies on the display resolving a 4% alpha gradient. On
> the TN and low-end IPS panels this product is mostly read on — often at low brightness to save battery —
> that gradient collapses to nothing and the card loses its edge entirely. A 1px hairline at 9% alpha
> survives every panel, every brightness and every angle.

**Motion — ceiling 300ms, exits ~20% faster than entries**
```
--t-micro:120ms  hover, focus, colour, press
--t-ui:200ms     expand, reveal, reorder, toggle
--t-panel:280ms  sheets, drawers, modals
--t-exit:160ms   every dismissal
--e-out:cubic-bezier(.22,1,.36,1)
--e-in:cubic-bezier(.55,0,1,.45)
--e-inout:cubic-bezier(.65,0,.35,1)
--e-spring:linear(0,.42 8.7%,.75 17.5%,.96 25.4%,1.06 32.1%,1.09 39.3%,1.06 47.5%,1.01 60.2%,.99 76.2%,1)
```
`--e-spring` is applied to **exactly one thing in the entire product: the toggle knob.** Do not spread it.

**Layout** — `--nav-w:264px` · `--measure:70ch`

## 9.3 Dark theme

Declared **twice, deliberately** — once for the system preference, once for the explicit toggle. **No hex
is ever inverted; these are separately authored values.**

```
--ground:#0D0F0A  --surface:#15180F  --surface-2:#1D2115  --surface-3:#262B1D
--overlay:rgba(0,0,0,.62)
--ink:#F2F3EC  --ink-2:#A9AC9E  --ink-3:#8A8D80  --ink-inv:#14150F
--rule:rgba(255,255,255,.10)  --rule-2:rgba(255,255,255,.17)  --rule-3:rgba(255,255,255,.30)
--signal:#CDF459  --signal-hi:#DBF97E  --signal-lo:#B2DC38  --signal-ink:#14150F
--signal-soft:#252E12  --signal-edge:#3B4A1D  --signal-text:#A8D65C
--panel:#1D2115  --panel-2:#262B1D  --panel-ink:#F2F3EC  --panel-ink-2:#A9AC9E
--panel-rule:rgba(255,255,255,.12)
--ok:#A8D65C    --ok-fill:#CDF459    --ok-soft:#252E12   --ok-edge:#3B4A1D
--warn:#F0B840  --warn-fill:#F0B840  --warn-soft:#302512 --warn-edge:#4D3C17
--risk:#F08268  --risk-fill:#C4442E  --risk-soft:#331812 --risk-edge:#54281D
--info:#8FB6DE  --info-fill:#5B87B8  --info-soft:#141F2B --info-edge:#24384C
--live:#F08268
--e-2:0 1px 2px rgba(0,0,0,.4)
--e-3:0 6px 16px -4px rgba(0,0,0,.5),0 2px 4px rgba(0,0,0,.3)
--e-4:0 24px 48px -12px rgba(0,0,0,.6),0 8px 16px -8px rgba(0,0,0,.4)
```

Structure of `tokens.css` — exactly three blocks, in this order:

1. `:root { … }` — the full light set (every token declared)
2. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` — only what changes
3. `:root[data-theme="dark"] { … }` — the same overrides again

The guard in block 2 is what lets an explicit `light` choice beat the OS preference. Block 3 is what lets
an explicit `dark` choice beat an OS `light` preference. Both are required; neither is redundant.

## 9.4 Mapping into Tailwind v4 — and the four traps

Tokens stay in `tokens.css` as plain custom properties. A **single `@theme inline` block** in `theme.css`
aliases them into Tailwind's namespaces so both `var(--ink)` and `text-ink` work.

### Trap 1 — `@theme inline`, never bare `@theme`

Bare `@theme` emits `--color-ground: var(--ground)` into `:root`, where it is resolved **once** and
inherited as a computed value. Any subtree that redefines `--ground` — our inverted `--panel` regions, a
scoped `[data-theme]` on a section — will **not** update. `inline` changes how utilities substitute and
is the only correct form here. This is not a style preference; getting it wrong silently breaks the
inverted panels.

### Trap 2 — never define `--spacing-*` keys

The spacing utility resolves a **named** theme key before the bare-number fallback. Defining
`--spacing-4: var(--s-4)` would silently change `p-4` from 16px to **8px** and corrupt every class string
in the codebase. All fourteen of our steps already land on the default 0.25rem grid
(0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 14, 18, 24, 32). **Leave `--spacing` alone entirely.**

### Trap 3 — never use opacity modifiers

`bg-signal/50`, `border-ink/20` compile to `color-mix(in oklab, …)`, unsupported below Chrome 111, where
it produces a **dropped declaration, not a fallback**. The design system already ships pre-mixed literals
(`--rule`, `--signal-soft`, `--ok-soft`) precisely so no runtime mixing is ever needed. Use them.

### Trap 4 — the `dark:` variant does not do what you think

v4.3.3's default `dark` variant is `@media (prefers-color-scheme: dark)` **only** — it ignores
`[data-theme]` entirely. Redefine it with `@custom-variant dark`, in block form with `@slot`, emitting
**both** arms: the media arm guarded by `:root:not([data-theme="light"])`, and the `[data-theme="dark"]`
arm, both wrapped in `:where()` to keep specificity flat.

Then add a lint rule that **fails CI on any `dark:` applied to a colour utility**. The aliased token layer
already flips both themes from one declaration; a `dark:` colour utility duplicates the rule, roughly
doubles emitted CSS for it, and re-introduces the per-hex inversion the law forbids. Reserve `dark:` for
structural properties only.

### What goes in the `@theme inline` block

Open with `--color-*: initial;` and `--breakpoint-*: initial;` to clear Tailwind's defaults, then:
~40 `--color-*` aliases · 3 `--font-*` · 11 `--text-*` (with `--line-height` / `--letter-spacing`
sub-keys on the display sizes) · 4 `--radius-*` including `--radius-pill` · 5 `--shadow-e0`…`e4` ·
4 `--ease-*` · 4 `--transition-duration-*` · 3 `--breakpoint-*` · `--container-measure`,
`--container-nav`.

**Never** set `--container-*: initial` — that namespace feeds both the `@sm:` container-query variants
*and* the `max-w-*` utilities, and resetting it destroys `max-w-md` and its siblings.

### Breakpoints — 360 is the base, not a breakpoint

```
--breakpoint-*: initial;
--breakpoint-sm: 35rem;      /*  560 */
--breakpoint-md: 53.75rem;   /*  860 */
--breakpoint-lg: 67.5rem;    /* 1080 */
```
An unprefixed utility **is** the 360 design. Adding a 360 breakpoint inverts the mobile-first model. Do
not mix units — Tailwind sorts breakpoints numerically and mixed units produce wrong cascade order.

### Two more Tailwind v4 defaults that will bite

- `border-*` and `divide-*` default to **`currentColor`** in v4. A bare `border` paints the *text* colour,
  not a hairline. Always pair with `border-rule`, or set a base rule.
- The bare `transition` utility animates a long property list including `filter` and `backdrop-filter` —
  neither of which is compositor-cheap on entry-level Android. Always scope:
  `transition-[transform,opacity]`.

### `globals.css` assembly order

```
@layer theme, base, components, utilities;
@import "tailwindcss";
@import "../tokens/tokens.css";     ← verbatim
@import "../tokens/theme.css";      ← @theme inline + @custom-variant dark
@import "../tokens/base.css";       ← reset, focus ring, ::selection, reduced-motion
```

The `prefers-reduced-motion` block must stay **unlayered and `!important`** (as authored). Unlayered rules
beat layered ones, so this is what guarantees it wins over Tailwind utilities.

### The browser-floor gate

Tailwind 4.3.3 hardcodes Lightning CSS targets to Chrome 111 / Firefox 128 / Safari 16.4 in
`@tailwindcss/node`, with **no browserslist hook and no fallback mode**. Below Chrome 111, `color-mix()`,
`@property`, `oklch()` and `:has()` degrade silently.

This collides directly with "mid-range and low-end Android". **Phase B2 must measure the real floor**
using Statcounter Rwanda data plus a physical device check on a sub-$120 Tecno / Itel / Infinix, and
record the result in `CONTEXT.md`. If the floor is below Chrome 111, the documented escape is Tailwind
v3 via `node_modules/next/dist/docs/01-app/02-guides/tailwind-v3-css.md`, or dropping Tailwind for CSS
Modules over the same `tokens.css`. **`tokens.css` is the source of truth either way**, which is exactly
why this decision is safe to gate rather than guess.

---

# PART 10 — THEMING

## 10.1 Three states, not two

`light` · `dark` · `system` (the default). `system` removes the attribute entirely and lets the media
query decide; the other two stamp `data-theme` on `<html>`. Persisted in `localStorage` under
**`subiza-theme`**, inside `try/catch` — private mode and blocked site data must not throw.

## 10.2 The no-flash script

A **blocking inline `<script>` in `<head>`** — not at the end of `<body>`, where the reference
implementation put it, because that risks a visible flash of the wrong theme. It reads `localStorage`
inside `try/catch` and stamps `document.documentElement.dataset.theme` before first paint. Put
`suppressHydrationWarning` on `<html>`.

This is **the one component in the product allowed to require JavaScript**, and it is named as such in the
performance law. Because the default is `system`, the no-JS path still themes correctly — it simply cannot
be overridden. That is the right failure mode.

**Do not read the theme from a cookie in the root layout.** `cookies()` opts the entire app out of static
prerendering.

## 10.3 The motion preference — structural twin of the theme

Build `data-motion` on `<html>` with exactly the same shape: three states (`full` · `reduce` · `system`),
its own blocking `<head>` script, its own `localStorage` key (**`subiza-motion`**), and token redefinition
in the same three places — bare `:root`, `@media (prefers-reduced-motion: reduce) { :root:not([data-motion="full"]) }`,
and `:root[data-motion="reduce"]`.

Why an in-app override at all: OS-level reduced motion is a blunt, device-wide setting many users never
find. A product that loops a waveform and a live dot owes its users a local switch. This becomes the
**second and last** JS-requiring control in the product.

**Two things every agent gets wrong here:**

1. `::view-transition-*` pseudo-elements live on the **root's pseudo tree, not inside the page**. A
   wrapper element's `data-motion` will never reach them. They need their own
   `:root[data-motion="reduce"]::view-transition-*(*)` rules plus the `@media` twin.
2. Any JS animation library's own `useReducedMotion()` reads **only the OS setting** and will never see
   the in-app override. Write one SSR-safe `useMotionPreference()` hook resolving both the
   `MediaQueryList` and the stored override, and pass the resolved value explicitly. At `reduce`, an
   `Element.animate()` call site must **skip creation entirely**, not merely shorten the duration.

## 10.4 The panel is not dark mode

`--panel` is an **inverted region inside the light theme** — the live call card, certain feature blocks.
It is not related to dark mode and must not be implemented via the dark theme. It has its own ink and rule
tokens (`--panel-ink`, `--panel-ink-2`, `--panel-rule`) precisely so that a panel region is correct in
*both* themes without any conditional logic.

This is also the reason `@theme inline` is mandatory (§9.4 Trap 1) — a panel subtree redefines tokens, and
bare `@theme` would freeze them at `:root`.

---

# PART 11 — ICONS

One set: **Lucide**, ISC-licensed, no attribution required. Inlined as an **SVG sprite of 176 symbols** —
no icon font, no runtime, no network request. Stroke is **1.75**, not Lucide's shipped 2, *"because at
16px a 2px stroke fills the counters and the glyph turns into a blob."*

## 11.1 The pipeline

`packages/ui/scripts/build-sprite.ts`, run at build time:

1. Read the canonical list of 176 names. The existing sprite in `Design/design-system.html` is the source
   — extract every `<symbol id="i-*">`. `Design/assets/icons/lucide.json` (73KB) is a convenient
   pre-extracted map.
2. Pull each glyph from `lucide-static` (dev dependency, **never shipped**).
3. Normalise `stroke-width` to **1.75**, strip per-glyph `class`, `width`, `height`; keep `viewBox`,
   `fill="none"`, `stroke="currentColor"`, and the round linecap/linejoin.
4. Emit `sprite.svg` as one `<svg>` of `<symbol>` elements.
5. Emit `names.generated.ts` exporting `IconName` as a **union of the 176 real symbol ids**, so a typo is
   a compile error rather than an invisible empty box.

## 11.2 Usage

`<Icon name="phone-call" />` renders `<svg><use href="#i-phone-call"/></svg>`. Ship `sprite.svg` as an
immutable-cached asset, and **inline only the ~8 above-the-fold shell icons** into the document to avoid a
round trip before first paint.

**NEVER install `lucide-react`.** It ships one React component per icon, which defeats both the sprite and
the above-the-fold budget.

## 11.3 Sizing law

| Context | Size | Rule |
|---|---|---|
| Inline with body text | 15px | Optically aligned, never baseline-aligned |
| In a button | 17px (15 small, 19 large) | Leading icon for a category, trailing arrow for a destination — **never both** |
| Navigation | 16px @ 75% opacity, 100% active | Opacity, not a second colour |
| Feature / empty state | 19–24px in a 38–42px tile | Tile takes the colour, icon stays `currentColor` |
| Icon-only control | any | **MUST** carry `aria-label`, and a **48×48** hit area regardless of glyph size |

## 11.4 No stock illustration. At all.

> The obvious move for a young product is a set of flat vector people from unDraw or Storyset. It was
> researched and rejected: ElevenLabs, Sierra, Retell and Vapi all use zero stock vector people, because
> the moment a reader recognises the illustration pack, the product looks **assembled rather than built**.
> Subiza's visual interest comes from **its own instruments** — the waveform, the transcript, the
> dial-code card, the coverage ring. Those are things no other product could use.

Empty-state art is original SVG, authored per state. `unDraw`, `Storyset`, `Humaaans` and `Open Peeps` are
rejected — their licences are fine; the rule is aesthetic.

---

# PART 12 — TYPOGRAPHY

Three families, all OFL 1.1, all **self-hosted via `next/font/local`**:

| Family | Role | Notes |
|---|---|---|
| **Bricolage Grotesque** | `--f-display` | Variable, with `opsz`. Headings set optical size per level: h1 40, h2 28, h3 18, h4 14 |
| **Plus Jakarta Sans** | `--f-body` | Body, UI. `font-feature-settings: "cv05" 1, "ss01" 1` |
| **JetBrains Mono** | `--f-mono` | Numbers, codes, timestamps, the forwarding string, labels |

**Drop the two `fonts.googleapis.com` `<link>` tags** from the design reference. They cost two extra
DNS + TLS round trips before first text paint — unacceptable on 3G. `next/font/local` self-hosts and
eliminates them.

**Subset to the Latin range the four languages actually need.** Kinyarwanda and Swahili use plain Latin;
French needs the accented set. Mono can be subset to digits + basic Latin. **Preload only the body
regular** — the budget allows two variable fonts above the fold, not six weights.

**CLS:** `font-display: swap` with a **metric-matched fallback**. The design system names
`'Bricolage Grotesque Fallback'` in the stack for exactly this reason — generate it with
`next/font`'s `adjustFontFallback`, or declare it manually with matched `size-adjust`, `ascent-override`
and `descent-override`. An unmatched fallback is the most common way to blow a CLS ≤0.1 budget.

Headings carry `letter-spacing: -.022em`, `line-height: 1.12`, and **`text-wrap: balance`**. Body prose
uses `text-wrap: pretty` and is capped at `--measure` (70ch).

---

# PART 13 — COMPONENT INVENTORY

Every CSS class in `Design/design-system.html`, assigned a layer and an owner. **This is the Phase 1
checklist** — each row needs a file path before criterion 6 can be ticked.

## 13.1 Atoms — `packages/ui/src/atoms/`

Domain-free. Could ship in another product if the tokens changed.

| Component | Source classes | Notes |
|---|---|---|
| `Button` / `ButtonLink` | `.btn` `.btn-primary` `.btn-solid` `.btn-secondary` `.btn-ghost` `.btn-danger` `.btn-sm` `.btn-lg` `.btn-icon` `.btn-block` `.btn-load` | **Two components, one `cva` recipe.** Navigation is `<a href>`, mutation is `<form>`. This makes the no-JS contract explicit at the API surface. Loading keeps the label so width never jumps. `:active{transform:translateY(1px)}` |
| `Chip` | `.chip` | `aria-pressed`. Optional `.ct` count |
| `Tag` | `.tag` `.tag-ok` `.tag-warn` `.tag-risk` `.tag-info` | Mono, uppercase, `--r-sm` |
| `StatusDot` | `.dot` `.dot-ok` `.dot-warn` `.dot-risk` `.dot-live` | **Shape as well as colour** — ok is a circle, warn a square, risk a triangle. Never colour-only (1.4.1) |
| `Input` / `Textarea` | `.inp` `.inpwrap` `.field` `.hint` `.err` | `aria-invalid`, real `<label>` |
| `Toggle` | `.tgl` | The **only** user of `--e-spring` |
| `Icon` | — | `<use href>` + generated `IconName` |
| `Skeleton` | `.sk` | Must match final dimensions (CLS) |
| `Meter` | `.meter` | Pill |
| `Eyebrow`, `Label`, `Hint` | `.eyebrow` `.hint` | |
| `VisuallyHidden` | — | |

## 13.2 Molecules — `packages/ui/src/molecules/`

| Component | Source classes | Notes |
|---|---|---|
| `PhoneField` | `.phonefield` `.cc` | Country code is a **real control**, not decoration |
| `OtpField` | `.otp` `.slot` | **One input, six painted slots.** See §16.4 |
| `ChoiceCard` | `.choice` `.cbody` `.cico` `.cmark` | A radio you can hit on a phone |
| `Card` | `.card` `.card-i` `.card-hd` `.card-bd` `.card-ft` `.card-link` | |
| `Stat` | `.stat` `.stat-key` | **Container query** — two-up at small, key stat spans both |
| `Banner` | `.banner` `.banner-ok/warn/risk/info` | Carries states 4, 7, 8 |
| `Toast` | `.toast` | `aria-live="polite"`, must not steal focus |
| `Empty` | `.empty` | **Original art + one action.** Carries states 2, 5, 6 |
| `RowList` / `RowItem` | `.rowlist` `.rowitem` | **The small form of a data table** — redesign register |
| `Dropdown` | `.dd` `.ddc` | `popover` attribute; `<details>` fallback |
| `Table` | `.tbl` `.tblwrap` | ≥560 only. Below that it **becomes** `RowList` |
| `CodeBlock` | `.codeblk` | |
| `Sparkline` / `Bars` / `Ring` | `.spark` `.bars` `.ring` | **Hand-written SVG Server Components, <2KB total.** Not a chart library |

## 13.3 Organisms — `packages/ui/src/organisms/`

| Component | Source classes | Notes |
|---|---|---|
| `AppShell` | `.applayout` `.appnav` `.appbody` `.tabbar` `.topbar` | **The redesign, not the reflow.** Rail of 7 (journey order) ↔ tab bar of 4 + More (frequency order). See §15.2 |
| `Sheet` / `Modal` | `.sheet` `.modal` | Native `<dialog>` + `showModal()`. **Bottom sheet at 360, centred dialog at ≥560** |
| `Drawer` | `.nav` | Persistent at ≥860 |
| `ThemeSwitch` | `.themebar` `.sw` | Three-state. JS-requiring, by exception |
| `MotionSwitch` | — | New. Structural twin of the above |
| `StateBoundary` | — | Renders the eight states from `ViewState<T>` |

## 13.4 Product objects — `packages/ui/src/product/`

Subiza's own instruments. These are the reason the product does not look assembled. **Highest craft bar
in the phase.**

| Component | Source classes | The thing that must not be lost |
|---|---|---|
| `LiveCallCard` | `.callcard` `.cc-top` `.cc-live` `.cc-time` `.cc-who` `.cc-av` `.cc-acts` | The one place a dark panel, `--r-lg`, and a loop are **all** permitted at once. At 360: two actions collapse to **one** — "Take the call" — and the caller-history line drops |
| `Waveform` | `.wave` | **28 `<i>` elements and one `@keyframe`.** No canvas, no audio API, no library, no per-frame JS. Under 300 bytes. It is an *alive* indicator and does **not** pretend to visualise real audio — the truthful information sits in text beside it. Stops completely under reduced motion |
| `Transcript` | `.tscript` `.turn` `.tav` `.tb` `.tmeta` `.tt` `.torig` `.tmark` `.conf` | **Original language is always the primary line; translation sits beneath.** Inverting it would tell a Kinyarwanda speaker their language is the footnote — and the transcript is a legal record of what was actually said. Confidence is **three bars and a word** (Clear / Partly clear / Unclear), never a percentage. Ordered list in the DOM |
| `ChannelTile` | `.chan` `.chan-ph/wa/tg/ig` `.cico` `.cmeta` | Four states, each expressed as **what the customer experiences**, never as a token or webhook. Not connected uses a **dashed** border. Disconnected states the consequence first, then one button |
| `ForwardingCodeCard` | `.fcode` `.fcode-h/b/s/n/a/plat` | **Copy is the primary action** — a correction. On iPhone, MMI codes in a `tel:` link fail *silently*; on Android the link only pre-fills. **The off-switch (`##61#`) is shown at the same moment as the on-switch.** Only the tenant's own number is highlighted; `**61*` and `*11*20#` stay plain |
| `EscalationLadder` | `.ladder` `.rung` | Live during an escalation; configuration surface in Settings |
| `CreditCard` | `.credit` `.credit-top/v/ft` | **Amber below 20%, red below 5%** |
| `WhatsAppBubble` | `.wabub` `.wamsg` `.wamsg-h` `.wamsg-b` | The weekly report. *"Designing the WhatsApp bubble is designing the product"* — under 60 words, leads with a business outcome, names one honest weakness, exactly one link |
| `PhoneFrame` | `.phone` `.phone-top` `.phone-bd` | Showcase/marketing only |

## 13.5 Documentation chrome — showcase route only

`.shell` `.wrap` `.sec` `.seclab` `.sub` `.why` `.demo` `.demo-lab` `.demo-row` `.grid` `.g2` `.g3` `.g4`
`.docint` `.spec` `.cq` `.anchors` `.pgtop` `.h0` `.brand` `.mark` `.navgrp` `.navver` `.tmark`

These belong to `apps/site/src/views/DesignSystemView/`, **not** to `packages/ui`. They are how the system
documents itself, not part of the system.

---

# PART 14 — MOTION

## 14.1 What motion is for

> Motion in Subiza does exactly two jobs: **it shows where a thing came from, and it shows that something
> is alive.** It never decorates and it never delays. The ceiling is **300ms** — beyond that a transition
> stops feeling like physics and starts feeling like waiting.

## 14.2 The five-tier ladder

| Tier | Technology | Cost | Where |
|---|---|---|---|
| **0 — default** | CSS transitions on motion tokens + React `<ViewTransition>` | **0KB** | **Every route in every app.** This is the answer unless proven otherwise |
| 1 | CSS scroll-driven animations (`animation-timeline: view()`) | 0KB | `apps/site` marketing routes only, behind `@supports` **and** `prefers-reduced-motion: no-preference` |
| 2 | `@starting-style` + `transition-behavior: allow-discrete` | 0KB | Enter/exit of popovers, dialogs, toasts |
| 3 | Native `Element.animate()` (WAAPI), hand-written | ~0KB | Only where 0–2 genuinely cannot express it. Requires justification |
| 4 | `m` + `LazyMotion` async `domAnimation` | 19.6KB deferred | **`apps/admin` only.** Staff, desktop, good connection. Never in the entry graph. `domMax` stays banned |

Tiers 0–2 cover every animation in all twelve designed screens. Tier 4 has no current use case and exists
only so the answer to "what if we truly need it later" is written down.

## 14.3 Compositor-only, always

**Animate `transform`, `opacity`, `colour`, or a single dimension. Never `height`, `top`, or `margin`** —
layout-triggering animation drops frames on the exact devices this product targets.

For disclosure panels: ship the **instant expand** as the baseline, animating only the chevron rotation
and content opacity. `grid-template-rows: 0fr → 1fr` is Baseline but is **still a layout animation** —
permit it for one element at a time, under ~200px, never inside a list or a scroller.
`interpolate-size: allow-keywords` / `calc-size()` are **Chromium-129+ only** and do not lift the ban.

Use `content-visibility: auto` with a matching `contain-intrinsic-size` on long lists (the Conversations
inbox). Baseline 2024, ~92%, keeps the accessibility tree and find-in-page intact. **The single largest
low-end Android win available, at zero bytes.**

## 14.4 View Transitions

React's `<ViewTransition>` works in Next 16.3.5 with **no config flag**. Put the wrapper in `page.tsx`,
**never** in `layout.tsx` — layouts persist across navigation, so enter/exit never fire.

Rewrite Next's own example CSS onto Subiza tokens: `::view-transition-old` at `--t-exit` (160ms),
`::view-transition-new` at `--t-ui` (200ms) with an exit-length delay,
`::view-transition-group(.morph)` at `--t-panel` (280ms). **Delete the `filter: blur(3px)` keyframe from
the example** — blur is not compositor-cheap on entry-level Android GPUs, and Next's 400ms durations
breach the 300ms ceiling.

Add `::view-transition { pointer-events: none }` globally. Anchor the app shell with a
`view-transition-name` plus `::view-transition-group(site-header){animation:none;z-index:100}` so the
chrome does not cross-fade on every navigation.

## 14.5 The reduced-motion contract

> Under `prefers-reduced-motion: reduce` every duration collapses to 0.01ms and **every looping animation
> stops — including the waveform and the live dot.** Those two are the ones a designer is tempted to
> exempt because they carry meaning. **They do not get an exemption:** the meaning is carried by the word
> *"On a call now"* beside the dot, which is why that word exists.

There are **no exemptions**. Not the waveform. Not the live dot. Not the caret. Not view transitions.

## 14.6 Banned, with reasons

`gsap` · `@gsap/react` · `framer-motion` · `motion` (barrel or full component) · `lenis` · `animejs` ·
`motion-one` — see §4.2 for measured costs. Lenis is banned on frames, not bytes.
`AnimatePresence` for route transitions is additionally **structurally broken** in the App Router and its
`mode="wait"` adds ~360ms of dead time on top of an RSC fetch — a direct breach of *"it never delays"*.

---

# PART 15 — RESPONSIVE

## 15.1 The method

**Design at 360 first.** Build the small form first, then enhance upward. A component built desktop-first
and squeezed down will fail the redesign register, because reflow is what you get when you squeeze.

Breakpoints are `sm:560` `md:860` `lg:1080` (§9.4). **Unprefixed IS 360.**

These validate against 2026 device reality including the awkward case worth naming: a 1440px laptop at
125% OS scaling reports **1152 CSS px**, which is above 1080 and therefore correctly receives the desktop
layout. The set holds.

## 15.2 The `AppShell` redesign — worked in full

This is the largest single piece of work in the phase, and the one most likely to be done as a reflow by
mistake.

| | Desktop rail (≥860) | Phone tab bar (<860) |
|---|---|---|
| Destinations | **7**, all visible | **4 + More** |
| Order | **Journey order** — Home first, Settings last | **Frequency order.** Credit and Connections fall into More — visited monthly, not daily |
| Labels | Beside the icon | Under it, **shortened** — *Conversations* becomes *Chats* |
| Active state | Lime fill across the row | **2.5px lime bar above**, ink label. A lime fill in a 48px tab is a shouting block |
| Counts | Numeric badge | **A dot.** There is no room for "12" and the number is not the point |
| Position | Left, sticky, scrolls independently | Bottom, fixed, **inside the thumb arc** |

**Never a hamburger.** *"A hamburger hides the product."*

Implement as two components behind one `AppShell`, rendered by CSS presence — not by a JS width listener,
which would break the no-JS contract and cost an INP hit. Add `env(safe-area-inset-bottom)` padding to the
tab bar.

## 15.3 Container queries

The **stat card, channel tile and conversation row** query their own slot, not the window — so each is
correct in a 264px sidebar and on a 900px page without anyone passing a size prop. Use Tailwind v4's
`@container` on a dedicated wrapper with `@max-*` variants.

The ~5% of browsers without `container-type` get the wide form, which is never broken, only less clever.
**No feature is behind that query.**

## 15.4 Viewport units and testing

Use `dvh`/`svh` rather than `vh` for anything full-height — mobile browser chrome makes `vh` wrong at the
worst moment. Respect `env(safe-area-inset-*)`.

**Test that a component redesigns rather than reflows:** at 359px and 361px around each breakpoint, assert
that the redesigned components have a *different DOM shape*, not merely different CSS. A reflow passes a
screenshot diff; only a DOM assertion catches it.

---

# PART 16 — ACCESSIBILITY

## 16.1 The focus ring

Dual-tone, so it survives any background it lands on — including lime, where a single dark ring nearly
vanishes:

```
outline: 2px solid var(--ink);
outline-offset: 2px;
box-shadow: 0 0 0 4px var(--ground), 0 0 0 6px var(--ink);
```

The inner ring is ink, the outer is the ground colour, keeping ≥3:1 against whatever it lands on. This
satisfies **2.4.13 Focus Appearance**, which this project treats as required rather than AAA-optional.
Verify it on all four surfaces: on lime, on white, on paper, and on the dark panel.

## 16.2 Targets

**48×48 CSS px minimum with ≥8px separation** — above WCAG 2.2's 24px floor and above the common 44px
guidance, because this interface is used one-handed while doing something else. Where a glyph is visually
smaller, **pad the hit area to 48 regardless**. Write this as an automated test over the showcase route,
not as a review item.

## 16.3 App Router focus management

Client-side navigation does not move focus by default — a known App Router accessibility gap. On every
route change, move focus to the `<h1>` or a dedicated route-announcer, and announce the new page title via
a polite live region. Ship a skip link as the first focusable element in every layout.

## 16.4 The OTP field — why one input, not six

This is the most instructive accessibility decision in the system and it must be reproduced exactly.

**Six separate inputs fail WCAG 2.2 SC 3.3.8 Accessible Authentication.** That criterion requires that a
cognitive function test not be required, and — critically — that the user be able to **paste** their
credential. A six-input field breaks paste, breaks iOS/Android SMS autofill, and is **named as a failure
example in the SC 3.3.8 Understanding document**. It also produces six tab stops and six screen-reader
announcements for one value.

**The passing implementation** is a **single `<input>`**, transparent, absolutely positioned over six
painted `<span>` slots. The input carries `inputmode="numeric"` and `autocomplete="one-time-code"`, so
platform SMS autofill works. The slots are pure decoration with `aria-hidden`. The caret is forced to the
end on focus and click — *"a caret dropped mid-string is how a pasted code silently becomes 8 digits."*
The focus ring is drawn on the container via `:focus-within`.

**Implement this with a plain server-rendered `<input>`, not a library.** (An earlier revision of §6.1
named `input-otp`; Prompt 03 §3.2 reverses that — it is a client component and fails the JS-disabled law.)

## 16.5 Dialogs, popovers and disclosure

Prefer the platform. **Native `<dialog>` + `showModal()`** gives a browser-managed focus trap, inert
background and Escape handling that is more correct than any library wrapper — and it degrades sensibly.
The **`popover` attribute** with `popovertarget` gives top-layer positioning and light-dismiss for free;
position with `anchor()` behind `@supports (anchor-name: --x)` with an absolute fallback.
**`<details>`/`<summary>`** with `name=` gives exclusive accordions **that work with JS disabled**.

## 16.6 Tooling, and its limits

`eslint-plugin-jsx-a11y` in the flat config · `@axe-core/playwright` over the showcase in both themes and
all four locales · a Playwright project with `reducedMotion: 'reduce'` asserting zero running animations ·
a Playwright project with `javaScriptEnabled: false`.

**What automation cannot catch, and a human must check:** whether focus order is *logical*, whether an
empty state's single action is the *right* one, whether error copy blames the user, and whether status is
comprehensible with colour removed. Budget manual time for **SC 2.4.13 specifically** — no tool verifies
focus appearance.

---

# PART 17 — THE EIGHT STATES, BUILT

`ViewState<T>` and `StateBoundary` are specified in §8.1. Phase 1 additionally ships the **rendering
component for each of the eight**, in `packages/ui/src/states/`.

Requirements that are easy to miss:

- **Loading** — the skeleton must match the final content's dimensions, or CLS breaks. Past 3 seconds,
  words replace the skeleton: a spinner that has spun for four seconds is not communicating.
- **Empty** — original art, one sentence of why, and **exactly one** action (G1, G6). Never a generic shrug.
- **Offline** — say it, queue the action, show it as pending, send on reconnect. The pending tag is part
  of this state, not a separate feature.
- **Partial** — a missing recording is a **stated gap**, not a broken player.
- **Permission denied** — "why, and who *can* do it", which is why `ViewState` carries `whoCan: RoleId[]`.
- **Server error** — apologise once, say we know, offer support. **Never a code as the primary message.**
  The digest goes in small text for support, nothing more.

Every string in every state is translated in all four locales. No platform error code ever reaches a
business owner.

---

# PART 18 — INTERNATIONALISATION

## 18.1 Setup

`next-intl`, four locales — **`rw` (Kinyarwanda), `en`, `fr`, `sw`**. Kinyarwanda is a **first-class
default, not a fallback**.

Wire it to **`proxy.ts`, not `middleware.ts`** — the Next 16 rename is the single most common next-intl
failure (`Unable to find next-intl locale`).

Routing strategy differs by app, deliberately:

- **`apps/site`** — `/[lang]` path prefix with `generateStaticParams` returning all four. Public pages
  need shareable, indexable, per-language URLs. (Marketing launches in `en` + `rw`; `fr` and `sw` arrive
  with those markets — but build all four now.)
- **`apps/studio`** — cookie-based with **no URL segment**, so team members with different language
  preferences can share links to the same conversation.
- **`apps/admin`** — English only.

Read the locale via **`next/root-params`** rather than prop-drilling. Use server-side `getTranslations` by
default — it ships **zero catalogue to the client**, which is why `next-intl` was chosen over Paraglide
for this RSC-first codebase.

Type the message keys. **Never concatenate translated fragments** — Kinyarwanda morphology will break it.
Use ICU message format with proper plural categories.

## 18.2 Kinyarwanda runs 15–25% longer than English

Every layout must be proven against the longest of the four. Concretely:

- `min-width: 0` on every flex and grid child. This one property prevents most overflow bugs.
- `text-wrap: balance` on headings, `pretty` on body.
- **Logical properties** throughout (`padding-inline`, `margin-block`, `border-inline-start`) — not because
  these four languages are RTL, but because it is free and correct.
- **No fixed widths on anything containing text.** No truncation as a layout strategy; if a string must
  truncate, it needs a title and a reason.
- Container queries so a component responds to its own slot rather than a guessed size.

**The CI gate:** render every showcase component at **360px in all four locales**, in both themes, and
assert no horizontal overflow and no clipped text. That turns "Kinyarwanda runs longer" from a warning
into a failing test.

## 18.3 Formatting

RWF currency via `Intl.NumberFormat` — **RWF has no minor unit**, so zero decimal places. Dates, times,
durations and relative times via `Intl`, never hand-rolled. Phone numbers in the Rwandan display format.
All of it in `packages/core/src/format.ts`, tested.

---

# PART 19 — PERFORMANCE

## 19.1 Enforcement

The budget of §3.5 is a **CI gate that fails the build**, not a warning.

- Bundle-size gate: **200KB gzip first-load** per route. Fail, do not warn.
- Lighthouse on **throttled 3G**, asserting LCP ≤4s. Run against a real build, never a dev server.
- `pnpm why` assertions that no banned package resolved into the tree.
- Set an explicit `browserslist` per app, after the Phase B2 measurement — every unnecessary downlevel
  transform is bytes on a 2G connection, but guessing too high ships syntax a device cannot parse.

## 19.2 Techniques that matter here

`experimental.inlineCss: true` on `apps/site` only (§5.2) · self-hosted subset variable fonts, preload
body regular only · the SVG sprite with ~8 shell icons inlined · `content-visibility: auto` on long lists ·
`next/image` with explicit `images.qualities` (e.g. `[50, 75]`) so 2G can drop to 50 — though with no stock
illustration, most routes should carry **no raster image at all**.

## 19.3 Measure on the real thing

Instrument from day one: `web-vitals` attribution build with `onINP({ reportAllChanges: true })`, plus a
`PerformanceObserver` on `long-animation-frame`.

**Validate on a sub-$120 Tecno, Itel or Infinix over a real Rwandan network — not a throttled laptop.**
A throttled laptop models bandwidth; it does not model a 4-core A53 with 2GB of RAM, and the difference is
where this product succeeds or fails.

---

# PART 20 — VERIFICATION

## 20.1 The showcase route

`apps/site/src/app/[lang]/design-system/` renders **every component in the inventory**, in every variant
and every state. It mirrors `Design/design-system.html` — same 26 sections, same order, same `.why`
explanations carried across as real content.

This is not a nice-to-have. It is how criteria 3, 6, 8, 10, 11 and 12 are proven, it is the surface the
audits run against, and it is the artefact a future contributor reads before touching the system.

Wire the theme and motion switches into it so a reviewer can flip all six combinations
(light/dark/system × full/reduce) on one page.

## 20.2 The audit suite

| Audit | Tool | Pass condition |
|---|---|---|
| Token fidelity | Script | Extracted `--*` sets from HTML and `tokens.css` are identical |
| Types | `next typegen && tsc --noEmit` | Exit 0 |
| Boundaries | `eslint` + `dependency-cruiser` | Exit 0; and a deliberate violation must fail |
| No-JS | Playwright `javaScriptEnabled: false` | Every component renders and every form posts |
| Reduced motion | Playwright `reducedMotion: 'reduce'` | Zero running animations, waveform and live dot included |
| Accessibility | `@axe-core/playwright`, both themes × four locales | Zero violations |
| Targets | Custom Playwright assertion | Every interactive box ≥48×48, ≥8px apart |
| Text expansion | Showcase at 360 × 4 locales × 2 themes | No horizontal overflow, no clipped text |
| Budget | Lighthouse, throttled 3G | ≤200KB above fold, LCP ≤4s |
| Banned deps | `pnpm why` | Nothing resolves |

## 20.3 The adversarial pass

Before declaring Phase 1 done, deploy a reviewer **whose only job is to falsify the claim**. Assume the
other agents were optimistic. Specifically hunt for:

- A component that exists but has only its happy state.
- A `--r-lg` (24px) used somewhere that is not a genuine "moment".
- A shadow on something that is not genuinely floating.
- Lime used as a text colour anywhere.
- `--e-spring` used on anything but the toggle knob.
- A responsive component that reflows where the register says it must be redesigned.
- An atom that imports a molecule, or any component that knows the word "conversation".
- A `dark:` colour utility.
- A hardcoded spacing value that is not on the 14-step scale.
- Any string not routed through i18n.

## 20.4 The final grep

```
middleware.ts · forwardRef · reset( · framer-motion · gsap · lenis
lucide-react · recharts · --spacing- · padding: 15px
```

Each of these should appear in the codebase **zero times**, or only inside a lint rule or a comment
explaining why it is forbidden.

---

# PART 21 — DELIVERABLES & WHAT COMES NEXT

## 21.1 Phase 1 deliverables

1. `CONTEXT.md` — the absorption gate (§2.5)
2. `NEXT16.md` — the correction sheet as verified against the installed docs (§5)
3. `BROWSER-FLOOR.md` — the measurement and the Tailwind decision it gates (§9.4)
4. The monorepo: 3 apps, 8 packages, working `turbo build`
5. `packages/ui` — the complete ported design system
6. `packages/core` — `ViewState`, branded IDs, the capability matrix, formatters
7. The `/design-system` showcase route
8. The audit suite, wired into CI, all green
9. `AGENTS.md` updated with the four-rung ladder and the banned-dependency list

## 21.2 The prompt series

| # | Covers | Source |
|---|---|---|
| **01** | **Foundation & design system** ← *this document* | `design-system.html` |
| 02 | Landing page & public routes | `landing.html` |
| 03 | Sign-up, sign-in, recovery | `auth.html` |
| 04 | Guided activation — the nine steps, the trust ladder | `activation.html` |
| 05 | Phone connection & the forwarding code | `phone.html` |
| 06 | Messaging channel connection | `channels.html` |
| 07 | Agent design — Simple ↔ Advanced | `agent.html` |
| 08 | Knowledge base & the pronunciation lexicon | `knowledge.html` |
| 09 | Voice, cloning and consent | `voice.html` |
| 10 | Language & switching | `language.html` |
| 11 | Test & go-live | `golive.html` |
| 12 | Home — the feed, the three zones | `home.html` |
| 13 | Conversations — the unified inbox | `conversations.html` |
| 14+ | Escalation · Results · Credit · Team · Compliance · Notifications · Admin console | *design pending* |

Say **next** to receive Prompt 02.

---

# PART 22 — APPENDIX: THE SYSTEM IN THREE PICTURES

## A — Layers and what may import what

```
   apps/*/src/app/**/page.tsx          ROUTE     thin. params → view.
            │                                    no markup beyond <Suspense>.
            ▼
   apps/*/src/views/*View.tsx          VIEW      composition. owns the 8 states.
            │                                    knows the product.
            ▼
   apps/*/src/features/<domain>/       FEATURE   server actions, schemas, logic.
            │
            ▼
   packages/ui/src/organisms/          ORGANISM  AppShell, Sheet, StateBoundary
            │                                    ↑ may not know the domain
            ▼
   packages/ui/src/molecules/          MOLECULE  Card, Banner, RowList, OtpField
            │
            ▼
   packages/ui/src/atoms/              ATOM      Button, Input, Tag, Icon, Dot
            │                                    ↑ if it says "conversation",
            ▼                                      it is not an atom
   packages/core/  ·  tokens.css       FOUNDATION  types, formatters, the tokens

   ══ imports flow DOWNWARD ONLY. an upward import is a build failure. ══
   ══ packages/ui/src/product/ sits beside organisms: knows Subiza,    ══
   ══ knows no feature.                                                ══
```

## B — How a token reaches a pixel

```
  Design/design-system.html   ← the authored source. the argument lives here.
         │  transcribe VERBATIM. do not translate, round, or convert to oklch.
         ▼
  packages/ui/src/tokens/tokens.css
         │   :root { … }                                     light, complete
         │   @media (prefers-color-scheme:dark) {
         │     :root:not([data-theme=light]) { … } }          system dark
         │   :root[data-theme=dark] { … }                     explicit dark
         │
         ├──────────────► var(--ink)          used directly in hand-authored CSS
         │
         ▼
  packages/ui/src/tokens/theme.css
         │   @theme inline {                  ← inline is MANDATORY.
         │     --color-ink: var(--ink);          bare @theme freezes the value
         │     --radius-md: var(--r-md);         at :root and breaks --panel
         │     --ease-out: var(--e-out);         subtrees.
         │     --breakpoint-sm: 35rem;        ← NEVER --spacing-*
         │   }                                   (collides with bare numbers)
         │   @custom-variant dark ( … both arms … )
         ▼
      text-ink   rounded-md   ease-out   sm:flex-row
         │
         ▼
   both themes flip from ONE declaration. no dark: colour utility. ever.
```

## C — The eight states are the screen

```
                    ┌──────────────────────┐
      request ─────►│    ViewState<T>      │
                    └──────────┬───────────┘
                               ▼
    ┌─────────┬─────────┬──────────┬─────────┬──────────┬─────────┬──────────┐
    ▼         ▼         ▼          ▼         ▼          ▼         ▼          ▼
 loading    empty    offline    partial   denied    notFound  rateLimited  error
   .sk     .empty    .toast   banner-  .empty +   .empty    banner-    banner-
                     +pending    info     role                 warn       risk
    │         │         │          │         │          │         │          │
  skeleton  ONE      queue &    say what  why, and   what      when to    sorry once,
  matches   action   show as    is MISSING who CAN   happened  retry, in  we know,
  final dim          pending                         + where   minutes    support.
                                                                          never a code

              ready ──► the happy path. ONE of eight.
              ═══════════════════════════════════════════
              a screen designed only here is a screen whose
              other states will be discovered by a customer.
```

---

*Prompt 01 · Subiza · Foundation & Design System*
*Built against `Design/design-system.html` v1.0 and the Subiza Flow Atlas v1.0.*
*Every rule here traces to a decision documented there.*
