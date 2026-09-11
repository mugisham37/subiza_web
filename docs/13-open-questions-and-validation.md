# 13 — Open Questions & Validation Plan

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. Why this document exists

Every other document in this set states what is known. This one states what is not, and how to find out. It exists because the most common failure of a project document is confident prose covering an unexamined assumption — and because a plan that names its own unknowns is far more useful to an engineer, an investor or a regulator than one that does not.

Questions are grouped by what they block and ordered by information value per unit of effort. Each carries a method, an owner and a phase.

**Legend:** 🔴 blocks the build · 🟠 blocks a launch · 🟡 shapes strategy · 🟢 improves accuracy

---

## 2. The four questions that decide whether the project proceeds

These come before everything. Each is cheap to answer relative to what it determines.

### Q1 🔴 What is the Kinyarwanda word error rate on real 8 kHz telephone audio?

**Why it decides everything.** Every published ASR benchmark is on clean 16 kHz wideband audio. Telephone audio typically degrades word error rate by a factor commonly cited as 1.5–3×, and Kinyarwanda is low-resource before that penalty applies. The research found **no reliable published figure** for any model on this combination. If the answer is bad and no adaptation path is credible, the core product premise — natural Kinyarwanda conversation on a phone call — does not hold in its current form.

**Method.** Record 20–50 real Rwandan customer-service calls with consent, covering Kinyarwanda, English and code-switched speech, across handset types and network conditions. Human-transcribe them. Downsample and codec-match to production conditions (8 kHz, G.711 A-law). Benchmark Whisper large-v3, faster-whisper, Parakeet TDT, Canary, MMS and any published Kinyarwanda fine-tune. Also test bandwidth extension as a mitigation.

**Owner:** founder / ML advisor. **Phase 0.** **Effort:** 3–4 weeks.

**Decision:** if usable → full build. If marginal → adaptation programme with English/French leading. If unusable → constrained interaction for Kinyarwanda (DTMF menus, keyword spotting, voice-note transcription with review) and a re-evaluation of the moat.

### Q2 🔴 Does call forwarding work on MTN and Airtel Rwanda, and does caller ID survive?

**Why it decides the go-to-market.** The entire acquisition strategy is "keep your number, dial one code." If forwarding does not work, is expensive, or strips the caller's identity, onboarding friction rises dramatically.

**Four sub-questions:** do the standard GSM codes (`**21#`, `**61#`, `**67#`, `**62#`) work on both networks today? Does the original caller's number reach the terminating provider (diverting-party information in the SIP headers)? Who pays for the forwarding leg and how much? Can forwarding be managed programmatically or only by USSD?

**Method.** Two SIM cards, a test number on a CPaaS with SIP header inspection, a third phone, and an afternoon. Confirm billing with a monitored prepaid SIM and with MTN and Airtel customer service.

**Owner:** founder. **Phase 0.** **Effort:** one day.

**This is the highest information-per-effort action available to the project.**

### Q3 🔴 Can the latency budget be met from available hosting?

**Why it matters.** Rwanda is landlocked; the nearest hyperscaler regions are ~3,000 km away in South Africa; connectivity runs terrestrially through Kenya and Tanzania to submarine cables. Estimates of 60–100 ms to South Africa and 150–250 ms to Europe are plausible but **unmeasured**. Against an 800 ms total budget, the difference determines the architecture.

**Method.** From a Kigali-connected line, measure RTT, jitter and packet loss to: South African cloud regions, European regions, African GPU providers, and Kigali colocation facilities. Test at different times of day. Then run the walking skeleton against the best candidate and measure real turn latency.

**Owner:** founder / platform. **Phase 0.** **Effort:** one week.

### Q4 🔴 Does Article 50 permit the intended architecture?

**Why it blocks the build.** Rwandan Law 058/2021 Article 50 requires personal data to be stored in Rwanda unless NCSA authorises otherwise. Streaming call audio to a foreign ASR API is a cross-border transfer of personal data, and a voiceprint is very likely "biometric information" under Article 3(2), whose unlawful processing carries 7–10 years imprisonment and RWF 20–25 million under Article 60.

**Method.** Engage a Rwandan data-protection lawyer. Obtain a written position on: what constitutes storage versus transient processing; whether a foreign inference API can be authorised as a named processor; the authorisation process and timeline; the voiceprint classification; and whether a DPIA is formally required. Then approach NCSA directly.

**Owner:** founder + counsel. **Phase 0.** **Effort:** 2–4 weeks and a legal fee.

**Decision:** if transient processing abroad can be authorised → managed APIs viable in Phase 0–2. If not → self-hosting moves from a Phase 3 optimisation to a Phase 1 requirement, and the whole cost and timeline model changes.

---

## 3. Technical questions

| # | Question | Priority | Method | Phase |
|---:|---|---|---|---|
| T1 | **Does Africa's Talking Voice API support real-time bidirectional media streaming?** Their published Voice API appears to be XML-callback/IVR-era with no evidence of a WebSocket product — but this was not confirmed | 🔴 | Ask Africa's Talking directly; read their developer API reference in full | 0 |
| T2 | **How many concurrent voice sessions can one GPU serve** for ASR, LLM and TTS at the target latency? No reliable published figure exists for any component | 🔴 | Build a load-testing harness driving synthetic concurrent calls through the real pipeline; measure the latency distribution as concurrency rises | 1 |
| T3 | Which TTS — Orpheus or Chatterbox — sounds better to Rwandan listeners over an 8 kHz line? | 🟠 | Blind preference test with Rwandan listeners, on codec-matched audio | 1 |
| T4 | How much telephone-domain Kinyarwanda audio is needed for a material WER improvement? | 🟠 | Incremental fine-tuning experiments as the corpus grows; plot the learning curve | 2–3 |
| T5 | What is the current validated hour count of Common Voice Kinyarwanda? | 🟡 | Check the current release directly | 0 |
| T6 | Does bandwidth extension (8 kHz → 16 kHz) meaningfully improve ASR here? | 🟠 | A/B on the evaluation set | 1 |
| T7 | What is the real African-accented-English WER? No published benchmark found | 🟡 | Include in the Phase 0 evaluation set | 0 |
| T8 | Does semantic turn detection deliver the expected latency saving on Kinyarwanda speech patterns? | 🟠 | Measure false-interruption rate and end-of-turn delay against silence-threshold VAD | 1 |
| T9 | What are MTN Unicall's technical specifications — capacity, codecs, IP requirements, SLA? | 🟡 | MTN Enterprise sales conversation | 2 |
| T10 | Does Airtel Rwanda offer SIP trunking? | 🟡 | Airtel Rwanda business unit | 2 |
| T11 | Does any CPaaS or cloud provider peer at RINEX? | 🟡 | Ask RICTA and RINEX directly | 1 |
| T12 | Is GPU capacity available in or near Rwanda, at what price and latency? | 🟠 | RISA, local ISPs, PAIX, TrAC, Cassava's roadmap | 1 |

---

## 4. Regulatory and legal questions

All of these require a Rwandan lawyer. They are restated from [Document 09 §10](09-legal-regulatory-ethics.md) with method and phase.

| # | Question | Priority | Phase |
|---:|---|---|---|
| L1 | Article 50 — scope, process, timeline, and whether foreign inference can be authorised *(= Q4)* | 🔴 | 0 |
| L2 | Is a voiceprint "biometric information" under Art. 3(2)? Confirm in writing with NCSA | 🔴 | 0 |
| L3 | Is a DPIA formally required, and under what instrument? | 🟠 | 1 |
| L4 | Does any Rwandan statute govern call-recording consent beyond Law 058/2021's general principles? | 🟠 | 1 |
| L5 | Is outbound AI calling regulated? Does any consumer-protection instrument cover unsolicited calls and SMS? | 🟡 | 2 |
| L6 | What are the National AI Agency's actual powers? Is there a registration or sandbox requirement for private AI companies? | 🟠 | 1 |
| L7 | NCSA registration fee and realistic process timeline | 🟠 | 1 |
| L8 | Toll-free number acquisition — direct from RURA or via an operator, at what cost? | 🟢 | 2 |
| L9 | VAT and Digital Services Tax treatment of SaaS subscription revenue; is a local tax representative required? | 🟠 | 2 |
| L10 | Any language-access obligation on licensed ASPs? | 🟢 | 2 |
| L11 | Employment law for the annotation workforce the language programme requires | 🟢 | 2 |
| L12 | ToS and data-processing agreement drafting for a multi-tenant processor relationship | 🟠 | 1 |
| L13 | Trademark availability and registration for "Subiza" in Rwanda and regionally | 🟠 | 1 |
| L14 | **Which RURA ASP fee row applies to an AI voice platform** — the general row (USD 100 + USD 1,000) or the row naming VoIP (USD 500 + USD 5,000)? And what performance bond does Article 23 set for it? | 🟠 | 1 |

---

## 5. Platform and channel questions

| # | Question | Priority | Method | Phase |
|---:|---|---|---|---|
| M1 | **Are WhatsApp marketing templates genuinely unavailable for Rwandan WABAs?** A provider rate card reports this; it could not be corroborated on Meta's own materials | 🟠 | Check directly in a live Meta Business Manager account with a Rwandan number | 1 |
| M2 | What is the real cost impact of the 1 October 2026 service-message change at pilot volumes? | 🟠 | Model from pilot message volumes once measured | 1 |
| M3 | Is the reported RURA annual USSD fee correct? The figure found appears anomalously high relative to other RURA fees | 🟡 | RURA fee schedule | 2 |
| M4 | Is Instagram's ~200 automated messages/hour limit real? Third-party source only | 🟡 | Meta developer docs; empirical testing | 2 |
| M5 | Does Meta's Handover Protocol extend to WhatsApp, or is it Messenger/Instagram only? | 🟡 | Meta documentation | 2 |
| M6 | What are the exact WhatsApp quality-rating mechanics? | 🟢 | Observe in production across tenants | 2 |
| M7 | Should Subiza become a Meta Solution Partner to bundle WhatsApp billing into a MoMo-payable invoice? | 🟡 | Evaluate against onboarding drop-off caused by requiring tenants to attach a payment method to Meta | 2–3 |
| M8 | What is the Rwanda voice/IVR per-minute rate? Two sources conflicted | 🟢 | Direct quote from Africa's Talking | 0 |

---

## 6. Market and commercial questions

| # | Question | Priority | Method | Phase |
|---:|---|---|---|---|
| B1 | **How many minutes per month does a real business actually consume?** The single most important number in the business model — every pricing tier depends on it | 🔴 | Measure across all pilot businesses for at least 8 weeks | 1 |
| B2 | **How many enquiries does a Rwandan SME actually miss, and what does it cost them?** The loss model in [Doc 01 §5](01-problem-analysis.md) is a model, not a measurement | 🔴 | 30 structured SME interviews plus instrumented measurement during the pilot | 0–1 |
| B3 | What will they actually pay? Stated versus revealed preference | 🔴 | Pilot pricing experiments with real payment, not surveys | 1 |
| B4 | What is real CAC by channel? | 🟠 | Measure through Phase 2 field sales | 2 |
| B5 | What is real monthly churn? | 🟠 | Measure from Phase 2 | 2–3 |
| B6 | Are the bundle sizes in [Doc 11 §6.2](11-business-model-and-economics.md) profitable at real utilisation? | 🔴 | Combine B1 with measured cost per minute | 1 |
| B7 | MSME counts for Kenya, Uganda, Tanzania, Ghana and Ethiopia — none verified from national statistics agencies | 🟡 | KNBS, UBOS, Tanzania NBS, Ghana Statistical Service, Ethiopian Ministry of Trade | 3 |
| B8 | MTN MoMo Collections API fee schedule | 🟠 | MTN developer portal / MoMo business team | 2 |
| B9 | Is Stripe available for Rwanda? Flutterwave and Paystack are confirmed | 🟢 | Direct check | 2 |
| B10 | SMB SaaS churn, CAC and gross-margin benchmarks for African markets — global benchmarks are not applicable | 🟡 | Ask comparable African SaaS operators directly; Norrsken and Catalyst Fund portfolios | 2 |
| B11 | African startup funding totals for 2025–26 and current ticket sizes (Partech Africa, The Big Deal, Disrupt Africa; Norrsken, Catalyst, Rwanda Innovation Fund, Google for Startups Africa, Mastercard Foundation) | 🟡 | Direct reports and fund websites | 2 |
| B12 | Private Sector Federation structure and whether it is a viable distribution channel | 🟡 | Direct engagement | 2 |
| B13 | Rwanda BPO strategy documents and current employment figures; Kenyan BPO employment and AI-displacement data | 🟡 | RDB, MINICT, sector reports | 2 |

---

## 7. Competitive intelligence to maintain

Not one-off questions but a standing watch, reviewed quarterly.

| # | Watch item | Why | Signal source |
|---:|---|---|---|
| X1 | **Does Proto launch an SME self-serve tier in Rwanda?** | The most credible direct threat — they already have Kinyarwanda voice AI in production locally, government relationships and Gates Foundation funding | proto.cx, Rwandan press |
| X2 | **Does AethexAI add Kinyarwanda?** | The closest well-funded regional analogue; \$3 M pre-seed, 17,000+ calls/day | TechCrunch, their site |
| X3 | **Does Wati ship voice in African markets?** | Would close the voice+chat gap that is currently a wedge | wati.io |
| X4 | Do ElevenLabs, Deepgram or Cartesia add Kinyarwanda? | Would commoditise part of the moat | Vendor language pages |
| X5 | Do MTN or Airtel launch an AI answering service? | Existential in the near term; also a partnership opportunity | Operator press |
| X6 | New well-funded African voice-AI rounds | New entrant mapping | TechCabal, Disrupt Africa, Partech |
| X7 | Meta AI policy changes on WhatsApp | Directly changes the Inbox product surface | Meta developer blog |
| X8 | Whether any African AI-voice startup has failed, and why | No shutdown story was found; the absence is itself uninformative and worth resolving | Regional tech press |

---

## 8. Consolidated validation plan

### Week 1–2 — cost almost nothing, decide almost everything

| Action | Answers |
|---|---|
| Test call forwarding on live MTN and Airtel SIMs | Q2 |
| Ask Africa's Talking about media streaming | T1 |
| Measure latency from Kigali to candidate regions | Q3 |
| Engage a Rwandan data-protection lawyer | Q4, L1–L4 |
| Open conversations with Digital Umuganda and Mbaza NLP | Language partnership |
| Check Common Voice Kinyarwanda's current release | T5 |

### Week 3–6 — the measurement that matters

| Action | Answers |
|---|---|
| Collect and transcribe 20–50 real Rwandan calls | Q1 evaluation set |
| Benchmark ASR candidates on that audio at 8 kHz | **Q1** |
| Build the walking skeleton and measure real turn latency | Q3 |
| Interview 30 SMEs on missed enquiries and willingness to pay | B2, B3 |

### Month 2–4 — build the pilot, measure the business

| Action | Answers |
|---|---|
| Ten design partners live | B1, B2, B3, B6 |
| Concurrency load-testing harness | T2 |
| Blind TTS preference testing | T3 |
| NCSA and RDB registration | L7 |
| WhatsApp Tech Provider verification and Rwandan template check | M1 |

### Month 5+ — as the product and questions mature

Everything remaining, driven by which decision is next.

---

## 9. What would change the plan most

Ranked by how much a single answer moves the strategy:

1. **Kinyarwanda WER is unusable (Q1).** The moat and the core product both change shape. The business survives; the differentiation weakens substantially.
2. **Article 50 forbids foreign inference (Q4).** Self-hosting becomes a Phase 1 requirement, not a Phase 3 optimisation. Timeline and capital requirement both increase materially.
3. **Call forwarding does not work (Q2).** Go-to-market becomes dedicated-number-based; conversion friction rises significantly.
4. **Utilisation is far above assumption (B1).** Every published price becomes unprofitable; the entire pricing structure needs rebuilding before launch.
5. **Latency cannot be met (Q3).** Voice becomes an R&D track and messaging leads — a very different company.
6. **Proto or a well-funded entrant moves into SME Kinyarwanda voice (X1, X2).** Compete on price, self-serve and distribution rather than on language; or explore partnership.

---

## 10. The discipline this document requires

Three habits, without which this becomes a document that is written once and never read:

1. **Every question gets an owner and a date.** An unowned question is a question nobody answers.
2. **Answers are written back into the relevant document**, not just into a chat message. When Q1 is answered, [Document 06](06-voice-ai-and-ml.md) is updated with the real number and this entry is marked resolved with the finding and its date.
3. **New unknowns are added as they surface.** The list should grow during Phase 0 and shrink during Phase 2. A list that only shrinks means nobody is looking hard enough.

**The honest summary:** this project rests on roughly forty unverified assumptions, four of which could end it. All four can be tested for a few thousand dollars and six weeks of work. That is an unusually good position — most ventures discover their fatal assumption after raising money, not before.

---

*Return to: [Master Documentation](../README.md)*
