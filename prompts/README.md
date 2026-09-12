# Subiza — Build Prompts

Each prompt in this series is a **self-contained brief handed to a coding agent** (Cursor, Claude Code)
to build one flow of the Subiza application. They are written to be pasted whole — an agent should not
need to ask a clarifying question before starting.

## Method

The design programme (`../Design/PROGRAMME.md`) was produced one flow at a time: analyse the flow,
research what must functionally be in it, research current design practice for that kind of surface,
check it against the project context, then design it. **The build follows the same discipline.** One
prompt, one flow. Nothing else starts until the word _next_.

The order follows `Design/` — the design system first, because everything else depends on it, then the
customer's own journey from landing page to daily use.

## The series

| #      | Prompt                                                                            | Design source        | Status    |
| ------ | --------------------------------------------------------------------------------- | -------------------- | --------- |
| **01** | [Foundation & Design System](01-foundation-and-design-system.md)                  | `design-system.html` | **Built** |
| **02** | [Landing page & public routes](02-landing-and-public-routes.md)                   | `landing.html`       | **Built** |
| **03** | [Authentication & authorization](03-authentication-and-authorization.md)          | `auth.html`          | **Ready** |
| **04** | [Guided activation](04-guided-activation.md)                                      | `activation.html`    | **Ready** |
| 05     | Phone connection                                                                  | `phone.html`         | pending   |
| 06     | Messaging channel connection                                                      | `channels.html`      | pending   |
| 07     | Agent design                                                                      | `agent.html`         | pending   |
| 08     | Knowledge base                                                                    | `knowledge.html`     | pending   |
| 09     | Voice, cloning and consent                                                        | `voice.html`         | pending   |
| 10     | Language and switching                                                            | `language.html`      | pending   |
| 11     | Test and go-live                                                                  | `golive.html`        | pending   |
| 12     | Home — the feed                                                                   | `home.html`          | pending   |
| 13     | Conversations — the unified inbox                                                 | `conversations.html` | pending   |
| 14+    | Escalation · Results · Credit · Team · Compliance · Notifications · Admin console | design pending       | —         |

## Decisions locked in Prompt 01

These bind every later prompt. Changing one is a project-level decision, not a per-flow one.

| Area               | Decision                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Component sourcing | `Design/*.html` **is** the component library. shadcn/Radix are read for ARIA wiring, not installed.                      |
| Runtime UI deps    | `@radix-ui/react-slot` only. (`input-otp` was dropped in Prompt 03 §3.2 — a client component fails the JS-disabled law.) |
| Styling            | Tailwind v4 with `@theme inline` aliasing over a verbatim `tokens.css`. Gated on a real browser-floor measurement.       |
| Repo               | pnpm + Turborepo. `apps/site`, `apps/studio`, `apps/admin` on separate origins.                                          |
| i18n               | `next-intl`, four locales, wired to `proxy.ts`. Kinyarwanda is a first-class default.                                    |
| Motion             | CSS tokens + React `<ViewTransition>`, 0KB. GSAP / Motion / Lenis banned by lint.                                        |
| Charts             | Hand-written SVG Server Components. No chart library, ever.                                                              |

## The law that outranks any prompt

1. `../subiza-flow-atlas/README.md` §4 — global rules **G1–G22**
2. `../subiza-flow-atlas/flows/04-platform-constraints.md` — the **F1–F14** forbidden list
3. `../Design/design-system.html` §22–26 — the eight states, responsive, accessibility, performance, licences

If a prompt ever contradicts one of these, the prompt is wrong.
