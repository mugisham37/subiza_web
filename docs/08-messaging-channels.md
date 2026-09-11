# 08 — Messaging Channels

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. Channel strategy

Voice is the wedge and the moat. Messaging is what makes Subiza a complete answer to the business's problem rather than a phone accessory — and, in the earliest phase, it is what makes the product sellable at all, because WhatsApp is where Rwandan business communication already lives.

The channels differ enormously in cost, control and risk, and that difference should drive the build order:

| Channel | Cost | Integration difficulty | Policy risk | Reach in Rwanda | Build phase |
|---|---|---|---|---|---|
| **Telegram** | Free | Low | Very low | Small | **1 — build first** |
| **WhatsApp** | Per-message, rising Oct 2026 | High | **High** | Very high | 1 |
| **SMS** | ~RWF 6 locally | Medium | Medium (RURA rules) | Universal | 2 |
| **Instagram** | Free messaging | Medium | High | ~456,000 users | 2 |
| **Messenger** | Free messaging | Medium (shares IG infra) | High | ~1.3 M users | 2 |
| **Web chat** | Free | Low | None | Businesses with websites | 2 |
| **USSD** | Session fees + RURA fees | High | Medium | **Universal, including feature phones** | 3 |

**Build Telegram first.** It is free, has no approval process, no windows, no templates and no policy minefield — which makes it the ideal channel to prove the messaging half of the reasoning core before entering Meta's ecosystem. Nothing about the intent handling, retrieval, escalation or inbox is channel-specific; only the adapter is.

---

## 2. WhatsApp Business Platform

The highest-value channel and by a wide margin the most complex. This section is deliberately detailed because a mistake here can get a customer's business number banned.

### 2.1 Account structure and the multi-tenant path

```
   Meta Business Manager (business portfolio)
        └── Business Verification
             └── WhatsApp Business Account (WABA)
                  └── Registered business phone number + display name
```

For a multi-tenant SaaS, each client business needs its own WABA (or a WABA it owns), with Subiza's Meta app granted access to it.

**Embedded Signup** is the standard onboarding flow: Subiza embeds a Meta-hosted popup in its own signup page. The business owner authenticates with Meta, accepts the terms, creates or selects a business portfolio and WABA, enters and verifies a phone number by OTP, sets a display name, and grants Subiza's app access. Subiza's server then exchanges the returned token for a long-lived system-user token scoped to that WABA.

**Onboarding rate limit:** 10 new customers per rolling 7 days by default, expandable to **200 per 7 days** once Subiza completes Business Verification and Meta App Review for **Advanced Access** to `whatsapp_business_management` and `whatsapp_business_messaging`.

### 2.2 Is a BSP still required?

**No.** Meta now distinguishes three tiers, and none is a hard gate on direct Cloud API use:

| Tier | Requirement | What it enables |
|---|---|---|
| **Tech Provider** | Business verification + App Review for the two Advanced Access permissions | **The minimum to build a multi-tenant SaaS on the Cloud API.** Each client attaches their own payment method; Meta bills the client for messaging, Subiza bills separately for software |
| **Tech Partner / Meta Business Partner** | Tech Provider plus additional criteria | Badge, partner programmes and incentives |
| **Solution Partner** (successor branding to "BSP") | Heavier requirements | Can extend credit and invoice clients directly for WhatsApp usage; clients never touch a Meta billing relationship |

**Decision: register as a Tech Provider.** Solution Partner status is worth revisiting later purely for billing convenience — being able to bundle WhatsApp usage into a single MoMo-payable invoice would be a real UX improvement for Rwandan SMEs, since asking a shop owner to attach a payment method to Meta Business Manager is a genuine conversion obstacle. Flag this as a Phase 2–3 evaluation.

### 2.3 The messaging window and entry points

- **24-hour customer service window.** Free-form (non-template) messages may only be sent within 24 hours of the customer's last inbound message. Outside it, only approved templates.
- **72-hour free entry-point window.** When a conversation originates from a Click-to-WhatsApp ad or a Facebook Page CTA, all message types are free for 72 hours.
- **Templates** are categorised **Marketing**, **Utility** or **Authentication**, and each must be submitted for Meta review before use. Common rejection causes: promotional language in a Utility-categorised template, missing variable examples, and policy violations.

### 2.4 Pricing — and the change happening this month

The pricing model has changed twice recently and changes again imminently. This must be modelled correctly or the unit economics are wrong.

| Date | Change |
|---|---|
| 1 Nov 2024 | Service (user-initiated free-form) conversations became **free** |
| 1 July 2025 | Moved from **conversation-based** to **per-message** pricing for templates |
| 1 Apr 2026 | Regional rate card refresh |
| 1 Jul 2026 | Further regional rate changes |
| **1 Oct 2026** | ⚠️ **Service messages and utility templates become billable again.** Each WABA phone number receives **1,000 free service messages per month**; message 1,001 onward is billed at the recipient country's utility-template rate. No rollover. Marketing and authentication templates are unaffected |

**This is four weeks away as of the date of this document.** Every WhatsApp cost projection must assume the post-October model.

**Rwanda-specific rates** (via a provider rate card that passes through Meta's fee):

| Category | Meta fee (Rwanda) |
|---|---|
| Utility template | \$0.0034/message |
| Authentication template | \$0.0034/message |
| **Marketing template** | ⚠️ **Reported as not permitted in this region** — could not be corroborated on Meta's own materials |
| WhatsApp calling, outbound | \$0.01030/min (Meta) |

**The marketing-template restriction, if real, is significant** — it would mean no promotional broadcast campaigns are possible for Rwandan WABAs via template. It must be verified directly from a live Meta Business Manager account for a Rwandan number ([Doc 13](13-open-questions-and-validation.md)). For Subiza this is less damaging than it sounds, because the product is inbound customer service, not outbound marketing — but it constrains any future campaign feature and it changes what can be promised to customers.

Note also that older sources citing a conversation-based figure (around \$0.0325 per 24-hour session for Rwanda) are **stale and superseded** by the July 2025 per-message switch.

### 2.5 Messaging limits and quality rating

- New business portfolios start at **250 business-initiated messages per 24 hours** (unique recipients).
- Tiers scale to 2,000, then auto-scale if the business sends high-quality messages across all numbers and templates **and** uses at least 50% of its current limit in the last 7 days.
- Moving off the initial tier typically requires roughly 2,000 delivered messages to unique numbers outside customer-service windows using high-quality templates.
- A **quality rating** reflects block and report rates. Sustained low quality caps or reduces the tier and can pause templates.

**Product consequence:** a new Subiza tenant cannot immediately send at volume. Onboarding must set this expectation, and the product should surface quality rating and messaging tier to the owner so a degradation is visible before it becomes a suspension.

### 2.6 Opt-in

A business must clearly state that the person is opting in and identify itself by name. Approved collection methods include SMS, website, IVR and in-person or paper. **Meta places the compliance obligation on the business, not on the platform** — and there is no carve-out for a tech provider collecting consent on a client's behalf.

**This is a structural compliance exposure for any multi-tenant platform**, and it must be addressed in product rather than in terms and conditions:
- Onboarding includes an explicit opt-in configuration step with guidance and templates.
- Subiza provides opt-in collection mechanisms (a QR code, a web form, an IVR opt-in prompt) so the business has a compliant method rather than improvising one.
- Tenant-level monitoring flags patterns consistent with sending to non-opted-in contacts.

### 2.7 The AI policy — the biggest single platform risk

Meta began enforcing a ban on **general-purpose AI chatbots** on WhatsApp: rollout began **15 October 2025** for new users and **15 January 2026** for all existing users. Open-domain assistants that treat WhatsApp merely as a distribution channel are prohibited.

**Business-specific AI remains allowed** — support, order tracking, bookings, lead qualification, authentication, reminders — provided it:
- operates under a verified business number,
- maintains clear escalation paths to a human,
- and functions as a supporting feature rather than the centrepiece of the interaction.

Meta's own AI additionally requires in-chat disclosure and offers users `/reset-ai` and `/download-ai-info` commands.

**Architectural consequences, which are already stated as constraints in [Document 05](05-system-architecture.md):**

1. Agents are **scoped by construction** — the retrieval boundary and system policy confine them to the tenant's business domain. Out-of-scope questions are deflected, not answered.
2. **Human escalation is always visible and always works**, on every WhatsApp conversation.
3. **AI disclosure** appears on first contact in every session.
4. Subiza never markets or ships a general-purpose assistant on WhatsApp.

This is not merely compliance. It happens to be the same design that principle P2 (answer correctly or escalate) requires anyway — the policy and the product philosophy point the same way.

### 2.8 What gets a WABA banned

Aggregated from practitioner sources rather than a single canonical Meta list:

- Low quality rating from sustained blocks and reports — usually caused by cold or unsolicited outbound.
- Marketing content disguised as Utility-category templates.
- Messaging users without valid opt-in.
- Prohibited content: gambling, adult content, counterfeit goods, unlicensed financial services, health misinformation.
- Spammy bulk outbound to numbers with no prior relationship.
- Registering a number previously flagged or banned on personal WhatsApp.
- Business name inconsistency across the WABA, template footer and legal registration.
- Violating the general-purpose chatbot rule.

**Mitigations built into the product:** per-tenant isolation of credentials, numbers and quality ratings; automated policy and quality monitoring with owner-visible alerts; opt-in enforcement in onboarding; template review assistance before submission; and never allowing a tenant to be dependent on WhatsApp alone.

### 2.9 WhatsApp Flows

Structured, multi-screen interactive forms rendered natively inside a WhatsApp chat — booking forms, surveys, catalogue and order flows, appointment scheduling. They avoid pushing users to an external web form, which in a low-bandwidth, low-trust context is a meaningful conversion improvement. Increasingly promoted as the 2026 best practice replacement for external forms.

**Subiza use:** structured intake where free text is unreliable — appointment booking, order forms, delivery address capture. Phase 2.

---

## 3. Telegram

The easiest channel and therefore the right one to build first.

| Aspect | Detail |
|---|---|
| **Cost** | Free — no per-message billing at all |
| **Integration** | `setWebhook` (HTTPS, valid certificate, ports 443/80/88/8443) or `getUpdates` long polling |
| **Rate limits** | ~1 message/second to a single private chat; 20 messages/minute in groups; ~30 messages/second aggregate for broadcast fan-out. A paid Stars-based boost unlocks up to 1,000 msg/s for bots with ≥100,000 Stars balance and ≥100,000 MAU, at 0.1 Stars per message beyond the free allotment |
| **File limits** | 20 MB download, 50 MB upload via the Bot API |
| **Capabilities** | Inline and reply keyboards, payments (Telegram Stars), voice message handling, inline queries, deep links, groups and channels, polls |
| **Telegram Business** | Business accounts get business hours and location, Quick Replies, Greeting Messages, Away Messages, chat tags, and **Business Bots** — a bot attached to a business account to automate incoming messages, with per-chat access control (e.g. exclude personal contacts, limit to new conversations) |

**Strategic note:** Telegram's reach in Rwanda is small relative to WhatsApp, so its commercial value is limited. Its engineering value is large: it is a zero-friction, zero-risk environment in which to build and prove the messaging adapter, the inbox, voice-note handling and escalation before touching Meta's approval processes. It is also genuinely useful for a subset of businesses — particularly those serving diaspora or tech-adjacent customers.

---

## 4. Instagram

The channel ManyChat built a business on, and stricter than it appears.

| Aspect | Detail |
|---|---|
| **Requirement** | An Instagram **professional** account (Business or Creator), connected via Instagram API with Instagram Login or the older Messenger-Platform route |
| **24-hour window opened by** | A DM, a **comment on your post**, a Story reply, or a reply in an existing thread |
| **Not opened by** | Passive views, ad clicks, likes |
| **Human Agent tag** | Extends to **7 days**, but "must be applied by a real human, not an automated system or bot" — using it from automation triggers API errors |
| **One-Time Notification** | A single follow-up after opt-in, strictly on-topic, maximum once per week per topic |
| **Ice Breakers** | Up to **4** preset starter questions |
| **Automation rate limit** | Reported at ~200 automated messages per hour per account (third-party source, not confirmed in Meta's own docs) |
| **No template equivalent** | ⚠️ **Once the window closes there is no paid way back in.** Unlike WhatsApp, Instagram offers no mechanism to reach a user outside the window |

**The comment-to-DM mechanic** — an automated public reply to a comment, which then opens a DM and with it the 24-hour window — is the highest-value Instagram capability and directly matches the founder's description of ManyChat. Subiza should implement it, with an important discipline: the public reply is visible to everyone, so it must be conservative, on-brand and never wrong.

**The Human Agent tag restriction has a real product consequence.** Subiza cannot use the 7-day extension from an automated flow. If a conversation needs follow-up beyond 24 hours, it must either be genuinely handled by a human in Studio (in which case the tag is legitimately applicable) or migrate to WhatsApp or SMS. The product must make this migration natural rather than leaving the conversation to die silently.

---

## 5. Facebook Messenger

Shares the 24-hour window and message-tag system with Instagram — Instagram's policy is essentially inherited from Messenger's older model, and both now sit under one combined policy document with a shared Graph API surface and Handover Protocol.

Two Rwanda-relevant points:
- **Marketing messages outside the 24-hour window are geographically restricted** to the EU, UK, Japan, South Korea and Australia. Rwanda and East Africa are not included, so Messenger marketing broadcast outside the window is effectively unavailable.
- Meta is shutting down the Messenger.com web client in April 2026, continuing the Instagram/Messenger infrastructure convergence.

Messenger is a low-cost addition once Instagram is built, given the shared infrastructure. It is not a priority in Rwanda, where Facebook has roughly 1.3 million users but WhatsApp dominates business communication.

---

## 6. SMS and USSD

### 6.1 SMS — and a costly trap

| Route | Rwanda rate | Note |
|---|---|---|
| **Local aggregator** (Africa's Talking, or MTN/Airtel direct) | ~**RWF 6/SMS** (≈ \$0.004) | Requires alphanumeric sender ID pre-registration — roughly 3 weeks, with a procuration letter and company registration certificate, **per carrier** (MTN and Airtel separately). Generic sender IDs are often blocked by MTN |
| **Global API** (Twilio) | **\$0.3261/SMS** | **~80× more expensive.** Routing Rwandan SMS through a global API instead of a local aggregator is one of the most expensive avoidable mistakes available |

**RURA rules on bulk SMS** — these are operational constraints, not background:
- Only licensed telecoms and authorised aggregators may provide bulk SMS.
- Explicit opt-in required under Law 058/2021.
- Mandatory opt-out keyword support (STOP / CANCEL / END / UNSUBSCRIBE) **in both English and Kinyarwanda**, processed free and immediately.
- No centralised do-not-call registry — businesses must maintain their own suppression lists, which means **Subiza must provide suppression-list management** since its tenants will not build it themselves.
- 48-hour breach notification to RURA.
- Recommended sending window 08:00–20:00 CAT.
- Carrier throughput caps cited at MTN 100 msg/s, Airtel 50 msg/s.
- Prohibited content includes gambling, adult content and unlicensed financial services.
- Short codes are reportedly not currently supported for SMS in Rwanda; dedicated numeric short codes exist for USSD.

### 6.2 USSD — the feature-phone channel

USSD works with **zero internet connectivity**, which makes it the only realistic channel for feature-phone and rural customers — a genuinely significant population even in a market with 97% mobile penetration, since RURA's own figures show 32% of mobile internet subscriptions on EDGE/2G.

| Item | Cost |
|---|---|
| Shared USSD code | ~RWF 26,000/month maintenance; ~RWF 13/session |
| Dedicated USSD code setup | ~RWF 100,000 (MTN) / RWF 150,000 (Airtel) |
| Dedicated code monthly maintenance | ~RWF 259,500 |
| RURA regulatory fee | ~RWF 25,000 application, plus a reported annual fee that appears unusually high in the source and requires verification |

**Product fit:** USSD is not conversational. It is a menu tree. Its Subiza use case is narrow but real — order status lookup, appointment confirmation, callback request — for customers who cannot use WhatsApp. Phase 3, and only if the customer research justifies the fixed monthly cost.

---

## 7. Voice notes — a first-class requirement, not an add-on

This deserves its own section because it is culturally central and technically distinctive.

**Why it matters.** Voice notes dominate East African customer messaging for structural reasons: literacy barriers; the fact that most of Africa's 2,000+ languages are primarily spoken rather than written; and keyboards, autocorrect and interfaces built for English, French and Swahili that exclude speakers of Kinyarwanda dialectal variants and many other languages. Voice requires no typing proficiency and no smartphone literacy.

**The handling pattern:**

```
   Inbound voice note (WhatsApp / Telegram / Instagram)
        │
        ▼
   Download and normalise audio
        │
        ▼
   IJWI: transcribe (same ASR as voice calls, but WIDEBAND —
         voice notes are not 8 kHz, so accuracy is meaningfully better)
        │
        ▼
   UBWENGE: same intent, retrieval, grounding and refusal as any other turn
        │
        ▼
   Reply as BOTH:
     · text (for those who prefer to read, and for the record)
     · synthesised voice note in the same language (for those who do not read comfortably)
        │
        ▼
   During pilot: human review before send
```

**Three design notes:**
1. **Voice notes are wideband.** Unlike phone calls, they are not degraded to 8 kHz — so ASR accuracy on voice notes should be substantially better than on calls. This makes voice notes an excellent early proving ground for Kinyarwanda ASR, and a good source of training data.
2. **Always reply with both modalities.** Assuming the customer prefers voice because they sent voice is usually right but not always; sending both costs almost nothing.
3. **Human review during pilot.** A wrong answer delivered in a confident synthetic voice is worse than a wrong answer in text. Gate this until quality is measured.

---

## 8. Cross-channel identity and the unified inbox

### 8.1 The identity problem

Meta provides **no cross-channel identity resolution**. Each channel issues its own opaque identifier:

| Channel | Identifier |
|---|---|
| WhatsApp | E.164 phone number |
| SMS / voice | E.164 phone number |
| Instagram | IGSID (per-app scoped) |
| Messenger | PSID (per-app scoped) |
| Telegram | Telegram user ID |

**Unification must be built at the Subiza layer.** The approach:
- **Phone number is the primary key** where available (WhatsApp, SMS, voice) — which conveniently covers the highest-value channels and matches how Rwandan businesses already think about customers.
- IGSIDs and PSIDs are linked opportunistically when a customer volunteers a phone number, or when the agent asks in the natural course of conversation.
- Unlinked identities remain separate profiles rather than being merged on weak signals. **A wrong merge is worse than no merge** — it can expose one customer's conversation history to another.
- Merging is auditable and reversible.

### 8.2 Handover Protocol

Meta's **Handover Protocol** (Messenger and Instagram) lets multiple apps share control of one thread: a **Primary Receiver** app owns inbound messages by default and can `pass_thread_control` to a **Secondary Receiver** — the standard mechanism for bot-to-human escalation on those platforms. It was **not confirmed to extend to WhatsApp**; WhatsApp human handover is handled at the application layer, inside Subiza Studio, rather than by a Meta-level protocol.

### 8.3 Inbox design

One feed, all channels, on a phone. The channel is metadata, not structure. A conversation with Marie who called on Tuesday and messaged on WhatsApp on Thursday is **one thread**, with channel markers — because that is how the business owner thinks about it.

---

## 9. Compliance and data handling on messaging channels

| Aspect | Detail |
|---|---|
| **Meta data retention** | Message content retained a maximum of **30 days** on Cloud API servers, used only for retransmission reliability. User identifiers deleted within 30 days of final message status. Signal-protocol end-to-end encryption in transit, encrypted at rest. Meta acts as a **data processor** on the business's behalf and states Cloud API content is not automatically used for ad targeting. Meta holds SOC 2 Type II and ISO 27001 |
| **Subiza's role** | Data processor for its tenants, and controller for its own customer data. Both roles require registration under Law 058/2021 ([Doc 09](09-legal-regulatory-ethics.md)) |
| **Message content residency** | Messages passing through Subiza are stored Rwanda-resident; Meta's own 30-day retention is outside Subiza's control and must be disclosed to tenants |
| **AI disclosure** | Required on first contact in every session, on every channel |
| **The multi-tenant opt-in gap** | Meta places opt-in responsibility on each business. Subiza must provide the tooling and monitoring but cannot fully control tenant behaviour — this residual risk is real and must be documented in tenant terms and mitigated by monitoring |

---

## 10. Build sequence

| Phase | Channel work |
|---|---|
| **1** | Telegram adapter (prove the messaging core). WhatsApp Cloud API as Tech Provider: business verification, App Review, Embedded Signup, 24-hour window handling, template management, voice-note handling both directions, unified inbox v1 |
| **2** | Instagram DM + comment-to-DM. Messenger. SMS via local aggregator with sender-ID registration and suppression lists. Web chat widget. WhatsApp Flows for structured intake |
| **3** | USSD (if justified by research). WhatsApp Business Calling. Solution Partner evaluation for bundled billing |

---

## 11. What could not be verified

Carried to [Document 13](13-open-questions-and-validation.md):

1. Whether marketing templates are genuinely unavailable for Rwandan WABAs.
2. The reported RURA annual USSD fee, which appears anomalously high relative to other fees found.
3. Instagram's "200 automated messages per hour" limit (third-party source only).
4. Whether Meta's Handover Protocol extends to WhatsApp.
5. Exact WhatsApp quality-rating mechanics (the colour-coded green/yellow/red model is described by third parties but not in Meta's own messaging-limits documentation).
6. Rwanda voice/IVR per-minute pricing, where two sources conflicted.

---

## Sources

WhatsApp: [Meta WhatsApp pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) · [Embedded Signup overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/) · [Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers) · [Solution Partner / Tech Provider overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/overview) · [Messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits) · [Getting opt-in](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in) · [Data privacy and security](https://developers.facebook.com/documentation/business-messaging/whatsapp/data-privacy-and-security/) · [October 2026 service-message pricing change, SendPulse](https://sendpulse.com/blog/whatsapp-service-message-pricing) · [July 2025 per-message pricing switch, YCloud](https://www.ycloud.com/blog/whatsapp-api-pricing-update) · [Rwanda WhatsApp rate card via Twilio](https://www.twilio.com/en-us/whatsapp/pricing) · [WhatsApp Business Calling API](https://whatsappbusiness.com/blog/whatsapp-business-calling-api/) · [AI from Meta in WhatsApp chats](https://faq.whatsapp.com/6485307734928964) · [WhatsApp general-purpose chatbot ban, Respond.io](https://respond.io/blog/whatsapp-general-purpose-chatbots-ban)

Telegram: [Bots FAQ and rate limits](https://core.telegram.org/bots/faq) · [Introducing Telegram Business](https://telegram.org/blog/telegram-business) · [Telegram Business API](https://core.telegram.org/api/business)

Instagram and Messenger: [Instagram Messaging API 24-hour window guide](https://www.keyapi.ai/blog/instagram-messaging-api-policy/) · [Instagram Messenger API guide, Hubtype](https://www.hubtype.com/blog/instagram-messenger-api) · [Facebook Messenger policy 2026, Chatimize](https://chatimize.com/facebook-messenger-policy/) · [Handover Protocol](https://developers.facebook.com/docs/messenger-platform/handover-protocol/) · [Comment-to-DM automation, ManyChat](https://get.manychat.com/use-case/comment-to-dm)

SMS and USSD: [Rwanda SMS guidance](https://www.sent.dm/resources/rw-sms-guidance) · [Twilio SMS pricing Rwanda](https://www.twilio.com/en-us/sms/pricing/rw) · [Africa's Talking pricing](https://africastalking.com/pricing) · [HelloDuty Rwanda](https://helloduty.com/country/rwanda) · [RURA](https://www.rura.rw/)

Voice notes and African messaging behaviour: [Voice is Africa's gateway to AI, AVODA Group](https://avodagroup.org/voice-ai-africa-waxal-low-literacy/)

---

*Next: [09 — Legal, Regulatory & Ethics](09-legal-regulatory-ethics.md)*
