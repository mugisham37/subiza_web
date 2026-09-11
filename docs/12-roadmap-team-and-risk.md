# 12 — Roadmap, Team & Risk

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. How this roadmap is constructed

Phases are defined by **what becomes known**, not by what gets built. Each phase has a falsifiable exit criterion, and each is sequenced so that the cheapest way to discover a fatal problem comes first.

The project has four assumptions that could each end it, and they are ordered by how cheaply they can be tested:

| Assumption | Cost to test | Phase |
|---|---|---|
| Call forwarding works and preserves caller ID on MTN/Airtel | **One afternoon, two SIM cards** | 0 |
| Kinyarwanda ASR is usable on 8 kHz telephone audio | A few weeks and some recording effort | 0 |
| Latency to Rwanda is achievable from available hosting | Days of measurement | 0 |
| Rwandan SMEs will pay for this | Months of pilot | 1 |

**Phase 0 exists to test the three cheap ones before spending money on the expensive one.**

---

## 2. Phase 0 — Prove the physics (6 weeks)

**Goal:** answer one real Rwandan phone call with an AI, end to end, and know the truth about Kinyarwanda.

### Workstreams

| # | Work | Output |
|---|---|---|
| 0.1 | **Call-forwarding test.** Dial `**21#`, `**61#`, `**67#`, `**62#` on live MTN and Airtel SIMs. Forward to a test number. Verify: do the codes work; does caller ID survive; who pays for the forwarded leg and how much; can forwarding be managed programmatically | A one-page memo that either confirms or destroys the go-to-market |
| 0.2 | **Audio collection.** Record 20–50 real Rwandan customer-service calls with consent, in Kinyarwanda, English and code-switched speech. Human-transcribe them | The first version of the evaluation set — the most valuable artefact of this phase |
| 0.3 | **ASR benchmark.** Evaluate Whisper large-v3, faster-whisper, Parakeet TDT, Canary, MMS and any published Kinyarwanda fine-tune on that audio at 8 kHz | **One honest word-error-rate number per model per language.** Everything downstream depends on it |
| 0.4 | **Latency measurement.** Measure RTT, jitter and packet loss from a Kigali-connected line to candidate hosting regions — South Africa, Europe, African GPU providers | A hosting decision grounded in measurement |
| 0.5 | **End-to-end walking skeleton.** CPaaS number → WebSocket media → streaming ASR → LLM → streaming TTS → back into the call. English only. Ugly is fine | A phone number that answers and holds a 90-second conversation |
| 0.6 | **Provider confirmation.** Ask Africa's Talking directly whether their Voice API supports real-time bidirectional media streaming | The answer that determines the ingress architecture |
| 0.7 | **Legal scoping.** Engage Rwandan counsel on Article 50 and the voiceprint classification | A written position on whether the intended architecture is lawful |
| 0.8 | **Partner outreach.** Open conversations with Digital Umuganda and Mbaza NLP | A relationship, and access to existing Kinyarwanda corpora |

### Exit criteria

- ✅ A call to a real Rwandan number is forwarded, answered by AI, and held for 90 seconds in English at p50 turn latency under 1,200 ms.
- ✅ Kinyarwanda ASR word error rate on real 8 kHz telephone audio is **measured and written down**.
- ✅ Call-forwarding behaviour on both networks is documented.
- ✅ A hosting region is selected on measured latency.
- ✅ Counsel has given a preliminary position on Article 50.

### Kill criteria — the conditions under which the plan changes

- If **Kinyarwanda ASR word error rate is catastrophically high** and no adaptation path looks credible: pivot to a constrained-interaction model (DTMF menus, keyword spotting, voice-note transcription with human review) for Kinyarwanda, with free conversation in English and French first. The business still works; the moat gets harder.
- If **call forwarding does not work or is prohibitively expensive**: pivot to a dedicated-number model. Onboarding friction rises materially; the value proposition survives.
- If **latency cannot be brought under ~1.2 s from any available hosting**: the voice product as designed is not viable yet. Lead with messaging, keep the voice work as R&D, and revisit as African compute capacity develops.

**Team:** founder plus one engineer, or founder alone with an ML advisor. **Cost:** small — CPaaS credits, some GPU hours, transcription, legal consultation.

---

## 3. Phase 1 — Pilot (3 months)

**Goal:** ten Rwandan SMEs using Subiza daily, and the numbers that prove or disprove the business.

### Build

- Voice: inbound via forwarding, greeting, disclosure, knowledge answering, lead capture, message-taking, escalation.
- Channels: Telegram (first, to prove the messaging core), then WhatsApp Cloud API as Tech Provider, including voice-note handling in both directions.
- Studio v1: onboarding, knowledge entry including price-list photo OCR, voice selection, escalation configuration, the conversation feed.
- Platform: consent registry, Rwanda-resident storage, per-call trace, per-conversation cost accounting, load-testing harness.
- Language: Kinyarwanda in whatever form the Phase 0 measurement supports — full conversation if possible, constrained interaction if not.

### Learn — the numbers that matter

| Question | Why |
|---|---|
| **Minutes consumed per business per month** | **The single most important number in the business model** ([Doc 11 §6.3](11-business-model-and-economics.md)) |
| Containment rate | Determines whether the product replaces work or creates it |
| Missed calls recovered | The value metric that renews subscriptions |
| Concurrency per GPU | Gates every self-hosting and hardware decision |
| Onboarding completion time and drop-off points | Determines whether self-serve is possible in Phase 2 |
| What businesses actually ask the agent | Drives the fast-path answer set |
| Willingness to pay, observed rather than stated | Sets public pricing |

### Compliance and corporate

RDB registration and investment certificate; NCSA registration as controller and processor; Article 50 authorisation application if required; breach runbook with a named owner; terms of service and data-processing agreement drafted.

### Exit criteria

- ✅ 10 businesses using Subiza daily for at least 4 weeks.
- ✅ Containment rate above 70%.
- ✅ Measured missed-calls-recovered per business.
- ✅ At least 5 of the 10 say they would pay, and at least 3 actually do.
- ✅ Unit economics measured, not modelled.
- ✅ NCSA registration complete.

**Team:** 2–4. **Cost:** the largest expense is people; infrastructure remains modest.

---

## 4. Phase 2 — Product (4 months)

**Goal:** a business owner can go from signup to a live agent in under an hour, unaided.

### Build

- Onboarding without hand-holding, on a phone browser, in Kinyarwanda and English.
- Knowledge ingestion from photographed price lists, documents, websites and Instagram profiles.
- Appointment booking with calendar integration; order intake.
- Warm transfer and live takeover in Studio.
- Channels: Instagram DM and comment-to-DM, Messenger, SMS via local aggregator, web chat widget, WhatsApp Flows.
- MoMo billing: prepaid credits, top-up, alerts, overage caps.
- Analytics: the "calls you would have missed" weekly report.
- Self-hosting begins: TTS first, then ASR, gated on measured benchmarks.
- RURA ASP licence application, using this documentation set as the technical deliverable.

### Exit criteria

- ✅ Onboarding completion rate above 60% without human assistance.
- ✅ 100+ paying businesses.
- ✅ Gross margin positive on the managed stack at observed utilisation.
- ✅ RURA ASP licence granted or in final process.
- ✅ Public pricing set from measured data.

**Team:** 5–8.

---

## 5. Phase 3 — Language moat (continuous from month 3, intensive months 9–18)

**Goal:** Kinyarwanda that genuinely works, owned rather than licensed.

Runs in parallel with Phases 1–2 rather than after them, because the data pipeline must be correct from the first call.

| Workstream | Detail |
|---|---|
| **Consented data pipeline** | Opt-in capture, anonymisation, human transcription and QA, versioned corpus with lineage |
| **Kinyarwanda ASR adaptation** | Fine-tune the best base on public corpora plus telephone-domain augmentation (codec simulation, noise injection, bandwidth reduction) plus production data |
| **Kinyarwanda TTS** | Build on Digital Umuganda's YourTTS work or fine-tune a streaming model; recruit and properly compensate consenting voice talent |
| **Code-switching** | Handle Kinyarwanda–English–French mixing within a single utterance |
| **Kinyarwanda understanding** | Domain adaptation using Mbaza's 25 M-word monolingual corpus |
| **Open contribution** | Publish evaluation benchmarks; contribute a portion of anonymised data back to the ecosystem |

**Exit criteria:** Kinyarwanda ASR materially better than any public baseline on telephone audio; a Kinyarwanda voice that Rwandan listeners rate as natural in blind comparison; code-switching handled without a language-selection menu.

---

## 6. Phase 4 — Scale and margin (months 12–24)

**Goal:** unit economics that compound, and a second market.

- Self-hosted inference in production for ASR, TTS and LLM.
- Own SIP trunking; MTN Unicall commercial discussion; media edge colocated in Kigali.
- Channel distribution: agencies, MoMo Business, POS platforms, bank SME programmes, PSF sector chambers.
- Kenya launch — Swahili leverage, M-Pesa billing, Nairobi presence.
- WhatsApp Business Calling; USSD if research justifies it; outbound with full consent infrastructure if pursued at all.
- Reseller and white-label tier.

**Exit criteria:** 500+ paying businesses; gross margin above 60%; Kenya live with paying customers; the telephony migration begun.

---

## 7. Team

### 7.1 Growth by phase

| Phase | Headcount | Composition |
|---|---:|---|
| 0 | 1–2 | Founder + ML advisor or first engineer |
| 1 | 2–4 | + backend/voice engineer, + part-time Kinyarwanda annotation |
| 2 | 5–8 | + frontend, + ML engineer, + first sales/customer-success hire |
| 3 | 8–12 | + SRE, + data/annotation lead, + more sales |
| 4 | 12–20 | + Kenya team, + partnerships, + support |

### 7.2 The critical early hires

| Role | Why | Where to find them |
|---|---|---|
| **Voice/telephony engineer** | The scarcest and most load-bearing skill. SIP, RTP, codecs, latency. Everything depends on this working | Telecom operators, regional CPaaS companies, the open-source telephony community |
| **ML engineer with speech experience** | Owns Ijwi and the Kinyarwanda programme | African NLP community, universities, Digital Umuganda and Mbaza networks |
| **Kinyarwanda annotation lead** | The language moat is human work before it is model work | Local universities, translation and linguistics community |
| **Field sales / customer success, Kinyarwanda-speaking** | Phase 2 is won in Nyabugogo and Kimironko, not on a website | Local; likely from SME-facing sales rather than tech |

### 7.3 What the founder must personally own

Given the breadth, the founder cannot do everything. Three things should not be delegated early:

1. **Customer conversations.** The first hundred businesses should be understood personally. Delegated too early, the product drifts from the market.
2. **Regulatory relationships.** RURA, NCSA, RDB, the AI Agency, MTN. These are relationships, not transactions.
3. **The language partnership strategy.** Digital Umuganda, Mbaza NLP, Intron Health. This determines the moat and requires trust that transfers poorly.

### 7.4 Advisors worth recruiting early

A Rwandan data-protection lawyer; a telecom engineer with East African carrier experience; someone who has run a speech-ML programme for a low-resource language; and an operator who has sold SaaS to African SMEs at volume. Each of these substitutes for months of learning.

---

## 8. Risk register

Scored **Likelihood × Impact**, both High / Medium / Low.

### 8.1 Technical

| # | Risk | L | I | Mitigation | Owner |
|---:|---|---|---|---|---|
| T1 | **Kinyarwanda ASR unusable on 8 kHz telephone audio** | M | **H** | Phase 0 measures it before commitment. Fallbacks: constrained interaction, DTMF, voice-note transcription; partner with Intron Health; English/French first | ML |
| T2 | **Latency cannot meet budget from available hosting** | M | **H** | Measure in Phase 0. Mitigations: African GPU capacity, edge media in Kigali, aggressive turn-detection optimisation, fast-path answers | Platform |
| T3 | Concurrency per GPU far below assumption | M | H | Benchmark in Phase 1 before any hardware commitment; managed fallback always available | SRE |
| T4 | Africa's Talking cannot stream media | M | H | Confirm in Phase 0. Fallback: hybrid local-number-plus-SIP-bridge, or self-hosted media server | Voice |
| T5 | Model licence problem discovered late | L | **H** | Licence audit as a gate before any model enters production; repeated per checkpoint | ML |
| T6 | Hallucinated prices or commitments damage a customer | M | H | Structured fields for prices; refusal threshold; owner-approved fast-path answers; zero-tolerance incident handling | ML |
| T7 | Barge-in and turn-taking feel wrong | M | M | Semantic turn detection; session-actor-level barge-in; real-user testing early | Voice |
| T8 | Toll fraud on an exposed SIP endpoint | M | H | Hardened edge, rate limiting, geographic restrictions, hard spend caps | SRE |

### 8.2 Regulatory and legal

| # | Risk | L | I | Mitigation |
|---:|---|---|---|---|
| R1 | **NCSA refuses or delays Article 50 authorisation** | M | **H** | Rwanda-resident storage from day one; treat cross-border inference as temporary and authorised; accelerate self-hosting if refused |
| R2 | Voiceprint classified as sensitive biometric data with strict conditions | **H** | M | Assume it is; design consent, controls and audit accordingly from the start; no speaker verification until confirmed |
| R3 | RURA licence delayed or refused | L | H | Apply early; the ASP category explicitly covers VoIP; documentation deliverables already exist |
| R4 | New AI Agency imposes unanticipated requirements | M | M | Engage proactively and early; be a known, cooperative party |
| R5 | Data breach with a 48-hour reporting clock | L | **H** | Runbook, named owner, detection tooling, annual rehearsal |
| R6 | Voice-cloning misuse incident | L | **H** | Mandatory recorded consent; refuse unverifiable requests; default to synthetic voices; full synthesis audit |

### 8.3 Platform and supplier

| # | Risk | L | I | Mitigation |
|---:|---|---|---|---|
| P1 | **A tenant's WABA is banned** | M | M per tenant | Per-tenant isolation; policy and quality monitoring; opt-in enforcement in onboarding; never single-channel dependence |
| P2 | Meta tightens AI policy further | M | H | Business-scoped agents by construction; visible escalation; multi-channel by design |
| P3 | WhatsApp costs rise beyond the October 2026 change | M | M | Model conservatively; meter voice, bundle messages |
| P4 | Managed AI provider price rise or deprecation | **H** | M | Pluggable provider layer (A1) — this is precisely why it exists |
| P5 | Language partner becomes a competitor | M | M | Never single-source the language layer; maintain internal fine-tuning capability and an owned evaluation set |

### 8.4 Commercial

| # | Risk | L | I | Mitigation |
|---:|---|---|---|---|
| C1 | **Bundle sizes are unprofitable at real usage** | **H** | H | Do not publish pricing until Phase 1 measures utilisation; recalibrate before launch |
| C2 | CAC too high for direct sales to micro-businesses | **H** | H | Channel strategy from Phase 3; referral mechanics; make self-serve genuinely work |
| C3 | Churn above 8% monthly | M | H | The weekly value report; onboarding quality; a free tier that proves value before payment |
| C4 | RWF depreciation compresses dollar-denominated cost margin | M | M | Self-host on locally-priced infrastructure; price reviews; consider limited USD pricing for larger customers |
| C5 | MTN or Airtel launch a competing service | L | **H** | Move faster; build the language moat; consider white-label supply to the operator rather than competing |
| C6 | A well-funded entrant adds Kinyarwanda | M | H | The proprietary telephone-domain corpus is the defence; deepen it early |
| C7 | Businesses do not trust AI with customers | M | H | Free trial that works; local presence; transparent pricing; the demo on their own business |

### 8.5 Organisational

| # | Risk | L | I | Mitigation |
|---:|---|---|---|---|
| O1 | **Founder-shaped risk — the project spans more disciplines than one person covers** | **H** | **H** | Phase 0 sized for 1–2 people; hire against phase gates; recruit advisors early; buy the hardest infrastructure rather than building it |
| O2 | Cannot hire voice/telephony expertise in Kigali | M | H | Remote hiring; extended CPaaS reliance; train internally; partner with a telecom engineering firm |
| O3 | Running 24/7 real-time infrastructure with a small team | **H** | M | Automated degradation over heroics; CPaaS in early phases; realistic SLOs |
| O4 | Scope creep into a developer platform or enterprise product | M | M | The non-goals in [Doc 04 §5.4](04-solution-and-product.md) are the defence; revisit them when tempted |

### 8.6 The top five, consolidated

1. **T1 — Kinyarwanda on telephone audio.** The core product premise. Phase 0 exists for this.
2. **R1 — Article 50 data localisation.** Could invalidate the infrastructure architecture. Resolve with counsel before build.
3. **C1 — pricing versus real usage.** Could make every sale unprofitable. Measure before publishing.
4. **O1 — founder breadth.** The most common cause of death for ambitious technical projects.
5. **T2 — latency from Rwanda.** A hard physical constraint that no amount of engineering fully escapes.

---

## 9. Key performance indicators by phase

| KPI | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---|---|---|---|---|
| Businesses live | 1 (test) | 10 | 100+ | 300+ | 500+ |
| Paying businesses | 0 | 3+ | 100+ | 300+ | 500+ |
| Turn latency p50 | < 1,200 ms | < 1,000 ms | < 900 ms | < 800 ms | < 800 ms |
| Containment rate | — | > 70% | > 75% | > 80% | > 80% |
| Kinyarwanda WER (8 kHz) | **measured** | baseline − 20% | − 35% | − 50% | best available |
| Onboarding unaided | — | — | > 60% | > 70% | > 75% |
| Gross margin | — | measured | > 0% | > 40% | > 60% |
| Monthly churn | — | — | < 8% | < 6% | < 5% |
| Missed calls recovered / business / month | — | measured | > 15 | > 20 | > 20 |

---

## 10. Decision points

Moments where the plan should be consciously re-examined rather than continued by momentum.

| When | Decision | Inputs |
|---|---|---|
| **End of Phase 0** | Is the core premise viable? Full build, pivot to constrained Kinyarwanda, or messaging-first? | Kinyarwanda WER; latency measurements; forwarding behaviour |
| **End of Phase 1** | Is there a business? Continue, reprice, or reposition? | Utilisation, containment, willingness to pay, unit economics |
| **~30–50 k voice minutes/month** | Begin self-hosting? Which component first? | Concurrency benchmark, engineering capacity, Article 50 position |
| **~100 businesses** | Does self-serve work, or is this a field-sales business? | Onboarding completion rate, CAC |
| **~300 businesses** | Second market now or deepen Rwanda? | Rwandan penetration, churn, capital position |
| **Any time** | Does an acquisition or partnership offer beat the independent path? | Particularly relevant with MTN, Proto, or a regional player |

---

*Next: [13 — Open Questions & Validation Plan](13-open-questions-and-validation.md)*
