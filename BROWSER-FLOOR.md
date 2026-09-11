# BROWSER-FLOOR.md — Phase B2 measurement and Tailwind decision

## Measurement (Statcounter, Rwanda, August 2026)

Mobile & tablet browsers:

- Chrome **78.09%**
- Safari **12.34%**
- Opera **5.89%**
- Samsung Internet **1.07%**
- Android (stock) **0.69%**
- UC Browser **0.48%**

Mobile & tablet Android versions:

- 12.0 **21.12%**
- 13.0 **14.41%**
- 11.0 **13.86%**
- 14.0 **13.44%**
- **9.0 Pie 8.47%**
- 15.0 **8.14%**

Chrome updates independently of the OS, so Android 11/12 devices can (and
usually do) run Chrome well above 111. The residual risk is **un-updated
Chrome on Transsion (Tecno / Itel / Infinix) Android 9 images**, which still
represent a real slice of this market.

Physical device check on a sub-$120 Tecno / Itel / Infinix over a Rwandan
network is a **founder gate**. This environment cannot run it. CI substitutes
with Playwright at 360 CSS px and Lighthouse on throttled 3G against a
production build.

## Decision: keep Tailwind CSS v4.3.3

`tokens.css` is the source of truth either way. Tailwind v4 is already in the
scaffold. We keep it, and we make the compile output safe for a floor that
may sit below Chrome 111:

- Never use opacity modifiers (`bg-signal/50`) — they compile to `color-mix()`.
- Never use `oklch()` derivation or `hsl(from …)` in authored CSS.
- Never use `@property` in authored CSS.
- Redefine `dark:` with `@custom-variant` (both arms). Lint-fail `dark:` on
  colour utilities.
- Replace the two `color-mix(in oklab, …)` call sites in the HTML (live-dot
  pulse, call-card wash, topbar blur fallback) with pre-mixed literals. That
  is an implementation fix for the floor, not a redesign.
- `@theme inline` only — bare `@theme` freezes `--panel` subtrees.

Escape hatch if a physical device later proves Chrome <111 is the real floor:
drop to Tailwind v3 via the installed guide
`node_modules/next/dist/docs/01-app/02-guides/tailwind-v3-css.md`, or drop
Tailwind for CSS Modules over the same `tokens.css`. Do not guess that now.

## Viewports we test

Unprefixed = 360 (base). Breakpoints: 560 / 860 / 1080.

Also assert around each edge (359 / 361, 559 / 561, 859 / 861, 1079 / 1081)
that redesign-register components change **DOM shape**, not merely CSS.

The awkward laptop case: 1440 CSS px at 125% OS scaling reports **1152**,
which is above 1080 and correctly receives the desktop layout.

Use `dvh` / `svh`, not `vh`. Honour `env(safe-area-inset-*)`.
