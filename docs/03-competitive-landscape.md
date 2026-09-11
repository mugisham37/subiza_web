# 03 — Competitive Landscape

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. How to read this landscape

The category "AI customer service" is not one market. It is five markets that share vocabulary and almost nothing else — different buyers, different price points, different technical architectures, different failure modes. Confusing them is the most common analytical error in this space, and it produces two symmetrical mistakes: believing the market is empty (it is not) and believing it is closed (it is not).

The five layers:

```
  ┌────────────────────────────────────────────────────────────────┐
  │  L5  ENTERPRISE CONTACT CENTRE + AI                            │
  │      Genesys, NICE, Five9, Talkdesk, Amazon Connect            │
  │      $75–240/seat/mo + $2,000/mo minimums                      │  ← SMEs excluded
  ├────────────────────────────────────────────────────────────────┤     by price floor
  │  L4  ENTERPRISE AI CS AGENTS                                   │
  │      Sierra ($15B val.), Decagon, Intercom Fin, PolyAI,        │
  │      Parloa, Zendesk AI, Agentforce                            │  ← SMEs excluded
  │      $0.99–2.00 per resolution, enterprise contracts           │     by contract model
  ├────────────────────────────────────────────────────────────────┤
  │  L3  TURNKEY SMB PRODUCTS (US/EU)                              │
  │      Dialzara, Rosie, GoodCall, Phonely, Smith.ai, Podium      │  ← crowded,
  │      $29–349/mo, English-only, US numbers, card billing        │     commoditised
  ├────────────────────────────────────────────────────────────────┤
  │  L2  DEVELOPER VOICE INFRASTRUCTURE                            │
  │      Vapi, Retell, Bland, Synthflow, Deepgram Agent,           │  ← commoditising
  │      OpenAI Realtime, Cartesia, LiveKit, Pipecat               │     fast, $0.04–0.32/min
  ├────────────────────────────────────────────────────────────────┤
  │  L1  CHAT AUTOMATION / OMNICHANNEL INBOX                       │
  │      ManyChat, Wati, Respond.io, AiSensy, Chatfuel, Tidio      │  ← no voice,
  │      $14–250/mo, contact-based                                 │     ever
  └────────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────────┐
  │  THE GAP:  turnkey · SME-priced · voice AND chat · African     │
  │            languages including Kinyarwanda · mobile-money      │
  │            billed · locally sold and supported                 │
  │            ─────────  NO INCUMBENT FOUND  ─────────            │
  └────────────────────────────────────────────────────────────────┘
```

Subiza is being built into that gap. The rest of this document establishes that the gap is real, explains why the layers above have not filled it, and identifies who might.

---

## 2. Layer 1 — Chat automation (including ManyChat, examined in depth)

The founder specifically named ManyChat, correctly identifying it as the closest thing to an incumbent for the messaging half of the problem.

### 2.1 ManyChat

**What it is:** an automation layer built on Meta's Messenger, Instagram and WhatsApp Graph APIs, with a visual flow builder. Its signature capability — and the one most relevant here — is **comment-to-DM automation**: someone comments on an Instagram post, an automated reply is posted, and a direct message opens with them, which conveniently also opens Instagram's 24-hour messaging window.

**Pricing (2026, annual billing):**

| Plan | Monthly | Contacts | Channels |
|---|---:|---:|---|
| Free | \$0 | 25 | 2 |
| Essential | \$14 | 250 | 2 |
| Pro | \$29 | 2,500 | 3 (adds WhatsApp) |
| Business | \$69 | 7,500 | Unlimited |
| Advanced | \$139 | 25,000 | Custom |

Monthly (non-annual) billing runs 18–30% higher. "AI Step" is a further add-on of roughly \$29/month. Human live-chat handoff ("Inbox Pro") is a further \$99/month for three seats. Contact overage runs \$0.018–\$0.10 per contact. Meta's own per-message fees pass through on top.

**Its four structural limitations, and why each matters to Subiza:**

1. **No voice, and no path to it.** ManyChat's own community forum contains explicit user requests for call support; there is no phone channel and no roadmap commitment. This is not an oversight — telephony is an entirely different technical discipline (SIP signalling, RTP media, codecs, jitter buffers, echo cancellation, sub-second latency budgets) from webhook-driven message automation. Adding voice to ManyChat is not a feature; it is a second company.
2. **Shallow AI.** The AI Step is widely described by reviewers as basic FAQ matching, "limited compared to dedicated AI agents." It is not a grounded conversational agent.
3. **Contact-based billing punishes growth.** A business whose audience grows pays more even if its automation volume does not — precisely backwards for an SME whose value from the tool is proportional to conversations handled, not to list size.
4. **Calibrated for a different customer.** English-first, card-billed, designed around Instagram-led e-commerce and creator marketing in North America and Europe.

**The read:** ManyChat is not a competitor to Subiza Voice at all, and is a partial competitor to Subiza Inbox. In markets where an SME already uses ManyChat, Subiza's pitch is "we do the calls you cannot automate, and we do the messages too, in Kinyarwanda, for less."

### 2.2 The rest of Layer 1

| Vendor | Channels | Pricing | Voice? | Relevance |
|---|---|---|---|---|
| **Wati** | WhatsApp-primary | Growth ~\$25/mo, Pro ~\$80/mo, Business ~\$250/mo, plus per-user \$24–69; PAYG ~\$12 | **Launching "Astra AI Agents" marketed for web, WhatsApp *and voice*** | **The most direct strategic threat in this layer** — an established WhatsApp player moving into voice |
| **Respond.io** | True omnichannel inbox: WhatsApp, IG, Telegram, Messenger, SMS, email | Monthly-active-contact based, ~\$79/mo entry | No | Strong inbox UX; no telephony |
| **AiSensy** | WhatsApp | Chatbot builder \$80/mo; AI Agent builder \$99/mo | No | India-market pricing, minimal Africa presence |
| **Interakt, Zoko, Chatfuel, Tidio** | WhatsApp / web chat | ₹999+ entry tiers to mid-hundreds USD | No | South Asia and global SMB focus |
| **Gupshup, Infobip** | Omnichannel CPaaS + BSP rails | Usage-based, enterprise deals | Voice as CPaaS, not AI agent | Real Africa presence as **infrastructure** — many African WhatsApp bots run on their rails. Potential supplier, not competitor. |

---

## 3. Layer 2 — Developer voice infrastructure

This layer is where the founder's technical instinct points, and it is important to understand that **it is not the market Subiza should enter** — it is the market Subiza should *buy from and then replace internally*.

| Vendor | Model | 2026 pricing | Scale / funding |
|---|---|---|---|
| **Vapi** | Orchestration; you bring your own STT/LLM/TTS/telephony | \$0.05/min platform fee; **all-in ≈\$0.30–0.33/min** once components added; concurrency \$10/line/mo after 10 free | \$20 M Series A (Bessemer) |
| **Retell AI** | Modular; choose LLM, voice and telephony | Voice infra \$0.055–0.07/min + TTS \$0.015–0.04 + LLM \$0.045–0.32 = **all-in \$0.07–0.31/min**; numbers \$2/mo | **Reportedly \$40 M+ ARR (Jan 2026), 300%+ QoQ growth, 40 M+ calls/month** |
| **Bland AI** | Vertically integrated, flat all-inclusive per-minute | Start \$0.14/min (no fee); Build \$0.12/min + \$299/mo; Scale \$0.11/min + \$499/mo | **>\$100 M raised, Series C in 2026** |
| **Synthflow** | No-code builder over a managed stack | Subscription tiers | Not disclosed |
| **ElevenLabs Agents** | Own TTS + STT + orchestration | TTS tiers \$0–990/mo; Business tier includes ~\$0.05/min low-latency TTS | Major funded voice-AI company |
| **Deepgram Voice Agent API** | STT + TTS + orchestration bundle | Standard \$0.056→\$0.075/min; BYO-LLM \$0.050→\$0.065/min; Advanced \$0.122→\$0.163/min (prices rising Sept 2026) | Established STT vendor |
| **OpenAI Realtime API** | Native speech-to-speech | ~\$0.04/min (reduced); audio tokens \$32/M in, \$64/M out at flagship tier | OpenAI |
| **Cartesia (Sonic)** | Low-latency TTS + agents | Tiers \$0–299/mo; voice agents \$0.06/min + \$0.014/min telephony | Series A |
| **LiveKit / Pipecat / Vocode** | Open-source agent frameworks | Free (self-hosted) + optional cloud | LiveKit widely adopted |

**Three conclusions from this layer:**

1. **Raw voice-agent infrastructure is commoditising toward \$0.05–0.08/minute.** Deepgram, OpenAI Realtime and Cartesia all cluster there. Building a business on being 10% cheaper at this layer is not a business.
2. **Retell's scale (40 M+ calls/month) is proof of technical viability**, not proof of market saturation in Africa. Their customers are overwhelmingly US SMBs and agencies.
3. **These are Subiza's suppliers in Phase 0–2 and its internal capability in Phase 3–4.** LiveKit Agents, Pipecat and jambonz are open-source and are direct architectural inputs to [Document 05](05-system-architecture.md).

### 3.1 The cautionary tale — Air.ai

Air.ai marketed an AI phone agent to small businesses, charging **\$25,000–\$100,000 in upfront licence fees**, largely through reseller agencies making aggressive earnings claims. The product reportedly did not work as sold; service went dark in late 2024. The FTC sued in **August 2025**; a settlement in **March 2026** permanently banned its owners from marketing business opportunities.

This matters to Subiza in three concrete ways:
- Every SME owner who has heard of AI phone agents may have heard of this. **Trust is the scarce good.**
- It validates that SMEs *want* this product enough to pay tens of thousands of dollars for it — the demand was real even where the product was not.
- It sets the ethical floor: transparent pricing, no upfront licence fees, a working free trial, no lock-in, a named human who answers.

---

## 4. Layer 3 — Turnkey SMB AI receptionists (US/EU)

| Vendor | Pricing (2026) | Model | Notes |
|---|---|---|---|
| **Dialzara** | \$29 (60 min) / \$99 (220) / \$199 (500) / \$349 (1,000) per month; overage \$0.35–0.48/min | Minutes-tiered | Also SMS agent \$19/mo, chatbot \$39/mo |
| **Rosie** | \$49 (250 min) / \$149 (1,000) / \$299 (2,000) per month | Minutes-tiered | Bilingual EN/ES; free website chat |
| **GoodCall** | \$79 / \$129 / \$249 per agent/month | Unlimited minutes, capped unique customers (100/250/500, \$0.50 each after) | Google Voice / Zapier only |
| **Phonely** | Free (100 min) / \$50 (250) / \$150 (750); enterprise "as low as \$0.05/min" | Minutes-tiered | Claims 10,000+ businesses (unverified) |
| **Smith.ai** | \$300/mo (30 calls) → \$2,100/mo (300 calls); overage \$8.50–11.50/call | Per-call, **human receptionists** | Heavy add-on fees; the closest analogue in absolute dollars to a Rwandan pricing target |
| **Podium AI Employee** | Reported true cost \$450–600/mo | Bundled into a reviews/messaging suite | Reported aggressive upsell and lock-in |
| **Numa, Slang.ai, Belle, AnswerConnect** | Vertical or human-first, quote-based to \$2,000+/mo | Mixed | Dealerships, restaurants, legacy answering services |

**The read on Layer 3:** this market is saturated and differentiating on vertical templates rather than core capability. The proliferation of near-identical affiliate review sites comparing these products is itself a signal of thin differentiation and probable high churn.

**Its irrelevance to Rwanda is total and structural**, for four independent reasons already stated in [Document 01](01-problem-analysis.md): English-only, no Rwandan numbers (Twilio charges \$0.5554/min to Rwanda and appears not to offer Rwandan DIDs), card billing, and pricing calibrated to a US wage anchor.

**But its existence is the strongest possible validation.** Thousands of small businesses in high-wage markets pay \$29–349/month for exactly this. The product concept is proven. The question is only whether it can be delivered profitably at Rwandan prices in Rwandan languages — which is an engineering and cost-structure question, not a demand question.

---

## 5. Layers 4 and 5 — Enterprise

| Vendor | Pricing | Why the SME is excluded |
|---|---|---|
| **Sierra** (Bret Taylor) | Enterprise custom | **\$950 M raised in 2026, \$15 B valuation** — enterprise-only economics |
| **Decagon** | Enterprise custom | Well-funded enterprise CS agent platform |
| **Intercom Fin** | **\$0.99 per resolution** + seats \$29–132/seat/mo | Per-resolution pricing is elegant but the seat floor and enterprise motion exclude micro-businesses |
| **Zendesk AI** | \$1.00–2.00 per resolution | Enterprise |
| **Salesforce Agentforce** | \$2/conversation or \$500 per 100 k Flex Credits | Enterprise |
| **PolyAI** | Enterprise custom | **\$86 M Series D (Dec 2025), \$750 M valuation, 100+ enterprise customers, 45 languages, 25+ countries** |
| **Parloa** | Enterprise custom | European enterprise voice AI |
| **Genesys Cloud CX** | \$75–240/user/mo + **\$2,000/mo minimum** | A five-person business pays the floor regardless |
| **NICE, Five9, Talkdesk** | \$100–200+/agent/mo + implementation | Requires a contact-centre operations function |
| **Amazon Connect + Lex, Google CCAI, MS Dynamics** | Pay-as-you-go or bundled | Requires cloud engineering; no African-language support; no owner-facing product |

PolyAI's 45 languages is worth pausing on: it demonstrates that multilingual enterprise voice AI is achievable at scale — and that the languages chosen are the ones with enterprise buyers. Kinyarwanda has 14 million speakers and no enterprise voice-AI buyer large enough to appear on that roadmap. **That absence is the opportunity.**

---

## 6. The African and emerging-market landscape

This is the section that determines whether Subiza has a real opening. The research went looking specifically for anyone answering live phone calls in African languages for SMEs.

| Company | Base | What it does | Voice? | Kinyarwanda? | Target |
|---|---|---|---|---|---|
| **Proto (proto.cx)** | Canada, with a **Rwanda** office | AI citizen engagement; powers Rwanda's **Mbaza** system (MINALOC, 30 districts) and the **National Bank of Rwanda's "Intumwa"** consumer-protection system across 591+ financial institutions | **Yes** | **Yes** — explicit Kinyarwanda voice AI ("Muraho" initiative) | **Governments, central banks, large enterprises — not SME self-serve.** \$1.8 M from the Gates Foundation |
| **AethexAI** | US-founded, Africa + Middle East | Voice AI infrastructure for emerging markets; proprietary small speech models ("Kora," 300 M–1.7 B params) for low-latency code-switched speech; telecom partnerships | **Yes — 17,000+ calls/day in production** | Not claimed | Call centres and enterprises: debt collection, KYC, activation. **\$3 M pre-seed (June 2026), 4DX Ventures / Enza Capital** |
| **Intron Health** | Nigeria | African-language speech AI; **Sahara v2.5**: STT in 63 languages, TTS in 13, **including a trilingual English–Kinyarwanda–French model** | Call-ready infrastructure | **Yes** | Healthcare (30+ hospitals), fintech, legal — **infrastructure, not an SME product** |
| **Addis AI** | Switzerland / Ethiopia | Enterprise voice, chat and cross-lingual RAG for African languages, low-bandwidth optimised | **Yes** — call centre and IVR | No | Agri-advisory (200 k+ farmers via Digital Green), education, public services |
| **EqualyzAI** | West/East Africa | Voice-first agentic AI: **VoiceAgent** for live calls with human handoff; **VoiceBridge** for feature-phone data collection | **Yes** | No (Yoruba, Igbo, Hausa, Pidgin, Swahili) | Telcos, banks, government, contact centres |
| **Spitch** | Lagos | Developer-first STT/TTS API + emerging no-code agent builder | Yes (hotlines) | No | Enterprise (Safaricom Ethiopia) + ~15 mid-size businesses; **largely bootstrapped** |
| **Cue** | South Africa | AI customer service: chatbots, live chat, AI agents | **Voice in development** | No | 500+ brands. **\$5 M raised July 2026** (Knife Capital) |
| **Sarufi / Neurotech Africa** | Tanzania | No-code Swahili conversational AI builder | No | No | Developers, small businesses |
| **Digital Umuganda** | **Rwanda** | Open Kinyarwanda speech datasets and models (Common Voice Kinyarwanda, YourTTS Kinyarwanda) | Research layer | **Yes** | Not a commercial product — **an ally, not a competitor** |
| **Mbaza** | **Rwanda** (MINALOC/RISA) | Government citizen-engagement chatbot, expanding to voice via Proto | Expanding | Yes | Citizens and government |
| **Africa's Talking** | Kenya, pan-African | CPaaS: SMS, USSD, Voice (traditional IVR), payments | Traditional IVR only, **not conversational AI** | N/A | Developers — **a supplier, not a competitor** |
| **HelloDuty** | Pan-African incl. Rwanda | SMS/USSD/WhatsApp/Voice infrastructure for African businesses | **Traditional routing/IVR only — confirmed not AI** | No | African SMEs |
| **Viamo (3-2-1)** | ~30 LMIC countries | Massive-scale IVR for development information via operator partnerships | Scripted IVR, not conversational | Local languages incl. regional | NGOs, governments, donors |

### 6.1 The central finding

**No company was found that operates a turnkey, self-serve, SME-priced product answering live phone calls in Kinyarwanda.** The capability exists, but distributed across parties who each hold only part of it:

- **Kinyarwanda speech capability exists** — Proto, Intron Health, Digital Umuganda.
- **African-language live-call products exist** — AethexAI, Addis AI, EqualyzAI — but none claims Kinyarwanda, and all target enterprises, telcos and contact centres rather than a shop with three employees.
- **Rwanda-specific deployed voice AI exists** — Proto's work with MINALOC and BNR — but it is sold as large public-sector and financial-institution engagements, not as a \$20/month self-serve subscription.

Corroborating this from the other direction: Rwandan ecosystem reporting in August 2026 shows local founders complaining about access to compute, data-centre capacity and datasets — **not about competition in AI customer service** — which is what one would expect in a category with no local incumbent at scale.

### 6.2 The honest caveats

- **Proto is the closest thing to a direct threat.** They already have Kinyarwanda voice AI in production in Rwanda, government relationships, Gates Foundation funding and a local office. If they decide to move down-market to SME self-serve, they start ahead. The counter-argument is that organisations serving central banks rarely build \$20/month self-serve products well — the sales motion, support model, unit economics and product surface are all different. But this should be monitored closely, and a supplier or partnership conversation with Proto is not unreasonable.
- **AethexAI is the closest thing to a template.** Same continent, same conviction that emerging-market voice is underserved, \$3 M raised, already at 17,000+ calls/day. They validate the thesis and they are ahead on execution. They are also not in Kinyarwanda and are focused on enterprise contact centres, not SME self-serve.
- **Wati's move into voice** is the most likely path by which a well-resourced chat incumbent enters the combined voice+chat SME space. Their distribution in emerging markets is real.

---

## 7. Voice cloning and TTS vendors — suppliers, not competitors

| Vendor | Pricing | Cloning |
|---|---|---|
| **ElevenLabs** | Free / Starter \$6 / Creator \$22 / Pro \$99 / Scale \$299 / Business \$990 (incl. ~\$0.05/min low-latency TTS) | Instant cloning from \$6 tier; professional cloning from \$22; startup grant offers 12 months free |
| **Cartesia (Sonic)** | Free / \$5 / \$49 / \$299 / enterprise | Included in credits; \$0.06/min for agents |
| **Deepgram Aura** | \$0.015–0.045 per 1,000 characters | STT-first vendor; TTS secondary |
| **PlayHT/PlayAI, Murf, Speechify, Resemble, Respeecher** | Typically \$20–99/month entry, enterprise above | Resemble and Respeecher target high-fidelity professional cloning |

**None of them confirms production-quality Kinyarwanda.** This is the single most important fact in this table. It means the TTS layer is a commodity for English and French — buy it, do not build it — and a genuine build-or-partner problem for Kinyarwanda, which is exactly where the defensibility lives.

---

## 8. Competitive positioning

### 8.1 Where the market is crowded and where it is empty

| Segment | State | Evidence |
|---|---|---|
| Global voice-agent infrastructure | **Very crowded, commoditising** | 9+ credible vendors converging on \$0.04–0.16/min |
| US/EU turnkey AI receptionist | **Very crowded, thin differentiation** | 7+ vendors in a \$29–349/mo band; affiliate-review-site proliferation |
| Global chat automation | **Crowded** | ManyChat, Wati, Respond.io, AiSensy, Interakt, Gupshup, Infobip |
| Enterprise AI CS | **Crowded and extremely well capitalised** | Sierra \$15 B valuation, PolyAI \$750 M, Decagon |
| African-language speech infrastructure | **Sparse but growing** | Intron, Addis, EqualyzAI, Spitch, Lelapa |
| African-language live-call products for enterprises | **Early, 3–4 real players** | AethexAI, Addis AI, EqualyzAI |
| **Turnkey SME voice + chat in Kinyarwanda, MoMo-billed** | **Empty** | No incumbent identified |

### 8.2 The positioning statement

> For **Rwandan small and medium businesses** who **lose customers because nobody answers the phone or the message**, **Subiza** is an **AI customer-service platform** that **answers every call and message instantly, in Kinyarwanda, English, French or Swahili — on their existing phone number**.
>
> Unlike **Western AI receptionists**, which speak only English, need a foreign number and a credit card, and are priced against Western wages — and unlike **chat automation tools**, which cannot touch a phone call — Subiza is built for the way African SMEs actually do business: **by voice, on mobile, in local languages, paid for by mobile money.**

### 8.3 The four defensible advantages, honestly assessed

| # | Advantage | Strength | Decay risk |
|---|---|---|---|
| 1 | **Kinyarwanda on live calls** | Strong — no direct competitor; requires local data relationships and domain-specific telephone-band audio nobody else has | Medium: Proto already has Kinyarwanda voice AI. A well-funded entrant could licence Intron's trilingual model. **Mitigation: own a proprietary telephone-band Kinyarwanda dataset that cannot be replicated without operating in the market.** |
| 2 | **Cost structure priced for the market** | Strong — local telephony at 1/16th of Twilio's Rwanda rate, self-hosted inference, MoMo billing | Low-medium: this is a discipline, not a secret. A competitor could copy it, but has little reason to bother for a 14 M-person market. |
| 3 | **Voice + chat in one product at SME price** | Medium-strong — chat vendors cannot do voice, voice vendors do not do chat natively at this price | Medium: **Wati is already moving here.** This advantage has the shortest half-life. |
| 4 | **Local presence, trust, and support** | Strong in the near term; the hardest thing for a foreign entrant to replicate | Low — but it is also the hardest to scale. It works for the first thousand customers and must be replaced by product quality thereafter. |

**The honest synthesis:** advantage 1 is the moat; advantage 2 makes the business viable; advantage 3 is the near-term wedge and will erode; advantage 4 is how the first hundred customers are won. A strategy that relies only on 3 and 4 is a two-year business. A strategy that invests seriously in 1 is a ten-year one — which is why [Document 06](06-voice-ai-and-ml.md) treats the Kinyarwanda language programme as a core product workstream and not an R&D side project.

---

## 9. Competitive intelligence — what to watch

| Signal | Where | Meaning if it fires |
|---|---|---|
| Proto launches an SME self-serve tier in Rwanda | proto.cx, Rwandan press | Direct competition with a head start on language and government trust — accelerate, differentiate on price and self-serve UX |
| AethexAI adds Kinyarwanda | TechCrunch, their site | The most likely well-funded direct entrant |
| Wati ships voice in African markets | wati.io | The chat incumbent closes the gap — advantage 3 gone |
| ElevenLabs, Deepgram or Cartesia add Kinyarwanda | Vendor language pages | Commoditises the hardest part of the moat — pivot defensibility toward data, product and distribution |
| MTN or Airtel launch an AI answering service | Operator press | Existential in the near term. Pre-empt by positioning as a white-label supplier before they build |
| A new well-funded African voice-AI seed round | TechCabal, Disrupt Africa, Partech | New entrant mapping |
| Meta relaxes or tightens WhatsApp AI policy | Meta developer blog | Directly changes the Inbox product's addressable surface |

---

## 10. What the competitive analysis says about the build

Three architectural instructions fall out of this document and land directly in [Document 05](05-system-architecture.md):

1. **Do not build a voice-infrastructure company.** Buy Layer 2 initially, replace it internally when volume justifies it, and never sell it. The value is in the product layer and the language layer.
2. **Build the language capability as a first-class, owned asset from Phase 1.** Every call, with consent, becomes training data for a Kinyarwanda telephone-band corpus that no competitor can obtain without operating in Rwanda. This is the compounding asset.
3. **Make onboarding faster than any competitor, and make voice and chat one product with one inbox.** The wedge that gets the first customers is not superior AI — it is that the owner keeps their number, dials one code, and is live in under an hour, with calls and WhatsApp in the same place.

---

## Sources

Voice infrastructure: [Vapi pricing analysis](https://zeeg.me/en/blog/post/vapi-ai-pricing) · [Retell AI pricing](https://retellai.com/pricing) · [Bland AI pricing](https://pxlpeak.com/blog/ai-tools/bland-ai-pricing) · [Bland Series C](https://www.prnewswire.com/news-releases/bland-surpasses-100m-funding-with-new-series-c-to-advance-voice-ai-for-complex-high-stakes-conversations-302801583.html) · [Deepgram pricing](https://deepgram.com/pricing) · [Cartesia pricing](https://www.cartesia.ai/pricing) · [Voice AI in 2026, AssemblyAI](https://www.assemblyai.com/blog/voice-ai-in-2026-series-1)

Turnkey SMB: [Dialzara](https://dialzara.com/pricing) · [Rosie](https://heyrosie.com/pricing) · [GoodCall](https://www.goodcall.com/pricing) · [Phonely](https://www.phonely.ai/pricing) · [Smith.ai](https://smith.ai/pricing/receptionists) · [Podium true cost](https://astucia.io/blog/podium-pricing-2026-what-smbs-actually-pay)

Chat automation: [ManyChat pricing](https://manychat.com/pricing) · [ManyChat community — call support](https://community.manychat.com/general-q-a-43/manychat-can-support-calls-5202) · [Wati pricing](https://www.wati.io/pricing/) · [AiSensy pricing](https://aisensy.com/pricing/usd)

Enterprise: [Genesys pricing](https://www.alpharun.com/blog/genesys-pricing) · [Sierra \$15 B valuation](https://siliconangle.com/2026/05/04/ai-agent-startup-sierra-valued-15b-new-950m-funding-round/) · [Intercom pricing](https://www.intercom.com/pricing) · [Decagon](https://en.wikipedia.org/wiki/Decagon_(company))

African players: [Proto — Rwanda government partnership](https://www.proto.cx/resource/rwandas-government-and-proto-partner-to-deploy-integrated-ai-citizen-support-agents) · [Proto — BNR Intumwa case study](https://www.proto.cx/case-study/national-bank-of-rwanda-automates-consumer-protection-across-600-financial-institutions) · [Proto — Kinyarwanda voice agents](https://www.proto.cx/resource/muraho-proto-voice-ai-agents-now-speak-kinyarwanda) · [AethexAI, TechCrunch](https://techcrunch.com/2026/06/03/these-two-founders-left-goldman-and-meta-to-build-voice-ai-for-markets-everyone-else-overlooked/) · [Intron launches voice AI for Africa](https://www.itnewsafrica.com/2026/03/intron-launches-voice-ai-for-africa-with-24-languages/) · [Cue raises \$5 M](https://disruptafrica.com/2026/07/16/sas-cue-raises-5m-to-accelerate-customer-service-with-ai-agents/) · [African AI startups, TechCabal](https://techcabal.com/2025/07/17/african-ai-startups/) · [Addis AI](https://www.addisai.ch/) · [EqualyzAI](https://equalyz.ai/) · [HelloDuty Rwanda](https://helloduty.com/country/rwanda) · [Rwanda startup ecosystem gaps, allAfrica](https://allafrica.com/stories/202608170713.html)

Cautionary: [Air.ai FTC lawsuit status](https://trillet.ai/blogs/air-ai-ftc-lawsuit-status-2026)

---

*Next: [04 — Solution & Product Definition](04-solution-and-product.md)*
