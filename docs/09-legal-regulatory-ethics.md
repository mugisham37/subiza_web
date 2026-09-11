# 09 — Legal, Regulatory & Ethics

*Part of the [Subiza Project Documentation](../README.md)*

---

> **This document is not legal advice.** It is a structured summary of research into the applicable framework, written to make an engagement with Rwandan counsel efficient and specific. Items requiring professional confirmation are marked **[COUNSEL]** and consolidated in §10.

---

## 1. Telecom licensing — RURA

### 1.1 The regulator

The **Rwanda Utilities Regulatory Authority (RURA)**, established under Law Nº 09/2013, reporting to the Office of the Prime Minister, regulates telecom, IT, broadcasting, postal, energy, water, transport and radiation protection. As of September 2026, RURA has **not** been renamed and its ICT mandate has not been transferred.

However, Rwanda's Cabinet approved a **National Artificial Intelligence Agency on 8 June 2026** — the country's first institution dedicated entirely to AI, building on the 2023 National AI Policy and backed by an approximately **RWF 25 billion "AI Scaling Hub"** funded in part by the Gates Foundation. **[COUNSEL]** Its precise regulatory or licensing powers over private AI companies — as opposed to a coordination and investment-promotion role — are not established in public sources and must be confirmed directly with MINICT and the agency, since it could introduce a parallel registration or sandbox requirement.

### 1.2 The licence Subiza needs

Under **Regulation No. 013/R/EC-ICT/RURA/2021 (Governing Licensing in Electronic Communication in Rwanda)**:

| Licence | Duration | Scope | Fees |
|---|---|---|---|
| **ASP — general row** | 5 years | API aggregators, e-ticketing, VAS, ride-hailing, e-commerce, digital financial services | USD 100 application + USD 1,000 licence |
| **ASP — "Retail ISP, VoIP, Pay phone, Tracking Systems" row** ← **this one** | 5 years | Non-infrastructure application services over existing networks, with **VoIP named explicitly** in this row | **USD 500 application + USD 5,000 licence** |
| Network Service Provider | 5–15 years | Voice, data, internet, SMS carriage, MVNO, ISP tiers, GMPCS | USD 2,000–40,000 |
| Network Infrastructure Provider | 15 years | Towers, ducts, base stations, cables | USD 5,000–100,000 |

Subiza delivers an application over existing networks. It is not a carrier and does not build infrastructure. **The ASP licence is the correct category, and VoIP is named explicitly in its own Annex One row.** **[COUNSEL / RURA]** Note that the regulation's fee schedule splits ASP into more than one row: the general row (API aggregators, e-ticketing, VAS, ride-hailing, e-commerce, digital financial services) is USD 100 + USD 1,000, while the row naming VoIP — "Retail ISP, VoIP, Pay phone, Tracking Systems" — is USD 500 + USD 5,000. Which row RURA applies to an AI voice platform should be confirmed with RURA directly rather than assumed, and the performance-bond amount under Article 23 should be confirmed at the same time (it is a general, conditional provision rather than a flat figure attached to this row).

**Application deliverables** (these are documentation obligations that this document set substantially satisfies): technical system architecture, backup and disaster-recovery plan, quality-of-service commitments including availability and mean-time-to-repair, emergency-services access provisions, and SLAs with telecom and banking partners where relevant. Annual regulatory fees are set by RURA Board decision.

**VoIP is licensed, not restricted, in Rwanda.**

### 1.3 Numbering and identifiers

- **Short codes**: RWF 25,000 application fee, then annual tiers — GOLD \$1,000 / SILVER \$800 / BRONZE \$600 / ORDINARY \$200 by desirability. Applied for through RURA's online short-code system; specific codes may now be requested subject to availability.
- **Toll-free numbers**: administered under RURA's National Numbering Plan (June 2023), but typically provisioned through a licensed operator rather than obtained directly by an ASP. **[COUNSEL / RURA]** Exact process and fees unconfirmed.
- **Sender ID whitelisting**: a separate RURA authorisation required for branded outbound SMS.

### 1.4 The regulatory gap on unsolicited communication

The Licensing Regulation contains general confidentiality, complaint-handling and quality-of-service obligations, but **no explicit rule on unsolicited commercial calls, spam SMS, telemarketing or a do-not-call registry** was located. Rwanda has no TCPA equivalent that the research could identify.

**This is not permission.** Outbound AI calling would still engage Law 058/2021 consent requirements (a cold call to a number tied to a person is processing personal data) and general consumer-protection and QoS obligations under the licence. **[COUNSEL]** Confirm whether a separate consumer-protection instrument fills this gap. The operational stance is in §5.

---

## 2. Data protection — Law No. 058/2021

This is the most consequential legal instrument for the architecture, and the section that must be read before any infrastructure decision is made.

### 2.1 The framework

Law No. 058/2021 relating to the protection of personal data and privacy, gazetted 15 October 2021. The supervisory authority is the **National Cyber Security Authority (NCSA)**, operating a **Data Protection and Privacy Office** at dpo.gov.rw. Organisations were expected to reach compliance by **October 2023**; enforcement is understood to be active from that point.

### 2.2 Registration — Chapter V

| Article | Requirement |
|---|---|
| **Art. 29** | Any person intending to be a **data controller or data processor must register** with the supervisory authority |
| **Art. 30** | Registration discloses identity, categories of data, processing purposes, categories of recipients, transfer destinations, and risk-mitigation measures |
| **Art. 31** | NCSA issues a certificate within **30 working days** of a compliant application |

**Subiza is both**: a controller for its own customer data, and a processor of end-customer personal data on behalf of its SME tenants. **It must register in both capacities.** The registration fee is not published and must be confirmed with NCSA directly.

### 2.3 Data localisation — Article 50, and why it governs the architecture

> **Article 50:** *"The data controller or the data processor stores personal data in Rwanda."*
>
> Storing personal data outside Rwanda **requires prior authorisation from NCSA**.

Cloud storage — on-premises, local cloud, or foreign third-party cloud — is not banned outright. But **any storage of Rwandan data subjects' personal data on infrastructure outside Rwanda requires NCSA authorisation as an exemption**, in addition to the law's general security obligations regardless of location.

**Why this is an engineering problem, not a paperwork problem:**

An AI voice pipeline that sends call audio to a foreign ASR API is performing a **cross-border transfer of personal data** — the caller's voice, their words, and often their name, phone number and business intent. The same is true of a foreign LLM API that receives the transcript, and a foreign TTS API that receives the response text. If those vendors retain any of it, even transiently, Article 50 is engaged.

**Three architectural responses**, and the plan uses all three in sequence:

1. **Obtain NCSA authorisation** for each named cross-border vendor and processing purpose — viable for Phase 0–1 while volumes are small and the exact vendor set is stable.
2. **Architect to avoid the need**: Rwanda-resident storage for all personal data from day one (already principle A5 in [Doc 05](05-system-architecture.md)), and in-country or authorised-region inference as soon as economics permit.
3. **Minimise and de-identify** before anything leaves Rwanda — strip identifiers, avoid sending raw audio where a transcript suffices, and treat de-identified analytics differently from personal data.

**This is the top compliance risk in the project and must be resolved with counsel and NCSA before build, not after.** It is also a strategic argument for self-hosting inference earlier than pure cost analysis would suggest — the legal driver and the margin driver point the same way.

### 2.4 Consent

- **Art. 6** — consent must be *"freely given, specific, informed and unambiguous"*; it may be **oral**, written or electronic. The permissibility of oral consent is significant: it means a spoken disclosure and confirmation at the start of a call can constitute valid consent, provided it is genuinely informed and recorded.
- **Art. 8** — the right to withdraw consent at any time, and withdrawal must be *"as easy as expressing it."* This is a product requirement: a caller must be able to say "do not record this" and have it work.
- **Art. 9** — processing data of children under 16 requires parental consent, unless necessary to protect the child's vital interests. **[COUNSEL]** Subiza cannot reliably determine a caller's age; the practical mitigation is not to process data in ways that would be problematic for a minor, and to escalate rather than transact where age matters.

### 2.5 Data subject rights — Chapter III

| Article | Right | Product implication |
|---|---|---|
| Art. 18 | Information and access | A subject-access mechanism spanning conversations, recordings and derived data |
| Art. 20 | Portability, in a *"structured and readable format"* | Export capability |
| Art. 23 | Erasure | Deletion must propagate across the relational store, object store, vector embeddings **and** any derived training corpus |
| Art. 24 | Rectification **within 30 days** | An SLA, not a best effort |

### 2.6 Breach notification

| Article | Requirement |
|---|---|
| **Art. 43** | Notify NCSA **within 48 hours** of becoming aware of a breach |
| **Art. 44** | Full breach report within **72 hours** — affected individuals, mitigation, communication plan |
| **Art. 45** | High-risk breaches must also be communicated to affected data subjects unless mitigations eliminate the risk |

**48 hours is short.** It requires detection tooling, a named owner, a rehearsed runbook and a pre-drafted notification template to exist *before* an incident — see [Document 10 §7](10-infrastructure-devops-sre.md).

### 2.7 Sensitive data and the voiceprint question

**Art. 3(2)** defines sensitive personal data to explicitly include **"genetic or biometric information,"** alongside health status, race, religion, political opinion, criminal record, sexual life and family details.

**A voiceprint is very likely to qualify as biometric information** — it is a measurable physiological and behavioural characteristic usable for unique identification, and this is consistent with international norms (GDPR treats voiceprints as biometric data when processed for unique identification). **[COUNSEL / NCSA]** This classification must be confirmed in writing, because it changes the compliance bar substantially.

### 2.8 Penalties

| Article | Offence | Penalty |
|---|---|---|
| Art. 53 | Administrative misconduct (no registration certificate, poor record-keeping) | RWF 2–5 million **or 1% of annual turnover** |
| Art. 56 | Unauthorised access or disclosure | **1–3 years imprisonment** + RWF 7–10 million |
| Art. 59 | Illegal sale of data | **5–7 years imprisonment** + RWF 12–15 million |
| **Art. 60** | **Unlawful processing of sensitive data** (likely including voiceprints) | **7–10 years imprisonment + RWF 20–25 million** |

**Article 60 carries criminal liability with imprisonment.** This is the strongest possible argument for treating voice cloning and any voiceprint processing as a gated, consent-verified, separately-controlled capability rather than a product feature to be shipped quickly.

---

## 3. Call recording and voice data

### 3.1 The state of the law

The research found **no Rwanda-specific call-recording consent statute** — no one-party/two-party wiretap-style rule. International surveys of call-recording law do not cover Rwanda or East Africa at all. This appears to be a genuine gap in publicly available legal literature rather than a failure of research. **[COUNSEL] — this must be confirmed by a Rwandan lawyer before the product ships.**

### 3.2 The operative framework regardless

Law 058/2021 governs anyway. A recorded call is processing of personal data (voice is personal data; a voiceprint is likely sensitive data), so **Article 6 consent requirements apply whether or not a specific recording statute exists**. Functionally this produces a two-party-consent-like posture even without an explicit criminal wiretap law.

### 3.3 Subiza's practice, regardless of how the legal question resolves

Every AI-handled call opens with a clear, unambiguous notice covering three things: that this is an AI assistant, that the call may be recorded, and how to reach a human. Consent is logged as a compliance event with the audio artefact retained.

Concretely:
- The disclosure is **non-skippable** and delivered in the conversation language.
- A caller who objects to recording is offered a path that does not record, or a transfer to a human.
- Recording retention is per-tenant configurable with a conservative default; transcripts are retained longer than audio.
- Recordings are stored Rwanda-resident, encrypted, access-logged and lifecycle-deleted.

This satisfies Article 6, likely satisfies whatever the recording-consent answer turns out to be, and pre-empts EU AI Act Article 50 transparency obligations if Subiza ever serves an EU-facing customer.

### 3.4 Voiceprint handling

Until the Article 3(2) classification is confirmed:
- Voice models and reference audio are stored separately, encrypted, with stricter access controls and full audit.
- Voice cloning requires **explicit, separate, revocable consent** with a stored artefact — never bundled into general terms of service.
- **No speaker-verification or voice-biometric authentication features are built at all** until the classification is confirmed and a DPIA is completed. **[COUNSEL]** Whether Law 058/2021 or NCSA guidance formally mandates a DPIA was not established.

---

## 4. Voice cloning — law and ethics

### 4.1 The global picture as of September 2026

| Instrument | Status | Requirement |
|---|---|---|
| **US — Tennessee ELVIS Act** | **In force since July 2024** | First-of-its-kind law explicitly extending right-of-publicity to voice, including AI-generated voice clones. Criminal and civil liability |
| **US — NO FAKES Act (federal)** | **Not law.** Cleared Senate Judiciary Committee by unanimous voice vote on **17 June 2026** (with First Amendment objections raised); has not passed the full Senate or House. A 2024 version died in committee | Would create a federal right requiring authorisation for AI "digital replicas" of voice and likeness, with post-mortem rights up to 70 years and exemptions for news, documentary, sports and parody |
| **US FCC — AI voices in robocalls** | **In force since February 2024** | AI-generated voices are "artificial" under the TCPA, triggering the full consent regime: prior express consent, opening disclosure of AI use and caller identity, opt-out within 2 seconds. **Penalties \$500–\$1,500 per call, uncapped** |
| **EU AI Act, Article 50** | **Applies from 2 August 2026** | Chatbots and voice assistants must clearly disclose AI interaction at the start, in a "clear and distinguishable" way, regardless of risk classification. Providers of synthetic audio must machine-mark outputs as AI-generated; deployers publishing deepfakes must disclose, with an **audible warning for audio** |
| **EU AI Act — GPAI obligations** | Applied from **August 2025**; other operator obligations from **August 2026** | Providers of general-purpose models must publish training-data summaries, adopt copyright-compliance policies, and provide documentation to downstream deployers. Models above ~10²⁵ FLOPs face additional systemic-risk obligations |
| **Denmark likeness law** | **Not finally adopted** as of April 2026; expected mid-2026, with guidance treating compliance as urgent due to possible retroactive enforcement | A copyright-like personal right over one's AI-replicated likeness and voice; prior, specific, informed consent required outside news, satire, parody and art exceptions |
| **Rwanda** | **No voice-cloning-specific statute identified.** The operative framework is Law 058/2021 plus general personality-rights principles **[COUNSEL]** | — |

### 4.2 Subiza's voice-cloning policy

Written now, before the feature exists, because retrofitting ethics into a shipped capability does not work.

**1. Consent is mandatory, specific, documented and revocable.**
No real person's voice is cloned without a recorded consent artefact from that person, stating who they are, what the voice will be used for, that it is for a named business, and that they may withdraw. Withdrawal deletes the voice model.

**2. Only the business's own people.**
A tenant may clone the voice of the owner or a consenting employee. Cloning a third party — a celebrity, a public figure, a customer, anyone who has not personally consented — is refused. Requests that cannot be verified are refused.

**3. Disclosure survives cloning.**
Even when the agent speaks in the owner's cloned voice, it identifies itself as an AI assistant. **The line between "Claudine's salon's assistant, using Claudine's voice, announcing that it is an assistant" and "pretending to be Claudine" is the line between a product and a fraud tool.** Subiza never crosses it.

**4. Provenance and watermarking.**
Adopt **C2PA**-style content credentials for synthesised audio where the tooling supports it. C2PA is the leading open provenance standard, backed by Adobe, Google, Microsoft, OpenAI, BBC, Meta, TikTok, Sony and Truepic. Audio-specific tooling maturity should be verified; adopting it early is a low-cost trust signal and anticipates EU AI Act marking obligations.

**5. Default to synthetic.**
The default voice offered in onboarding is a library voice, not a clone. Cloning is opt-in, gated, and explained.

**6. Full audit.**
Every synthesis event is logged with the voice used, the tenant, the consent artefact and the conversation. If a voice is ever misused, it must be traceable.

---

## 5. Outbound calling

The research found **no Rwandan or East African TCPA equivalent**. That is a gap, not a licence.

**Risk asymmetry:**

| | Inbound (a customer calls the business) | Outbound (the AI calls people) |
|---|---|---|
| Consent | Naturally obtained — the customer initiated | Must be independently established |
| Regulatory exposure | Low; core to the ASP licence | High and rising globally |
| Reputational exposure | Low | High — this is what "robocall" means to people |
| US exposure if ever serving US numbers | Minimal | **\$500–1,500 per call, uncapped, under TCPA** |

**Policy:**
- **Phase 0–2: inbound only.** No outbound calling capability is built.
- **Phase 3 at the earliest**, and only with: verified prior opt-in per recipient, suppression-list infrastructure, per-tenant volume caps, mandatory opening disclosure, immediate opt-out honoured, calling-hours restrictions, and full audit.
- **Assume Rwanda and the region will tighten rules** to match global norms as AI calling scales. Build as if the rules already exist; it costs little now and avoids a rebuild later.

Note that "outbound" in the benign sense — a follow-up WhatsApp message to a customer who just called, or a callback the customer explicitly requested — is a different category and is permitted from Phase 1, because consent is contemporaneous and evidenced.

---

## 6. AI regulation

**EU AI Act** — relevant if Subiza serves any EU-based client, has an EU-domiciled affiliate or investor triggering extraterritorial scope, or simply as a benchmark that enterprise clients and investors will expect. Article 50 transparency (from 2 August 2026) is the operative obligation and is already Subiza's practice.

**Rwanda National AI Policy (2023)** — adopted by Cabinet, developed with The Future Society and UNESCO, positioning Rwanda as a first mover on responsible and ethical AI in Africa.

**Rwanda National AI Agency (June 2026)** — mandate to accelerate AI development, innovation, adoption, investment and governance, with priority sectors in health, education and agriculture. **Engage proactively.** A locally-built Kinyarwanda AI serving Rwandan SMEs is precisely the story this agency will want to tell, and its relationship to RURA, NCSA and MINICT is still forming — being a known, cooperative party early is worth far more than it costs.

**African Union Continental AI Strategy (July 2024)** — pan-African principles for AI governance and capacity building, recommending national strategies. Notably, it explicitly expects **data-protection law to be the primary AI-governance lever** across Africa in the absence of AI-specific statutes — which confirms that **Law 058/2021 compliance is currently, in effect, Rwanda's AI regulation** for this product.

---

## 7. Tax and corporate

| Item | Detail |
|---|---|
| **Company registration** | Rwanda Development Board One-Stop Centre; **USD 500 or RWF equivalent**; requires a business plan, legal-personality certificate, sector licence and fee proof |
| **Investment certificate** | RDB; unlocks incentives — reduced corporate income tax (0–15% depending on category) and tax holidays of up to 7 years for qualifying investments |
| **VAT on digital services** | Rwanda introduced VAT on digital goods and services (streaming, ride-hailing, online courses, cloud-based services) effective **FY2026/27**. **[COUNSEL]** Confirm whether SaaS subscription revenue falls under standard VAT |
| **Digital Services Tax** | **1.5% on foreign digital platforms'** advertising, search and subscription revenue, effective FY2026/27, with a possible local tax-representative requirement. Relevant if any entity is structured as non-resident |
| **Payments** | Using licensed aggregators (Flutterwave Rwanda — registered with BNR; Paystack — confirmed live in Rwanda; IntouchPay) avoids Subiza needing a BNR payment-service-provider licence. **This is the recommended structure.** Stripe availability for Rwanda was not confirmed |

---

## 8. Employment and social impact

Rwanda's government is actively trying to **grow** a BPO and digital-jobs sector. A product framed as job-destroying acquires a political liability for no commercial gain.

**Position and behaviour:**
- The AI handles repetitive, after-hours and overflow volume — calls that were **not being answered by anyone**. In the SME segment this is literally true: the alternative is not a human agent, it is a ringing phone.
- Humans handle complexity, judgment and relationships. The escalation design in [Document 04 §6](04-solution-and-product.md) is built for the staff member, not around her.
- Consider a stated commitment to hiring and upskilling locally into AI-oversight, transcription and QA roles — which the Kinyarwanda language programme requires anyway, making this a genuine commitment rather than a slogan.

**[RESEARCH GAP]** Rwanda's BPO strategy documents and current employment figures, and Kenyan BPO employment and AI-displacement data, could not be obtained and warrant a dedicated follow-up before any public positioning.

---

## 9. Language and accessibility

Rwanda has **four official languages: Kinyarwanda, English, French and Swahili**. Kinyarwanda is the national language, spoken by virtually the entire population; official communication is generally issued in Kinyarwanda and English.

**No statutory obligation was found** requiring private customer-service platforms to serve customers in Kinyarwanda. **[COUNSEL]** Confirm whether any RURA quality-of-service or consumer-protection provision imposes a language-access obligation on licensed ASPs.

Regardless of the legal answer, Kinyarwanda support is a **de facto necessity** — it is the market, and it aligns with RDB and MINICT digital-inclusion goals that stakeholders will expect the product to support. It is also, per [Document 03](03-competitive-landscape.md), the moat.

---

## 10. Consolidated legal questions for counsel

These cannot be resolved from public sources. They are ordered by how much they block the build.

| # | Question | Blocks |
|---:|---|---|
| 1 | **Article 50 cross-border transfer** — what exactly requires NCSA authorisation, what is the process and timeline, and can a foreign inference API be authorised as a named processor? | **The entire infrastructure architecture** |
| 2 | **Is a voiceprint "biometric information" under Art. 3(2)?** Confirm in writing with NCSA | Voice cloning; any future voice authentication; the Art. 60 criminal exposure |
| 3 | **Is a DPIA formally required**, and if so under what instrument? | Launch readiness |
| 4 | **Call-recording consent** — does any Rwandan statute govern it beyond Law 058/2021's consent principles? | Recording policy and disclosure wording |
| 5 | **Is outbound AI calling regulated?** Is there any consumer-protection instrument covering unsolicited calls and SMS? | Phase 3 outbound roadmap |
| 6 | **What are the National AI Agency's powers?** Is there a registration, licensing or sandbox requirement for private AI companies? | Regulatory planning |
| 7 | **NCSA registration fee and process timeline** | Phase 1 launch schedule |
| 8 | **Toll-free number acquisition** — direct from RURA or via an operator, at what cost? | Product options |
| 9 | **VAT and DST treatment of SaaS subscription revenue**; is a local tax representative required? | Pricing and billing design |
| 10 | **Any language-access obligation** on licensed ASPs | Product requirements |
| 11 | **Employment law for the annotation workforce** the language programme requires | Phase 2 hiring |
| 12 | **Terms of service and data-processing agreement drafting** for a multi-tenant processor relationship under Law 058/2021 | Customer contracts |

---

## 11. Compliance roadmap

| Phase | Compliance work |
|---|---|
| **Pre-build** | Engage counsel on questions 1–4. Confirm Article 50 posture. Draft the voice-cloning policy (done, §4.2). Decide the data-residency architecture accordingly |
| **Phase 0** | Design consent flows and disclosure scripts. Build the consent registry. Rwanda-resident storage from the first stored byte |
| **Phase 1** | RDB registration and investment certificate. NCSA registration as controller and processor. Article 50 authorisation application if needed. Breach-response runbook and named owner. Draft ToS and DPA. Meta Tech Provider verification |
| **Phase 2** | RURA ASP licence application, with the architecture, DR plan and QoS commitments as deliverables. Sender ID whitelisting if SMS ships. Confirm VAT/DST treatment with RRA |
| **Phase 3** | National AI Agency engagement. Outbound calling compliance infrastructure if outbound proceeds. C2PA provenance. EU AI Act readiness if any EU-facing client appears |
| **Continuous** | Annual licence renewals. Quarterly review of AI-regulation developments. Per-checkpoint model licence audit. Consent-artefact integrity checks. Breach-runbook rehearsal |

---

## Sources

Rwanda telecom: [RURA Regulation 013/R/EC-ICT/RURA/2021](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Regulatory_Instruments/ICT_Regulations_and_Guidelines/Regulation_Governing_Licensing_in_Electronic_Communication_in_Rwanda.pdf) · [RURA licensing portal](https://licensing.rura.rw/) · [RURA overview](https://www.rura.rw/about/overview) · [RURA ICT FAQs](https://www.rura.rw/sectors/ict/faqs) · [National Numbering Plan](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Key_ICT_Documents/Rwanda_National_Numbering_Plan___1_.pdf) · [Short-code procedure, Nyaruka](https://blog.nyaruka.com/rwandas-new-short-code-registration-procedure)

Data protection: [Law 058/2021 full text, RwandaLII](https://rwandalii.org/akn/rw/act/law/2021/58/eng@2021-10-15) · [Official Gazette 15/10/2021](https://cyber.gov.rw/fileadmin/user_upload/NCSA/Documents/Laws/OG_Special_of_15.10.2021_Amakuru_bwite.pdf) · [DPP Office general provisions](https://dpo.gov.rw/dpp-law/general-provisions) · [DPP Office FAQs](https://dpo.gov.rw/faqs) · [DPP Office cloud storage guidance](https://dpo.gov.rw/news-and-updates/news/article/cloud-storage-under-rwandas-data-protection-law-what-you-need-to-know) · [RISA data protection](https://www.risa.gov.rw/data-protection-and-privacy-law) · [Securiti.ai overview](https://securiti.ai/rwanda-data-protection-law/)

AI institutions and policy: [National AI Agency, The New Times](https://www.newtimes.co.rw/article/36769/news/inside-the-newly-approved-national-ai-agency) · [allAfrica](https://allafrica.com/stories/202606090072.html) · [KT Press](https://www.ktpress.rw/2026/06/rwandas-ai-ambition-takes-shape-as-cabinet-approves-new-agency/) · [Rwanda National AI Policy, The Future Society](https://thefuturesociety.org/development-of-rwandas-national-artificial-intelligence-policy/) · [UNESCO on Rwanda AI](https://www.unesco.org/en/articles/supporting-rwandas-bold-steps-towards-responsible-and-ethical-ai) · [AU Continental AI Strategy](https://au.int/sites/default/files/documents/44004-doc-EN-_Continental_AI_Strategy_July_2024.pdf) · [FPF analysis of the AU strategy](https://fpf.org/blog/global/the-african-unions-continental-ai-strategy-data-protection-and-governance-laws-set-to-play-a-key-role-in-ai-regulation/)

Voice cloning and AI law: [ELVIS Act](https://en.wikipedia.org/wiki/ELVIS_Act) · [Holland & Knight on the ELVIS Act](https://www.hklaw.com/en/insights/publications/2024/04/first-of-its-kind-ai-law-addresses-deep-fakes-and-voice-clones) · [NO FAKES Act committee advance, Deadline](https://deadline.com/2026/06/no-fakes-act-senate-judiciary-committee-1236959147/) · [Congress.gov S.4591](https://www.congress.gov/bill/119th-congress/senate-bill/4591/text) · [FCC ruling on AI voices in robocalls](https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal) · [Wilson Sonsini analysis](https://www.wsgr.com/en/insights/fcc-rules-ai-generated-voices-are-artificial-under-the-tcpa.html) · [AI voice compliance 2026, Henson Legal](https://www.henson-legal.com/ai-voice-compliance) · [EU AI Act Article 50](https://artificialintelligenceact.eu/transparency-rules-article-50/) · [EU Commission Article 50 FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) · [Greenberg Traurig, June 2026](https://www.gtlaw.com/en/insights/2026/6/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act) · [Denmark deepfake law status](https://globallawexperts.com/denmark-deepfake-law-2026/) · [C2PA](https://c2pa.org/)

Corporate and tax: [RDB One-Stop Centre](https://rdb.rw/one-stop-centre/) · [Rwanda VAT and DST 2026](https://vatabout.com/rwanda-approves-new-vat--digital-services-tax-rules-for-2026) · [New Times on digital VAT](https://www.newtimes.co.rw/article/35604/news/govt-introduces-vat-on-digital-goods-services) · [Flutterwave Rwanda](https://flutterwave.com/rw/) · [Paystack countries](https://paystack.com/countries)

Language: [Languages of Rwanda](https://en.wikipedia.org/wiki/Languages_of_Rwanda)

---

*Next: [10 — Infrastructure, DevOps & SRE](10-infrastructure-devops-sre.md)*
