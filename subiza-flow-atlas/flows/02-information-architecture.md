# 02 — Information Architecture

*Part of the [Subiza Flow Atlas](../README.md)*

---

## 1. The problem this solves

The competitor teardown found a near-universal IA across this category — Build, Knowledge, Test, Deploy, Inbox, Analytics, Settings — and also found that **nobody spans voice and chat in one product**. A business wanting an AI on their phone *and* their WhatsApp today configures two unrelated tools with duplicated knowledge and no shared memory.

That gap is Subiza's opening, and it has a direct IA consequence: **channel is a property of a conversation, not a top-level section of the app.** One agent, one knowledge base, one inbox, many channels. Every structural decision below follows from that.

The second constraint is the market. Rwanda: 34% household smartphone ownership, rural internet usage 19%, data costing up to 60% of monthly income for the poorest households, and research across Kenya, India, the Philippines and South Africa showing graphical interfaces substantially outperform text for novice users. This is not a desktop SaaS with a mobile view. **It is a mobile product that happens to have a desktop layout.**

---

## 2. Two applications, one platform

| | Business Console (Subiza Studio) | Admin Console |
|---|---|---|
| **Who** | Owner, Manager, Agent, Viewer | Platform staff |
| **Where** | app.subiza.rw | admin.subiza.rw — separate origin, separate auth, separate session |
| **Primary device** | Mid-range Android phone browser | Desktop |
| **Design priority** | Speed of comprehension | Density of information |
| **Language** | Kinyarwanda, English, French, Swahili | English |

They are separated at the origin level, not merely by a permission check, because a bug that leaks admin capability into the tenant app is the kind of failure that ends a company.

---

## 3. Business console — navigation

### 3.1 Structure

```
   SUBIZA STUDIO
   │
   ├── ⌂  HOME              the feed — today, what needs you, what was handled
   ├── 💬 CONVERSATIONS     unified inbox: calls + WhatsApp + IG + Telegram + SMS
   ├── 🤖 MY AGENT          how it behaves, what it knows, how it sounds
   │      ├── Behaviour       persona, greeting, rules, hours, escalation
   │      ├── Knowledge       prices, services, FAQs, documents, pronunciation
   │      ├── Voice           voice choice, cloning, speed and style
   │      └── Languages       which languages, how switching works
   ├── 🔌 CONNECTIONS       phone number, WhatsApp, Instagram, Telegram, SMS, web
   ├── 📊 RESULTS           what Subiza did for you, and what it saved
   ├── 💳 CREDIT            balance, top-up, plan, usage
   └── ⚙  SETTINGS          business, team, language, privacy, data, account
```

**Seven items.** Not ten. On a phone this is a bottom bar of four (Home, Conversations, Agent, More) with the remainder behind More.

### 3.2 Why these seven

| Section | Why it earns a top-level slot |
|---|---|
| **Home** | The daily return. Answers "what happened, what needs me" in one screen. Most sessions end here |
| **Conversations** | The proof. The single place the owner verifies the AI is doing its job. Trust lives here |
| **My Agent** | The configuration surface, deliberately grouped as one thing: *behaviour, knowledge, voice, language* are four aspects of one agent, not four products |
| **Connections** | Where things break. Channel health must be visible at the top level, because a silently disconnected channel is this product's worst failure |
| **Results** | Where the subscription renews. "31 calls answered that you would have missed" |
| **Credit** | Prepaid, MoMo, and therefore checked often. Balance is visible in the header everywhere, not only here |
| **Settings** | Everything else |

### 3.3 What is deliberately *not* top-level

| Not a section | Where it lives instead | Why |
|---|---|---|
| **Channels** | Inside Connections; and as metadata on conversations | Channel is not a mental model an owner has. "My customers" is |
| **Contacts** | Inside Conversations, as a per-customer timeline | Chat platforms all make Contacts top-level because subscriber lists are their product. Subiza's product is answered conversations |
| **Templates / broadcasts** | Deferred entirely | Outbound is out of scope. Adding it later must not restructure the app |
| **Analytics** | Merged into Results | "Analytics" is a word for people who look at dashboards. "Results" is what an owner wants |
| **Automations / flows** | Inside My Agent → Behaviour, as advanced mode | A visual flow builder as a top-level section signals "this is complicated." It is the escape hatch, not the front door |

### 3.4 Home — the most-visited screen

Home is a **feed, not a dashboard**. Three zones, in strict priority order:

```
  ┌──────────────────────────────────────────────────────┐
  │  Muraho, Claudine          [balance: 14,200 RWF] [KIN▾]│
  ├──────────────────────────────────────────────────────┤
  │                                                       │
  │   ⬤ NEEDS YOU  (2)                     ← zone 1       │
  │   ┌─────────────────────────────────────────────┐    │
  │   │ Marie K.  ·  14:22  ·  call                 │    │
  │   │ Group booking for 8, Saturday — outside     │    │
  │   │ your normal slots                            │    │
  │   │ [ Call back ]  [ WhatsApp ]  [ Done ]        │    │
  │   └─────────────────────────────────────────────┘    │
  │                                                       │
  │   ✓ HANDLED TODAY  (10)                ← zone 2       │
  │   3 bookings · 5 price questions · 2 hours            │
  │   [ See all ]                                         │
  │                                                       │
  │   ▲ THIS WEEK                          ← zone 3       │
  │   47 conversations answered                           │
  │   31 you would have missed          ← THE NUMBER      │
  │   [ See results ]                                     │
  │                                                       │
  ├──────────────────────────────────────────────────────┤
  │  ⌂        💬        🤖        ⋯                        │
  └──────────────────────────────────────────────────────┘
```

**Zone 1 is the only zone with actions.** If nothing needs the owner, zone 1 collapses to a single line — "Nothing needs you right now" — and does not occupy space. This is the difference between a product that respects attention and one that manufactures anxiety.

**Zone 3 carries the number that renews the subscription.** It is on the home screen, above the fold, every single visit, from the first week.

### 3.5 Home in each lifecycle state

The same screen, four different jobs:

| State | Zone 1 becomes | Rationale |
|---|---|---|
| **Not yet activated** | The activation checklist, with one highlighted next step and progress shown as partially complete | G1 and G3. The user has exactly one thing to do |
| **Activated, no traffic yet** | "Your agent is ready and listening" with a sample conversation and a "test it again" action | G6. Never a blank screen. Never silence that reads as broken |
| **Live and healthy** | Items needing attention, or a collapsed "nothing needs you" | The steady state |
| **Something is broken** | A red connection-health banner above everything, with one repair action | G19. A disconnected channel outranks every other message |

---

## 4. Conversations — the unified inbox

The IA idea nobody in the category has shipped.

```
  CONVERSATIONS
  ├── Filters:  [All] [Needs you] [Calls] [Messages] [Escalated] [Today]
  ├── Search:   name · number · what was said
  │
  └── Conversation list  (channel is an icon, not a category)
        │
        └── Conversation detail
              ├── Header:  who · which channel · when · outcome · [Take over]
              ├── Transcript, turn by turn, labelled AI or human
              ├── "Why did it say that?" trace  (expandable, per turn)
              ├── Actions taken:  booking created, lead captured, message sent
              ├── Notes and tags
              └── ★ CUSTOMER TIMELINE ★
                     every prior interaction with this person,
                     across every channel, in one list
```

**The customer timeline is the differentiator.** Marie called on Tuesday and messaged on WhatsApp on Thursday. That is **one relationship**, and it is how the owner thinks. Every competitor keeps call logs and chat threads in separate products. Identity is resolved primarily on phone number — which conveniently covers voice, WhatsApp and SMS — with Instagram and Messenger identities linked only when the customer volunteers a number. **A wrong merge is worse than no merge**, so weak-signal merging is never automatic.

---

## 5. My Agent — configuration

Four tabs, one object.

```
  MY AGENT                                 [ ● Live ]  [ Pause ]
  ├── Behaviour     who it is, what it does, when it stops
  ├── Knowledge     what it knows about your business
  ├── Voice         how it sounds
  └── Languages     which languages, and how it switches
```

### 5.1 Behaviour — basic and advanced on the same agent

The competitor research found that every visual-flow product — Retell, Synthflow, Bland — forces the choice between "simple prompt" and "visual flow" **at agent creation, permanently**. A business that starts simple and grows must rebuild. Meanwhile Retell's own documentation warns that single prompts drift and become unreliable past roughly 1,000 words or five functions.

Subiza resolves this: **one agent, two views of the same configuration.**

| Mode | What the owner sees | Who it is for |
|---|---|---|
| **Simple** (default) | A structured form: who the agent is, how it should sound, what it must always do, what it must never do, when to fetch a human, opening hours | Every owner, day one |
| **Advanced** (toggle) | The same configuration rendered as named conversation stages — Greeting, Answer a question, Take a booking, Take a message, Hand to a person — each with its own rules and its own available tools | Owners who outgrow simple, and our own support team |

The stages are **named things a shop owner recognises**, not nodes on a canvas. Switching between modes never loses configuration, because both are views of one underlying structure.

### 5.2 Rules, not prose

"Never quote a price for a wedding party" as a sentence in a prompt is a hope. As a rule attached to a stage where the pricing tool is simply not available, it is a guarantee.

Subiza's Behaviour tab therefore has **categorised rule fields** rather than one free-text box:

| Category | Example |
|---|---|
| How to speak | Short answers. Warm. Use the customer's name if you know it |
| Always do | Say the price only from the price list. Confirm a booking by repeating it back |
| Never do | Discuss competitors. Promise a discount. Give medical advice |
| Get a person when | Someone is upset. A booking is over 5 people. Anyone asks for the owner |
| Out of scope | Anything not about this business — deflect politely |

Two mechanisms make this stronger than prompting alone: **tool scoping** (the price tool is unavailable in stages where quoting is not allowed) and a **contradiction check** that reviews the rule set before publishing and flags conflicts — a pattern Intercom ships and which prevents the most common self-inflicted failure.

### 5.3 Knowledge — including the thing nobody supports

Sources: photograph a price list (OCR), type or paste, upload a document, import from a website or Instagram profile, structured price and service tables.

**Structured tables are first-class, and this is a genuine gap in the market.** Every competitor forces a price list into an unstructured PDF or text blob — which is exactly where hallucinated numbers come from. In Subiza a price is a typed field with a value and a currency, answered directly, never generated.

The Knowledge tab also carries the **pronunciation dictionary**, which in this market is not an advanced setting but a required one: Kinyarwanda is not among the languages supported by mainstream commercial TTS, so business names, place names and personal names will be mispronounced by default. A simple two-column *word → how to say it* table, editable by anyone, sits directly in onboarding.

---

## 6. Connections — where health is visible

```
  CONNECTIONS
  ├── 📞 Phone            ● Working    +250 78x xxx xxx → forwarded
  ├── 💬 WhatsApp         ● Working    Quality: green · Tier: 1,000/day
  ├── 📷 Instagram        ⚠ Action needed — reconnect
  ├── ✈ Telegram          ○ Not connected
  ├── ✉ SMS               ○ Not connected
  └── 🌐 Website chat     ○ Not connected
```

Four states per channel, and the state must be honest:

| State | Meaning | Action shown |
|---|---|---|
| **● Working** | Verified within the last hour | — |
| **⚠ Action needed** | Token expired, revoked, quality degraded, or verification pending | One button, one instruction |
| **○ Not connected** | Available, not set up | "Connect" with a one-line benefit |
| **⊘ Unavailable** | Not available for this business or region | Plain explanation, no dead button |

**Why Connections is top-level:** every messaging platform's default failure mode is *silent*. Tokens expire around 60 days and are not auto-renewed; revocation is generally not pushed to third-party apps; a Telegram Business Bot can be paused per-chat with no notification at all. If a channel dies quietly, the business stops receiving customers and blames Subiza. Making health continuously visible is the mitigation.

---

## 7. Admin console — navigation

```
   SUBIZA ADMIN
   ├── ⌂ Operations         the platform's home dashboard
   ├── 🏢 Tenants           directory, detail, lifecycle, impersonation
   ├── 🚦 Onboarding Ops    the stuck-tenant queue
   ├── ☎ Numbers & Channels number inventory, WABA status, provider health
   ├── 🧠 AI Operations     models, prompts, evaluations, rollout, cost
   ├── 🔍 Quality           review queue, sampling, annotation, regression sets
   ├── 🛡 Trust & Safety    policy violations, voice consent queue, suspensions, appeals
   ├── ⚖ Compliance         DSARs, consent registry, residency, retention, breach
   ├── 💰 Billing           credits, invoices, reconciliation, refunds
   └── 📜 Audit             every consequential action, immutable
```

**Two of these are unusual and deliberate:**

**Onboarding Ops** as a first-class section. The competitor research found that essentially every severe friction complaint in this category sits not in the agent builder but in the compliance and verification layers underneath — carrier KYC, Meta Business Verification, number provisioning. Nobody treats "tenants stuck in onboarding" as an internal product. Subiza does: a queue of tenants stalled at a named step, each with an assigned specialist and a next action. In a market where Meta verification takes 5–15 business days and number provisioning needs local liaison, this queue *is* the onboarding experience.

**Voice-consent verification** inside Trust & Safety. Industry norm for voice cloning is a checkbox self-attestation. Given Rwandan law treats voiceprints as sensitive biometric data with criminal penalties, Subiza verifies — and verification needs a human queue.

---

## 8. Cross-cutting IA elements

| Element | Where it appears | Behaviour |
|---|---|---|
| **Agent status pill** | Header of every business-console screen | Live / Paused / After-hours only / Review mode. Tappable to change |
| **Credit balance** | Header of every business-console screen | Turns amber below 20% and red below 5% |
| **Language switcher** | Header, every screen, both consoles | Instant, no reload, remembered per user (G15) |
| **Kill switch** | Header and every conversation | Pause the AI now (G9) |
| **Connection health dot** | Header, aggregated | Green all healthy; amber any channel needing action |
| **Impersonation banner** | Admin only, when active | Distinct frame, target tenant, countdown, end-session button |
| **The single next action** | Home, and any incomplete flow | Exactly one recommendation (G1) |

---

## 9. Responsive behaviour

| Breakpoint | Layout |
|---|---|
| **< 480px** (primary) | Bottom bar: Home, Conversations, Agent, More. Single column. Sheets instead of modals |
| **480–1024px** | Same, wider cards, two-column where content allows |
| **> 1024px** | Left sidebar navigation; conversation list and detail side by side |

**Performance budget, enforced in CI:** first meaningful paint under 3 seconds on a simulated 3G connection on a mid-range Android; initial page weight under 200 KB compressed; no autoplaying media anywhere; images lazy-loaded and aggressively compressed. This is not an optimisation goal — for a user whose data may cost a meaningful share of their income, page weight is a price.

---

## 10. Success criteria

| # | Criterion | Test |
|---|---|---|
| 2.1 | An owner can reach any core task in ≤3 taps from Home | Task-based usability test, 8 tasks, ≥90% success |
| 2.2 | Channel health is visible without navigating to Connections | Aggregated indicator present on every screen |
| 2.3 | The kill switch is reachable in one tap from any screen | Manual audit of every screen |
| 2.4 | Voice and chat conversations appear in one list, in one timeline per customer | Functional test with a customer who used both |
| 2.5 | Simple ↔ Advanced switching loses no configuration | Round-trip test with a fully configured agent |
| 2.6 | First meaningful paint < 3s on simulated 3G, mid-range Android | Automated performance test in CI |
| 2.7 | Language switch applies instantly, everywhere, with no reload | Functional test across all four languages |
| 2.8 | No screen in either console can be blank without explanation and an action | Screenshot audit of every empty state |

---

## 11. Open questions

| # | Question | Blocks |
|---|---|---|
| 2.a | Does "Results" outperform "Analytics" with Rwandan SME owners, or is the English word already familiar? | Naming, minor |
| 2.b | Is a bottom bar of four right, or should Credit be permanently visible given prepaid billing? | Mobile navigation |
| 2.c | Should Advanced mode exist in v1 at all, or ship Simple only and add it when a customer demands it? | Scope |
| 2.d | Do owners want a per-customer timeline, or is it a feature we find compelling and they ignore? | Test in pilot |
| 2.e | Does the admin console need mobile support for on-call staff, or is desktop-only acceptable? | Admin scope |

---

*Next: [03 — Master Flow Map](03-master-flow-map.md)*
