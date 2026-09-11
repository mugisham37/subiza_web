# 10 — Infrastructure, DevOps & SRE

*Part of the [Subiza Project Documentation](../README.md)*

---

## 1. Why this layer is unusually demanding here

Most SaaS products can absorb a two-second delay, a failed request, or a five-minute outage. A live phone call cannot. If Subiza is slow, the caller hangs up. If Subiza is down, a business's customers hear silence on a number the business has published for years.

Three properties make this operationally harder than typical SaaS:

1. **Hard real-time.** A p95 latency regression is not a performance issue; it is an outage in user terms.
2. **Stateful, non-resumable sessions.** A dropped web request retries. A dropped phone call is gone, and the customer is annoyed.
3. **A regulated data plane.** Personal data must stay in Rwanda; breaches must be reported within 48 hours; recordings carry criminal-liability exposure if mishandled.

Everything below follows from those three.

---

## 2. Environments

| Environment | Purpose | Data |
|---|---|---|
| **Local** | Development. Media path simulated by replaying recorded audio through the pipeline rather than making real calls | Synthetic only |
| **Development** | Shared integration. Real CPaaS sandbox numbers | Synthetic + a small consented test set |
| **Staging** | Production-identical, including region placement and model versions. Real phone numbers, internal use only | Anonymised copies; never live customer data |
| **Production** | Live | Real, Rwanda-resident |
| **Model lab** | GPU environment for fine-tuning and evaluation, isolated from production | The consented Kinyarwanda corpus, separately access-controlled |

**Rule: staging must have the same geographic placement as production.** A pipeline that meets its latency budget in a European staging environment and misses it from Kigali has not been tested.

---

## 3. Infrastructure as code and reproducibility

Everything that can be declared is declared: networks, compute, storage, model deployments, telephony provider configuration, DNS, secrets references, alerting rules, retention policies.

Three requirements specific to this system:

- **Provider configuration is versioned.** Which CPaaS handles which tenant's numbers, and the failover order, is configuration, not tribal knowledge. When a provider is swapped, the change is reviewable and revertible.
- **Model deployments are versioned artefacts** with recorded lineage: which model, which quantisation, which prompt version, which knowledge index version. When quality changes, the cause must be identifiable within minutes.
- **Data residency is a declared property of every resource**, and a deployment that would place personal data outside Rwanda without a recorded authorisation reference **fails the pipeline**. Compliance enforced by tooling, not by memory.

---

## 4. Deployment topology by phase

### 4.1 Phase 0–1 — learn fast, stay simple

- Application and data in a single Rwanda-resident environment.
- Media path entirely via CPaaS; no self-managed telephony.
- Inference via managed APIs under explicit NCSA authorisation, or Rwanda-resident where feasible.
- One environment, manual promotion, aggressive instrumentation.

The goal is measurement, not resilience. Over-engineering here delays the answers that determine the architecture.

### 4.2 Phase 2–3 — separate the planes

```
  ┌──────────── RWANDA-RESIDENT DATA PLANE ────────────┐
  │  Studio · API · session actors · Postgres ·        │
  │  vector store · object store · event log          │
  └────────────────────┬───────────────────────────────┘
                       │ private, low-latency link
  ┌────────────────────▼───────────────────────────────┐
  │  INFERENCE PLANE (nearest viable GPU capacity)     │
  │  ASR · LLM · TTS  — autoscaled, stateless          │
  └────────────────────┬───────────────────────────────┘
                       │ failover
  ┌────────────────────▼───────────────────────────────┐
  │  MANAGED API FALLBACK (authorised transfers only)  │
  └────────────────────────────────────────────────────┘
```

The inference plane is **stateless by design**. It receives audio or text and returns audio or text; it stores nothing. This is what makes it geographically relocatable — and it is also the property that makes the Article 50 conversation tractable, because "processing in transit without retention" is a materially easier authorisation case than "storage abroad."

### 4.3 Phase 4 — edge

Media edge colocated in Kigali (PAIX or TrAC), direct SIP interconnect, inference as close as the market allows, data plane unchanged.

---

## 5. Scaling and capacity

### 5.1 What scales how

| Component | Scaling property | Constraint |
|---|---|---|
| Studio / API | Stateless, horizontal | Trivial |
| Session actors | One per live conversation, cheap, memory-bound | Placement matters — a session actor must be close to its media path |
| Media servers | Horizontal behind a SIP proxy layer | Bandwidth and file descriptors; enormous headroom |
| **ASR / LLM / TTS** | **GPU-bound** | **The real constraint on the whole system** |
| Postgres | Vertical first, then read replicas and partitioning | Standard |
| Vector store | Per-tenant namespaces, horizontally partitionable | Standard |
| Event log | Append-only, partitioned by time | Standard |

### 5.2 The capacity number nobody has

As established in [Document 06 §10.3](06-voice-ai-and-ml.md), **there is no reliable published figure for concurrent voice conversations per GPU** for this configuration. A commonly cited practitioner range for an optimised pipeline on a 48 GB card is 8–15 concurrent sessions, but that is an estimate.

**Operational consequence:** capacity planning must be **empirical from the start**. A load-testing harness that drives synthetic concurrent calls through the real pipeline and measures the latency distribution as concurrency rises is a Phase 1 deliverable, not a Phase 3 nicety. Every hardware commitment references its output.

### 5.3 Autoscaling in a real-time system

Standard autoscaling is too slow for voice: by the time a scale-up completes, the calls that triggered it have ended badly.

- **Provision to peak, not to average.** Call volume is highly predictable — Saturday mornings, month-end, market days. Schedule capacity against known patterns.
- **Warm pools.** Model loading takes tens of seconds to minutes; a cold GPU cannot serve a call that is ringing now.
- **Admission control.** When capacity is genuinely exhausted, the correct behaviour is to route new calls to a degraded but functional path (fast-path answers plus message-taking, or straight to the business's own line) rather than to accept calls the system cannot serve. **A call answered badly is worse than a call not intercepted.**
- **Per-tenant concurrency limits** prevent one tenant's traffic spike from degrading everyone.

---

## 6. Observability

### 6.1 The three views, correlated by call ID

**Telephony health** — MOS (algorithmically estimated), jitter, packet loss, one-way delay, call setup success rate, codec in use, DTMF events. Derived from RTCP and media-server statistics; SIP capture tooling (Homer/HEPIC class) for call-flow debugging.

**AI health** — the latency budget decomposed per stage per turn: time-to-partial-transcript, turn-detection delay, retrieval time, LLM time-to-first-token, TTS time-to-first-audio, total turn latency. Reported at p50/p95/p99, sliced by language, tenant, channel and network. Plus quality: containment rate, escalation rate, refusal rate, understanding-failure rate, ASR confidence distribution.

**Business health** — conversations per tenant, missed-calls-recovered, cost per conversation, margin per tenant, credit balance and burn rate.

### 6.2 The per-call trace

Every conversation produces a trace showing, per turn: audio received, partial and final transcripts, detected language, retrieval query and results with scores, the decision taken, the generated text, the synthesised audio, and a timestamp at every stage boundary.

This single artefact serves four purposes — engineering debugging, the owner's "why did it say that?" explanation in Studio, the quality-review dataset, and the regulatory audit trail. Building it once and well is one of the highest-leverage decisions available.

### 6.3 Alerting that reflects the product

| Alert | Threshold | Severity |
|---|---|---|
| Turn latency p95 above budget for 5 minutes | > 1,200 ms | **Page** |
| Call answer rate drop | < 98% over 10 minutes | **Page** |
| Any tenant's calls failing to connect | any | **Page** |
| ASR confidence collapse for a language | 2σ below baseline | **Page** — usually indicates a model or audio-path regression |
| Escalation target unreachable repeatedly | 3 consecutive | Page |
| Hallucination report from a tenant | any | Page — zero-tolerance class |
| GPU capacity above 80% | sustained | Ticket |
| Cost per conversation above target | daily | Ticket |
| Model licence audit due | quarterly | Ticket |
| WhatsApp quality rating degraded for a tenant | any | Ticket + notify tenant |

**Deliberately absent: alerts nobody acts on.** An alert that fires and is ignored trains the team to ignore alerts.

---

## 7. Incident response

### 7.1 Severity

| Level | Definition | Response |
|---|---|---|
| **SEV1** | Calls not being answered, or answered incorrectly at scale; data breach suspected | Immediate page, incident commander, tenant communication within 1 hour |
| **SEV2** | Latency budget breached; one channel down; one tenant materially affected | Page during hours, ticket out of hours |
| **SEV3** | Degraded quality; non-urgent tenant issue | Ticket |

### 7.2 The 48-hour clock

Rwandan law requires NCSA notification **within 48 hours** of becoming aware of a personal-data breach, and a full report within 72 ([Doc 09 §2.6](09-legal-regulatory-ethics.md)). That is short enough that the process must exist before it is needed:

- A named **data-protection owner** with a named deputy.
- A **detection capability** — unusual access to recordings, unexpected data egress, authentication anomalies.
- A **rehearsed runbook** with a pre-drafted notification template and the NCSA contact route confirmed in advance.
- A **decision record** of what was known when, because the 48 hours runs from awareness and awareness must be evidenced.
- **Rehearsal at least annually**, treated as a real exercise rather than a document review.

### 7.3 Blameless postmortems

Every SEV1 and SEV2 produces a written postmortem with a timeline, contributing causes, and actions with owners and dates. Actions are tracked to completion. The failure mode to avoid is a postmortem culture that produces documents instead of changes.

---

## 8. Reliability engineering

### 8.1 Service level objectives

| SLO | Target | Why this number |
|---|---|---|
| Call answer rate | 99.5% | Below this, the product is worse than the ringing phone it replaced |
| Turn latency p95 | ≤ 1,200 ms | Above ~1.5 s the conversation fails socially ([Doc 06 §7](06-voice-ai-and-ml.md)) |
| Message response time p95 | ≤ 10 s | Chat tolerance is far higher than voice |
| Studio availability | 99.5% | The owner can wait; the caller cannot |
| Data durability | No loss of conversations or recordings | Regulatory and trust |
| Escalation delivery | 100% | Every escalation reaches a human or becomes a logged message with a promised callback |

**Note the asymmetry:** the conversation path has a far stricter SLO than the console. This should drive where reliability effort goes.

### 8.2 Failure domains and degradation

Restating [Document 05 §15](05-system-architecture.md) as an operational commitment, because it is the most important reliability property of the system:

| Failure | Degradation |
|---|---|
| Self-hosted ASR down | Managed ASR fallback → DTMF menu → message-taking |
| Self-hosted TTS down | Fallback voice (a different voice beats silence) |
| LLM down or slow | Fast-path answers only; escalate everything else |
| Retrieval down | Refuse and escalate; never generate ungrounded |
| Integration down | Capture intent, promise human confirmation, notify owner |
| Escalation target unreachable | Message-and-promise with a specific callback window |
| Media stream drops | Reconnect; if impossible, log incomplete and notify the owner immediately |
| **Whole platform down** | **Calls fail back to the business's own line** |

That last row is the single most important operational commitment: **Subiza must never make a business less reachable than it was before.** In practice this means the forwarding configuration and the failover design must be jointly engineered so that a total platform failure returns the business to its pre-Subiza state rather than to a dead line.

### 8.3 Backups and recovery

Continuous database backups with point-in-time recovery; versioned object storage with lifecycle rules aligned to the retention policy; the event log as an independently replayable source of truth; and — critically — **restore rehearsals, not just backup jobs**. An untested backup is an assumption.

Recovery targets: RPO under 5 minutes for conversation data, RTO under 1 hour for the conversation path and under 4 hours for Studio.

---

## 9. Cost engineering

Margin in this business is engineered continuously or lost quietly. Cost is therefore treated as an SRE concern with its own instrumentation.

### 9.1 Per-conversation cost accounting

Every conversation accrues a cost record: telephony minutes, ASR seconds, LLM tokens in and out, TTS characters, storage, and an allocated share of fixed infrastructure. This is aggregated per tenant and per plan, continuously.

**Without this, margin is discovered at the end of the month instead of managed during it.** It also makes possible the per-tenant profitability view that drives pricing changes and the identification of pathological usage.

### 9.2 The optimisation ladder

Ordered by return on effort:

1. **Telephony provider choice** — a 16× difference between Twilio Rwanda and Africa's Talking. Nothing else comes close.
2. **Fast-path answers** — roughly 30% of turns served with no model call at all.
3. **Response length discipline** — TTS cost scales with characters; shorter answers are cheaper *and* better.
4. **Prefix caching** in the LLM server — the tenant persona is identical every turn.
5. **Model right-sizing** — a 7B model that answers correctly beats a 70B model that answers identically at ten times the cost.
6. **Self-hosting, in order: TTS → ASR → LLM** — TTS first because it has the highest managed cost per minute and the lowest engineering risk.
7. **Spot and reserved GPU capacity** — with the caveat that spot preemption is unacceptable for live calls; use spot for the model lab and batch work, reserved for production.
8. **Recording retention policy** — storage is cheap until it is not, and shorter retention also reduces regulatory surface.

### 9.3 The self-hosting decision gate

From [Document 06 §10.4](06-voice-ai-and-ml.md) and [Document 11](11-business-model-and-economics.md): stay on managed APIs until roughly **30,000–50,000 voice minutes per month**, then migrate component by component. Each migration is gated on:

- A measured concurrency benchmark for that component.
- A demonstrated latency improvement or parity.
- A quality benchmark showing no regression on the replay suite.
- An operational readiness review — who gets paged when the GPU node dies at 2am?

**Do not self-host to feel sophisticated. Self-host when the arithmetic and the law both say so.**

---

## 10. Security operations

| Area | Practice |
|---|---|
| **Access control** | Least privilege; production access requires justification and is logged; no shared credentials |
| **Recording access** | Access to call recordings is a privileged, audited action with a stated reason — treated like access to medical records |
| **Secrets** | Centrally managed, rotated, never in source or logs; per-tenant channel credentials encrypted with per-tenant keys |
| **Network** | Private networking between planes; the SIP edge is the only broadly exposed surface and is hardened accordingly |
| **Toll fraud** | An exposed SIP endpoint attracts attack within hours. Rate limiting, geographic restrictions, anomaly detection on call patterns, and hard spend caps per tenant and globally |
| **Prompt injection** | Retrieved content and user messages are data, never instructions; tool permissions scoped per tenant; adversarial tests in CI |
| **Dependency and model licence audit** | Quarterly, and on every model checkpoint change — several attractive TTS models are non-commercial and licences change between releases ([Doc 06 §3.2](06-voice-ai-and-ml.md)) |
| **Penetration testing** | Before Phase 2 launch and annually; tenant-isolation bypass is the highest-priority test case |

---

## 11. Release engineering

### 11.1 Pipeline

Every change passes: automated tests → **the conversation replay suite** → security and licence checks → data-residency policy check → staging deploy → canary → progressive rollout.

**The replay suite is the distinguishing gate.** A held-out set of real, consented, anonymised conversations is replayed against every model, prompt, retrieval or configuration change. A change that improves an offline benchmark but regresses the replay suite does not ship.

### 11.2 Model and prompt changes are releases

Prompts, model versions, retrieval configuration and knowledge indexes are **versioned, reviewed and rolled out progressively**, exactly like code. The failure mode this prevents is well known: a prompt edited directly in production on a Friday, quality degrading over the weekend, and nobody able to say what changed.

### 11.3 Per-tenant feature flags

New models, prompts and features roll out per tenant. Design partners opt into the newest; risk-averse tenants stay on the stable path. This is also the mechanism for safe model migration during the self-hosting transition.

### 11.4 Rollback

Every deploy is revertible in minutes, including model and prompt versions. Because a bad model version is experienced by customers as "the AI got stupid," rollback speed is a customer-facing property.

---

## 12. Team and on-call

### 12.1 The realistic shape

| Phase | Engineering | On-call |
|---|---|---|
| **0** | 1–2 people | Founder, best effort |
| **1** | 2–4 | Founder + first engineer, business hours with best-effort nights |
| **2** | 5–8 | Formal rotation, business hours + escalation |
| **3–4** | 10–15 | 24/7 rotation once call volume justifies it |

**Honest note:** running a real-time voice platform 24/7 with a small team is genuinely hard. Two mitigations matter more than heroics:

1. **Automated degradation** (§8.2) means most failures degrade gracefully rather than paging a human at 3am.
2. **CPaaS in early phases** deliberately outsources the hardest 24/7 problem — carrier-grade telephony availability — to companies that already solve it. This is a strong argument for delaying self-hosted telephony beyond what pure cost analysis would suggest.

### 12.2 Roles

| Role | Owns |
|---|---|
| **Platform / backend engineer** | Session management, orchestration, API, integrations |
| **Voice / telephony engineer** | Media path, SIP, codecs, latency, provider integrations |
| **ML engineer** | Ijwi and Ubwenge: models, fine-tuning, evaluation, the Kinyarwanda programme |
| **Data / annotation lead** | The Kinyarwanda corpus, consent pipeline, transcription QA |
| **Frontend engineer** | Subiza Studio |
| **SRE / infrastructure** | Deployment, observability, cost, security, incident response |
| **Data protection owner** | Compliance, consent registry, breach response |

In Phase 0–1 one or two people hold several of these. The list matters because it names what must be covered, not how many people cover it.

---

## 13. Environmental and practical constraints

Two Rwanda-specific realities that affect operations and are easy to overlook from a spreadsheet:

- **Power and connectivity resilience.** Kigali colocation and any on-premise capacity must assume grid variability. This is a real consideration in the Phase 4 edge decision, and a reason to prefer well-provisioned carrier-neutral facilities over cheaper alternatives.
- **Talent.** Voice-AI and telephony engineering skills are scarce everywhere and scarcer in Kigali. This argues for: buying the hardest infrastructure early (CPaaS), investing in training locally through hubs and universities, and designing systems that a small team can actually operate. **The architecture must be sized to the team that will run it, not to the team the plan wishes existed.**

---

*Next: [11 — Business Model & Economics](11-business-model-and-economics.md)*
