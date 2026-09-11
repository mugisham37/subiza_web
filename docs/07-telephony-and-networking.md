# 07 — Telephony & Networking

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. The question this document answers

*"Can a phone call be connected to an AI — and can it be done in Rwanda without going through MTN?"*

**Yes to both.** This document explains exactly how, in enough detail that an engineer can build it and a non-engineer can understand what is being built. It covers the full path from a caller's handset to the AI and back, the provider landscape, the self-hosted alternative, the Rwandan regulatory and commercial reality, and the call-forwarding mechanism that makes the whole go-to-market possible.

---

## 2. How an AI gets onto a phone call

### 2.1 The two planes

Telephony over IP has two entirely separate flows, and most confusion in this area comes from conflating them.

- **The signalling plane (SIP)** sets up, modifies and tears down the call. It carries no audio.
- **The media plane (RTP/RTCP, or SRTP when encrypted)** carries the audio, in UDP packets, over a path negotiated by SIP but often taking a different network route.

A call can succeed on the signalling plane and fail completely on the media plane — this is the classic "phone rings, nobody can hear anything" bug, and it is almost always a NAT or firewall problem on the media path.

### 2.2 The full path

```
  Caller's handset
        │  (GSM/LTE radio)
        ▼
  MTN or Airtel mobile switch
        │  (national / international gateway)
        ▼
  Carrier or CPaaS network
        │  SIP signalling  +  RTP media
        ▼
  SBC (Session Border Controller)
        │  NAT traversal · topology hiding · encryption ·
        │  codec normalisation · fraud and DoS protection
        ▼
  Media server / application server
        │  answers the call, anchors the media
        │
        ├──►  RTP audio forked to the AI process ──────────┐
        │     (mod_audio_stream / AudioSocket /            │
        │      ARI externalMedia / CPaaS WebSocket)        │
        │                                                   ▼
        │                                          ┌─────────────────┐
        │                                          │  IJWI + UBWENGE │
        │                                          │  ASR → LLM →TTS │
        │                                          └────────┬────────┘
        │                                                   │
        ◄──── synthesised audio streamed back ──────────────┘
        │
        ▼
  Back out through SBC → carrier → caller's handset
```

### 2.3 SIP call setup, concretely

1. **INVITE** — the caller's carrier sends an INVITE with an SDP *offer*: proposed codecs, and an IP address and port for RTP.
2. **100 Trying / 180 Ringing** — provisional responses.
3. **200 OK** — Subiza's side answers with an SDP *answer*: the selected codec and its own RTP address and port.
4. **ACK** — the caller confirms. Media now flows both ways.
5. **BYE** — either side ends the call; **200 OK** confirms.

Mid-call, **re-INVITE** or **UPDATE** renegotiates (hold, codec change), and **SIP INFO** can carry application-level signalling.

**Why this matters for an AI product:** every hop is a place where SDP negotiation can select a bad codec, where NAT can break the media path, and where the SBC must correctly anchor and possibly transcode audio before the AI ever hears it.

### 2.4 Codecs — the biggest single quality lever

| Codec | Rate | Bitrate | Relevance |
|---|---|---|---|
| **G.711 µ-law (PCMU)** | 8 kHz | 64 kbps | US and CPaaS default; near-zero compression latency |
| **G.711 A-law (PCMA)** | 8 kHz | 64 kbps | **The standard in Europe, Africa and Rwanda.** If a CPaaS defaults to µ-law and the carrier leg is A-law, a transcode happens somewhere — added latency and a small quality loss |
| **G.729** | 8 kHz | 8 kbps | Used on constrained or expensive international trunks. Lossy compression **measurably degrades ASR accuracy** and can destroy in-band DTMF tones. **Refuse it on the AI-facing leg** |
| **Opus** | 8–48 kHz | 6–510 kbps adaptive | WebRTC and some CPaaS WebSocket streams. Wideband audio materially improves both ASR accuracy and TTS naturalness |

**The structural constraint:** any call arriving over the PSTN is 8 kHz narrowband (roughly 300–3,400 Hz) no matter how good the models are. Wideband audio only becomes available on WebRTC ingress — a web click-to-call widget, or an in-app VoIP path. This is why [Document 06](06-voice-ai-and-ml.md) insists that all ASR benchmarking be done on 8 kHz audio, and it is a permanent ceiling on recognition quality for the PSTN path.

### 2.5 DTMF — three mechanisms, one correct answer

1. **RFC 2833 / RFC 4733 (out-of-band named events)** — DTMF sent as distinct RTP payload-type packets. The modern default, negotiated by Twilio, Telnyx, Plivo, FreeSWITCH and Asterisk. **This is what to use.**
2. **In-band tones** — legacy; unreliable through low-bitrate codecs, since G.729 can distort or drop the tones.
3. **SIP INFO** — digits carried as SIP signalling; used by some PBXs, needs explicit support.

**DTMF is not optional for Subiza.** It is the fallback when speech recognition struggles (a real risk for Kinyarwanda on noisy lines), the mechanism for language selection, and the input method many callers reach for by habit.

### 2.6 Jitter, loss, echo

| Issue | Effect | Handling |
|---|---|---|
| **Jitter** | Packets arrive unevenly; audio glitches | Adaptive jitter buffer, 20–60 ms. **Every millisecond of buffer comes out of the turn latency budget** — this is a direct trade-off against conversational feel |
| **Packet loss** | 1–3% materially degrades ASR; bursts are worse | Packet loss concealment; monitor per call; degrade gracefully rather than transcribing corrupted audio. African mobile and backhaul networks show more transient loss and jitter spikes than wired networks — design for it |
| **Echo** | The AI hears its own voice; barge-in detection breaks; the agent transcribes itself | Network echo cancellation handles PSTN legs at carrier equipment. Acute on WebRTC ingress where speaker leakage into a microphone is common — AEC is mandatory there |

### 2.7 WebRTC as a parallel ingress

WebRTC (ICE for NAT traversal, DTLS-SRTP for mandatory encryption, SDP negotiation like SIP) is how a browser or app reaches the media pipeline without touching the PSTN at all. Two uses for Subiza:

- **A click-to-call widget** on a business's website or Instagram bio link — wideband audio, no per-minute carrier cost, and better ASR accuracy as a result.
- **Bridging** WebRTC to SIP via a gateway (Kamailio + rtpengine, FreeSWITCH, or a CPaaS browser SDK), so browser callers and phone callers reach the same agent.

Notably, the CPaaS "media streaming" products described next are essentially a managed variant of this idea: the provider terminates SIP and RTP and re-exposes the audio to your server over a WebSocket.

---

## 3. CPaaS providers

### 3.1 Real-time media streaming capability

The critical question for any provider: **can an external AI be placed in the media path?**

| Provider | Mechanism | Verdict |
|---|---|---|
| **Twilio** | `<Stream>` (Media Streams) — WebSocket carrying base64 µ-law or L16, bidirectional. Also **ConversationRelay**, a managed bundle of STT+TTS+LLM behind one WebSocket (median latency < 0.5 s, 95th percentile < 0.725 s) | ✅ Most mature and documented |
| **Telnyx** | Native `media_streaming` WebSocket API into your own stack; also a bundled Voice AI Agents product | ✅ Markets itself as cheaper and more transparent |
| **Plivo** | Audio Streaming — "one WebSocket between your call and your AI"; µ-law 8 kHz native, optional 16-bit PCM at 8/16 kHz; direct Pipecat integration; advertises ~50 ms to your server via edge routing | ✅ |
| **Vonage** | Documented WebSocket Voice API | ✅ capability confirmed; pricing not publicly extractable |
| **SignalWire** | Native to their AI Agent Runtime — bundled STT+LLM+TTS at a flat rate | ✅ but sells the whole stack, not raw transport |
| **Bandwidth** | Dedicated bi-directional media streaming product | ✅ US-centric carrier; Africa reach unconfirmed |
| **Infobip** | Voice/WebRTC Calls API | ⚠️ streaming-for-AI specifics not confirmed |
| **Africa's Talking** | Voice API built around synchronous XML callbacks with Play/Say/Record verbs — an IVR-era design | ⚠️ **No evidence found of a WebSocket real-time media streaming product.** Not fully verified; must be confirmed directly with Africa's Talking |

**That last row is the most consequential open question in the entire project's infrastructure.** Africa's Talking is the only provider with published Rwandan local-number pricing at a viable rate. If it cannot stream media, the architecture must bridge.

### 3.2 Pricing — and the sixteen-fold difference

**Twilio, Rwanda-specific (published):**

| Item | Rate |
|---|---|
| Outbound to Rwanda local | **\$0.5554/min** |
| Outbound to Rwanda mobile | **\$0.5528/min** |
| Outbound via SIP/browser | \$0.0040/min |
| Inbound via SIP/browser | \$0.0040/min |
| ConversationRelay | \$0.07/min |
| Recording | \$0.0025/min |

**No Rwandan local number appears in Twilio's coverage catalogue.** Twilio publishes SMS guidelines for Rwanda but no voice guidelines page, and Rwanda is absent from the countries with local DIDs. Twilio prices Rwanda as an expensive international destination.

**Africa's Talking, Rwanda (published, RWF):**

| Item | Rate | ≈ USD |
|---|---|---|
| Number setup | RWF 20,000 one-off | ≈ \$13.60 |
| Number maintenance | RWF 20,000/month | ≈ \$13.60 |
| Local incoming | RWF 50/min | **≈ \$0.034/min** |
| Local outgoing | RWF 50/min | ≈ \$0.034/min |
| SIP agent outgoing | RWF 5/min | ≈ \$0.0034/min |
| Conference | RWF 5/min | ≈ \$0.0034/min |

*(At 1 USD ≈ 1,471 RWF.)*

**Africa's Talking, other markets** (for expansion planning): Kenya — incoming KES 0.50/min, outgoing KES 2.50/min, number setup KES 5,000 + VAT, monthly KES 2,000 + VAT, toll-free setup KES 20,000 + VAT / monthly KES 15,000 + VAT. Uganda — incoming UGX 45/min, outgoing UGX 290/min, setup UGX 200,000, monthly UGX 40,000. Nigeria — incoming NGN 5/min, outgoing NGN 15–20/min, MTN number setup NGN 6,000 + VAT, monthly NGN 10,000 + VAT.

**Others (generic global tiers, not Rwanda-confirmed):** Telnyx ~\$0.007/min all-in for a generic destination, plus a bundled Voice AI Agent at \$0.05/min; Plivo from \$0.0028/min; SignalWire transport \$0.003–0.015/min with an AI runtime at \$0.16/min flat.

### 3.3 The architectural conclusion

The likely Phase 1–2 architecture is a **hybrid**:

```
   Caller ──► MTN/Airtel ──► Africa's Talking Rwanda number  (cheap local ingress)
                                    │
                                    │  SIP bridge
                                    ▼
                          Streaming-capable path
                          (Telnyx / Plivo / self-hosted media server)
                                    │
                                    ▼
                              WebSocket audio
                                    │
                                    ▼
                             IJWI + UBWENGE
```

This preserves the sixteen-fold cost advantage of local termination while obtaining the real-time media capability the AI requires. **Whether the bridge is necessary depends entirely on the unresolved Africa's Talking question**, which is why it appears at the top of [Document 13](13-open-questions-and-validation.md).

---

## 4. Self-hosted telephony infrastructure

The Phase 2–4 path, and worth understanding early because the migration is easier if the abstraction anticipates it.

| Component | Role |
|---|---|
| **Kamailio / OpenSIPS** | SIP proxy, registrar, router — **signalling only**, never touches audio. Extremely high call-attempts-per-second capacity. The nginx of SIP |
| **FreeSWITCH / Asterisk** | Media server / B2BUA — terminates SIP *and* RTP on both legs, transcodes, records, runs call logic, and forks audio to an external AI process. The thing that actually answers |
| **SBC** | Network edge: NAT traversal, topology hiding, TLS/SRTP, fraud and DoS protection, codec normalisation between carrier and internal network |
| **jambonz** | An open-source, self-hostable **CPaaS equivalent** — drachtio for SIP plus FreeSWITCH/rtpengine for media plus a feature server exposing `stream`, `say` and `dub` verbs. Built explicitly for AI voice use cases. **The most direct self-hosted analogue to Twilio Media Streams** |
| **drachtio** | Programmable SIP application server controlled from Node.js — the signalling engine jambonz builds on |
| **mod_audio_stream** (FreeSWITCH) | Attaches a media bug to a call and streams L16 PCM (8 or 16 kHz) to a WebSocket, with full-duplex playback back into the call in the commercial release. The FreeSWITCH equivalent of Twilio's `<Stream>` |
| **AudioSocket** (Asterisk) | Simple raw-TCP protocol for streaming call audio to an external process — the simplest Asterisk-to-bot path |
| **ARI + externalMedia** (Asterisk) | REST/WebSocket call control plus an external media channel bridging audio to an RTP endpoint |
| **EAGI** (Asterisk) | Legacy: audio over stdin/stdout of an external script |

### 4.1 Scale reference

The production pattern at scale is Kamailio or OpenSIPS in active-standby pairs at the SIP edge, fronting a horizontally-scaled pool of FreeSWITCH media servers. One cited real deployment: 31 FreeSWITCH media servers handling ~60,000 concurrent calls at ~1,000 calls per second. Commercial SBCs are quoted at up to ~60,000 simultaneous sessions per server.

Subiza will not need anything close to this for years. The point of citing it is that **the architecture has enormous headroom** — the constraint on scale will be GPU capacity for inference, not telephony.

### 4.2 The SBC warning

Open-source SIP components **do not replace a carrier-grade SBC**. They lack STIR/SHAKEN, real-time fraud scoring, DDoS mitigation, and vendor accountability. An exposed SIP endpoint attracts toll-fraud attempts within hours of going live, and toll fraud is expensive and fast. Whatever the edge is — a hardened Kamailio + rtpengine configuration with rate limiting and fail2ban, or a commercial SBC — it must be treated as a security boundary, not a routing component. This appears in [Document 05 §16](05-system-architecture.md) as a security requirement.

### 4.3 Recommendation

**Do not build a self-hosted telephony stack in Phase 0–1.** CPaaS or jambonz is more practical at low volume, and telephony engineering is a specialised discipline that will consume the team's attention at exactly the wrong moment. Design the abstraction to permit the migration; make the migration when concurrent-call volume and per-minute economics justify it.

---

## 5. Call forwarding — the go-to-market mechanism

This is the most commercially important technical finding in the research, and it deserves its own section.

### 5.1 The mechanism

GSM supplementary-service codes for call forwarding are a **3GPP standard implemented by essentially every GSM operator**, including MTN and Airtel. They are **network-based**, registered on the operator's switch rather than on the handset, which means the network redirects the call before the original phone even rings.

| Behaviour | Activate | Deactivate |
|---|---|---|
| Unconditional (all calls) | `**21*<number>#` | `##21#` |
| If busy | `**67*<number>#` | `##67#` |
| If no answer | `**61*<number>#` | `##61#` |
| If unreachable (off / no signal) | `**62*<number>#` | `##62#` |

### 5.2 Why this changes everything

Without call forwarding, onboarding a business means porting their number (slow, regulated, frightening to the owner) or asking them to publish a new number (destroys the value of years of printed cards, shop signs and word of mouth). Both are conversion-killing.

With call forwarding, onboarding is: **"Keep your number. Dial one code. We answer what you miss."**

And **conditional** forwarding is better than unconditional, for three reasons:

1. **It preserves the owner's agency.** She answers when she can; Subiza catches only what would otherwise be lost.
2. **It makes the value provable.** Every Subiza-handled call is by definition a call the business missed — which is exactly the "missed calls recovered" metric that drives renewal ([Doc 04 §8.3](04-solution-and-product.md)).
3. **It reduces perceived risk.** Nothing changes about how the business already works. If Subiza is switched off, everything reverts.

### 5.3 What must be verified — urgently and cheaply

Four unknowns, all resolvable with a SIM card and an afternoon:

| Question | Why it matters | How to test |
|---|---|---|
| **Do MTN and Airtel Rwanda honour these codes today?** | Almost certainly yes (baseline GSM feature) but no Rwanda-specific documentation was found | Dial them on live SIMs of both networks |
| **Does the original caller's number survive the forward?** | Determines whether the agent can greet a returning customer by name and do CRM lookups. Depends on whether the carrier passes diverting-party information (P-Asserted-Identity or similar) through to the terminating provider | Forward to a Subiza test number, call from a third phone, inspect the SIP headers |
| **Who pays for the forwarded leg, and how much?** | The business may be charged by MTN for the forwarding hop *in addition* to Subiza's inbound minute charge. This changes the customer's total cost of ownership and must be disclosed honestly | Test with a monitored prepaid SIM; confirm with MTN and Airtel customer service |
| **Can forwarding be managed programmatically?** | If it is USSD-only, the owner must dial the code manually and Subiza cannot toggle it. If a self-care portal or API exists, onboarding gets much smoother | Check MTN and Airtel self-care apps; ask enterprise support |

**These four tests are the highest information-per-effort actions available to the project**, and they appear as item 3 in the master document's next actions.

### 5.4 Fallbacks if forwarding disappoints

- If caller ID is lost: the agent asks the caller to identify themselves; personalisation degrades but the product still works.
- If forwarding is expensive: shift to selling a dedicated Subiza number as the published "customer service line," with forwarding as an optional add-on.
- If forwarding is unreliable: accelerate the native-number path and number porting for businesses willing to do it.

---

## 6. Rwandan regulatory and carrier reality

### 6.1 RURA licensing

Under **Regulation No. 013/R/EC-ICT/RURA/2021**, three licence tiers exist. The relevant one is the **Application Service Provider (ASP) licence** — for non-infrastructure service providers delivering applications over existing networks. **VoIP is explicitly named** under this category, alongside retail ISP and payphone services.

| Item | Amount |
|---|---|
| Application fee | **USD 500** |
| Licence fee | **USD 5,000** |
| Annex One row | **"Retail ISP, VoIP, Pay phone, Tracking Systems"** — VoIP has its own row, distinct from the general ASP row (USD 100 + USD 1,000) |
| Validity | 5 years |
| Performance bond | **USD 10,000** |

Required deliverables with the application include technical system architecture documentation, a backup and disaster-recovery plan, quality-of-service commitments (availability, mean time to repair), emergency-services access provisions, and SLAs with telecom and banking partners where relevant. **These are documentation obligations that this documentation set already substantially satisfies** — [Document 05](05-system-architecture.md) and [Document 10](10-infrastructure-devops-sre.md) exist partly for this purpose.

**VoIP is licensed, not banned, in Rwanda** — unlike some regional neighbours historically. The regulation also imposes interconnection obligations: licensed operators must publish an approved Reference Interconnection Offer, and interconnection must be offered at any technically feasible point on fair and reasonable terms, with unresolved disputes escalating to RURA for binding determination within a 30-day negotiation window.

**Short codes** (per RURA's online short-code system): application fee RWF 25,000 one-time, then annual tiers of GOLD \$1,000 / SILVER \$800 / BRONZE \$600 / ORDINARY \$200 depending on the code's desirability. Applicants may now request a specific code subject to availability.

**Toll-free numbers** are administered under RURA's National Numbering Plan (June 2023) but are typically provisioned through a licensed telecom operator rather than obtained directly by an ASP. Exact process and fees remain unconfirmed.

### 6.2 MTN Unicall — the carrier path

MTN Rwanda sells a commercial SIP trunking product, **MTN Unicall**, positioned as a TDM-replacement and unified-communications offering. Eligibility is confirmed as **any SME or large enterprise holding an RDB business-registration certificate**, plus NGOs and government bodies — individuals are excluded. Contact is direct enterprise sales (sales.RW@mtn.com, 3111), not self-service.

This is a **customer** relationship, not a licensed-interconnect relationship — Subiza buys SIP trunks from MTN the way any business phone system would. That is very likely simpler than pursuing full RURA-licensed interconnection, and it may be the most direct realistic path to a local, carrier-grade Rwandan number with real SIP termination. Technical specifics (capacity, codecs, IP requirements, SLA) are not public and require direct engagement.

An Airtel Rwanda equivalent was not confirmed publicly, though Airtel offers SIP trunking in other markets; assume a parallel enterprise sales conversation is possible and verify.

### 6.3 What MTN and Airtel developer programmes do *not* offer

Both operators run developer portals. **Neither exposes voice.**

- **MTN Developer Portal**: ~222 products across advertising, agent/KYC, analytics, customer, **messaging (SMS/USSD)**, **payment (MoMo)**, resource, security, TM Forum and ticketing APIs. No voice or SIP-trunking API product was found. Supported countries include Rwanda among 15.
- **MTN Chenosis**: an MTN-owned API marketplace aggregating operator APIs — advertising, data, payments. Not voice-focused.
- **Airtel Africa Developer Portal**: exposes Airtel Money APIs; the full catalogue could not be extracted, but no voice API surfaced in any source.

**Conclusion:** the operators' API programmes are fintech- and messaging-first. Voice comes through CPaaS resale, enterprise SIP trunking, or licensed interconnection — not through a developer portal.

---

## 7. Alternatives that bypass carriers

### 7.1 WhatsApp Business Calling API — more capable than expected

Confirmed real, launched 15 July 2025. Supports both business-initiated and user-initiated voice calls within a WhatsApp thread, with **two architecture options**:

- Default: Graph API and webhooks for signalling, **WebRTC (ICE + DTLS + SRTP)** for media.
- Alternative: **SIP signalling** with WebRTC or SDES-SRTP media — meaning a WhatsApp voice channel **can be bridged into the same SIP-based AI stack** as a PSTN call.

Codecs: OPUS, PCMA, PCMU. Business-initiated calling is available globally **except the USA, Canada, Egypt, Vietnam and Nigeria** — usable from Rwanda, notably not for the Nigerian market. Production access requires a minimum of 2,000 daily unique recipients, and business-initiated calling limits were raised to 100 calls/day in December 2025.

Rwanda rates found: **\$0.01030/min outbound (Meta)** plus a provider handling fee.

**Strategic read:** the daily limits make this unsuitable as a primary inbound channel today, but it is genuinely valuable as a complement — many Rwandan customers already live in WhatsApp, and the same AI pipeline serves it with no new infrastructure. Worth building in Phase 3.

### 7.2 Other bypass routes

- **Telegram calls** — no public business calling API equivalent. Not a practical channel.
- **In-app or web WebRTC** — fully viable as a parallel channel with better audio quality, but does not solve the core problem, which is intercepting calls to the business's *existing published number*.
- **Pure SIP URIs** — unrealistic for small businesses whose customers dial phone numbers.

---

## 8. Latency and geography

### 8.1 Rwanda's connectivity position

Rwanda is **landlocked**. Its international connectivity runs terrestrially through Kenya and Tanzania to submarine cable landing points, connecting to the **EASSy, TEAMS and SEACOM** systems. This multi-hop terrestrial dependency is a structural latency and resilience factor — East African submarine cable outages have historically caused regional disruption.

**RINEX** (Rwanda Internet Exchange Point, operated by RICTA with RURA) keeps domestic traffic local. It helps Rwanda-to-Rwanda traffic; it does not reduce latency to a media server hosted abroad unless that provider peers there — which was not confirmed.

**Kigali data centres**: PAIX Kigali (in Kigali Innovation City), TrAC Kigali (Rwanda's only Tier III-certified facility), and AOS Ltd's National Data Center. None hosts a public cloud region.

**Nearest cloud regions**: AWS Cape Town (`af-south-1`), Azure South Africa North (Johannesburg), GCP Johannesburg (`africa-south1`), Oracle Johannesburg — all roughly 3,000 km from Kigali. **No hyperscaler region exists in East Africa.**

### 8.2 The numbers

**ITU-T G.114** sets the benchmark: one-way latency should stay **under ~150 ms** for acceptable voice quality; 150–300 ms is "acceptable but a factor"; beyond 300 ms conversational quality degrades sharply into talk-over and awkward pauses.

For an AI agent this is even tighter, because AI processing latency (300–800 ms even for fast providers — Twilio's own ConversationRelay reports a median under 0.5 s) stacks on top of network round-trip.

Research on African latency found median latencies of **29–65 ms** to CDN edge nodes across 17 countries, with Kenya achieving 5–10 ms thanks to CDN presence in Nairobi. **Rwanda was not broken out separately** — a genuine data gap.

Plausible engineering estimates, explicitly **not measurements**: Kigali → Cape Town/Johannesburg in the **60–100 ms** range; Kigali → Europe in the **150–250 ms** range. Against a total turn budget of 800 ms, the difference between those two is decisive.

**Therefore: measuring actual round-trip time, jitter and packet loss from a Kigali-connected line to each candidate hosting region is a Phase 0 task, not a Phase 3 optimisation.**

### 8.3 The phased geography plan

| Phase | Media path | Inference | Rationale |
|---|---|---|---|
| **0–1** | CPaaS, provider's nearest PoP | Managed APIs, wherever they are | Learning speed over latency optimisation; measure everything |
| **2–3** | CPaaS or own SIP trunk; media anchored as close to Africa as possible | Self-hosted GPU capacity in South Africa or an African provider | Latency and margin both improve; data residency addressed for storage |
| **4** | **Media edge colocated in Kigali** (PAIX or TrAC), direct interconnect | GPU capacity as close as the market allows | Minimises the domestic hop; the Rwanda-resident data plane is unchanged throughout |

---

## 9. Capacity, reliability and observability

### 9.1 Capacity planning

- **Bandwidth per call**: G.711 at 64 kbps payload plus RTP/UDP/IP overhead ≈ **80–100 kbps per leg per direction**, so roughly **160–200 kbps per active call**. G.729 compresses to ~24–31 kbps with overhead — a real bandwidth saving on expensive international links, at an unacceptable cost to ASR quality on the AI-facing leg.
- **Concurrent calls**: the telephony layer scales far beyond what GPU inference will support. Capacity planning is therefore driven by inference concurrency, not by media servers.

### 9.2 Reliability

- **Active-standby SBC pairs** with health-checked failover.
- **DNS SRV/NAPTR multi-homing** for carrier trunks, so a single carrier or SBC failure does not take down inbound calling.
- **Geographically separated media servers** behind the SBC layer for N+1 redundancy.
- **The overriding commitment**: if Subiza fails, calls must fall back to the business's own line. Subiza must never make a business *less* reachable than it was before ([Doc 05 §15](05-system-architecture.md)).

### 9.3 Recording

**SIPREC** (the SIP-based Media Recording Protocol) is the standard mechanism for a media server or SBC to fork a duplicate media stream to a recording server, independent of the AI media fork. Both OpenSIPS and commercial SBCs support it. Keeping recording separate from AI processing means retention policy, consent and compliance are governed independently of the conversation pipeline.

### 9.4 Observability

Classic telephony metrics — **MOS** (algorithmically estimated in production, not human-rated), **jitter**, **packet loss**, **RTT** — derived from RTCP reports and call detail records, with open tooling (Homer/HEPIC for SIP capture and call-flow analysis) or commercial equivalents.

**Layered on top, and unique to this product**: AI-added latency as a distinct metric set — ASR first-token, LLM first-token, TTS first-audio-byte. A perfect telephony connection with a slow model produces the same complaint as a fast model on a lossy line, and only a joint view distinguishes them. This is the requirement stated in [Document 05 §13](05-system-architecture.md).

---

## 10. What could not be verified

Listed here and carried forward to [Document 13](13-open-questions-and-validation.md):

1. Whether Africa's Talking Voice API supports real-time WebSocket media streaming.
2. Whether MTN and Airtel Rwanda honour standard GSM call-forwarding codes today.
3. Whether caller ID and diverting-party information survive a forwarded call to a CPaaS number.
4. The cost of the forwarding leg itself, and who bears it.
5. Whether call forwarding can be managed programmatically or only by USSD.
6. Airtel Rwanda's SIP trunking product details.
7. MTN Unicall technical specifications — capacity, codecs, IP requirements, SLA.
8. Precise Kigali-to-region network RTT figures.
9. RINEX's peer list — whether any CPaaS or cloud provider peers there.
10. Whether Rwanda has a toll-free number category with published pricing.
11. Vonage and Infobip Rwanda per-minute pricing (behind login/quote walls).

---

## Sources

Protocols and fundamentals: [ITU-T G.114 one-way transmission time](https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-G.114-200305-I!!PDF-E&type=items) · [DTMF: RFC 2833 vs in-band vs SIP INFO](https://voipnuggets.com/2023/06/12/different-types-of-dtmf-in-sip-and-why-dtmf-via-rfc2833-is-more-reliable/) · [DTMF and RFC 2833/4733](https://andrewjprokop.wordpress.com/2013/09/27/dtmf-and-rfc-2833-4733/) · [WebRTC vs SIP](https://telcobridges.com/learning/sip-trunking/webrtc-vs-sip-differences-and-use-cases/) · [Echo cancellation and barge-in, Deepgram](https://developers.deepgram.com/guides/deep-dives/audio-preprocessing-barge-in) · [SIPREC, OpenSIPS](https://docs.opensips.org/tutorials/siprec/) · [SIPREC IETF draft](https://www.ietf.org/archive/id/draft-portman-siprec-protocol-03.html)

CPaaS: [Twilio Media Streams](https://www.twilio.com/docs/voice/media-streams) · [Twilio TwiML Stream](https://www.twilio.com/docs/voice/twiml/stream) · [Twilio ConversationRelay](https://www.twilio.com/en-us/products/conversational-ai/conversationrelay) · [Twilio Rwanda voice pricing](https://www.twilio.com/en-us/voice/pricing/rw) · [Twilio voice coverage](https://www.twilio.com/en-us/voice/coverage) · [Telnyx media streaming](https://developers.telnyx.com/docs/voice/programmable-voice/media-streaming) · [Telnyx voice pricing](https://telnyx.com/pricing/voice-api) · [Plivo audio streaming](https://www.plivo.com/audio-streaming/) · [Vonage WebSocket voice](https://developer.vonage.com/en/voice/voice-api/concepts/websockets) · [SignalWire pricing](https://signalwire.com/pricing) · [Bandwidth media streaming](https://www.bandwidth.com/products/media-streaming/) · [Africa's Talking pricing](https://africastalking.com/pricing) · [Africa's Talking Voice](https://africastalking.com/voice)

Self-hosted: [jambonz overview](https://docs.jambonz.org/guides/get-started/jambonz-overview) · [jambonz about](https://jambonz.org/about) · [drachtio](https://drachtio.org/) · [mod_audio_stream](https://github.com/amigniter/mod_audio_stream) · [Kamailio vs OpenSIPS vs FreeSWITCH](https://telcobridges.com/learning/sip-trunking/kamailio-vs-opensips-vs-freeswitch/) · [Open-source SBC options](https://telcobridges.com/sbc/compare/open-source-sbc-options/) · [Asterisk AI voice agent (AudioSocket)](https://github.com/hkjarral/AVA-AI-Voice-Agent-for-Asterisk)

Rwanda regulatory and carriers: [RURA Regulation 013/R/EC-ICT/RURA/2021](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Regulatory_Instruments/ICT_Regulations_and_Guidelines/Regulation_Governing_Licensing_in_Electronic_Communication_in_Rwanda.pdf) · [RURA licensing portal](https://licensing.rura.rw/) · [Rwanda National Numbering Plan](https://www.rura.rw/fileadmin/user_upload/RURA/Documents/Sectors/ICT/Key_ICT_Documents/Rwanda_National_Numbering_Plan___1_.pdf) · [Rwanda short-code procedure, Nyaruka](https://blog.nyaruka.com/rwandas-new-short-code-registration-procedure) · [MTN Unicall](https://www.mtn.co.rw/mtn-unicall/) · [MTN Developer Portal](https://developers.mtn.com/products) · [MTN Chenosis, TechCentral](https://techcentral.co.za/mtn-chenosis-api-marketplace-developers/249493/) · [Airtel Africa Developer Portal](https://developers.airtel.africa/home)

Call forwarding: [Call forwarding, Wikipedia](https://en.wikipedia.org/wiki/Call_forwarding) · [GSM call-forwarding codes explained](https://www.ringowl.ai/help/what-does-21-mean)

WhatsApp calling: [WhatsApp Business Calling API, Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) · [Calling API launch announcement](https://whatsappbusiness.com/blog/whatsapp-business-calling-api/)

Geography: [Telecommunications in Rwanda](https://en.wikipedia.org/wiki/Telecommunications_in_Rwanda) · [RINEX](https://rinex.org.rw/about) · [Cloud latency in Africa, Chavula/UCT/AFPIF](https://www.afpif.org/wp-content/uploads/2022/09/2-Cloud-Latency-in-Africa-JosiahChavula-Kigali-August2022.pdf) · [2024 East Africa submarine cable outage report, Internet Society](https://www.internetsociety.org/resources/doc/2024/2024-east-africa-submarine-cable-outage-report/) · [Kigali data centres](https://www.datacentermap.com/rwanda/kigali/) · [AWS Africa (Cape Town)](https://aws.amazon.com/about-aws/whats-new/2020/04/announcing-aws-africa-cape-town-region)

---

*Next: [08 — Messaging Channels](08-messaging-channels.md)*
