# 04 — Solution & Product Definition

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. The solution in one sentence

**Subiza is a multi-tenant AI customer-service platform that answers a business's phone calls and messages automatically, in the customer's own language, grounded in the business's own information, and capable of taking action — configured by the business owner in under an hour, on their existing phone number, paid for by mobile money.**

Every clause is load-bearing. If any one is dropped, the product either fails to work in this market or fails to differentiate from something that already exists.

---

## 2. Product principles

These are the decisions that resolve every future argument about scope. When a feature request arrives, it is tested against these.

| # | Principle | What it rules out |
|---|---|---|
| **P1** | **The phone call is the product.** Chat is essential and must be excellent, but voice is the wedge, the moat and the reason to exist. | Becoming another WhatsApp automation tool with a voice add-on |
| **P2** | **Answer correctly or escalate. Never invent.** A wrong price destroys more trust than an unanswered call. | Ungrounded generative answers; "helpful" guessing |
| **P3** | **The business owner must never need an engineer.** Setup, knowledge, voice, hours, escalation — all configurable in a browser by someone who runs a shop. | Anything requiring an API key, a webhook URL, or a developer |
| **P4** | **Do not change what already works.** Keep the number. Keep WhatsApp. Keep the way customers already reach them. | Number porting as a prerequisite; forcing new channels on customers |
| **P5** | **Local language is not a feature, it is the premise.** | Launching Kinyarwanda as "coming soon" and treating English as the real product |
| **P6** | **Every conversation must be legible in 30 seconds.** The owner reads a summary, not a transcript, and knows what needs them. | Analytics dashboards nobody opens |
| **P7** | **A human is always one step away.** For the caller and for the owner. | Trapping a frustrated customer in an AI loop |
| **P8** | **Disclose that it is AI. Always.** | Impersonating a named human; letting a caller believe they spoke to a person |
| **P9** | **Cost per conversation must be engineered, not accepted.** Every architectural decision is also a margin decision. | Building on the most convenient API and discovering the unit economics later |
| **P10** | **Consent, provenance and audit are built in from the first call.** | Retrofitting compliance after launch |

---

## 3. Users and personas

There are four distinct human roles. Only one of them pays, and a different one determines whether the product succeeds.

### 3.1 Primary buyer — **Claudine, the owner-operator**

*Runs a beauty salon in Remera with three staff. 34. Uses WhatsApp constantly, Instagram for before-and-after photos, and a paper booking book. Her phone is her business.*

- **Wants:** to stop losing bookings to the phone ringing while she is doing someone's hair. To not lose the Saturday rush.
- **Fears:** that it will sound like a robot and embarrass her in front of customers; that it will be complicated; that she will be charged for something she does not use.
- **Buys when:** she sees a transcript of a real booking her AI took at 8pm on a Sunday, on her own number, in Kinyarwanda.
- **Churns when:** a customer complains that "the machine did not understand me," or the monthly charge arrives before the value does.
- **Pays by:** MTN MoMo. She does not have a card and does not want a bank process.

### 3.2 Primary end user — **Jean-Baptiste, the caller**

*Wants to know if the salon is open on Sunday and how much braids cost. Calls from a feature phone on a moto with wind noise. Speaks Kinyarwanda, occasionally dropping in English words for prices and days.*

- **Wants:** an answer, in under a minute, without repeating himself.
- **Tolerates:** an AI, if it is fast and correct and says it is an AI.
- **Abandons in:** roughly 1.5 seconds of silence, or two failed attempts to be understood.
- **Design implication:** he is the real user. Claudine buys the product, but Jean-Baptiste decides whether it works. Every latency and ASR-accuracy decision is made for him.

### 3.3 Secondary user — **Aline, the staff member**

*Works the front desk at a small clinic. Currently answers 60 repetitive calls a day.*

- **Wants:** to stop answering "what time do you open" and do the work that needs a person.
- **Fears:** being replaced.
- **Design implication:** the handover experience is designed for her. She sees context, not a cold transfer. Subiza makes her more valuable, and the product must visibly say so or she will route around it.

### 3.4 Tertiary — **the reseller / agency**

*A Kigali digital-marketing agency managing social media for 15 SMEs.*

- **Wants:** to add a high-margin service without hiring.
- **Design implication:** multi-business management, white-label options and reseller billing are architected for from the start (cheap now, expensive to retrofit) but not marketed until Phase 3.

---

## 4. Journeys

### 4.1 The caller's journey — voice (the critical path)

```
  Customer dials Claudine's usual number
        │
        │  (a) she answers within 20s ──────────► normal human call, Subiza never involved
        │
        ▼  (b) busy / no answer / phone off
  MTN forwards the call to Subiza's number    ◄── conditional forwarding, **61# / **67# / **62#
        │
        ▼
  Subiza answers within 1 ring
        │
        ▼
  GREETING + AI DISCLOSURE + LANGUAGE OFFER
  "Muraho, ni Subiza, umufasha wa [Salon].       ← under 4 seconds, in Kinyarwanda,
   Ndi umufasha w'ikoranabuhanga.                   with the business's chosen voice
   Nabafasha nte?"
        │
        ▼
  Caller speaks ──► IJWI transcribes (streaming, partial results)
        │
        ▼
  Turn detected (semantic, not just silence)
        │
        ▼
  UBWENGE: classify intent · retrieve from Claudine's knowledge · decide
        │
        ├──► ANSWER  ("Twafungura saa mbiri za mu gitondo kugeza saa kumi n'ebyiri.")
        │
        ├──► ACT     (book the appointment, capture the lead, take the order)
        │
        ├──► ESCALATE (ring Claudine; if she does not pick up, take a message
        │              and promise a callback with a specific time)
        │
        └──► DEFLECT  (out of scope: "Ibyo ngibyo nzabibabaza nyirubwite...")
        │
        ▼
  TTS streams the reply back into the call  ── target: first syllable within 800 ms
        │
        ▼
  Loop until the caller's need is met or a human takes over
        │
        ▼
  Call ends
        │
        ├──► Structured summary written to Claudine's inbox
        ├──► WhatsApp follow-up sent to the caller if promised
        ├──► Booking written to the calendar
        └──► Recording + transcript stored under the retention policy
```

**Barge-in is mandatory.** If the caller starts speaking while the AI is talking, the AI stops immediately. Without this, the experience is an IVR, and people hate IVRs.

### 4.2 The caller's journey — WhatsApp

Same reasoning core, different constraints. Message arrives via Meta Cloud API webhook → identity resolved → AI disclosure on first contact in a session → response within seconds → same intents, same actions, same escalation. Two channel-specific behaviours matter:

- **Voice notes are first-class.** In East Africa a large share of WhatsApp customer messages are voice notes, driven by literacy patterns and the fact that many local languages are more spoken than typed. Subiza transcribes the note, reasons over it, and replies with **both text and a synthesised voice note** in the same language. This is not a nice-to-have; for many customers it is the only comfortable way to communicate.
- **The 24-hour window governs everything.** Free-form replies only inside 24 hours of the customer's last message; approved templates outside it. Full mechanics in [Document 08](08-messaging-channels.md).

### 4.3 The caller's journey — Instagram

Comment on a post → automated public reply → DM opened (which also opens the 24-hour window) → conversation continues in the same reasoning core. This is the mechanic ManyChat built a business on; Subiza treats it as one channel among several rather than the whole product. Note that Instagram has **no template equivalent** — once the window closes, there is no paid way back in, so time-sensitive follow-ups must migrate to WhatsApp or SMS.

### 4.4 The owner's journey — onboarding in under an hour

The single most important product surface. If this takes longer than an hour, or requires help, the business does not convert.

| Step | Time | What happens |
|---|---:|---|
| 1. Sign up | 2 min | Phone number + OTP. No email required, no card, no password if possible |
| 2. Describe the business | 5 min | Name, type, location, hours, languages. Guided, in Kinyarwanda or English |
| 3. Load knowledge | 10 min | Three routes: (a) paste or type prices and FAQs; (b) upload a photo of a price list or menu, read by OCR; (c) point at a website or Instagram profile and let Subiza extract. **Route (b) matters most** — most Rwandan SMEs have a laminated price list, not a website |
| 4. Choose a voice | 5 min | Pick from a Kinyarwanda/English/French/Swahili library, or record 60 seconds to clone the owner's own voice — **with explicit recorded consent** ([Doc 09 §3](09-legal-regulatory-ethics.md)) |
| 5. Test call | 5 min | Subiza calls the owner. She talks to her own agent, hears it, corrects it in the console, tries again |
| 6. Set escalation | 3 min | Which number to ring, when, and what to say if nobody answers |
| 7. Connect the phone | 5 min | Subiza displays the exact forwarding code to dial, per network, with a picture. She dials it. Subiza verifies with a test call |
| 8. Connect WhatsApp | 10 min | Meta Embedded Signup flow, optional and skippable |
| **Total** | **~45 min** | Live |

**Design constraints on this flow:** every step must be skippable and resumable; the whole flow must work on a phone browser, not just desktop; and it must be completable by someone reading Kinyarwanda. If a step cannot meet those constraints, it does not belong in onboarding — it belongs in settings.

### 4.5 The owner's daily journey

Not a dashboard. A **feed**, on a phone.

```
  TODAY                                          [ 12 conversations ]

  🔴 NEEDS YOU (2)
     Marie K. · 14:22 · call · asked for a group booking
        for 8 people Saturday — outside your normal slots
        [ Call back ]  [ Reply on WhatsApp ]  [ Mark done ]

     +250 78x xxx xxx · 09:10 · WhatsApp · complaint about
        a previous appointment
        [ Open ]

  ✅ HANDLED (10)
     3 bookings taken · 5 price questions · 2 opening-hours

  📈 THIS WEEK
     47 conversations answered
     31 would have been missed before Subiza      ← the number that renews the subscription
     9 bookings created
     Busiest hour: Saturday 09:00–10:00
```

The line **"31 would have been missed before Subiza"** is the most commercially important element of the entire product. It is computed from calls answered outside the business's stated staffed hours, plus calls that arrived while the business's own line was busy or unanswered. It converts an invisible benefit into a visible number, and it is what makes the subscription renew.

---

## 5. Capability specification

### 5.1 Channels

| Channel | Phase | Direction | Notes |
|---|---|---|---|
| Voice — inbound via call forwarding | 0 | In | The wedge. Business keeps its number |
| Voice — inbound on a Subiza number | 1 | In | For businesses wanting a dedicated line |
| WhatsApp — text | 1 | In/out | Cloud API, Tech Provider model |
| WhatsApp — voice notes | 1 | In/out | Transcribe in, synthesise out |
| Telegram | 1 | In/out | Free, simplest integration, good for testing |
| SMS | 2 | In/out | Feature-phone reach; local aggregator, never a global API (RWF ~6 vs \$0.33 per message) |
| Instagram DM + comment-to-DM | 2 | In/out | Requires a professional account |
| Facebook Messenger | 2 | In/out | Shares Instagram's infrastructure and policy |
| Web chat widget | 2 | In/out | For businesses with a website |
| USSD | 3 | In | Zero-internet reach for feature-phone customers |
| Voice — outbound | 3 | Out | **Deliberately last.** High regulatory risk ([Doc 09 §5](09-legal-regulatory-ethics.md)); strict opt-in only |
| WhatsApp calling | 3 | In/out | Meta's Business Calling API; SIP or WebRTC signalling; limits apply |

### 5.2 Conversation capabilities

| Capability | Description | Phase |
|---|---|---|
| **Greet and disclose** | Business-specific greeting, AI disclosure, language offer, in the business's chosen voice | 0 |
| **Understand** | Streaming ASR with partial results, semantic turn detection, barge-in, noise tolerance on 8 kHz audio | 0 |
| **Language detection and switching** | Detect Kinyarwanda / English / French / Swahili and code-switching; follow the caller's lead mid-conversation | 1 |
| **Answer from knowledge** | Hybrid retrieval over the tenant's own content; short spoken answers (1–2 sentences); citation to source internally | 0 |
| **Refuse and escalate** | Below a retrieval-confidence threshold, hand to a human rather than generate | 0 |
| **Capture a lead** | Name, number, need, urgency — structured, validated | 0 |
| **Book an appointment** | Check availability, offer slots, confirm, write to calendar, send confirmation | 1 |
| **Take an order** | Items, quantity, delivery location, payment method; confirm by reading back | 2 |
| **Check status** | Order/booking/file status via a tenant integration | 2 |
| **Transfer to a human** | Warm transfer with spoken context, or ring-and-brief | 1 |
| **Take a message** | When no human is available, capture and promise a specific callback time | 0 |
| **Follow up** | Post-conversation WhatsApp or SMS with the promised information | 1 |
| **Remember the customer** | Recognise a returning caller and their history | 2 |
| **Collect payment** | MoMo payment request initiated in conversation | 3 |
| **Handle DTMF** | Keypad input for language choice and menu fallback; essential for degraded ASR conditions | 1 |

### 5.3 Subiza Studio — the owner's console

| Area | Capabilities |
|---|---|
| **Agent designer** | Persona and tone, greeting, languages, business hours, what the agent may and may not discuss, escalation rules, out-of-hours behaviour |
| **Knowledge** | Type/paste, upload documents, photograph a price list (OCR), import from a website or Instagram, structured price and service tables, FAQ pairs, versioning and rollback |
| **Voice** | Voice library by language and gender, cloning studio with consent capture, speed and style controls, preview |
| **Inbox** | Unified feed across all channels, filters, search, live takeover mid-conversation, notes, tagging |
| **Analytics** | Conversations, intents, resolution rate, escalation rate, missed-calls-recovered, busiest hours, language mix, top questions, customer satisfaction |
| **Testing** | Call-me-now test, scripted regression scenarios, a "why did it say that?" trace for any turn |
| **Team** | Invite staff, assign escalation numbers and hours, roles and permissions |
| **Billing** | MoMo top-up, plan and usage, alerts before running out of credit |
| **Compliance** | Consent records, retention settings, data export, deletion requests |

### 5.4 Explicit non-goals for v1

Stating these prevents scope drift and disappointment.

- **Not a CRM.** Integrates with sheets and simple tools; does not attempt to be a system of record.
- **Not an outbound calling platform.** Regulatory risk plus reputational risk plus a completely different sales motion. Deferred to Phase 3 with strict opt-in.
- **Not a general assistant.** The agent answers about *this business*. Deliberately narrow — and also a Meta policy requirement on WhatsApp.
- **Not a developer platform.** An API exists for integrations, but the product is sold to shop owners, not developers. Competing with Vapi and Retell is explicitly rejected in [Document 03](03-competitive-landscape.md).
- **Not a call-centre replacement for enterprises.** Enterprise features (workforce management, complex routing, compliance recording at scale) are out of scope until the SME product is unambiguously working.
- **No voice cloning without verified consent.** Not a feature limitation — an ethical and legal boundary.

---

## 6. The escalation model

Escalation is not an error path. It is the feature that makes the product safe to deploy, and it must be designed with the same care as the happy path.

**Triggers**
1. Retrieval confidence below threshold — the agent does not know.
2. Explicit request — "I want to speak to a person." Must always work, on any channel, at any point.
3. Detected frustration — repetition, raised voice, repeated failures to be understood.
4. Sensitive intent — complaints, refunds, anything the owner has flagged.
5. High-value intent — large orders, VIP customers.
6. Repeated ASR failure — three failed understanding attempts.
7. Out-of-policy — anything the agent is instructed not to handle.

**Modes**
- **Warm transfer** — the agent stays on, calls the human, briefs them in one sentence, then bridges. Best experience, requires the human to be available.
- **Ring and brief** — the agent puts the caller on hold, rings the escalation number, plays a spoken summary, then connects.
- **Message and promise** — no human available: capture the need, state a specific callback window ("before 11 tomorrow morning"), notify the owner immediately by WhatsApp and push.
- **Silent handover** — on chat, a human takes over in Studio; the customer sees a natural continuation, not a jarring "an agent has joined."

**The rule that must never be broken:** the caller is never left in a loop. If the agent cannot help and no human is available, it takes a message and ends gracefully — always better than a machine that will not let go.

---

## 7. Trust, safety and the experience of talking to an AI

### 7.1 Disclosure

Every conversation opens with an unambiguous statement that this is an AI assistant for the named business. Non-skippable, in the conversation language, logged as a compliance event. This anticipates the EU AI Act's Article 50 transparency obligation (applying from 2 August 2026), aligns with FCC treatment of AI voices in the US, and — more importantly — is simply how a trustworthy product behaves.

**Subiza never impersonates a named human.** A cloned voice may be the owner's own, with her recorded consent, but the agent still identifies itself as an assistant. The line between "Claudine's salon's assistant, using Claudine's voice, saying it is an assistant" and "pretending to be Claudine" is the line between a product and a fraud tool.

### 7.2 Grounding and refusal

The agent answers only from the tenant's knowledge base. Concretely:
- Retrieval below a relevance threshold triggers refusal-and-escalate rather than generation.
- Prices, availability and policies are answered from structured fields, never generated prose.
- High-frequency intents are served by pre-approved answers the owner has reviewed, not by generation at all.
- Every answer carries an internal citation so the owner can ask "where did that come from?" in Studio.

### 7.3 The sound of the thing

Product decisions that determine whether people accept it:
- **Short answers.** One or two sentences. Long spoken answers are unbearable and expensive.
- **Natural disfluency, sparingly.** A brief acknowledgement while retrieving ("Reka mbirebe...") covers latency and sounds human. Overused, it is grating.
- **Interruptible always.**
- **No hold music without explanation.**
- **Fail gracefully.** "I did not catch that" twice, then "let me get someone" — never a fourth attempt.

---

## 8. Success metrics

### 8.1 Product health

| Metric | Definition | Target |
|---|---|---|
| **Answer rate** | Calls answered / calls received | > 99% |
| **Time to first audio** | Ring to greeting starting | < 2 s |
| **Turn latency p50 / p95** | Caller stops speaking → first syllable of reply | < 800 ms / < 1,200 ms |
| **Containment rate** | Conversations resolved without human escalation | > 70% by end of Phase 1 |
| **ASR word error rate** | On real 8 kHz Rwandan telephone audio, per language | Baseline in Phase 0, then reduce |
| **Understanding failure rate** | Conversations with ≥3 clarification requests | < 5% |
| **Abandonment rate** | Callers hanging up in the first 15 seconds | < 10% |
| **Escalation SLA** | Escalations reaching a human or a logged message | 100% |
| **Hallucination incidents** | Answers not supported by the knowledge base | Zero tolerance; every one investigated |

### 8.2 Business health

| Metric | Target |
|---|---|
| **Missed calls recovered per business per month** | > 20 — the core value metric |
| **Time to first value** (signup → first real conversation handled) | < 24 hours |
| **Onboarding completion rate** | > 60% of signups reach a live agent |
| **Monthly logo churn** | < 5% |
| **Gross margin per conversation minute** | > 60% by Phase 3 |
| **Net revenue retention** | > 100% via usage growth and channel expansion |

### 8.3 The one metric that matters

**Missed calls recovered.** It is the number the owner feels, the number that justifies the price, the number that survives a bad month, and the number that a competitor selling "AI-powered engagement" cannot show. Every dashboard leads with it.

---

## 9. What Subiza looks like in three years

Not a roadmap — a description of what success looks like, to keep the near-term decisions pointed somewhere.

- **Thousands of African SMEs** whose phones are never unanswered, in Rwanda, Kenya, Uganda, Tanzania and beyond.
- **The best Kinyarwanda conversational speech system in existence**, built from consented real-world telephone audio nobody else has, contributed back in part to the open ecosystem that made it possible.
- **A voice layer other products build on** — the fintech, the logistics company, the hospital chain, the government service that needs to talk to Rwandans in Kinyarwanda over a phone.
- **A business whose unit economics improve with scale** because inference is owned, telephony is local, and the language models are proprietary.
- **A demonstration** that world-class AI products for African markets can be built in Africa, by Africans, rather than imported at Western prices two years late.

---

*Next: [05 — System Architecture](05-system-architecture.md)*
