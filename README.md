# SUBIZA — Project Documentation

**An AI customer-service platform that answers phone calls and messages for African SMEs, in their customers' own language.**

---

| | |
|---|---|
| **Document** | Master Project Documentation (Pre-Build Analysis & Blueprint) |
| **Version** | 1.0 |
| **Date** | 4 September 2026 |
| **Author / Owner** | Thierry Gusenga (gusenga.thierry@tekaccess.rw) |
| **Status** | Pre-seed / pre-build. Analysis and architecture complete; validation pending. |
| **Home market** | Rwanda, expanding to Kenya, Uganda, Tanzania, then West Africa |
| **Classification** | Internal — founding team, technical advisors, prospective investors |

---

## 0. How to read this documentation

This is not a pitch deck and it is not a specification. It is the **thinking layer** that must exist before either of those can be written honestly. It is designed to be read by three different audiences, and by a fourth that is not human:

1. **The founder and future co-founders** — to hold a shared, precise mental model of what is being built, why, and in what order.
2. **Engineers joining the project** — to understand the architecture, the constraints, and the reasoning behind each technical choice, so they can disagree with the reasoning rather than guess at it.
3. **Investors, partners and regulators** — to see that the problem, the market, the law, and the technical risk have all been examined rather than assumed.
4. **AI development agents** — this document set is deliberately written so that a coding agent given any one sub-document has enough context to implement that layer correctly without needing to re-derive the whole system. Terminology is defined once and used consistently throughout.

**No code appears in this documentation.** Where implementation detail matters, it is described in terms of protocols, data shapes, sequences and responsibilities — the things that survive a change of language or framework — not in terms of source files.

### The document set

| # | Document | What it answers |
|---|---|---|
| — | **README.md** *(this file)* | What is Subiza, why does it exist, what is the shape of the whole thing |
| 01 | [Problem Analysis](docs/01-problem-analysis.md) | What is actually broken, for whom, how badly, and what it costs them |
| 02 | [Stakeholder Analysis](docs/02-stakeholder-analysis.md) | Every party whose cooperation, permission or indifference the project needs |
| 03 | [Competitive Landscape](docs/03-competitive-landscape.md) | Who else is solving this, how, at what price, and where the gap is |
| 04 | [Solution & Product Definition](docs/04-solution-and-product.md) | What Subiza *is* — personas, journeys, capabilities, non-goals |
| 05 | [System Architecture](docs/05-system-architecture.md) | The full technical blueprint, layer by layer |
| 06 | [Voice AI & Machine Learning](docs/06-voice-ai-and-ml.md) | Speech, language, latency, Kinyarwanda, model strategy |
| 07 | [Telephony & Networking](docs/07-telephony-and-networking.md) | How an AI actually gets onto a real phone call in Rwanda |
| 08 | [Messaging Channels](docs/08-messaging-channels.md) | WhatsApp, Telegram, Instagram, SMS, USSD, voice notes |
| 09 | [Legal, Regulatory & Ethics](docs/09-legal-regulatory-ethics.md) | Licences, data protection, consent, voice cloning, AI law |
| 10 | [Infrastructure, DevOps & SRE](docs/10-infrastructure-devops-sre.md) | How it is deployed, scaled, observed and kept alive |
| 11 | [Business Model & Economics](docs/11-business-model-and-economics.md) | Market size, pricing, unit economics, go-to-market |
| 12 | [Roadmap, Team & Risk](docs/12-roadmap-team-and-risk.md) | Phases, org design, hiring, risk register, KPIs |
| 13 | [Open Questions & Validation Plan](docs/13-open-questions-and-validation.md) | What we do not know, and how we will find out |

---

## 1. The name

**Subiza** — Kinyarwanda imperative of *gusubiza*, "to answer, to reply." The related noun *igisubizo* means both "an answer" and "a solution."

The name was chosen because it says the entire product in one word, in the language of the first market, and it means the same thing whether the channel is a ringing phone or an unread WhatsApp message. It is short, pronounceable in English, French and Kinyarwanda, and carries no existing trademark conflict identified in the competitive scan.

**Sub-brands used throughout this documentation:**

| Name | Meaning | What it refers to |
|---|---|---|
| **Subiza** | "Answer" | The company and the platform as a whole |
| **Subiza Voice** | — | The telephony product: AI answers real phone calls |
| **Subiza Inbox** | — | The omnichannel messaging product: WhatsApp, Telegram, Instagram, SMS, web |
| **Subiza Studio** | — | The customer-facing console: agent design, knowledge base, voice, analytics |
| **Ijwi** | Kinyarwanda for "voice" | The internal speech engine — ASR, TTS, turn-taking, language routing |
| **Ubwenge** | Kinyarwanda for "intelligence / wisdom" | The internal reasoning core — LLM orchestration, tools, memory, grounding |

Alternative names considered and rejected: *Ijwi* alone (too narrow — excludes chat), *Muraho* (already used by a competitor's Kinyarwanda voice initiative), *Itumba*, *Vuga*, *Kora*, *Sanza*. Trademark and domain availability must still be verified formally — see [Document 13](docs/13-open-questions-and-validation.md).

---

## 2. The one-paragraph version

Most small and medium businesses in Rwanda and across Africa lose customers not because their product is bad but because **nobody answers**. A call rings out at 7pm. A WhatsApp message sits unread until Monday. An Instagram comment asking "how much?" is never replied to. The business owner is one person doing sales, delivery, accounting and support simultaneously, and a dedicated call centre — the standard solution — costs more per month than the business earns. Subiza puts an AI agent on the other end of the line: it answers the phone in Kinyarwanda, English, French or Swahili with a natural voice, understands what the caller wants, answers from the business's own knowledge, books, quotes, checks and escalates to a human when it should, and does the same thing simultaneously on WhatsApp, Telegram and Instagram — all configured by the business owner in a web console in under an hour, and paid for by mobile money at a fraction of the cost of a single employee.

---

## 3. The problem, in three sentences

1. **Availability is the binding constraint on SME growth.** A Rwandan SME's customers call and message at all hours; the business can only respond during the hours one overworked person is free — so enquiries decay into lost sales and customers who do not return.
2. **The existing solution does not fit the market.** Call centres, contact-centre software and Western AI receptionists all have a price floor — often \$75–\$240 per seat per month plus minimums, or \$300+/month for answering services — that is above what a business earning a few hundred dollars a month can pay, and none of them speak Kinyarwanda on a live call.
3. **The enabling technology has only just arrived.** Real-time speech recognition, low-latency neural speech synthesis, and instruction-following language models became simultaneously good enough and cheap enough within the last 24 months; African-language speech models exist as open datasets and open weights for the first time. The window to build this as an African-owned product, rather than importing it later at Western prices, is open now.

Full treatment: [Document 01 — Problem Analysis](docs/01-problem-analysis.md).

---

## 4. What Subiza does — the capability map

```
                          ┌──────────────────────────────────────┐
    A customer            │            S U B I Z A               │           A business
    ──────────            │                                      │           ───────────
                          │   ┌────────────────────────────┐     │
    calls the ──────────► │   │  CHANNEL LAYER             │     │
    business number       │   │  phone · WhatsApp ·        │     │
                          │   │  Telegram · Instagram ·    │     │
    sends a  ───────────► │   │  SMS · USSD · web chat     │     │
    WhatsApp message      │   └────────────┬───────────────┘     │
                          │                │                     │
    comments on ────────► │   ┌────────────▼───────────────┐     │
    an Instagram post     │   │  IJWI — speech engine      │     │
                          │   │  hear · transcribe ·       │     │
    sends a  ───────────► │   │  detect turn · speak       │     │
    voice note            │   └────────────┬───────────────┘     │
                          │                │                     │
                          │   ┌────────────▼───────────────┐     │
                          │   │  UBWENGE — reasoning core  │     │
                          │   │  understand · retrieve ·   │     │
                          │   │  decide · act · escalate   │     │ ◄──── knowledge base,
                          │   └────────────┬───────────────┘     │       price list, hours,
                          │                │                     │       policies, catalogue
                          │   ┌────────────▼───────────────┐     │
    gets an answer ◄───── │   │  ACTION LAYER              │     │ ────► booking made
    in 1 second,          │   │  book · quote · check ·    │     │       lead captured
    in their language     │   │  record · notify · hand    │     │       order logged
                          │   │  over to a human           │     │       human notified
                          │   └────────────┬───────────────┘     │
                          │                │                     │
                          │   ┌────────────▼───────────────┐     │
                          │   │  SUBIZA STUDIO             │     │ ◄──── owner configures,
                          │   │  configure · review ·      │     │       reviews transcripts,
                          │   │  measure · take over       │     │       sees analytics,
                          │   └────────────────────────────┘     │       takes over live
                          └──────────────────────────────────────┘
```

**The five things a Subiza agent must do well, in priority order:**

1. **Answer instantly, always.** Zero rings missed, 24 hours a day, including at 2am on a public holiday.
2. **Understand the caller in their own language**, including Kinyarwanda and code-switched Kinyarwanda-English-French, over an 8 kHz mobile line with background noise.
3. **Answer correctly from the business's own facts** — its prices, its hours, its stock, its policies — and say "let me get a person for you" rather than invent an answer.
4. **Do something**, not just talk: capture the lead, book the appointment, take the order details, send the WhatsApp follow-up, ring the owner.
5. **Leave a trail** the owner can read in 30 seconds: who called, what they wanted, what was promised, what needs a human.

Full treatment: [Document 04 — Solution & Product Definition](docs/04-solution-and-product.md).

---

## 5. The three hard questions, answered up front

The founder's brief asked, in effect: *is this even possible?* Three questions determine whether the project is real. Here are the honest answers, each expanded in the linked document.

### Q1. Can an AI actually answer a real phone call?

**Yes, unambiguously, and it is already a mature commercial category.** The mechanism is well-established: a call arrives over the public telephone network, is terminated by a telephony provider, and the raw audio is streamed — usually over a WebSocket, as base64-encoded 8 kHz audio frames — to a server that runs speech recognition, a language model, and speech synthesis, streaming synthesised audio back into the same call in real time. Twilio, Telnyx and Plivo all ship this as a documented product primitive. Companies including Retell AI (reportedly 40 million calls per month), Bland and Vapi operate at scale on exactly this architecture.

**The real question is not "can it" but "at what latency, in what language, at what cost, and under whose licence."** A well-engineered cascaded pipeline achieves roughly 600–900 ms from the caller finishing their sentence to the first syllable of the reply. Human conversation has a natural gap of about 200 ms; under 500 ms feels conversational; 800 ms–1.5 s feels slow; beyond 1.5 s people start talking over the agent or hang up. Subiza's engineering target is therefore **p50 ≤ 800 ms, p95 ≤ 1,200 ms**, and every architectural decision in [Document 06](docs/06-voice-ai-and-ml.md) is justified against that budget.

### Q2. Do we have to negotiate with MTN?

**Not to start — and this is the single most important commercial finding in the research.** A Rwandan business can point its existing MTN or Airtel number at a Subiza number using standard GSM call-forwarding supplementary service codes, which are network-level features implemented by essentially every GSM operator:

| Behaviour | Code |
|---|---|
| Forward everything | `**21*<number>#` |
| Forward when busy | `**67*<number>#` |
| Forward when not answered | `**61*<number>#` |
| Forward when unreachable | `##62*<number>#` (deactivate `##62#`) |

This means the go-to-market motion is: *"Keep your number. Dial one code. We answer everything you miss."* Conditional forwarding (busy / no answer / unreachable) is even better than unconditional, because the owner still picks up when they can and Subiza catches only the calls that would otherwise have been lost — which is exactly the value proposition, and exactly the ROI that is easiest to prove.

Carrier interconnect comes later, when volume justifies it. When it does, the paths are known: MTN sells a commercial SIP trunking product (**MTN Unicall**) to any RDB-registered business, and RURA licenses an **Application Service Provider** category whose fee schedule names VoIP in its own row, at **USD 500 application + USD 5,000 licence, five-year term** (a separate, cheaper general ASP row exists — which row applies must be confirmed with RURA). Neither is a wall; both are line items. Full treatment: [Document 07 — Telephony & Networking](docs/07-telephony-and-networking.md).

### Q3. Is VibeVoice the right engine?

**No — and understanding why is important, because the founder's instinct about *what matters* is right even though the specific model is wrong.**

Microsoft's VibeVoice is a genuinely impressive open (MIT-licensed) text-to-speech system, but it is architecturally a **long-form, multi-speaker narration engine** — its headline capability is generating up to 90 minutes of coherent multi-voice audio in a single pass, using a very low-frame-rate tokeniser and a diffusion decoder. That design is optimised for podcasts and audiobooks, not for turn-by-turn conversation where the only number that matters is time-to-first-audio. Microsoft's own materials describe it as a research artifact not recommended for commercial deployment without further testing, and the repository was taken down shortly after release over misuse concerns before being preserved by community forks — meaning any production dependency on it today is a dependency on an unmaintained fork.

**What VibeVoice correctly signals is that open, self-hostable, high-quality voice cloning has arrived.** The right engines for Subiza's live-call path are streaming-native and commercially licensed: **Orpheus TTS** (Apache 2.0) and **Chatterbox** (MIT) as primary candidates, **Kokoro** (Apache 2.0) and **Piper** (MIT) as low-cost fallbacks. VibeVoice keeps a legitimate role in the product for **offline** generation — IVR prompts, onboarding audio, marketing voiceovers — where its long-form quality is an asset and latency is irrelevant. Several otherwise-attractive models (XTTS-v2, F5-TTS official weights, Fish Audio S2 Pro, Higgs Audio v3) are **excluded on licensing grounds** for a paid product; this is a legal constraint, not a taste one. Full treatment: [Document 06 — Voice AI & Machine Learning](docs/06-voice-ai-and-ml.md).

---

## 6. The strategic thesis

Subiza is not "an AI receptionist for Africa." That framing invites a race against Vapi, Retell and Bland on a commoditising per-minute infrastructure price, which a Kigali startup will lose. The thesis is narrower and more defensible:

> **The scarce asset is not the AI. It is the ability to hold a natural conversation in Kinyarwanda over a bad mobile line, at a price a Rwandan SME can pay in mobile money, sold by people the SME can meet.**

Each clause is a moat that global infrastructure players are structurally unlikely to cross:

| Clause | Why incumbents will not cross it |
|---|---|
| **Kinyarwanda on a live call** | 14 million speakers is invisible in a global TTS roadmap. No global voice vendor confirms production-quality Kinyarwanda. The data to fix that exists locally (Common Voice, Digital Umuganda, Mbaza NLP, Intron Health) and requires local relationships to access. |
| **A price a Rwandan SME can pay** | Western competitors price at \$0.05–\$0.32/minute and \$29–\$349/month against a US labour anchor. Rwanda's labour anchor is a \$100–\$450/month receptionist. Serving it profitably requires a cost structure — local telephony at ~\$0.034/min instead of Twilio's \$0.55/min, self-hosted inference, MoMo billing — that a US company has no reason to build. |
| **Mobile money billing** | 5.8 million active MoMo users and 578,000 merchants in Rwanda; card penetration is marginal. Global SaaS billing stacks assume cards. |
| **Sold by people they can meet** | The cautionary tale is Air.ai — a US AI-calling company that sold \$25,000–\$100,000 licences to small businesses, failed to deliver, and was shut down by an FTC settlement in March 2026 with its principals permanently banned from marketing business opportunities. SME buyers in this category are burnt and trust-sensitive. Local presence is a product feature. |

Full treatment: [Document 03 — Competitive Landscape](docs/03-competitive-landscape.md) and [Document 11 — Business Model & Economics](docs/11-business-model-and-economics.md).

---

## 7. Architecture at a glance

Subiza is a multi-tenant, event-driven platform organised into eight layers. Each is specified fully in [Document 05](docs/05-system-architecture.md); this is the map.

| Layer | Responsibility | Key technology decisions |
|---|---|---|
| **1. Ingress** | Get a conversation into the system from any channel | CPaaS voice with WebSocket media streaming (Africa's Talking / Telnyx / Twilio, abstracted); Meta Cloud API webhooks; Telegram Bot API; SIP trunk termination in later phases |
| **2. Session & media** | Own the lifetime of one conversation; move audio | Media gateway (jambonz / FreeSWITCH pattern) for voice; per-session actor holding state; jitter buffering, barge-in, echo handling |
| **3. Ijwi — speech** | Audio in, text out; text in, audio out | Streaming ASR (Whisper family / Parakeet / Canary, benchmarked on real 8 kHz Rwandan audio); semantic turn detection over pure VAD; streaming TTS (Orpheus / Chatterbox) with a Kinyarwanda voice track |
| **4. Ubwenge — reasoning** | Decide what to say and what to do | Open-weight instruction model (Qwen / Llama / Mistral class, 7–14B, quantised) served on vLLM or SGLang; hybrid RAG over the tenant's knowledge; strict short-answer policy; tool calling; refusal threshold that escalates instead of guessing |
| **5. Action & integration** | Do the thing the caller asked for | Booking, lead capture, order intake, human handover, notification fan-out, CRM/sheet/webhook connectors |
| **6. Data** | Store it correctly and legally | Tenant-isolated Postgres; vector store per tenant; object storage for recordings with retention policy; **Rwanda-resident storage for personal data** (Law 058/2021 Art. 50) |
| **7. Studio** | Let the business run it themselves | Web console: agent designer, knowledge ingestion, voice selection and consent capture, live takeover, transcripts, analytics, billing |
| **8. Platform** | Keep it alive and honest | Observability spanning telephony MOS *and* AI latency; per-tenant cost accounting; audit log; consent registry; abuse and safety controls |

**The single most important architectural principle:** every external AI capability — ASR, TTS, LLM — sits behind an internal interface with at least two implementations (one self-hosted, one managed). This is not architectural purity. It is the mechanism by which the business can start on managed APIs to reach market fast, migrate component-by-component to self-hosted inference as volume makes it cheaper, and survive any single vendor's pricing change, outage, licence change or model deprecation. The break-even analysis that governs each migration decision is in [Document 11](docs/11-business-model-and-economics.md).

---

## 8. The economics in one table

The full model, with assumptions and sensitivities, is in [Document 11](docs/11-business-model-and-economics.md). This is the shape of it.

| | Naive stack | Localised managed stack | Target self-hosted stack |
|---|---|---|---|
| Telephony | Twilio Rwanda \$0.5554/min | Africa's Talking \$0.034/min | Africa's Talking → own SIP trunk |
| Orchestration | Vapi \$0.05/min | Own thin layer ~\$0.01/min | Own ~\$0.01/min |
| Speech-to-text | Deepgram \$0.006/min | Deepgram Growth \$0.004/min | Self-hosted ~\$0.0008/min |
| Language model | Mid-tier API \$0.045/min | Budget API \$0.006–0.015/min | Self-hosted ~\$0.0006/min |
| Text-to-speech | Managed \$0.025/min | Deepgram Aura \$0.015/min | Self-hosted ~\$0.0004/min |
| **Marginal cost / minute** | **≈ \$0.68** | **≈ \$0.07–0.08** | **≈ \$0.039–0.042** |

**The decisive insight:** the choice of telephony provider changes cost by a factor of sixteen and is the difference between a viable and an impossible business. Everything else is second-order until volume is large.

**The pricing anchor is not competitor pricing — it is Rwandan wages.** A receptionist in Kigali costs RWF 100,000–200,000/month (≈ \$68–136), and a fully-loaded customer support employee about \$442/month. A product priced at **RWF 20,000–90,000/month (≈ \$14–61)** is unambiguously cheaper than a person while remaining a real business. Western competitors' \$0.05–0.32/minute and \$29–349/month price points are calibrated to a \$3,000+/month US labour anchor and are 5–20× too expensive when imported unmodified.

---

## 9. Roadmap in one page

Detail, staffing and exit criteria per phase: [Document 12](docs/12-roadmap-team-and-risk.md).

| Phase | Duration | Goal | Definition of done |
|---|---|---|---|
| **0 — Prove the physics** | 6 weeks | Answer one real Rwandan phone call with an AI, end to end | A call to a real MTN number is forwarded, answered by AI, held for 90 seconds in English at p50 < 1.2 s, transcript stored. Kinyarwanda ASR/TTS baselines measured on real 8 kHz audio. |
| **1 — Pilot (design partners)** | 3 months | 10 hand-held Rwandan SMEs live | 10 businesses using Subiza Voice + WhatsApp daily; ≥70% of calls handled without human escalation; measured lead-capture uplift; RDB registration and NCSA data-controller registration filed |
| **2 — Product** | 4 months | Self-serve Subiza Studio | A business owner can onboard, train the agent from their own documents, choose a voice, and go live in under one hour with no engineer; MoMo billing live; RURA ASP licence obtained |
| **3 — Language moat** | Continuous from month 3 | Kinyarwanda that actually works | Kinyarwanda ASR word error rate on real telephone audio below an agreed threshold; a Kinyarwanda voice customers rate as natural; code-switching handled |
| **4 — Scale & margin** | Months 12–24 | Unit economics that compound | Self-hosted inference for ASR and TTS in production; regional media edge; 500+ paying businesses; expansion to Kenya |

---

## 10. The honest risk list

The full register with likelihood, impact, owner and mitigation is in [Document 12](docs/12-roadmap-team-and-risk.md). These are the five that could kill the project.

1. **Kinyarwanda speech quality on 8 kHz telephone audio may be worse than anyone's published benchmarks.** Every open ASR model is benchmarked on clean 16 kHz wideband audio; telephone audio typically degrades word error rate substantially, and Kinyarwanda is a low-resource language on top of that. *This is the number one technical unknown and Phase 0 exists primarily to measure it.* If it fails, the fallback is a hybrid: Kinyarwanda handled with tightly-constrained menu-and-keyword flows plus voice-note transcription, with free-form conversation in English and French first.
2. **Latency over Rwanda's network geography.** Rwanda is landlocked; the nearest hyperscaler regions are in South Africa, roughly 3,000 km away, and international routing adds real milliseconds on top of an already tight budget. Mitigation: measure before architecting, host media as close as economics allow, and plan for a Kigali-colocated media edge (PAIX Kigali, TrAC) in Phase 4.
3. **Data localisation.** Rwanda's Law 058/2021 Article 50 requires personal data to be stored in Rwanda unless NCSA authorises otherwise. Streaming call audio to a foreign ASR API is a cross-border transfer of personal data — and a voiceprint is very likely "biometric information," whose unlawful processing carries the law's most severe penalty tier (7–10 years imprisonment and RWF 20–25 million). *This must be resolved with counsel and NCSA before build, not after.* It is also a strategic argument for self-hosting sooner than pure economics would suggest.
4. **Meta platform risk.** WhatsApp is the highest-value messaging channel and the most fragile: Meta began enforcing a ban on **general-purpose** AI chatbots on WhatsApp for all users from January 2026, service messages become billable again from **1 October 2026**, and a tenant's WABA can be banned for opt-in or quality violations that Subiza does not directly control. Mitigation: architect strictly as a business-scoped assistant with visible human escalation, isolate tenants, and never treat WhatsApp as the only channel.
5. **The founder-shaped risk.** This project spans telephony, speech ML, distributed systems, regulation, and SME field sales. No one person covers it. The roadmap is deliberately sequenced so Phase 0 can be done by one or two people, and hiring is tied to phase gates rather than fundraising milestones.

---

## 11. What this documentation deliberately does not do

- **It does not contain code.** Not one line. Implementation choices that would be encoded in code are instead stated as constraints and interfaces, so they survive being implemented in a different stack than the one imagined today.
- **It does not pretend to certainty it does not have.** Every claim sourced from research is attributed; every number that could not be verified is marked as an estimate; every question that needs a Rwandan lawyer, a RURA officer, an MTN account manager or a real measurement is listed in [Document 13](docs/13-open-questions-and-validation.md) rather than papered over.
- **It does not assume the plan survives contact with reality.** Phase 0 exists to falsify the riskiest assumptions cheaply. If Kinyarwanda telephone ASR is unusable, or if forwarded calls lose caller ID, or if NCSA will not authorise a cross-border transfer, the plan changes — and the documents say what it changes to.

---

## 12. Immediate next actions

Ordered by information value per unit of effort, not by comfort.

| # | Action | Why now | Owner |
|---|---|---|---|
| 1 | Record 20–50 real Rwandan customer-service phone calls (with consent) in Kinyarwanda, English and code-switched speech, at 8 kHz | Every technical decision downstream depends on real audio, and no published benchmark answers this | Founder |
| 2 | Benchmark Whisper large-v3, Parakeet TDT and a Kinyarwanda fine-tune on that audio; record word error rate | Determines whether the core product is possible as imagined | Founder / ML advisor |
| 3 | Test call forwarding on live MTN and Airtel Rwanda SIMs: do the codes work, does caller ID survive, who pays for the forwarded leg | The entire go-to-market depends on this and it costs almost nothing to check | Founder |
| 4 | Open a conversation with Digital Umuganda and Mbaza NLP about Kinyarwanda speech data and models | Partnership is faster and cheaper than independent data collection; relationships take time | Founder |
| 5 | Engage a Rwandan data-protection lawyer on Article 50 cross-border authorisation and voiceprint classification | This is a build-blocking legal question, not a launch-time formality | Founder + counsel |
| 6 | Interview 30 Rwandan SMEs: how many calls do you miss, what does it cost you, what would you pay | The willingness-to-pay figures in this document are inferred from wages, not measured | Founder |
| 7 | Get quotes from Africa's Talking (Rwanda voice + WebSocket media capability) and MTN Enterprise (Unicall specs) | Confirms or breaks the cost model and the migration path | Founder |

---

*Prepared 4 September 2026. Research sources are cited inline in each sub-document. Figures marked as estimates are explicitly flagged; nothing in this document should be quoted to a third party without checking whether it is verified or inferred.*
