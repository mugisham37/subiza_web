# 11 — Business Model & Economics

*Part of the [Subiza Project Documentation](../README.md)*

---

> **Reading note.** Figures are marked 🟢 verified from a primary source, 🟡 verified but dated or a proxy, 🔴 estimated or modelled. Conversions use 1 USD ≈ 1,471 RWF (XE, 4 September 2026) 🟢. The model below is a *framework with defensible inputs*, not a forecast. Several of its most important assumptions are explicitly unvalidated and appear in [Document 13](13-open-questions-and-validation.md).

---

## 1. Market fundamentals — Rwanda

### 1.1 Macro

| Metric | Value | |
|---|---|---|
| Population | 14.89 million | 🟢 |
| Nominal GDP | \$17.34 billion | 🟢 |
| GDP per capita | \$1,198 | 🟢 |
| GDP growth 2026 forecast | 7.2% (IMF) | 🟢 |
| Q1 2026 actual growth | 7.9%, services- and industry-led | 🟢 |

### 1.2 The business population

| Segment | Count | Share |
|---|---:|---:|
| Total enterprises (NISR IBES 2024) | **278,060** | 🟢 |
| Formal | 36,706 | 13.2% |
| Informal | 241,354 | 86.8% |
| Micro (1–3 employees) | 224,434 | 80.7% |
| Small (4–30) | 25,000 | 9.0% |
| Medium (31–100) | 16,892 | 6.1% |
| Large (100+) | 9,415 | 3.4% |
| Formal-business growth, 2024 | **+16.9% YoY** | 🟢 |
| MSME financial inclusion | 83% included, 75% with formal access | 🟢 |
| Women-owned MSMEs | 34% | 🟢 |
| Geography | Kigali ~25%, Eastern ~25%, others 15–19%; roughly 50/50 rural/urban | 🟢 |

Sector mix — wholesale and retail 53.6–56.6%, accommodation and food 17.8–23.0%, other services 9.2% — means **the large majority of Rwandan businesses are in categories whose customer relationship starts with an inbound enquiry.**

### 1.3 Connectivity and payments (RURA Q1 2026)

| Metric | Value |
|---|---|
| Mobile subscriptions | 14.0 million (97.1% penetration) 🟢 |
| MTN market share | 66.3% (9.3 M) 🟢 |
| Airtel market share | 33.7% (4.7 M) 🟢 |
| Internet subscriptions | 10.74 million (74.5%) 🟢 |
| Mobile internet by technology | 4G 56%, 3G 12%, **EDGE/2G 32%** 🟢 |
| Mobile money active SIMs | 8.56 million (59.4%) 🟢 |
| Voice tariff, standard | RWF 40/min on-net and off-net; ONA RWF 105/min 🟢 |
| Voice tariff, effective bundled | **RWF 3.3–3.9/min (≈ \$0.0022–0.0027)** 🟢 |
| Data tariff, effective bundled | RWF 0.76/MB (≈ \$0.0005) 🟢 |

**An important caveat on penetration.** DataReportal (Jan 2025), using a different methodology, reports only 4.93 million internet users (34.2%) and 1.30 million social-media identities (9.0%). RURA counts *subscriptions*, which include inactive lines, multi-SIM users and B2B data SIMs. 🟡 **Plan against roughly 6–8 million genuinely active internet users, not 10.7 million.** Over-reading RURA's figure is the most likely way to build an over-optimistic market model.

### 1.4 Messaging platform reach in Rwanda

| Platform | Users | % of population | |
|---|---:|---:|---|
| WhatsApp | ~4 million (modelled) | ~27% | 🔴 third-party estimate; Meta publishes no country figures |
| Facebook | 1.30 million | 9.0% | 🟢 |
| LinkedIn | 480,000 | 3.3% | 🟢 |
| Instagram | 456,000 | 3.2% | 🟢 |
| X/Twitter | 271,000 | 1.9% | 🟢 |

**This table settles a strategic question.** Instagram has fewer than half a million users in Rwanda. A product built primarily on Instagram automation — the ManyChat model — has a very small Rwandan market. **Voice reaches 14 million people; WhatsApp perhaps 4 million; Instagram under half a million.** The channel priority in [Document 04](04-solution-and-product.md) follows directly from this.

### 1.5 Mobile money — the payment rail

| Metric | Value |
|---|---|
| MTN MoMo active subscribers | 5.8 million (+12.2% YoY) 🟢 |
| Registered merchants | 578,000 (Q3 2025) 🟢 |
| MoMo revenue, 9 months 2025 | RWF 109.4 billion, +30.2% YoY — **50.6% of MTN Rwanda's total service revenue** 🟢 |
| Average monthly transactions | 246 million 🟢 |
| 2024 MoMo transaction value | RWF 21 trillion — exceeding national GDP 🟢 |

**Billing must be MoMo-native.** This is not a preference; card penetration in this segment is marginal and a card requirement in the signup flow would be a conversion wall.

---

## 2. Expansion markets

| Market | Population | GDP | GDP/capita | MSMEs | WhatsApp (est.) | Assessment |
|---|---:|---:|---:|---|---|---|
| **Rwanda** | 14.9 M | \$17.3 B | \$1,198 | 278,060 (37 k formal) 🟢 | ~4 M | Home. Small but ideal for building and proving |
| **Kenya** | 51.5 M | \$147.3 B | \$2,714 | Millions, informal-heavy 🔴 | 22–26 M | **Second market.** M-Pesa, 92.9% smartphone share of connected phones, most mature SaaS-buying culture in East Africa, Swahili leverage |
| **Nigeria** | 223.8 M | \$285.0 B | \$1,200 | **39.65 M** 🟢 | 90–100 M | Largest prize, most crowded, FX volatility. Note: WhatsApp business-initiated calling is **not available** in Nigeria |
| **Tanzania** | 73.0 M | \$87.4 B | \$1,300 | Not verified 🔴 | 15–17 M | Feature-phone-heavier; voice and USSD matter more |
| **Uganda** | 45.9 M | \$64.3 B | \$1,340 | Not verified 🔴 | 12–13 M | Feature phones still significant |
| **Ghana** | 34.4 M | \$112.0 B | \$3,190 | Not verified 🔴 | 20–22 M | Highest WhatsApp share of internet users (~63%), higher incomes |
| **Ethiopia** | 138.9 M | \$155.8 B | \$1,473 | Not verified 🔴 | 14–18 M | Largest population, lowest digital penetration, restrictive entry. Long term only |

**Sequence: Rwanda → Kenya → Uganda/Tanzania → Ghana/Nigeria.** Kenya second because of M-Pesa, smartphone penetration, SaaS-buying maturity, and because Swahili is far better-resourced than Kinyarwanda — the language work compounds rather than restarting.

---

## 3. Market sizing

Built bottom-up, with assumptions stated so they can be argued with.

### 3.1 Rwanda addressable base

- 36,706 formal businesses — highest near-term ability and willingness to pay.
- Of 224,434 micro/informal enterprises, assume **15–20% are digitally active** with meaningful customer-facing enquiry volume: **34,000–45,000**.
- **Realistic Rwandan addressable base: 70,000–80,000 businesses.** 🔴

### 3.2 SAM — Rwanda plus immediate East Africa (3-year horizon)

Formal plus digitally-active-informal businesses in Rwanda, Kenya, Uganda and Tanzania, reachable through direct sales, self-serve and partnerships: **300,000–600,000 businesses** 🔴 (non-Rwanda figures are estimates). At \$10–20/month blended ARPU: **SAM ≈ \$36 M–\$144 M per year.**

### 3.3 SOM — realistic three-year capture

Early-stage vertical SaaS in emerging markets typically captures 0.5–3% of SAM within three years absent heavy channel distribution.

**1,500–5,000 paying businesses by year 3, at \$15–25/month blended ARPU → \$270 k–\$1.5 M ARR.** 🔴

**The single biggest lever on this number is distribution.** An embedded partnership — with MTN MoMo Business, with a POS platform, with a bank's SME programme, or with the Private Sector Federation — could multiply it. That should be validated through partnership conversations rather than assumed in a spreadsheet.

### 3.4 Published market estimates, for context

| Market | 2025/26 | Forecast | CAGR |
|---|---|---|---|
| Conversational AI (global) | \$14.3 B → \$17.7 B | \$78.9 B by 2033 | 23.8% 🟢 |
| AI voice agents (global) | \$2.54 B → \$3.5 B | \$35.24 B by 2033 | **39.0%** 🟢 |
| Contact-centre-as-a-service (global) | \$6.8 B → \$8.0 B | \$32.7 B by 2033 | 22.3% 🟢 |

**A finding worth stating plainly: none of these reports breaks out a credible Africa sub-region.** MEA is consistently lumped together and limited to Saudi Arabia, the UAE and South Africa in the segmentation. **There is no credible third-party "Africa AI customer-service market size" in circulation**, and any figure claiming one should be treated sceptically. A bottom-up build is the only defensible approach — which is what §3.1–3.3 does.

---

## 4. Willingness to pay

### 4.1 The correct anchor is wages, not competitor pricing

| Comparison | Monthly cost | |
|---|---|---|
| Receptionist, Kigali (Glassdoor, RWF 100,000–200,000, median 150,000) | **\$68–136**, median ≈ \$102 | 🟢 |
| Customer support rep, Rwanda, fully loaded (RWF ~650,000 incl. ~9% RSSB and maternity) | **≈ \$442** | 🟢 |
| Call centre agent, Nairobi (KES ~39,000 median) | ≈ \$260–270 | 🟡 |

**This is the pricing anchor.** A product priced at **\$14–61/month** is unambiguously and demonstrably cheaper than the cheapest human alternative, while covering 24 hours instead of one shift and handling concurrent conversations instead of one at a time.

### 4.2 What African SMEs already pay for software

| Product | Price |
|---|---|
| ManyChat Essential / Pro / Business | \$14 / \$29 / \$69 per month 🟢 |
| AiSensy chatbot builder / AI agent builder | \$80 / \$99 per month 🟢 |
| Wati Pro / Business (plus per-user \$24–69) | mid-tier SaaS pricing; PAYG entry ~\$12 🟢 |

These are globally-priced tools calibrated to global willingness to pay. \$80–100/month is a stretch for a typical Rwandan micro or small business — **which is precisely the gap an Africa-native, RWF-priced, MoMo-billed product exploits.**

---

## 5. Cost structure

### 5.1 Verified component prices (2026)

**Telephony**

| Provider / market | Rate |
|---|---|
| Twilio → Rwanda local | \$0.5554/min 🟢 |
| Twilio → Rwanda mobile | \$0.5528/min 🟢 |
| **Africa's Talking Rwanda (in and out)** | **RWF 50/min ≈ \$0.034/min** 🟢 |
| Africa's Talking Kenya outgoing | KES 2.50/min ≈ \$0.019 🟢 |
| Africa's Talking Uganda outgoing | UGX 290/min ≈ \$0.078 🟢 |
| Africa's Talking Nigeria outgoing | NGN 15–20/min ≈ \$0.010–0.013 🟢 |
| Africa's Talking Ghana | GHS 0.20/min ≈ \$0.014 🟢 |

**Speech-to-text (Deepgram)** — pay-as-you-go streaming Nova-3 monolingual \$0.0048–0.0077/min; multilingual \$0.0058–0.0092/min; Growth plan monolingual \$0.0042–0.0065/min 🟢

**Text-to-speech** — Deepgram Aura-1 \$0.015 / Aura-2 \$0.030 per 1,000 characters; Cartesia ≈ \$0.028–0.03/min effective; ElevenLabs Business tier ≈ \$0.05/min 🟢

**LLM per minute of conversation** (Retell's published rate card is a useful real-world reference) — budget tier \$0.006–0.045/min; mid-tier \$0.045/min; premium \$0.08/min; frontier \$0.16–0.32/min 🟢

**Raw tokens** (OpenAI, Sept 2026) — GPT-5.6 Luna \$0.20 in / \$1.20 out per million; Terra \$2.00 / \$12.00; Sol \$5.00 / \$30.00; Realtime-2.1 mini \$10 audio-in / \$20 audio-out; Realtime-2.1 \$32 / \$64; GPT-Transcribe \$0.0045/min 🟢

**GPU rental (RunPod)** — H100 SXM \$3.29/hr; A100 SXM \$1.59; L40S \$0.99; RTX 6000 Ada \$0.84; RTX 4090 \$0.74; L4 \$0.49; A40 \$0.44 🟢

### 5.2 Four cost stacks

**A — Naive: Twilio + managed everything**

| Component | \$/min |
|---|---:|
| Telephony (Twilio Rwanda) | 0.5554 |
| Orchestration (Vapi-class) | 0.05 |
| STT | 0.006 |
| LLM (mid-tier) | 0.045 |
| TTS | 0.025 |
| **Total** | **≈ 0.68** 🔴 |

**B — Localised telephony, managed AI**

| Component | \$/min |
|---|---:|
| Telephony (Africa's Talking) | 0.034 |
| Orchestration | 0.05 |
| STT | 0.006 |
| LLM (mid-tier) | 0.045 |
| TTS | 0.025 |
| **Total** | **≈ 0.16** 🔴 |

**C — Lean managed (own thin orchestration, cheap components)**

| Component | \$/min |
|---|---:|
| Telephony | 0.034 |
| Own orchestration (amortised) | 0.01 |
| STT (Deepgram Growth) | 0.004 |
| LLM (budget tier) | 0.006–0.015 |
| TTS (Aura-1) | 0.015 |
| **Total** | **≈ 0.07–0.08** 🔴 |

**D — Self-hosted inference, local telephony**

Assuming ~10 concurrent real-time sessions per L40S at \$0.99/hr 🔴 (**this concurrency figure is unmeasured — see [Doc 06 §10.3](06-voice-ai-and-ml.md)**):

| Component | \$/min |
|---|---:|
| Telephony | 0.034 |
| GPU compute (\$0.99 ÷ 60 ÷ 10) | 0.00165 |
| Storage, recording, orchestration | 0.003–0.006 |
| **Total marginal** | **≈ 0.039–0.042** 🔴 |

Plus fixed engineering overhead of roughly **\$4,000–8,000/month** for a self-hosted pipeline at managed-API reliability. 🔴

### 5.3 The two decisive observations

**One: telephony provider choice changes cost by 16× and is the difference between a viable and an impossible business.** Stack A at \$0.68/min cannot be sold to a Rwandan SME at any margin. Stack B at \$0.16/min can. The single decision separating them is which company terminates the call.

**Two: at scale, telephony *remains* the dominant cost even in the best case.** In stack D, telephony is \$0.034 of a \$0.039–0.042 total — roughly 85%. **The long-run margin story is therefore about telephony, not about GPUs**: moving from CPaaS resale to direct SIP trunking and eventually carrier interconnect ([Doc 07 §6](07-telephony-and-networking.md)) is where the next order-of-magnitude improvement lives. Africa's Talking's own SIP-agent rate of RWF 5/min (≈ \$0.0034) hints at what is possible on the other side of that migration.

### 5.4 Break-even for self-hosting

Comparing stack C (\$0.075/min marginal) with stack D (\$0.04/min marginal plus ~\$5,000/month fixed):

**\$5,000 ÷ (\$0.075 − \$0.04) ≈ 143,000 minutes/month** 🔴

But comparing against stack B (\$0.16/min), which is the more realistic starting point for a team that has not yet built its own orchestration:

**\$5,000 ÷ (\$0.16 − \$0.04) ≈ 42,000 minutes/month** 🔴 — roughly 700 hours of conversation per month, reachable with a few hundred active voice customers.

**Policy: stay managed until roughly 30,000–50,000 voice minutes/month, then self-host TTS first, ASR second, LLM last.** TTS first because it carries the highest managed cost per minute and the lowest engineering risk.

**Caveat that must not be lost:** these figures are highly sensitive to the unmeasured concurrency-per-GPU number and to the real engineering headcount cost. **Both must be established empirically before any hardware commitment** ([Doc 10 §5.2](10-infrastructure-devops-sre.md)).

### 5.5 Messaging costs

| Item | Cost |
|---|---|
| WhatsApp utility/authentication template, Rwanda | \$0.0034/message 🟢 |
| WhatsApp service messages | Free within the 24-hour window **until 1 October 2026**; thereafter 1,000 free per WABA per month, then billed at the utility rate 🟢 |
| Telegram | Free 🟢 |
| SMS via local aggregator, Rwanda | ~RWF 6 ≈ \$0.004 🟢 |
| SMS via Twilio, Rwanda | **\$0.3261** 🟢 — ~80× more expensive; never use for local traffic |

Messaging costs are an order of magnitude below voice costs. **Chat is a margin-accretive channel; voice is the expensive, differentiated one.** This has a pricing implication: bundle generous message volumes and meter voice minutes.

---

## 6. Pricing

### 6.1 Design principles

1. **Anchor on the wage comparison**, not on competitor SaaS pricing.
2. **Price in RWF**, billed by MoMo. USD pricing is a barrier and an FX risk transferred to the customer.
3. **Prepaid credits, not post-paid subscriptions.** Matches how Rwandan SMEs already buy airtime and data, removes credit risk, and removes the fear of an unexpected bill.
4. **Meter voice; bundle messages.** Cost structure and value structure both point this way.
5. **Never seat-based.** A three-person business has no seats.
6. **Make the value metric visible on the invoice** — "we answered 31 calls you would have missed."

### 6.2 Indicative structure

| Plan | RWF/month | ≈ USD | Included voice minutes | Messages | Fits |
|---|---:|---:|---:|---|---|
| **Gerageza** (Try) | 0 | 0 | 30 | 100 | Trial — must be genuinely useful, not a teaser |
| **Ubucuruzi** (Business) | 20,000 | ≈ 14 | 300 | 1,000 | Micro: shop, salon, small trader |
| **Ikigo** (Enterprise-small) | 45,000 | ≈ 31 | 800 | 3,000 | Small: clinic, restaurant, workshop |
| **Ikigo+** | 90,000 | ≈ 61 | 2,000 | 10,000 | Medium: hotel, school, logistics |
| **Custom** | — | — | — | — | Multi-location, resellers, integrations |

Overage priced transparently per minute, with a hard cap the owner controls and low-balance alerts before it is reached. **No surprise bills, ever** — this is a direct response to the trust deficit Air.ai created in this category.

### 6.3 Margin check

At the Ubucuruzi tier: RWF 20,000 (\$13.60) for 300 minutes.

| Stack | Cost of 300 min | Gross margin |
|---|---:|---:|
| B — localised managed | \$48.00 | **negative** |
| C — lean managed | \$22.50 | **negative** |
| D — self-hosted | \$12.00 | ≈ 12% |

**This is the central commercial tension in the business and it must be confronted, not hidden.**

Three honest resolutions, all of which are true simultaneously:

1. **Most customers will not use their full allowance.** Included minutes are a ceiling, not an expectation. Real utilisation for a micro business is plausibly 30–50% of the bundle, which changes stack C from negative to positive. **This assumption is the single most important number in the entire business model and it is currently unvalidated** — Phase 1 exists partly to measure it.
2. **The bundle sizes above may be too generous** and should be recalibrated against measured pilot usage before public launch. Publishing a price that cannot be served profitably is a worse mistake than launching with a smaller bundle.
3. **Self-hosting is not optional at scale.** Stack D is the only structure that supports these price points at meaningful utilisation, which is why the self-hosting roadmap is a commercial requirement rather than an engineering preference.

**The action:** do not publish a price list until Phase 1 has measured actual minutes consumed per business per month. Price the pilot on a cost-plus basis and set public pricing from data.

---

## 7. Unit economics

| Metric | Assumption | |
|---|---|---|
| ARPU, blended | \$15–25/month | 🔴 |
| Gross margin, Phase 1 (managed) | 20–40% | 🔴 |
| Gross margin, Phase 3 (self-hosted) | **60–75%** | 🔴 target |
| CAC, direct sales | \$30–80 | 🔴 unvalidated |
| CAC, partner or reseller channel | \$10–25 | 🔴 |
| Monthly logo churn | 5–8% early, target < 5% | 🔴 |
| Customer lifetime | 15–20 months at 5–6% churn | 🔴 |
| LTV at \$20 ARPU, 65% margin, 17 months | ≈ \$221 | 🔴 |
| LTV:CAC target | > 3:1 | |

**Every figure in this table is an assumption.** SMB SaaS churn, CAC and gross-margin benchmarks could not be verified from a live source, and generic global benchmarks skew heavily toward US and European cost structures. The right source is comparable African SaaS operators — portfolio companies of Norrsken, Catalyst Fund and similar — approached directly. This is a Phase 1 research task, not a spreadsheet exercise.

**The two variables that matter most:** actual minutes consumed per business per month (determines gross margin), and churn (determines whether the business compounds). Everything else is second-order.

---

## 8. Go-to-market

### 8.1 The wedge

**"Keep your number. Dial one code. Stop losing customers."**

Every word is deliberate: no number change (P4), one-step setup, and the outcome rather than the technology.

### 8.2 Sequenced motion

| Phase | Motion | Target | CAC |
|---|---|---|---|
| **1** | Founder-led, hand-held. 10 design partners recruited through personal network, ICT Chamber, kLab | 10 businesses | Very high, irrelevant |
| **2** | Direct sales in Kigali. Field visits to Nyabugogo, Kimironko, Remera, Kicukiro. Setup done in person | 100–300 | \$50–80 |
| **3** | Self-serve plus referral. The onboarding flow must work unaided. WhatsApp-based support in Kinyarwanda | 500–1,500 | \$30–50 |
| **4** | Channel: agencies, MoMo Business, POS platforms, banks' SME programmes, PSF sector chambers | 2,000+ | \$10–25 |

### 8.3 Proof, not persuasion

The most effective sales asset is not a pitch. It is a **live demo on the prospect's own business**: take their price list, load it, call them from their own agent, in Kinyarwanda, in ten minutes. That demo answers the only question that matters — "does it actually understand my customers?" — better than any deck.

The second most effective asset is the **weekly "calls you would have missed" report**, sent by WhatsApp. It renews the subscription without a conversation.

### 8.4 What will not work

- **Digital-only acquisition** in Phase 2. Facebook has 1.3 million Rwandan users, Instagram fewer than 460,000. There is no efficient digital channel to Rwandan SMEs at the scale required.
- **Freemium as a growth engine.** The free tier exists to prove value, not to build a funnel. Voice minutes cost real money.
- **Selling "AI."** Sell answered calls and recovered customers.

---

## 9. Funding

| Source | Fit | Status |
|---|---|---|
| **GSMA Innovation Fund** | **Best first target** — equity-free, milestone-based grants, explicitly funds AI-enabled solutions for low- and middle-income countries, with active grantees across Africa | 🟢 verified |
| **Norrsken East Africa** (Kigali) | Local presence, mission alignment | 🔴 not re-verified |
| Catalyst Fund, Rwanda Innovation Fund, Future Africa, Ingressive, Renew Capital | Early-stage African VC | 🔴 not re-verified |
| Google for Startups Africa, Mastercard Foundation, Gates Foundation | Programme and grant funding; Gates has funded both Proto and Rwanda's AI Scaling Hub | 🔴 not re-verified |
| Revenue | The most under-rated source. Direct SME sales at \$14–61/month generate cash from month one | — |

**Research gap flagged honestly:** African startup funding totals for 2025–2026 (Partech Africa, The Big Deal, Disrupt Africa) and current ticket sizes from the funds above could not be obtained. A dedicated follow-up pass is needed before any figure appears in a pitch ([Doc 13](13-open-questions-and-validation.md)).

**Sequencing view:** a non-dilutive grant (GSMA or similar) plus pilot revenue could carry Phases 0–2. Equity is best raised after Phase 1 produces the two numbers that matter — Kinyarwanda ASR performance on real telephone audio, and measured missed-calls-recovered per business. Those two numbers are worth more in a fundraise than any amount of market sizing.

---

## 10. The financial risks, stated plainly

1. **The bundle sizes in §6.2 may be unprofitable at real usage.** Unvalidated. Phase 1 measures it. Do not publish pricing before then.
2. **Self-hosting economics rest on an unmeasured concurrency figure.** If a GPU serves 4 concurrent sessions rather than 10, stack D's cost more than doubles and the break-even moves out substantially.
3. **Telephony remains ~85% of marginal cost even self-hosted.** The long-run margin story depends on the carrier migration in [Document 07](07-telephony-and-networking.md), which is a commercial negotiation, not an engineering task.
4. **The RWF/USD asymmetry is structural.** Revenue is in Rwandan francs; AI compute, GPU rental and managed APIs are priced in dollars and do not get cheaper for Rwanda. Currency depreciation compresses margin directly. Self-hosting on locally-priced infrastructure is the only real hedge.
5. **WhatsApp costs rise on 1 October 2026** as service messages become billable. Modest in absolute terms, but it must be in the model.
6. **CAC is entirely unvalidated.** Field sales to micro-businesses is labour-intensive, and a CAC of \$80 against a \$221 LTV is a thin business. The channel strategy in §8.2 exists because direct sales alone probably cannot reach the SOM.

---

## Sources

Rwanda market: [NISR IBES 2024](https://statistics.gov.rw/sites/default/files/documents/2026-03/IBES2024_Main%20Report_English_0.pdf) · [NISR key figures](https://statistics.gov.rw/print/pdf/node/236) · [Rwanda MSME FinMap 2024](https://afr.rw/downloads/rwanda-msme-finmap-report-2024/) · [Worldometer Rwanda GDP](https://www.worldometers.info/gdp/rwanda-gdp/) · [RURA ICT Statistics Q1 2026](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Statistics/Quarterly_publication/ICT_Sector_Statistics_Report_as_of_the_First_Quarter_2026.pdf) · [DataReportal Digital 2025 Rwanda](https://datareportal.com/reports/digital-2025-rwanda) · [WhatsApp penetration in Africa, AskYazi](https://www.askyazi.com/articles/whatsapp-penetration-across-africa-statistics-by-country) · [MTN MoMo Rwanda results](https://technext24.com/2025/11/04/mtns-momo-rwanda-5-8m-subscribers-2025/) · [MTN Rwanda 8 million subscribers](https://www.mtn.co.rw/newsabout/mtn-rwanda-surpasses-8-million-subscribers-and-accelerates-digital-inclusion-through-innovative-smartphone-initiatives/)

Regional: [Nigeria small business statistics, Moniepoint](https://moniepoint.com/blog/nigeria-small-business-statistics) · [Kenya SIM penetration, Techweez](https://techweez.com/2026/04/08/kenya-ends-2025-with-149-percent-sim-penetration/) · [Kenya smartphone penetration](https://techweez.com/2026/04/07/kenya-smartphones-penetration-feature-phone-decline/)

Market forecasts: [Conversational AI market, Grand View](https://www.grandviewresearch.com/industry-analysis/conversational-ai-market-report) · [AI voice agents market, Grand View](https://www.grandviewresearch.com/industry-analysis/ai-voice-agents-market-report) · [CCaaS market, Grand View](https://www.grandviewresearch.com/industry-analysis/contact-center-as-a-service-market)

Labour: [Glassdoor receptionist, Kigali](https://www.glassdoor.com/Salaries/kigali-kigali-receptionist-salary-SRCH_IL.0,13_IC3972329_KO14,26.htm) · [Playroll cost of hiring in Rwanda](https://www.playroll.com/employment-cost/rwanda) · [Glassdoor call centre agent, Nairobi](https://www.glassdoor.com/Salaries/nairobi-call-centre-agent-salary-SRCH_IL.0,7_IM1085_KO8,25.htm)

Costs: [Africa's Talking pricing](https://africastalking.com/pricing) · [Twilio Rwanda voice](https://www.twilio.com/en-us/voice/pricing/rw) · [Twilio Rwanda SMS](https://www.twilio.com/en-us/sms/pricing/rw) · [Deepgram pricing](https://deepgram.com/pricing) · [Cartesia pricing](https://cartesia.ai/pricing) · [ElevenLabs pricing](https://elevenlabs.io/pricing) · [OpenAI API pricing](https://openai.com/api/pricing/) · [RunPod pricing](https://www.runpod.io/pricing) · [Retell pricing](https://retellai.com/pricing) · [Vapi pricing](https://vapi.ai/pricing) · [Bland pricing](https://bland.ai/pricing) · [Intercom pricing](https://www.intercom.com/pricing) · [Smith.ai pricing](https://smith.ai/pricing) · [ManyChat pricing](https://manychat.com/pricing) · [Wati pricing](https://www.wati.io/pricing/) · [AiSensy pricing](https://aisensy.com/pricing/usd)

Payments and funding: [Flutterwave Rwanda](https://flutterwave.com/rw/) · [Paystack countries](https://paystack.com/countries) · [GSMA Innovation Fund](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma-innovation-fund/) · [XE USD/RWF](https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=RWF)

---

*Next: [12 — Roadmap, Team & Risk](12-roadmap-team-and-risk.md)*
