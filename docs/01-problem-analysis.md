# 01 — Problem Analysis

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. The problem statement

> **Small and medium businesses in Rwanda and across Africa lose a material and growing share of their revenue because they are structurally unable to respond to their customers at the moment the customer reaches out — and the only established remedies (hiring staff, or buying contact-centre software) cost more than the revenue they would recover.**

This is a statement about *response capacity*, not about technology. Technology appears only in the solution. It is important to hold the problem in this form, because every failed product in this category has started from "we have a cool voice AI" rather than "here is a business that is bleeding."

### 1.1 The problem restated as a causal chain

```
  A customer has intent to buy
            │
            ▼
  They call / message the business          ← the moment of maximum intent
            │
            ├──► Nobody answers  ─────────────┐
            │    (after hours, owner driving,  │
            │     serving another customer,    │
            │     phone in another room)       │
            ▼                                  │
  They wait                                    │
            │                                  │
            ├──► Still no reply within         │
            │    minutes / hours ──────────────┤
            ▼                                  │
  Intent decays                                │
            │                                  ▼
            ├──► They call a competitor ──► REVENUE LOST TO A RIVAL
            │
            ├──► They give up ────────────► REVENUE LOST ENTIRELY
            │
            └──► They eventually get through, annoyed
                        │
                        ▼
                 Lower satisfaction
                        │
                        ▼
                 Lower repeat purchase, no referral,
                 negative word of mouth
                        │
                        ▼
                 RETENTION LOST — the expensive kind of loss
```

Two distinct losses are hiding in that chain and they are often conflated:

- **Acquisition loss** — the enquiry that never converts. Visible in a lost sale, invisible in the books, because you cannot count a customer you never met.
- **Retention loss** — the existing customer whose experience degraded. This is the more expensive loss, because acquiring a replacement customer costs several times more than retaining one, and because a dissatisfied customer in a small, dense, high-trust market like Rwanda tells other people.

The founder's original framing correctly identified **retention** as the core concern. The analysis below shows that retention and acquisition failures share a single root cause — **response latency** — and are therefore solvable by a single intervention.

---

## 2. Who has this problem

### 2.1 Scale of the affected population

Rwanda's most recent Integrated Business Enterprise Survey (NISR, 2024) counts **278,060 business enterprises**:

| Segment | Count | Share |
|---|---:|---:|
| Micro (1–3 employees) | 224,434 | 80.7% |
| Small (4–30 employees) | 25,000 | 9.0% |
| Medium (31–100 employees) | 16,892 | 6.1% |
| Large (100+) | 9,415 | 3.4% |
| **Formal** | **36,706** | **13.2%** |
| **Informal** | **241,354** | **86.8%** |

Sector concentration is heavily skewed towards exactly the businesses that live or die on inbound enquiries:

| Sector | Share of enterprises |
|---|---:|
| Wholesale and retail trade | 53.6–56.6% |
| Accommodation and food service | 17.8–23.0% |
| Other services | 9.2% |
| Manufacturing | 5.1% |
| Education | 4.5% |

More than three quarters of Rwandan businesses are in retail, hospitality or services — categories whose entire customer relationship begins with "is it available / how much / are you open / can I book."

**Formal business formation grew 16.9% year over year in 2024**, and MSMEs constitute 98–99.8% of all enterprises. The affected population is not a niche; it is the economy.

### 2.2 The archetypes

Four recurring shapes of business, each with a distinguishable failure mode. These become the primary personas in [Document 04](04-solution-and-product.md).

| Archetype | Example | Typical enquiry | Failure mode | Cost of failure |
|---|---|---|---|---|
| **The single-operator trader** | A shop in Nyabugogo selling phone accessories; owner is also the salesperson, buyer and delivery driver | "Do you have a charger for a Tecno Spark? How much? Are you open now?" | Phone rings while serving a walk-in customer or while on a moto to the supplier. Call unanswered, never returned. | 100% of that sale, and the caller now has a competitor's number |
| **The appointment business** | A salon, dental practice, driving school, clinic, or repair workshop | "I want to book for Saturday morning." | Booking calls cluster at exactly the hours the business is busiest serving people. Bookings are taken on paper or in a WhatsApp thread and double-booked or forgotten. | Lost booking plus a no-show slot that cannot be resold |
| **The order-taking business** | Restaurant, bakery, water/gas delivery, agri-input supplier | "I want 3 crates delivered to Kimironko this afternoon." | Orders arrive by call and WhatsApp simultaneously from multiple numbers; the person taking them cannot keep up at peak; details are mis-transcribed. | Lost order, or a wrong order that costs the margin twice |
| **The service professional / SME with a "front desk"** | Small law firm, insurance broker, logistics company, school, microfinance institution, hotel | "What documents do I need? What is the status of my file?" | High volume of repetitive questions consumes the time of staff who should be doing higher-value work. After hours, nothing is answered at all. | Staff cost misallocation, plus customer frustration on genuinely simple queries |

### 2.3 The pattern common to all four

In every archetype the same three structural facts hold:

1. **Demand for response is continuous; supply of response is intermittent.** Customers call and message when it suits them — evenings, weekends, during Umuganda, at 21:00. The business responds only when a specific human is free.
2. **The response required is overwhelmingly repetitive.** Field experience across this category consistently shows that a large majority of inbound enquiries are a small set of questions: price, availability, opening hours, location, delivery, booking, order status. These are precisely the questions a well-grounded AI answers reliably.
3. **The business cannot buy its way out.** Adding a person is the obvious solution and it is unaffordable — see §4.

---

## 3. Why the problem is getting worse, not better

Three trends compound.

**3.1 Channel proliferation.** A Rwandan SME in 2019 had one channel: the phone. In 2026 the same business is reachable by phone call, SMS, WhatsApp text, WhatsApp voice note, Instagram DM, Instagram comment, Facebook Messenger, and sometimes Telegram. The *number of places a customer can be ignored* has multiplied roughly eightfold while the number of people available to answer has stayed at one. Each channel has its own notification behaviour, its own unread state, and its own social expectation of response speed.

**3.2 Rising expectation of immediacy.** Mobile penetration in Rwanda is effectively saturated — RURA's Q1 2026 statistics report **14.0 million mobile subscriptions (97.1% penetration)** and **10.74 million internet subscriptions (74.5%)**, with 8.56 million active mobile-money SIMs. A population that transacts instantly by MoMo does not expect to wait a day for a price quote. Immediacy has become the baseline, and a business that cannot meet it now looks negligent rather than merely small.

**3.3 Competitive symmetry.** Every competitor faces the same constraint. Today that means nobody answers and customers are resigned to it. The moment *some* businesses in a category answer instantly, the ones that do not lose disproportionately. This is a fragile equilibrium and it will break — the only question is who is on the right side of it.

---

## 4. Why the existing solutions do not work

### 4.1 Hire a person

The obvious answer, and the correct benchmark against which any product must be priced.

| Cost of a person in Rwanda | Monthly | USD equivalent |
|---|---|---|
| Receptionist, Kigali (Glassdoor range) | RWF 100,000–200,000 (median 150,000) | ≈ \$68–136 (median ≈ \$102) |
| Customer support representative, fully loaded with statutory RSSB and maternity contributions (~9%) | ≈ RWF 650,000 | ≈ \$442 |
| Call centre agent, Nairobi (regional comparison) | KES ~39,000 median | ≈ \$260–270 |

*(Conversions at 1 USD ≈ 1,471 RWF, XE, 4 September 2026.)*

Even the cheapest version of this — an informally-employed receptionist at RWF 100,000 — has three fatal limitations for the archetypes above:

1. **It covers one shift, not 24 hours.** Solving after-hours coverage requires three people, not one.
2. **It scales linearly and lumpily.** One person handles one call at a time. The Saturday-morning booking rush needs three people who are idle on Tuesday afternoon.
3. **It is often not the binding cost.** For a micro-business with three employees, the constraint is not salary — it is that there is no separate "front desk" role at all. The owner *is* the front desk.

And critically: for the 80.7% of Rwandan enterprises that are micro (1–3 employees), \$100–\$442/month is a very large fraction of, or exceeds, the business's entire monthly surplus.

### 4.2 Buy contact-centre software

The enterprise category exists and is mature. It is also structurally inaccessible:

| Vendor | Entry pricing | Why an SME cannot use it |
|---|---|---|
| Genesys Cloud CX | \$75–\$240 per user/month **plus a \$2,000/month minimum commitment** | A five-person business pays the \$2,000 floor regardless of size |
| NICE, Five9, Talkdesk | \$100–200+/agent/month plus implementation and onboarding fees, multi-seat minimums | Built for teams of dozens; requires an operations function that does not exist |
| Amazon Connect + Lex | Genuinely pay-as-you-go, no seat minimum | Requires AWS engineering to assemble Connect + Lex + Polly + Lambda; no off-the-shelf owner-facing UX; no African-language support |
| Google CCAI, Microsoft Dynamics voice | Enterprise, custom, bundled with CRM licensing | Enterprise sales motion; irrelevant to a shop in Nyabugogo |

The price floor is not incidental — it reflects a genuine cost structure built around enterprise support, compliance and integration. It simply prices out 99% of businesses in Rwanda.

### 4.3 Buy a Western AI receptionist

This category is now crowded — Dialzara, Rosie, GoodCall, Phonely, Smith.ai, Podium and others cluster in a **\$29–\$349/month, minutes-tiered** band. They are real products that work well. They are also unusable here, for four reasons:

1. **Language.** They operate in English (occasionally Spanish). None handles Kinyarwanda. A Kigali hardware shop's callers speak Kinyarwanda, often code-switched with English and French.
2. **Numbers.** They assume a US or European phone number. Twilio — the underlying carrier for many — does not appear to offer Rwandan local DIDs at all, and prices outbound calls to Rwanda at **\$0.5554/minute**, roughly sixteen times the local rate of ≈\$0.034/minute via Africa's Talking.
3. **Payment.** Card-first billing in a market where 5.8 million people transact by MTN MoMo and card penetration is marginal.
4. **Price calibration.** \$29–\$349/month is priced against a \$3,000+/month US receptionist. Against a \$102/month Kigali receptionist, the same price is not a saving.

### 4.4 Use chat automation tools

ManyChat — which the founder correctly identified as the incumbent in this space — is genuinely good at what it does: Instagram comment-to-DM automation, Messenger and WhatsApp flow building, at **\$14–\$139/month** by contact volume. Wati, Respond.io, AiSensy, Chatfuel and Interakt occupy adjacent positions.

Their limitation is categorical, not incidental:

- **They do not do voice.** ManyChat's own community confirms there is no phone-call capability and no roadmap commitment to one. These products are automation layers over Meta's messaging Graph APIs; telephony is not adjacent to that architecture, it is a different discipline entirely (SIP signalling, RTP media, codecs, jitter, echo).
- **Their AI is shallow.** ManyChat's "AI Step" is a paid add-on widely described as basic FAQ matching rather than open conversational reasoning.
- **They bill by contact, not by usage** — a growing SME's bill rises even when automation volume does not.
- **They are not designed for African languages or African payment rails.**

**The gap is therefore precise:** the chat-automation vendors own messaging and cannot do voice; the voice-AI vendors own calls and do not do WhatsApp/Instagram natively at SME prices; neither speaks Kinyarwanda; and none bills by mobile money.

### 4.5 The "do nothing" alternative

It must be stated honestly that the status quo is not "nothing" — it is **a WhatsApp thread and a notebook**. Most Rwandan SMEs manage customer communication through personal WhatsApp on the owner's phone, plus a physical booking book. This works, badly, and it is free. Any product must be better than *free and familiar*, not merely better than *expensive and absent*. This raises the bar on onboarding simplicity far more than on feature depth — a theme that dominates [Document 04](04-solution-and-product.md).

---

## 5. Quantifying the cost

Honest quantification is difficult because the loss is invisible by construction — a business cannot count enquiries it never received. The following is a **model, not a measurement**, and validating it is item 6 in the master document's next actions and a core Phase 0/1 deliverable.

### 5.1 A worked model for a representative small business

Assumptions (all to be validated by field interviews — see [Document 13](13-open-questions-and-validation.md)):

| Variable | Assumed value | Basis |
|---|---|---|
| Inbound enquiries per day (calls + messages) | 25 | Mid-range for an active retail/service SME |
| Share arriving outside the hours someone can respond | 35% | Evenings, weekends, peak-service windows |
| Share of missed enquiries that are never recovered | 60% | Caller goes elsewhere or abandons |
| Conversion rate of an *answered* enquiry | 25% | Conservative for high-intent inbound |
| Average transaction value | RWF 15,000 (≈ \$10) | Representative retail/service basket |

**Then:**
- Missed enquiries per day: 25 × 35% = **8.75**
- Permanently lost: 8.75 × 60% = **5.25**
- Lost sales per day: 5.25 × 25% = **1.31**
- Lost revenue per day: 1.31 × RWF 15,000 = **RWF 19,687**
- **Lost revenue per month (26 trading days): ≈ RWF 512,000 (≈ \$348)**

Against that, a Subiza subscription in the RWF 20,000–90,000/month band recovers a multiple of its own cost even if it captures only a fraction of the loss. **If Subiza recovers just 20% of the missed enquiries, it pays for itself several times over.** This is the arithmetic that must appear on the pricing page, and it is why the product's most important analytics screen is "calls we answered that you would have missed."

### 5.2 The retention loss, which is larger and harder to model

The model above counts only acquisition loss. Retention loss — customers who had a bad experience and quietly stopped coming — is:

- larger in aggregate for most established businesses,
- impossible to observe without instrumentation the business does not have,
- and the thing the founder correctly identified as the core problem.

Subiza's contribution to retention is not primarily "the AI is nice." It is that **every customer interaction becomes a recorded, searchable, followed-up event** instead of an unlogged phone call. The business gains, for the first time, a memory of its customers. That is a second-order benefit that becomes the expansion story in [Document 04](04-solution-and-product.md) and [Document 11](11-business-model-and-economics.md).

---

## 6. Why now — the enabling conditions

A problem that has existed for decades becomes a business only when something changes. Five things changed, and all of them within roughly the last 24 months.

**6.1 Streaming speech recognition became fast and cheap.** Transducer-architecture models with genuine streaming (NVIDIA Parakeet TDT, Canary) and highly-optimised Whisper runtimes (faster-whisper, distil-whisper) brought partial-transcript latency into the 100–300 ms range at costs measured in fractions of a cent per minute — self-hostable on a single mid-range GPU.

**6.2 Streaming neural TTS with voice cloning became permissively licensed.** Orpheus (Apache 2.0), Chatterbox (MIT), Kokoro (Apache 2.0) and Piper (MIT) now deliver time-to-first-audio in the 75–200 ms range with zero-shot cloning from seconds of reference audio. Two years ago the quality bar required a commercial API; today it does not. (Microsoft's VibeVoice, the founder's original inspiration, is part of this wave even though it is architecturally wrong for live calls — see [Document 06](06-voice-ai-and-ml.md).)

**6.3 Instruction-following language models became small enough to self-host.** A quantised 7–14B open-weight model on a single 24 GB GPU now produces a first token in 150–400 ms with reliable tool calling — good enough for a scoped customer-service agent, and cheap enough that inference is not the dominant cost.

**6.4 Telephony providers exposed real-time media as a product primitive.** Twilio Media Streams, Telnyx media streaming and Plivo Audio Streaming all now expose a bidirectional WebSocket carrying raw call audio. Putting an AI in the middle of a live phone call went from a telecom-engineering project to a documented API in two years.

**6.5 African-language speech data reached a usable floor.** Kinyarwanda is one of the better-represented low-resource languages in Mozilla Common Voice; **Digital Umuganda** publishes Kinyarwanda TTS datasets and a working YourTTS-based Kinyarwanda voice model; **Mbaza NLP** publishes Kinyarwanda–English parallel corpora, a FLEURS Kinyarwanda subset and a ~25-million-word Kinyarwanda monolingual corpus; **Intron Health's** Sahara models claim Kinyarwanda ASR and TTS including a trilingual English–Kinyarwanda–French model; NVIDIA has published work on Kinyarwanda ASR. The starting point is no longer zero.

**The window:** each of these is available to anyone. What is *not* available to everyone is the combination of local language data relationships, local telephony economics, local billing rails and local trust. That combination has a shelf life — perhaps 18 to 36 months before a well-funded global player or a regional incumbent decides Kinyarwanda is worth doing.

---

## 7. The problem beyond Rwanda

The same causal chain, with different constants, describes the SME sector across the continent.

| Market | Population | MSMEs | Notes for this problem |
|---|---:|---|---|
| Nigeria | 223.8 M | ~39.65 M MSMEs (SMEDAN/NBS); SMEs = 96% of businesses, 84% of employment | Largest absolute prize; most crowded; FX volatility risk |
| Kenya | 51.5 M | Millions (informal-heavy) | Best digital-payments infrastructure (M-Pesa), 92.9% smartphone share of connected phones, most mature SaaS-buying culture in East Africa — the logical second market |
| Tanzania | 73.0 M | Not verified | Feature-phone-heavier; stronger USSD/voice-first opportunity |
| Uganda | 45.9 M | Not verified | Feature phones still significant; voice matters more than chat |
| Ghana | 34.4 M | Not verified | Highest WhatsApp share of internet users (~63%), higher GDP/capita |
| Ethiopia | 138.9 M | Not verified | Largest population, lowest digital penetration, restrictive market entry — long-term only |

*(MSME counts for markets other than Rwanda and Nigeria could not be verified from national statistics agencies in the research pass and are flagged in [Document 13](13-open-questions-and-validation.md).)*

**Two things generalise and one does not.** The problem generalises: SMEs everywhere in the region miss enquiries for the same structural reasons. The technical architecture generalises: the same platform serves any market by swapping telephony provider, language pack and payment rail. What does **not** generalise is the language work — each new market needs its own ASR and TTS quality bar (Swahili, Luganda, Twi, Yoruba, Hausa, Amharic). That is simultaneously the expansion cost and the moat: it is slow for Subiza, and equally slow for anyone following.

---

## 8. Problem statement — final form

Three nested statements, from broadest to most actionable. The third is the one the product is built against.

**Level 1 — The economic problem.**
African SMEs, which constitute 98%+ of enterprises and the majority of employment, systematically lose revenue and customer relationships because their capacity to respond to customers is bounded by the availability of one or two people, while customer demand for response is continuous and multi-channel.

**Level 2 — The market failure.**
Every existing remedy is mispriced for this market: human staffing costs \$100–\$442/month per shift and does not scale; enterprise contact-centre software has a floor of \$2,000/month; Western AI receptionists cost \$29–\$349/month, speak only English, cannot obtain Rwandan numbers, and bill by card; chat-automation tools cannot touch voice at all. No available product answers a phone call in Kinyarwanda.

**Level 3 — The buildable problem.**
Build a multi-tenant platform that answers a Rwandan SME's phone calls and messages automatically, in Kinyarwanda, English, French and Swahili, with response latency under one second on a live call, grounded strictly in the business's own information, capable of taking an action rather than only talking, configurable by a non-technical owner in under an hour with no change to their existing phone number, billable in Rwandan francs by mobile money at RWF 20,000–90,000 per month, and compliant with Rwandan data-protection law from the first call.

Everything in the remaining documents is an answer to Level 3.

---

## Sources

Rwanda enterprise and economic data: [NISR Integrated Business Enterprise Survey 2024](https://statistics.gov.rw/sites/default/files/documents/2026-03/IBES2024_Main%20Report_English_0.pdf) · [NISR Key Figures](https://statistics.gov.rw/print/pdf/node/236) · [Rwanda MSME FinMap 2024, Access to Finance Rwanda](https://afr.rw/downloads/rwanda-msme-finmap-report-2024/) · [Worldometer Rwanda GDP 2026](https://www.worldometers.info/gdp/rwanda-gdp/)

Telecom and connectivity: [RURA ICT Sector Statistics Report, Q1 2026](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Statistics/Quarterly_publication/ICT_Sector_Statistics_Report_as_of_the_First_Quarter_2026.pdf) · [DataReportal Digital 2025: Rwanda](https://datareportal.com/reports/digital-2025-rwanda) · [MTN Rwanda MoMo results, Technext24](https://technext24.com/2025/11/04/mtns-momo-rwanda-5-8m-subscribers-2025/)

Labour costs: [Glassdoor — Receptionist, Kigali](https://www.glassdoor.com/Salaries/kigali-kigali-receptionist-salary-SRCH_IL.0,13_IC3972329_KO14,26.htm) · [Playroll — Cost of hiring in Rwanda 2026](https://www.playroll.com/employment-cost/rwanda) · [Glassdoor — Call Centre Agent, Nairobi](https://www.glassdoor.com/Salaries/nairobi-call-centre-agent-salary-SRCH_IL.0,7_IM1085_KO8,25.htm)

Competitor pricing: [Genesys pricing analysis](https://www.alpharun.com/blog/genesys-pricing) · [ManyChat pricing](https://manychat.com/pricing) · [Twilio Rwanda voice pricing](https://www.twilio.com/en-us/voice/pricing/rw) · [Africa's Talking pricing](https://africastalking.com/pricing)

African-language speech resources: [Digital Umuganda on Hugging Face](https://huggingface.co/DigitalUmuganda) · [Mbaza NLP on Hugging Face](https://huggingface.co/mbazaNLP) · [NVIDIA — Building an ASR model for Kinyarwanda](https://developer.nvidia.com/blog/building-an-automatic-speech-recognition-model-for-the-kinyarwanda-language/) · [Intron Health](https://www.intron.io/)

---

*Next: [02 — Stakeholder Analysis](02-stakeholder-analysis.md)*
