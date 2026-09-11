# 06 — Voice AI & Machine Learning

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. What this layer must achieve

Ijwi (speech) and Ubwenge (reasoning) together must satisfy five requirements, in priority order. Every technical choice below is justified against one of them.

1. **Understand Kinyarwanda, English, French and Swahili spoken over an 8 kHz mobile telephone line**, with background noise, code-switching, and no opportunity to ask the speaker to repeat more than twice.
2. **Respond within a total turn latency of p50 ≤ 800 ms and p95 ≤ 1,200 ms**, measured from the caller's last syllable to the first syllable of the reply.
3. **Speak in a voice that a Rwandan customer accepts as natural**, in the language they used.
4. **Be self-hostable on commercially usable licences**, so that margin, data residency and independence are all achievable.
5. **Improve with use**, turning consented production audio into a Kinyarwanda asset that compounds.

---

## 2. The founder's premise, examined: VibeVoice

The project began from Microsoft's VibeVoice. That instinct deserves a careful answer, because it is half right in a way that matters.

### 2.1 What VibeVoice actually is

VibeVoice is a Microsoft Research text-to-speech family built on a continuous speech tokeniser operating at an unusually low **7.5 Hz** frame rate, paired with a next-token diffusion decoder. That architecture is what allows its headline capability: **up to 90 minutes of continuous, coherent, multi-speaker audio (up to four voices) generated in a single pass**. Model sizes include a 1.5 B and a 7 B TTS variant, a companion 7 B ASR model capable of transcribing 60 minutes in one pass, and a later, lighter **0.5 B "Realtime" variant** claiming streaming text input and roughly 300 ms first-audible latency. The licence is MIT.

### 2.2 Why it is the wrong engine for a live phone call

The design goal is **long-form coherence**, not **time-to-first-audio**. A very low frame-rate tokeniser and a diffusion decoder are excellent for generating a forty-minute synthetic podcast with consistent speakers; they are not what you want when the only number that matters is how many milliseconds pass before the caller hears a syllable. Microsoft's own materials describe it as not recommended for commercial or real-world applications without further testing — an explicit research-artifact framing.

There is also a supply-chain problem. The repository and model pages were taken down within days of release in September 2025, with Microsoft citing discovered misuse inconsistent with the stated research intent; enforcement was inconsistent across regions, and the models have since been preserved by community forks (`vibevoice-community/VibeVoice` and mirrors). As of September 2026 the official repository has been in flux. **Depending on VibeVoice in production today means depending on an unmaintained community fork of a model its creator withdrew.** For a company that will one day undergo technical due diligence, that is a real liability.

### 2.3 What the founder was right about

The instinct behind choosing VibeVoice — *that high-quality, self-hostable, voice-cloning speech synthesis has become available and free, and that this changes what a small company can build* — is exactly correct. That is the enabling condition described in [Document 01 §6](01-problem-analysis.md). The conclusion is not "VibeVoice is wrong, use ElevenLabs"; it is "the open streaming TTS ecosystem VibeVoice belongs to is now good enough, and there are members of it built for conversation."

### 2.4 Where VibeVoice keeps a role

**Offline generation**, where latency is irrelevant and long-form quality is an asset:
- Business IVR prompts, greetings and hold announcements rendered once and cached.
- Onboarding and help audio in Kinyarwanda for the Studio.
- Marketing and demo material.
- Potentially, generating synthetic training audio for data augmentation — with careful evaluation, since training on synthetic speech has known pitfalls.

Its licence (MIT) permits this. Its governance instability argues for treating any such use as replaceable.

---

## 3. Text-to-speech: the decision

### 3.1 Candidates assessed

| Model | Licence | Commercial use | TTFB | VRAM | Cloning | Languages | Verdict |
|---|---|---|---|---|---|---|---|
| **Orpheus TTS** (Canopy Labs) | **Apache 2.0** | ✅ | Streaming-native, low | ~8–12 GB | Zero-shot + emotion tags | Primarily English | **Primary candidate** — purpose-built for real-time conversational agents |
| **Chatterbox / Turbo** (Resemble AI) | **MIT** | ✅ | 75–200 ms (community benchmark); Turbo variant faster; streaming fork available | Moderate | Zero-shot from ~5 s reference | 23 | **Primary candidate** — reportedly beat ElevenLabs in blind preference tests (~63–65% win rate, vendor-cited); MIT is a major advantage |
| **Kokoro-82M** | **Apache 2.0** | ✅ | Very low; faster than real-time even on CPU | < 2 GB | ❌ fixed voice packs | ~8 | **Fallback tier** — cheapest, fastest, no cloning |
| **Piper** | **MIT** | ✅ | Sub-100 ms on CPU | Minimal | ❌ | Many, incl. some low-resource | **Edge/CPU fallback** — robotic but reliable, free, and CPU-only viable |
| **Qwen3-TTS** (2026) | **Apache 2.0** | ✅ | Streaming | 0.6 B / 1.7 B | Limited info | 10 | **Evaluate** — new permissive entrant |
| **VoxCPM2** (2026) | **Apache 2.0** | ✅ | CPU-capable | 2 B | Limited info | 30 | **Evaluate** — broad language count, 48 kHz native |
| **Zonos v0.1** | **Apache 2.0** | ✅ | ~2× real-time | ~6 GB | Zero-shot | 5 | Backup |
| **Sesame CSM (1B)** | Verify per checkpoint | ⚠️ | Real-time via community streaming wrappers | Moderate | Context-aware | Primarily EN | Evaluate only after licence verification |
| **VibeVoice** | MIT | ✅ but unmaintained | Long-form batch (0.5 B Realtime variant unproven) | Varies | Yes | Multi | **Offline use only** |
| **XTTS-v2** (Coqui) | **CPML — non-commercial** | ❌ | Moderate | ~2–4 GB | Zero-shot from 6 s | 17 | **Excluded** — Coqui shut down Jan 2024; no path to a commercial licence |
| **F5-TTS** (official weights) | **CC-BY-NC** | ❌ | ~1 s+ | Moderate | Zero-shot | Multiple | **Excluded** |
| **Fish Audio S2 Pro** | Research/non-commercial | ❌ | ~100 ms claimed | — | Zero-shot | 80+ | **Excluded** for the flagship checkpoint (older Fish Speech releases may differ — verify per release) |
| **Higgs Audio v3** (Boson AI, 4 B) | Research/non-commercial | ❌ | 617 ms mean at concurrency 1, RTF 0.147; streaming vocoder; ~16 concurrent on an H100 | — | Zero-shot cross-lingual | 100+ | **Excluded on licence** — architecturally ideal, legally unusable without an agreement |
| **StyleTTS2** | Mixed per checkpoint | ⚠️ | Not streaming-first | Moderate | Limited | Mostly EN | Not a fit for live turn-taking |

### 3.2 The licence point, stated bluntly

**Four of the highest-quality open TTS models cannot be used in a paid product.** XTTS-v2, F5-TTS's official weights, Fish Audio's flagship and Higgs Audio v3 are all research or non-commercial licensed. This is not a detail to be resolved later — building on one of them and discovering it at diligence is a company-ending mistake. **A licence audit is a mandatory gate before any model enters the production path, and it must be repeated for every checkpoint update, because licence terms change between releases.**

### 3.3 Decision

- **Production conversational TTS:** Orpheus (Apache 2.0) and Chatterbox (MIT), benchmarked head-to-head on Rwandan telephone-band audio; the winner becomes primary, the other stays as failover.
- **Fallback tier:** Kokoro for cheap capacity; Piper for CPU-only and degraded-mode operation.
- **Kinyarwanda:** see §5 — this is a separate problem from the English/French TTS decision, and the answer is likely a fine-tuned or partnered model rather than any of the above out of the box.
- **Offline generation:** VibeVoice, treated as replaceable.

---

## 4. Speech recognition: the decision

### 4.1 Candidates

| Model | Streaming | Reported WER (clean, wideband) | VRAM | Notes |
|---|---|---|---|---|
| **faster-whisper** (large-v2/v3, CTranslate2) | Pseudo-streaming via chunk+overlap wrappers (WhisperLive, `whisper_streaming`) | ~5–7%; large-v3 ~7.4% avg | large-v2 ≈ 4.5 GB | Most widely deployed self-hosted Whisper runtime; chunking adds ~1–2 s versus true streaming |
| **NVIDIA Parakeet TDT 0.6B v3** | **True streaming** (transducer) | 6.34% avg across 25 European languages (Granary, 670 k+ hrs) | ~4 GB | Native streaming architecture — strong low-latency candidate |
| **NVIDIA Canary-1B v2 / Canary-Qwen 2.5B** | Streaming-capable | Canary-Qwen 5.63% avg (Open ASR Leaderboard); 1.6% LibriSpeech clean | Moderate | Canary-1B v2 is CC-BY-4.0; deployable on-prem |
| **distil-whisper large-v3** | Chunked | Within ~1% of Whisper large-v3 | ~5 GB | English-only, ~6× faster |
| **whisper.cpp** | CPU/edge, quantised | Comparable at same model size | CPU viable | Good for cheap edge nodes |
| **Moonshine** | Streaming/edge-first | Not detailed | From 27 M params | Built for low-latency edge |
| **Kyutai STT (Mimi)** | **True full-duplex streaming** | Not detailed | Moderate | Purpose-built streaming architecture |
| **Meta MMS** | Batch | — | — | **1,100+ languages** — the most likely pretrained base for Kinyarwanda transfer learning |

### 4.2 The telephone-audio problem — the single biggest technical unknown

Every number in the table above is measured on **clean 16 kHz wideband audio**. Subiza's audio is **8 kHz narrowband (300–3,400 Hz), G.711-coded, from a mobile handset, often in a noisy environment**. The research found **no reliable published WER figure for any of these models on 8 kHz telephone audio.** That absence is itself the finding.

The general pattern in speech literature is that models trained predominantly on wideband web and podcast audio degrade meaningfully on narrowband codec'd telephone speech — informally cited as roughly a 1.5–3× relative WER increase without telephone-specific adaptation. Applied to Kinyarwanda, which is low-resource *before* this penalty, the compounding could be severe.

**Consequences for the plan:**
- **Phase 0 exists primarily to measure this.** Collect real Rwandan telephone audio, benchmark candidates, publish the number internally. No architectural commitment should precede that measurement.
- **Mitigations to evaluate:** bandwidth extension (learned 8 kHz → 16 kHz upsampling before ASR), telephone-domain fine-tuning, noise-robust front-ends, and — where speech recognition proves unreliable — constrained interaction modes (DTMF menus, keyword spotting) as a graceful fallback rather than a failed conversation.
- **Architecture must not assume ASR succeeds.** DTMF as a first-class input, a two-strike clarification policy, and escalation to a human are all consequences of this uncertainty.

### 4.3 Decision

Prefer **natively streaming transducer architectures** (Parakeet, Canary, Kyutai) over chunked-Whisper wrappers for the latency budget, with **faster-whisper as the accuracy and language-coverage baseline**, and select per language after benchmarking on real Rwandan audio. Expect the answer to differ by language: Whisper's multilingual coverage may win for Kinyarwanda while a streaming transducer wins for English.

---

## 5. Kinyarwanda — the core language programme

This is the moat. It is also the hardest work in the project, and it deserves to be treated as a product workstream with its own owner, roadmap and budget, not as an R&D experiment.

### 5.1 What already exists

| Resource | What it provides |
|---|---|
| **Mozilla Common Voice Kinyarwanda** | Historically one of the largest single-language corpora in the entire Common Voice project — a large-scale donation campaign around 2020 contributed on the order of 2,000+ hours at peak submission, though the validated/usable subset is smaller and the current 2026 figure was not confirmed |
| **Digital Umuganda** (Rwanda) | Kinyarwanda TTS dataset; Common Voice Kinyarwanda text dataset; and **`Kinyarwanda_YourTTS_v1`** — a working YourTTS-based Kinyarwanda voice-cloning TTS model already published |
| **Mbaza NLP** (Rwanda) | `kinyarwanda-tts-model`; Kinyarwanda–English parallel dataset; Common Voice Kinyarwanda–English dataset; `fleurs-kinyarwanda`; `kinyarwanda_monolingual_v01.0` (78,733 documents, ~25 M words — for LLM adaptation, not ASR) |
| **Meta MMS** | ASR, TTS and language-ID across 1,100+ languages; the most plausible pretrained base for Kinyarwanda transfer learning, ahead of Whisper's ~99-language coverage |
| **NVIDIA** | Published work on building a Kinyarwanda ASR model (NeMo/Conformer-based) — worth reading directly |
| **Intron Health (Sahara v2.5)** | Commercial: STT in 63 languages, TTS in 13, **including a trilingual English–Kinyarwanda–French model** |
| **Proto** | Commercial: Kinyarwanda voice AI already deployed in Rwandan government and central-bank systems |

**The starting point is not zero.** It is also not sufficient — none of the above is a production-quality Kinyarwanda conversational ASR on telephone-band audio, because nobody has had access to that audio.

### 5.2 What is missing, and why it is defensible

The gap is **domain**, not language. Existing Kinyarwanda corpora are read speech, recorded on phones and laptops in reasonable conditions, at 16 kHz. What Subiza needs is **spontaneous, conversational, code-switched Kinyarwanda, spoken to a machine, over an 8 kHz mobile line, about commercial transactions.**

That data does not exist anywhere. It can only be created by operating the service. This is the compounding asset: every consented call makes the model better, and no competitor can obtain equivalent data without also operating in Rwanda at scale. **This is the moat, stated precisely.**

### 5.3 A cautionary data point

A published study fine-tuned Whisper-small on **256 Common Voice samples per language** and obtained **33.42% WER for Kinyarwanda** (versus 26.37% for Swahili), noting that training "did not significantly change the initial WER." The lesson is not that fine-tuning does not work — it is that 256 samples is nowhere near enough, and that naive small-scale fine-tuning produces a misleadingly discouraging result.

**Realistic requirement (industry rule of thumb, not a Kinyarwanda-specific measurement): 50–200 hours of clean transcribed speech** to bring a multilingual pretrained model to usable accuracy for a low-resource language, with diminishing returns beyond a few hundred hours. Given that Digital Umuganda and Mbaza NLP have already assembled substantial corpora, the practical path is partnership plus domain adaptation, not collection from scratch.

### 5.4 The Kinyarwanda roadmap

| Stage | Work | Output |
|---|---|---|
| **K0 — Measure** (Phase 0) | Collect 20–50 real consented Rwandan customer-service calls; downsample and codec-match to production conditions; benchmark Whisper large-v3, Parakeet, Canary, MMS and any published Kinyarwanda fine-tune | A single honest number: baseline Kinyarwanda WER on telephone audio. Everything else depends on it |
| **K1 — Partner** (Phase 0–1) | Engage Digital Umuganda and Mbaza NLP; evaluate Intron Health's trilingual model as a supplier | Access to existing corpora and models; a reciprocal data relationship |
| **K2 — Adapt** (Phase 1–2) | Fine-tune the best base on combined public corpora plus telephone-domain augmentation (codec simulation, noise injection, bandwidth reduction) | A Kinyarwanda ASR meaningfully better than any public baseline on telephone audio |
| **K3 — Collect** (continuous from Phase 1) | Consented production audio pipeline: opt-in, anonymisation, human transcription and QA loop, versioned corpus | A proprietary, growing, telephone-domain Kinyarwanda corpus |
| **K4 — Voice** (Phase 2–3) | Kinyarwanda TTS: start from Digital Umuganda's YourTTS model or fine-tune a streaming model on Kinyarwanda; recruit and properly compensate consenting voice talent | Kinyarwanda voices customers rate as natural |
| **K5 — Code-switching** (Phase 3) | Handle Kinyarwanda–English–French mixing within a single utterance, which is how people actually speak in Kigali | Language handling that matches reality rather than a language-selection menu |
| **K6 — Understanding** (Phase 3–4) | Kinyarwanda-adapted reasoning: intent classification and domain vocabulary; Mbaza's 25 M-word monolingual corpus is the obvious base | Reduced reliance on translation round-trips |

### 5.5 The ethics of the language programme

Kinyarwanda language data is a **national resource**, largely assembled through volunteer contribution to Common Voice and through mission-driven organisations. A company that extracts from that ecosystem without contributing back will — correctly — face resistance from exactly the partners it needs.

Commitments that should be made explicitly and early:
- Contribute a meaningful portion of anonymised, consented telephone-domain data back to the open ecosystem.
- Pay voice talent properly and obtain durable, revocable, documented consent.
- Publish Kinyarwanda evaluation benchmarks openly, even where the models stay proprietary.
- Never claim ownership of the public corpora the work is built on.

### 5.6 Other languages

| Language | Status | Approach |
|---|---|---|
| **English** | Excellent baseline support | Off-the-shelf, benchmarked on African-accented English — a known weak spot across all major ASR systems with no reliable published benchmark |
| **French** | Excellent baseline support | Off-the-shelf; Rwanda has French as an official language |
| **Swahili** | Meaningfully better resourced than Kinyarwanda (~200 M speakers); larger Common Voice corpus, MMS and FLEURS coverage, community fine-tunes | Fine-tune for telephone domain; the key language for Kenya/Tanzania expansion |
| **Luganda, Amharic, Yoruba, Hausa, Twi** | Not needed until expansion | Each is its own K0–K4 programme; this is the expansion cost and the reason expansion is slower than it looks |

---

## 6. Architecture: cascaded versus end-to-end

| | Cascaded (ASR → LLM → TTS) | End-to-end speech-to-speech |
|---|---|---|
| **Latency** | Three sequential hops; ~600–900 ms achievable well-optimised | Lower; sub-500 ms possible (Moshi-class) |
| **Control** | Every intermediate step inspectable, loggable, filterable | Opaque; hard to guardrail without a text intermediate |
| **Tool calling** | Mature | Weaker |
| **Grounding / RAG** | Clean insertion at the text layer | Awkward |
| **Component swapping** | Each component independently replaceable | All-or-nothing |
| **Self-hosting maturity** | Rich ecosystem | Thin — mainly Moshi and Ultravox |
| **Language flexibility** | Each component chosen per language | Constrained by one model's coverage |
| **Auditability** | Full transcript of what was heard and said | Partial |

**Decision: cascaded, for the foreseeable future.** The determining factors are grounding, auditability and per-language component choice — all three are non-negotiable for this product. Grounding is principle P2; auditability is a regulatory requirement under Rwandan data-protection law; and per-language component choice is the only way to serve Kinyarwanda well while serving English cheaply.

**Watch item:** end-to-end speech-to-speech (Moshi, Ultravox, and managed OpenAI Realtime / Gemini Live) should be re-evaluated annually. If a self-hostable end-to-end model acquires reliable tool calling and Kinyarwanda capability, the latency advantage becomes compelling. The pluggable architecture (A1) means this would be a component swap, not a rewrite.

---

## 7. The latency budget

### 7.1 What humans expect

Cross-linguistic conversation-analysis research places the modal human-to-human response gap at roughly **200 ms**. Industry convergence on perceptual thresholds for voice AI:

| Total turn latency | Perceived as |
|---|---|
| < 500 ms | Conversational — not consciously noticed |
| 500–800 ms | Acceptable — a minor pause |
| 800 ms – 1.5 s | Slow — the caller begins to doubt |
| > 1.5 s | Broken — the caller repeats themselves or hangs up |

### 7.2 The budget, decomposed

| Stage | Typical | Subiza target | Notes |
|---|---:|---:|---|
| PSTN / SIP trunk / carrier leg | 30–100 ms | ≤ 80 ms | Largely outside our control; provider and geography determine it |
| Network hop to inference | — | ≤ 60 ms | **Determined by hosting geography — the decision in [Doc 05 §12](05-system-architecture.md)** |
| Turn detection (endpointing) | 150–300 ms | **≤ 120 ms** | **The single largest controllable line item.** Silence-threshold VAD costs 150–300 ms; semantic turn-detection models cut this substantially |
| Streaming ASR final transcript | 100–300 ms | ≤ 150 ms | Native streaming architectures beat chunked Whisper here |
| Retrieval | 200–300 ms | **≈ 0 added** | Run in parallel, started on a stable partial transcript — hidden, not added |
| LLM time-to-first-token | 150–400 ms | ≤ 250 ms | Quantised 7–14B on vLLM/SGLang with prefix caching |
| TTS time-to-first-audio | 100–200 ms | ≤ 120 ms | Streaming-native model, synthesis begun at the first sentence boundary |
| Jitter buffer / playout | 20–60 ms | ≤ 40 ms | Trade-off against audio quality |
| **Total (p50)** | **600–900 ms** | **≤ 800 ms** | |
| **Total (p95)** | | **≤ 1,200 ms** | |

### 7.3 The optimisations that actually matter

Ranked by milliseconds saved per unit of engineering effort:

1. **Semantic turn detection instead of silence thresholds** — potentially 100–180 ms, the largest single win. Silence-based VAD both adds delay and produces false interruptions on the natural pauses common in Kinyarwanda speech patterns.
2. **Parallel retrieval on partial transcripts** — hides 200–300 ms entirely.
3. **Streaming TTS from the first sentence boundary** — halves perceived latency on a two-sentence answer.
4. **Prefix caching in the LLM server** — the tenant persona, policy and tool schema are identical every turn.
5. **Fast-path answers with no model call at all** — roughly 30% of turns served in tens of milliseconds.
6. **Geographic placement of inference** — potentially 100+ ms, but it is an infrastructure cost decision, not an engineering one.
7. **Conversational filler during retrieval** — does not reduce latency but changes its perception. Used sparingly; overused it is grating.

### 7.4 Measurement discipline

Every stage timestamped on every call. Reported at p50, p95 and p99, sliced by language, tenant, channel and network. **A p50 that meets target while p95 is at 2.5 seconds means one call in twenty is failing, which the average conceals.** Latency regressions are treated as production incidents.

---

## 8. The reasoning layer

### 8.1 Model selection

| Family | Licence | Fit |
|---|---|---|
| **Qwen 3.5** (Alibaba) | Apache 2.0 | Wide size range, strong tool calling, broad multilingual training — **strong default given the fully permissive licence** |
| **Llama 4** (Scout/Maverick, MoE, ~17 B active) | Meta custom licence | Competitive quality; MoE keeps active-parameter cost down; licence has usage-scale conditions to review |
| **Mistral 3 / Medium 3.5** | Apache 2.0 for smaller releases; custom for larger | Good function calling, efficient |
| **Gemma** | Google custom licence | Efficient small models, permissive-leaning but not Apache/MIT |

**Sizing:** a conversational reply is typically 30–80 tokens, so **time-to-first-token dominates, not throughput**. A quantised 7–14 B dense or small-MoE model (FP8 on H100/L40S, AWQ/GPTQ 4-bit on 24 GB cards) served with continuous batching achieves TTFT in the 150–400 ms range comfortably.

**Serving:** vLLM as the default (PagedAttention, continuous batching); **SGLang preferred where prefix caching matters**, which it does here because the system prompt is repeated every turn; TensorRT-LLM once volume justifies the operational complexity.

### 8.2 Grounding and hallucination control

The concrete architecture, restating [Document 05 §7.2](05-system-architecture.md) with the ML rationale:

- **Chunks of 200–400 tokens**, smaller than typical text RAG, because spoken answers are short and prompt budget is latency.
- **Hybrid retrieval** — dense vector plus BM25, reranked to top 3. BM25 matters more here than in general RAG because product names, SKUs and prices are exact-match objects.
- **A hard relevance-score refusal threshold** (in the region of 0.4–0.5, tuned empirically). Below it, the agent escalates rather than generates. This single mechanism prevents the majority of hallucination incidents.
- **Structured fields for high-consequence facts.** Prices, hours and availability are read from typed fields, never generated. A generated price is a commercial and legal problem, not a quality problem.
- **Per-claim internal citation**, enabling the Studio's "why did it say that?" trace.
- **Continuous evaluation** across groundedness, context relevance, chunk attribution and chunk utilisation, to catch drift in production rather than in a quarterly review.

### 8.3 Keeping responses short

Long spoken answers are the most common failure of naive voice agents: they are unpleasant, they are expensive (TTS cost scales with characters), and they invite interruption. Controls:
- Explicit output-length constraints in the system policy.
- Pre-written canned answers for the highest-frequency intents.
- Post-generation truncation at a sentence boundary with an offer to continue ("Do you want the details?").
- Evaluation that treats verbosity as a defect, not a neutral property.

---

## 9. Evaluation

Nothing here improves without measurement, and the measurements must be specific to this domain.

### 9.1 Speech evaluation

| Metric | How measured |
|---|---|
| **WER by language on telephone audio** | A held-out set of real, consented, human-transcribed Rwandan calls — the single most important internal dataset |
| **WER by condition** | Noise, network quality, handset type, speaker age and gender |
| **Code-switch handling** | A dedicated subset of mixed-language utterances |
| **Turn-detection accuracy** | False interruptions per hour; missed end-of-turn delay |
| **TTS naturalness** | Human preference tests with Rwandan listeners — **not** a proxy metric. Mean opinion scoring against alternatives, per language |
| **Intelligibility over 8 kHz** | Whether synthesised speech survives the codec, which is not the same as sounding good in a studio |

### 9.2 Conversation evaluation

| Metric | How measured |
|---|---|
| **Task success** | Did the caller get what they wanted — human-rated on a sample |
| **Containment** | Resolved without escalation |
| **Groundedness** | Every claim traceable to a source |
| **Hallucination incidents** | Zero tolerance; each investigated as a defect |
| **Appropriate escalation** | Escalated when it should have; did not escalate when it should not have |
| **Latency distribution** | p50 / p95 / p99 per stage |

### 9.3 A regression suite that reflects reality

A held-out set of real (consented, anonymised) conversations replayed against every model, prompt and configuration change. Adding synthetic test cases is useful; relying on them is how a system passes all its tests and fails every real call. **A change that improves an offline benchmark but regresses the replay suite does not ship.**

---

## 10. Hardware and capacity

### 10.1 Reference prices (2026, RunPod as representative baseline)

| GPU | VRAM | ≈ \$/hr |
|---|---:|---:|
| H100 SXM | 80 GB | 3.29 |
| H100 PCIe | 80 GB | 2.89 |
| A100 SXM | 80 GB | 1.59 |
| A100 PCIe | 80 GB | 1.39 |
| L40S | 48 GB | 0.99 |
| RTX 6000 Ada | 48 GB | 0.84 |
| RTX 4090 | 24 GB | 0.74 |
| L4 | 24 GB | 0.49 |
| RTX 3090 | 24 GB | 0.50 |
| A40 | 48 GB | 0.44 |

Other providers (Lambda, CoreWeave, Vast.ai, and African providers) range similarly, with H100 quoted as low as ~\$1.49–2.01/hr on discounted or spot tiers.

### 10.2 Component footprints

- faster-whisper large-v2 ASR: **~4.5 GB VRAM**
- Kokoro TTS: **~2 GB VRAM**
- ASR + TTS together fit comfortably on a **single 24 GB GPU**
- A 7–30 B self-hosted LLM needs **48 GB or 80 GB-class hardware**, or multiple cards

### 10.3 The concurrency question — unresolved and important

**No reliable published figure exists for "concurrent voice conversations per GPU"** for any of these components. Every source consulted said the same thing: it must be benchmarked against the specific model, quantisation, context length and latency target. A commonly cited practitioner range for a 48 GB card running an optimised full pipeline is **8–15 concurrent real-time sessions**, but this is an estimate, not a measurement.

**Consequence:** capacity planning and therefore the entire unit-economics model rest on a number nobody has measured for this configuration. **Benchmarking concurrency is a Phase 1 deliverable and a precondition for any hardware purchase commitment.**

### 10.4 Break-even

Using verified component prices: a 24 GB GPU at roughly \$540/month running continuously breaks even against an ElevenLabs-class \$0.08/min managed TTS at about **6,750 call-minutes/month** on hardware cost alone. Adding realistic engineering overhead of roughly \$4,000–5,000/month pushes the true break-even to the region of **40,000–57,000 minutes/month**, depending on which managed stack is the comparison.

**Recommended policy:** stay on managed APIs until roughly **30,000–50,000 voice minutes/month**, then self-host in this order — **TTS first** (biggest cost per minute, lowest engineering risk), **ASR second**, **LLM last**. Full model in [Document 11](11-business-model-and-economics.md).

### 10.5 Hosting geography

No hyperscaler region exists in East Africa. Options: South African cloud regions (Cape Town, Johannesburg — roughly 3,000 km from Kigali); African GPU providers, including Nigerian capacity offering sub-\$1/hour rentals and the Cassava/NVIDIA AI-factory rollout beginning in South Africa; Kigali colocation (PAIX Kigali, TrAC) with no known public GPU capacity; or European regions with a substantial latency penalty. **Rwanda-specific GPU availability, pricing and latency were not established in research and must be investigated directly** — via RISA, local ISPs, and Cassava's expansion roadmap.

---

## 11. The data flywheel

```
   More businesses ──► more calls ──► more consented Kinyarwanda
        ▲                                telephone audio
        │                                      │
        │                                      ▼
   Better product ◄── better Kinyarwanda ◄── better models
   cheaper to run       recognition &          (fine-tuned on
                        synthesis              domain data)
```

This is the mechanism by which Subiza gets harder to compete with over time rather than easier. It requires three things to be built correctly from the first call, not retrofitted:

1. **Consent captured properly**, per data subject, revocable, with the artefact stored — because data collected without valid consent is legally unusable and morally indefensible.
2. **A transcription and QA loop** with Kinyarwanda-speaking annotators — human-in-the-loop quality review is a permanent cost line, not a temporary one.
3. **Corpus versioning and lineage**, so a model can always be traced to the data it was trained on, and so a withdrawal of consent can propagate.

---

## Sources

VibeVoice: [microsoft/VibeVoice](https://github.com/microsoft/VibeVoice) · [VibeVoice project page](https://microsoft.github.io/VibeVoice/) · [VibeVoice technical report (arXiv)](https://arxiv.org/pdf/2508.19205) · [community fork](https://github.com/vibevoice-community/VibeVoice) · [takedown discussion](https://huggingface.co/microsoft/VibeVoice-1.5B/discussions/30)

TTS: [Orpheus-TTS](https://github.com/canopyai/Orpheus-TTS) · [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) · [Chatterbox, Resemble AI](https://www.resemble.ai/learn/models/chatterbox) · [Chatterbox streaming fork](https://github.com/davidbrowne17/chatterbox-streaming) · [XTTS-v2 CPML licence analysis](https://www.promptquorum.com/power-local-llm/local-tts-voice-cloning-piper-coqui-xtts) · [Higgs Audio v3 on SGLang, LMSYS](https://www.lmsys.org/blog/2026-06-04-higgs-audio-v3-tts/) · [Open self-hosted TTS survey 2026](https://pinggy.io/blog/best_open_source_self_hosted_text_to_speech_models/)

ASR: [faster-whisper](https://github.com/SYSTRAN/faster-whisper) · [Open-source STT benchmarks 2026, Northflank](https://northflank.com/blog/best-open-source-speech-to-text-stt-model-in-2026-benchmarks) · [NVIDIA Parakeet / Canary](https://perspectives.nvidia.com/nemotron-speech/task/faq/what-are-the-most-production-ready-open-speech-recognition-models-for-european-l/) · [Kyutai STT](https://kyutai.org/stt/) · [Meta MMS](https://ai.meta.com/blog/multilingual-model-speech-recognition/) · [Scaling speech technology to 1,000+ languages (arXiv)](https://arxiv.org/abs/2305.13516)

Kinyarwanda: [Digital Umuganda](https://huggingface.co/DigitalUmuganda) · [Kinyarwanda YourTTS v1](https://huggingface.co/DigitalUmuganda/Kinyarwanda_YourTTS_v1) · [mbazaNLP](https://huggingface.co/mbazaNLP) · [Kinyarwanda monolingual corpus](https://huggingface.co/datasets/mbazaNLP/kinyarwanda_monolingual_v01.0) · [Fine-tuning Whisper for Kinyarwanda](https://www.researchgate.net/publication/390941288_Fine-Tuning_Whisper_for_Kinyarwanda_A_Practical_Approach_to_Low-Resource_ASR_Development) · [Edge speech for Kinyarwanda and Swahili (arXiv)](https://arxiv.org/html/2510.16497v1) · [NVIDIA Kinyarwanda ASR](https://developer.nvidia.com/blog/building-an-automatic-speech-recognition-model-for-the-kinyarwanda-language/) · [Proto Kinyarwanda voice agents](https://www.proto.cx/resource/muraho-proto-voice-ai-agents-now-speak-kinyarwanda)

Orchestration and latency: [Voice agent frameworks, Soniox](https://soniox.com/wiki/voice-agent-frameworks) · [LiveKit turn detection](https://livekit.com/blog/turn-detection-voice-agents-vad-endpointing-model-based-detection) · [Silero VAD in LiveKit](https://docs.livekit.io/agents/logic/turns/vad/) · [VAD comparison, Picovoice](https://picovoice.ai/blog/best-voice-activity-detection-vad/) · [Latency budgets for real-time voice](https://thepromptbench.com/voice-and-realtime/latency-budgets-for-realtime-voice/) · [Moshi, Kyutai](https://github.com/kyutai-labs/moshi)

LLM and RAG: [Best LLM for voice agents 2026, Coval](https://www.coval.ai/blog/voice-ai-models-2026/) · [RAG-powered voice agents, FutureAGI](https://futureagi.com/blog/how-to-build-rag-powered-voice-ai-agents-2026/)

Economics: [RunPod pricing](https://www.runpod.io/pricing) · [Self-hosted voice agent stack cost analysis](https://www.layer3labs.io/guides/self-hosted-voice-agent-stack) · [Cassava/NVIDIA AI factories](https://www.cassavatechnologies.com/cassava-scales-african-ai-infrastructure-with-nvidia-powered-ai-factories-to-accelerate-sovereign-data-capabilities/) · [AI infrastructure in Nigeria, Techpoint](https://techpoint.africa/guide/ai-infrastructure-in-nigeria-gpu-gap/)

---

*Next: [07 — Telephony & Networking](07-telephony-and-networking.md)*
