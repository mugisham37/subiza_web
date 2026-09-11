# 02 — Stakeholder Analysis

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. Why this document exists before the architecture document

Most technical founders write the architecture first and discover the stakeholders when one of them blocks the launch. In this project that ordering would be fatal, because at least three stakeholders hold what amounts to a veto:

- **NCSA** can make the entire cloud architecture illegal if personal data leaves Rwanda without authorisation.
- **RURA** controls the licence that makes VoIP-based service provision lawful.
- **MTN and Airtel** control the phone numbers, the forwarding behaviour, and the mobile money rails through which customers will pay.

A stakeholder map is therefore an engineering input, not a business-plan formality. Several architectural decisions in [Document 05](05-system-architecture.md) exist *only* because of a constraint identified here.

---

## 2. Stakeholder taxonomy

Stakeholders are grouped by the kind of power they hold, because the engagement strategy differs by type.

| Class | Power held | Examples |
|---|---|---|
| **Gatekeepers** | Can prevent operation entirely | RURA, NCSA/DPP Office, RDB, Meta |
| **Rails** | Control the channels through which value flows | MTN, Airtel, Africa's Talking, Meta, mobile money |
| **Customers** | Pay, and decide whether it works | SME owners, their staff |
| **End users** | Experience the product but do not buy it | The SME's own customers — callers and messagers |
| **Suppliers** | Provide capability that would be slow to build | Speech-data organisations, cloud/GPU providers, model providers |
| **Ecosystem** | Provide capital, talent, credibility, distribution | Investors, hubs, ICT Chamber, PSF |
| **Society** | Affected but not transacting | BPO workers, low-literacy customers, the wider labour market |

---

## 3. Master stakeholder register

Ranked by **influence × urgency**. Engagement strategy is stated as an action, not an attitude.

| # | Stakeholder | Class | Interest | Influence | Position (est.) | Engagement strategy |
|---:|---|---|---|---|---|---|
| 1 | **NCSA / Data Protection & Privacy Office** | Gatekeeper | Lawful processing; data localisation; breach discipline | **Critical** | Neutral → supportive if engaged early | Register as controller **and** processor (Law 058/2021 Arts. 29–31) before first production call. Seek Article 50 authorisation for any cross-border processing, or architect to avoid needing it. Obtain written guidance on whether a voiceprint is "biometric information." |
| 2 | **RURA** | Gatekeeper | Licensed provision of electronic communication services; consumer protection; numbering | **Critical** | Neutral; process-driven | Apply for **Application Service Provider licence** (USD 500 application + USD 5,000 licence, 5-year term; VoIP explicitly named). Apply separately for short code and Sender ID whitelisting when needed. Build the technical architecture, DR plan and QoS commitments the application requires — these are documentation deliverables, not just forms. |
| 3 | **MTN Rwanda** | Rails + partner | Subscriber retention; enterprise revenue; MoMo transaction volume | **Critical** | Neutral now; potential partner or competitor later | Three separate relationships to build in sequence: (a) confirm call-forwarding behaviour and caller-ID passthrough on live SIMs; (b) MoMo Collections API for billing; (c) MTN Unicall SIP trunking for Phase-4 interconnect (requires RDB certificate; enterprise sales channel, not self-service). |
| 4 | **The SME owner (customer)** | Customer | More sales, fewer missed calls, less stress; no new complexity | **Critical** | Sceptical of AI; burnt by vendors | Sell the outcome ("you stop missing calls"), never the technology. Onboarding under one hour or the sale is lost. Local-language support by a human they can reach. Monthly proof-of-value report showing calls answered that would have been missed. |
| 5 | **Meta (WhatsApp / Instagram / Messenger)** | Rails + gatekeeper | Platform integrity; policy compliance; messaging revenue | **High** | Indifferent; enforces mechanically | Register as **Tech Provider** (business verification + App Review for `whatsapp_business_management` and `whatsapp_business_messaging`). Architect strictly as a business-scoped assistant with visible human escalation — Meta's ban on general-purpose chatbots on WhatsApp has applied to all users since January 2026. Model the 1 October 2026 return of billable service messages into pricing. |
| 6 | **The SME's customers (end users)** | End users | To be understood, quickly, in their own language; not to be deceived | **High** (via satisfaction and complaints) | Curious then impatient | Disclose AI at the start of every call and chat. Offer an immediate route to a human. Kinyarwanda that actually works, or the product is worse than a ringing phone. Never impersonate a named human. |
| 7 | **Airtel Rwanda** | Rails | Same as MTN, smaller share (33.7%) | **High** | Neutral | Mirror the MTN relationship. Second billing rail (Airtel Money) and second forwarding path for redundancy and coverage outside MTN's core base. |
| 8 | **Africa's Talking** | Rails / supplier | API revenue; developer ecosystem in Africa | **High** | Commercially motivated to help | Confirm — urgently — whether their Voice API supports real-time bidirectional media streaming (WebSocket / media fork). Their Rwanda pricing (RWF 20,000 number setup and monthly; RWF 50/min ≈ \$0.034) is 16× cheaper than Twilio and is the difference between viable and impossible unit economics. If they cannot stream, negotiate a hybrid: local number + SIP handoff to a streaming-capable provider. |
| 9 | **Digital Umuganda** | Supplier / ally | Advancing Kinyarwanda language technology | **High** (technical) | Likely supportive; mission-aligned | Partnership conversation, not extraction. They publish Kinyarwanda TTS datasets and a working YourTTS Kinyarwanda model. Offer reciprocity: contribute anonymised, consented telephone-domain Kinyarwanda audio (which they lack) in exchange for model and data collaboration. |
| 10 | **Rwanda Development Board (RDB)** | Gatekeeper | Investment, formal-sector growth, job creation | **High** | Actively supportive of this profile | Company registration and investment certificate via the One-Stop Centre (registration fee USD 500 or RWF equivalent). An RDB certificate is also a **prerequisite** for MTN Unicall SIP trunking, so it sits on the critical path for Phase 4, not just incorporation. |
| 11 | **National AI Agency (approved June 2026)** | Gatekeeper (emerging) | National AI capability, governance, investment | **High and rising** | Unknown — brand new | Engage early and voluntarily. Rwanda's first institution dedicated entirely to AI, building on the 2023 National AI Policy and backed by the ~RWF 25 bn AI Scaling Hub. Its licensing powers over private AI firms are **not yet clear** and must be established directly with MINICT. A locally-built Kinyarwanda AI serving Rwandan SMEs is precisely the story this agency will want to tell — position accordingly. |
| 12 | **Mbaza NLP** | Supplier / ally | Kinyarwanda NLP research | **Medium-high** (technical) | Likely supportive | Access Kinyarwanda–English parallel corpora, FLEURS Kinyarwanda, and the ~25 M-word Kinyarwanda monolingual corpus for LLM adaptation. Collaboration on evaluation benchmarks. |
| 13 | **Intron Health** | Supplier or competitor | African-language speech AI | **Medium-high** | Ambiguous — could be either | Their Sahara models claim Kinyarwanda ASR/TTS including a trilingual English–Kinyarwanda–French model. Evaluate honestly as a **supplier** for the language layer; treat as a potential competitor if they move into SME self-serve. Buying the language layer and owning the product layer may be faster and better than building both. |
| 14 | **RRA (Rwanda Revenue Authority)** | Gatekeeper (compliance) | Tax revenue | **Medium** | Neutral, procedural | Confirm treatment of SaaS subscription revenue under Rwanda's VAT on digital goods and services and the 1.5% Digital Services Tax applying to foreign digital platforms from FY2026/27. If any entity is non-resident, confirm whether a local tax representative is required. |
| 15 | **BNR (National Bank of Rwanda)** | Gatekeeper (conditional) | Payment-system integrity | **Medium** | Neutral | Only engaged if Subiza handles funds directly. Using licensed aggregators (Flutterwave Rwanda, Paystack, IntouchPay) rather than becoming a payment service provider avoids this entirely — and that is the recommended path. |
| 16 | **Investors / grant funders** | Ecosystem | Return, or development impact | **Medium-high** at fundraise | Depends entirely on evidence | Norrsken East Africa (Kigali), Catalyst Fund, Rwanda Innovation Fund, GSMA Innovation Fund (equity-free, milestone-based, explicitly funds AI for low- and middle-income countries), Google for Startups Africa, Mastercard Foundation. The GSMA fund is the best first target: non-dilutive and thematically exact. |
| 17 | **Rwanda ICT Chamber / kLab / Norrsken House Kigali / 250 Startups** | Ecosystem | Ecosystem growth, member success | **Medium** | Supportive by design | Membership and physical presence. Primary channel for engineering talent, early design partners, and warm introductions to RURA and MINICT. |
| 18 | **Private Sector Federation (PSF)** | Ecosystem / channel | SME member interests | **Medium** | Neutral | Potential mass channel to SME members. Sector chambers (retail, hospitality, transport) map directly onto the product's archetypes. *Structure to be confirmed — see [Document 13](13-open-questions-and-validation.md).* |
| 19 | **MINICT / RISA** | Gatekeeper (soft) | National digital transformation | **Medium** | Supportive of the category | Policy dialogue; possible public-sector pilots. RISA also matters practically as a route to Rwanda-resident hosting that satisfies Article 50. |
| 20 | **The SME's staff** | End users | Not being replaced; less repetitive work | **Medium** (can sabotage adoption) | Anxious | Design the human-handover experience *for them*: the AI does the repetitive triage, the human does the work that needs a human. If staff experience Subiza as a threat, they will route around it. |
| 21 | **Rwandan and Kenyan BPO / call-centre sector** | Society | Employment; sector growth | **Medium** (reputational and political) | Wary | Position explicitly as augmentation: AI handles overflow, after-hours and Kinyarwanda triage; humans handle complexity. Rwanda's government is actively trying to *grow* a BPO/digital-jobs sector — a product framed as job-destroying acquires a political enemy for no gain. Consider a stated commitment to hiring and upskilling into AI-oversight and QA roles. |
| 22 | **Cloud / GPU providers** | Supplier | Compute revenue | **Medium** | Commercial | No hyperscaler region in Rwanda or East Africa; nearest are Cape Town and Johannesburg (~3,000 km). Options: local Kigali colocation (PAIX Kigali, TrAC — Rwanda's only Tier III-certified facility), South African cloud regions, African GPU providers, or European regions. This choice is jointly determined by latency ([Document 07](07-telephony-and-networking.md)) and by Article 50 data residency ([Document 09](09-legal-regulatory-ethics.md)). |
| 23 | **Model and API providers (OpenAI, Deepgram, ElevenLabs, Cartesia, Meta, Alibaba, Mistral)** | Supplier | API revenue | **Medium**, decreasing over time | Commercial | Deliberately treated as interchangeable. The pluggable provider layer exists so no single one of these becomes a dependency. Licence terms must be checked per model release — several attractive TTS models are non-commercial. |
| 24 | **Rwandan legal counsel** | Supplier (critical) | Professional | **Medium** but on the critical path | — | Not optional. At least six open legal questions ([Document 09](09-legal-regulatory-ethics.md)) cannot be resolved from public sources and are build-blocking. |
| 25 | **Competitors** | — | Market share | Low now, high later | Adversarial | Proto (Kinyarwanda voice AI, but government/central-bank focused), AethexAI (African voice AI, \$3 M pre-seed, 17,000+ calls/day), Addis AI, EqualyzAI, Cue (South Africa, \$5 M raised, adding voice), Wati (launching voice-capable AI agents). Monitor; do not fixate. |
| 26 | **Media and public** | Society | Interest, scrutiny | Low → medium | Curious | An AI answering phones in Kinyarwanda is a genuinely good national story. Handle voice-cloning questions proactively and honestly before someone else frames them. |

---

## 4. Power–interest positioning

```
        HIGH │  KEEP SATISFIED              │  MANAGE CLOSELY
             │                              │
             │  · RRA                       │  · NCSA / DPP Office
             │  · BNR                       │  · RURA
             │  · MINICT / RISA             │  · MTN Rwanda
    P        │  · National AI Agency        │  · SME customers
    O        │    (rising → manage closely) │  · Meta
    W        │  · BPO sector / labour       │  · Airtel Rwanda
    E        │                              │  · Africa's Talking
    R        │                              │  · RDB
             ├──────────────────────────────┼──────────────────────────────
             │  MONITOR                     │  KEEP INFORMED
             │                              │
             │  · Media                     │  · Digital Umuganda
             │  · Competitors               │  · Mbaza NLP · Intron Health
        LOW  │  · Standards bodies (RSB)    │  · Investors / grant funders
             │                              │  · ICT Chamber · kLab · PSF
             │                              │  · SME staff · end users
             └──────────────────────────────┴──────────────────────────────
                        LOW                          HIGH
                                  INTEREST
```

---

## 5. Stakeholder-driven engineering constraints

This is the section that makes the document operational. Each row is a stakeholder requirement that becomes a hard constraint on the build.

| Constraint | Imposed by | Where it lands in the architecture |
|---|---|---|
| Personal data must be **stored in Rwanda** unless NCSA authorises otherwise (Law 058/2021, Art. 50) | NCSA | Rwanda-resident primary datastore; region-pinned object storage; either in-country inference or documented, authorised transfer. Drives the self-hosting timeline harder than cost alone does. [Doc 05 §6, Doc 09 §2](05-system-architecture.md) |
| A **voiceprint is very likely sensitive biometric data**; unlawful processing carries 7–10 years and RWF 20–25 M | NCSA / Law 058/2021 Art. 3(2), Art. 60 | Voice cloning requires explicit, separate, revocable consent with a stored consent artefact. No speaker-verification features until the classification is confirmed in writing. [Doc 09 §3](09-legal-regulatory-ethics.md) |
| **Breach notification within 48 hours**, full report within 72 | NCSA / Arts. 43–44 | Incident-response runbook, detection tooling and an owner exist from Phase 1, not Phase 4. [Doc 10 §7](10-infrastructure-devops-sre.md) |
| **ASP licence** required for VoIP-based service provision | RURA | Technical architecture document, DR plan and QoS commitments must exist as licence deliverables. Budget USD 5,500 in fees, plus whatever performance bond RURA sets under Article 23 (the regulation's bond provision is general and conditional rather than a flat figure tied to this row — confirm the amount with RURA). [Doc 09 §1](09-legal-regulatory-ethics.md) |
| **No general-purpose AI chatbots on WhatsApp** | Meta | Agents are scoped to a tenant's business domain by system policy and retrieval boundary; out-of-scope questions are deflected, not answered. Human escalation always visible. [Doc 08 §1](08-messaging-channels.md) |
| **Per-tenant WABA isolation** — one tenant's violation must not endanger another's | Meta | Strict tenant isolation of WhatsApp credentials, numbers and quality ratings; per-tenant policy monitoring. [Doc 08 §1](08-messaging-channels.md) |
| **Billing must work over mobile money** | SME customers, MTN/Airtel | Prepaid credit model with MoMo top-up via aggregator; no card requirement anywhere in the signup path. [Doc 11 §5](11-business-model-and-economics.md) |
| **Onboarding must not require changing the business's phone number** | SME customers | Call-forwarding-first go-to-market; number porting and native numbers are optional upgrades, never prerequisites. [Doc 07 §5](07-telephony-and-networking.md) |
| **AI must be disclosed at the start of every interaction** | End users, EU AI Act Art. 50 (applies from 2 August 2026), emerging norms | Non-skippable disclosure in the greeting on every channel; logged as a compliance event. [Doc 09 §4](09-legal-regulatory-ethics.md) |
| **A human must always be reachable** | End users, SME staff, Meta policy | Escalation is a first-class product primitive with its own SLA and routing rules, not an error path. [Doc 04 §6](04-solution-and-product.md) |
| **Sub-second response or the call fails socially** | End users | The entire latency budget in [Doc 06 §5](06-voice-ai-and-ml.md) exists because of this stakeholder requirement. |

---

## 6. Engagement sequencing

Engagement has an order. Doing these in the wrong sequence wastes months.

**Before writing production code**
1. Rwandan data-protection counsel — scope the Article 50 problem and the voiceprint classification.
2. Test call forwarding on live MTN and Airtel SIMs.
3. Africa's Talking — confirm real-time media streaming capability. *This single answer determines the entire ingress architecture.*
4. Digital Umuganda — open the language-data conversation early; relationships are slow.

**During Phase 0–1 (prototype and pilot)**
5. RDB — company registration and investment certificate (also unlocks MTN Unicall eligibility later).
6. NCSA — register as data controller and processor; open the Article 50 conversation.
7. Ten design-partner SMEs — recruited through ICT Chamber, PSF and personal network.
8. Meta — Tech Provider verification and App Review (this takes real calendar time).

**During Phase 2 (product)**
9. RURA — ASP licence application.
10. MTN and Airtel — MoMo/Airtel Money collections integration via a licensed aggregator.
11. National AI Agency — introduce the project; understand emerging requirements.
12. RRA — confirm VAT/DST treatment before meaningful revenue.

**During Phase 3–4 (scale)**
13. MTN Enterprise — Unicall SIP trunking commercial and technical discussion.
14. Investors / GSMA Innovation Fund — with pilot evidence in hand, not before.
15. BPO sector and labour stakeholders — proactive positioning before someone else frames the story.

---

## 7. Stakeholder risks

| Risk | Stakeholder | Impact | Mitigation |
|---|---|---|---|
| NCSA declines or delays Article 50 authorisation | NCSA | Severe — forces in-country inference earlier than the cost model supports | Design for Rwanda-resident storage from day one; treat cross-border inference as a temporary, explicitly-authorised state; accelerate self-hosting if refused |
| Africa's Talking cannot stream media in real time | Africa's Talking | High — breaks the cheap-telephony assumption | Hybrid architecture: local number with Africa's Talking, SIP bridge to a streaming-capable provider; or self-hosted media server terminating a SIP trunk |
| Call forwarding drops caller ID | MTN / Airtel | Medium-high — degrades personalisation and CRM matching, does not break the product | Confirm empirically in week one; if lost, ask the caller to identify themselves, or pursue native numbers sooner |
| Meta bans a tenant's WABA | Meta | Medium per tenant, high if systemic | Per-tenant isolation; automated policy and quality monitoring; opt-in enforcement in onboarding; never single-channel dependence |
| MTN launches a competing product | MTN | High if it happens | Move faster; build the language moat; consider positioning as a white-label supplier to MTN rather than a competitor |
| A voice-cloning misuse incident | Any | Severe reputational and legal | Mandatory recorded consent before any real-person voice clone; refuse unverifiable requests; default to synthetic non-identifiable voices; watermark and log all synthesis |
| Labour backlash framing | BPO sector, media | Medium reputational, potentially political | Augmentation framing from day one, backed by an actual hiring and upskilling commitment rather than a slogan |
| Key language partner becomes a competitor | Intron Health, Proto | Medium | Do not become single-sourced on any external language model; maintain an internal Kinyarwanda evaluation set and fine-tuning capability regardless of partnerships |

---

## 8. What good stakeholder management looks like here

Three principles, each drawn from a specific finding in the research:

1. **Regulators are engaged early and voluntarily, not discovered at launch.** Rwanda's institutions are notably process-driven and accessible; NCSA publishes guidance, RURA publishes fee schedules and runs an online licensing portal. The cost of early engagement is measured in weeks. The cost of late engagement is measured in a rebuilt architecture.
2. **Language partners are collaborators, not vendors.** Digital Umuganda and Mbaza NLP are mission-driven organisations that have already done the expensive work of assembling Kinyarwanda corpora. The correct posture is reciprocal — Subiza will generate something they cannot easily get, namely consented, real-world, telephone-band Kinyarwanda conversational audio.
3. **The customer's trust is the scarcest asset in the category.** Air.ai took \$25,000–\$100,000 upfront from small businesses for a product that did not work, and was shut down by an FTC settlement in March 2026 with its principals permanently banned from marketing business opportunities. Every SME buyer of AI phone software now carries that risk in their head. Transparent pricing, a free trial that actually works, a named local human who answers, and no lock-in are competitive features, not concessions.

---

## Sources

Regulatory: [RURA Licensing Regulation 013/R/EC-ICT/RURA/2021](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Regulatory_Instruments/ICT_Regulations_and_Guidelines/Regulation_Governing_Licensing_in_Electronic_Communication_in_Rwanda.pdf) · [RURA licensing portal](https://licensing.rura.rw/) · [Law 058/2021 full text](https://rwandalii.org/akn/rw/act/law/2021/58/eng@2021-10-15) · [Data Protection & Privacy Office](https://dpo.gov.rw/) · [DPP Office cloud storage guidance](https://dpo.gov.rw/news-and-updates/news/article/cloud-storage-under-rwandas-data-protection-law-what-you-need-to-know) · [RDB One-Stop Centre](https://rdb.rw/one-stop-centre/) · [Rwanda VAT/DST 2026](https://vatabout.com/rwanda-approves-new-vat--digital-services-tax-rules-for-2026)

National AI institutions: [Inside the newly approved National AI Agency, The New Times](https://www.newtimes.co.rw/article/36769/news/inside-the-newly-approved-national-ai-agency) · [KT Press](https://www.ktpress.rw/2026/06/rwandas-ai-ambition-takes-shape-as-cabinet-approves-new-agency/) · [Rwanda National AI Policy, The Future Society](https://thefuturesociety.org/development-of-rwandas-national-artificial-intelligence-policy/) · [AU Continental AI Strategy](https://au.int/sites/default/files/documents/44004-doc-EN-_Continental_AI_Strategy_July_2024.pdf)

Telecom and rails: [MTN Unicall](https://www.mtn.co.rw/mtn-unicall/) · [MTN Developer Portal](https://developers.mtn.com/products) · [Africa's Talking pricing](https://africastalking.com/pricing) · [MTN Rwanda](https://en.wikipedia.org/wiki/MTN_Rwanda)

Platform policy: [Meta Tech Provider requirements](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers) · [WhatsApp general-purpose chatbot ban](https://respond.io/blog/whatsapp-general-purpose-chatbots-ban)

Language partners: [Digital Umuganda](https://huggingface.co/DigitalUmuganda) · [Mbaza NLP](https://huggingface.co/mbazaNLP) · [Intron Health](https://www.intron.io/)

Ecosystem and cautionary: [GSMA Innovation Fund](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma-innovation-fund/) · [Rwanda ICT Chamber](https://www.ictchamber.rw/) · [Air.ai FTC settlement analysis](https://trillet.ai/blogs/air-ai-ftc-lawsuit-status-2026)

---

*Next: [03 — Competitive Landscape](03-competitive-landscape.md)*
