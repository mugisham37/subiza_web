# SUBIZA — SOFTWARE FLOW ATLAS

**The complete flow specification for the Subiza web application: what every actor does, in what order, on what screen, with what constraints, and how we know each flow worked.**

---

| | |
|---|---|
| **Document** | Software Flow Atlas v1.0 |
| **Date** | 5 September 2026 |
| **Owner** | Thierry Gusenga (gusenga.thierry@tekaccess.rw) |
| **Scope** | **Software / web application layer only.** Telephony infrastructure, AI model infrastructure and carrier relationships are specified in the **Subiza Project Documentation** (the companion document set) and are treated here as external services with defined interfaces. |
| **Companion** | **Subiza Project Documentation** — the problem, market, architecture, law and economics this flow set implements |
| **Status** | Specification. Not yet built. Every flow carries success criteria that make it testable. |

---

## 1. What this document is, and how to use it

This is not a design file and it is not a wireframe set. It is the **flow layer** — the thing that must be settled before anyone draws a screen, because a beautiful screen in the wrong sequence loses the user anyway.

It answers, for every person who will touch Subiza:

- **Where do they arrive?**
- **What is the very first thing they see?**
- **What do they do next, and what happens when they do it?**
- **Where can they get lost, confused, blocked or frightened — and what catches them?**
- **How do we know the flow worked?**

Each flow is documented twice, deliberately:

- **The overview** — the 30-second version. Five to eight boxes. What happens, in order. Anyone can read it.
- **The detail** — step by step, screen by screen. What the user sees, what they do, what the system does behind it, what can fail, and what happens when it does.

That double treatment is the point. A flow document that only shows the overview is a marketing diagram. One that only shows the detail is unreadable. Both, together, let a founder check the logic and an engineer build it.

### How to read the flow documents

Every flow document uses the same structure, so you can jump to the part you need:

| Section | What it gives you |
|---|---|
| **Header block** | Actor, entry points, exits, dependencies, frequency, criticality |
| **1. Purpose** | What problem this flow solves, and what breaks if it is wrong |
| **2. Overview** | The 30-second diagram |
| **3. Preconditions** | What must already be true |
| **4. Detailed flow** | Step by step: *sees → does → system does → can fail* |
| **5. Screens & states** | Every screen and every state it can be in |
| **6. Decisions & branches** | Where the flow forks and why |
| **7. Platform constraints** | What WhatsApp / Instagram / Telegram / the carrier will and will not allow here |
| **8. Edge cases & failures** | What goes wrong and what the user sees |
| **9. Retention rationale** | Why this order, in retention terms |
| **10. Success criteria** | Measurable, testable, pass/fail |
| **11. Instrumentation** | What to log and measure |
| **12. Open questions** | What we still do not know |

---

## 2. The document set

### Foundations — read these first

| # | Document | What it settles |
|---|---|---|
| 01 | [Actors, Roles & Permissions](flows/01-actors-roles-and-permissions.md) | Every human and system that touches Subiza, and exactly what each may do |
| 02 | [Information Architecture](flows/02-information-architecture.md) | The navigation of both applications — what lives where and why |
| 03 | [Master Flow Map](flows/03-master-flow-map.md) | Every flow, how they connect, and the critical path through them |
| 04 | [Platform Constraints & Design Boundaries](flows/04-platform-constraints.md) | **The most important document here.** What the WhatsApp, Instagram, Telegram and telephony platforms actually permit — so we never design a flow around a feature that does not exist |

### Business console flows — the paying customer

| # | Flow | Actor |
|---|---|---|
| 05 | [Signup & Account Creation](flows/05-flow-signup-and-account-creation.md) | Business owner |
| 06 | [Guided Activation](flows/06-flow-guided-activation.md) | Business owner — **the flow the company lives or dies on** |
| 07 | [Phone Connection](flows/07-flow-phone-connection.md) | Business owner |
| 08 | [Messaging Channel Connection](flows/08-flow-messaging-channel-connection.md) | Business owner |
| 09 | [Agent Design & Scripts](flows/09-flow-agent-design-and-scripts.md) | Business owner |
| 10 | [Knowledge Base](flows/10-flow-knowledge-base.md) | Business owner |
| 11 | [Voice Selection & Cloning](flows/11-flow-voice-and-cloning.md) | Business owner + consenting voice owner |
| 12 | [Language & Switching](flows/12-flow-language-and-switching.md) | Business owner + caller |
| 13 | [Test & Go-Live](flows/13-flow-test-and-go-live.md) | Business owner |
| 14 | [Daily Operations — the Inbox](flows/14-flow-daily-operations-inbox.md) | Business owner + staff |
| 15 | [Escalation & Human Handover](flows/15-flow-escalation-and-handover.md) | Caller → AI → staff |
| 16 | [Analytics & the Retention Loop](flows/16-flow-analytics-and-retention.md) | Business owner |
| 17 | [Billing & Mobile Money](flows/17-flow-billing-and-mobile-money.md) | Business owner |
| 18 | [Team & Permissions](flows/18-flow-team-and-permissions.md) | Business owner |
| 19 | [Compliance, Consent & Data Rights](flows/19-flow-compliance-and-data-rights.md) | Business owner + data subjects |

### Platform admin flows — us

| # | Flow | Actor |
|---|---|---|
| 20 | [Admin Console & Operations Home](flows/20-admin-console-and-operations.md) | Platform staff |
| 21 | [Tenant Lifecycle & Support](flows/21-admin-tenant-lifecycle.md) | Support, onboarding ops |
| 22 | [AI Operations](flows/22-admin-ai-operations.md) | ML engineer, quality reviewer |
| 23 | [Trust, Safety & Quality](flows/23-admin-trust-safety-and-quality.md) | Trust & safety officer |

### Cross-cutting flows

| # | Flow | Applies to |
|---|---|---|
| 24 | [Errors, Degradation & Edge Cases](flows/24-flow-errors-and-degradation.md) | Everything |
| 25 | [Notifications](flows/25-flow-notifications.md) | Everything |
| 26 | [Success Criteria & Acceptance Tests](flows/26-success-criteria-index.md) | Everything |

---

## 3. The three questions this atlas answers before any screen is drawn

### Q1 — What is the shortest path to the moment the customer believes?

**Activation is not "signed up." It is not "connected WhatsApp." It is not "finished the checklist."**

Activation is: **a real or simulated customer interaction was handled by the AI, and the business owner watched it happen and judged the answer good.**

Everything before that moment is cost. Everything after it is habit. The entire onboarding flow ([Flow 06](flows/06-flow-guided-activation.md)) is engineered backwards from that single moment, and it is reached **before** the owner is asked to connect anything real.

The evidence is unambiguous: users who do not reach first value early rarely reach it at all — re-engagement of accounts not activated within 30–90 days converts under 5%. So Subiza's rule is: **no signup session ends without the owner having heard or read their own AI answer a question.**

### Q2 — What can we actually build, and what are we forbidden from building?

The single most common way a product like this fails is designing a flow around a platform capability that does not exist. The research behind [Document 04](flows/04-platform-constraints.md) established, with sources, exactly what is impossible. A few examples of things Subiza **cannot** do, no matter how much better the flow would be:

- We **cannot** register a business's WhatsApp number for them. They must personally receive and enter an OTP.
- We **cannot** set call forwarding on their phone. They must dial a GSM code themselves. We can only verify it worked by placing a test call.
- We **cannot** create a Telegram bot on their behalf. They must talk to BotFather and paste a token.
- We **cannot** message an Instagram user outside the 24-hour window. There is no template escape hatch as there is on WhatsApp.
- We **cannot** send a second private reply to an Instagram comment. Ever. One per comment.
- We **cannot** run a general-purpose AI assistant on WhatsApp. Meta banned it for all users from 15 January 2026.
- We **cannot** avoid Meta's Business Verification queue, which takes 5–15 business days per review cycle.

Every one of these becomes a **designed state** in the flows — a waiting screen, a guided instruction, a verification step — rather than a bug discovered in month four.

### Q3 — Why would somebody come back tomorrow?

The founder named retention as the core concern, and it is the right one. Retention in this product is not a loyalty programme. It is three specific mechanics, each built into a flow:

1. **The value is made visible.** Every week the owner receives, on WhatsApp, a message that says how many calls Subiza answered that they would otherwise have missed. This single number is the product's reason to exist and the reason the subscription renews ([Flow 16](flows/16-flow-analytics-and-retention.md)).
2. **Trust is earned in stages, not demanded up front.** The owner is never asked to hand their customers to an AI on day one. They go: sandbox → after-hours only → live with review → fully autonomous. Each step is a decision they make, when they are ready ([Flow 13](flows/13-flow-test-and-go-live.md)).
3. **The next action is always obvious and always singular.** At every point in the product there is exactly one recommended next step, not a menu. A confused user in this market does not file a support ticket. They stop opening the app.

---

## 4. Global design rules

These bind every flow in this atlas. A flow that violates one of them is wrong, regardless of how good it looks.

### Structure

| # | Rule |
|---|---|
| **G1** | **One next action.** Any screen a user can be stuck on shows exactly one recommended next step. |
| **G2** | **Value before configuration.** The owner sees the AI work before being asked to connect a real number or channel. |
| **G3** | **Nothing blocking that need not block.** Only steps that genuinely prevent value are in the wizard. Everything else is a resumable checklist item. |
| **G4** | **Every step says why.** No form field without a one-line reason for existing. |
| **G5** | **No product tours.** Contextual help at the moment of need, never a sequential tooltip walkthrough. Tours are measurably unhelpful. |
| **G6** | **No blank screens.** Every empty state explains what goes here, why it is empty, and offers one action. |
| **G7** | **Skip and resume, always.** Any non-blocking step can be skipped and returned to without losing progress. |
| **G8** | **Templates over blank boxes.** Never ask an owner to write from scratch what a business-type template can pre-fill. |

### Trust

| # | Rule |
|---|---|
| **G9** | **The kill switch is always visible.** Pause the AI, on this conversation or entirely, from any screen. Never buried in settings. |
| **G10** | **Every AI conversation is readable.** Full transcript, labelled AI or human, permanently, to the owner. |
| **G11** | **AI is disclosed to the caller.** Every call and every chat session opens with it. Non-negotiable and non-skippable. |
| **G12** | **Consent is asked in context, never bundled.** Recording consent and voice-cloning consent are separate decisions, asked at the moment they become relevant, each with its own plain-language explanation and its own revoke path. |
| **G13** | **The system says "I don't know" rather than guessing.** Below the confidence threshold, it escalates. Visible in the product as a setting the owner controls. |

### Market

| # | Rule |
|---|---|
| **G14** | **Mobile-first, low-bandwidth.** Must work on a mid-range Android over 3G. Rwanda: 34% household smartphone ownership, rural internet usage 19%, data costing up to 60% of monthly income for the poorest households. Every kilobyte is a real cost to the user. |
| **G15** | **Language is switchable anywhere, any time.** Kinyarwanda, English, French, Swahili — not a one-time onboarding choice. |
| **G16** | **Icons, numbers and status colour over paragraphs.** Research across Kenya, India, the Philippines and South Africa found graphical interfaces substantially outperform text for novice and low-literacy users. Dense text goes behind an optional "learn more." |
| **G17** | **WhatsApp is an interface to Subiza, not only a channel Subiza manages.** The weekly report, urgent escalations and quick approvals reach the owner where they already are. |
| **G18** | **Never require a card.** Mobile money, always. 5.8 million active MoMo users in Rwanda; card penetration is marginal. |

### Engineering

| # | Rule |
|---|---|
| **G19** | **Every external connection can break silently.** Tokens expire, users revoke, platforms ban. Every channel has a visible connection-health state and a one-click reconnect. |
| **G20** | **Every flow has a defined failure state.** No dead ends, no silent failures, no unexplained spinners. |
| **G21** | **Every consequential action is auditable.** Who, what, when, before, after. |
| **G22** | **The platform never makes a business less reachable than it was before Subiza.** If everything fails, calls fall back to the owner's own line. |

---

## 5. The map in one picture

```
                    ┌────────────────────────────────────────────────┐
                    │  PUBLIC        Landing · pricing · demo call    │
                    └───────────────────────┬────────────────────────┘
                                            │
    ┌───────────────────────────────────────▼────────────────────────────────────┐
    │  BUSINESS CONSOLE  (Subiza Studio)                                          │
    │                                                                             │
    │   05 Signup ──► 06 GUIDED ACTIVATION ──────────────────────────┐            │
    │                     │                                          │            │
    │                     ├─ business type & language                │            │
    │                     ├─ 09 agent design (template pre-filled)   │            │
    │                     ├─ 10 knowledge (photo of price list)      │            │
    │                     ├─ 11 voice choice                         │            │
    │                     ├─ ★ FIRST VALUE — sandbox test call ★     │            │
    │                     ├─ 07 phone connection (forwarding)        │            │
    │                     └─ 13 test & go-live (staged trust)        │            │
    │                                                                │            │
    │   08 channels ──── WhatsApp · Instagram · Telegram · SMS ──────┤            │
    │   12 languages ───────────────────────────────────────────────┤            │
    │                                                                ▼            │
    │   ┌──────────────── DAILY LOOP ─────────────────────────────────────────┐   │
    │   │  14 Inbox ◄──► 15 Escalation ◄──► 16 Analytics ──► weekly report    │   │
    │   └─────────────────────────────────────────────────────────────────────┘   │
    │                                                                             │
    │   17 Billing · 18 Team · 19 Compliance & data rights                        │
    └─────────────────────────────────┬───────────────────────────────────────────┘
                                      │  support · provisioning · policy
    ┌─────────────────────────────────▼───────────────────────────────────────────┐
    │  ADMIN CONSOLE                                                              │
    │   20 Operations home · 21 Tenant lifecycle · 22 AI operations ·             │
    │   23 Trust, safety & quality                                                │
    └─────────────────────────────────────────────────────────────────────────────┘

    Cross-cutting: 24 errors & degradation · 25 notifications · 26 success criteria
```

Full detail, including every dependency and every entry point: [Master Flow Map](flows/03-master-flow-map.md).

---

## 6. What is deliberately not in scope

Naming these prevents the atlas from quietly growing into an unbuildable product.

- **Outbound calling campaigns.** High regulatory risk, entirely different sales motion. Specified as deferred in the project documentation; no flow exists here.
- **A developer API and platform.** An integration API exists for tenants; a public developer platform competing with Vapi and Retell does not.
- **A full CRM.** Subiza connects to what the business already uses.
- **Enterprise contact-centre features.** Workforce management, complex skills-based routing, compliance recording at scale.
- **The reseller and agency portal.** Architected for in the permission model ([Flow 01](flows/01-actors-roles-and-permissions.md)) so it is cheap to add later, but not specified as flows.

---

## 7. What to do with this atlas

1. **Read [04 — Platform Constraints](flows/04-platform-constraints.md) first**, even before the flows. It is the reality check that makes everything else honest.
2. **Then read [06 — Guided Activation](flows/06-flow-guided-activation.md).** If that flow is right, the company has a chance. If it is wrong, nothing else matters.
3. **Use [26 — Success Criteria](flows/26-success-criteria-index.md) as the build checklist.** Every criterion is written to be testable, so "done" is not a matter of opinion.
4. **When a flow meets reality and reality wins, change the flow document, not just the code.** A flow atlas that drifts from the product is worse than none.

---

*Companion visual: the published Flow Atlas renders every flow in this set as a diagram.*
